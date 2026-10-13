import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import { CommunityDetail } from "@/components/community-detail";
import { HistoryStrip } from "@/components/history-strip";
import { Lamp } from "@/components/primitives";
import { healthOf } from "@/lib/health";
import { formatAge, formatCompact, formatInteger, formatPercent } from "@/lib/format";
import type { ClientInfo, CommunityRow, RangeInfo } from "@/lib/types";

type SortKey =
  | "name"
  | "status"
  | "uptime"
  | "postsLastDay"
  | "currentUsers"
  | "pubsubPeers"
  | "posts"
  | "replies"
  | "lastPubsubMessageAge";

type StatusFilter = "all" | "online" | "offline";

/** "/biz/ - Business & Finance" becomes a code chip and a name. */
const splitTitle = (row: { title?: string; address: string; directoryCode?: string }) => {
  const match = row.title?.match(/^\/([^/]+)\/\s*-\s*(.+)$/);
  if (match) {
    return { code: `/${match[1]}/`, name: match[2] };
  }
  return { code: undefined, name: row.title || row.address };
};

const sortValue = (row: CommunityRow, key: SortKey): number | string | null => {
  switch (key) {
    case "name":
      return splitTitle(row).name.toLowerCase();
    case "status":
      // Offline first, then never-fetched, then online.
      return row.online === null ? 1 : row.online === 1 ? 2 : 0;
    default:
      return row[key];
  }
};

const compareRows =
  (key: SortKey, descending: boolean) => (left: CommunityRow, right: CommunityRow) => {
    const a = sortValue(left, key);
    const b = sortValue(right, key);
    if (a === null && b === null) {
      return 0;
    }
    // Missing values always sink to the bottom.
    if (a === null) {
      return 1;
    }
    if (b === null) {
      return -1;
    }
    const order = typeof a === "string" ? a.localeCompare(b as string) : a - (b as number);
    return descending ? -order : order;
  };

const statusText = (row: CommunityRow, offlineAfterSeconds: number) => {
  if (row.online === null) {
    return { text: "No data", detail: "Never fetched" };
  }
  if (row.online === 1) {
    return {
      text: "Online",
      detail:
        row.lastUpdateAge === null ? undefined : `Updated ${formatAge(row.lastUpdateAge)} ago`,
    };
  }
  return {
    text: "Offline",
    detail:
      row.lastUpdateAge === null
        ? "Fetch failing"
        : row.lastUpdateAge >= offlineAfterSeconds
          ? `No update for ${formatAge(row.lastUpdateAge)}`
          : "Fetch failing",
  };
};

