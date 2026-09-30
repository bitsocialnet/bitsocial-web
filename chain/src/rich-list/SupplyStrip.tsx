import { useTranslation } from "react-i18next";
import { useRichList } from "./data-context";
import { useFormatters } from "./format";

type Segment = { key: string; label: string; share: number; fill: string; href?: string };

/**
 * Each linked holder keeps one hue wherever it sorts, so two segments never share a colour
 * unless they are the same holder. A categorical palette stays distinguishable up to about
 * eight hues, so the smallest groups share one labelled segment instead of borrowing a hue.
 * Holder hues are defined in rich-list.css and validated against both theme surfaces.
 */
const HOLDER_FILLS: Record<string, string> = {
  holderA: "rl-fill-holder-a",
  holderB: "rl-fill-holder-b",
  holderC: "rl-fill-holder-c",
  holderD: "rl-fill-holder-d",
  holderE: "rl-fill-holder-e",
  holderF: "rl-fill-holder-f",
};
const SMALLER_HOLDER_FILL = "rl-fill-holder-rest";

/** The whole 210M supply as one bar: linked holders, the team, the pool, then everyone else. */
export default function SupplyStrip() {
  const { t } = useTranslation();
  const format = useFormatters();
  const { entityRows, snapshot, shareOfSupply } = useRichList();

  const linkedRows = entityRows
    .filter((row) => row.entity.kind === "linked" && row.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  const ownHue = linkedRows.filter((row) => row.entity.id in HOLDER_FILLS);
  const sharedHue = linkedRows.filter((row) => !(row.entity.id in HOLDER_FILLS));
  const balanceOf = (kind: string) =>
    entityRows.filter((row) => row.entity.kind === kind).reduce((sum, row) => sum + row.balance, 0);

  const labelled: Segment[] = [
    ...ownHue.map((row) => ({
      key: row.entity.id,
      label: t(`richList.entities.${row.entity.id}.name`),
      share: shareOfSupply(row.balance),
      fill: HOLDER_FILLS[row.entity.id],
      href: `#entity-${row.entity.id}`,
    })),
    ...(sharedHue.length
      ? [
          {
            key: "smaller-holders",
            label: sharedHue.map((row) => t(`richList.entities.${row.entity.id}.name`)).join(", "),
            share: shareOfSupply(sharedHue.reduce((sum, row) => sum + row.balance, 0)),
            fill: SMALLER_HOLDER_FILL,
            href: "#linked-wallets",
          },
        ]
      : []),
    {
      key: "team",
      label: t("richList.strip.team"),
      share: shareOfSupply(balanceOf("team")),
      fill: "rl-fill-team",
      href: "#team",
    },
    {
      key: "pool",
      label: t("richList.strip.pool"),
      share: shareOfSupply(balanceOf("pool")),
      fill: "rl-fill-pool",
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
      fill: "rl-fill-other",
    },
  ];

  return (
    <figure className="rl-strip">
      <div className="rl-strip-bar" role="img" aria-label={t("richList.strip.label")}>
        {segments.map((segment) => (
          <span
            key={segment.key}
            className={`rl-strip-segment ${segment.fill}`}
            style={{ flexGrow: segment.share }}
            title={`${segment.label}: ${format.percent(segment.share)}`}
          />
        ))}
      </div>
      <figcaption>
        <ul className="rl-strip-legend">
          {segments.map((segment) => (
            <li key={segment.key}>
              <span className={`rl-swatch ${segment.fill}`} aria-hidden />
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
