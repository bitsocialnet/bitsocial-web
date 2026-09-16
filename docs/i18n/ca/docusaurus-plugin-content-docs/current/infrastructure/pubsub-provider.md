---
title: Proveïdor de pubsub
description: Relé de pubsub de reserva i proveïdor d'encaminament delegat per a operadors de Bitsocial.
sidebar_position: 3
---

# Proveïdor de pubsub

Pubsub Provider és un servei per a operadors que permet executar un relé de reserva de pubsub compatible amb Bitsocial juntament amb un node Kubo integrat. Els clients moderns de Bitsocial, com ara 5chan i Seedit, fan servir per defecte una xarxa peer-to-peer pura al navegador, però aquest servei continua sent útil com a via de reserva opcional per als usuaris que desactiven el P2P del navegador o per als operadors que volen oferir punts d'accés públics de compatibilitat.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Imatge de Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Llicència**: GPL-3.0-or-later

## Què executa

- un proxy HTTP públic per a les rutes de pubsub, de passarel·la, de proveïdor de noms i d'encaminament delegat
- un node Kubo integrat amb pubsub activat
- un proveïdor d'encaminament HTTP delegat a `/routing/v1/providers`
- mètriques de Prometheus a `/metrics`
- accés opcional amb autenticació bàsica a l'API RPC completa de Kubo

## Ports

Els valors per defecte s'han triat perquè Pubsub Provider es pugui executar al costat de [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) al mateix VPS sense provocar cap conflicte de port de swarm.

| Finalitat           | Per defecte                              | Notes                                                                  |
| ------------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| Proxy HTTP públic   | `8000` a l'app, `80` a l'amfitrió Docker | Definiu `PUBSUB_PROVIDER_HTTP_PORT` per canviar el port de l'amfitrió. |
| Swarm de Kubo       | `4002` TCP/UDP                           | Evita el port de swarm `4001` per defecte del seeder.                  |
| API de Kubo         | `5001` només en local                    | El proxy l'utilitza internament.                                       |
| Passarel·la de Kubo | `8080` només en local                    | El proxy l'utilitza internament.                                       |

## Configuració amb Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Consulteu els registres:

```bash
docker logs --follow pubsub-provider
```

Proveu el proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Actualització

Si abans executàveu l'antiga imatge `latest`, forceu Compose a recrear el contenidor a partir de la imatge publicada i fixada:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Verifiqueu que s'executa la imatge corregida:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Els registres haurien d'incloure `using Kubo binary at /app/bin/ipfs` i no haurien d'incloure `downloading ipfs`.

## Execució amb Bitsocial Seeder

Si el mateix amfitrió també executa `bitsocial-seeder`, mantingueu Pubsub Provider al port de swarm `4002` o a un altre port que no sigui `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Així s'evita el conflicte de ports que es produeix quan dos nodes Kubo intenten enllaçar-se tots dos al port TCP/UDP `4001`.

## Configuració

Substitucions habituals de variables d'entorn:

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

Feu servir el proveïdor com a relé de reserva, no com a substitut del P2P del navegador. Continueu executant la infraestructura de trackers per separat quan la xarxa necessiti capacitat dedicada de descobriment de parells.
