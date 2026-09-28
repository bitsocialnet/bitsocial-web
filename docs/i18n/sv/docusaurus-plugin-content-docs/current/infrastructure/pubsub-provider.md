---
title: Pubsub Provider
description: Reservrelä för pubsub och leverantör av delegerad routing för Bitsocial-operatörer.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider är en operatörstjänst för att köra ett Bitsocial-kompatibelt reservrelä för pubsub med en medföljande Kubo-nod. Moderna Bitsocial-klienter som 5chan och Seedit använder som standard ren peer-to-peer-nätverksanslutning i webbläsaren, men tjänsten är fortfarande användbar som en valfri reservväg för användare som stänger av webbläsar-P2P, eller för operatörer som vill erbjuda publika kompatibilitetsslutpunkter.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker-avbild**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licens**: GPL-3.0-or-later

## Vad den kör

- en publik HTTP-proxy för rutter till pubsub, gateway, name-provider och delegerad routing
- en medföljande Kubo-nod med pubsub aktiverat
- en leverantör av delegerad HTTP-routing på `/routing/v1/providers`
- Prometheus-mätvärden på `/metrics`
- valfri åtkomst med basic auth till hela Kubo RPC-API:t

## Portar

Standardvärdena är valda så att Pubsub Provider kan köras bredvid [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) på samma VPS utan konflikt om swarm-porten.

| Syfte             | Standard                     | Anteckningar                                            |
| ----------------- | ---------------------------- | ------------------------------------------------------- |
| Publik HTTP-proxy | `8000` app, `80` Docker-värd | Sätt `PUBSUB_PROVIDER_HTTP_PORT` för att byta värdport. |
| Kubo swarm        | `4002` TCP/UDP               | Undviker seederns standardport för Kubo swarm, `4001`.  |
| Kubo API          | `5001` endast lokalt         | Används internt av proxyn.                              |
| Kubo gateway      | `8080` endast lokalt         | Används internt av proxyn.                              |

## Docker-installation

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Kontrollera loggarna:

```bash
docker logs --follow pubsub-provider
```

Testa proxyn:

```bash
curl http://127.0.0.1/commit-hash
```

## Uppgradering

Om du tidigare körde den gamla avbilden `latest`, tvinga Compose att återskapa containern från den låsta publicerade avbilden:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Kontrollera att den korrigerade avbilden körs:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Loggarna ska innehålla `using Kubo binary at /app/bin/ipfs` och ska inte innehålla `downloading ipfs`.

## Köra tillsammans med Bitsocial Seeder

Om samma värd även kör `bitsocial-seeder`, håll Pubsub Provider på swarm-porten `4002` eller någon annan port än `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Det undviker portkonflikten som uppstår när två Kubo-noder båda försöker binda TCP/UDP `4001`.

## Konfiguration

Vanliga miljövariabler att åsidosätta:

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

Använd leverantören som ett reservrelä, inte som en ersättning för webbläsar-P2P. Fortsätt att köra tracker-infrastrukturen separat när nätverket behöver dedikerad kapacitet för peer-upptäckt.
