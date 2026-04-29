import { memo, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useGraphicsMode } from "@/lib/graphics-mode";

interface Point {
  x: number;
  y: number;
}

interface EdgeData {
  a: number;
  b: number;
  mx: number;
  my: number;
  hash: number;
}

const SPACING = 85;
const JITTER_FACTOR = 0.42;
const EDGE_BASE_WIDTH = 0.5;
const EDGE_GLOW_WIDTH = 1.5;
const DOT_RADIUS = 1.2;
const STATIC_POLYGON_MESH_FALLBACK_SOURCES = {
  light: "/polygon-mesh-fallback-light-vector.svg",
  dark: "/polygon-mesh-fallback-dark-vector.svg",
};

const BLUE_R = 37;
const BLUE_G = 99;
const BLUE_B = 235;
const BLUE_ON_LIGHT_R = 56;
const BLUE_ON_LIGHT_G = 88;
const BLUE_ON_LIGHT_B = 154;
const BLUE_ON_DARK_R = 94;
const BLUE_ON_DARK_G = 164;
const BLUE_ON_DARK_B = 255;

const MIN_SPEED = 2;
const MAX_SPEED = 60;
const SWEEP_SPEED = 0.08;
const SWEEP_THRESHOLD = 0.66;
const SWEEP_SPATIAL_X = 0.0068;
const SWEEP_SPATIAL_Y = 0.0051;
const SWEEP_PHASE_HASH_MIX = 0.38;

/**
 * Dot and edge stroke scale for ~1x displays (CSS px read larger physically than on Retina).
 * Grid density stays at SPACING; only stroke/dot radii use this. Blends toward the previous
 * aggressive 0.5× so 1× screens sit between “too large” (1×) and “too small” (0.5×), ~0.75× at DPR 1.
 */
function meshStrokeScaleFromDpr(dpr: number): number {
  const t = Math.min(dpr, 2) / 2;
  return 0.5 + 0.5 * t;
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function meshNoise(x: number, y: number, seed: number, salt: number): number {
  return fract(
    Math.sin((x + salt * 17.13) * 127.1 + (y - salt * 11.73) * 311.7 + seed * 0.101) * 43758.5453,
  );
}

function generateMesh(width: number, height: number, seed: number) {
  const cols = Math.ceil(width / SPACING) + 2;
  const rows = Math.ceil(height / SPACING) + 2;
  const jitter = SPACING * JITTER_FACTOR;
  const totalCols = cols + 2;

  const points: Point[] = [];
  for (let row = -1; row <= rows; row++) {
    for (let col = -1; col <= cols; col++) {
      const xNoise = meshNoise(col, row, seed, 1);
      const yNoise = meshNoise(col, row, seed, 2);
      points.push({
        x: col * SPACING + (xNoise - 0.5) * jitter,
        y: row * SPACING + (yNoise - 0.5) * jitter,
      });
    }
  }

  const idx = (r: number, c: number) => (r + 1) * totalCols + (c + 1);
  const edgeSet = new Set<string>();
  const rawEdges: [number, number][] = [];
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const tl = idx(r, c);
      const tr = idx(r, c + 1);
      const bl = idx(r + 1, c);
      const br = idx(r + 1, c + 1);
      const pairs: [number, number][] =
        meshNoise(c, r, seed, 3) > 0.5
          ? [
              [tl, tr],
              [tr, br],
              [tl, br],
              [tl, bl],
              [bl, br],
            ]
          : [
              [tl, tr],
              [tr, bl],
              [tl, bl],
              [tr, br],
              [bl, br],
            ];
      for (const [a, b] of pairs) {
        const k = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (!edgeSet.has(k)) {
          edgeSet.add(k);
          rawEdges.push([a, b]);
        }
      }
    }
  }

  const edges: EdgeData[] = rawEdges.map(([a, b]) => {
    const mx = (points[a].x + points[b].x) / 2;
    const my = (points[a].y + points[b].y) / 2;

    return {
      a,
      b,
      mx,
      my,
      hash: meshNoise(mx / SPACING, my / SPACING, seed, 4),
    };
  });

  return { points, edges };
}

