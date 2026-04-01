## Bitsocial Grafana

This directory contains the Grafana dashboards and provisioning files for `bitsocial.net/stats`.

### Sources

- `upstream/plebbit-status.json` is the exported public dashboard from `plebbit.online`
- `upstream/plebbit-uptime-monitor.json` is the exported internal dashboard used as a reference while porting sections

### Regenerating dashboards

The checked-in Bitsocial dashboards are generated from the upstream public dashboard plus the official 5chan directory snapshot:

```bash
yarn build:stats-dashboards
```

That generation step keeps the panel layout close to `plebbit.online` while:

- switching public wording from `Plebbit` / `Subplebbit` to Bitsocial / Community terminology
- rewriting Prometheus queries to the `bitsocial_stats_*` metric namespace
- pruning the old legacy community set down to the official 5chan default communities
- hiding the NFT section for the first Bitsocial rollout

### Running locally

Boot the full local stack with:

```bash
yarn stats:up
```

Useful local URLs:

- Grafana summary dashboard: `http://127.0.0.1:3300/`
- Grafana 5chan dashboard: `http://127.0.0.1:3300/d/bitsocial-5chan/5chan-stats`
- Prometheus targets: `http://127.0.0.1:9091/targets`
- Monitor JSON API: `http://127.0.0.1:3301/`

Local Grafana admin credentials are `bitsocial` / `bitsocial`.
