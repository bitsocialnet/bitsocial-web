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

## 2026-03-31 21:10

- Item: F002, F003
- Summary: Finished the local Grafana/Prometheus stack around the Bitsocial monitor: generated the summary and 5chan dashboards from the `plebbit.online` export, provisioned Grafana and Prometheus, added a shared container image for the monitor and IPFS sidecar, and verified that Grafana boots with the expected row structure and world map panel.
- Files: `package.json`, `.gitignore`, `stats/compose.yaml`, `stats/grafana/**`, `stats/monitor/Dockerfile`, `stats/monitor/README.md`, `stats/monitor/config.js`, `stats/prometheus/prometheus.yml`, `docs/agent-runs/stats-monorepo/feature-list.json`, `docs/agent-runs/stats-monorepo/progress.md`
- Verification: `corepack yarn build:stats-dashboards`, `docker compose -f stats/compose.yaml config`, `docker compose -f stats/compose.yaml up -d --build`, `docker compose -f stats/compose.yaml ps`, `curl -fsS http://127.0.0.1:3301/metrics/prometheus | rg '^bitsocial_stats_'`, `curl -fsS 'http://127.0.0.1:9091/api/v1/targets' | jq '.data.activeTargets[] | {job:.labels.job, health:.health, lastError:.lastError, scrapeUrl:.scrapeUrl}'`, `curl -fsS http://127.0.0.1:3300/api/search | jq '[.[] | {uid,title,type}]'`, `curl -fsS http://127.0.0.1:3301/ | jq '{clientCount:(.clients|length), clients:(.clients|keys), communityCount:(.communities|length), fivechan:(.clients["5chan"].communityCount)}'`, `playwright-cli -s=statsdash open http://127.0.0.1:3300/d/bitsocial-stats/bitsocial-stats`, `playwright-cli -s=statsdash snapshot`, `playwright-cli -s=statsdash goto http://127.0.0.1:3300/d/bitsocial-5chan/5chan-stats`, `playwright-cli -s=statsdash resize 390 844`, `playwright-cli -s=statsdash snapshot`
- Blockers: The imported `plebbit-js` stack pulls `skia-canvas`, so the shared monitor image needed `libfontconfig1` before the monitor could start inside Docker. Community fetch panels still reflect live network failures from the current gateways, but the dashboards themselves now render and scrape correctly.
- Next: Commit this Grafana/Prometheus batch, then move on to the VPS deployment and host Caddy routing in a separate commit.

## 2026-03-31 21:27

- Item: F004
- Summary: Deployed the new about/docs/stats stack to the newsletter VPS at `91.234.199.189`: synced the repo checkout into `/srv/bitsocial-web/current`, created the production-only Grafana env file, brought up the loopback-only Docker Compose stack for Grafana, Prometheus, the monitor, and IPFS, then replaced the host Caddy config so `bitsocial.net` can serve the about site, docs, and Grafana-backed `/stats` without affecting `newsletter.bitsocial.net`.
- Files: `stats/deploy/.env.example`, `stats/deploy/compose.yaml`, `stats/deploy/Caddyfile`, `stats/deploy/README.md`, `docs/agent-runs/stats-monorepo/feature-list.json`, `docs/agent-runs/stats-monorepo/progress.md`
- Verification: `rsync -az --delete --exclude '.git' --exclude 'node_modules' --exclude '.yarn' --exclude '.playwright-cli' --exclude '.firecrawl' ./ root@91.234.199.189:/srv/bitsocial-web/current/`, `ssh root@91.234.199.189 docker compose -f /srv/bitsocial-web/current/stats/deploy/compose.yaml up -d --build`, `ssh root@91.234.199.189 docker compose -f /srv/bitsocial-web/current/stats/deploy/compose.yaml ps`, `ssh root@91.234.199.189 curl -fsS http://127.0.0.1:3301/metrics/prometheus | grep -m 10 '^bitsocial_stats_'`, `ssh root@91.234.199.189 curl -fsS 'http://127.0.0.1:9091/api/v1/targets' | jq '.data.activeTargets[] | {job:.labels.job, health:.health, lastError:.lastError, scrapeUrl:.scrapeUrl}'`, `ssh root@91.234.199.189 curl -fsS http://127.0.0.1:3300/api/search | jq '[.[] | {uid,title,type}]'`, `ssh root@91.234.199.189 curl -fsS http://127.0.0.1:3301/ | jq '{clientCount:(.clients|length), clients:(.clients|keys), communityCount:(.communities|length), fivechan:(.clients["5chan"].communityCount)}'`, `ssh root@91.234.199.189 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile`, `ssh root@91.234.199.189 systemctl reload caddy`, `ssh root@91.234.199.189 curl -I -H 'Host: bitsocial.net' http://127.0.0.1/`, `ssh root@91.234.199.189 curl -I -H 'Host: bitsocial.net' http://127.0.0.1/docs/`, `ssh root@91.234.199.189 curl -I -H 'Host: bitsocial.net' http://127.0.0.1/stats/`, `ssh root@91.234.199.189 curl -I -H 'Host: bitsocial.net' http://127.0.0.1/stats/5chan`
- Blockers: Public HTTPS still resolves through Cloudflare's existing `301` redirect to `https://github.com/bitsocialnet`, so the final production smoke checks cannot pass until the user updates the root-domain routing. Because DNS still points elsewhere, Caddy also cannot complete a real `bitsocial.net` certificate issuance yet.
- Next: Commit the deployment batch, then wait for the Cloudflare cutover so the public `https://bitsocial.net/`, `/docs`, `/stats`, and `/stats/5chan` checks can be run end-to-end.

## 2026-04-01 13:50

- Item: F005
- Summary: Finished the public cutover with Vercel owning `bitsocial.net` and `docs`, while `/stats` is now proxied through Vercel to the VPS-hosted Grafana origin at `http://91.234.199.189:8080/stats`. This required a final production batch to pin the Vercel build to Node 22, disable Docusaurus git last-update metadata on Vercel, flatten the landing-page output into `dist/` instead of `dist/about/`, and add explicit Vercel rewrites for `/stats`, `/stats/`, and `/stats/:path*`.
- Files: `.gitignore`, `package.json`, `vercel.json`, `about/vite.config.ts`, `docs/docusaurus.config.ts`, `stats/deploy/Caddyfile`, `stats/deploy/README.md`, `docs/agent-runs/stats-monorepo/feature-list.json`, `docs/agent-runs/stats-monorepo/progress.md`
- Verification: `corepack yarn install`, `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`, `corepack yarn format:check`, `VERCEL=1 corepack yarn build`, `vercel deploy --prod --yes --scope toms-projects-2188af94`, `curl -I https://bitsocial.net/`, `curl -I https://bitsocial.net/docs/`, `curl -I https://bitsocial.net/stats/`, `curl -I https://bitsocial.net/stats/5chan`, `curl -s https://bitsocial.net/stats/ | rg 'grafana'`, `playwright-cli -s=prodstats open https://bitsocial.net/stats/`, `playwright-cli -s=prodstats goto https://bitsocial.net/stats/5chan`, `playwright-cli -s=prodstats snapshot`
- Blockers: Grafana Live websocket handshakes at `/stats/api/live/ws` still return `400` through the Vercel proxy. The dashboards render and refresh via normal HTTP requests, but live websocket features are effectively unavailable behind this route shape.
- Next: Commit the Vercel-routing batch, then decide whether the Grafana Live websocket limitation is acceptable or whether the stats page should eventually move to an origin that supports websocket proxying end to end.
