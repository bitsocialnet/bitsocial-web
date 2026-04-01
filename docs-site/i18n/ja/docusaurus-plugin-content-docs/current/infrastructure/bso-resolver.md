---
title: BSO リゾルバー
description: 組み込みキャッシュとクロスプラットフォーム対応で、ENS TXT レコードを使って .bso ドメイン名を公開鍵に解決します。
sidebar_position: 1
---

# BSO リゾルバー

BSO リゾルバーは、ENS に保存された Bitsocial TXT レコードを読み取り、`.bso` ドメイン名を対応する公開鍵へ変換します。共有 viem クライアント、永続キャッシュを提供し、Node.js とブラウザの両方で動作します。

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **ライセンス**: GPL-2.0-only

## インストール

```bash
npm install @bitsocial/bso-resolver
```

## リゾルバーの作成

コンストラクターに設定オブジェクトを渡してリゾルバーを作成します。

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| パラメーター | 必須   | 説明                                                      |
| ------------ | ------ | --------------------------------------------------------- |
| `key`        | はい   | リゾルバー インスタンスの識別子。                         |
| `provider`   | はい   | トランスポート設定 (下記参照)。                           |
| `dataPath`   | いいえ | SQLite キャッシュ ファイルのディレクトリ (Node.js のみ)。 |

### プロバイダー オプション

`provider` パラメーターは次の 3 つの形式を受け入れます。

- **`"viem"`** -- viem が提供するデフォルトのパブリック トランスポートを使用します。
- **HTTP(S) URL** -- JSON-RPC エンドポイント経由で接続します (例: `https://mainnet.infura.io/v3/YOUR_KEY`)。
- **WebSocket URL** -- WebSocket RPC エンドポイント経由で接続します (例: `wss://mainnet.infura.io/ws/v3/YOUR_KEY`)。

## メソッド

### `resolve({ name, abortSignal? })`

`.bso` 名を検索し、対応する公開鍵を返します。長時間かかるリクエストを中止するために、任意の `AbortSignal` を渡せます。

### `canResolve({ name })`

リゾルバーが指定された名前を扱えるかどうかを示すブール値を返します。完全な解決を試す前のサポート確認に使えます。

### `destroy()`

リゾルバーを破棄し、データベース接続を閉じて、リソースを解放します。もう不要になったら呼び出してください。

## キャッシュ

解決済みの名前は、重複するネットワーク検索を減らすために自動的にキャッシュされます。キャッシュ バックエンドは実行環境に応じて選ばれます。

| 環境           | バックエンド     | 備考                                                               |
| -------------- | ---------------- | ------------------------------------------------------------------ |
| Node.js        | SQLite           | `dataPath` に保存されます。並行アクセスには WAL モードを使います。 |
| ブラウザ       | IndexedDB        | ネイティブの IndexedDB トランザクションを使います。                |
| フォールバック | インメモリ `Map` | SQLite も IndexedDB も使えない場合に使用されます。                 |

すべてのキャッシュ エントリには **1 時間の TTL** があり、期限切れになると自動的に削除されます。

## pkc-js との統合

このリゾルバーは `nameResolvers` オプション経由で pkc-js に直接組み込めます。これにより、キー検索中の `.bso` 名前解決を透過的に行えます。

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## 並行性

このリゾルバーは、並行利用でも安全になるよう設計されています。

- 単一の共有 viem クライアントにより、不要な接続を避けます。
- SQLite は WAL (Write-Ahead Logging) モードで動作し、同時読み取りをブロックせずに許可します。
- ブラウザのキャッシュは、分離性のためにネイティブの IndexedDB トランザクションに依存します。

## プラットフォーム エントリーポイント

このパッケージには、Node.js ビルドとブラウザ ビルド向けに別々のエントリーポイントが含まれています。`package.json` の `exports` フィールドをサポートするバンドラーは、正しいものを自動選択します。
