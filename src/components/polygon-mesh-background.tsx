import { useRef, useEffect } from "react";
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

const MIN_SPEED = 2;
const MAX_SPEED = 60;

// Angle sweep animation (matches devin.ai angleStrength)
const SWEEP_SPEED = 0.08;
// Slightly lower = longer pulse window so neighboring edges overlap more
const SWEEP_THRESHOLD = 0.66;
// Midpoint-based phase keeps nearby edges in sync; hash retains subtle variation
const SWEEP_SPATIAL_X = 0.0068;
const SWEEP_SPATIAL_Y = 0.0051;
/** 0 = pure traveling wave by position, 1 = fully independent per-edge (disconnected) */
const SWEEP_PHASE_HASH_MIX = 0.38;

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
  const edgeAlpha = isDark ? 0.055 : 0.085;
  const dotAlpha = isDark ? 0.06 : 0.1;
  const edgeRGB = isDark ? "255,255,255" : "100,116,139";
  const dotRGB = isDark ? "255,255,255" : "100,116,139";

  let w = container.clientWidth;
  let h = container.clientHeight;
  const dpr = Math.min(window.devicePixelRatio, 1.5);

  function setCanvasSize() {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  setCanvasSize();

  let mesh = generateMesh(w, h);

  let curX = -9999;
  let curY = -9999;
  let prevX = -9999;
  let prevY = -9999;
  let smoothedSpeed = 0;
  let time = 0;

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    curX = e.clientX - r.left;
    curY = e.clientY - r.top;
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const r = canvas.getBoundingClientRect();
    curX = touch.clientX - r.left;
    curY = touch.clientY - r.top;
  }

  function onPointerLeave() {
    curX = -9999;
    curY = -9999;
    prevX = -9999;
    prevY = -9999;
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseleave", onPointerLeave);
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchstart", onTouchMove, { passive: true });
  window.addEventListener("touchend", onPointerLeave, { passive: true });

  let af: number;
  let lt = 0;

  function frame(now: number) {
    af = requestAnimationFrame(frame);
    if (now - lt < 33) return;
    const dt = (now - lt) / 1000;
    lt = now;
    time += dt;

    const pts = mesh.points;
    const edges = mesh.edges;

    // --- Cursor speed (like devin's u_moveRatio) ---
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
    const speedTarget = rawSpeed * rawSpeed;
    smoothedSpeed += (speedTarget - smoothedSpeed) * (speedTarget > smoothedSpeed ? 0.25 : 0.035);

    // ========== RENDER ==========
    ctx.clearRect(0, 0, w, h);

    // --- Base mesh edges (with Y-fade) ---
    ctx.strokeStyle = `rgba(${edgeRGB},${edgeAlpha})`;
    ctx.lineWidth = EDGE_BASE_WIDTH;
    ctx.beginPath();
    for (const e of edges) {
      if (pts[e.a].y >= FADE_HEIGHT && pts[e.b].y >= FADE_HEIGHT) {
        ctx.moveTo(pts[e.a].x, pts[e.a].y);
        ctx.lineTo(pts[e.b].x, pts[e.b].y);
      }
    }
    ctx.stroke();

    for (const e of edges) {
      if (pts[e.a].y < FADE_HEIGHT || pts[e.b].y < FADE_HEIGHT) {
        const fade = (fadeAtY(pts[e.a].y) + fadeAtY(pts[e.b].y)) * 0.5;
        if (fade < 0.01) continue;
        ctx.strokeStyle = `rgba(${edgeRGB},${edgeAlpha * fade})`;
        ctx.lineWidth = EDGE_BASE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(pts[e.a].x, pts[e.a].y);
        ctx.lineTo(pts[e.b].x, pts[e.b].y);
        ctx.stroke();
      }
    }

    // --- Glow edges (blue): global angle sweep when moving, no cursor-local paint ---
    for (const e of edges) {
      const spatialPhase = fract(e.mx * SWEEP_SPATIAL_X + e.my * SWEEP_SPATIAL_Y);
      const blendedPhase =
        spatialPhase * (1 - SWEEP_PHASE_HASH_MIX) + e.hash * SWEEP_PHASE_HASH_MIX;
      const cycle = fract(blendedPhase - time * SWEEP_SPEED);
      const angleStrength = smoothstep(SWEEP_THRESHOLD, 1, cycle) * smoothedSpeed;

      const totalGlow = angleStrength * 0.35;
      if (totalGlow < 0.015) continue;

      const fade = fadeAtY(e.my);
      if (fade < 0.01) continue;

      const alpha = Math.min(totalGlow * 0.55, 0.6) * fade;
      ctx.strokeStyle = `rgba(${BLUE_R},${BLUE_G},${BLUE_B},${alpha})`;
      ctx.lineWidth = EDGE_GLOW_WIDTH;
      ctx.beginPath();
      ctx.moveTo(pts[e.a].x, pts[e.a].y);
      ctx.lineTo(pts[e.b].x, pts[e.b].y);
      ctx.stroke();
    }

    // --- Vertex dots (Y-fade) ---
    for (let i = 0; i < pts.length; i++) {
      const fade = fadeAtY(pts[i].y);
      if (fade < 0.01) continue;
      ctx.fillStyle = `rgba(${dotRGB},${dotAlpha * fade})`;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  af = requestAnimationFrame(frame);

  let resizeTimer: ReturnType<typeof setTimeout>;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      w = container.clientWidth;
      h = container.clientHeight;
      if (w > 0 && h > 0) {
        setCanvasSize();
        mesh = generateMesh(w, h);
      }
    }, 200);
  });
  ro.observe(container);

  return () => {
    cancelAnimationFrame(af);
    clearTimeout(resizeTimer);
    window.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseleave", onPointerLeave);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchstart", onTouchMove);
    window.removeEventListener("touchend", onPointerLeave);
    ro.disconnect();
  };
}

export default function PolygonMeshBackground() {
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
}