function CommunityName({ row, client }: { row: CommunityRow; client: ClientInfo }) {
  const { code, name } = splitTitle(row);
  return (
    <span className="flex min-w-0 items-center gap-2">
      {code && (
        <span className="shrink-0 rounded-md bg-raised px-1.5 py-0.5 font-display text-xs font-semibold text-ink">
          {code}
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium text-ink">{name}</span>
        <span className="block truncate text-[11px] text-ink-3">
          {row.address}
          {row.nsfw && <span className="ml-1.5 text-ink-2">· NSFW</span>}
        </span>
      </span>
      <span className="sr-only">on {client.label}</span>
    </span>
  );
}

interface Column {
  key: SortKey;
  label: string;
  width: string;
  /** Breakpoint from which the column shows; narrower tables leave it out. */
  from?: "xl" | "2xl";
  alignRight?: boolean;
  cell: (row: CommunityRow) => ReactNode;
}

const visibility = { xl: "hidden xl:block", "2xl": "hidden 2xl:block" };
const gridColumns = (columns: Column[], upTo?: Column["from"]) => {
  const shown = new Set<Column["from"]>([
    undefined,
    ...(upTo === "2xl" ? (["xl", "2xl"] as const) : upTo ? [upTo] : []),
  ]);
  return [
    "minmax(12rem, 1fr)",
    ...columns.filter(({ from }) => shown.has(from)).map(({ width }) => width),
  ].join(" ");
};

const statusCell = (offlineAfterSeconds: number) => (row: CommunityRow) => {
  const { text, detail } = statusText(row, offlineAfterSeconds);
  return (
    <span className="block">
      <span className="flex items-center gap-1.5 text-[13px] text-ink">
        <Lamp health={healthOf(row.online)} />
        {text}
      </span>
      {detail && <span className="block truncate text-[11px] text-ink-3">{detail}</span>}
    </span>
  );
};

function Availability({ row, range }: { row: CommunityRow; range: RangeInfo }) {
  return (
    <span className="flex items-center gap-2">
      <HistoryStrip
        history={row.history}
        range={range}
        label={`${splitTitle(row).name} availability`}
        className="h-2 min-w-0 flex-1"
      />
      <span className="tabular w-12 shrink-0 text-right text-xs text-ink-2">
        {formatPercent(row.uptime)}
      </span>
    </span>
  );
}

const buildColumns = (
  client: ClientInfo,
  range: RangeInfo,
  offlineAfterSeconds: number,
): Column[] => [
  { key: "status", label: "Status", width: "8.5rem", cell: statusCell(offlineAfterSeconds) },
  {
    key: "uptime",
    label: "Availability",
    width: "minmax(8rem, 11rem)",
    cell: (row) => <Availability row={row} range={range} />,
  },
  {
    key: "postsLastDay",
    label: "Posts 24h",
    width: "5rem",
    alignRight: true,
    cell: (row) => formatInteger(row.postsLastDay),
  },
  {
    key: "currentUsers",
    label: "Users 7d",
    width: "5rem",
    alignRight: true,
    cell: (row) => formatInteger(row.currentUsers),
  },
  {
    key: "pubsubPeers",
    label: "Peers",
    width: "3.5rem",
    alignRight: true,
    cell: (row) => formatInteger(row.pubsubPeers),
  },
  {
    key: "posts",
    label: client.postLabel,
    width: "4.5rem",
    from: "xl",
    alignRight: true,
    cell: (row) => formatCompact(row.posts),
  },
  {
    key: "replies",
    label: client.replyLabel,
    width: "4.5rem",
    from: "xl",
    alignRight: true,
    cell: (row) => formatCompact(row.replies),
  },
  {
    key: "lastPubsubMessageAge",
    label: "Last message",
    width: "6rem",
    from: "2xl",
    alignRight: true,
    cell: (row) =>
      row.lastPubsubMessageAge === null ? "–" : `${formatAge(row.lastPubsubMessageAge)} ago`,
  },
];

interface Sort {
  key: SortKey;
  descending: boolean;
}

const filterChips: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "offline", label: "Offline" },
];

