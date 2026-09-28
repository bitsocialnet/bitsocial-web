---
title: Pubsub Provider
description: Fallback-pubsubrelay en delegated-routingprovider voor Bitsocial-operators.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider is een operatordienst waarmee je een Bitsocial-compatibele pubsub-fallbackrelay draait met een meegeleverde Kubo-node. Moderne Bitsocial-clients zoals 5chan en Seedit werken standaard puur peer-to-peer in de browser, maar deze dienst blijft nuttig als optioneel terugvalpad voor gebruikers die browser-P2P uitschakelen, en voor operators die publieke compatibiliteitseindpunten willen aanbieden.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker-image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licentie**: GPL-3.0-or-later

## Wat de dienst draait

- een publieke HTTP-proxy voor pubsub-, gateway-, name-provider- en delegated-routingroutes
- een meegeleverde Kubo-node met pubsub ingeschakeld
- een delegated HTTP-routingprovider op `/routing/v1/providers`
- Prometheus-metrics op `/metrics`
- optionele toegang met basic auth tot de volledige Kubo RPC-API

## Poorten

De standaardwaarden zijn zo gekozen dat Pubsub Provider naast [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) op dezelfde VPS kan draaien zonder conflict op de swarmpoort.

| Doel                | Standaard                    | Opmerkingen                                                      |
| ------------------- | ---------------------------- | ---------------------------------------------------------------- |
| Publieke HTTP-proxy | `8000` app, `80` Docker-host | Stel `PUBSUB_PROVIDER_HTTP_PORT` in om de hostpoort te wijzigen. |
| Kubo-swarm          | `4002` TCP/UDP               | Vermijdt de standaard Kubo-swarmpoort `4001` van de seeder.      |
| Kubo-API            | `5001` alleen lokaal         | Wordt intern door de proxy gebruikt.                             |
| Kubo-gateway        | `8080` alleen lokaal         | Wordt intern door de proxy gebruikt.                             |

## Docker-opzet

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Logs bekijken:

```bash
docker logs --follow pubsub-provider
```

De proxy testen:

```bash
curl http://127.0.0.1/commit-hash
```

## Upgraden

Als je eerder de oude `latest`-image draaide, dwing Compose dan om de container opnieuw aan te maken vanaf de vastgezette gepubliceerde image:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Controleer of de gecorrigeerde image draait:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

De logs horen `using Kubo binary at /app/bin/ipfs` te bevatten en mogen `downloading ipfs` niet bevatten.

## Draaien naast Bitsocial Seeder

Als dezelfde host ook `bitsocial-seeder` draait, houd Pubsub Provider dan op swarmpoort `4002` of een andere poort dan `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Zo voorkom je het poortconflict dat ontstaat wanneer twee Kubo-nodes allebei TCP/UDP `4001` proberen te binden.

## Configuratie

Veelgebruikte omgevingsvariabelen om te overschrijven:

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

Gebruik de provider als terugvalrelay, niet als vervanging voor browser-P2P. Blijf de trackerinfrastructuur apart draaien wanneer het netwerk toegewijde capaciteit voor peer-discovery nodig heeft.
