import { healthOf } from "@/lib/health";
import type { CommunityStatus } from "@/lib/types";

const tickColors = {
  up: "bg-up",
  down: "bg-down",
  unknown: "bg-unknown",
};

const stateText = { up: "online", down: "offline", unknown: "no data" };

const communityName = ({ title, address }: { title?: string; address: string }) => title || address;

/** One tick per community, so the share online and every outage read at a glance. */
export function CommunityTicks({
  groups,
  className = "",
}: {
  groups: { id: string; label: string; statuses: CommunityStatus[] }[];
  className?: string;
}) {
  const all = groups.flatMap(({ statuses }) => statuses);
  const online = all.filter(({ online }) => online === 1).length;
  return (
    <div
      role="img"
      aria-label={`${online} of ${all.length} communities online`}
      className={`flex h-3.5 items-stretch gap-2 ${className}`}
    >
      {groups.map(({ id, label, statuses }) => (
        <div
          key={id}
          className="flex min-w-0 flex-1 items-stretch gap-px"
          style={{ flexGrow: statuses.length }}
        >
          {statuses.map((status) => {
            const health = healthOf(status.online);
            return (
              <span
                key={status.address}
                title={`${label} · ${communityName(status)} · ${stateText[health]}`}
                className={`min-w-px flex-1 rounded-[1px] ${tickColors[health]}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
