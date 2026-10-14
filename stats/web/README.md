## Bitsocial Stats dashboard

The public dashboard at `https://stats.bitsocial.net/`: a Network overview at `/` and one view per client at `/5chan` and `/seedit`, each with a 6 hour to 14 day range (`?range=`). It replaced the Grafana shared dashboards as the public surface; Grafana still runs on the VPS for operators.

### How it fits together

- `src/` is a Vite + React + Tailwind single-page app.
- `server/server.mjs` serves the built app and a read-only JSON API whose responses are snapshots the server builds itself. Every 30 seconds [`server/snapshots.mjs`](./server/snapshots.mjs) rebuilds every view for every range, client and listed community from a fixed set of PromQL queries, and requests are answered from memory with a pre-compressed body and an ETag. Visitors only choose a view, a range from an allowlist and a community the monitor already lists, and never cause a Prometheus query, so traffic does not change the load on Prometheus. A view whose refresh fails keeps its previous snapshot, and the dashboard shows each response's age from its `generatedAt`.
- The PromQL lives in [`../shared/stats-queries.mjs`](../shared/stats-queries.mjs), shared with the Grafana dashboard generator so both report the same "online", "total posts" and "current users" numbers.
- Community names and order come from the monitor's snapshots in [`../monitor/data`](../monitor/data), refreshed by `yarn build:stats-dashboards`.

| Endpoint                                                  | Contents                                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `GET /api/v1/overview?range=`                             | Network totals, per-client summaries and community statuses, peers and locations, every service and provider |
| `GET /api/v1/clients/:client?range=`                      | One client's totals, activity series and every community with its availability history                       |
| `GET /api/v1/clients/:client/communities/:address?range=` | One community's activity, peer and availability series                                                       |

Ranges are `6h`, `24h` (default), `7d` and `14d`. Series share the response's `range.start` and `range.step`; availability values are the share of each step a check passed.

The old Grafana shared-dashboard URLs (`/public-dashboards/<token>`) redirect to the matching view.

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
