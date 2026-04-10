## Bitsocial Grafana

This directory contains the Grafana dashboards and provisioning files for `bitsocial.net/stats`.

### Sources

The `upstream/` directory stores the exported public and internal reference dashboards used while porting the stats experience to Bitsocial.

### Regenerating dashboards

The checked-in Bitsocial dashboards are generated from the upstream reference dashboard plus the official 5chan directory snapshot:

```bash
yarn build:stats-dashboards
```

That generation step keeps the panel layout close to the upstream reference dashboards while:

- switching public wording to Bitsocial / Community terminology
- rewriting Prometheus queries to the `bitsocial_stats_*` metric namespace
- pruning the old legacy community set down to the official 5chan default communities
- hiding the NFT section for the first Bitsocial rollout

### Running locally

Boot the full local stack with:

```bash
yarn stats:up
```

Useful local URLs:

- Grafana login: `http://127.0.0.1:3300/login`
- Public summary dashboard: `http://127.0.0.1:3300/public-dashboards/e9277bcc0c421ddcacd29f591466678c`
- Public 5chan dashboard: `http://127.0.0.1:3300/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186`
- Prometheus targets: `http://127.0.0.1:9091/targets`
- Monitor JSON API: `http://127.0.0.1:3301/`

Local Grafana admin credentials are `bitsocial` / `bitsocial`.
