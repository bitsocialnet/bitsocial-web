## Bitsocial VPS Deploy

This deployment layout assumes the repo is synced to `/srv/bitsocial-web/current` on the VPS. The VPS hosts the Grafana/Prometheus stack only; the public apex site and docs stay on Vercel.

### Expected host layout

- repo checkout: `/srv/bitsocial-web/current`
- host Caddy config: `/etc/caddy/Caddyfile`
- newsletter/listmonk remains on `newsletter.bitsocial.net` via `127.0.0.1:9000`
- Vercel owns `bitsocial.net` and proxies `/stats` to this VPS origin at `http://91.234.199.189:8080/stats`

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
```

After Vercel deploy:

```bash
curl -I https://bitsocial.net/
curl -I https://bitsocial.net/docs/
curl -I https://bitsocial.net/stats/
curl -I https://bitsocial.net/stats/5chan
```
