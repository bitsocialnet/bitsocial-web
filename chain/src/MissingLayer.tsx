// Isometric "missing layer" reactor. The BSO L2 appchain plate ignites as a glowing
// power core that slots into the gap between the social layer and Ethereum L1,
// with an energy spine threading the stack. SVG only; honors reduced motion.

const CX = 260;
const RX = 148; // top-face horizontal radius
const RY = 63; // top-face vertical radius (≈2:1 isometric)
const TH = 22; // plate side height (extruded skirt)

type Plate = {
  id: string;
  cy: number;
  title: string;
  sub: string;
  active?: boolean;
};

const PLATES: readonly Plate[] = [
  { id: "social", cy: 92, title: "SOCIAL", sub: "COMMUNITIES & APPS" },
  { id: "bso", cy: 262, title: "BITSOCIAL CHAIN", sub: "L2 appchain · BSO", active: true },
  { id: "eth", cy: 432, title: "ETHEREUM", sub: "L1 SETTLEMENT" },
];

type Pt = { x: number; y: number };
const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

function corners(cy: number, kx = 1, ky = 1) {
  return {
    L: { x: CX - RX * kx, y: cy },
    T: { x: CX, y: cy - RY * ky },
    R: { x: CX + RX * kx, y: cy },
    B: { x: CX, y: cy + RY * ky },
  };
}

function diamond(cy: number, kx = 1, ky = 1): string {
  const c = corners(cy, kx, ky);
  return `M ${c.T.x} ${c.T.y} L ${c.R.x} ${c.R.y} L ${c.B.x} ${c.B.y} L ${c.L.x} ${c.L.y} Z`;
}

// Front skirt: both lower faces of the isometric plate as one band.
function skirt(cy: number): string {
  const b = cy + RY;
  return `M ${CX - RX} ${cy} L ${CX} ${b} L ${CX + RX} ${cy} L ${CX + RX} ${cy + TH} L ${CX} ${b + TH} L ${CX - RX} ${cy + TH} Z`;
}

// Isometric grid whose lines ride the diamond edges, so it never overflows.
function gridLines(cy: number, n: number) {
  const c = corners(cy);
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const a = lerp(c.L, c.B, t);
    const b = lerp(c.T, c.R, t); // ∥ to the L→T edge
    lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    const e = lerp(c.L, c.T, t);
    const f = lerp(c.B, c.R, t); // ∥ to the L→B edge
    lines.push({ x1: e.x, y1: e.y, x2: f.x, y2: f.y });
  }
  return lines;
}

// Gap segments where the energy spine is visible between plates.
const SPINE_GAPS = [
  { y1: PLATES[0].cy + RY + TH, y2: PLATES[1].cy - RY },
  { y1: PLATES[1].cy + RY + TH, y2: PLATES[2].cy - RY },
];

const SPINE_TOP = PLATES[0].cy - RY;
const SPINE_BOTTOM = PLATES[2].cy + RY + TH;

// Drifting energy motes for atmosphere (stable positions; no randomness).
const MOTES = [
  { x: 150, y: 175, d: "0s", dur: "5.5s" },
  { x: 372, y: 150, d: "1.6s", dur: "6.3s" },
  { x: 206, y: 300, d: "3s", dur: "5s" },
  { x: 330, y: 332, d: "0.8s", dur: "6.8s" },
  { x: 120, y: 420, d: "3.7s", dur: "5.9s" },
  { x: 404, y: 404, d: "2.2s", dur: "6.4s" },
  { x: 262, y: 470, d: "4.4s", dur: "5.3s" },
];

export default function MissingLayer() {
  const bso = PLATES[1];
  const c = corners(bso.cy);
  const nodes = [c.L, c.T, c.R, c.B];

  return (
    <svg
      className="ml"
      viewBox="0 0 520 556"
      role="img"
      aria-label="Three stacked layers of crypto: social communities and apps on top, Ethereum L1 settlement at the base, and Bitsocial Chain, the Ethereum L2 appchain powered by BSO, igniting as the glowing missing layer that slots into the gap between them, threaded by an energy spine."
    >
      <defs>
        <radialGradient id="ml-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" className="ml-core-in" />
          <stop offset="60%" className="ml-core-mid" />
          <stop offset="100%" className="ml-core-out" />
        </radialGradient>
        <linearGradient id="ml-spine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="ml-spine-end" />
          <stop offset="50%" className="ml-spine-mid" />
          <stop offset="100%" className="ml-spine-end" />
        </linearGradient>
      </defs>

      <g className="ml-stack">
        {/* Ambient energy spine threading behind the layers. */}
        <rect
          className="ml-spine-col"
          x={CX - 6}
          y={SPINE_TOP}
          width={12}
          height={SPINE_BOTTOM - SPINE_TOP}
          fill="url(#ml-spine)"
        />

        {PLATES.map((plate) => {
          const isBso = plate.active;
          return (
            <g key={plate.id} className={`plate plate-${plate.id}${isBso ? " plate-active" : ""}`}>
              {/* Halo bleeding past the plate edges. */}
              {isBso && (
                <path
                  d={diamond(plate.cy, 1.46, 1.46)}
                  className="ml-coreglow"
                  fill="url(#ml-core)"
                />
              )}

              <path d={skirt(plate.cy)} className="plate-skirt" />
              <path d={diamond(plate.cy)} className="plate-top" />

              <g className="plate-grid">
                {gridLines(plate.cy, isBso ? 6 : 5).map((l, i) => (
                  <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                ))}
              </g>

              {/* On-surface reactor glow + framing rings. */}
              {isBso && (
                <>
                  <path
                    d={diamond(plate.cy, 0.66, 0.66)}
                    className="ml-coreglow"
                    fill="url(#ml-core)"
                  />
                  <path d={diamond(plate.cy, 0.64, 0.64)} className="ml-ring ml-ring-static" />
                  <path d={diamond(plate.cy, 0.92, 0.92)} className="ml-ring ml-ring-static" />
                  <path d={diamond(plate.cy, 0.64, 0.64)} className="ml-ring ml-ring-pulse" />
                </>
              )}

              <path d={diamond(plate.cy)} className="plate-tint" />
              <path d={diamond(plate.cy)} className="plate-rim" />

              <text x={CX} y={plate.cy - 1} className="ml-title" textAnchor="middle">
                {plate.title}
              </text>
              <text x={CX} y={plate.cy + 14} className="ml-sub" textAnchor="middle">
                {plate.sub}
              </text>

              {isBso &&
                nodes.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={3.4} className="ml-node" />
                ))}
            </g>
          );
        })}

        {/* Crisp energy flowing through the visible gaps. */}
        <g className="ml-links">
          {SPINE_GAPS.map((g, i) => (
            <line key={i} x1={CX} y1={g.y1} x2={CX} y2={g.y2} className="ml-flow flow" />
          ))}
        </g>

        {/* Atmosphere: energy motes drifting around the stack. */}
        <g className="ml-motes">
          {MOTES.map((m, i) => (
            <circle
              key={i}
              className="ml-mote"
              cx={m.x}
              cy={m.y}
              r={1.5}
              style={{ animationDelay: m.d, animationDuration: m.dur }}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
