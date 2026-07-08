// Engineering-schematic hero diagram: the layered stack Bitsocial Chain docks into.
// A calm, precise instrument drawing (observatory schematic, not cartoon isometric).
// Pure SVG, no JS animation — all motion is CSS-driven and honors reduced motion.
//
// Architecture, bottom to top:
//  1. Bitsocial Network (P2P) — the foundation. Not a chain: a peer-to-peer social
//     protocol, rendered as a wide base plane carrying a mesh of tiny logo nodes.
//  2. Ethereum L1 settlement — a slab carrying a horizontal chain of linked ETH glyphs.
//  3. Bitsocial Chain L2 — docks onto the stack (edge-lit slab + entrance dock),
//     carrying its own chain of linked Bitsocial logos.
//  4. Bitsocial economy — a deliberately uneven row of what different communities/users
//     get: a mini L3, tokens, a ".bso" name tag, a creator stamp, a creator-coin profile.
//
// The viewBox is authored tight around the content (no large empty margins) so the
// artwork reads big once scaled into the hero's stage column.

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

// ---------- Stack geometry, top to bottom in the drawing (economy sits highest,
// network is the widest/lowest foundation) ----------

// Bitsocial Chain L2 — same shape/style as the earlier pass, tightened vertically
// (and repositioned) so the whole stack clears the hero-bottom-fade at wide viewports.
const L2: SlabGeometry = { left: 74.6, right: 550.2, top: 140, bottom: 202 };

// Ethereum L1 settlement — now inside the stack, between L2 and the network. Slightly
// wider than L2, narrower than the network plane below (a gentle taper toward the base).
// Shorter than the earlier pass so the air gaps around it (below) can be wider without
// growing the diagram's total height — the layers read as separated, floating parts
// rather than a welded block.
const ETH: SlabGeometry = { left: 64, right: 560.8, top: 222, bottom: 250 };

// Base plane: the Bitsocial Network (P2P). Widest layer — the foundation everything else
// sits on.
const NETWORK: SlabGeometry = { left: 50, right: 574.8, top: 270, bottom: 341 };

// Structural stubs bridging each consecutive slab pair (L2→ETH, ETH→network).
const STUB_XS = [140.2, 492.8];
const STACK_STUBS = [
  ...STUB_XS.map((x) => ({ x, y1: L2.bottom, y2: ETH.top })),
  ...STUB_XS.map((x) => ({ x, y1: ETH.bottom, y2: NETWORK.top })),
];

// ---------- Bitsocial economy row (heterogeneous — deliberately not a uniform grid) ----------

const L3_MINI: SlabGeometry = { left: 110, right: 190, top: 92, bottom: 120 };

const ECON_TOKENS = [
  { x: 230, y: 106, size: 24 },
  { x: 278, y: 112, size: 22 },
];

const NAME_TAG = { x: 350, y: 100, width: 88, height: 24 };

const STAMP = { x: 430, y: 106, r: 16 };

// Creator-coin profile: circle head + shoulders silhouette with a star at its corner.
const PROFILE = { x: 500, y: 106, r: 19 };
const STAR_PATH = "M 0 -8 C 1 -3 3 -1 8 0 C 3 1 1 3 0 8 C -1 3 -3 1 -8 0 C -3 -1 -1 -3 0 -8 Z";

// Dashed connectors from a few economy items down into the L2 (optional/varied attachment —
// communities and users get different things here, so not everything docks the same way).
const ECON_DASH_CONNECTORS = [
  { x: (L3_MINI.left + L3_MINI.right) / 2, y1: L3_MINI.bottom },
  { x: NAME_TAG.x, y1: NAME_TAG.y + NAME_TAG.height / 2 + 10 },
  { x: STAMP.x, y1: STAMP.y + STAMP.r },
  { x: PROFILE.x, y1: PROFILE.y + PROFILE.r },
];

// ---------- Network mesh: tiny logo nodes scattered across the network plane's front
// face — an organic 2D spread (like stars on a plaque), not a grid ----------
interface MeshNodeDef {
  x: number;
  y: number;
  size: number;
  signal?: boolean;
}

