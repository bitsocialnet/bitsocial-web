// Shapes of the JSON documents served by server/dashboard.mjs.

export type RangeKey = "6h" | "24h" | "7d" | "14d";

/** Values on the shared timeline: index i is at `range.start + i * range.step` seconds. */
export type Series = (number | null)[];

export interface RangeInfo {
  key: RangeKey;
  start: number;
  end: number;
  step: number;
}

export interface StatusRow {
  id: string;
  label: string;
  url: string;
  /** 1 up, 0 down, null when the monitor has no data. */
  up: number | null;
  /** Share of the range the check passed. */
  uptime: number | null;
  /** Seconds the latest successful check took. */
  latency: number | null;
  /** Share of each step the check passed. */
  history: Series;
  kind?: "website" | "service";
  /** HTTP routers: share of communities the router found providers for. */
  coverage?: number | null;
}

export interface CommunityStatus {
  address: string;
  title?: string;
  directoryCode?: string;
  online: number | null;
}

export interface ClientSummary {
  id: string;
  label: string;
  community: string;
  communities: string;
  appUrl: string;
  communitiesTotal: number;
  communitiesOnline: number | null;
  totalPosts: number | null;
  postsLastDay: number | null;
  currentUsers: number | null;
  series: {
    communitiesOnline: Series;
    totalPosts: Series;
    postsLastDay: Series;
    currentUsers: Series;
  };
  statuses: CommunityStatus[];
}

export interface PeerLocation {
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  count: number;
}

export interface Overview {
  generatedAt: string;
  range: RangeInfo;
  offlineAfterSeconds: number;
  network: {
    communitiesTotal: number;
    communitiesOnline: number | null;
    totalPosts: number | null;
    postsLastDay: number | null;
    currentUsers: number | null;
    servicesTotal: number;
    servicesUp: number | null;
    peers: { pubsub: number | null; pubsubProviders: number | null; ipnsProviders: number | null };
  };
  clients: ClientSummary[];
  peers: {
    series: { pubsub: Series; pubsubProviders: Series; ipnsProviders: Series };
    locations: PeerLocation[];
    countries: { country: string | null; count: number }[];
  };
  services: StatusRow[];
  routers: StatusRow[];
  nameResolvers: StatusRow[];
  gateways: StatusRow[];
  pubsubProviders: StatusRow[];
}

export interface ClientInfo {
  id: string;
  label: string;
  community: string;
  communities: string;
  postLabel: string;
  replyLabel: string;
  source: string;
  appUrl: string;
  communityUrlPrefix: string;
}

export interface CommunityRow {
  address: string;
  title?: string;
  directoryCode?: string;
  nsfw?: boolean;
  online: number | null;
  lastUpdateAge: number | null;
  posts: number | null;
  replies: number | null;
  postsLastDay: number | null;
  currentUsers: number | null;
  uniqueAddresses: number | null;
  pubsubPeers: number | null;
  lastPubsubMessageAge: number | null;
  uptime: number | null;
  history: Series;
}

export interface ClientView {
  generatedAt: string;
  range: RangeInfo;
  offlineAfterSeconds: number;
  client: ClientInfo;
  totals: {
    communitiesTotal: number;
    communitiesOnline: number | null;
    totalPosts: number | null;
    postsLastDay: number | null;
    currentUsers: number | null;
  };
  series: {
    communitiesOnline: Series;
    posts: Series;
    replies: Series;
    activeDay: Series;
    activeWeek: Series;
    activeMonth: Series;
    totalPosts: Series;
    totalReplies: Series;
  };
  communities: CommunityRow[];
}

export interface CommunityView {
  generatedAt: string;
  range: RangeInfo;
  community: { address: string; title?: string; directoryCode?: string };
  series: {
    online: Series;
    posts: Series;
    replies: Series;
    activeDay: Series;
    activeWeek: Series;
    activeMonth: Series;
    pubsubPeers: Series;
  };
}
