---
title: مزوّد Pubsub
description: مُرحِّل pubsub احتياطي ومزوّد توجيه مفوَّض لمشغّلي Bitsocial.
sidebar_position: 3
---

# مزوّد Pubsub

مزوّد Pubsub خدمة موجّهة للمشغّلين لتشغيل مُرحِّل pubsub احتياطي متوافق مع Bitsocial مع عقدة Kubo مدمجة. تستخدم عملاء Bitsocial الحديثة مثل 5chan وSeedit شبكة نظير إلى نظير خالصة داخل المتصفح افتراضيًا، لكن هذه الخدمة تظل مفيدة كمسار احتياطي اختياري للمستخدمين الذين يعطّلون P2P في المتصفح، أو للمشغّلين الذين يريدون نقاط نهاية عامة للتوافق.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **صورة Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **الترخيص**: GPL-3.0-or-later

## ما الذي تشغّله

- وسيط HTTP عام لمسارات pubsub والبوابة ومزوّد الأسماء والتوجيه المفوَّض
- عقدة Kubo مدمجة مع تفعيل pubsub
- مزوّد توجيه HTTP مفوَّض على `/routing/v1/providers`
- مقاييس Prometheus على `/metrics`
- وصول اختياري بمصادقة أساسية إلى واجهة Kubo RPC الكاملة

## المنافذ

اختيرت القيم الافتراضية بحيث يمكن تشغيل مزوّد Pubsub إلى جانب [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) على الخادم الافتراضي (VPS) نفسه دون تعارض في منفذ swarm.

| الغرض               | القيمة الافتراضية                 | ملاحظات                                              |
| ------------------- | --------------------------------- | ---------------------------------------------------- |
| وسيط HTTP العام     | `8000` للتطبيق، `80` لمضيف Docker | اضبط `PUBSUB_PROVIDER_HTTP_PORT` لتغيير منفذ المضيف. |
| swarm في Kubo       | `4002` TCP/UDP                    | يتفادى منفذ swarm الافتراضي `4001` لدى الـ seeder.   |
| واجهة Kubo البرمجية | `5001` محليًا فقط                 | يستخدمها الوسيط داخليًا.                             |
| بوابة Kubo          | `8080` محليًا فقط                 | يستخدمها الوسيط داخليًا.                             |

## الإعداد عبر Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

تحقّق من السجلات:

```bash
docker logs --follow pubsub-provider
```

اختبر الوسيط:

```bash
curl http://127.0.0.1/commit-hash
```

## الترقية

إذا كنت تشغّل سابقًا صورة `latest` القديمة، فأجبر Compose على إعادة إنشاء الحاوية من الصورة المنشورة المثبّتة:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

تأكّد من أن الصورة المصحّحة هي التي تعمل:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

يجب أن تتضمن السجلات `using Kubo binary at /app/bin/ipfs` وألا تتضمن `downloading ipfs`.

## التشغيل مع Bitsocial Seeder

إذا كان المضيف نفسه يشغّل أيضًا `bitsocial-seeder`، فأبقِ مزوّد Pubsub على منفذ swarm رقم `4002` أو أي منفذ آخر غير `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

يتفادى ذلك تعارض المنافذ الذي يحدث عندما تحاول عقدتا Kubo كلتاهما الارتباط بمنفذ TCP/UDP رقم `4001`.

## الإعدادات

أهم متغيرات البيئة التي يمكن تجاوزها:

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

استخدم المزوّد كمُرحِّل احتياطي، لا كبديل عن P2P في المتصفح. وواصل تشغيل بنية التتبّع بشكل منفصل عندما تحتاج الشبكة إلى طاقة مخصصة لاكتشاف الأقران.
