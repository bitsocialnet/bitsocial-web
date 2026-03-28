import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface Node {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  basePosition: THREE.Vector3;
}

type MeshThemeRefs = {
  pointsMat: THREE.ShaderMaterial;
  linesMat: THREE.ShaderMaterial;
};

const MOBILE_BREAKPOINT = 768;
const LOW_END_CONCURRENCY = 4;
const CONNECTION_SEARCH_PADDING = 0.75;
const MESH_NODE_MIN_VIEWPORT_WIDTH = 768;
const MESH_NODE_MAX_VIEWPORT_WIDTH = 1920;
const MESH_NODE_MIN_SIZE = 0.028;
const MESH_NODE_MAX_SIZE = 0.05;

function getIsMobileLayout(width: number) {
  const hardwareConcurrency =
    typeof navigator === "undefined" ? LOW_END_CONCURRENCY : navigator.hardwareConcurrency || 4;
  return width < MOBILE_BREAKPOINT || hardwareConcurrency < LOW_END_CONCURRENCY;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getMeshNodeSize(width: number, isMobileLayout: boolean) {
  if (isMobileLayout) return 0.03;

  const progress = clamp(
    (width - MESH_NODE_MIN_VIEWPORT_WIDTH) /
      (MESH_NODE_MAX_VIEWPORT_WIDTH - MESH_NODE_MIN_VIEWPORT_WIDTH),
    0,
    1,
  );

  return lerp(MESH_NODE_MAX_SIZE, MESH_NODE_MIN_SIZE, progress);
}

function getViewportResizeKey(container: HTMLDivElement) {
  const viewport = window.visualViewport;
  return [
    container.clientWidth,
    container.clientHeight,
    window.devicePixelRatio,
    viewport?.width ?? 0,
    viewport?.height ?? 0,
    viewport?.scale ?? 1,
  ].join(":");
}

export default function MeshGraphic({ onInitError }: { onInitError?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return getIsMobileLayout(window.innerWidth);
  });
  const { resolvedTheme } = useTheme();
  const themeRefs = useRef<MeshThemeRefs | null>(null);
  const containerHeight = isMobile ? "min(55vh, 30rem)" : "clamp(35rem, calc(58rem - 14vw), 44rem)";
  const topOffset = isMobile ? "-8vh" : "clamp(-4.5rem, calc(-1rem - 3vw), -2.5rem)";

  useEffect(() => {
    if (!themeRefs.current) return;
    const isDark =
      resolvedTheme === "dark" ||
      (!resolvedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const color = new THREE.Color(isDark ? 0xffffff : 0x4b5563);
    themeRefs.current.pointsMat.uniforms.color.value.copy(color);
    themeRefs.current.pointsMat.uniforms.alphaMultiplier.value = isDark ? 0.35 : 0.2;
    themeRefs.current.linesMat.uniforms.color.value.copy(color);
    themeRefs.current.linesMat.uniforms.alphaMultiplier.value = isDark ? 0.9 : 0.7;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const sceneIsMobile = getIsMobileLayout(container.clientWidth || window.innerWidth);

    if (sceneIsMobile !== isMobile) {
      setIsMobile(sceneIsMobile);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    // Shift camera up to create empty space at top of canvas (nodes won't be cut off)
    // Mobile needs more offset to prevent clipping, desktop needs less to show more mesh
    const cameraYOffset = isMobile ? 4 : 0;
    camera.position.set(0, cameraYOffset, 30);
    camera.lookAt(0, cameraYOffset, 0);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? "low-power" : "default",
      });
    } catch {
      onInitError?.();
      return;
    }
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    const maxDpr = isMobile ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));

    // Mesh color - adapts to theme
    // Light mode: darker color for visibility, Dark mode: brighter color
    const isDark =
      resolvedTheme === "dark" ||
      (!resolvedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const meshColorHex = isDark ? 0xffffff : 0x4b5563; // white for dark mode (brighter), gray-600 for light
    const meshColor = new THREE.Color(meshColorHex);

    // Brightness multipliers - higher in dark mode
    const nodeAlphaMultiplier = isDark ? 0.35 : 0.2;
    const lineAlphaMultiplier = isDark ? 0.9 : 0.7; // Increased for better contrast

    // Calculate visible frustum dimensions at z=0 (where nodes are placed)
    const fov = 50;
    const cameraZ = 30;
    const visibleHeight = 2 * Math.tan((fov * Math.PI) / 360) * cameraZ;
    const aspectRatio = container.clientWidth / container.clientHeight;
    const visibleWidth = visibleHeight * aspectRatio;

    // Node parameters - smaller and fewer on mobile
    const nodeCount = isMobile ? 80 : 200;
    const connectionDistance = isMobile ? 6 : 5; // Slightly larger on mobile to maintain connectivity with fewer nodes
    const connectionDistanceSq = connectionDistance * connectionDistance;
    const candidateConnectionDistance = connectionDistance + CONNECTION_SEARCH_PADDING;
    const candidateConnectionDistanceSq = candidateConnectionDistance * candidateConnectionDistance;
    const nodeSize = getMeshNodeSize(container.clientWidth, isMobile);

    // Create nodes evenly distributed across entire U-shape area
    const nodes: Node[] = [];

    // U-shape parameters - dynamically extend to screen edges
    const uWidth = visibleWidth + 8; // Extend past visible edges
    const uDepth = 8; // Depth variation for parallax
    const bottomY = -10; // Bottom of the U (behind planet)
    const topY = isMobile ? 15 : 10; // Extended upward for more height on mobile

    // Distribute nodes uniformly across entire space using grid-like distribution with jitter
    const gridCols = Math.ceil(Math.sqrt(nodeCount * (uWidth / (topY - bottomY))));
    const gridRows = Math.ceil(nodeCount / gridCols);

    for (let i = 0; i < nodeCount; i++) {
      let x: number, y: number, z: number;

      // Use grid-based distribution for even spacing
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);

      // Base grid position
      const baseX = -uWidth / 2 + (col / (gridCols - 1 || 1)) * uWidth;
      const baseY = bottomY + (row / (gridRows - 1 || 1)) * (topY - bottomY);

      // Add jitter to avoid perfect grid
      const jitterX = (Math.random() - 0.5) * (uWidth / gridCols) * 0.8;
      const jitterY = (Math.random() - 0.5) * ((topY - bottomY) / gridRows) * 0.8;

      x = baseX + jitterX;
      y = baseY + jitterY;

      // Add some depth variation
      z = -3 + (Math.random() - 0.5) * uDepth;

      // For nodes near bottom, push them back further (behind planet)
      if (y < bottomY + 2) {
        z = -5 + (Math.random() - 0.5) * 4;
      }

      const position = new THREE.Vector3(x, y, z);
      nodes.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
        ),
        basePosition: position.clone(),
      });
    }

    // Create point geometry for nodes
    const pointsGeometry = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      pointPositions[i * 3] = nodes[i].position.x;
      pointPositions[i * 3 + 1] = nodes[i].position.y;
      pointPositions[i * 3 + 2] = nodes[i].position.z;
    }

    const pointPositionAttribute = new THREE.BufferAttribute(pointPositions, 3);
    pointPositionAttribute.setUsage(THREE.DynamicDrawUsage);
    pointsGeometry.setAttribute("position", pointPositionAttribute);

    // Custom shader for hollow circle nodes with center dot
    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: meshColor },
        size: { value: nodeSize * 100 },
        alphaMultiplier: { value: nodeAlphaMultiplier },
      },
      vertexShader: `
        uniform float size;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float alphaMultiplier;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          float edge = fwidth(dist) * 1.5; // Adaptive AA
          
          // Center dot (filled)
          float dotRadius = 0.12; // Small radius for center dot
          float dotAlpha = 1.0 - smoothstep(dotRadius - edge, dotRadius, dist);
          
          // Hollow ring
          float outerRadius = 0.5;
          float ringWidth = 0.08; // Thin ring
          float innerRadius = outerRadius - ringWidth;
          float outerAlpha = 1.0 - smoothstep(outerRadius - edge, outerRadius, dist);
          float innerAlpha = smoothstep(innerRadius - edge, innerRadius, dist);
          float ringAlpha = outerAlpha * innerAlpha;
          
          // Combine dot and ring
          float alpha = max(dotAlpha, ringAlpha);
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(color, alpha * alphaMultiplier);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const candidatePairs: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const nodeA = nodes[i].basePosition;
      for (let j = i + 1; j < nodeCount; j++) {
        const nodeB = nodes[j].basePosition;
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dz = nodeA.z - nodeB.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < candidateConnectionDistanceSq) {
          candidatePairs.push(i, j);
        }
      }
    }

    // Create lines geometry for connections
    const maxConnections = candidatePairs.length / 2;
    const linePositions = new Float32Array(maxConnections * 6); // 2 points per line, 3 coords each
    const lineAlphas = new Float32Array(maxConnections * 2);

    const linesGeometry = new THREE.BufferGeometry();
    const linePositionAttribute = new THREE.BufferAttribute(linePositions, 3);
    const lineAlphaAttribute = new THREE.BufferAttribute(lineAlphas, 1);
    linePositionAttribute.setUsage(THREE.DynamicDrawUsage);
    lineAlphaAttribute.setUsage(THREE.DynamicDrawUsage);
    linesGeometry.setAttribute("position", linePositionAttribute);
    linesGeometry.setAttribute("alpha", lineAlphaAttribute);
    linesGeometry.setDrawRange(0, 0);

    // Custom shader for fading lines
    const linesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: meshColor },
        alphaMultiplier: { value: lineAlphaMultiplier },
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float alphaMultiplier;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(color, vAlpha * alphaMultiplier);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);

    themeRefs.current = { pointsMat: pointsMaterial, linesMat: linesMaterial };

    // Animation — only schedule rAF while visible (see planet-graphic).
    let animationId: number | null = null;
    let time = 0;
    let pageVisible = document.visibilityState === "visible";
    let inViewport = true;
    let shouldAnimate = false;

    const updateConnections = () => {
      let lineIndex = 0;
      const positions = linesGeometry.attributes.position.array as Float32Array;
      const alphas = linesGeometry.attributes.alpha.array as Float32Array;

      for (let pairIndex = 0; pairIndex < candidatePairs.length; pairIndex += 2) {
        const nodeA = nodes[candidatePairs[pairIndex]];
        const nodeB = nodes[candidatePairs[pairIndex + 1]];
        const dx = nodeA.position.x - nodeB.position.x;
        const dy = nodeA.position.y - nodeB.position.y;
        const dz = nodeA.position.z - nodeB.position.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq >= connectionDistanceSq) continue;

        const idx = lineIndex * 6;
        const alphaIdx = lineIndex * 2;

        positions[idx] = nodeA.position.x;
        positions[idx + 1] = nodeA.position.y;
        positions[idx + 2] = nodeA.position.z;
        positions[idx + 3] = nodeB.position.x;
        positions[idx + 4] = nodeB.position.y;
        positions[idx + 5] = nodeB.position.z;

        const alpha = 1 - Math.sqrt(distSq) / connectionDistance;
        alphas[alphaIdx] = alpha;
        alphas[alphaIdx + 1] = alpha;

        lineIndex++;
      }

      linesGeometry.setDrawRange(0, lineIndex * 2);
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.attributes.alpha.needsUpdate = true;
    };

    const stopRenderLoop = () => {
      if (animationId != null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const tick = () => {
      animationId = null;
      if (!shouldAnimate) return;

      if (getViewportResizeKey(container) !== lastResizeKey) {
        handleResize();
      }

      time += 0.005;

      // Update node positions with subtle floating motion
      const positionAttr = pointsGeometry.attributes.position;
      const pointPosArray = positionAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];

        // Gentle floating animation
        const offsetX = Math.sin(time + i * 0.5) * 0.15;
        const offsetY = Math.cos(time * 0.8 + i * 0.3) * 0.15;
        const offsetZ = Math.sin(time * 0.6 + i * 0.7) * 0.1;

        node.position.x = node.basePosition.x + offsetX;
        node.position.y = node.basePosition.y + offsetY;
        node.position.z = node.basePosition.z + offsetZ;

        pointPosArray[i * 3] = node.position.x;
        pointPosArray[i * 3 + 1] = node.position.y;
        pointPosArray[i * 3 + 2] = node.position.z;
      }

      positionAttr.needsUpdate = true;
      updateConnections();

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(tick);
    };

    const startRenderLoop = () => {
      if (animationId != null || !shouldAnimate) return;
      animationId = requestAnimationFrame(tick);
    };

    const syncAnimationState = () => {
      const nextShouldAnimate = pageVisible && inViewport;
      if (shouldAnimate === nextShouldAnimate) return;

      shouldAnimate = nextShouldAnimate;
      if (shouldAnimate) startRenderLoop();
      else stopRenderLoop();
    };

    const handleVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      syncAnimationState();
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? false;
        syncAnimationState();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    syncAnimationState();

    let resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastResizeKey = getViewportResizeKey(container);
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      lastResizeKey = getViewportResizeKey(container);
      const nextIsMobile = getIsMobileLayout(width);

      if (nextIsMobile !== isMobile) {
        setIsMobile(nextIsMobile);
        return;
      }

      const nextNodeSize = getMeshNodeSize(width, nextIsMobile);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const maxDprResize = nextIsMobile ? 1.5 : 2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDprResize));
      renderer.setSize(width, height, false);
      pointsMaterial.uniforms.size.value = nextNodeSize * 100;
    };

    const scheduleResize = () => {
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      resizeTimeoutId = setTimeout(handleResize, 250);
    };

    const scheduleResizeIfViewportChanged = () => {
      if (!container) return;
      const nextResizeKey = getViewportResizeKey(container);
      if (nextResizeKey === lastResizeKey) return;
      scheduleResize();
    };

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", scheduleResize, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleResizeIfViewportChanged, {
      passive: true,
    });
    window.visualViewport?.addEventListener("scroll", scheduleResizeIfViewportChanged, {
      passive: true,
    });

    return () => {
      themeRefs.current = null;
      stopRenderLoop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      intersectionObserver.disconnect();
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleResize);
      window.visualViewport?.removeEventListener("resize", scheduleResizeIfViewportChanged);
      window.visualViewport?.removeEventListener("scroll", scheduleResizeIfViewportChanged);

      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme changes handled by separate effect
  }, [isMobile, onInitError]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 pointer-events-none overflow-hidden overscroll-none"
      style={{ height: containerHeight, top: topOffset }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Bottom fade gradient overlay - tall and strong to dissolve into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 md:h-80 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background)) 25%, hsl(var(--background) / 0.9) 40%, hsl(var(--background) / 0.6) 60%, hsl(var(--background) / 0.2) 80%, transparent 100%)",
        }}
      />
    </div>
  );
}
