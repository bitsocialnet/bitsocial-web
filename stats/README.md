# Stats

This subproject contains the Bitsocial stats stack behind `https://bitsocial.net/stats/`.

## What Lives Here

- Grafana dashboards and provisioning
- Prometheus scrape configuration
- Docker Compose files for local and deployed runtime
- VPS deployment docs and reverse-proxy config
- The monitor service package in [`stats/monitor`](./monitor)

## Important Notes

- `stats/` is the umbrella project. The executable Node service is [`stats/monitor`](./monitor).
- Public traffic reaches Grafana through shared dashboard URLs under `bitsocial.net/stats`, even though the Grafana app itself runs on the VPS.
- For stats-specific workflow rules, read [`stats/AGENTS.md`](./AGENTS.md).
