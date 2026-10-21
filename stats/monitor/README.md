## Bitsocial Stats Monitor

This service powers the Prometheus metrics behind the stats dashboard on `stats.bitsocial.net` and the operators' Grafana dashboards, plus its own JSON API.

### Running locally

```bash
yarn install
yarn start:stats-monitor -- --only webpages
```

For the full local stack (Prometheus, the stats dashboard and Grafana), use:

```bash
yarn stats:up
```

The main configuration lives in [config.js](./config.js). Community monitoring is client-aware:

- `5chan` is enabled via the generated snapshot from the official `5chan-directories/` files, with every board each directory lists
- `seedit` is enabled via the generated snapshot from `seedit-default-subscriptions.json`
- community labels are the public `.bso` addresses from those lists; the monitor resolves them to public keys with the BSO resolver
- future clients can be added through `monitoring.clients`
- container deployments can override the local Kubo RPC endpoints with `BITSOCIAL_STATS_KUBO_RPC_URL` and `BITSOCIAL_STATS_PUBSUB_KUBO_RPC_URL`

The API listens on port `3000` by default:

- `/` returns the current JSON snapshot
- `/history` returns stored snapshots over time
- `/metrics/prometheus` exposes Prometheus metrics

While it monitors community IPNS records, the monitor also writes every 5chan board's record time, stats and most popular threads to `exports/5chan-boards.json` once a minute, which the stats dashboard server serves at `/api/v1/5chan/boards` and `/api/v1/5chan/stats` (see [`../web/README.md`](../web/README.md#5chan-boards-provider)).

### Service probes and alerts

`monitoring.serviceProbes` contains HTTP checks that need stricter behavior than the basic webpage
HTML probes. The newsletter checks verify the public root page, CORS preflight, and a non-mutating
subscribe request. The subscribe probe posts a known-invalid list UUID to
`https://newsletter.bitsocial.net/api/bitsocial/subscribe` and expects the Bitsocial gateway to
return `403`. This does not create a subscriber, and it catches regressions where Caddy accidentally
routes the API path to raw listmonk.

Telegram alerts are disabled until these environment variables are set for the monitor container:

```bash
BITSOCIAL_STATS_TELEGRAM_BOT_TOKEN=
BITSOCIAL_STATS_TELEGRAM_CHAT_ID=
```

Alerts are sent only on state transitions: first failure, then recovery.

The monitor also polls `/proxy/stats` on the Kubo RPC proxy that `start-ipfs.js` runs in the ipfs
container, once a minute. It exports the counts as `bitsocial_stats_kubo_rpc_proxy_upstream_sockets`
(labeled by `pool` and `state`) and `bitsocial_stats_kubo_rpc_proxy_queued_requests`. It sends an
alert when the proxy holds more upstream sockets than `monitoring.kuboRpcProxy.maxUpstreamSockets`
in [config.js](./config.js), or when requests have waited for a pooled rpc socket for three polls in
a row. A socket leak like [#25](https://github.com/bitsocialnet/bitsocial-web/issues/25) is reported
that way long before it exhausts host TCP memory. With the monitor pointed straight at Kubo and no
proxy in between, the gauges stay empty and no alert is sent.
