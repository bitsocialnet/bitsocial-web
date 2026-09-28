---
title: Pubsub Provider
description: รีเลย์ pubsub สำรองและผู้ให้บริการ delegated routing สำหรับผู้ดำเนินการ Bitsocial
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider คือบริการสำหรับผู้ดำเนินการที่ต้องการรันรีเลย์ pubsub สำรองซึ่งเข้ากันได้กับ Bitsocial พร้อมโหนด Kubo ที่มาให้ในตัว ไคลเอ็นต์ Bitsocial รุ่นใหม่อย่าง 5chan และ Seedit ใช้เครือข่ายแบบเพียร์ทูเพียร์ล้วน ๆ ในเบราว์เซอร์เป็นค่าเริ่มต้น แต่บริการนี้ยังมีประโยชน์ในฐานะเส้นทางสำรองที่เลือกใช้ได้ สำหรับผู้ใช้ที่ปิด P2P ในเบราว์เซอร์ หรือสำหรับผู้ดำเนินการที่อยากมีปลายทางสาธารณะไว้เพื่อความเข้ากันได้

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **อิมเมจ Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **ใบอนุญาต**: GPL-3.0-or-later

## บริการนี้รันอะไรบ้าง

- พร็อกซี HTTP สาธารณะสำหรับเส้นทาง pubsub, เกตเวย์, name-provider และ delegated routing
- โหนด Kubo ที่มาให้ในตัวโดยเปิดใช้ pubsub ไว้แล้ว
- ผู้ให้บริการ delegated HTTP routing ที่ `/routing/v1/providers`
- เมตริก Prometheus ที่ `/metrics`
- การเข้าถึง Kubo RPC API แบบเต็มด้วย basic auth ซึ่งจะเปิดใช้หรือไม่ก็ได้

## พอร์ต

ค่าเริ่มต้นถูกเลือกมาเพื่อให้ Pubsub Provider รันอยู่ข้าง ๆ [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) บน VPS เครื่องเดียวกันได้โดยพอร์ต swarm ไม่ชนกัน

| วัตถุประสงค์         | ค่าเริ่มต้น                   | หมายเหตุ                                                           |
| -------------------- | ----------------------------- | ------------------------------------------------------------------ |
| พร็อกซี HTTP สาธารณะ | แอป `8000`, โฮสต์ Docker `80` | ตั้งค่า `PUBSUB_PROVIDER_HTTP_PORT` เพื่อเปลี่ยนพอร์ตของโฮสต์      |
| Kubo swarm           | `4002` TCP/UDP                | เลี่ยงพอร์ต swarm ของ Kubo ที่ seeder ใช้เป็นค่าเริ่มต้นคือ `4001` |
| Kubo API             | `5001` เฉพาะภายในเครื่อง      | พร็อกซีใช้ภายในเท่านั้น                                            |
| Kubo gateway         | `8080` เฉพาะภายในเครื่อง      | พร็อกซีใช้ภายในเท่านั้น                                            |

## การติดตั้งด้วย Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

ตรวจดูบันทึกการทำงาน:

```bash
docker logs --follow pubsub-provider
```

ทดสอบพร็อกซี:

```bash
curl http://127.0.0.1/commit-hash
```

## การอัปเกรด

หากก่อนหน้านี้คุณรันอิมเมจ `latest` ตัวเก่า ให้บังคับ Compose สร้างคอนเทนเนอร์ขึ้นใหม่จากอิมเมจที่เผยแพร่และตรึงเวอร์ชันไว้:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

ยืนยันว่าอิมเมจที่แก้ไขแล้วกำลังทำงานอยู่:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

บันทึกการทำงานควรมี `using Kubo binary at /app/bin/ipfs` และไม่ควรมี `downloading ipfs`

## การรันร่วมกับ Bitsocial Seeder

หากโฮสต์เครื่องเดียวกันรัน `bitsocial-seeder` ด้วย ให้ Pubsub Provider ใช้พอร์ต swarm `4002` หรือพอร์ตอื่นที่ไม่ใช่ `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

วิธีนี้เลี่ยงการชนกันของพอร์ตที่เกิดขึ้นเมื่อโหนด Kubo สองตัวพยายามผูกกับ TCP/UDP `4001` พร้อมกัน

## การตั้งค่า

ตัวแปรสภาพแวดล้อมที่มักถูกกำหนดทับ:

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

ใช้ provider นี้เป็นรีเลย์สำรอง ไม่ใช่ตัวแทนของ P2P ในเบราว์เซอร์ และให้รันโครงสร้างพื้นฐานของ tracker แยกต่างหากต่อไป เมื่อเครือข่ายต้องการกำลังสำหรับการค้นหาเพียร์โดยเฉพาะ
