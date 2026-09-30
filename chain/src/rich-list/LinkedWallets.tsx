import { useTranslation } from "react-i18next";
import { ENTITY_ROWS, shareOfSupply } from "@/lib/rich-list/holders";
import { useFormatters } from "./format";
import { AddressLink, CategoryBadge, RichSection, TxLinks, entityCategory } from "./primitives";

const CONFIDENCE_ORDER = { confirmed: 0, likely: 1, possible: 2 } as const;

/** One block per linked group: what it holds, and every piece of evidence behind the link. */
export default function LinkedWallets() {
  const { t } = useTranslation();
  const format = useFormatters();
  const groups = ENTITY_ROWS.filter((row) => row.entity.kind === "linked").sort(
    (a, b) =>
      CONFIDENCE_ORDER[a.entity.confidence ?? "possible"] -
        CONFIDENCE_ORDER[b.entity.confidence ?? "possible"] || b.balance - a.balance,
  );

  return (
    <RichSection
      id="linked-wallets"
      title={t("richList.linked.title")}
      lead={t("richList.linked.lead")}
    >
      <dl className="rl-confidence-key">
        {(["confirmed", "likely", "possible"] as const).map((confidence) => (
          <div key={confidence}>
            <dt>
              <CategoryBadge category={confidence} />
            </dt>
            <dd>{t(`richList.linked.confidence.${confidence}`)}</dd>
          </div>
        ))}
      </dl>

      <div className="rl-evidence-list">
        {groups.map(({ entity, wallets, balance }) => {
          const base = `richList.entities.${entity.id}`;
          return (
            <article key={entity.id} id={`entity-${entity.id}`} className="rl-evidence glass-card">
              <header className="rl-evidence-head">
                <h3 className="rl-evidence-name">{t(`${base}.name`)}</h3>
                <CategoryBadge category={entityCategory(entity)} />
                <p className="rl-evidence-total">
                  {t("richList.linked.holds", {
                    amount: format.integer(balance),
                    share: format.percent(shareOfSupply(balance)),
                    count: wallets.length,
                  })}
                </p>
              </header>
              <p className="rl-evidence-summary">{t(`${base}.summary`)}</p>

              <ol className="rl-evidence-items">
                {entity.evidence.map((item) => (
                  <li key={item.id}>
                    <p>{t(`${base}.evidence.${item.id}`)}</p>
                    {item.addresses?.length ? (
                      <p className="rl-evidence-addresses">
                        {item.addresses.map((ref) => (
                          <AddressLink
                            key={ref.address}
                            address={ref.address}
                            chain={ref.chain}
                            full
                          />
                        ))}
                      </p>
                    ) : null}
                    {item.txs?.length ? <TxLinks txs={item.txs} /> : null}
                  </li>
                ))}
              </ol>

              <details className="rl-evidence-wallets">
                <summary>{t("richList.linked.walletList", { count: wallets.length })}</summary>
                <ul>
                  {wallets.map((wallet) => (
                    <li key={wallet.address}>
                      <AddressLink address={wallet.address} full />
                      <span className="rl-evidence-wallet-meta">
                        {wallet.role ? t(`richList.walletRoles.${wallet.role}`) : null}
                        {wallet.patternOnly ? t("richList.linked.patternOnly") : null}
                        <span>{format.integer(wallet.balance)} BSO</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            </article>
          );
        })}
      </div>
    </RichSection>
  );
}
