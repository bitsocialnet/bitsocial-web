import { HISTORY, type TxRef } from "@/lib/rich-list/data";

/** What an outside link on an event points to, which names it in the event's details. */
export type EventLinkKind = "reddit" | "release" | "hackerNews" | "tweet";

/**
 * Moments the price chart marks beyond the token history the rich list tells: releases, listings
 * and attention the project drew. Each one cites the plebbit Telegram group (t.me/bitsocialnet
 * keeps the same message numbers) or the page it happened on.
 */
const MILESTONES: {
  id: string;
  date: string;
  messageIds?: number[];
  links?: { kind: EventLinkKind; href: string }[];
}[] = [
  {
    id: "protocolLabsGrant",
    date: "2022-04-14",
    messageIds: [151774],
    links: [
      {
        kind: "reddit",
        href: "https://www.reddit.com/r/plebbitairdrop/comments/u3aj45/plebbit_receives_grant_from_protocol_labs/",
      },
    ],
  },
  {
    id: "firstApp",
    date: "2022-05-28",
    messageIds: [192113],
    links: [
      { kind: "release", href: "https://github.com/plebbit/plebbit-react/releases/tag/v0.1.0" },
    ],
  },
  {
    id: "plebchan",
    date: "2023-04-24",
    messageIds: [362083],
    links: [{ kind: "release", href: "https://github.com/plebbit/plebchan/releases/tag/v0.1.0" }],
  },
  {
    id: "hackerNews",
    date: "2023-06-05",
    messageIds: [383673, 385328],
    links: [{ kind: "hackerNews", href: "https://news.ycombinator.com/item?id=36203610" }],
  },
  {
    id: "coingecko",
    date: "2023-10-14",
    messageIds: [225626, 430567],
  },
  {
    id: "socialFi",
    date: "2023-12-10",
    messageIds: [447247, 447142],
  },
  {
    id: "seedit",
    date: "2023-12-18",
    links: [{ kind: "release", href: "https://github.com/plebbit/seedit/releases/tag/v0.1.0" }],
  },
  {
    id: "marchRally",
    date: "2024-03-04",
    messageIds: [485204, 486720],
    links: [{ kind: "tweet", href: "https://x.com/Jason/status/1763576914281697360" }],
  },
];

export type ChartEvent = {
  id: string;
  /** Unix seconds at 00:00 UTC. */
  time: number;
  /** Where the event's title and body live in the translations. */
  copyKey: string;
  txs?: TxRef[];
  messageIds?: number[];
  /** Each link's label is the translation at `labelKey`. */
  links?: { labelKey: string; href: string }[];
};

function dayOf(date: string) {
  return Date.parse(`${date}T00:00:00Z`) / 1000;
}

/**
 * Every event the chart marks, oldest first: rich list history events with a known day, told in
 * the rich list's words, and the chart's own milestones.
 */
export const CHART_EVENTS: ChartEvent[] = [
  ...HISTORY.filter((event) => (event.precision ?? "day") === "day").map((event) => ({
    id: event.id,
    time: dayOf(event.date),
    copyKey: `richList.history.events.${event.id}`,
    txs: event.txs,
    messageIds: event.messageIds,
    links: event.link
      ? [{ labelKey: "richList.history.redditThread", href: event.link }]
      : undefined,
  })),
  ...MILESTONES.map((event) => ({
    id: event.id,
    time: dayOf(event.date),
    copyKey: `chart.events.${event.id}`,
    messageIds: event.messageIds,
    links: event.links?.map((link) => ({
      labelKey: `chart.eventDetails.links.${link.kind}`,
      href: link.href,
    })),
  })),
].sort((a, b) => a.time - b.time);
