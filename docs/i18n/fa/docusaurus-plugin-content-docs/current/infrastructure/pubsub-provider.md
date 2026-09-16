---
title: ارائه‌دهنده Pubsub
description: رله پشتیبان pubsub و ارائه‌دهنده مسیریابی تفویض‌شده برای اپراتورهای Bitsocial.
sidebar_position: 3
---

# ارائه‌دهنده Pubsub

ارائه‌دهنده Pubsub یک سرویس اپراتوری برای اجرای یک رله پشتیبان pubsub سازگار با Bitsocial، همراه با یک گره Kubo بسته‌بندی‌شده است. کلاینت‌های امروزی Bitsocial مانند 5chan و Seedit به‌طور پیش‌فرض از شبکه‌سازی همتا به همتای خالص در مرورگر استفاده می‌کنند، اما این سرویس همچنان به‌عنوان یک مسیر پشتیبان اختیاری مفید است: برای کاربرانی که P2P مرورگر را غیرفعال می‌کنند، یا برای اپراتورهایی که نقاط پایانی سازگاری عمومی می‌خواهند.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **ایمیج Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **مجوز**: GPL-3.0-or-later

## چه چیزی را اجرا می‌کند

- یک پروکسی عمومی HTTP برای مسیرهای pubsub، gateway، name-provider و مسیریابی تفویض‌شده
- یک گره Kubo بسته‌بندی‌شده با pubsub فعال
- یک ارائه‌دهنده مسیریابی تفویض‌شده HTTP روی `/routing/v1/providers`
- متریک‌های Prometheus روی `/metrics`
- دسترسی اختیاری با basic-auth به کل API RPC مربوط به Kubo

## پورت‌ها

مقادیر پیش‌فرض چنان انتخاب شده‌اند که ارائه‌دهنده Pubsub بتواند کنار [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) روی همان VPS و بدون تداخل پورت swarm اجرا شود.

| کاربرد            | پیش‌فرض                              | یادداشت                                                             |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------- |
| پروکسی عمومی HTTP | `8000` در اپ، `80` روی میزبان Docker | برای تغییر پورت میزبان `PUBSUB_PROVIDER_HTTP_PORT` را تنظیم کنید.   |
| swarm در Kubo     | `4002` روی TCP/UDP                   | با پورت پیش‌فرض swarm در Kubo نزد سیدر، یعنی `4001`، تداخل نمی‌کند. |
| API در Kubo       | `5001` فقط محلی                      | پروکسی به‌صورت داخلی از آن استفاده می‌کند.                          |
| دروازه Kubo       | `8080` فقط محلی                      | پروکسی به‌صورت داخلی از آن استفاده می‌کند.                          |

## راه‌اندازی با Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

بررسی لاگ‌ها:

```bash
docker logs --follow pubsub-provider
```

آزمودن پروکسی:

```bash
curl http://127.0.0.1/commit-hash
```

## ارتقا

اگر پیش‌تر ایمیج قدیمی `latest` را اجرا می‌کردید، Compose را وادار کنید کانتینر را از ایمیج منتشرشده و پین‌شده از نو بسازد:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

بررسی کنید که ایمیج اصلاح‌شده در حال اجراست:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

لاگ‌ها باید شامل `using Kubo binary at /app/bin/ipfs` باشند و نباید شامل `downloading ipfs` باشند.

## اجرا در کنار Bitsocial Seeder

اگر همان میزبان `bitsocial-seeder` را هم اجرا می‌کند، ارائه‌دهنده Pubsub را روی پورت swarm برابر `4002` یا هر پورت دیگری غیر از `4001` نگه دارید:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

این کار جلوی تداخل پورتی را می‌گیرد که وقتی دو گره Kubo هر دو می‌خواهند TCP/UDP `4001` را بگیرند رخ می‌دهد.

## پیکربندی

بازنویسی‌های رایج متغیرهای محیطی:

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

از این ارائه‌دهنده به‌عنوان یک رله پشتیبان استفاده کنید، نه جایگزینی برای P2P مرورگر. وقتی شبکه به ظرفیت اختصاصی برای کشف همتا نیاز دارد، زیرساخت تراکر را جداگانه در حال اجرا نگه دارید.
