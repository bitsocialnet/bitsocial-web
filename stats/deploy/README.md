## Bitsocial VPS Deploy

This deployment layout assumes the repo is synced to `/srv/bitsocial-web/current` on the VPS. The VPS hosts the Grafana/Prometheus stack and serves `stats.bitsocial.net` directly; the public apex site and docs stay on Vercel.

### Expected host layout

- repo checkout: `/srv/bitsocial-web/current`
- host Caddy config: `/etc/caddy/Caddyfile`
- newsletter/listmonk remains on `newsletter.bitsocial.net` via `127.0.0.1:9000`
- newsletter gateway API traffic under `/api/bitsocial/*` goes to `127.0.0.1:9011`
- `stats.bitsocial.net` is served directly by VPS Caddy with automatic HTTPS (A record → this host)
- Caddy redirects `/` and `/5chan` on `stats.bitsocial.net` to Grafana shared-dashboard URLs so visitors land on the public view without anonymous access to the full Grafana app
- legacy `bitsocial.net/stats/*` URLs are 308-redirected by Vercel to `stats.bitsocial.net/*`; the old `:8080` origin is retired

### Automatic GitHub deployment

Every push to `master` runs [`.github/workflows/deploy-stats.yml`](../../.github/workflows/deploy-stats.yml). The workflow uses the protected `stats-production` environment and a forced-command SSH key that can only request deployment of an exact commit SHA.

The server-side receiver is installed at `/usr/local/sbin/bitsocial-stats-deploy` from [`deploy-from-github.sh`](./deploy-from-github.sh). It downloads the matching public GitHub archive, synchronizes it to `/srv/bitsocial-web/current`, preserves `stats/deploy/.env`, rebuilds the Docker Compose stack, refreshes the shared Grafana dashboards, runs health checks, and writes the deployed SHA to `/srv/bitsocial-web/current/.deploy-revision`.

Required `stats-production` environment configuration:

- variable: `STATS_DEPLOY_HOST`
- secret: `STATS_DEPLOY_SSH_KEY`
- secret: `STATS_DEPLOY_KNOWN_HOSTS`

The SSH public key on the server must use this forced command and restrictions:

```text
command="/usr/local/sbin/bitsocial-stats-deploy",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty,no-user-rc ssh-ed25519 ... github-actions:bitsocial-web-stats-production
```

### Manual sync fallback

If GitHub Actions is unavailable, regenerate the stats dashboards from the active 5chan directory files and sync the repo from a local checkout:

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

Install `stats/deploy/Caddyfile` to `/etc/caddy/Caddyfile`, then validate and reload:

```bash
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl reload caddy
```

### Smoke checks

Verify the public stats subdomain:

```bash
curl -I https://stats.bitsocial.net/
curl -I https://stats.bitsocial.net/5chan
curl -fsS http://127.0.0.1:9091/api/v1/targets
curl -fsS http://127.0.0.1:3301/metrics/prometheus | grep bitsocial_stats_service_probe_last_success
```

The `curl -I` checks for `/` and `/5chan` should return `302` redirects to the corresponding public dashboard URLs.

Once the stack is up, verify Grafana bootstrapped the public dashboards and left the login-protected app closed off:

```bash
curl -I http://127.0.0.1:3300/login
curl -I http://127.0.0.1:3300/public-dashboards/e9277bcc0c421ddcacd29f591466678c
curl -I http://127.0.0.1:3300/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186
curl -i http://127.0.0.1:3300/api/ds/query
```

The shared dashboard URLs should return `200`, while direct Grafana API access without a login should return `401`.

After Vercel deploy (legacy path redirects):

```bash
curl -I https://bitsocial.net/
curl -I https://bitsocial.net/stats/
curl -I https://bitsocial.net/stats/5chan
```

The legacy `/stats` paths on `bitsocial.net` should return `308` redirects to the matching URLs on `stats.bitsocial.net`.
