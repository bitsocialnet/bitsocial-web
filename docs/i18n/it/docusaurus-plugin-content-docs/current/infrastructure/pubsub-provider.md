---
title: Pubsub Provider
description: Relay pubsub di ripiego e provider di routing delegato per gli operatori Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider è un servizio per operatori che permette di eseguire un relay pubsub di ripiego compatibile con Bitsocial, con un nodo Kubo integrato. I client Bitsocial moderni come 5chan e Seedit usano per impostazione predefinita il networking peer-to-peer puro nel browser, ma questo servizio resta utile come percorso alternativo opzionale per gli utenti che disattivano il P2P nel browser o per gli operatori che vogliono offrire endpoint pubblici di compatibilità.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Immagine Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licenza**: GPL-3.0-or-later

## Che cosa esegue

- un proxy HTTP pubblico per le rotte pubsub, gateway, name-provider e routing delegato
- un nodo Kubo integrato con il pubsub abilitato
- un provider di routing HTTP delegato su `/routing/v1/providers`
- metriche Prometheus su `/metrics`
- accesso opzionale con basic auth all'intera API RPC di Kubo

## Porte

I valori predefiniti sono scelti in modo che Pubsub Provider possa girare accanto a [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) sullo stesso VPS senza conflitti sulla porta swarm.

| Scopo               | Predefinito                  | Note                                                         |
| ------------------- | ---------------------------- | ------------------------------------------------------------ |
| Proxy HTTP pubblico | `8000` app, `80` host Docker | Imposta `PUBSUB_PROVIDER_HTTP_PORT` per cambiare porta host. |
| Swarm Kubo          | `4002` TCP/UDP               | Evita la porta swarm Kubo predefinita del seeder, `4001`.    |
| API Kubo            | `5001` solo locale           | Usata internamente dal proxy.                                |
| Gateway Kubo        | `8080` solo locale           | Usato internamente dal proxy.                                |

## Installazione con Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Controlla i log:

```bash
docker logs --follow pubsub-provider
```

Verifica il proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Aggiornamento

Se in precedenza usavi la vecchia immagine `latest`, obbliga Compose a ricreare il container a partire dall'immagine pubblicata e fissata a una versione:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Verifica che sia in esecuzione l'immagine corretta:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

I log dovrebbero contenere `using Kubo binary at /app/bin/ipfs` e non dovrebbero contenere `downloading ipfs`.

## Esecuzione insieme a Bitsocial Seeder

Se lo stesso host esegue anche `bitsocial-seeder`, tieni Pubsub Provider sulla porta swarm `4002` o su un'altra porta diversa da `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

In questo modo si evita il conflitto che si verifica quando due nodi Kubo provano entrambi a occupare la porta TCP/UDP `4001`.

## Configurazione

Variabili d'ambiente sovrascritte più di frequente:

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

Usa il provider come relay di ripiego, non come sostituto del P2P nel browser. Continua a gestire separatamente l'infrastruttura dei tracker quando la rete ha bisogno di capacità dedicata per la scoperta dei peer.
