import { useTranslation } from "react-i18next";
import { useRichList } from "./data-context";
import { useFormatters } from "./format";
import { type Category, entityCategory } from "@/lib/rich-list/data";

type Segment = { key: string; label: string; share: number; category: Category; href?: string };

/** The whole 210M supply as one bar: linked groups, the team, the pool, then everyone else. */
export default function SupplyStrip() {
  const { t } = useTranslation();
  const format = useFormatters();
  const { entityRows, snapshot, shareOfSupply } = useRichList();

  const linked: Segment[] = entityRows
    .filter((row) => row.entity.kind === "linked" && row.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .map((row) => ({
      key: row.entity.id,
      label: t(`richList.entities.${row.entity.id}.name`),
      share: shareOfSupply(row.balance),
      category: entityCategory(row.entity),
      href: `#entity-${row.entity.id}`,
    }));
  const teamBalance = entityRows
    .filter((row) => row.entity.kind === "team")
    .reduce((sum, row) => sum + row.balance, 0);
  const poolBalance = entityRows
    .filter((row) => row.entity.kind === "pool")
    .reduce((sum, row) => sum + row.balance, 0);
  const labelled = [
    ...linked,
    {
      key: "team",
      label: t("richList.strip.team"),
      share: shareOfSupply(teamBalance),
      category: "team" as const,
      href: "#team",
    },
    {
      key: "pool",
      label: t("richList.strip.pool"),
      share: shareOfSupply(poolBalance),
      category: "pool" as const,
    },
  ];
  const labelledShare = labelled.reduce((sum, segment) => sum + segment.share, 0);
  const segments: Segment[] = [
    ...labelled,
    {
      key: "other",
      label: t("richList.strip.everyoneElse", {
        count:
          snapshot.holderCount -
          entityRows.reduce((sum, row) => sum + row.wallets.filter((w) => w.balance > 0).length, 0),
      }),
      share: 1 - labelledShare,
      category: "other",
    },
  ];

  return (
    <figure className="rl-strip">
      <div className="rl-strip-bar" role="img" aria-label={t("richList.strip.label")}>
        {segments.map((segment) => (
          <span
            key={segment.key}
            className={`rl-strip-segment rl-fill-${segment.category}`}
            style={{ flexGrow: segment.share }}
            title={`${segment.label}: ${format.percent(segment.share)}`}
          />
        ))}
      </div>
      <figcaption>
        <ul className="rl-strip-legend">
          {segments.map((segment) => (
            <li key={segment.key}>
              <span className={`rl-swatch rl-fill-${segment.category}`} aria-hidden />
              {segment.href ? (
                <a className="rl-strip-name" href={segment.href}>
                  {segment.label}
                </a>
              ) : (
                <span className="rl-strip-name">{segment.label}</span>
              )}
              <span className="rl-strip-share">{format.percent(segment.share)}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
