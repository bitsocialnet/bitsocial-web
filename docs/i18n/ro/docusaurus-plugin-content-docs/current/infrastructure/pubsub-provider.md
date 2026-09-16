---
title: Pubsub Provider
description: Releu pubsub de rezervă și furnizor de rutare delegată pentru operatorii Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider este un serviciu pentru operatori, care rulează un releu pubsub de rezervă compatibil cu Bitsocial, împreună cu un nod Kubo inclus. Clienții Bitsocial moderni, precum 5chan și Seedit, folosesc implicit rețelistică peer-to-peer pură în browser, dar acest serviciu rămâne util ca traseu opțional de rezervă pentru utilizatorii care dezactivează P2P în browser sau pentru operatorii care vor endpointuri publice de compatibilitate.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Imagine Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licență**: GPL-3.0-or-later

## Ce rulează

- un proxy HTTP public pentru rutele pubsub, gateway, name-provider și rutare delegată
- un nod Kubo inclus, cu pubsub activat
- un furnizor de rutare HTTP delegată la `/routing/v1/providers`
- metrici Prometheus la `/metrics`
- acces opțional cu basic-auth la întregul API RPC Kubo

## Porturi

Valorile implicite sunt alese astfel încât Pubsub Provider să poată rula alături de [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) pe același VPS, fără conflict de port swarm.

| Scop              | Implicit                            | Note                                                               |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Proxy HTTP public | `8000` aplicație, `80` gazdă Docker | Setați `PUBSUB_PROVIDER_HTTP_PORT` pentru a schimba portul gazdei. |
| Swarm Kubo        | `4002` TCP/UDP                      | Evită portul swarm Kubo implicit al seeder-ului, `4001`.           |
| API Kubo          | `5001` doar local                   | Folosit intern de proxy.                                           |
| Gateway Kubo      | `8080` doar local                   | Folosit intern de proxy.                                           |

## Instalare cu Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Verificați jurnalele:

```bash
docker logs --follow pubsub-provider
```

Testați proxy-ul:

```bash
curl http://127.0.0.1/commit-hash
```

## Actualizare

Dacă ați rulat anterior vechea imagine `latest`, forțați Compose să recreeze containerul din imaginea publicată și fixată:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Verificați că rulează imaginea corectată:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Jurnalele ar trebui să conțină `using Kubo binary at /app/bin/ipfs` și să nu conțină `downloading ipfs`.

## Rulare împreună cu Bitsocial Seeder

Dacă aceeași gazdă rulează și `bitsocial-seeder`, păstrați Pubsub Provider pe portul swarm `4002` sau pe alt port diferit de `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Astfel se evită conflictul de porturi care apare când două noduri Kubo încearcă amândouă să ocupe TCP/UDP `4001`.

## Configurare

Suprascrieri uzuale de mediu:

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

Folosiți furnizorul ca releu de rezervă, nu ca înlocuitor pentru P2P în browser. Continuați să rulați separat infrastructura de trackere atunci când rețeaua are nevoie de capacitate dedicată pentru descoperirea peerilor.
