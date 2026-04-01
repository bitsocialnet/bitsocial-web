import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import {
  getHeroGraphicMaxPixelRatio,
  getHeroGraphicShouldAntialias,
  getIsMobileHeroGraphicLayout,
} from "@/lib/hero-graphic-performance";
import { getPlanetRingRotationDelaySeconds } from "@/lib/hero-intro-timing";
import { getHeroGraphicViewportProgress } from "@/lib/hero-graphic-layout";

const PLANET_MIN_FOV = 62;
const PLANET_MAX_FOV = 45;
const PLANET_MIN_CAMERA_Z = 21.5;
const PLANET_MAX_CAMERA_Z = 17;

// Create a 3D ring with rectangular cross-section (like the logo)
function createMetallicRing(
  radius: number,
  tubeWidth: number,
  tubeHeight: number,
  segments: number,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // Create ring by extruding a rectangle along a circular path
  // Use exactly `segments` slices and wrap indices to avoid a visible seam.
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;

    // Center of the ring at this angle
    const cx = Math.cos(angle) * radius;
    const cz = Math.sin(angle) * radius;

    // Radial direction (pointing outward from center)
    const rx = Math.cos(angle);
    const rz = Math.sin(angle);

    // Four corners of the rectangular cross-section
    // Inner-bottom, outer-bottom, outer-top, inner-top
    const halfW = tubeWidth / 2;
    const halfH = tubeHeight / 2;

    // Positions for the 4 corners at this segment
    const innerBottom = [cx - rx * halfW, -halfH, cz - rz * halfW];
    const outerBottom = [cx + rx * halfW, -halfH, cz + rz * halfW];
    const outerTop = [cx + rx * halfW, halfH, cz + rz * halfW];
    const innerTop = [cx - rx * halfW, halfH, cz - rz * halfW];

    positions.push(...innerBottom, ...outerBottom, ...outerTop, ...innerTop);

    // Normals for each face
    // Bottom face normals (pointing down)
    // Top face normals (pointing up)
    // Inner face normals (pointing inward)
    // Outer face normals (pointing outward)
    normals.push(
      -rx,
      -0.5,
      -rz, // inner-bottom: blend of inner and bottom
      rx,
      -0.5,
      rz, // outer-bottom: blend of outer and bottom
      rx,
      0.5,
      rz, // outer-top: blend of outer and top
      -rx,
      0.5,
      -rz, // inner-top: blend of inner and top
    );
  }

  // Create faces connecting each segment to the next
  for (let i = 0; i < segments; i++) {
    const curr = i * 4;
    const next = ((i + 1) % segments) * 4;

    // Bottom face (innerBottom -> outerBottom)
    indices.push(curr + 0, next + 0, next + 1);
    indices.push(curr + 0, next + 1, curr + 1);

    // Outer face (outerBottom -> outerTop)
    indices.push(curr + 1, next + 1, next + 2);
    indices.push(curr + 1, next + 2, curr + 2);

    // Top face (outerTop -> innerTop)
    indices.push(curr + 2, next + 2, next + 3);
    indices.push(curr + 2, next + 3, curr + 3);

    // Inner face (innerTop -> innerBottom)
    indices.push(curr + 3, next + 3, next + 0);
    indices.push(curr + 3, next + 0, curr + 0);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function resolveIsDark(theme: string | undefined): boolean {
  return (
    theme === "dark" ||
    (!theme &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

function applyPlanetTheme(
  refs: NonNullable<ReturnType<typeof usePlanetThemeRefs>["current"]>,
  isDark: boolean,
) {
  const s = refs;
  s.sphereMat.uniforms.topColor.value.set(isDark ? 0x2a4a80 : 0x1e4fd0);
  s.sphereMat.uniforms.bottomColor.value.set(isDark ? 0x0f1f30 : 0x0a2440);
  s.sphereMat.uniforms.glowColor.value.set(isDark ? 0x3a5a90 : 0x2d6ae0);
  s.sphereMat.uniforms.fresnelIntensity.value = isDark ? 0.2 : 0.3;

  const ringColor = isDark ? 0xa8aeb8 : 0xc0c0c0;
  for (const mat of [s.ringMat, s.ring2Mat]) {
    mat.color.set(ringColor);
    mat.metalness = isDark ? 0.9 : 0.95;
    mat.roughness = isDark ? 0.18 : 0.14;
    mat.envMapIntensity = isDark ? 0.7 : 0.9;
    mat.clearcoat = isDark ? 0.5 : 0.6;
    mat.clearcoatRoughness = isDark ? 0.1 : 0.06;
    mat.needsUpdate = true;
  }

  s.edgeLightL.intensity = isDark ? 0.65 : 0.75;
  s.edgeLightR.intensity = isDark ? 0.65 : 0.75;
  s.topLight.color.set(isDark ? 0x5a6a80 : 0x4a90d9);
  s.topLight.intensity = isDark ? 0.5 : 0.7;

  const ctx = s.envCanvas.getContext("2d");
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, isDark ? "#6a7a8c" : "#778899");
    g.addColorStop(0.4, isDark ? "#9aabbc" : "#ffffff");
    g.addColorStop(0.6, isDark ? "#9aabbc" : "#ffffff");
    g.addColorStop(1, isDark ? "#2c3d52" : "#334455");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    s.envTex.needsUpdate = true;
  }
}

type PlanetThemeRefs = {
  sphereMat: THREE.ShaderMaterial;
  ringMat: THREE.MeshPhysicalMaterial;
  ring2Mat: THREE.MeshPhysicalMaterial;
  edgeLightL: THREE.DirectionalLight;
  edgeLightR: THREE.DirectionalLight;
  topLight: THREE.DirectionalLight;
  envTex: THREE.CanvasTexture;
  envCanvas: HTMLCanvasElement;
};

function usePlanetThemeRefs() {
  return useRef<PlanetThemeRefs | null>(null);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getIsMobileLayout(width: number) {
  return getIsMobileHeroGraphicLayout(width);
}

function getPlanetCameraLayout(width: number) {
  const progress = getHeroGraphicViewportProgress(width);

  return {
    fov: lerp(PLANET_MIN_FOV, PLANET_MAX_FOV, progress),
    cameraZ: lerp(PLANET_MIN_CAMERA_Z, PLANET_MAX_CAMERA_Z, progress),
  };
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

export default function PlanetGraphic({ onInitError }: { onInitError?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return getIsMobileLayout(window.innerWidth);
  });
  const { resolvedTheme } = useTheme();
  const themeRefs = usePlanetThemeRefs();
  const containerHeight = isMobile
    ? "clamp(22rem, 42vh, 28rem)"
    : "clamp(34rem, calc(46rem - 6vw), 40rem)";
  const translateY = isMobile
    ? "translateY(clamp(-4.5rem, calc(-1rem - 5vh), -3rem))"
    : "translateY(clamp(-4rem, calc(-5rem + 2vw), -2.5rem))";

  // Update Three.js materials in-place when theme changes (no scene rebuild)
  useEffect(() => {
    if (!themeRefs.current) return;
    applyPlanetTheme(themeRefs.current, resolveIsDark(resolvedTheme));
  }, [resolvedTheme, themeRefs]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const resizeDebounceMs = 140;

    const isDark = resolveIsDark(resolvedTheme);

    // Scene setup
    const scene = new THREE.Scene();
    const initialIsMobile = getIsMobileLayout(container.clientWidth);
    const initialCameraLayout = getPlanetCameraLayout(container.clientWidth);
    setIsMobile((prev) => (prev === initialIsMobile ? prev : initialIsMobile));
    const camera = new THREE.PerspectiveCamera(
      initialCameraLayout.fov,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 1, initialCameraLayout.cameraZ);
    camera.lookAt(0, -2, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: getHeroGraphicShouldAntialias(initialIsMobile),
        premultipliedAlpha: false,
        powerPreference: initialIsMobile ? "low-power" : "default",
      });
    } catch {
      onInitError?.();
      return;
    }
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, getHeroGraphicMaxPixelRatio(initialIsMobile)),
    );
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 8, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8899aa, 0.5);
    fillLight.position.set(-8, 2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    const edgeLightColor = 0xf5f7ff;
    const edgeLightLeft = new THREE.DirectionalLight(edgeLightColor, isDark ? 0.65 : 0.75);
    edgeLightLeft.position.set(-12, 0, 6);
    scene.add(edgeLightLeft);

    const edgeLightRight = new THREE.DirectionalLight(edgeLightColor, isDark ? 0.65 : 0.75);
    edgeLightRight.position.set(12, 1, 6);
    scene.add(edgeLightRight);

    const topLight = new THREE.DirectionalLight(isDark ? 0x5a6a80 : 0x4a90d9, isDark ? 0.5 : 0.7);
    topLight.position.set(0, 15, 5);
    scene.add(topLight);

    const sphereRadius = 7;
    const sphereY = -5;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 128, 128);

    const sphereMaterial = new THREE.ShaderMaterial({
      transparent: false,
      depthWrite: true,
      uniforms: {
        topColor: { value: new THREE.Color(isDark ? 0x2a4a80 : 0x1e4fd0) },
        bottomColor: { value: new THREE.Color(isDark ? 0x0f1f30 : 0x0a2440) },
        glowColor: { value: new THREE.Color(isDark ? 0x3a5a90 : 0x2d6ae0) },
        fresnelIntensity: { value: isDark ? 0.2 : 0.3 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 glowColor;
        uniform float fresnelIntensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          float gradientFactor = (vPosition.y + 7.0) / 14.0;
          gradientFactor = clamp(gradientFactor, 0.0, 1.0);
          
          vec3 baseColor = mix(bottomColor, topColor, gradientFactor);
          
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.0);
          
          vec3 finalColor = mix(baseColor, glowColor, fresnel * fresnelIntensity);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, sphereY, 0);
    scene.add(sphere);

    const ringRadius = 8.2;
    const ringTubeWidthMobile = 0.5;
    const ringTubeWidthDesktop = 0.3;
    const getRingTubeWidth = (mobile: boolean) =>
      mobile ? ringTubeWidthMobile : ringTubeWidthDesktop;
    const tubeHeight = 0.2;

    let ringLayoutIsMobile = initialIsMobile;
    let tubeWidth = getRingTubeWidth(initialIsMobile);

    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0xa8aeb8 : 0xc0c0c0,
      metalness: isDark ? 0.9 : 0.95,
      roughness: isDark ? 0.18 : 0.14,
      envMapIntensity: isDark ? 0.7 : 0.9,
      clearcoat: isDark ? 0.5 : 0.6,
      clearcoatRoughness: isDark ? 0.1 : 0.06,
      depthWrite: true,
      side: THREE.DoubleSide,
    });

    const envMapSize = 64;
    const envMapCanvas = document.createElement("canvas");
    envMapCanvas.width = envMapSize;
    envMapCanvas.height = envMapSize;
    const envCtx = envMapCanvas.getContext("2d");
    if (!envCtx) {
      console.error("Failed to get 2D context from canvas for environment map generation");
      return;
    }
    const gradient = envCtx.createLinearGradient(0, 0, 0, envMapSize);
    gradient.addColorStop(0, isDark ? "#6a7a8c" : "#778899");
    gradient.addColorStop(0.4, isDark ? "#9aabbc" : "#ffffff");
    gradient.addColorStop(0.6, isDark ? "#9aabbc" : "#ffffff");
    gradient.addColorStop(1, isDark ? "#2c3d52" : "#334455");
    envCtx.fillStyle = gradient;
    envCtx.fillRect(0, 0, envMapSize, envMapSize);
    const envTexture = new THREE.CanvasTexture(envMapCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    ringMaterial.envMap = envTexture;

    // ============================================
    // RING CONFIGURATION
    // ============================================
    // Adjust these values to change ring positions and tilts
    //
    // Rotation angles (in radians):
    // - RotX: Tilt forward/backward (0 = horizontal, PI/2 = vertical)
    // - RotY: Rotate around Y-axis (affects starting angle)
    // - RotZ: Sideways tilt (roll)
    //
    // Position offsets (relative to sphere center):
    // - X: left (-) / right (+)
    // - Y: down (-) / up (+)
    // - Z: back (-) / forward (+)

    // Ring 1 Configuration (upper arc - tilted forward over the planet)
    const ring1RotX = Math.PI * 0.79; // Forward/backward tilt
    const ring1RotY = -0.3; // Rotation around Y-axis (affects start position)
    const ring1RotZ = 0.15; // Sideways tilt
    const ring1PosX = -0.5; // Horizontal offset
    const ring1PosY = -0.5; // Vertical offset (0 = same as sphere center)
    const ring1PosZ = 1; // Depth offset

    // Ring 2 Configuration (diagonal sweep - upper right to lower left)
    const ring2RotX = Math.PI * 0.77; // Forward/backward tilt (more vertical)
    const ring2RotY = -0.35; // Rotation around Y-axis (affects start position)
    const ring2RotZ = -1.3; // Sideways tilt (leaning right)
    const ring2PosX = 0.1; // Horizontal offset
    const ring2PosY = 0.5; // Vertical offset (0 = same as sphere center)
    const ring2PosZ = 1; // Depth offset

    // ============================================

    let ring1Geometry = createMetallicRing(ringRadius, tubeWidth, tubeHeight, 128);
    const ring1 = new THREE.Mesh(ring1Geometry, ringMaterial);
    ring1.rotation.set(ring1RotX, ring1RotY, ring1RotZ);
    ring1.position.set(ring1PosX, sphereY + ring1PosY, ring1PosZ);
    scene.add(ring1);

    let ring2Geometry = createMetallicRing(ringRadius, tubeWidth, tubeHeight, 128);
    const ring2Material = ringMaterial.clone();
    ring2Material.envMap = envTexture;
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);

    themeRefs.current = {
      sphereMat: sphereMaterial,
      ringMat: ringMaterial,
      ring2Mat: ring2Material,
      edgeLightL: edgeLightLeft,
      edgeLightR: edgeLightRight,
      topLight,
      envTex: envTexture,
      envCanvas: envMapCanvas,
    };
    ring2.rotation.set(ring2RotX, ring2RotY, ring2RotZ);
    ring2.position.set(ring2PosX, sphereY + ring2PosY, ring2PosZ);
    scene.add(ring2);

    const ringRotationDuration = 7;
    const ringRotationDelay = getPlanetRingRotationDelaySeconds();
    const ringRotationPause = 5;
    const ringRotationEase = "sine.inOut";
    const ringRotationAmount = Math.PI * 2;
    const ring1BaseQuaternion = ring1.quaternion.clone();
    const ring2BaseQuaternion = ring2.quaternion.clone();
    const ring1RotationQuaternion = new THREE.Quaternion();
    const ring2RotationQuaternion = new THREE.Quaternion();

    const getRandomRotationAxis = () => {
      const axis = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );
      if (axis.lengthSq() < 0.0001) {
        axis.set(0, 1, 0);
      }
      return axis.normalize();
    };

    const createRingRotationTween = (
      ring: THREE.Mesh,
      baseQuaternion: THREE.Quaternion,
      rotationQuaternion: THREE.Quaternion,
    ) => {
      const progress = { value: 0 };
      let rotationAxis = getRandomRotationAxis();
      return gsap.to(progress, {
        value: 1,
        duration: ringRotationDuration,
        ease: ringRotationEase,
        delay: ringRotationDelay,
        repeat: -1,
        repeatDelay: ringRotationPause,
        onStart: () => {
          rotationAxis = getRandomRotationAxis();
        },
        onRepeat: () => {
          rotationAxis = getRandomRotationAxis();
          ring.quaternion.copy(baseQuaternion);
        },
        onUpdate: () => {
          rotationQuaternion.setFromAxisAngle(rotationAxis, progress.value * ringRotationAmount);
          ring.quaternion.copy(baseQuaternion).premultiply(rotationQuaternion);
        },
      });
    };

    const ring1RotationTween = createRingRotationTween(
      ring1,
      ring1BaseQuaternion,
      ring1RotationQuaternion,
    );
    const ring2RotationTween = createRingRotationTween(
      ring2,
      ring2BaseQuaternion,
      ring2RotationQuaternion,
    );

    // Animation — only schedule rAF while visible; avoid idle 60–120Hz wakeups (battery/heat).
    let animationId: number | null = null;
    let pageVisible = document.visibilityState === "visible";
    let inViewport = true;
    let shouldAnimate = false;

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

      // Very slow rotation of the sphere
      sphere.rotation.y += 0.0005;

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
      ring1RotationTween.paused(!shouldAnimate);
      ring2RotationTween.paused(!shouldAnimate);
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

    // Handle resize (debounced to avoid excessive reflows)
    let resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastResizeKey = getViewportResizeKey(container);
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      lastResizeKey = getViewportResizeKey(container);
      const isMobileNow = getIsMobileLayout(width);
      const nextCameraLayout = getPlanetCameraLayout(width);

      setIsMobile((prev) => (prev === isMobileNow ? prev : isMobileNow));
      camera.fov = nextCameraLayout.fov;
      camera.aspect = width / height;
      camera.position.set(0, 1, nextCameraLayout.cameraZ);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, getHeroGraphicMaxPixelRatio(isMobileNow)),
      );
      renderer.setSize(width, height, false);

      // Ring cross-section matches mobile vs desktop layout; rebuild only when crossing breakpoint.
      if (isMobileNow !== ringLayoutIsMobile) {
        ringLayoutIsMobile = isMobileNow;
        tubeWidth = getRingTubeWidth(isMobileNow);
        const newGeo1 = createMetallicRing(ringRadius, tubeWidth, tubeHeight, 128);
        const newGeo2 = createMetallicRing(ringRadius, tubeWidth, tubeHeight, 128);
        ring1Geometry.dispose();
        ring2Geometry.dispose();
        ring1Geometry = newGeo1;
        ring2Geometry = newGeo2;
        ring1.geometry = ring1Geometry;
        ring2.geometry = ring2Geometry;
      }
    };

    const scheduleResize = () => {
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      resizeTimeoutId = setTimeout(handleResize, resizeDebounceMs);
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
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      window.removeEventListener("resize", scheduleResize);
      window.visualViewport?.removeEventListener("resize", scheduleResizeIfViewportChanged);
      window.visualViewport?.removeEventListener("scroll", scheduleResizeIfViewportChanged);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      ring1RotationTween.kill();
      ring2RotationTween.kill();
      scene.remove(ring1);
      scene.remove(ring2);
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      ring1Geometry.dispose();
      ring2Geometry.dispose();
      ringMaterial.dispose();
      ring2Material.dispose();
      envTexture.dispose();

      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme changes handled by separate effect
  }, [onInitError]);

  return (
    <div
      ref={containerRef}
      className="relative pointer-events-none w-full overflow-hidden overscroll-none"
      style={{
        height: containerHeight,
        transform: translateY,
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Bottom fade gradient overlay - tall and strong to dissolve into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 md:h-[clamp(10rem,calc(15rem-4vw),14rem)] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background)) 25%, hsl(var(--background) / 0.9) 40%, hsl(var(--background) / 0.6) 60%, hsl(var(--background) / 0.2) 80%, transparent 100%)",
        }}
      />
    </div>
  );
}
