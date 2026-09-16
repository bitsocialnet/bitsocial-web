---
title: Proveedor de pubsub
description: Relé de pubsub de respaldo y proveedor de enrutamiento delegado para operadores de Bitsocial.
sidebar_position: 3
---

# Proveedor de pubsub

Pubsub Provider es un servicio para operadores que ejecuta un relé de respaldo de pubsub compatible con Bitsocial junto con un nodo Kubo integrado. Los clientes modernos de Bitsocial, como 5chan y Seedit, usan de forma predeterminada redes peer-to-peer puras en el navegador, pero este servicio sigue siendo útil como vía de respaldo opcional para quienes desactivan el P2P en el navegador o para operadores que quieren ofrecer extremos públicos de compatibilidad.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Imagen de Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licencia**: GPL-3.0-or-later

## Qué ejecuta

- un proxy HTTP público para las rutas de pubsub, pasarela, proveedor de nombres y enrutamiento delegado
- un nodo Kubo integrado con pubsub habilitado
- un proveedor de enrutamiento HTTP delegado en `/routing/v1/providers`
- métricas de Prometheus en `/metrics`
- acceso opcional con autenticación básica a la API RPC completa de Kubo

## Puertos

Los valores predeterminados se han elegido para que Pubsub Provider pueda ejecutarse junto a [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) en el mismo VPS sin conflicto de puerto de swarm.

| Propósito          | Predeterminado                  | Notas                                                                      |
| ------------------ | ------------------------------- | -------------------------------------------------------------------------- |
| Proxy HTTP público | `8000` app, `80` host de Docker | Cambia `PUBSUB_PROVIDER_HTTP_PORT` para modificar el puerto del host.      |
| Swarm de Kubo      | `4002` TCP/UDP                  | Evita el puerto de swarm `4001` que el seeder usa de forma predeterminada. |
| API de Kubo        | `5001` solo local               | El proxy la usa internamente.                                              |
| Pasarela de Kubo   | `8080` solo local               | El proxy la usa internamente.                                              |

## Instalación con Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Consulta los registros:

```bash
docker logs --follow pubsub-provider
```

Prueba el proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Actualización

Si antes ejecutabas la antigua imagen `latest`, obliga a Compose a recrear el contenedor a partir de la imagen publicada y fijada:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Comprueba que se está ejecutando la imagen corregida:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Los registros deberían incluir `using Kubo binary at /app/bin/ipfs` y no deberían incluir `downloading ipfs`.

## Ejecución junto a Bitsocial Seeder

Si el mismo host ejecuta también `bitsocial-seeder`, mantén Pubsub Provider en el puerto de swarm `4002` o en otro puerto distinto de `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Así se evita el conflicto de puertos que se produce cuando dos nodos Kubo intentan enlazar a la vez TCP/UDP `4001`.

## Configuración

Sustituciones habituales de variables de entorno:

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

Usa el proveedor como relé de respaldo, no como sustituto del P2P en el navegador. Mantén la infraestructura de tracker funcionando por separado cuando la red necesite capacidad dedicada de descubrimiento de pares.
