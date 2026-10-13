# stats/AGENTS.md

These rules apply to the `stats/` subproject. Follow the repo-root [`AGENTS.md`](../AGENTS.md) first.

- `stats/` is an operations subproject. It contains the public stats dashboard, Grafana dashboards, Prometheus config, Docker Compose, and deploy docs.
- The Node monitor lives in [`stats/monitor`](./monitor). Treat that package as the executable data collector and `stats/` itself as the umbrella project around it.
- The public dashboard lives in [`stats/web`](./web): a Vite/React SPA plus `server/server.mjs`, which serves it and a read-only API over Prometheus. Keep every PromQL expression fixed on the server; requests may only pick allowlisted views, ranges, clients, and listed community addresses.
- Define "online", post and user counts once in [`stats/shared/stats-queries.mjs`](./shared/stats-queries.mjs) so the dashboard and Grafana agree. Run `yarn workspace @bitsocial/stats-web test` and `yarn build:stats-web` after changing the API, queries, or UI.
- The dashboard is built into the monitor's Docker image and runs as the Compose `web` service; host Caddy changes are installed by hand (see [`stats/deploy/README.md`](./deploy/README.md)).
- Prefer editing dashboard generation inputs and provisioning files over hand-tweaking exported dashboard JSON unless the task is explicitly a one-off dashboard patch.
- Keep public naming Bitsocial-first in dashboards and docs. Use PKC/community terminology in repo-owned monitor code, and keep legacy upstream strings only where current compatibility requires them.
