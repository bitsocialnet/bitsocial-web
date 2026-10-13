## Bitsocial VPS Deploy

This deployment layout assumes the repo is synced to `/srv/bitsocial-web/current` on the VPS. The VPS hosts the stats stack (monitor, Prometheus, the stats dashboard and Grafana) and serves `stats.bitsocial.net` directly; the public apex site and docs stay on Vercel.

### Expected host layout

- repo checkout: `/srv/bitsocial-web/current`
- host Caddy config: `/etc/caddy/Caddyfile`
- newsletter/listmonk remains on `newsletter.bitsocial.net` via `127.0.0.1:9000`
- newsletter gateway API traffic under `/api/bitsocial/*` goes to `127.0.0.1:9011`
- `stats.bitsocial.net` is served directly by VPS Caddy with automatic HTTPS (A record → this host)
- Caddy proxies `stats.bitsocial.net` to the stats dashboard service on `127.0.0.1:3302` ([`stats/web`](../web)), which serves `/`, `/5chan`, `/seedit`, its read-only `/api/v1/` API, and redirects for the old Grafana shared-dashboard links
- Grafana is no longer exposed publicly; it listens on `127.0.0.1:3300` for operators (see [Grafana access](#grafana-access))
- Compose binds Grafana, the monitor and the dashboard to the fixed loopback ports `3300`, `3301` and `3302`. The Caddyfile and the deploy receiver's health checks use these ports, so `stats/deploy/.env` cannot change them
- legacy `bitsocial.net/stats/*` URLs are 308-redirected by Vercel to `stats.bitsocial.net/*`; the old `:8080` origin is retired

### Automatic GitHub deployment

Every push to `master` runs [`.github/workflows/deploy-stats.yml`](../../.github/workflows/deploy-stats.yml). The workflow uses the protected `stats-production` environment and a forced-command SSH key that can only request deployment of an exact commit SHA.

The server-side receiver is installed at `/usr/local/sbin/bitsocial-stats-deploy` from [`deploy-from-github.sh`](./deploy-from-github.sh). It downloads the matching public GitHub archive, synchronizes it to `/srv/bitsocial-web/current`, preserves `stats/deploy/.env`, rebuilds the Docker Compose stack (the `web` service runs from the monitor image, which also builds the dashboard), refreshes the shared Grafana dashboards, runs health checks against the monitor, Grafana and the dashboard, installs the host Caddyfile when it changed (see [Activating Caddy](#activating-caddy)), and writes the deployed SHA to `/srv/bitsocial-web/current/.deploy-revision`.

Required `stats-production` environment configuration:

- variable: `STATS_DEPLOY_HOST`
- secret: `STATS_DEPLOY_SSH_KEY`
- secret: `STATS_DEPLOY_KNOWN_HOSTS`

The SSH public key on the server must use this forced command and restrictions:

```text
command="/usr/local/sbin/bitsocial-stats-deploy",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty,no-user-rc ssh-ed25519 ... github-actions:bitsocial-web-stats-production
```

### Manual sync fallback

If GitHub Actions is unavailable, regenerate the stats dashboards from the current default community lists and sync the repo from a local checkout:

```bash
yarn build:stats-dashboards
```

```bash
rsync -az --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.yarn' \
  --exclude '.playwright-cli' \
  --exclude '.firecrawl' \
  --exclude 'stats/monitor/scripts' \
  ./ root@HOST:/srv/bitsocial-web/current/
```

### Starting the stats stack

On the VPS:

```bash
cd /srv/bitsocial-web/current
cp stats/deploy/.env.example stats/deploy/.env
$EDITOR stats/deploy/.env
docker compose -f stats/deploy/compose.yaml up -d --build
```

Set `BITSOCIAL_STATS_TELEGRAM_BOT_TOKEN` and `BITSOCIAL_STATS_TELEGRAM_CHAT_ID` in
`stats/deploy/.env` to enable Telegram alerts for service probes. Leave them blank to keep
dashboard-only monitoring.

### Activating Caddy

On the production VPS, `/etc/caddy/Caddyfile` also serves sites that are not in this repository and holds private configuration, so it must never be replaced with `stats/deploy/Caddyfile`. Apply stats changes by editing only its `stats.bitsocial.net` block to match the repository's, keeping a copy to restore if the reload fails:

```bash
cp /etc/caddy/Caddyfile /root/Caddyfile.before
$EDITOR /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl reload caddy
```

Do not record the edited file's hash in `/var/lib/bitsocial-stats-deploy/caddyfile.sha256`. A recorded hash marks the file as receiver-managed, and the next deploy would replace it with the repository copy and drop the other sites.

After the stack passes its health checks, the deploy receiver installs `stats/deploy/Caddyfile` to `/etc/caddy/Caddyfile` only on a host whose file it recognizes: one of the Caddyfiles the repository committed for `stats.bitsocial.net` before deploys managed it, or the one it last installed (its hash is kept in `/var/lib/bitsocial-stats-deploy/caddyfile.sha256`). It validates the release's copy, swaps it in, reloads Caddy and restores the previous file if the reload fails. Any other file is left alone, and the deploy log says so with the file's hash. On the production VPS that log line appears on every deploy and is expected.

The receiver updates itself at the end of each deploy, so a change to the receiver takes effect from the following deploy. The GitHub workflow verifies whichever of the two sites is public.

### Grafana access

Grafana keeps running with the provisioned dashboards for ad-hoc queries, but only on the VPS loopback. Reach it through an SSH tunnel and log in with the admin credentials from `stats/deploy/.env`:

```bash
ssh -L 3300:127.0.0.1:3300 root@HOST
# then open http://127.0.0.1:3300/login
```

### Smoke checks

Verify the public stats subdomain:

```bash
curl -I https://stats.bitsocial.net/
curl -I https://stats.bitsocial.net/5chan
curl -I https://stats.bitsocial.net/seedit
curl -fsS "https://stats.bitsocial.net/api/v1/overview?range=6h" | head -c 300
curl -I https://stats.bitsocial.net/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186
curl -fsS http://127.0.0.1:9091/api/v1/targets
curl -fsS http://127.0.0.1:3301/metrics/prometheus | grep bitsocial_stats_service_probe_last_success
```

`/`, `/5chan`, and `/seedit` should return `200` with the dashboard, the overview API should return JSON, and the old shared-dashboard link should return a `301` to `/5chan`.

Once the stack is up, verify Grafana bootstrapped its dashboards and left the login-protected app closed off:

```bash
curl -I http://127.0.0.1:3300/login
curl -I http://127.0.0.1:3300/public-dashboards/e9277bcc0c421ddcacd29f591466678c
curl -I http://127.0.0.1:3300/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186
curl -I http://127.0.0.1:3300/public-dashboards/c770d7565c18df52dd26461c9191e05d
curl -i http://127.0.0.1:3300/api/ds/query
```

The shared dashboard URLs should return `200` on the loopback, while direct Grafana API access without a login should return `401`.

After Vercel deploy (legacy path redirects):

```bash
curl -I https://bitsocial.net/
curl -I https://bitsocial.net/stats/
curl -I https://bitsocial.net/stats/5chan
```

The legacy `/stats` paths on `bitsocial.net` should return `308` redirects to the matching URLs on `stats.bitsocial.net`.
