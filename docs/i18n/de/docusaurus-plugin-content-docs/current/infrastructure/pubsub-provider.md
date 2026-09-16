---
title: Pubsub-Provider
description: Fallback-Pubsub-Relay und Delegated-Routing-Provider für Bitsocial-Betreiber.
sidebar_position: 3
---

# Pubsub-Provider

Pubsub-Provider ist ein Betreiberdienst, mit dem sich ein Bitsocial-kompatibles Pubsub-Fallback-Relay samt gebündeltem Kubo-Knoten betreiben lässt. Moderne Bitsocial-Clients wie 5chan und Seedit setzen im Browser standardmäßig auf reines Peer-to-Peer-Networking, doch dieser Dienst bleibt als optionaler Fallback-Pfad nützlich: für Nutzer, die Browser-P2P abschalten, und für Betreiber, die öffentliche Kompatibilitäts-Endpunkte anbieten möchten.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker-Image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Lizenz**: GPL-3.0-or-later

## Was der Dienst betreibt

- einen öffentlichen HTTP-Proxy für Pubsub-, Gateway-, Name-Provider- und Delegated-Routing-Routen
- einen gebündelten Kubo-Knoten mit aktiviertem Pubsub
- einen Delegated-HTTP-Routing-Provider unter `/routing/v1/providers`
- Prometheus-Metriken unter `/metrics`
- optionalen Zugriff per Basic Auth auf die vollständige Kubo-RPC-API

## Ports

Die Standardwerte sind so gewählt, dass Pubsub-Provider neben [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) auf demselben VPS laufen kann, ohne dass es zu einem Konflikt am Swarm-Port kommt.

| Zweck                   | Standard                     | Hinweise                                                        |
| ----------------------- | ---------------------------- | --------------------------------------------------------------- |
| Öffentlicher HTTP-Proxy | `8000` App, `80` Docker-Host | `PUBSUB_PROVIDER_HTTP_PORT` setzen, um den Host-Port zu ändern. |
| Kubo-Swarm              | `4002` TCP/UDP               | Vermeidet den Kubo-Standard-Swarm-Port `4001` des Seeders.      |
| Kubo-API                | `5001` nur lokal             | Wird intern vom Proxy genutzt.                                  |
| Kubo-Gateway            | `8080` nur lokal             | Wird intern vom Proxy genutzt.                                  |

## Docker-Einrichtung

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Logs ansehen:

```bash
docker logs --follow pubsub-provider
```

Den Proxy testen:

```bash
curl http://127.0.0.1/commit-hash
```

## Aktualisieren

Wenn Sie zuvor das alte `latest`-Image betrieben haben, zwingen Sie Compose dazu, den Container aus dem gepinnten veröffentlichten Image neu zu erstellen:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Prüfen, ob das korrigierte Image läuft:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

In den Logs sollte `using Kubo binary at /app/bin/ipfs` auftauchen, aber nicht `downloading ipfs`.

## Betrieb zusammen mit Bitsocial Seeder

Läuft auf demselben Host auch `bitsocial-seeder`, belassen Sie Pubsub-Provider auf Swarm-Port `4002` oder einem anderen Port außerhalb von `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

So vermeiden Sie den Port-Konflikt, der entsteht, wenn zwei Kubo-Knoten beide TCP/UDP `4001` belegen wollen.

## Konfiguration

Gängige Überschreibungen per Umgebungsvariable:

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

Setzen Sie den Provider als Fallback-Relay ein, nicht als Ersatz für Browser-P2P. Betreiben Sie die Tracker-Infrastruktur weiterhin separat, wenn das Netzwerk eigene Kapazität für die Peer-Erkennung braucht.
