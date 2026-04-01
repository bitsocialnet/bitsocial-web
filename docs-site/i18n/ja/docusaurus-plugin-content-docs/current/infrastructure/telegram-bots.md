---
title: Telegram ボット
description: Bitsocial コミュニティ一覧を監視し、投稿を Telegram チャンネルへ転送するフィード ボット。
sidebar_position: 3
---

# Telegram ボット

Bitsocial Telegram ボットは、Bitsocial ネットワーク上のクライアント コミュニティ一覧を監視し、新しい投稿を Telegram チャンネルへ自動転送します。転送される各メッセージには、5chan と Seedit の元投稿へ戻るインライン ボタンが含まれます。

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## 利用可能なボット

| ボット              | ステータス | 説明                                                                      |
| ------------------- | ---------- | ------------------------------------------------------------------------- |
| **5chan フィード**  | アクティブ | すべての 5chan ディレクトリを監視し、新しい投稿を Telegram に転送します。 |
| **Seedit フィード** | 計画中     | Seedit コミュニティにも同じ機能を提供します。                             |

## セットアップ

### 前提条件

- Node.js
- Yarn
- Telegram ボット トークン ([BotFather](https://t.me/BotFather) で作成)

### インストール

リポジトリをクローンして依存関係をインストールします。

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### 設定

ボット トークンを使って、プロジェクトのルートに `.env` ファイルを作成します。

```env
BOT_TOKEN=your_telegram_bot_token
```

### 実行

環境を設定したらボットを起動します。

```bash
yarn start
```

## 投稿形式

ボットが Telegram に投稿を転送するときは、2 つのインライン ボタンが付きます。

- **5chan で表示** -- 5chan Web クライアントで投稿を開きます。
- **Seedit で表示** -- Seedit Web クライアントで投稿を開きます。

これにより、Telegram の購読者は好みのクライアントから直接、完全な議論スレッドに移動できます。
