import { useTranslation } from "react-i18next";
import { LIQUIDITY_SEED_TXS, PLEB_MINTS, type TxRef } from "@/lib/rich-list/data";
import { useRichList } from "./data-context";
import { useFormatters } from "./format";
import { AddressLink, RichSection, TelegramLinks, TxLinks } from "./primitives";

/** Founder statements from the Telegram group, quoted verbatim (they stay in English). */
const STATEMENTS = [
  {
    messageId: 253,
    date: "2022-01-08",
    text: "100% of the supply will be airdropped in 6 days, around 1 trillion tokens. No presale or team allocation, 100% airdrop. More tokens will be minted during later airdrops and liquidity farming…",
  },
  {
    messageId: 294332,
    date: "2022-09-11",
    text: "there's no PLEB at all assigned to team members, everyone who has tokens either market bought them or received them during the airdrops when the project launched…",
  },
  {
    messageId: 331576,
    date: "2023-01-29",
    text: "only reason I have 4% of the supply is because I market bought it, the inital mint was a fair mint, I only got 1 regular airdrop like everyone else…",
  },
];

const FACTS: { id: string; txs?: TxRef[] }[] = [
  { id: "liquiditySeed", txs: LIQUIDITY_SEED_TXS },
  {
    id: "teamClaims",
    txs: [
      {
        chain: "avalanche",
        hash: "0xb2f293a791ce2b21824fd921b2095c3fcf6ae70a8bfe00a274accfc699d4dac1",
      },
      {
        chain: "avalanche",
        hash: "0x8da58b4813203baf0b49db5586b6b9fe9f3afefa0b8913c4a48827074a2e15a6",
      },
    ],
  },
  { id: "noFarmRewards" },
  {
    id: "migrationMintedNothing",
    txs: [
      {
        chain: "ethereum",
        hash: "0x484af845fd8335b6963f38787f34ace516286667e1ce2399aae990e2a160d8db",
      },
    ],
  },
];

export default function TeamAllocation() {
  const { t } = useTranslation();
  const format = useFormatters();
  const { entityRows, shareOfSupply, usdValue } = useRichList();
  const teamRows = entityRows.filter((row) => row.entity.kind === "team");
  const teamTotal = teamRows.reduce((sum, row) => sum + row.balance, 0);
  const minted = PLEB_MINTS.airdropClaims + PLEB_MINTS.liquidityMining + PLEB_MINTS.liquiditySeed;
  const origins = (["airdropClaims", "liquidityMining", "liquiditySeed"] as const).map((key) => ({
    key,
    amount: PLEB_MINTS[key],
    share: PLEB_MINTS[key] / minted,
  }));

  return (
    <RichSection id="team" title={t("richList.team.title")} lead={t("richList.team.lead")}>
      <figure className="rl-origin glass-card">
        <figcaption className="rl-origin-caption">
          {t("richList.team.origin.caption", { amount: format.compact(minted) })}
        </figcaption>
        <div className="rl-strip-bar" role="img" aria-label={t("richList.team.origin.label")}>
          {origins.map((origin) => (
            <span
              key={origin.key}
              className={`rl-strip-segment rl-origin-${origin.key}`}
              style={{ flexGrow: origin.share }}
            />
          ))}
        </div>
        <dl className="rl-origin-list">
          {origins.map((origin) => (
            <div key={origin.key}>
              <dt>
                <span className={`rl-swatch rl-origin-${origin.key}`} aria-hidden />
                {t(`richList.team.origin.${origin.key}.label`)}
                <span className="rl-origin-share">{format.wholePercent(origin.share)}</span>
              </dt>
              <dd>
                {t(`richList.team.origin.${origin.key}.note`, {
                  amount: format.compact(origin.amount),
                })}
              </dd>
            </div>
          ))}
        </dl>
      </figure>

      <div className="rl-panel glass-card">
        <ol className="rl-facts">
          {FACTS.map((fact) => (
            <li key={fact.id}>
              <p>{t(`richList.team.facts.${fact.id}`)}</p>
              {fact.txs ? <TxLinks txs={fact.txs} /> : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="rl-statements">
        <h3 className="rl-subtitle">{t("richList.team.statementsTitle")}</h3>
        <div className="rl-panel glass-card">
          {STATEMENTS.map((statement) => (
            <figure key={statement.messageId} className="rl-statement">
              <blockquote lang="en" dir="ltr">
                <p>“{statement.text}”</p>
              </blockquote>
              <figcaption>
                {t("richList.team.statementBy", { date: format.day(statement.date) })}
                <TelegramLinks messageIds={[statement.messageId]} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="rl-team-wallets">
        <h3 className="rl-subtitle">{t("richList.team.walletsTitle")}</h3>
        {/* Rows become grids on phones, so the table roles are explicit (see HoldersTable). */}
        <div className="rl-table-scroll glass-card">
          <table className="rl-table rl-team-table" role="table">
            <caption className="sr-only">{t("richList.team.walletsTitle")}</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader" className="rl-col-person">
                  {t("richList.team.person")}
                </th>
                <th scope="col" role="columnheader" className="rl-col-wallet">
                  {t("richList.team.wallet")}
                </th>
                <th scope="col" role="columnheader" className="rl-col-num rl-col-balance">
                  {t("richList.table.balance")}
                </th>
                <th scope="col" role="columnheader" className="rl-col-num rl-col-share">
                  {t("richList.table.share")}
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {teamRows.flatMap((row) =>
                row.wallets.map((wallet) => (
                  <tr key={wallet.address} role="row">
                    <td role="cell" className="rl-col-person">
                      {t(`richList.entities.${row.entity.id}.name`)}
                      {wallet.role ? (
                        <span className="rl-cell-note">
                          {t(`richList.walletRoles.${wallet.role}`)}
                        </span>
                      ) : null}
                    </td>
                    <td role="cell" className="rl-col-wallet">
                      <AddressLink address={wallet.address} />
                    </td>
                    <td role="cell" className="rl-col-num rl-col-balance">
                      {format.integer(wallet.balance)}
                    </td>
                    <td role="cell" className="rl-col-num rl-col-share">
                      {format.percent(shareOfSupply(wallet.balance))}
                    </td>
                  </tr>
                )),
              )}
            </tbody>
            <tfoot role="rowgroup">
              <tr role="row">
                <th scope="row" role="rowheader" colSpan={2} className="rl-col-person">
                  {t("richList.team.total")}
                </th>
                <td role="cell" className="rl-col-num rl-col-balance">
                  {format.integer(teamTotal)}
                </td>
                <td role="cell" className="rl-col-num rl-col-share">
                  {format.percent(shareOfSupply(teamTotal))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="rl-note">
          {t("richList.team.walletsNote", { value: format.usd(usdValue(teamTotal)) })}
        </p>
        <p className="rl-note">{t("richList.team.poolNote")}</p>
      </div>
    </RichSection>
  );
}
