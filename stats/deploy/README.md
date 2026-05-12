## Bitsocial VPS Deploy

This deployment layout assumes the repo is synced to `/srv/bitsocial-web/current` on the VPS. The VPS hosts the Grafana/Prometheus stack only; the public apex site and docs stay on Vercel.

### Expected host layout

- repo checkout: `/srv/bitsocial-web/current`
- host Caddy config: `/etc/caddy/Caddyfile`
- newsletter/listmonk remains on `newsletter.bitsocial.net` via `127.0.0.1:9000`
- newsletter gateway API traffic under `/api/bitsocial/*` goes to `127.0.0.1:9011`
- Vercel owns `bitsocial.net` and proxies `/stats` to this VPS origin at `http://91.234.199.189:8080/stats`
- the VPS entrypoint redirects `/stats` and `/stats/5chan` to Grafana shared-dashboard URLs so visitors land on the public view without anonymous access to the full Grafana app

### Syncing a release

From a local checkout, sync the repo:

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

Before or after Vercel cutover, verify the VPS origin directly:

```bash
curl -I http://91.234.199.189:8080/stats
curl -I http://91.234.199.189:8080/stats/
curl -I http://91.234.199.189:8080/stats/5chan
curl -fsS http://127.0.0.1:9091/api/v1/targets
curl -fsS http://127.0.0.1:3301/metrics/prometheus | grep bitsocial_stats_service_probe_last_success
```

The `curl -I` checks for `/stats` and `/stats/5chan` should now return `302` redirects to the corresponding public dashboard URLs.

Once the stack is up, verify Grafana bootstrapped the public dashboards and left the login-protected app closed off:

```bash
curl -I http://127.0.0.1:3300/login
curl -I http://127.0.0.1:3300/public-dashboards/e9277bcc0c421ddcacd29f591466678c
curl -I http://127.0.0.1:3300/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186
curl -i http://127.0.0.1:3300/api/ds/query
```

The shared dashboard URLs should return `200`, while direct Grafana API access without a login should return `401`.

After Vercel deploy:

```bash
curl -I https://bitsocial.net/
curl -I https://bitsocial.net/docs/
curl -I https://bitsocial.net/stats/
curl -I https://bitsocial.net/stats/5chan
```
