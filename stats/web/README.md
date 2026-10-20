## Bitsocial Stats dashboard

The public dashboard at `https://stats.bitsocial.net/`: a Network overview at `/` and one view per client at `/5chan` and `/seedit`, each with a 6 hour to 14 day range (`?range=`). It replaced the Grafana shared dashboards as the public surface; Grafana still runs on the VPS for operators.

### How it fits together

- `src/` is a Vite + React + Tailwind single-page app.
- `server/server.mjs` serves the built app and a read-only JSON API whose responses are snapshots the server builds itself. Every 30 seconds [`server/snapshots.mjs`](./server/snapshots.mjs) rebuilds every view for every range, client and listed community from a fixed set of PromQL queries, and requests are answered from memory with a pre-compressed body and an ETag. Visitors only choose a view, a range from an allowlist and a community the monitor already lists, and never cause a Prometheus query, so traffic does not change the load on Prometheus. A view whose queries all fail in a pass keeps its previous snapshot, and the dashboard shows each response's age from its `generatedAt`, turning amber once it is over 5 minutes old.
- The PromQL lives in [`../shared/stats-queries.mjs`](../shared/stats-queries.mjs), shared with the Grafana dashboard generator so both report the same "online", "total posts" and "current users" numbers.
- Community names and order come from the monitor's snapshots in [`../monitor/data`](../monitor/data), refreshed by `yarn build:stats-dashboards`.

| Endpoint                                                  | Contents                                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `GET /api/v1/overview?range=`                             | Network totals, per-client summaries and community statuses, peers and locations, every service and provider |
| `GET /api/v1/clients/:client?range=`                      | One client's totals, activity series and every community with its availability history                       |
| `GET /api/v1/clients/:client/communities/:address?range=` | One community's activity, peer and availability series                                                       |
| `GET /api/v1/5chan/boards`                                | Every 5chan board's record time, stats and most popular threads, for the 5chan home page (see below)         |

Ranges are `6h`, `24h` (default), `7d` and `14d`. Series share the response's `range.start` and `range.step`; availability values are the share of each step a check passed.

The old Grafana shared-dashboard URLs (`/public-dashboards/<token>`) redirect to the matching view.

### 5chan boards provider

`GET /api/v1/5chan/boards` lets the 5chan home page render its Popular Threads and Stats boxes at once instead of first downloading every board over P2P. It lists every board in every active 5chan directory, including the boards competing with each directory's default, and takes no parameters (any query string is ignored).

```json
{
  "version": 1,
  "generatedAt": 1792500000,
  "boards": [
    {
      "address": "anime-and-manga.bso",
      "publicKey": "12D3KooW...",
      "directoryCode": "a",
      "updatedAt": 1792499000,
      "stats": { "statsCid": "Qm...", "allPostCount": 123, "allReplyCount": 456, "weekActiveUserCount": 7 },
      "threads": [{ "cid": "Qm...", "raw": { "comment": {}, "commentUpdate": {} } }]
    }
  ]
}
```

- `generatedAt` (when the monitor last picked the threads) and `updatedAt` (the board record's own `updatedAt`) are unix seconds. A board the monitor has not fetched yet has `updatedAt: null`, `stats: null` and `threads: []`.
- `stats` holds the count fields of the stats file the record's `statsCid` points to (`allPostCount`, `allReplyCount`, `weekActiveUserCount` and the other hour to all-time `ActiveUser`/`Post`/`Reply` counts) plus that `statsCid`.
- `threads` holds at most one thread: the board's most popular one from the page its record preloads (the first key of `posts.pages`, which for 5chan boards is `active`, not `hot`; a record with no preloaded page has none). Pinned, locked, removed and deleted threads and threads without a link are skipped, the rest are ranked by the 5chan home page's score, `max(replyCount, 0.1) / (1 + age / 72h)` with the age counted from `lastReplyTimestamp`, else the thread's `timestamp`, and the best thread with media (a `thumbnailUrl`, or a link to an image, video or audio file) wins over a better-scored plain link. A board with only plain links still gets its best one.
- `raw.comment` and `raw.commentUpdate` are the objects exactly as the board published them. That includes `commentUpdate.replies`, the signed preview of the thread's replies, which makes up most of the payload and cannot be left out without breaking the signature. With the real 68 boards in October 2026 the response was about 0.8 MB, 0.17 MB gzipped.
- Clients must treat the threads like any other page from a peer: verify the author signature on `raw.comment`, the community signature on `raw.commentUpdate`, and that `raw.comment` hashes to `cid`. The stats numbers cannot be verified that way; they are what this provider read from each board's `statsCid`.

How it updates: on each IPNS pass (every 10 minutes) the monitor keeps every 5chan board's record and stats, and once a minute writes the boards to `stats/monitor/exports/5chan-boards.json` (`BITSOCIAL_STATS_5CHAN_BOARDS_PATH` overrides the path), replacing it atomically. Compose shares that directory between the monitor and this server through a volume (`stats-monitor-exports` locally, `bitsocial-stats-monitor-exports` in [`../deploy/compose.yaml`](../deploy/compose.yaml)). This server reads the file on its own 60 second schedule, never per request, and answers from memory with an ETag, `Cache-Control: public, max-age=60` and `Access-Control-Allow-Origin: *`, since the data is public and read from 5chan's web, Android and Electron origins. Like the other API documents, the body is gzipped once per snapshot and sent compressed to clients that accept gzip; Caddy's `encode gzip` passes an already-encoded response through, so the Caddy block needs no change. A restarted monitor starts from its last file, and a file that fails to parse keeps the previous snapshot. Until the first file exists the endpoint answers `502`.

### Development

Run the whole stack (monitor, Prometheus, Grafana and this dashboard) with Docker:

```bash
yarn start:stats
```

For hot reload while editing the UI, keep the stack running and start Vite, which proxies `/api` to the dashboard container on `127.0.0.1:3302` (set `STATS_API_URL` to use another server):

```bash
yarn start:stats-web
```

The API server also runs outside Docker against any Prometheus: `BITSOCIAL_STATS_PROMETHEUS_URL=http://127.0.0.1:9091 PORT=3302 yarn workspace @bitsocial/stats-web start`. It serves `dist/` when a build exists and the API alone otherwise.

Checks:

```bash
yarn build:stats-web
yarn workspace @bitsocial/stats-web test
```

The peer map's dot-matrix basemap in `src/lib/world-dots.ts` is generated from Natural Earth land polygons; rerun `yarn workspace @bitsocial/stats-web generate:world-dots` only when its grid settings change.
