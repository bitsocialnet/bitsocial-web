---
title: Pubsub Provider
description: Rele rezervë për pubsub dhe ofrues rutimi të deleguar për operatorët e Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider është një shërbim për operatorë që drejton një rele rezervë pubsub të pajtueshme me Bitsocial, bashkë me një nyje Kubo të përfshirë. Klientët modernë të Bitsocial, si 5chan dhe Seedit, përdorin si parazgjedhje rrjetëzim peer-to-peer të pastër në shfletues, por ky shërbim mbetet i dobishëm si rrugë rezervë opsionale për përdoruesit që e çaktivizojnë P2P-në në shfletues, ose për operatorët që duan pika publike përputhshmërie.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Imazhi Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licenca**: GPL-3.0-or-later

## Çfarë Ekzekuton

- një proxy publik HTTP për rrugët e pubsub-it, të portës, të ofruesit të emrave dhe të rutimit të deleguar
- një nyje Kubo të përfshirë me pubsub të aktivizuar
- një ofrues rutimi të deleguar mbi HTTP te `/routing/v1/providers`
- metrika Prometheus te `/metrics`
- qasje opsionale me basic-auth te e gjithë API-ja RPC e Kubo-s

## Portat

Parazgjedhjet janë zgjedhur në mënyrë që Pubsub Provider të mund të punojë krah [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) në të njëjtin VPS pa konflikt në portin e swarm-it.

| Qëllimi           | Parazgjedhja                 | Shënime                                                                |
| ----------------- | ---------------------------- | ---------------------------------------------------------------------- |
| Proxy publik HTTP | `8000` app, `80` host Docker | Vendosni `PUBSUB_PROVIDER_HTTP_PORT` për të ndryshuar portin e hostit. |
| Swarm i Kubo-s    | `4002` TCP/UDP               | Shmang portin e parazgjedhur `4001` të swarm-it Kubo të seeder-it.     |
| API e Kubo-s      | `5001` vetëm lokale          | Përdoret nga proxy-ja në mënyrë të brendshme.                          |
| Porta e Kubo-s    | `8080` vetëm lokale          | Përdoret nga proxy-ja në mënyrë të brendshme.                          |

## Instalimi me Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Kontrolloni regjistrat:

```bash
docker logs --follow pubsub-provider
```

Testoni proxy-n:

```bash
curl http://127.0.0.1/commit-hash
```

## Përditësimi

Nëse më parë keni përdorur imazhin e vjetër `latest`, detyrojeni Compose-in ta rikrijojë kontejnerin nga imazhi i publikuar dhe i fiksuar:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Verifikoni që po ekzekutohet imazhi i rregulluar:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Regjistrat duhet të përmbajnë `using Kubo binary at /app/bin/ipfs` dhe nuk duhet të përmbajnë `downloading ipfs`.

## Ekzekutimi Bashkë me Bitsocial Seeder

Nëse i njëjti host drejton edhe `bitsocial-seeder`, mbajeni Pubsub Provider në portin e swarm-it `4002` ose në një port tjetër që nuk është `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Kjo shmang konfliktin e porteve që ndodh kur dy nyje Kubo përpiqen të dyja të zënë TCP/UDP `4001`.

## Konfigurimi

Anashkalime të zakonshme përmes variablave të mjedisit:

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

Përdoreni ofruesin si rele rezervë, jo si zëvendësim të P2P-së në shfletues. Vazhdoni ta drejtoni veçmas infrastrukturën e tracker-it kur rrjeti ka nevojë për kapacitet të dedikuar zbulimi homologësh.
