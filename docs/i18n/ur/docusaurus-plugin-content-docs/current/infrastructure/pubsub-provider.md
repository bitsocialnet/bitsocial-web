---
title: Pubsub فراہم کنندہ
description: Bitsocial آپریٹرز کے لیے فال بیک pubsub ریلے اور ڈیلیگیٹڈ روٹنگ فراہم کنندہ۔
sidebar_position: 3
---

# Pubsub فراہم کنندہ

Pubsub Provider ایک آپریٹر سروس ہے جو بنڈل شدہ Kubo نوڈ کے ساتھ Bitsocial کے موافق pubsub فال بیک ریلے چلاتی ہے۔ 5chan اور Seedit جیسے جدید Bitsocial کلائنٹس بطورِ ڈیفالٹ براؤزر میں خالص پیئر ٹو پیئر نیٹ ورکنگ استعمال کرتے ہیں، مگر یہ سروس ان صارفین کے لیے ایک اختیاری فال بیک راستے کے طور پر اور ان آپریٹرز کے لیے مفید رہتی ہے جو عوامی مطابقت والے اینڈ پوائنٹس رکھنا چاہتے ہیں۔

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker امیج**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **لائسنس**: GPL-3.0-or-later

## یہ کیا چلاتا ہے

- pubsub، گیٹ وے، نام فراہم کنندہ، اور ڈیلیگیٹڈ روٹنگ راستوں کے لیے ایک عوامی HTTP پراکسی
- pubsub فعال کیے ہوئے ایک بنڈل شدہ Kubo نوڈ
- `/routing/v1/providers` پر ایک ڈیلیگیٹڈ HTTP روٹنگ فراہم کنندہ
- `/metrics` پر Prometheus میٹرکس
- مکمل Kubo RPC API تک اختیاری بیسک آتھ رسائی

## پورٹس

ڈیفالٹ اقدار اس طرح چنی گئی ہیں کہ Pubsub Provider اسی VPS پر [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) کے ساتھ swarm پورٹ کے ٹکراؤ کے بغیر چل سکے۔

| مقصد              | ڈیفالٹ                       | نوٹس                                                         |
| ----------------- | ---------------------------- | ------------------------------------------------------------ |
| عوامی HTTP پراکسی | ایپ `8000`، Docker ہوسٹ `80` | ہوسٹ پورٹ بدلنے کے لیے `PUBSUB_PROVIDER_HTTP_PORT` سیٹ کریں۔ |
| Kubo swarm        | `4002` TCP/UDP               | سیڈر کے ڈیفالٹ Kubo swarm پورٹ `4001` سے بچاتا ہے۔           |
| Kubo API          | `5001` صرف مقامی             | پراکسی اسے اندرونی طور پر استعمال کرتی ہے۔                   |
| Kubo گیٹ وے       | `8080` صرف مقامی             | پراکسی اسے اندرونی طور پر استعمال کرتی ہے۔                   |

## Docker سیٹ اپ

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

لاگز دیکھیں:

```bash
docker logs --follow pubsub-provider
```

پراکسی آزمائیں:

```bash
curl http://127.0.0.1/commit-hash
```

## اپ گریڈ کرنا

اگر آپ پہلے پرانی `latest` امیج چلا رہے تھے، تو Compose کو مجبور کریں کہ وہ کنٹینر پن شدہ شائع شدہ امیج سے دوبارہ بنائے:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

تصدیق کریں کہ درست کی گئی امیج چل رہی ہے:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

لاگز میں `using Kubo binary at /app/bin/ipfs` شامل ہونا چاہیے اور `downloading ipfs` شامل نہیں ہونا چاہیے۔

## Bitsocial Seeder کے ساتھ چلانا

اگر وہی ہوسٹ `bitsocial-seeder` بھی چلا رہا ہے، تو Pubsub Provider کو swarm پورٹ `4002` یا کسی اور غیر-`4001` پورٹ پر رکھیں:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

اس سے وہ پورٹ ٹکراؤ نہیں ہوتا جو تب پیش آتا ہے جب دو Kubo نوڈس ایک ہی TCP/UDP `4001` پر بائنڈ کرنے کی کوشش کریں۔

## کنفیگریشن

عام ماحولیاتی اوور رائیڈز:

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

فراہم کنندہ کو فال بیک ریلے کے طور پر استعمال کریں، براؤزر P2P کے متبادل کے طور پر نہیں۔ جب نیٹ ورک کو پیئر دریافت کی وقف شدہ گنجائش درکار ہو تو ٹریکر انفراسٹرکچر الگ سے چلاتے رہیں۔