function Toolbar({
  client,
  query,
  onQuery,
  status,
  onStatus,
  counts,
  sort,
  onSort,
}: {
  client: ClientInfo;
  query: string;
  onQuery: (query: string) => void;
  status: StatusFilter;
  onStatus: (status: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
  sort: Sort;
  onSort: (sort: Sort) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
      <label className="relative min-w-0 flex-1 basis-56">
        <span className="sr-only">Filter {client.communities}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-3"
        >
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={`Filter ${client.communities} by name or address`}
          className="h-9 w-full rounded-full border border-line bg-bg pl-8 pr-3 text-[13px] text-ink placeholder:text-ink-3 focus:border-accent-strong"
        />
      </label>
      <div role="radiogroup" aria-label="Status" className="flex gap-1">
        {filterChips.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={status === key}
            onClick={() => onStatus(key)}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] ${
              status === key
                ? "border-accent/60 bg-accent/10 text-ink"
                : "border-line text-ink-2 hover:text-ink"
            }`}
          >
            {label}
            <span className="tabular rounded-full bg-raised px-1.5 text-[11px] text-ink-2">
              {counts[key]}
            </span>
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-[13px] text-ink-2 md:hidden">
        Sort
        <select
          value={sort.key}
          onChange={(event) =>
            onSort({
              key: event.target.value as SortKey,
              descending: event.target.value !== "name",
            })
          }
          className="h-9 rounded-full border border-line bg-bg px-3 text-[13px] text-ink"
        >
          <option value="postsLastDay">Posts 24h</option>
          <option value="currentUsers">Users 7d</option>
          <option value="pubsubPeers">Peers</option>
          <option value="uptime">Availability</option>
          <option value="status">Status</option>
          <option value="name">Name</option>
        </select>
      </label>
    </div>
  );
}

interface RowListProps {
  client: ClientInfo;
  rows: CommunityRow[];
  range: RangeInfo;
  offlineAfterSeconds: number;
  expanded: string | null;
  onToggle: (address: string) => void;
  detail: (row: CommunityRow) => ReactNode;
}

/** Phones: one card per community. */
function CommunityCards({
  client,
  rows,
  range,
  offlineAfterSeconds,
  expanded,
  onToggle,
  detail,
}: RowListProps) {
  return (
    <ul className="divide-y divide-line md:hidden">
      {rows.map((row) => {
        const isOpen = expanded === row.address;
        const figures = [
          { label: "Posts 24h", value: row.postsLastDay },
          { label: "Users 7d", value: row.currentUsers },
          { label: "Peers", value: row.pubsubPeers },
        ];
        return (
          <li key={row.address} className="px-3 py-3">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => onToggle(row.address)}
              className="block w-full rounded-lg text-left"
            >
              <span className="flex items-center gap-3">
                <span className="min-w-0 flex-1">
                  <CommunityName row={row} client={client} />
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs text-ink-2">
                  <Lamp health={healthOf(row.online)} />
                  {statusText(row, offlineAfterSeconds).text}
                </span>
              </span>
              <span className="mt-2.5 block">
                <Availability row={row} range={range} />
              </span>
              <span className="mt-2.5 grid grid-cols-3 gap-2 text-[11px] text-ink-3">
                {figures.map(({ label, value }) => (
                  <span key={label}>
                    <span className="tabular block text-[13px] font-semibold text-ink">
                      {formatInteger(value)}
                    </span>
                    {label}
                  </span>
                ))}
              </span>
            </button>
            {isOpen && <div className="mt-3">{detail(row)}</div>}
          </li>
        );
      })}
    </ul>
  );
}

/** Tablets and up: a sortable table, laid out on a grid so opened rows keep the columns. */
function CommunityGrid({
  client,
  rows,
  columns,
  sort,
  onSort,
  expanded,
  onToggle,
  detail,
}: Omit<RowListProps, "range" | "offlineAfterSeconds"> & {
  columns: Column[];
  sort: Sort;
  onSort: (key: SortKey) => void;
}) {
  const Community = client.community[0].toUpperCase() + client.community.slice(1);
  const ariaSort = (key: SortKey) =>
    sort.key === key ? (sort.descending ? "descending" : "ascending") : undefined;
  const header = (key: SortKey, label: string, className = "") => (
    <div key={key} role="columnheader" aria-sort={ariaSort(key)} className={className}>
      <button type="button" onClick={() => onSort(key)} className="rounded hover:text-ink">
        {label}
        {sort.key === key && <span aria-hidden="true">{sort.descending ? " ↓" : " ↑"}</span>}
      </button>
    </div>
  );
  const placement = (column: Column) =>
    `${column.from ? visibility[column.from] : ""} ${column.alignRight ? "text-right" : ""}`;

  return (
    <div
      role="table"
      aria-label={`${client.label} ${client.communities}`}
      className="hidden text-[13px] md:block"
      style={
        {
          "--columns": gridColumns(columns),
          "--columns-xl": gridColumns(columns, "xl"),
          "--columns-2xl": gridColumns(columns, "2xl"),
        } as CSSProperties
      }
    >
      <div role="rowgroup">
        <div
          role="row"
          className="community-grid border-b border-line px-3 py-2 text-[11px] font-medium text-ink-3"
        >
          {header("name", Community)}
          {columns.map((column) => header(column.key, column.label, placement(column)))}
        </div>
      </div>
      <div role="rowgroup">
        {rows.map((row) => {
          const isOpen = expanded === row.address;
          return (
            <Fragment key={row.address}>
              {/* Clicking anywhere on a row toggles it; keyboards use the name button. */}
              <div
                role="row"
                className={`community-grid cursor-pointer border-b border-line px-3 py-2 hover:bg-raised/60 ${isOpen ? "bg-raised/60" : ""}`}
                onClick={() => onToggle(row.address)}
              >
                <div role="cell" className="min-w-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggle(row.address);
                    }}
                    className="flex w-full min-w-0 items-center gap-2 rounded-md text-left"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className={`size-3 shrink-0 text-ink-3 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    >
                      <path
                        d="m4.5 2.5 3.5 3.5-3.5 3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <CommunityName row={row} client={client} />
                  </button>
                </div>
                {columns.map((column) => (
                  <div
                    key={column.key}
                    role="cell"
                    className={`tabular min-w-0 text-ink-2 ${placement(column)}`}
                  >
                    {column.cell(row)}
                  </div>
                ))}
              </div>
              {isOpen && (
                <div role="row" className="border-b border-line px-3 pb-4 pt-3">
                  <div role="cell">{detail(row)}</div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

const matchesStatus = (row: CommunityRow, status: StatusFilter) =>
  status === "all" || (status === "online" ? row.online === 1 : row.online !== 1);

const matchesQuery = (row: CommunityRow, needle: string) =>
  !needle ||
  [row.title, row.address, row.directoryCode].some((value) =>
    value?.toLowerCase().includes(needle),
  );

export function CommunitiesTable({
  client,
  communities,
  range,
  color,
  offlineAfterSeconds,
}: {
  client: ClientInfo;
  communities: CommunityRow[];
  range: RangeInfo;
  color: string;
  offlineAfterSeconds: number;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<Sort>({ key: "postsLastDay", descending: true });
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = {
    all: communities.length,
    online: communities.filter((row) => matchesStatus(row, "online")).length,
    offline: communities.filter((row) => matchesStatus(row, "offline")).length,
  };
  const needle = query.trim().toLowerCase();
  const rows = communities
    .filter((row) => matchesStatus(row, status) && matchesQuery(row, needle))
    .sort(compareRows(sort.key, sort.descending));

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, descending: !current.descending }
        : { key, descending: key !== "name" && key !== "lastPubsubMessageAge" },
    );
  const toggleRow = (address: string) =>
    setExpanded((current) => (current === address ? null : address));
  const detail = (row: CommunityRow) => {
    const { code, name } = splitTitle(row);
    return (
      <CommunityDetail
        client={client}
        row={row}
        range={range.key}
        color={color}
        label={code ?? name}
        offlineAfterSeconds={offlineAfterSeconds}
      />
    );
  };
  const listProps = { client, rows, expanded, onToggle: toggleRow, detail };

  return (
    <div className="panel">
      <Toolbar
        client={client}
        query={query}
        onQuery={setQuery}
        status={status}
        onStatus={setStatus}
        counts={counts}
        sort={sort}
        onSort={setSort}
      />
      {rows.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-ink-3">
          No {client.communities} match this filter.
        </p>
      )}
      <CommunityCards {...listProps} range={range} offlineAfterSeconds={offlineAfterSeconds} />
      <CommunityGrid
        {...listProps}
        columns={buildColumns(client, range, offlineAfterSeconds)}
        sort={sort}
        onSort={toggleSort}
      />
    </div>
  );
}
