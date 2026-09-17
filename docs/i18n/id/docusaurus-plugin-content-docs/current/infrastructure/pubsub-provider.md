---
title: Pubsub Provider
description: Relai pubsub cadangan dan penyedia routing terdelegasi untuk operator Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider adalah layanan operator untuk menjalankan relai pubsub cadangan yang kompatibel dengan Bitsocial, lengkap dengan node Kubo bawaan. Klien Bitsocial modern seperti 5chan dan Seedit secara bawaan memakai jaringan peer-to-peer murni di browser, tetapi layanan ini tetap berguna sebagai jalur cadangan opsional bagi pengguna yang menonaktifkan P2P browser, atau bagi operator yang ingin menyediakan endpoint kompatibilitas publik.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Image Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Lisensi**: GPL-3.0-or-later

## Apa Saja yang Dijalankannya

- proxy HTTP publik untuk rute pubsub, gateway, name-provider, dan routing terdelegasi
- node Kubo bawaan dengan pubsub yang sudah aktif
- penyedia routing HTTP terdelegasi di `/routing/v1/providers`
- metrik Prometheus di `/metrics`
- akses opsional dengan basic auth ke seluruh API RPC Kubo

## Port

Nilai bawaannya dipilih agar Pubsub Provider bisa berjalan berdampingan dengan [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) pada VPS yang sama tanpa konflik port swarm.

| Keperluan         | Bawaan                            | Catatan                                                     |
| ----------------- | --------------------------------- | ----------------------------------------------------------- |
| Proxy HTTP publik | `8000` aplikasi, `80` host Docker | Setel `PUBSUB_PROVIDER_HTTP_PORT` untuk mengubah port host. |
| Swarm Kubo        | `4002` TCP/UDP                    | Menghindari port swarm Kubo bawaan seeder, yaitu `4001`.    |
| API Kubo          | `5001` hanya lokal                | Dipakai secara internal oleh proxy.                         |
| Gateway Kubo      | `8080` hanya lokal                | Dipakai secara internal oleh proxy.                         |

## Penyiapan Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Periksa log:

```bash
docker logs --follow pubsub-provider
```

Uji proxy-nya:

```bash
curl http://127.0.0.1/commit-hash
```

## Meningkatkan Versi

Jika sebelumnya Anda menjalankan image `latest` yang lama, paksa Compose membuat ulang kontainer dari image terbitan yang versinya sudah dipatok:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Pastikan image yang sudah diperbaiki benar-benar berjalan:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Log seharusnya memuat `using Kubo binary at /app/bin/ipfs` dan tidak memuat `downloading ipfs`.

## Menjalankannya Bersama Bitsocial Seeder

Jika host yang sama juga menjalankan `bitsocial-seeder`, biarkan Pubsub Provider tetap pada port swarm `4002` atau port lain selain `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Ini mencegah konflik port yang muncul ketika dua node Kubo sama-sama mencoba mengikat TCP/UDP `4001`.

## Konfigurasi

Penggantian variabel lingkungan yang umum dipakai:

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

Pakailah provider ini sebagai relai cadangan, bukan sebagai pengganti P2P browser. Tetap jalankan infrastruktur tracker secara terpisah ketika jaringan membutuhkan kapasitas penemuan peer khusus.
