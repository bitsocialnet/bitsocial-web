---
title: ספק Pubsub
description: ממסר pubsub לגיבוי וספק ניתוב מואצל עבור מפעילי Bitsocial.
sidebar_position: 3
---

# ספק Pubsub

Pubsub Provider הוא שירות למפעילים שמריץ ממסר pubsub תואם Bitsocial לגיבוי, יחד עם צומת Kubo מצורף. לקוחות Bitsocial מודרניים כמו 5chan ו-Seedit משתמשים כברירת מחדל ברשת עמית לעמית טהורה בדפדפן, אך השירות הזה נשאר שימושי כמסלול גיבוי אופציונלי עבור משתמשים שמכבים את ה-P2P בדפדפן, או עבור מפעילים שרוצים נקודות קצה ציבוריות לתאימות.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **תמונת Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **רישיון**: GPL-3.0-or-later

## מה הוא מריץ

- פרוקסי HTTP ציבורי עבור נתיבי pubsub, שער, ספק שמות וניתוב מואצל
- צומת Kubo מצורף עם pubsub מופעל
- ספק ניתוב HTTP מואצל בכתובת `/routing/v1/providers`
- מדדי Prometheus בכתובת `/metrics`
- גישה אופציונלית עם אימות בסיסי ל-API המלא של Kubo RPC

## פורטים

ברירות המחדל נבחרו כך ש-Pubsub Provider יוכל לרוץ לצד [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) על אותו VPS בלי התנגשות בפורט ה-swarm.

| ייעוד              | ברירת מחדל                          | הערות                                                 |
| ------------------ | ----------------------------------- | ----------------------------------------------------- |
| פרוקסי HTTP ציבורי | `8000` באפליקציה, `80` במארח Docker | הגדירו `PUBSUB_PROVIDER_HTTP_PORT` לשינוי פורט המארח. |
| swarm של Kubo      | `4002` TCP/UDP                      | נמנע מפורט swarm ברירת המחדל `4001` של ה-seeder.      |
| API של Kubo        | `5001` מקומי בלבד                   | בשימוש פנימי של הפרוקסי.                              |
| שער Kubo           | `8080` מקומי בלבד                   | בשימוש פנימי של הפרוקסי.                              |

## התקנה עם Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

בדיקת הלוגים:

```bash
docker logs --follow pubsub-provider
```

בדיקת הפרוקסי:

```bash
curl http://127.0.0.1/commit-hash
```

## שדרוג

אם הרצתם קודם לכן את תמונת ה-`latest` הישנה, אלצו את Compose ליצור מחדש את הקונטיינר מהתמונה המפורסמת והמוצמדת:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

ודאו שהתמונה המתוקנת רצה:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

הלוגים אמורים לכלול `using Kubo binary at /app/bin/ipfs` ואינם אמורים לכלול `downloading ipfs`.

## הרצה יחד עם Bitsocial Seeder

אם אותו מארח מריץ גם את `bitsocial-seeder`, השאירו את Pubsub Provider על פורט swarm `4002` או על פורט אחר שאינו `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

כך נמנעת התנגשות הפורטים שמתרחשת כששני צמתי Kubo מנסים שניהם להיקשר ל-TCP/UDP `4001`.

## תצורה

דריסות סביבה נפוצות:

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

השתמשו בספק כממסר גיבוי, לא כתחליף ל-P2P בדפדפן. המשיכו להריץ את תשתית ה-tracker בנפרד כאשר הרשת זקוקה לקיבולת ייעודית לגילוי עמיתים.
