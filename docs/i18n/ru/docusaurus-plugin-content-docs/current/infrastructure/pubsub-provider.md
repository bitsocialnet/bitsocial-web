---
title: Pubsub Provider
description: Резервный pubsub-релей и провайдер делегированной маршрутизации для операторов Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider — это операторский сервис, который поднимает совместимый с Bitsocial резервный pubsub-релей вместе со встроенным узлом Kubo. Современные клиенты Bitsocial, такие как 5chan и Seedit, по умолчанию работают в браузере через чистую одноранговую сеть, но этот сервис остаётся полезен как необязательный резервный путь для пользователей, отключивших браузерный P2P, и для операторов, которым нужны публичные точки входа для совместимости.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker-образ**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Лицензия**: GPL-3.0-or-later

## Что он запускает

- публичный HTTP-прокси для маршрутов pubsub, шлюза, name-provider и делегированной маршрутизации
- встроенный узел Kubo с включённым pubsub
- провайдер делегированной HTTP-маршрутизации по пути `/routing/v1/providers`
- метрики Prometheus по пути `/metrics`
- необязательный доступ к полному Kubo RPC API по basic-auth

## Порты

Значения по умолчанию выбраны так, чтобы Pubsub Provider мог работать на одном VPS рядом с [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) без конфликта swarm-портов.

| Назначение            | По умолчанию                              | Примечания                                                           |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| Публичный HTTP-прокси | `8000` в приложении, `80` на хосте Docker | Задайте `PUBSUB_PROVIDER_HTTP_PORT`, чтобы изменить порт на хосте.   |
| Kubo swarm            | `4002` TCP/UDP                            | Обходит swarm-порт Kubo `4001`, который сидер занимает по умолчанию. |
| Kubo API              | `5001` только локально                    | Используется прокси внутри.                                          |
| Kubo gateway          | `8080` только локально                    | Используется прокси внутри.                                          |

## Установка через Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Посмотреть логи:

```bash
docker logs --follow pubsub-provider
```

Проверить прокси:

```bash
curl http://127.0.0.1/commit-hash
```

## Обновление

Если раньше вы использовали старый образ `latest`, заставьте Compose пересоздать контейнер из зафиксированного опубликованного образа:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Убедитесь, что запущен исправленный образ:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

В логах должна быть строка `using Kubo binary at /app/bin/ipfs` и не должно быть `downloading ipfs`.

## Работа вместе с Bitsocial Seeder

Если на том же хосте запущен `bitsocial-seeder`, оставьте Pubsub Provider на swarm-порту `4002` или на любом другом, кроме `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Так вы избежите конфликта портов, который возникает, когда два узла Kubo пытаются занять TCP/UDP `4001`.

## Конфигурация

Типичные переопределения переменных окружения:

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

Используйте провайдер как резервный релей, а не как замену браузерному P2P. Инфраструктуру трекеров держите отдельно и не выключайте, когда сети нужна выделенная ёмкость для обнаружения узлов.
