import { useState } from "react";
import { countryName, formatInteger } from "@/lib/format";
import type { PeerLocation } from "@/lib/types";
import { WORLD_DOTS } from "@/lib/world-dots";

const { cellDegrees, north, south, columns, rows } = WORLD_DOTS;
const HEIGHT = (north - south) / cellDegrees;

// Every land cell becomes a zero-length round-capped segment: one path draws the whole map.
const LAND_PATH = rows
  .flatMap((hex, row) =>
    [...hex].flatMap((digit, digitIndex) => {
      const bits = Number.parseInt(digit, 16);
      return [0, 1, 2, 3]
        .filter((bit) => bits & (8 >> bit))
        .map((bit) => `M${digitIndex * 4 + bit + 0.5} ${row + 0.5}h0`);
    }),
  )
  .join("");

const project = (latitude: number, longitude: number) => ({
  x: (longitude + 180) / cellDegrees,
  y: (north - latitude) / cellDegrees,
});

const radiusFor = (count: number) => 0.7 + Math.sqrt(count) * 0.45;

const placeName = ({ city, region, country }: PeerLocation) =>
  [city, region && region !== city ? region : null, countryName(country)]
    .filter(Boolean)
    .join(", ");

/** Approximate city locations of peers that provide community IPNS records. */
export function PeerMap({ locations }: { locations: PeerLocation[] }) {
  const [active, setActive] = useState<PeerLocation | null>(null);
  const total = locations.reduce((sum, { count }) => sum + count, 0);
  const visible = locations.filter(({ latitude }) => latitude <= north && latitude >= south);
  const activePoint = active ? project(active.latitude, active.longitude) : null;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${columns} / ${HEIGHT}` }}>
      <svg
        viewBox={`0 0 ${columns} ${HEIGHT}`}
        className="absolute inset-0 size-full"
        role="img"
        aria-label={`World map of ${formatInteger(total)} peers in ${locations.length} cities`}
      >
        <path
          d={LAND_PATH}
          fill="none"
          style={{ stroke: "rgb(var(--ink-3) / 0.32)" }}
          strokeWidth={0.62}
          strokeLinecap="round"
        />
        {visible.map((location) => {
          const { x, y } = project(location.latitude, location.longitude);
          const isActive = active === location;
          return (
            <circle
              key={`${location.city}-${location.latitude}-${location.longitude}`}
              cx={x}
              cy={y}
              r={radiusFor(location.count)}
              style={{
                fill: "rgb(var(--network))",
                fillOpacity: isActive ? 1 : 0.78,
                stroke: "rgb(var(--panel))",
              }}
              strokeWidth={0.3}
              className="cursor-pointer"
              onPointerEnter={() => setActive(location)}
              onPointerLeave={() => setActive(null)}
            >
              <title>{`${placeName(location)}: ${formatInteger(location.count)} peers`}</title>
            </circle>
          );
        })}
      </svg>
      {active && activePoint && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs shadow-[0_8px_24px_rgb(0_0_0/0.28)]"
          style={{
            left: `${(activePoint.x / columns) * 100}%`,
            top: `${(activePoint.y / HEIGHT) * 100}%`,
          }}
        >
          <span className="tabular font-semibold text-ink">{formatInteger(active.count)}</span>{" "}
          <span className="text-ink-2">
            {active.count === 1 ? "peer" : "peers"} · {placeName(active)}
          </span>
        </div>
      )}
    </div>
  );
}