function initMesh(
  canvas: HTMLCanvasElement,
  root: HTMLElement,
  viewport: HTMLElement,
  ctx: CanvasRenderingContext2D,
  isDark: boolean,
  shouldAnimate: boolean,
  seed: number,
): () => void {
  const edgeAlpha = shouldAnimate ? (isDark ? 0.1 : 0.085) : isDark ? 0.22 : 0.155;
  const dotAlpha = shouldAnimate ? (isDark ? 0.108 : 0.1) : isDark ? 0.24 : 0.18;
  const edgeRGB = shouldAnimate
    ? isDark
      ? `${BLUE_ON_DARK_R},${BLUE_ON_DARK_G},${BLUE_ON_DARK_B}`
      : "100,116,139"
    : isDark
      ? `${BLUE_ON_DARK_R},${BLUE_ON_DARK_G},${BLUE_ON_DARK_B}`
      : `${BLUE_ON_LIGHT_R},${BLUE_ON_LIGHT_G},${BLUE_ON_LIGHT_B}`;
  const dotRGB = edgeRGB;
  const glowR = shouldAnimate
    ? isDark
      ? BLUE_ON_DARK_R
      : BLUE_R
    : isDark
      ? BLUE_ON_DARK_R
      : BLUE_ON_LIGHT_R;
  const glowG = shouldAnimate
    ? isDark
      ? BLUE_ON_DARK_G
      : BLUE_G
    : isDark
      ? BLUE_ON_DARK_G
      : BLUE_ON_LIGHT_G;
  const glowB = shouldAnimate
    ? isDark
      ? BLUE_ON_DARK_B
      : BLUE_B
    : isDark
      ? BLUE_ON_DARK_B
      : BLUE_ON_LIGHT_B;

  let w = viewport.clientWidth;
  let h = viewport.clientHeight;
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  let dpr = Math.min(window.devicePixelRatio, 1.5);
  let strokeScale = meshStrokeScaleFromDpr(window.devicePixelRatio);
  const frameBudget = isTouchDevice ? 50 : 33;

  function setCanvasSize() {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setCanvasSize();

  let mesh = generateMesh(w, h, seed);
  let viewportRect = viewport.getBoundingClientRect();

  let curX = -9999;
  let curY = -9999;
  let prevX = -9999;
  let prevY = -9999;
  let smoothedSpeed = 0;
  let time = 0;
  let inViewport = true;
  let pageVisible = document.visibilityState === "visible";
  let scrollInjectedSpeed = 0;
  let lastScrollY = window.scrollY;

  function updateViewportRect() {
    viewportRect = viewport.getBoundingClientRect();
  }

  function syncViewportClip() {
    const rootRect = root.getBoundingClientRect();
    const clipTop = Math.min(h, Math.max(0, rootRect.top));
    const clipBottom = Math.min(h, Math.max(0, h - rootRect.bottom));
    const clipValue = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;

    viewport.style.clipPath = clipValue;
    viewport.style.setProperty("-webkit-clip-path", clipValue);
  }

  function drawFrame() {
    const pts = mesh.points;
    const edges = mesh.edges;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = `rgba(${edgeRGB},${edgeAlpha})`;
    ctx.lineWidth = EDGE_BASE_WIDTH * strokeScale;
    ctx.beginPath();
    for (const edge of edges) {
      ctx.moveTo(pts[edge.a].x, pts[edge.a].y);
      ctx.lineTo(pts[edge.b].x, pts[edge.b].y);
    }
    ctx.stroke();

    if (shouldAnimate) {
      for (const edge of edges) {
        const spatialPhase = fract(edge.mx * SWEEP_SPATIAL_X + edge.my * SWEEP_SPATIAL_Y);
        const blendedPhase =
          spatialPhase * (1 - SWEEP_PHASE_HASH_MIX) + edge.hash * SWEEP_PHASE_HASH_MIX;
        const cycle = fract(blendedPhase - time * SWEEP_SPEED);
        const angleStrength = smoothstep(SWEEP_THRESHOLD, 1, cycle) * smoothedSpeed;

        const totalGlow = angleStrength * 0.35;
        if (totalGlow < 0.015) continue;

        const alpha = Math.min(totalGlow * 0.55, 0.6) * (isDark ? 1.12 : 1);
        ctx.strokeStyle = `rgba(${glowR},${glowG},${glowB},${alpha})`;
        ctx.lineWidth = EDGE_GLOW_WIDTH * strokeScale;
        ctx.beginPath();
        ctx.moveTo(pts[edge.a].x, pts[edge.a].y);
        ctx.lineTo(pts[edge.b].x, pts[edge.b].y);
        ctx.stroke();
      }
    }

    const dotR = DOT_RADIUS * strokeScale;
    ctx.fillStyle = `rgba(${dotRGB},${dotAlpha})`;
    for (const point of pts) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function onMove(e: MouseEvent) {
    updateViewportRect();
    curX = e.clientX - viewportRect.left;
    curY = e.clientY - viewportRect.top;
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    updateViewportRect();
    curX = touch.clientX - viewportRect.left;
    curY = touch.clientY - viewportRect.top;
  }

  function onPointerLeave() {
    curX = -9999;
    curY = -9999;
    prevX = -9999;
    prevY = -9999;
  }

  function onScroll() {
    const dy = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    scrollInjectedSpeed = Math.min(1, dy / 12);
    syncViewportClip();
  }

  let resizeTimer: ReturnType<typeof setTimeout>;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      w = viewport.clientWidth;
      h = viewport.clientHeight;
      if (w > 0 && h > 0) {
        dpr = Math.min(window.devicePixelRatio, 1.5);
        strokeScale = meshStrokeScaleFromDpr(window.devicePixelRatio);
        setCanvasSize();
        mesh = generateMesh(w, h, seed);
        updateViewportRect();
        syncViewportClip();
        drawFrame();
        if (shouldAnimate) {
          lt = 0;
          scheduleFrame();
        }
      }
    }, 200);
  });
  ro.observe(viewport);
  ro.observe(root);

  let af: number | null = null;
  let lt = 0;

  function scheduleFrame() {
    if (af != null) return;
    af = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    af = null;
    if (!inViewport || !pageVisible) return;
    if (now - lt < frameBudget) {
      scheduleFrame();
      return;
    }

    const dt = (now - lt) / 1000;
    lt = now;
    time += dt;

    let frameSpeed = 0;
    if (curX > -9000 && prevX > -9000) {
      const dx = curX - prevX;
      const dy = curY - prevY;
      frameSpeed = Math.sqrt(dx * dx + dy * dy);
    }
    prevX = curX;
    prevY = curY;

    const rawSpeed =
      frameSpeed <= MIN_SPEED ? 0 : Math.min(1, (frameSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED));
    const speedFromPointer = rawSpeed * rawSpeed;
    const speedTarget = Math.max(speedFromPointer, scrollInjectedSpeed);
    scrollInjectedSpeed *= 0.85;
    smoothedSpeed += (speedTarget - smoothedSpeed) * (speedTarget > smoothedSpeed ? 0.25 : 0.035);

    drawFrame();
    scheduleFrame();
  }

  if (!shouldAnimate) {
    syncViewportClip();
    drawFrame();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseleave", onPointerLeave);
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchstart", onTouchMove, { passive: true });
  window.addEventListener("touchend", onPointerLeave, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  const io = new IntersectionObserver(
    ([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) {
        lt = 0;
        syncViewportClip();
        scheduleFrame();
      }
    },
    { threshold: 0 },
  );
  io.observe(root);

  const handleVisibilityChange = () => {
    pageVisible = document.visibilityState === "visible";
    if (pageVisible) {
      lt = 0;
      syncViewportClip();
      scheduleFrame();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  syncViewportClip();
  drawFrame();
  scheduleFrame();

  return () => {
    if (af != null) {
      cancelAnimationFrame(af);
    }
    clearTimeout(resizeTimer);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseleave", onPointerLeave);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchstart", onTouchMove);
    window.removeEventListener("touchend", onPointerLeave);
    window.removeEventListener("scroll", onScroll);
    io.disconnect();
    ro.disconnect();
  };
}

function supportsDynamicMesh() {
  if (typeof window === "undefined") return false;

  return (
    typeof window.requestAnimationFrame === "function" &&
    typeof ResizeObserver !== "undefined" &&
    typeof IntersectionObserver !== "undefined"
  );
}

function StaticPolygonMeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <div className="absolute inset-0 overflow-hidden dark:hidden">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${STATIC_POLYGON_MESH_FALLBACK_SOURCES.light})` }}
        />
      </div>
      <div className="absolute inset-0 hidden overflow-hidden dark:block">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${STATIC_POLYGON_MESH_FALLBACK_SOURCES.dark})` }}
        />
      </div>
    </div>
  );
}

