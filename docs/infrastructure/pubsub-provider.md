---
title: Pubsub Provider
description: Fallback pubsub relay and delegated routing provider for Bitsocial operators.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider is an operator service for running a Bitsocial-compatible pubsub fallback relay with a bundled Kubo node. Modern Bitsocial clients such as 5chan and Seedit use pure peer-to-peer networking in the browser by default, but this service remains useful as an optional fallback path for users who disable browser P2P or for operators who want public compatibility endpoints.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **License**: GPL-3.0-or-later

## What It Runs

- a public HTTP proxy for pubsub, gateway, name-provider, and delegated routing routes
- a bundled Kubo node with pubsub enabled
- a delegated HTTP routing provider at `/routing/v1/providers`
- Prometheus metrics at `/metrics`
- optional basic-auth access to the full Kubo RPC API

## Ports

The defaults are chosen so Pubsub Provider can run next to [Bitsocial Seeder](/apps/bitsocial-seeder/) on the same VPS without a swarm-port conflict.

| Purpose           | Default                      | Notes                                                |
| ----------------- | ---------------------------- | ---------------------------------------------------- |
| Public HTTP proxy | `8000` app, `80` Docker host | Set `PUBSUB_PROVIDER_HTTP_PORT` to change host port. |
| Kubo swarm        | `4002` TCP/UDP               | Avoids the seeder's default Kubo swarm port `4001`.  |
| Kubo API          | `5001` local only            | Used internally by the proxy.                        |
| Kubo gateway      | `8080` local only            | Used internally by the proxy.                        |

## Docker Setup

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Check logs:

```bash
docker logs --follow pubsub-provider
```

Test the proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Upgrading

If you previously ran the old `latest` image, force Compose to recreate the container from the pinned published image:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Verify the fixed image is running:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

The logs should include `using Kubo binary at /app/bin/ipfs` and should not include `downloading ipfs`.

## Running With Bitsocial Seeder

If the same host also runs `bitsocial-seeder`, keep Pubsub Provider on swarm port `4002` or another non-`4001` port:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

This avoids the port conflict that happens when two Kubo nodes both try to bind TCP/UDP `4001`.

## Configuration

Common environment overrides:

```env
PUBSUB_PROVIDER_HTTP_PORT=80
PUBSUB_PROVIDER_SWARM_PORT=4002
PUBSUB_PROVIDER_PORTS=8000
KUBO_RPC_URL=http://127.0.0.1:5001/api/v0
IPFS_GATEWAY_URL=http://127.0.0.1:8080
HTTP_ROUTER_URLS=https://example-router.invalid
PUBSUB_PROVIDER_ROUTING_STORE_PATH=
BASIC_AUTH_USERNAME=
BASIC_AUTH_PASSWORD=
IPFS_GATEWAY_USE_SUBDOMAINS=false
SHUTDOWN_KEY=
ETH_PROVIDER_URL=
ETH_PROVIDER_URL_WS=
SOL_PROVIDER_URL=
```

Use the provider as a fallback relay, not as a replacement for browser P2P. Keep running the tracker infrastructure separately when the network needs dedicated peer discovery capacity.
