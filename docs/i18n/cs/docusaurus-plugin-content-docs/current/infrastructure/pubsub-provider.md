---
title: Pubsub Provider
description: Záložní pubsub relay a poskytovatel delegovaného směrování pro provozovatele Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider je služba pro provozovatele, která spouští záložní pubsub relay kompatibilní s Bitsocial spolu s přibaleným uzlem Kubo. Moderní klienti Bitsocial, jako jsou 5chan a Seedit, používají v prohlížeči ve výchozím nastavení čisté peer-to-peer spojení, tato služba ale zůstává užitečná jako volitelná záložní cesta pro uživatele, kteří si P2P v prohlížeči vypnou, nebo pro provozovatele, kteří chtějí nabídnout veřejné endpointy kvůli kompatibilitě.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licence**: GPL-3.0-or-later

## Co všechno běží

- veřejná HTTP proxy pro cesty pubsub, gateway, name-provider a delegovaného směrování
- přibalený uzel Kubo se zapnutým pubsub
- poskytovatel delegovaného HTTP směrování na `/routing/v1/providers`
- metriky Prometheus na `/metrics`
- volitelný přístup k plnému RPC API uzlu Kubo přes basic auth

## Porty

Výchozí hodnoty jsou zvolené tak, aby Pubsub Provider mohl běžet na stejném VPS vedle [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) bez konfliktu na swarm portu.

| Účel               | Výchozí                           | Poznámky                                                 |
| ------------------ | --------------------------------- | -------------------------------------------------------- |
| Veřejná HTTP proxy | `8000` v aplikaci, `80` v Dockeru | Port hostitele změníte přes `PUBSUB_PROVIDER_HTTP_PORT`. |
| Kubo swarm         | `4002` TCP/UDP                    | Vyhýbá se výchozímu swarm portu Kubo `4001` u seederu.   |
| Kubo API           | `5001` jen lokálně                | Používá interně proxy.                                   |
| Kubo gateway       | `8080` jen lokálně                | Používá interně proxy.                                   |

## Nastavení přes Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Kontrola logů:

```bash
docker logs --follow pubsub-provider
```

Test proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Aktualizace

Pokud jste dříve provozovali starý image `latest`, přinuťte Compose vytvořit kontejner znovu z připnutého publikovaného image:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Ověřte, že běží opravený image:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

V logu by se mělo objevit `using Kubo binary at /app/bin/ipfs` a nemělo by se objevit `downloading ipfs`.

## Provoz společně s Bitsocial Seeder

Pokud na stejném hostiteli běží i `bitsocial-seeder`, nechte Pubsub Provider na swarm portu `4002` nebo na jiném portu než `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Tím se vyhnete konfliktu portů, ke kterému dojde, když se dva uzly Kubo pokusí obsadit TCP/UDP `4001`.

## Konfigurace

Běžné proměnné prostředí:

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

Používejte tuto službu jako záložní relay, ne jako náhradu P2P v prohlížeči. Infrastrukturu trackerů provozujte i nadále odděleně, když síť potřebuje vyhrazenou kapacitu pro zjišťování peerů.
