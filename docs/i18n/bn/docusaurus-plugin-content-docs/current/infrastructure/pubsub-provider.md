---
title: Pubsub Provider
description: Bitsocial অপারেটরদের জন্য ফলব্যাক pubsub রিলে এবং ডেলিগেটেড রাউটিং প্রোভাইডার।
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider হলো একটি অপারেটর পরিষেবা, যা দিয়ে একটি বান্ডেল করা Kubo নোডসহ Bitsocial-সামঞ্জস্যপূর্ণ pubsub ফলব্যাক রিলে চালানো যায়। 5chan ও Seedit-এর মতো আধুনিক Bitsocial ক্লায়েন্টগুলো ডিফল্টভাবে ব্রাউজারেই বিশুদ্ধ পিয়ার-টু-পিয়ার নেটওয়ার্কিং ব্যবহার করে, তবু যাঁরা ব্রাউজার P2P বন্ধ রাখেন তাঁদের জন্য ঐচ্ছিক ফলব্যাক পথ হিসেবে, কিংবা যেসব অপারেটর পাবলিক সামঞ্জস্য এন্ডপয়েন্ট রাখতে চান তাঁদের জন্য এই পরিষেবাটি কাজে লাগে।

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker ইমেজ**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **লাইসেন্স**: GPL-3.0-or-later

## এটি যা চালায়

- pubsub, গেটওয়ে, name-provider ও ডেলিগেটেড রাউটিং রুটের জন্য একটি পাবলিক HTTP প্রক্সি
- pubsub সক্রিয় করা একটি বান্ডেল করা Kubo নোড
- `/routing/v1/providers`-এ একটি ডেলিগেটেড HTTP রাউটিং প্রোভাইডার
- `/metrics`-এ Prometheus মেট্রিক্স
- সম্পূর্ণ Kubo RPC API-তে ঐচ্ছিক বেসিক-অথ অ্যাক্সেস

## পোর্ট

ডিফল্ট মানগুলো এমনভাবে বেছে নেওয়া হয়েছে, যাতে Pubsub Provider একই VPS-এ [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/)-এর পাশাপাশি swarm-পোর্ট সংঘর্ষ ছাড়াই চলতে পারে।

| উদ্দেশ্য            | ডিফল্ট                          | মন্তব্য                                                  |
| ------------------- | ------------------------------- | -------------------------------------------------------- |
| পাবলিক HTTP প্রক্সি | `8000` অ্যাপ, `80` Docker হোস্ট | হোস্ট পোর্ট বদলাতে `PUBSUB_PROVIDER_HTTP_PORT` সেট করুন। |
| Kubo swarm          | `4002` TCP/UDP                  | seeder-এর ডিফল্ট Kubo swarm পোর্ট `4001` এড়িয়ে চলে।    |
| Kubo API            | `5001` শুধু লোকাল               | প্রক্সি অভ্যন্তরীণভাবে ব্যবহার করে।                      |
| Kubo গেটওয়ে        | `8080` শুধু লোকাল               | প্রক্সি অভ্যন্তরীণভাবে ব্যবহার করে।                      |

## Docker সেটআপ

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

লগ দেখুন:

```bash
docker logs --follow pubsub-provider
```

প্রক্সি পরীক্ষা করুন:

```bash
curl http://127.0.0.1/commit-hash
```

## আপগ্রেড করা

আগে যদি পুরোনো `latest` ইমেজ চালিয়ে থাকেন, তাহলে Compose-কে পিন করা প্রকাশিত ইমেজ থেকে কন্টেইনারটি নতুন করে তৈরি করতে বাধ্য করুন:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

সংশোধিত ইমেজটি চলছে কি না যাচাই করুন:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

লগে `using Kubo binary at /app/bin/ipfs` থাকা উচিত, আর `downloading ipfs` থাকা উচিত নয়।

## Bitsocial Seeder-এর সঙ্গে চালানো

একই হোস্টে যদি `bitsocial-seeder`-ও চলে, তাহলে Pubsub Provider-কে swarm পোর্ট `4002` অথবা `4001` নয় এমন অন্য কোনো পোর্টে রাখুন:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

দুটি Kubo নোড যখন একসঙ্গে TCP/UDP `4001`-এ বাঁধতে যায়, তখন যে পোর্ট সংঘর্ষ ঘটে, এতে সেটি এড়ানো যায়।

## কনফিগারেশন

সাধারণ এনভায়রনমেন্ট ওভাররাইড:

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

প্রোভাইডারটি ব্রাউজার P2P-এর বিকল্প হিসেবে নয়, একটি ফলব্যাক রিলে হিসেবে ব্যবহার করুন। নেটওয়ার্কের যখন নিবেদিত পিয়ার-আবিষ্কারের সক্ষমতা দরকার, তখন ট্র্যাকার অবকাঠামো আলাদাভাবে চালিয়ে যান।
