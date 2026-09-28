---
title: Pubsub Provider
description: Fallback pubsub relay at delegated routing provider para sa mga operator ng Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Ang Pubsub Provider ay isang serbisyo para sa mga operator na nagpapatakbo ng Bitsocial-compatible na pubsub fallback relay kasama ang isang nakabundle na Kubo node. Ang mga makabagong Bitsocial client gaya ng 5chan at Seedit ay gumagamit ng purong peer-to-peer networking sa browser bilang default, ngunit nananatiling kapaki-pakinabang ang serbisyong ito bilang opsyonal na fallback path para sa mga user na nag-di-disable ng browser P2P o para sa mga operator na gustong magkaroon ng pampublikong compatibility endpoint.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Lisensya**: GPL-3.0-or-later

## Ano ang Pinapatakbo Nito

- isang pampublikong HTTP proxy para sa mga ruta ng pubsub, gateway, name-provider, at delegated routing
- isang nakabundle na Kubo node na may naka-enable na pubsub
- isang delegated HTTP routing provider sa `/routing/v1/providers`
- Prometheus metrics sa `/metrics`
- opsyonal na basic-auth na access sa buong Kubo RPC API

## Mga Port

Pinili ang mga default upang makatakbo ang Pubsub Provider katabi ng [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) sa iisang VPS nang walang banggaan sa swarm port.

| Layunin                 | Default                      | Mga Tala                                                           |
| ----------------------- | ---------------------------- | ------------------------------------------------------------------ |
| Pampublikong HTTP proxy | `8000` app, `80` Docker host | Itakda ang `PUBSUB_PROVIDER_HTTP_PORT` para baguhin ang host port. |
| Kubo swarm              | `4002` TCP/UDP               | Iniiwasan ang default na Kubo swarm port `4001` ng seeder.         |
| Kubo API                | `5001` lokal lamang          | Ginagamit nang internal ng proxy.                                  |
| Kubo gateway            | `8080` lokal lamang          | Ginagamit nang internal ng proxy.                                  |

## Pag-setup ng Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Suriin ang mga log:

```bash
docker logs --follow pubsub-provider
```

Subukan ang proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Pag-upgrade

Kung dati kang nagpapatakbo ng lumang `latest` na image, pilitin ang Compose na muling likhain ang container mula sa naka-pin at nailathalang image:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

I-verify na tumatakbo ang naayos na image:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Dapat may kasamang `using Kubo binary at /app/bin/ipfs` ang mga log at hindi dapat kasama ang `downloading ipfs`.

## Pagpapatakbo Kasama ang Bitsocial Seeder

Kung nagpapatakbo rin ang parehong host ng `bitsocial-seeder`, panatilihin ang Pubsub Provider sa swarm port `4002` o sa ibang port na hindi `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Iniiwasan nito ang banggaan sa port na nangyayari kapag dalawang Kubo node ang parehong sumusubok na mag-bind sa TCP/UDP `4001`.

## Konpigurasyon

Mga karaniwang override sa environment:

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

Gamitin ang provider bilang fallback relay, hindi bilang kapalit ng browser P2P. Patuloy na patakbuhin nang hiwalay ang tracker infrastructure kapag kailangan ng network ng nakalaang kapasidad para sa peer discovery.
