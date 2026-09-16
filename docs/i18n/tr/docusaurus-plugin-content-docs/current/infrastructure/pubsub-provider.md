---
title: Pubsub Sağlayıcısı
description: Bitsocial operatörleri için yedek pubsub aktarıcısı ve devredilmiş yönlendirme sağlayıcısı.
sidebar_position: 3
---

# Pubsub Sağlayıcısı

Pubsub Sağlayıcısı, paketlenmiş bir Kubo düğümüyle birlikte Bitsocial uyumlu bir yedek pubsub aktarıcısı çalıştırmaya yarayan bir operatör hizmetidir. 5chan ve Seedit gibi güncel Bitsocial istemcileri tarayıcıda varsayılan olarak saf eşler arası ağ kullanır, ancak bu hizmet tarayıcı P2P'yi kapatan kullanıcılar için isteğe bağlı bir yedek yol olarak ve genel uyumluluk uç noktaları sunmak isteyen operatörler için hâlâ işe yarar.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker imajı**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Lisans**: GPL-3.0-or-later

## Neleri Çalıştırır

- pubsub, ağ geçidi, ad sağlayıcı ve devredilmiş yönlendirme yolları için genel bir HTTP proxy'si
- pubsub'ı etkin olan, paketlenmiş bir Kubo düğümü
- `/routing/v1/providers` adresinde devredilmiş bir HTTP yönlendirme sağlayıcısı
- `/metrics` adresinde Prometheus metrikleri
- tam Kubo RPC API'sine isteğe bağlı basic-auth erişimi

## Portlar

Varsayılanlar, Pubsub Sağlayıcısı'nın aynı VPS üzerinde [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) ile yan yana çalışabilmesi ve swarm portu çakışması yaşanmaması için seçilmiştir.

| Amaç                | Varsayılan                              | Notlar                                                                     |
| ------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| Genel HTTP proxy'si | `8000` uygulama, `80` Docker ana makine | Ana makine portunu değiştirmek için `PUBSUB_PROVIDER_HTTP_PORT` ayarlayın. |
| Kubo swarm          | `4002` TCP/UDP                          | Seeder'ın varsayılan Kubo swarm portu `4001` ile çakışmayı önler.          |
| Kubo API            | `5001` yalnızca yerel                   | Proxy tarafından dahili olarak kullanılır.                                 |
| Kubo ağ geçidi      | `8080` yalnızca yerel                   | Proxy tarafından dahili olarak kullanılır.                                 |

## Docker Kurulumu

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Günlükleri kontrol edin:

```bash
docker logs --follow pubsub-provider
```

Proxy'yi test edin:

```bash
curl http://127.0.0.1/commit-hash
```

## Yükseltme

Daha önce eski `latest` imajını çalıştırdıysanız, Compose'u konteyneri sabitlenmiş yayımlanmış imajdan yeniden oluşturmaya zorlayın:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Düzeltilmiş imajın çalıştığını doğrulayın:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Günlüklerde `using Kubo binary at /app/bin/ipfs` satırı bulunmalı, `downloading ipfs` satırı ise bulunmamalıdır.

## Bitsocial Seeder ile Birlikte Çalıştırma

Aynı makinede `bitsocial-seeder` de çalışıyorsa, Pubsub Sağlayıcısı'nı `4002` swarm portunda ya da `4001` dışındaki başka bir portta tutun:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Böylece iki Kubo düğümünün de TCP/UDP `4001` portuna bağlanmaya çalışmasından doğan çakışma önlenir.

## Yapılandırma

Sık kullanılan ortam değişkeni geçersiz kılmaları:

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

Sağlayıcıyı tarayıcı P2P'nin yerine geçen bir çözüm olarak değil, bir yedek aktarıcı olarak kullanın. Ağın özel eş keşif kapasitesine ihtiyaç duyduğu durumlarda izleyici altyapısını ayrıca çalıştırmaya devam edin.
