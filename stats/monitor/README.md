## Bitsocial Stats Monitor

This service powers the Prometheus metrics and JSON API used by the Grafana dashboards under `bitsocial.net/stats`.

### Running locally

```bash
yarn install
yarn start:stats-monitor -- --only webpages
```

For the full local Grafana stack, use:

```bash
yarn stats:up
```

The main configuration lives in [config.js](./config.js). Community monitoring is client-aware:

- `5chan` is enabled now via the official `5chan-directories.json` list
- `5chan` community labels remain the public `.bso` aliases, but the monitor queries the matching `.eth` community internally because that is what current clients resolve against
- future clients can be added through `monitoring.clients`
- container deployments can override the local Kubo RPC endpoints with `BITSOCIAL_STATS_KUBO_RPC_URL` and `BITSOCIAL_STATS_PUBSUB_KUBO_RPC_URL`

The API listens on port `3000` by default:

- `/` returns the current JSON snapshot
- `/history` returns stored snapshots over time
- `/metrics/prometheus` exposes Prometheus metrics