function NoScriptStaticPolygonMeshBackground() {
  return (
    <noscript>
      <StaticPolygonMeshBackground />
    </noscript>
  );
}

const PolygonMeshBackground = memo(function PolygonMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const meshSeedRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();
  const graphicsMode = useGraphicsMode();
  const [didCanvasInitFail, setDidCanvasInitFail] = useState(false);
  const isGraphicsModePending = graphicsMode === "pending";
  const shouldAnimate = graphicsMode === "full";
  const shouldUseStaticFallback =
    !isGraphicsModePending &&
    (graphicsMode === "fallback" || didCanvasInitFail || !supportsDynamicMesh());

  if (meshSeedRef.current == null) {
    // Keep one seed per mounted background so viewport-height changes do not reshuffle the mesh.
    meshSeedRef.current = Math.random() * 1_000_000;
  }
  const meshSeed = meshSeedRef.current!;

  useEffect(() => {
    if (isGraphicsModePending || shouldUseStaticFallback) return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !root || !viewport) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setDidCanvasInitFail(true);
      return;
    }

    const isDark =
      resolvedTheme === "dark" ||
      (!resolvedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return initMesh(canvas, root, viewport, ctx, isDark, shouldAnimate, meshSeed);
  }, [isGraphicsModePending, meshSeed, resolvedTheme, shouldAnimate, shouldUseStaticFallback]);

  if (isGraphicsModePending) {
    return <NoScriptStaticPolygonMeshBackground />;
  }

  if (shouldUseStaticFallback) {
    return <StaticPolygonMeshBackground />;
  }

  return (
    <div ref={rootRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        ref={viewportRef}
        className="fixed inset-0 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.45) 4rem, black 9rem)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.45) 4rem, black 9rem)",
        }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
});

export default PolygonMeshBackground;
