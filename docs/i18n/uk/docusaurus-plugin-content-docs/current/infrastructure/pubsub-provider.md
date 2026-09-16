---
title: Pubsub Provider
description: Резервний ретранслятор pubsub і провайдер делегованої маршрутизації для операторів Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider — це операторська служба для запуску сумісного з Bitsocial резервного ретранслятора pubsub із вбудованим вузлом Kubo. Сучасні клієнти Bitsocial, як-от 5chan і Seedit, типово працюють у браузері через чисту однорангову мережу, проте ця служба лишається корисною як необов’язковий резервний шлях для користувачів, які вимкнули одноранговий режим у браузері, або для операторів, яким потрібні публічні точки входу для сумісності.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Образ Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Ліцензія**: GPL-3.0-or-later

## Що саме запускається

- публічний проксі HTTP для маршрутів pubsub, шлюзу, постачальника імен і делегованої маршрутизації
- вбудований вузол Kubo з увімкненим pubsub
- провайдер делегованої маршрутизації HTTP за адресою `/routing/v1/providers`
- метрики Prometheus за адресою `/metrics`
- необов’язковий доступ із базовою автентифікацією до повного API Kubo RPC

## Порти

Типові значення підібрано так, щоб Pubsub Provider міг працювати на тому самому VPS поруч із [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) без конфлікту swarm-портів.

| Призначення           | Типове значення                           | Примітки                                                          |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| Публічний проксі HTTP | `8000` у застосунку, `80` на хості Docker | Змініть `PUBSUB_PROVIDER_HTTP_PORT`, щоб задати інший порт хоста. |
| Swarm Kubo            | `4002` TCP/UDP                            | Не перетинається з типовим swarm-портом Kubo `4001` у seeder.     |
| API Kubo              | `5001`, лише локально                     | Використовується проксі всередині.                                |
| Шлюз Kubo             | `8080`, лише локально                     | Використовується проксі всередині.                                |

## Налаштування Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Перегляньте журнали:

```bash
docker logs --follow pubsub-provider
```

Перевірте проксі:

```bash
curl http://127.0.0.1/commit-hash
```

## Оновлення

Якщо раніше ви запускали старий образ `latest`, змусьте Compose перестворити контейнер із закріпленого опублікованого образу:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Переконайтеся, що запущено виправлений образ:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

У журналах має бути рядок `using Kubo binary at /app/bin/ipfs` і не має бути `downloading ipfs`.

## Робота разом із Bitsocial Seeder

Якщо на тому самому хості також працює `bitsocial-seeder`, залиште для Pubsub Provider swarm-порт `4002` або інший порт, відмінний від `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Це усуває конфлікт портів, який виникає, коли два вузли Kubo намагаються зайняти TCP/UDP `4001`.

## Конфігурація

Поширені перевизначення через змінні середовища:

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

Використовуйте провайдера як резервний ретранслятор, а не як заміну одноранговому режиму в браузері. Продовжуйте тримати інфраструктуру трекерів окремо, коли мережі потрібна виділена потужність для виявлення вузлів.
