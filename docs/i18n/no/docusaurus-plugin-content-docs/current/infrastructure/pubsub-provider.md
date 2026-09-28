---
title: Pubsub Provider
description: Pubsub-reserverelé og leverandør av delegert ruting for Bitsocial-operatører.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider er en operatørtjeneste for å kjøre et Bitsocial-kompatibelt pubsub-reserverelé med en medfølgende Kubo-node. Moderne Bitsocial-klienter som 5chan og Seedit bruker som standard rent peer-to-peer-nettverk i nettleseren, men denne tjenesten er fortsatt nyttig som en valgfri reservevei for brukere som slår av nettleser-P2P, eller for operatører som vil tilby offentlige kompatibilitetsendepunkter.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker-image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Lisens**: GPL-3.0-or-later

## Hva den kjører

- en offentlig HTTP-proxy for ruter til pubsub, gateway, name-provider og delegert ruting
- en medfølgende Kubo-node med pubsub aktivert
- en leverandør av delegert HTTP-ruting på `/routing/v1/providers`
- Prometheus-metrikker på `/metrics`
- valgfri tilgang med basic auth til hele Kubo RPC-API-et

## Porter

Standardverdiene er valgt slik at Pubsub Provider kan kjøre ved siden av [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) på samme VPS uten konflikt om swarm-porten.

| Formål               | Standard                     | Merknader                                               |
| -------------------- | ---------------------------- | ------------------------------------------------------- |
| Offentlig HTTP-proxy | `8000` app, `80` Docker-vert | Sett `PUBSUB_PROVIDER_HTTP_PORT` for å endre vertsport. |
| Kubo swarm           | `4002` TCP/UDP               | Unngår seederens standard Kubo-swarm-port `4001`.       |
| Kubo API             | `5001` kun lokalt            | Brukes internt av proxyen.                              |
| Kubo gateway         | `8080` kun lokalt            | Brukes internt av proxyen.                              |

## Docker-oppsett

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Se på loggene:

```bash
docker logs --follow pubsub-provider
```

Test proxyen:

```bash
curl http://127.0.0.1/commit-hash
```

## Oppgradering

Hvis du tidligere kjørte det gamle `latest`-imaget, må du tvinge Compose til å gjenopprette containeren fra det låste, publiserte imaget:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Bekreft at det rettede imaget kjører:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Loggene skal inneholde `using Kubo binary at /app/bin/ipfs` og skal ikke inneholde `downloading ipfs`.

## Kjøring sammen med Bitsocial Seeder

Hvis den samme verten også kjører `bitsocial-seeder`, hold Pubsub Provider på swarm-port `4002` eller en annen port enn `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Det unngår portkonflikten som oppstår når to Kubo-noder begge prøver å binde TCP/UDP `4001`.

## Konfigurasjon

Vanlige miljøoverstyringer:

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

Bruk provideren som et reserverelé, ikke som en erstatning for nettleser-P2P. Fortsett å kjøre tracker-infrastrukturen separat når nettverket trenger dedikert kapasitet til å oppdage peers.
