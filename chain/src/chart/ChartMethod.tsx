import { ArrowUpRight } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import {
  ERAS,
  type Era,
  HISTORY_GENERATED_AT,
  HISTORY_TRADE_COUNT,
  REBASE_TX,
} from "@/lib/chart/history";
import { explorerAddressUrl, explorerTxUrl, shortAddress } from "@/lib/rich-list/holders";
import { CONTRIBUTE_URL } from "@/lib/site";
import { useFormatters } from "@/rich-list/format";
import { RichSection } from "@/rich-list/primitives";
import { useChartFormatters } from "./format";

const STEPS = ["swaps", "usd", "units", "pools", "mcap", "eras"] as const;

// A Uniswap v4 pool is an id inside the shared PoolManager, not a contract of its own.
function poolUrl(era: Era, pool: Era["pools"][number]) {
  return pool.kind === "v4"
    ? `https://app.uniswap.org/explore/pools/ethereum/${pool.address}`
    : explorerAddressUrl(era.chain, pool.address);
}

/** How the candles are computed, and the pools each era was read from. */
export default function ChartMethod() {
  const { t } = useTranslation();
  const format = useChartFormatters();
  const { integer, day } = useFormatters();

  return (
    <RichSection id="method" title={t("chart.method.title")} lead={t("chart.method.lead")}>
      <div className="rl-panel glass-card">
        <ol className="rl-facts">
          {STEPS.map((step) => (
            <li key={step}>
              <p>
                <Trans
                  i18nKey={`chart.method.steps.${step}`}
                  components={{
                    rebaseLink: (
                      <a
                        className="rl-link"
                        href={explorerTxUrl("ethereum", REBASE_TX)}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                />
              </p>
            </li>
          ))}
        </ol>

        <h3 className="rl-subtitle ch-pools-title">{t("chart.method.poolsTitle")}</h3>
        <dl className="ch-pools">
          {ERAS.map((era, index) => {
            const next = ERAS[index + 1];
            return (
              <div key={era.id}>
                <dt>
                  <span className="ch-pools-era">{t(`chart.eras.${era.id}`)}</span>
                  <span className="ch-pools-dates">
                    {t("chart.method.eraDates", {
                      from: format.day(era.start),
                      to: next ? format.day(next.start) : t("chart.eras.now"),
                    })}
                  </span>
                </dt>
                <dd>
                  <ul className="rl-tx-list">
                    {era.pools.map((pool) => (
                      <li key={pool.address}>
                        <a
                          href={poolUrl(era, pool)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rl-tx"
                          translate="no"
                          dir="ltr"
                        >
                          <span className="rl-tx-chain">{pool.dex}</span>
                          {shortAddress(pool.address)}
                          <ArrowUpRight aria-hidden size={12} strokeWidth={2} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            );
          })}
        </dl>

        <p className="rl-note">
          <Trans
            i18nKey="chart.method.snapshot"
            values={{ date: day(HISTORY_GENERATED_AT), count: integer(HISTORY_TRADE_COUNT) }}
            components={{
              contributeLink: (
                <a
                  className="rl-link"
                  href={CONTRIBUTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </p>
      </div>
    </RichSection>
  );
}
