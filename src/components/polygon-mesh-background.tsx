import { memo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

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
const FADE_HEIGHT = 450;
const EDGE_BASE_WIDTH = 0.5;
const EDGE_GLOW_WIDTH = 1.5;
const DOT_RADIUS = 1.2;

const BLUE_R = 37;
const BLUE_G = 99;
const BLUE_B = 235;
const BLUE_ON_DARK_R = 59;
const BLUE_ON_DARK_G = 130;
const BLUE_ON_DARK_B = 246;

const MIN_SPEED = 2;
const MAX_SPEED = 60;
const SWEEP_SPEED = 0.08;
const SWEEP_THRESHOLD = 0.66;
const SWEEP_SPATIAL_X = 0.0068;
const SWEEP_SPATIAL_Y = 0.0051;
const SWEEP_PHASE_HASH_MIX = 0.38;
const VIEWPORT_OVERSCAN = 240;

function fadeAtY(y: number): number {
  if (y >= FADE_HEIGHT) return 1;
  if (y <= 0) return 0;
  const t = y / FADE_HEIGHT;
  return t * t * t;
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function generateMesh(width: number, height: number) {
  const cols = Math.ceil(width / SPACING) + 2;
  const rows = Math.ceil(height / SPACING) + 2;
  const jitter = SPACING * JITTER_FACTOR;
  const totalCols = cols + 2;

  const points: Point[] = [];
  for (let row = -1; row <= rows; row++) {
    for (let col = -1; col <= cols; col++) {
      points.push({
        x: col * SPACING + (Math.random() - 0.5) * jitter,
        y: row * SPACING + (Math.random() - 0.5) * jitter,
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
        Math.random() > 0.5
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

  const edges: EdgeData[] = rawEdges.map(([a, b], i) => ({
    a,
    b,
    mx: (points[a].x + points[b].x) / 2,
    my: (points[a].y + points[b].y) / 2,
    hash: fract(Math.sin(i * 127.1 + 311.7) * 43758.5453),
  }));

  return { points, edges };
}

function initMesh(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  ctx: CanvasRenderingContext2D,
  isDark: boolean,
): () => void {
  const edgeAlpha = isDark ? 0.1 : 0.085;
  const dotAlpha = isDark ? 0.108 : 0.1;
  const edgeRGB = isDark ? `${BLUE_ON_DARK_R},${BLUE_ON_DARK_G},${BLUE_ON_DARK_B}` : "100,116,139";
  const dotRGB = isDark ? `${BLUE_ON_DARK_R},${BLUE_ON_DARK_G},${BLUE_ON_DARK_B}` : "100,116,139";
  const glowR = isDark ? BLUE_ON_DARK_R : BLUE_R;
  const glowG = isDark ? BLUE_ON_DARK_G : BLUE_G;
  const glowB = isDark ? BLUE_ON_DARK_B : BLUE_B;

  let w = container.clientWidth;
  let h = container.clientHeight;
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const dpr = Math.min(window.devicePixelRatio, 1.5);
  const frameBudget = isTouchDevice ? 50 : 33;

  function setCanvasSize() {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setCanvasSize();

  let mesh = generateMesh(w, h);
  let canvasRect = canvas.getBoundingClientRect();
  let viewportTop = 0;
  let viewportBottom = h;
  let visiblePointIndices: number[] = [];
  let visibleBaseEdgeIndices: number[] = [];
  let visibleFadedEdgeIndices: number[] = [];
  let visibleGlowEdgeIndices: number[] = [];

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

  function updateCanvasRect() {
    canvasRect = canvas.getBoundingClientRect();
  }

  function updateViewportWindow() {
    const nextTop = Math.max(0, -canvasRect.top - VIEWPORT_OVERSCAN);
    viewportTop = nextTop;
    viewportBottom = Math.min(h, nextTop + window.innerHeight + VIEWPORT_OVERSCAN * 2);
  }

  function rebuildVisibleSlices() {
    const pts = mesh.points;
    const edges = mesh.edges;

    const nextPointIndices: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      const y = pts[i].y;
      if (y >= viewportTop && y <= viewportBottom) {
        nextPointIndices.push(i);
      }
    }

    const nextBaseEdgeIndices: number[] = [];
    const nextFadedEdgeIndices: number[] = [];
    const nextGlowEdgeIndices: number[] = [];

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const aY = pts[edge.a].y;
      const bY = pts[edge.b].y;
      const minY = Math.min(aY, bY);
      const maxY = Math.max(aY, bY);

      if (maxY < viewportTop || minY > viewportBottom) continue;

      nextGlowEdgeIndices.push(i);
      if (aY >= FADE_HEIGHT && bY >= FADE_HEIGHT) {
        nextBaseEdgeIndices.push(i);
      } else {
        nextFadedEdgeIndices.push(i);
      }
    }

    visiblePointIndices = nextPointIndices;
    visibleBaseEdgeIndices = nextBaseEdgeIndices;
    visibleFadedEdgeIndices = nextFadedEdgeIndices;
    visibleGlowEdgeIndices = nextGlowEdgeIndices;
  }

  function syncViewportState() {
    updateCanvasRect();
    updateViewportWindow();
    rebuildVisibleSlices();
  }

  syncViewportState();

  function onMove(e: MouseEvent) {
    curX = e.clientX - canvasRect.left;
    curY = e.clientY - canvasRect.top;
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    curX = touch.clientX - canvasRect.left;
    curY = touch.clientY - canvasRect.top;
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
    syncViewportState();
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
        syncViewportState();
        scheduleFrame();
      }
    },
    { threshold: 0 },
  );
  io.observe(container);

  const handleVisibilityChange = () => {
    pageVisible = document.visibilityState === "visible";
    if (pageVisible) {
      lt = 0;
      syncViewportState();
      scheduleFrame();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

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

    const pts = mesh.points;
    const edges = mesh.edges;

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

    const clearTop = Math.max(0, viewportTop - 2);
    const clearHeight = Math.max(0, viewportBottom - clearTop + 2);
    ctx.clearRect(0, clearTop, w, clearHeight);

    ctx.strokeStyle = `rgba(${edgeRGB},${edgeAlpha})`;
    ctx.lineWidth = EDGE_BASE_WIDTH;
    ctx.beginPath();
    for (const edgeIndex of visibleBaseEdgeIndices) {
      const edge = edges[edgeIndex];
      ctx.moveTo(pts[edge.a].x, pts[edge.a].y);
      ctx.lineTo(pts[edge.b].x, pts[edge.b].y);
    }
    ctx.stroke();

    for (const edgeIndex of visibleFadedEdgeIndices) {
      const edge = edges[edgeIndex];
      const fade = (fadeAtY(pts[edge.a].y) + fadeAtY(pts[edge.b].y)) * 0.5;
      if (fade < 0.01) continue;
      ctx.strokeStyle = `rgba(${edgeRGB},${edgeAlpha * fade})`;
      ctx.lineWidth = EDGE_BASE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(pts[edge.a].x, pts[edge.a].y);
      ctx.lineTo(pts[edge.b].x, pts[edge.b].y);
      ctx.stroke();
    }

    for (const edgeIndex of visibleGlowEdgeIndices) {
      const edge = edges[edgeIndex];
      const spatialPhase = fract(edge.mx * SWEEP_SPATIAL_X + edge.my * SWEEP_SPATIAL_Y);
      const blendedPhase =
        spatialPhase * (1 - SWEEP_PHASE_HASH_MIX) + edge.hash * SWEEP_PHASE_HASH_MIX;
      const cycle = fract(blendedPhase - time * SWEEP_SPEED);
      const angleStrength = smoothstep(SWEEP_THRESHOLD, 1, cycle) * smoothedSpeed;

      const totalGlow = angleStrength * 0.35;
      if (totalGlow < 0.015) continue;

      const fade = fadeAtY(edge.my);
      if (fade < 0.01) continue;

      const alpha = Math.min(totalGlow * 0.55, 0.6) * fade * (isDark ? 1.12 : 1);
      ctx.strokeStyle = `rgba(${glowR},${glowG},${glowB},${alpha})`;
      ctx.lineWidth = EDGE_GLOW_WIDTH;
      ctx.beginPath();
      ctx.moveTo(pts[edge.a].x, pts[edge.a].y);
      ctx.lineTo(pts[edge.b].x, pts[edge.b].y);
      ctx.stroke();
    }

    for (const pointIndex of visiblePointIndices) {
      const point = pts[pointIndex];
      const fade = fadeAtY(point.y);
      if (fade < 0.01) continue;
      ctx.fillStyle = `rgba(${dotRGB},${dotAlpha * fade})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    scheduleFrame();
  }

  scheduleFrame();

  let resizeTimer: ReturnType<typeof setTimeout>;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      w = container.clientWidth;
      h = container.clientHeight;
      if (w > 0 && h > 0) {
        setCanvasSize();
        mesh = generateMesh(w, h);
        syncViewportState();
      }
    }, 200);
  });
  ro.observe(container);

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

const PolygonMeshBackground = memo(function PolygonMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark =
      resolvedTheme === "dark" ||
      (!resolvedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return initMesh(canvas, container, ctx, isDark);
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
});

export default PolygonMeshBackground;
