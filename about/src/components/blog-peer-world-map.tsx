// Bitsocial-styled adaptation of 5chan's `peer-world-map.tsx`.
// Renders a halftone Natural Earth land mask and plots connected peers using
// the equirectangular projection x = lon + 180, y = 90 - lat.

import { WORLD_MAP_DOTS } from "@/data/world-map-dots";
import { getApproximateLatLon, type PeerMapLocation } from "@/lib/peer-geo";

type MapPeer = {
  address: string;
  id: string;
  location?: PeerMapLocation;
  peerId: string;
  role?: "leecher" | "seeder";
};

// Square side per land dot, sized to cover most of a grid cell so the rasterized
// land mask reads as a halftone map.
const DOT_SIZE = WORLD_MAP_DOTS.step * 0.6;
const PEER_MARKER_SIZE = 3;
const PEER_MARKER_OFFSET = PEER_MARKER_SIZE / 2;

const LAND_PATH = (() => {
  const { step, lonMin, latMax, cols, rows, bitmap } = WORLD_MAP_DOTS;
  const binary = atob(bitmap);
  const square = `h${DOT_SIZE}v${DOT_SIZE}h${-DOT_SIZE}z`;
  const fmt = (value: number) => +value.toFixed(2);
  let path = "";
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      if (!((binary.charCodeAt(index >> 3) >> (7 - (index & 7))) & 1)) continue;
      const lon = lonMin + (col + 0.5) * step;
      const lat = latMax - (row + 0.5) * step;
      path += `M${fmt(lon + 180 - DOT_SIZE / 2)} ${fmt(90 - lat - DOT_SIZE / 2)}${square}`;
    }
  }
  return path;
})();

interface BlogPeerWorldMapProps {
  peers: MapPeer[];
}

export default function BlogPeerWorldMap({ peers }: BlogPeerWorldMapProps) {
  const plotted: {
    id: string;
    label?: string;
    peerId: string;
    role?: "leecher" | "seeder";
    x: number;
    y: number;
  }[] = [];
  for (const peer of peers) {
    const location = peer.location ?? getApproximateLatLon(peer.address);
    if (location) {
      plotted.push({
        id: peer.id,
        label: peer.location?.label,
        peerId: peer.peerId,
        role: peer.role,
        x: location.lon + 180,
        y: 90 - location.lat,
      });
    }
  }

  if (plotted.length === 0) return null;

  return (
    <figure className="overflow-hidden rounded-xl border border-border/40 bg-background/40 text-muted-foreground">
      <svg
        viewBox="0 8 360 140"
        shapeRendering="crispEdges"
        role="img"
        aria-label="Approximate peer locations"
        className="block h-36 w-full sm:h-40"
      >
        <path d={LAND_PATH} fill="currentColor" opacity="0.28" />
        {plotted.map((peer) => (
          <rect
            key={peer.id}
            data-peer-role={peer.role}
            height={PEER_MARKER_SIZE}
            width={PEER_MARKER_SIZE}
            x={peer.x - PEER_MARKER_OFFSET}
            y={peer.y - PEER_MARKER_OFFSET}
            fill={peer.role === "leecher" ? "#ef4444" : "#3b82f6"}
          >
            <title>{peer.label ? `${peer.peerId} - ${peer.label}` : peer.peerId}</title>
          </rect>
        ))}
      </svg>
      <figcaption className="px-3 py-1 text-[10px] italic opacity-60">
        approximate peer locations
      </figcaption>
    </figure>
  );
}
