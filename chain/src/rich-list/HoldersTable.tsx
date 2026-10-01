import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type RichListRow, getEntityIdForAddress } from "@/lib/rich-list/holders";
import { useRichList } from "./data-context";
import { type Formatters, useFormatters } from "./format";
import { entityCategory } from "@/lib/rich-list/data";
import { AddressLink, CategoryBadge } from "./primitives";

const PAGE_SIZE = 25;

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
  const { groupedRows, walletRows } = useRichList();
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const searchId = useId();
  const [view, setView] = useState<View>("grouped");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());

  const normalizedQuery = query.trim().toLowerCase();
  // A search lists matching wallets one by one, each still labelled with its holder, so a match
  // inside a group is visible without expanding it.
  const rows = normalizedQuery || view === "wallets" ? walletRows : groupedRows;
  const matchesQuery = (row: RichListRow) => {
    if (!normalizedQuery || row.type !== "wallet") {
      return true;
    }
    const entityId = getEntityIdForAddress(row.holder.address);
    return (
      row.holder.address.toLowerCase().includes(normalizedQuery) ||
      (entityId !== undefined &&
        t(`richList.entities.${entityId}.name`).toLowerCase().includes(normalizedQuery))
    );
  };
  const filtered = rows.filter(matchesQuery);
  const visible = normalizedQuery ? filtered : filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  // The buttons disappear once every row is shown, so focus moves to the first added row instead
  // of falling back to the page, and keyboard users continue from where the list grew.
  const reveal = (nextLimit: number) => {
    const firstAdded = visible.length;
    flushSync(() => setLimit(nextLimit));
    bodyRef.current
      ?.querySelectorAll(":scope > tr:not(.rl-subrow)")
      [firstAdded]?.querySelector<HTMLElement>("a, button")
      ?.focus();
  };

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

      {/* On phones each row becomes a grid (rich-list.css), and some browsers drop a table's
          semantics once its display changes, so the table roles are stated explicitly. */}
      <div className="rl-table-scroll glass-card">
        <table className="rl-table rl-holders-table" role="table">
          <caption className="sr-only">{t("richList.table.caption")}</caption>
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader" className="rl-col-rank">
                #
              </th>
              <th scope="col" role="columnheader" className="rl-col-holder">
                {t("richList.table.holder")}
              </th>
              <th scope="col" role="columnheader" className="rl-col-num rl-col-balance">
                {t("richList.table.balance")}
              </th>
              <th scope="col" role="columnheader" className="rl-col-num rl-col-share">
                {t("richList.table.share")}
              </th>
              <th scope="col" role="columnheader" className="rl-col-num rl-col-usd">
                {t("richList.table.value")}
              </th>
            </tr>
          </thead>
          <tbody ref={bodyRef} role="rowgroup">
            {visible.map((row) => {
              if (row.type === "wallet") {
                const entityId = getEntityIdForAddress(row.holder.address);
                return (
                  <tr key={row.holder.address} role="row">
                    <td role="cell" className="rl-col-rank">
                      {row.rank}
                    </td>
                    <td role="cell" className="rl-col-holder">
                      <span className="rl-holder-name">
                        <AddressLink address={row.holder.address} />
                        {entityId ? (
                          <EntityName entityId={entityId} />
                        ) : row.holder.isContract ? (
                          <span className="rl-tag">{t("richList.table.contract")}</span>
                        ) : null}
                      </span>
                    </td>
                    <AmountCells format={format} balance={row.holder.balance} />
                  </tr>
                );
              }

              const { entity, wallets, balance } = row.row;
              const heldWallets = wallets.filter((wallet) => wallet.balance > 0);
              const isOpen = expanded.has(entity.id);
              const panelId = `rl-wallets-${entity.id}`;
              return (
                <GroupRows
                  key={entity.id}
                  format={format}
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
              <tr role="row">
                <td role="cell" colSpan={5} className="rl-empty">
                  {t("richList.table.noMatch")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {!normalizedQuery && remaining > 0 ? (
        <div className="rl-more">
          <button
            type="button"
            className="rl-more-button"
            onClick={() => reveal(limit + PAGE_SIZE)}
          >
            {t("richList.table.showMore", { count: Math.min(PAGE_SIZE, remaining) })}
          </button>
          <button
            type="button"
            className="rl-more-all"
            onClick={() => reveal(Number.POSITIVE_INFINITY)}
          >
            {t("richList.table.showAll", { count: filtered.length })}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** The balance, its share of the supply and its dollar value, which end every row. */
function AmountCells({ format, balance }: { format: Formatters; balance: number }) {
  const { shareOfSupply, usdValue } = useRichList();

  return (
    <>
      <td role="cell" className="rl-col-num rl-col-balance">
        {format.integer(balance)}
      </td>
      <td role="cell" className="rl-col-num rl-col-share">
        {format.percent(shareOfSupply(balance))}
      </td>
      <td role="cell" className="rl-col-num rl-col-usd">
        {format.usd(usdValue(balance))}
      </td>
    </>
  );
}

function GroupRows({
  format,
  rank,
  entityId,
  balance,
  wallets,
  isOpen,
  panelId,
  onToggle,
  toggleLabel,
}: {
  format: Formatters;
  rank: number;
  entityId: string;
  balance: number;
  wallets: { address: string; balance: number }[];
  isOpen: boolean;
  panelId: string;
  onToggle: () => void;
  toggleLabel: string;
}) {
  const expandable = wallets.length > 1;

  return (
    <>
      <tr role="row" className={isOpen && expandable ? "rl-group is-open" : "rl-group"}>
        <td role="cell" className="rl-col-rank">
          {rank}
        </td>
        <td role="cell" className="rl-col-holder">
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
        <AmountCells format={format} balance={balance} />
      </tr>
      {expandable
        ? wallets.map((wallet, index) => (
            <tr
              key={wallet.address}
              id={`${panelId}-${index}`}
              role="row"
              className="rl-subrow"
              hidden={!isOpen}
            >
              <td role="cell" className="rl-col-rank" />
              <td role="cell" className="rl-col-holder">
                <AddressLink address={wallet.address} />
              </td>
              <AmountCells format={format} balance={wallet.balance} />
            </tr>
          ))
        : null}
    </>
  );
}
