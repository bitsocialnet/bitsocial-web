---
title: Pubsub Provider
description: Relais pubsub de repli et fournisseur de routage délégué pour les opérateurs Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider est un service destiné aux opérateurs, qui permet de faire tourner un relais pubsub de repli compatible Bitsocial avec un nœud Kubo intégré. Les clients Bitsocial modernes comme 5chan et Seedit utilisent par défaut un réseau purement peer-to-peer dans le navigateur, mais ce service reste utile comme voie de repli optionnelle pour les utilisateurs qui désactivent le P2P navigateur, ou pour les opérateurs qui souhaitent proposer des points d'accès publics de compatibilité.

- **GitHub** : [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Image Docker** : [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licence** : GPL-3.0-or-later

## Ce qu'il exécute

- un proxy HTTP public pour les routes pubsub, passerelle, name-provider et routage délégué
- un nœud Kubo intégré avec le pubsub activé
- un fournisseur de routage HTTP délégué sur `/routing/v1/providers`
- des métriques Prometheus sur `/metrics`
- un accès optionnel par authentification basique à l'API RPC complète de Kubo

## Ports

Les valeurs par défaut sont choisies pour que Pubsub Provider puisse tourner à côté de [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) sur le même VPS sans conflit de port swarm.

| Rôle              | Défaut                       | Remarques                                                         |
| ----------------- | ---------------------------- | ----------------------------------------------------------------- |
| Proxy HTTP public | `8000` app, `80` hôte Docker | Définissez `PUBSUB_PROVIDER_HTTP_PORT` pour changer le port hôte. |
| Swarm Kubo        | `4002` TCP/UDP               | Évite le port swarm Kubo `4001` par défaut du seeder.             |
| API Kubo          | `5001` en local uniquement   | Utilisée en interne par le proxy.                                 |
| Passerelle Kubo   | `8080` en local uniquement   | Utilisée en interne par le proxy.                                 |

## Installation avec Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Consulter les journaux :

```bash
docker logs --follow pubsub-provider
```

Tester le proxy :

```bash
curl http://127.0.0.1/commit-hash
```

## Mise à jour

Si vous utilisiez auparavant l'ancienne image `latest`, forcez Compose à recréer le conteneur à partir de l'image publiée épinglée :

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Vérifiez que l'image corrigée tourne bien :

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Les journaux doivent contenir `using Kubo binary at /app/bin/ipfs` et ne doivent pas contenir `downloading ipfs`.

## Exécution avec Bitsocial Seeder

Si le même hôte fait aussi tourner `bitsocial-seeder`, gardez Pubsub Provider sur le port swarm `4002` ou sur un autre port que `4001` :

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Cela évite le conflit de port qui survient lorsque deux nœuds Kubo tentent tous deux de se lier au port TCP/UDP `4001`.

## Configuration

Surcharges d'environnement courantes :

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

Utilisez ce provider comme relais de repli, et non comme remplacement du P2P navigateur. Continuez à faire tourner l'infrastructure de tracker séparément lorsque le réseau a besoin d'une capacité de découverte de pairs dédiée.
