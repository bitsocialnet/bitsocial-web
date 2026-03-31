# Progress Log

Append one entry per session.

## 2026-03-31 18:05

- Item: F001
- Summary: Created the new `codex/feature/stats-monorepo` worktree and defined the long-running task slices for the monorepo split, stats stack, VPS deployment, and production cutover.
- Files: `docs/agent-runs/stats-monorepo/feature-list.json`, `docs/agent-runs/stats-monorepo/progress.md`
- Verification: `git branch --show-current`, `git log --oneline -5`
- Blockers: Fresh worktrees do not have a local Yarn install state, so `./scripts/agent-init.sh --smoke` cannot boot the dev server until `corepack yarn install` is run in that worktree.
- Next: Run `corepack yarn install`, repeat the smoke baseline, then start the top-level `about/`, `docs/`, and `stats/` split.

## 2026-03-31 20:20

- Item: F001, F002
- Summary: Completed the top-level repo split in commit `755bf87` and built the first Bitsocial-native monitor batch: workspace wiring, 5chan community ingestion from `bitsocialnet/lists`, client-aware community labels, Bitsocial metric prefixes, and public API aliases for communities, seeders, and previewers.
- Files: `package.json`, `yarn.lock`, `stats/monitor/**`, `docs/agent-runs/stats-monorepo/feature-list.json`, `docs/agent-runs/stats-monorepo/progress.md`
- Verification: `corepack yarn install`, `corepack yarn lint`, `corepack yarn typecheck`, `corepack yarn build`, `corepack yarn format`, `corepack yarn format:check`, `corepack yarn knip`
- Blockers: `knip` is advisory-only here and currently misreports the new untracked stats workspace until the package is fully staged and the Grafana/Prometheus pieces exist.
- Next: Stage and commit the monitor batch separately, then build Grafana provisioning and deployment files in their own commits.

## 2026-03-31 20:48

- Item: F002
- Summary: Finished the monitor batch by switching 5chan directory aliases from public `.bso` labels to internal `.eth` fetch targets, removing the non-working direct `bso-resolver` dependency from the monitor, and fixing startup so stale `monitorState.json` snapshots cannot keep old community targets alive.
- Files: `stats/monitor/config.js`, `stats/monitor/lib/community-addresses.js`, `stats/monitor/monitor.js`, `stats/monitor/package.json`, `stats/monitor/README.md`, `yarn.lock`
- Verification: `corepack yarn install`, `node -e "import('./stats/monitor/lib/community-addresses.js')..."`, `corepack yarn workspace @bitsocial/stats-monitor start -- --only subplebbitsIpns --apiPort 3301`, `curl -fsS http://127.0.0.1:3301/ | jq '.communities[\"anime-and-manga.bso\"]'`, `curl -fsS http://127.0.0.1:3301/metrics/prometheus | rg '^bitsocial_stats_(community|last_community)'`, `corepack yarn lint`, `corepack yarn typecheck`, `corepack yarn format:check`, `corepack yarn build`
- Blockers: Live 5chan community fetches now resolve through `.eth`, but the gateway layer is currently returning `ERR_FAILED_TO_FETCH_SUBPLEBBIT_FROM_GATEWAYS` for all sampled communities, so the Grafana dashboards need to present this as current network health rather than assuming a monitor bug.
- Next: Commit the monitor slice, then build Grafana and Prometheus provisioning against these Bitsocial metrics in a separate batch.
