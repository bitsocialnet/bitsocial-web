---
title: Pubsub Provider
description: Fallback-pubsub-relay og delegeret routing-udbyder til Bitsocial-operatører.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider er en operatørtjeneste til at køre et Bitsocial-kompatibelt pubsub-fallback-relay med en medfølgende Kubo-node. Moderne Bitsocial-klienter som 5chan og Seedit bruger som standard rent peer-to-peer-netværk i browseren, men tjenesten er fortsat nyttig som en valgfri fallback-vej for brugere, der slår browser-P2P fra, eller for operatører, der ønsker offentlige kompatibilitets-endpoints.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker-image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licens**: GPL-3.0-or-later

## Hvad den kører

- en offentlig HTTP-proxy til ruter for pubsub, gateway, name-provider og delegeret routing
- en medfølgende Kubo-node med pubsub slået til
- en delegeret HTTP-routing-udbyder på `/routing/v1/providers`
- Prometheus-metrikker på `/metrics`
- valgfri basic-auth-adgang til hele Kubo RPC-API'et

## Porte

Standardværdierne er valgt, så Pubsub Provider kan køre side om side med [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) på den samme VPS uden konflikt om swarm-porten.

| Formål               | Standard                     | Noter                                                     |
| -------------------- | ---------------------------- | --------------------------------------------------------- |
| Offentlig HTTP-proxy | `8000` app, `80` Docker-vært | Sæt `PUBSUB_PROVIDER_HTTP_PORT` for at ændre værtsporten. |
| Kubo swarm           | `4002` TCP/UDP               | Undgår seederens standard-swarm-port `4001` til Kubo.     |
| Kubo API             | `5001` kun lokalt            | Bruges internt af proxyen.                                |
| Kubo gateway         | `8080` kun lokalt            | Bruges internt af proxyen.                                |

## Docker-opsætning

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Tjek logfilerne:

```bash
docker logs --follow pubsub-provider
```

Test proxyen:

```bash
curl http://127.0.0.1/commit-hash
```

## Opgradering

Hvis du tidligere kørte det gamle `latest`-image, så tving Compose til at genskabe containeren ud fra det fastlåste, publicerede image:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Bekræft, at det rettede image kører:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Logfilerne bør indeholde `using Kubo binary at /app/bin/ipfs` og bør ikke indeholde `downloading ipfs`.

## Kørsel sammen med Bitsocial Seeder

Hvis den samme vært også kører `bitsocial-seeder`, så hold Pubsub Provider på swarm-port `4002` eller en anden port end `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Det undgår den portkonflikt, der opstår, når to Kubo-noder begge forsøger at binde TCP/UDP `4001`.

## Konfiguration

Almindelige overstyringer via miljøvariabler:

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

Brug udbyderen som et fallback-relay, ikke som en erstatning for browser-P2P. Kør fortsat tracker-infrastrukturen separat, når netværket har brug for dedikeret kapacitet til opdagelse af peers.
