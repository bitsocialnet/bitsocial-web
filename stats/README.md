# Stats

This subproject contains the Bitsocial stats stack behind `https://stats.bitsocial.net/`.

## What Lives Here

- The public stats dashboard and its read-only API in [`stats/web`](./web)
- The monitor service package in [`stats/monitor`](./monitor)
- PromQL definitions shared by the dashboard and Grafana in [`stats/shared`](./shared)
- Grafana dashboards and provisioning for operators
- Prometheus scrape configuration
- Docker Compose files for local and deployed runtime
- VPS deployment docs and reverse-proxy config

## Important Notes

- `stats/` is the umbrella project. The executable Node services are the monitor ([`stats/monitor`](./monitor)) and the dashboard server ([`stats/web`](./web)), built into one image.
- Public traffic on `stats.bitsocial.net` reaches the dashboard, which queries Prometheus with a fixed set of queries. Grafana runs on the VPS loopback for operators only.
- For stats-specific workflow rules, read [`stats/AGENTS.md`](./AGENTS.md).
