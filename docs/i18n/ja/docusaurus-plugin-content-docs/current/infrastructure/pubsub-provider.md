---
title: Pubsub Provider
description: Bitsocial の運用者向けの、フォールバック pubsub リレーと委譲ルーティングのプロバイダー。
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider は、Kubo ノードを同梱した Bitsocial 互換の pubsub フォールバックリレーを動かすための運用者向けサービスです。5chan や Seedit といった最近の Bitsocial クライアントは、既定でブラウザ上の純粋なピアツーピアネットワークを使いますが、このサービスは、ブラウザ P2P を無効にした利用者のための任意のフォールバック経路として、また公開の互換エンドポイントを用意したい運用者にとって、引き続き有用です。

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker イメージ**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **ライセンス**: GPL-3.0-or-later

## 何が動くのか

- pubsub、ゲートウェイ、name-provider、委譲ルーティングの各ルートを提供する公開 HTTP プロキシ
- pubsub を有効にした、同梱の Kubo ノード
- `/routing/v1/providers` で提供される委譲 HTTP ルーティングプロバイダー
- `/metrics` の Prometheus メトリクス
- Kubo の RPC API 全体への、基本認証による任意のアクセス

## ポート

既定値は、Pubsub Provider が同じ VPS 上で [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) と並んで動けるよう、swarm ポートが衝突しないように選ばれています。

| 用途               | 既定値                            | 備考                                                                    |
| ------------------ | --------------------------------- | ----------------------------------------------------------------------- |
| 公開 HTTP プロキシ | アプリ `8000`、Docker ホスト `80` | ホスト側のポートを変えるには `PUBSUB_PROVIDER_HTTP_PORT` を設定します。 |
| Kubo swarm         | `4002` TCP/UDP                    | シーダーの既定の Kubo swarm ポート `4001` を避けます。                  |
| Kubo API           | `5001` ローカルのみ               | プロキシが内部で使います。                                              |
| Kubo ゲートウェイ  | `8080` ローカルのみ               | プロキシが内部で使います。                                              |

## Docker でのセットアップ

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

ログを確認します。

```bash
docker logs --follow pubsub-provider
```

プロキシを試します。

```bash
curl http://127.0.0.1/commit-hash
```

## アップグレード

以前に古い `latest` イメージを動かしていた場合は、固定して公開されたイメージからコンテナを作り直すよう Compose に強制します。

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

修正済みのイメージが動いていることを確認します。

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

ログには `using Kubo binary at /app/bin/ipfs` が含まれ、`downloading ipfs` は含まれないはずです。

## Bitsocial Seeder と併用する

同じホストで `bitsocial-seeder` も動かしている場合は、Pubsub Provider の swarm ポートを `4002` か、`4001` 以外の別のポートにしておいてください。

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

こうすることで、2 つの Kubo ノードがどちらも TCP/UDP の `4001` にバインドしようとして起きるポートの衝突を避けられます。

## 設定

よく使う環境変数の上書きは次のとおりです。

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

このプロバイダーはフォールバックのリレーとして使い、ブラウザ P2P の代替にはしないでください。ネットワークに専用のピアディスカバリ能力が必要なときは、トラッカーのインフラを別途動かし続けてください。
