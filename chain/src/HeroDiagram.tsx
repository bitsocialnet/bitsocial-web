// Engineering-schematic hero diagram: the layered stack Bitsocial Chain docks into.
// A calm, precise instrument drawing (observatory schematic, not cartoon isometric).
// Pure SVG, no JS animation — all motion is CSS-driven and honors reduced motion.

const DEPTH_DX = 38; // shared depth-skew for every top/right face
const DEPTH_DY = -20;

interface SlabGeometry {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// Front-face rectangle path.
function frontFace({ left, right, top, bottom }: SlabGeometry): string {
  return `M ${left} ${top} L ${right} ${top} L ${right} ${bottom} L ${left} ${bottom} Z`;
}

// Skewed top-face parallelogram.
function topFace({ left, right, top }: SlabGeometry): string {
  return `M ${left} ${top} L ${right} ${top} L ${right + DEPTH_DX} ${top + DEPTH_DY} L ${left + DEPTH_DX} ${top + DEPTH_DY} Z`;
}

// Darker right-edge parallelogram closing the block.
function rightFace({ right, top, bottom }: SlabGeometry): string {
  return `M ${right} ${top} L ${right + DEPTH_DX} ${top + DEPTH_DY} L ${right + DEPTH_DX} ${bottom + DEPTH_DY} L ${right} ${bottom} Z`;
}

const L1: SlabGeometry = { left: 50, right: 574.8, top: 470, bottom: 560 };
const L2: SlabGeometry = { left: 74.6, right: 550.2, top: 382, bottom: 444 };
const L3: SlabGeometry = { left: 99.2, right: 525.6, top: 312, bottom: 360 };

const PLATE_Y = 272;
const PLATE_LEFT = 123.8;
const PLATE_RIGHT = 501;

// Community L3 raised token squares on its top face.
const L3_TOKENS = [191, 256.6, 322.2, 387.8].map((x) => ({
  x,
  y: L3.top + DEPTH_DY * 0.55,
}));

// Faint circuit traces on the Ethereum L1 front face.
const L1_TRACES = [
  `M 82.8 500 L 164.8 500 L 164.8 520 L 279.6 520 L 279.6 505 L 410.8 505`,
  `M 107.4 540 L 214 540 L 214 525 L 345.2 525`,
  `M 460 495 L 460 535 L 525.6 535`,
];

// Irregular, organic node-graph above the social plate (not a grid).
const SOCIAL_NODES = [
  { x: 145.1, y: 186, r: 4, signal: false },
  { x: 197.6, y: 148, r: 3, signal: false },
  { x: 171.4, y: 224, r: 5, signal: true },
  { x: 237, y: 202, r: 3, signal: false },
  { x: 273, y: 156, r: 4, signal: true },
  { x: 296, y: 232, r: 3, signal: false },
  { x: 330.4, y: 178, r: 5, signal: false },
  { x: 361.6, y: 130, r: 3, signal: false },
  { x: 371.4, y: 214, r: 4, signal: true },
  { x: 410.8, y: 190, r: 3, signal: false },
  { x: 433.8, y: 148, r: 4, signal: false },
  { x: 446.9, y: 226, r: 3, signal: false },
  { x: 230.4, y: 244, r: 3, signal: false },
  { x: 322.2, y: 244, r: 3, signal: false },
];

const SOCIAL_EDGES = [
  [0, 2],
  [1, 0],
  [1, 3],
  [2, 12],
  [3, 4],
  [3, 5],
  [4, 7],
  [5, 13],
  [6, 3],
  [6, 8],
  [7, 9],
  [8, 10],
  [8, 13],
  [9, 11],
  [10, 11],
  [2, 6],
] as const;

// Vertical dashed connectors from the social plate down through L3 into L2.
const DASH_CONNECTORS = [181.2, 322.2, 443.6];
// Short solid stubs bridging L2 down to L1.
const SOLID_STUBS = [140.2, 492.8];

interface AnnotationDef {
  label: string;
  leaderY: number;
  signal?: boolean;
}

// leaderY anchors both the elbow leader and the text baseline, so each
// annotation sits level with the layer it describes.
const ANNOTATIONS: AnnotationDef[] = [
  { label: "SOCIAL LAYER · P2P", leaderY: PLATE_Y },
  { label: "COMMUNITY L3S", leaderY: (L3.top + L3.bottom) / 2 },
  { label: "BITSOCIAL CHAIN · L2", leaderY: (L2.top + L2.bottom) / 2, signal: true },
  { label: "ETHEREUM L1", leaderY: (L1.top + L1.bottom) / 2 },
];

const ANNOTATION_X_START = 646;
const ANNOTATION_X_BEND = 672;
const ANNOTATION_X_TEXT = 686;

export default function HeroDiagram() {
  return (
    <svg
      className="hero-diagram"
      viewBox="0 0 960 640"
      width="100%"
      role="img"
      aria-label="Diagram of the Bitsocial Chain stack: social layer and community L3s settling on the Bitsocial Chain L2, secured by Ethereum L1"
    >
      <defs>
        <linearGradient id="hd-l2-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="hd-l2-grad-a" />
          <stop offset="100%" className="hd-l2-grad-b" />
        </linearGradient>
        <filter id="hd-l2-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
      </defs>

      {/* ---------- Ethereum L1 base slab ---------- */}
      <g className="hd-layer hd-layer-l1">
        <path d={rightFace(L1)} className="hd-face hd-face-right" />
        <path d={topFace(L1)} className="hd-face hd-face-top" />
        <path d={frontFace(L1)} className="hd-face hd-face-front" />
        <g className="hd-traces">
          {L1_TRACES.map((d) => (
            <path key={d} d={d} fill="none" />
          ))}
        </g>
      </g>

      {/* ---------- Solid stubs bridging L2 to L1 ---------- */}
      <g className="hd-stubs">
        {SOLID_STUBS.map((x) => (
          <line key={x} x1={x} y1={L2.bottom} x2={x} y2={L1.top} />
        ))}
      </g>

      {/* ---------- Bitsocial Chain L2 slab (docks in via CSS animation) ---------- */}
      <g className="hd-layer hd-layer-l2">
        <path d={frontFace(L2)} className="hd-l2-glow-shape" filter="url(#hd-l2-glow)" />
        <path d={rightFace(L2)} className="hd-face hd-face-right-signal" />
        <path d={topFace(L2)} className="hd-face hd-face-top-signal" />
        <path d={frontFace(L2)} className="hd-face hd-face-front-signal" fill="url(#hd-l2-front)" />
      </g>

      {/* ---------- Community L3 slab ---------- */}
      <g className="hd-layer hd-layer-l3">
        <path d={rightFace(L3)} className="hd-face hd-face-right" />
        <path d={topFace(L3)} className="hd-face hd-face-top" />
        <path d={frontFace(L3)} className="hd-face hd-face-front" />
        <g className="hd-tokens">
          {L3_TOKENS.map((t) => (
            <g key={t.x} transform={`translate(${t.x}, ${t.y})`}>
              <rect x={-9} y={-9} width={18} height={18} rx={3} className="hd-token" />
              <circle r={2} className="hd-token-dot" />
            </g>
          ))}
        </g>
      </g>

      {/* ---------- Dashed connectors, social plate down through L3 into L2 ---------- */}
      <g className="hd-layer hd-layer-connectors">
        {DASH_CONNECTORS.map((x) => (
          <line key={x} x1={x} y1={PLATE_Y} x2={x} y2={L2.top} className="hd-dash" />
        ))}
      </g>

      {/* ---------- Social layer plate line + floating node graph ---------- */}
      <g className="hd-layer hd-layer-social">
        <line
          x1={PLATE_LEFT}
          y1={PLATE_Y}
          x2={PLATE_RIGHT}
          y2={PLATE_Y}
          className="hd-plate-line"
        />
        <g className="hd-social-edges">
          {SOCIAL_EDGES.map(([a, b]) => {
            const na = SOCIAL_NODES[a];
            const nb = SOCIAL_NODES[b];
            return <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} />;
          })}
        </g>
        <g className="hd-social-nodes">
          {SOCIAL_NODES.map((n, i) => (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={n.r}
              className={n.signal ? "hd-node hd-node-signal" : "hd-node"}
            />
          ))}
        </g>
      </g>

      {/* ---------- Annotations ---------- */}
      <g className="hd-annotations">
        {ANNOTATIONS.map((a) => (
          <g
            key={a.label}
            className={a.signal ? "hd-annotation hd-annotation-signal" : "hd-annotation"}
          >
            <polyline
              points={`${ANNOTATION_X_START},${a.leaderY} ${ANNOTATION_X_BEND},${a.leaderY} ${ANNOTATION_X_BEND + 8},${a.leaderY}`}
            />
            <text x={ANNOTATION_X_TEXT} y={a.leaderY + 4}>
              {a.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
