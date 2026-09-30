import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AIRDROP_ROUNDS, DISTINCT_CLAIMERS } from "@/lib/rich-list/data";
import { plebToBso } from "@/lib/rich-list/holders";
import { useRichList } from "./data-context";
import { useFormatters } from "./format";
import { ExternalLink, RichSection, TelegramLinks } from "./primitives";

const SIGNUP_WINDOWS = {
  telegram: ["2022-01-07", "2022-01-14"],
  twitter: ["2022-02-02", "2022-02-06"],
  reddit: ["2022-02-09", "2022-02-12"],
} as const;

export default function Airdrops() {
  const { t } = useTranslation();
  const format = useFormatters();
  const { snapshot, usdValue } = useRichList();
  const totalPleb = AIRDROP_ROUNDS.reduce((sum, round) => sum + round.plebClaimed, 0);

  const metricRows: { key: string; cells: ReactNode[]; total?: ReactNode }[] = [
    {
      key: "how",
      cells: AIRDROP_ROUNDS.map((round) =>
        round.link ? (
          <ExternalLink key={round.id} href={round.link}>
            {t(`richList.airdrops.rounds.${round.id}.how`)}
          </ExternalLink>
        ) : (
          t(`richList.airdrops.rounds.${round.id}.how`)
        ),
      ),
    },
    {
      key: "window",
      cells: AIRDROP_ROUNDS.map((round) => {
        const [start, end] = SIGNUP_WINDOWS[round.id];
        return t("richList.airdrops.dateRange", { start: format.day(start), end: format.day(end) });
      }),
    },
    {
      key: "signups",
      cells: AIRDROP_ROUNDS.map((round) =>
        round.id === "telegram"
          ? format.integer(round.signups)
          : t("richList.airdrops.overCount", { amount: format.integer(round.signups) }),
      ),
    },
    {
      key: "claimers",
      cells: AIRDROP_ROUNDS.map((round) => format.integer(round.claimers)),
      total: t("richList.airdrops.distinct", { amount: format.integer(DISTINCT_CLAIMERS) }),
    },
    {
      key: "plebClaimed",
      cells: AIRDROP_ROUNDS.map((round) => format.compact(round.plebClaimed)),
      total: format.compact(totalPleb),
    },
    {
      key: "bsoToday",
      cells: AIRDROP_ROUNDS.map((round) => format.integer(plebToBso(round.plebClaimed))),
      total: format.integer(plebToBso(totalPleb)),
    },
    {
      key: "worthToday",
      cells: AIRDROP_ROUNDS.map((round) => format.usd(usdValue(plebToBso(round.plebClaimed)))),
      total: format.usd(usdValue(plebToBso(totalPleb))),
    },
    {
      key: "medianClaim",
      cells: AIRDROP_ROUNDS.map((round) => format.usd(usdValue(plebToBso(round.medianClaimPleb)))),
    },
    {
      key: "largestClaim",
      cells: AIRDROP_ROUNDS.map((round) => format.usd(usdValue(plebToBso(round.largestClaimPleb)))),
    },
    {
      key: "sources",
      cells: AIRDROP_ROUNDS.map((round) => (
        <TelegramLinks key={round.id} messageIds={round.sourceMessageIds} />
      )),
    },
  ];

  return (
    <RichSection
      id="airdrops"
      title={t("richList.airdrops.title")}
      lead={t("richList.airdrops.lead")}
    >
      <div className="rl-table-scroll glass-card">
        <table className="rl-table rl-airdrops">
          <caption className="sr-only">{t("richList.airdrops.caption")}</caption>
          <thead>
            <tr>
              <td />
              {AIRDROP_ROUNDS.map((round, index) => (
                <th key={round.id} scope="col">
                  <span className="rl-round-number">
                    {t("richList.airdrops.round", { number: index + 1 })}
                  </span>
                  {t(`richList.airdrops.rounds.${round.id}.name`)}
                </th>
              ))}
              <th scope="col">{t("richList.airdrops.total")}</th>
            </tr>
          </thead>
          <tbody>
            {metricRows.map((metric) => (
              <tr key={metric.key}>
                <th scope="row">{t(`richList.airdrops.metrics.${metric.key}`)}</th>
                {metric.cells.map((cell, index) => (
                  <td key={AIRDROP_ROUNDS[index].id}>{cell}</td>
                ))}
                <td>{metric.total ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rl-note">
        {t("richList.airdrops.note", {
          price: format.price(snapshot.priceUsd),
          date: format.day(snapshot.generatedAt),
        })}
      </p>
    </RichSection>
  );
}