// Sizes are viewBox units, not rendered px: this diagram is authored at roughly its
// final display scale once the stage column and tightened viewBox are applied, so
// ~20-26 units reads as a small (~10-14px) node once the SVG is scaled down.
const MESH_NODES: MeshNodeDef[] = [
  { x: 100, y: NETWORK.top + 23, size: 22 },
  { x: 150, y: NETWORK.top + 49, size: 25 },
  { x: 192, y: NETWORK.top + 27, size: 19 },
  { x: 236, y: NETWORK.top + 61, size: 24, signal: true },
  { x: 272, y: NETWORK.top + 34, size: 21 },
  { x: 316, y: NETWORK.top + 55, size: 26 },
  { x: 357, y: NETWORK.top + 26, size: 20, signal: true },
  { x: 402, y: NETWORK.top + 47, size: 23 },
  { x: 446, y: NETWORK.top + 30, size: 19 },
  { x: 496, y: NETWORK.top + 58, size: 24, signal: true },
];

function meshNodePosition(n: MeshNodeDef) {
  return { cx: n.x, cy: n.y };
}

// Organic mesh connections — a loose chain plus a few cross-links, not a grid.
const MESH_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [1, 3],
  [5, 7],
] as const;
const MESH_EDGE_SHIMMER = new Set([2, 5, 9]);
const DRIFT_CLASSES = ["hd-mesh-drift-a", "hd-mesh-drift-b", "hd-mesh-drift-c", "hd-mesh-drift-d"];

// ---------- Chain-of-logos helper: evenly spaced x positions across a span, with padding ----------
function chainPositions(left: number, right: number, count: number, pad: number): number[] {
  const usableLeft = left + pad;
  const usableRight = right - pad;
  const step = (usableRight - usableLeft) / (count - 1);
  return Array.from({ length: count }, (_, i) => usableLeft + i * step);
}

// Canonical two-part Ethereum diamond: a faceted upper octahedron half over a flatter
// lower half, sharing the middle vertex. halfW alone determines all proportions.
function ethGlyphPath(cx: number, cy: number, halfW: number): string {
  const top = cy - 1.5 * halfW;
  const mid = top + halfW;
  const mainBottom = top + 2 * halfW;
  const lowerBottom = top + 3 * halfW;
  const lowerHalfW = halfW * 1.15;
  const lowerMid = (mainBottom + lowerBottom) / 2;
  return `M ${cx} ${top} L ${cx + halfW} ${mid} L ${cx} ${mainBottom} L ${cx - halfW} ${mid} Z M ${cx} ${top} L ${cx} ${mainBottom} M ${cx - halfW} ${mid} L ${cx + halfW} ${mid} M ${cx} ${mainBottom} L ${cx + lowerHalfW} ${lowerMid} L ${cx} ${lowerBottom} L ${cx - lowerHalfW} ${lowerMid} Z`;
}

const ETH_GLYPH_HALF_W = 6;
const ETH_GLYPH_CY = (ETH.top + ETH.bottom) / 2;
const ETH_GLYPH_XS = chainPositions(ETH.left, ETH.right, 5, 50);
const ETH_LINK_HALF_GAP = ETH_GLYPH_HALF_W * 1.15;

const L2_LOGO_SIZE = 22;
const L2_LOGO_CY = (L2.top + L2.bottom) / 2;
const L2_LOGO_XS = chainPositions(L2.left, L2.right, 5, 50);

interface AnnotationDef {
  lines: string[];
  leaderY: number;
  signal?: boolean;
}

// leaderY anchors both the elbow leader and the text baseline, so each annotation sits
// level with the layer it describes.
const ANNOTATIONS: AnnotationDef[] = [
  {
    lines: ["BITSOCIAL ECONOMY", "L3s · tokens · .bso names · creator stamps"],
    leaderY: 106,
  },
  { lines: ["BITSOCIAL CHAIN · L2"], leaderY: (L2.top + L2.bottom) / 2, signal: true },
  { lines: ["ETHEREUM L1 · SETTLEMENT"], leaderY: (ETH.top + ETH.bottom) / 2 },
  { lines: ["BITSOCIAL NETWORK · P2P"], leaderY: (NETWORK.top + NETWORK.bottom) / 2 },
];

