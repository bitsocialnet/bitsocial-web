import { useId, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type RichListRow, getEntityIdForAddress } from "@/lib/rich-list/holders";
import { useRichList } from "./data-context";
import { useFormatters } from "./format";
import { entityCategory } from "@/lib/rich-list/data";
import { AddressLink, CategoryBadge } from "./primitives";

const INITIAL_ROWS = 100;

type View = "grouped" | "wallets";

function EntityName({ entityId }: { entityId: string }) {
  const { t } = useTranslation();
  const row = useRichList().entityRowById.get(entityId);

  if (!row) {
    return null;
  }

  const anchor = row.entity.kind === "linked" ? `#entity-${entityId}` : "#team";
  return (
    <span className="rl-holder-name">
      <a href={anchor} className="rl-holder-label">
        {t(`richList.entities.${entityId}.name`)}
      </a>
      <CategoryBadge category={entityCategory(row.entity)} />
    </span>
  );
}

export default function HoldersTable() {
  const { t } = useTranslation();
  const format = useFormatters();
  const { groupedRows, walletRows, shareOfSupply, usdValue } = useRichList();
  const searchId = useId();
  const [view, setView] = useState<View>("grouped");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());

  const normalizedQuery = query.trim().toLowerCase();
  const rows = view === "grouped" ? groupedRows : walletRows;
  const matchesQuery = (row: RichListRow) => {
    if (!normalizedQuery) {
      return true;
    }
    if (row.type === "wallet") {
      return row.holder.address.toLowerCase().includes(normalizedQuery);
    }
    const name = t(`richList.entities.${row.row.entity.id}.name`).toLowerCase();
    return (
      name.includes(normalizedQuery) ||
      row.row.wallets.some((wallet) => wallet.address.toLowerCase().includes(normalizedQuery))
    );
  };
  const filtered = rows.filter(matchesQuery);
  const visible = showAll || normalizedQuery ? filtered : filtered.slice(0, INITIAL_ROWS);

  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <div className="rl-holders">
      <div className="rl-controls">
        <div className="rl-segmented" role="group" aria-label={t("richList.table.viewLabel")}>
          {(["grouped", "wallets"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              className="rl-segmented-option"
              onClick={() => setView(option)}
            >
              {t(`richList.table.view.${option}`)}
            </button>
          ))}
        </div>
        <label className="rl-search" htmlFor={searchId}>
          <Search aria-hidden size={16} strokeWidth={1.8} />
          <span className="sr-only">{t("richList.table.searchLabel")}</span>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("richList.table.searchPlaceholder")}
            spellCheck={false}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="rl-table-scroll">
        <table className="rl-table">
          <caption className="sr-only">{t("richList.table.caption")}</caption>
          <thead>
            <tr>
              <th scope="col" className="rl-col-rank">
                #
              </th>
              <th scope="col">{t("richList.table.holder")}</th>
              <th scope="col" className="rl-col-num">
                {t("richList.table.balance")}
              </th>
              <th scope="col" className="rl-col-num">
                {t("richList.table.share")}
              </th>
              <th scope="col" className="rl-col-num rl-col-usd">
                {t("richList.table.value")}
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              if (row.type === "wallet") {
                const entityId = getEntityIdForAddress(row.holder.address);
                return (
                  <tr key={row.holder.address}>
                    <td className="rl-col-rank">{row.rank}</td>
                    <td>
                      <span className="rl-holder-name">
                        <AddressLink address={row.holder.address} />
                        {entityId ? (
                          <EntityName entityId={entityId} />
                        ) : row.holder.isContract ? (
                          <span className="rl-tag">{t("richList.table.contract")}</span>
                        ) : null}
                      </span>
                    </td>
                    <td className="rl-col-num">{format.integer(row.holder.balance)}</td>
                    <td className="rl-col-num">
                      {format.percent(shareOfSupply(row.holder.balance))}
                    </td>
                    <td className="rl-col-num rl-col-usd">
                      {format.usd(usdValue(row.holder.balance))}
                    </td>
                  </tr>
                );
              }

              const { entity, wallets, balance } = row.row;
              const heldWallets = wallets.filter((wallet) => wallet.balance > 0);
              const isOpen =
                expanded.has(entity.id) ||
                (normalizedQuery.length > 2 &&
                  heldWallets.some((wallet) =>
                    wallet.address.toLowerCase().includes(normalizedQuery),
                  ));
              const panelId = `rl-wallets-${entity.id}`;
              return (
                <GroupRows
                  key={entity.id}
                  rank={row.rank}
                  entityId={entity.id}
                  balance={balance}
                  wallets={heldWallets}
                  isOpen={isOpen}
                  panelId={panelId}
                  onToggle={() => toggle(entity.id)}
                  toggleLabel={t("richList.table.walletCount", { count: heldWallets.length })}
                />
              );
            })}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="rl-empty">
                  {t("richList.table.noMatch")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {!showAll && !normalizedQuery && filtered.length > INITIAL_ROWS ? (
        <button type="button" className="rl-more" onClick={() => setShowAll(true)}>
          {t("richList.table.showAll", { count: filtered.length })}
        </button>
      ) : null}
    </div>
  );
}

function GroupRows({
  rank,
  entityId,
  balance,
  wallets,
  isOpen,
  panelId,
  onToggle,
  toggleLabel,
}: {
  rank: number;
  entityId: string;
  balance: number;
  wallets: { address: string; balance: number }[];
  isOpen: boolean;
  panelId: string;
  onToggle: () => void;
  toggleLabel: string;
}) {
  const format = useFormatters();
  const { shareOfSupply, usdValue } = useRichList();
  const expandable = wallets.length > 1;

  return (
    <>
      <tr className={isOpen && expandable ? "rl-group is-open" : "rl-group"}>
        <td className="rl-col-rank">{rank}</td>
        <td>
          <span className="rl-holder-name">
            <EntityName entityId={entityId} />
            {expandable ? (
              <button
                type="button"
                className="rl-expand"
                aria-expanded={isOpen}
                aria-controls={wallets.map((_, index) => `${panelId}-${index}`).join(" ")}
                onClick={onToggle}
              >
                {toggleLabel}
                <ChevronDown aria-hidden size={14} strokeWidth={2} />
              </button>
            ) : (
              <AddressLink address={wallets[0]?.address ?? ""} />
            )}
          </span>
        </td>
        <td className="rl-col-num">{format.integer(balance)}</td>
        <td className="rl-col-num">{format.percent(shareOfSupply(balance))}</td>
        <td className="rl-col-num rl-col-usd">{format.usd(usdValue(balance))}</td>
      </tr>
      {expandable
        ? wallets.map((wallet, index) => (
            <tr
              key={wallet.address}
              id={`${panelId}-${index}`}
              className="rl-subrow"
              hidden={!isOpen}
            >
              <td className="rl-col-rank" />
              <td>
                <AddressLink address={wallet.address} />
              </td>
              <td className="rl-col-num">{format.integer(wallet.balance)}</td>
              <td className="rl-col-num">{format.percent(shareOfSupply(wallet.balance))}</td>
              <td className="rl-col-num rl-col-usd">{format.usd(usdValue(wallet.balance))}</td>
            </tr>
          ))
        : null}
    </>
  );
}
