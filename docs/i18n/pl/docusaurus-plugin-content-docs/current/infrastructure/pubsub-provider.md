---
title: Pubsub Provider
description: Zapasowy przekaźnik pubsub i dostawca delegowanego routingu dla operatorów Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider to usługa dla operatorów, która uruchamia zgodny z Bitsocial zapasowy przekaźnik pubsub wraz z dołączonym węzłem Kubo. Nowoczesne klienty Bitsocial, takie jak 5chan i Seedit, domyślnie korzystają w przeglądarce z czystej sieci peer-to-peer, ale ta usługa pozostaje przydatna jako opcjonalna ścieżka awaryjna dla użytkowników, którzy wyłączają P2P w przeglądarce, oraz dla operatorów, którzy chcą udostępniać publiczne punkty końcowe zapewniające zgodność.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Obraz Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licencja**: GPL-3.0-or-later

## Co uruchamia

- publiczne proxy HTTP dla tras pubsub, bramy, dostawcy nazw i delegowanego routingu
- dołączony węzeł Kubo z włączonym pubsub
- dostawcę delegowanego routingu HTTP pod adresem `/routing/v1/providers`
- metryki Prometheus pod adresem `/metrics`
- opcjonalny dostęp z uwierzytelnianiem podstawowym do pełnego API RPC Kubo

## Porty

Wartości domyślne dobrano tak, aby Pubsub Provider mógł działać na tym samym VPS obok [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) bez konfliktu portu swarm.

| Przeznaczenie        | Domyślnie                                 | Uwagi                                                       |
| -------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| Publiczne proxy HTTP | `8000` w aplikacji, `80` na hoście Docker | Ustaw `PUBSUB_PROVIDER_HTTP_PORT`, aby zmienić port hosta.  |
| Swarm Kubo           | `4002` TCP/UDP                            | Omija domyślny port swarm Kubo `4001` używany przez seeder. |
| API Kubo             | `5001` tylko lokalnie                     | Używane wewnętrznie przez proxy.                            |
| Brama Kubo           | `8080` tylko lokalnie                     | Używana wewnętrznie przez proxy.                            |

## Konfiguracja Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Sprawdź logi:

```bash
docker logs --follow pubsub-provider
```

Przetestuj proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Aktualizacja

Jeśli wcześniej używałeś starego obrazu `latest`, wymuś na Compose odtworzenie kontenera z przypiętego opublikowanego obrazu:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Sprawdź, czy działa poprawiony obraz:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

W logach powinien pojawić się wpis `using Kubo binary at /app/bin/ipfs`, a nie powinno być wpisu `downloading ipfs`.

## Praca razem z Bitsocial Seeder

Jeśli na tym samym hoście działa też `bitsocial-seeder`, zostaw Pubsub Provider na porcie swarm `4002` lub innym porcie różnym od `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Pozwala to uniknąć konfliktu portów, który powstaje, gdy dwa węzły Kubo próbują zająć TCP/UDP `4001`.

## Konfiguracja

Najczęściej nadpisywane zmienne środowiskowe:

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

Traktuj tę usługę jako przekaźnik awaryjny, a nie zamiennik P2P w przeglądarce. Gdy sieć potrzebuje dedykowanej przepustowości do wyszukiwania peerów, prowadź infrastrukturę trackerów osobno.