const ANNOTATION_X_START = 646;
const ANNOTATION_X_BEND = 672;
const ANNOTATION_X_TEXT = 686;
const ANNOTATION_LINE_HEIGHT = 15;

// Soft halo behind the L2 slab (master's MissingLayer had a breathing radial glow
// bleeding past the active plate's edges) — sized past the slab's own footprint.
const L2_HALO = {
  cx: (L2.left + L2.right) / 2,
  cy: (L2.top + L2.bottom) / 2,
  rx: ((L2.right - L2.left) / 2) * 1.22,
  ry: ((L2.bottom - L2.top) / 2) * 2.6,
};

// Drifting energy motes rising through the two inter-layer air gaps (master's ml-mote
// pattern), varied delay/duration so they never move in lockstep.
const MOTES = [
  { x: 180, y: 212, delay: "0s", duration: "5.5s" },
  { x: 340, y: 207, delay: "1.6s", duration: "6.3s" },
  { x: 470, y: 216, delay: "3s", duration: "5s" },
  { x: 150, y: 262, delay: "0.8s", duration: "6.8s" },
  { x: 330, y: 257, delay: "3.7s", duration: "5.9s" },
  { x: 470, y: 265, delay: "2.2s", duration: "6.4s" },
];

export default function HeroDiagram() {
  return (
    <svg
      className="hero-diagram"
      viewBox="0 62 960 291"
      width="100%"
      role="img"
      aria-label="Diagram of the Bitsocial Chain architecture, bottom to top: the Bitsocial Network peer-to-peer protocol as the foundation, Ethereum L1 settlement above it, the Bitsocial Chain L2 docking above that, and a varied Bitsocial economy row of L3s, tokens, .bso names, creator stamps, and creator coins on top"
    >
      <defs>
        <linearGradient id="hd-l2-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="hd-l2-grad-a" />
          <stop offset="100%" className="hd-l2-grad-b" />
        </linearGradient>
        <filter id="hd-l2-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
        <radialGradient id="hd-l2-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" className="hd-halo-in" />
          <stop offset="100%" className="hd-halo-out" />
        </radialGradient>
        {/* Simplified Bitsocial mark (disc + ribbon) for tiny mesh-node and chain-of-logo instances. */}
        <symbol id="hd-logo-mark" viewBox="0 0 2000 2000">
          <circle className="hd-logo-disc" cx="1001.7" cy="1006.6" r="444" />
          <path
            className="hd-logo-ribbon"
            d="M1699.9,1026.2c-2.9,30.6-33.6,57.5-91.2,80c-45.7,17.9-108.4,33.1-186.4,45.2c-0.3,0-0.5,0.1-0.8,0.1 c-124.6,19.3-248.9,24.6-263.1,25.1c-7.6,98.5-17.5,184.4-29.5,255.5c0,0.2-0.1,0.5-0.1,0.7c-45.4,268-110.4,268-138.1,268 c-30.8,0-46.5-18-48.2-20.1c-29.7-20.5-50.1-79.4-59.6-112.7c-13.9-48.9-22.2-103.6-21.1-139.5c0-0.1,0-0.3,0.1-0.4 c24.4,8.1,49.8,14.2,76,17.9c2.5,20.2,15.7,117,39.2,153.1c0,0,0,0.1,0.1,0.1c5.8,8.8,11.8,13.3,17.8,13.3 c6.1,0,15.9-8.3,27.8-47.8c8.4-27.5,16.7-66.7,24.8-116.5c0-0.1,0-0.3,0.1-0.4c17.5-107,28-223.9,30.7-257.2v0 c0.3-3.6,0.6-7.1,0.9-10.5c-284.2-0.4-441.6-19-496.9-27.2c-0.3,0-0.5-0.1-0.8-0.1c-13-1.9-19.5-3.2-19.6-3.2 c-150.3-24.6-213.9-61.5-240.8-88.1c-11.3-11.2-17.8-26.8-17.8-42.9v-25.1c0-17.3,6.9-28.2,8-29.9c15.2-36.4,82.7-64.6,121.6-78.2 c53.7-18.8,116-32,151.3-32.3h0c0.2,0,0.3,0,0.5,0.1c-9.3,25.3-16.4,51.8-21,79c-96.2,13.2-142.1,32.3-163.7,46.1 c-21.8,13.9-23.7,25.1-23.8,26.7c7.6,25.2,71.9,48.3,186.1,66.9c0.2,0,0.3,0.1,0.5,0.1c144.3,23.4,325.7,29.6,373.5,29.6l151.1,0.2 c0.9-23.6,13.1-323.8-18.4-532.2l-0.2-1.6c0-0.1,0-0.3-0.1-0.5c-11.3-77.1-25.2-131-41.5-160c-8.3-14.7-16.7-22.2-25.1-22.2 c-3.9,0-7.9,1.7-11.8,5.2c-29.7,26.2-48.6,142-49.5,176.1c-26.8,3.6-52.8,9.7-77.8,17.9c0-0.1-0.1-0.3-0.1-0.4 c-1.8-78.9,32.3-195.1,71.6-243.8c1.4-2.4,23.4-37.4,71.5-37.4c37.4,0,69.4,26.1,95,77.5c24.2,48.6,42.4,118.8,54,208.7 c0,0.3,0.1,0.5,0.1,0.8c9.6,74.9,14.5,162,14.5,258.8c0,116.5-4.8,226.4-6,251.1c2,0,4,0,6.1,0c85.4-0.5,183.9-9.7,270.1-25.3 c0.2,0,0.3-0.1,0.5-0.1c90.5-16.3,156.1-37.8,180.2-58.8c0.2-0.2,5.5-5.2,5.5-13.7c0-14.8-22.6-30-65.2-43.9 c-39.7-13-88.1-22.3-121.9-27.9c-4.8-27.9-12.3-54.9-22.1-80.8c0.2-0.1,0.3-0.1,0.5-0.1c0.1,0,0.1,0,0.2,0 c63.5,9.9,117.2,22,159.8,35.7c54.2,17.5,90.1,38,106.7,60.7C1686.5,947.4,1705.1,964.4,1699.9,1026.2z"
          />
        </symbol>
      </defs>

      {/* ---------- Base: Bitsocial Network (P2P), a mesh of tiny logo nodes ---------- */}
      <g className="hd-layer hd-layer-network">
        {/* Inner float wrapper: idle bob is independent of this layer's one-time
            entrance (hd-rise), so the two transforms never fight on the same element. */}
        <g className="hd-float hd-float-d">
          <path d={rightFace(NETWORK)} className="hd-face hd-face-right" />
          <path d={topFace(NETWORK)} className="hd-face hd-face-top" />
          <path d={frontFace(NETWORK)} className="hd-face hd-face-front" />
          <g className="hd-mesh-edges">
            {MESH_EDGES.map(([a, b], i) => {
              const na = meshNodePosition(MESH_NODES[a]);
              const nb = meshNodePosition(MESH_NODES[b]);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.cx}
                  y1={na.cy}
                  x2={nb.cx}
                  y2={nb.cy}
                  className={MESH_EDGE_SHIMMER.has(i) ? "hd-mesh-edge-shimmer" : undefined}
                />
              );
            })}
          </g>
          <g className="hd-mesh-nodes">
            {MESH_NODES.map((n, i) => {
              const { cx, cy } = meshNodePosition(n);
              return (
                <use
                  key={i}
                  href="#hd-logo-mark"
                  x={cx - n.size / 2}
                  y={cy - n.size / 2}
                  width={n.size}
                  height={n.size}
                  className={`hd-mesh-node ${DRIFT_CLASSES[i % DRIFT_CLASSES.length]}${n.signal ? " hd-mesh-node-signal" : ""}`}
                  style={{ animationDelay: `${(i * 0.37) % 3}s` }}
                />
              );
            })}
          </g>
        </g>
      </g>

      {/* ---------- Structural stubs bridging L2 → Ethereum → network ---------- */}
      <g className="hd-stubs">
        {STACK_STUBS.map((s, i) => (
          <line key={i} x1={s.x} y1={s.y1} x2={s.x} y2={s.y2} />
        ))}
      </g>

      {/* ---------- Drifting energy motes rising through the two air gaps ---------- */}
      <g className="hd-motes">
        {MOTES.map((m, i) => (
          <circle
            key={i}
            cx={m.x}
            cy={m.y}
            r={1.8}
            className="hd-mote"
            style={{ animationDelay: m.delay, animationDuration: m.duration }}
          />
        ))}
      </g>

      {/* ---------- Ethereum L1 settlement: a chain of linked ETH glyphs ---------- */}
      <g className="hd-layer hd-layer-eth">
        <g className="hd-float hd-float-c">
          <path d={rightFace(ETH)} className="hd-face hd-face-right" />
          <path d={topFace(ETH)} className="hd-face hd-face-top" />
          <path d={frontFace(ETH)} className="hd-face hd-face-front" />
          <g className="hd-chain-links">
            {ETH_GLYPH_XS.slice(0, -1).map((x, i) => (
              <line
                key={x}
                x1={x + ETH_LINK_HALF_GAP}
                y1={ETH_GLYPH_CY}
                x2={ETH_GLYPH_XS[i + 1] - ETH_LINK_HALF_GAP}
                y2={ETH_GLYPH_CY}
                className="hd-chain-link"
              />
            ))}
          </g>
          {ETH_GLYPH_XS.map((x) => (
            <path
              key={x}
              d={ethGlyphPath(x, ETH_GLYPH_CY, ETH_GLYPH_HALF_W)}
              className="hd-eth-glyph"
            />
          ))}
        </g>
      </g>

      {/* ---------- Bitsocial Chain L2 slab (docks in via CSS animation), a chain of
           linked Bitsocial logos rendered in on-color (light) tones ---------- */}
      <g className="hd-layer hd-layer-l2">
        <g className="hd-float hd-float-b">
          <ellipse
            cx={L2_HALO.cx}
            cy={L2_HALO.cy}
            rx={L2_HALO.rx}
            ry={L2_HALO.ry}
            className="hd-l2-halo"
            fill="url(#hd-l2-halo)"
          />
          <path d={frontFace(L2)} className="hd-l2-glow-shape" filter="url(#hd-l2-glow)" />
          <path d={rightFace(L2)} className="hd-face hd-face-right-signal" />
          <path d={topFace(L2)} className="hd-face hd-face-top-signal" />
          <path
            d={frontFace(L2)}
            className="hd-face hd-face-front-signal"
            fill="url(#hd-l2-front)"
          />
          <g className="hd-chain-links">
            {L2_LOGO_XS.slice(0, -1).map((x, i) => (
              <line
                key={x}
                x1={x + L2_LOGO_SIZE / 2}
                y1={L2_LOGO_CY}
                x2={L2_LOGO_XS[i + 1] - L2_LOGO_SIZE / 2}
                y2={L2_LOGO_CY}
                className="hd-chain-link-oncolor"
              />
            ))}
          </g>
          {L2_LOGO_XS.map((x) => (
            <use
              key={x}
              href="#hd-logo-mark"
              x={x - L2_LOGO_SIZE / 2}
              y={L2_LOGO_CY - L2_LOGO_SIZE / 2}
              width={L2_LOGO_SIZE}
              height={L2_LOGO_SIZE}
              className="hd-chain-logo-oncolor"
            />
          ))}
        </g>
      </g>

      {/* ---------- Bitsocial economy: mini L3, tokens, .bso name tag, creator stamp,
           creator-coin profile ---------- */}
      <g className="hd-layer hd-layer-economy">
        <g className="hd-float hd-float-a">
          <path d={rightFace(L3_MINI)} className="hd-face hd-face-right" />
          <path d={topFace(L3_MINI)} className="hd-face hd-face-top" />
          <path d={frontFace(L3_MINI)} className="hd-face hd-face-front" />
          <text
            x={(L3_MINI.left + L3_MINI.right) / 2}
            y={(L3_MINI.top + L3_MINI.bottom) / 2 + 4}
            className="hd-mini-label"
          >
            L3
          </text>

          {ECON_TOKENS.map((t) => (
            <g key={t.x} transform={`translate(${t.x}, ${t.y})`}>
              <rect
                x={-t.size / 2}
                y={-t.size / 2}
                width={t.size}
                height={t.size}
                rx={3}
                className="hd-token"
              />
              <circle r={2} className="hd-token-dot" />
            </g>
          ))}

          <g transform={`translate(${NAME_TAG.x}, ${NAME_TAG.y})`}>
            <path
              d={`M ${-NAME_TAG.width / 2} ${-NAME_TAG.height / 2} L ${NAME_TAG.width / 2} ${-NAME_TAG.height / 2} L ${NAME_TAG.width / 2} ${NAME_TAG.height / 2} L -4 ${NAME_TAG.height / 2} L -10 ${NAME_TAG.height / 2 + 10} L -14 ${NAME_TAG.height / 2} L ${-NAME_TAG.width / 2} ${NAME_TAG.height / 2} Z`}
              className="hd-tag-shape"
            />
            <text y="5" className="hd-tag-text">
              .bso
            </text>
          </g>

          <g transform={`translate(${STAMP.x}, ${STAMP.y})`}>
            <circle r={STAMP.r} className="hd-stamp-ring" />
            <path
              d={`M 0 ${-STAMP.r * 0.42} L ${STAMP.r * 0.42} 0 L 0 ${STAMP.r * 0.42} L ${-STAMP.r * 0.42} 0 Z`}
              className="hd-stamp-mark"
            />
          </g>

          {/* Creator-coin profile: circle head + shoulders silhouette, star at its corner. */}
          <g transform={`translate(${PROFILE.x}, ${PROFILE.y})`}>
            <circle r={PROFILE.r} className="hd-profile-ring" />
            <circle cy={-7} r={7} className="hd-profile-head" />
            <path
              d="M -12 12 A 12 13 0 0 1 12 12 L 12 16 L -12 16 Z"
              className="hd-profile-shoulders"
            />
            <path d={STAR_PATH} transform="translate(15, -15)" className="hd-profile-star" />
          </g>
        </g>
      </g>

      {/* ---------- Dashed connectors: economy items down into the L2 (varied attachment) ---------- */}
      <g className="hd-layer hd-layer-connectors">
        {ECON_DASH_CONNECTORS.map((c) => (
          <line key={c.x} x1={c.x} y1={c.y1} x2={c.x} y2={L2.top} className="hd-dash" />
        ))}
      </g>

      {/* ---------- Annotations ---------- */}
      <g className="hd-annotations">
        {ANNOTATIONS.map((a) => {
          const blockHeight = (a.lines.length - 1) * ANNOTATION_LINE_HEIGHT;
          const firstY = a.leaderY + 4 - blockHeight / 2;
          return (
            <g
              key={a.lines[0]}
              className={a.signal ? "hd-annotation hd-annotation-signal" : "hd-annotation"}
            >
              <polyline
                points={`${ANNOTATION_X_START},${a.leaderY} ${ANNOTATION_X_BEND},${a.leaderY} ${ANNOTATION_X_BEND + 8},${a.leaderY}`}
              />
              {a.lines.map((line, i) => (
                <text
                  key={line}
                  x={ANNOTATION_X_TEXT}
                  y={firstY + i * ANNOTATION_LINE_HEIGHT}
                  className={i === 0 ? undefined : "hd-annotation-detail"}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
