---
title: Pubsub Provider
description: Tartalék pubsub relé és delegált útválasztási szolgáltató Bitsocial üzemeltetőknek.
sidebar_position: 3
---

# Pubsub Provider

A Pubsub Provider egy üzemeltetői szolgáltatás, amellyel Bitsocial-kompatibilis pubsub tartalékrelé futtatható beépített Kubo csomóponttal. A modern Bitsocial kliensek, például az 5chan és a Seedit alapértelmezés szerint tiszta peer-to-peer hálózatot használnak a böngészőben, ez a szolgáltatás azonban továbbra is hasznos opcionális tartalékútvonalként azoknak a felhasználóknak, akik kikapcsolják a böngészős P2P-t, illetve azoknak az üzemeltetőknek, akik nyilvános kompatibilitási végpontokat szeretnének kínálni.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licenc**: GPL-3.0-or-later

## Mit futtat

- nyilvános HTTP proxyt a pubsub, az átjáró, a névszolgáltató és a delegált útválasztási útvonalakhoz
- egy beépített Kubo csomópontot bekapcsolt pubsubbal
- egy delegált HTTP útválasztási szolgáltatót a `/routing/v1/providers` végponton
- Prometheus metrikákat a `/metrics` végponton
- opcionális basic-auth hozzáférést a teljes Kubo RPC API-hoz

## Portok

Az alapértelmezéseket úgy választottuk meg, hogy a Pubsub Provider a [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) mellett futhasson ugyanazon a VPS-en, swarm-portütközés nélkül.

| Cél                  | Alapértelmezés                                | Megjegyzések                                                                |
| -------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| Nyilvános HTTP proxy | `8000` az alkalmazásban, `80` a Docker hoston | A host port módosításához állítsa be a `PUBSUB_PROVIDER_HTTP_PORT` értékét. |
| Kubo swarm           | `4002` TCP/UDP                                | Elkerüli a seeder alapértelmezett Kubo swarm portját, a `4001`-et.          |
| Kubo API             | `5001`, csak helyi                            | A proxy belsőleg használja.                                                 |
| Kubo átjáró          | `8080`, csak helyi                            | A proxy belsőleg használja.                                                 |

## Docker-beállítás

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

A naplók ellenőrzése:

```bash
docker logs --follow pubsub-provider
```

A proxy tesztelése:

```bash
curl http://127.0.0.1/commit-hash
```

## Frissítés

Ha korábban a régi `latest` image-et futtatta, kényszerítse a Compose-t, hogy a rögzített, publikált image alapján hozza létre újra a konténert:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Ellenőrizze, hogy a javított image fut-e:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

A naplókban szerepelnie kell a `using Kubo binary at /app/bin/ipfs` sornak, és nem szabad szerepelnie a `downloading ipfs` sornak.

## Futtatás a Bitsocial Seederrel

Ha ugyanaz a gép a `bitsocial-seeder`-t is futtatja, tartsa a Pubsub Providert a `4002`-es swarm porton vagy más, nem `4001`-es porton:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Ezzel elkerülhető az a portütközés, amely akkor lép fel, ha két Kubo csomópont is a TCP/UDP `4001`-es portra próbál kötni.

## Konfiguráció

Gyakori környezeti változós felülbírálások:

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

A szolgáltatót tartalékreléként használja, ne a böngészős P2P helyettesítőjeként. A tracker infrastruktúrát futtassa továbbra is külön, amikor a hálózatnak dedikált peer-felfedezési kapacitásra van szüksége.
