import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Chain, Confidence, Entity, TxRef } from "@/lib/rich-list/data";
import {
  bsoHolderUrl,
  explorerAddressUrl,
  explorerTxUrl,
  shortAddress,
  telegramMessageUrl,
} from "@/lib/rich-list/holders";

export type Category = "team" | "pool" | Confidence | "other";

export function entityCategory(entity: Entity): Category {
  return entity.kind === "linked" ? (entity.confidence ?? "possible") : entity.kind;
}

/** A labelled page region with an anchor, a headline and an optional lead paragraph. */
export function RichSection({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="rl-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="rl-section-title">
        <a href={`#${id}`}>{title}</a>
      </h2>
      {lead ? <p className="rl-section-lead">{lead}</p> : null}
      {children}
    </section>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  const { t } = useTranslation();

  return (
    <span className={`rl-badge rl-badge-${category}`}>{t(`richList.categories.${category}`)}</span>
  );
}

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className ?? "rl-link"}>
      {children}
    </a>
  );
}

/** An address that opens its BSO holdings on Etherscan (or the address page on Avalanche). */
export function AddressLink({
  address,
  chain = "ethereum",
  full = false,
}: {
  address: string;
  chain?: Chain;
  full?: boolean;
}) {
  const href = chain === "ethereum" ? bsoHolderUrl(address) : explorerAddressUrl(chain, address);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rl-address"
      title={address}
      translate="no"
      dir="ltr"
    >
      {full ? address : shortAddress(address)}
    </a>
  );
}

export function TxLinks({ txs }: { txs: TxRef[] }) {
  const { t } = useTranslation();

  return (
    <ul className="rl-tx-list" aria-label={t("richList.evidenceLinks")}>
      {txs.map((tx) => (
        <li key={tx.hash}>
          <a
            href={explorerTxUrl(tx.chain, tx.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="rl-tx"
            translate="no"
            dir="ltr"
          >
            <span className="rl-tx-chain">{tx.chain === "avalanche" ? "AVAX" : "ETH"}</span>
            {shortAddress(tx.hash)}
            <ArrowUpRight aria-hidden size={12} strokeWidth={2} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TelegramLinks({ messageIds }: { messageIds: number[] }) {
  const { t } = useTranslation();

  return (
    <ul className="rl-tx-list" aria-label={t("richList.telegramSources")}>
      {messageIds.map((id) => (
        <li key={id}>
          <a
            href={telegramMessageUrl(id)}
            target="_blank"
            rel="noopener noreferrer"
            className="rl-tx"
            translate="no"
          >
            <span className="rl-tx-chain">TG</span>#{id}
            <ArrowUpRight aria-hidden size={12} strokeWidth={2} />
          </a>
        </li>
      ))}
    </ul>
  );
}
