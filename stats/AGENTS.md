# stats/AGENTS.md

These rules apply to the `stats/` subproject. Follow the repo-root [`AGENTS.md`](../AGENTS.md) first.

- `stats/` is an operations subproject, not a standalone frontend app. It contains Grafana dashboards, Prometheus config, Docker Compose, and deploy docs.
- The Node monitor lives in [`stats/monitor`](./monitor). Treat that package as the executable service and `stats/` itself as the umbrella project around it.
- Prefer editing dashboard generation inputs and provisioning files over hand-tweaking exported dashboard JSON unless the task is explicitly a one-off dashboard patch.
- Keep public naming Bitsocial-first in dashboards and docs. Use PKC/community terminology in repo-owned monitor code, and keep legacy upstream strings only where current compatibility requires them.
