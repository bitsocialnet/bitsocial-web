---
title: EVM コントラクト呼び出しチャレンジ
description: EVM スマート コントラクトを呼び出してオンチェーンの状態を検証するスパム対策チャレンジ。
sidebar_position: 4
---

# EVM コントラクト呼び出しチャレンジ

:::warning Legacy Naming
このパッケージは当初、`@plebbit` スコープで公開されました。名前が `@bitsocial/evm-contract-challenge` に変更されました。古い名前への参照は、古いドキュメントやコードベースにまだ記載されている場合があります。
:::

EVM Contract Call Challenge は、パブリケーションを許可する前にオンチェーンの状態を検証するスパム対策メカニズムです。元々は `plebbit-js` からスタンドアロン パッケージとして抽出されたもので、コミュニティ所有者は、投稿するために作成者がスマート コントラクトで定義された基準を満たすこと (たとえば、最小トークン残高を保持すること) を要求できます。

**ソース コード:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call))

## 要件

- **Node.js** >= 22
- **ESM のみ** -- このパッケージには CommonJS ビルドは同梱されません。
- **ランタイム ピアの依存関係:** `@plebbit/plebbit-js` (`@pkc/pkc-js` への移行)

## インストール

```bash
npm install @bitsocial/evm-contract-challenge
```

## 構成オプション

| オプション    | タイプ   | 説明                                                          |
| ------------- | -------- | ------------------------------------------------------------- |
| `chainTicker` | `string` | クエリするチェーン (例: `eth`、`matic`、`avax`)。             |
| `address`     | `string` | 呼び出すスマート コントラクト アドレス。                      |
| `abi`         | `string` | 呼び出される関数の ABI フラグメント。                         |
| `condition`   | `string` | コントラクトの戻り値に対して評価される比較式 (例: `> 1000`)。 |
| `error`       | `string` | 条件を満たさない著者に表示されるエラーメッセージ。            |

## 例

特定の ERC-20 トークンを 1,000 個以上保有する作成者に投稿を制限したいコミュニティ所有者は、次のようにチャレンジを構成します。

- `chainTicker`: `"eth"`
- `address`: トークン コントラクト アドレス
- `abi`: `balanceOf(address)` の ABI
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

作成者が公開しようとすると、チャレンジは作成者のアドレスを指定して `balanceOf` を呼び出します。戻り値が条件を満たすかどうかを確認します。一致する場合、出版は続行されます。それ以外の場合は、設定されたエラー メッセージが返されます。

## いつ使用するか

EVM コントラクト コール チャレンジは、次の場合に最適です。

- **トークン所有者への投稿を制限するトークンゲート コミュニティ**。特定の NFT の所有権が必要な
- **NFT ゲート アクセス**。参加が制限される
- **DAO ガバナンス スペース**。

オンチェーン ID に依存しないコミュニティの場合は、代わりに [スパムブロッカー](./spam-blocker.md) または [バウチャーチャレンジ](./voucher-challenge.md) を検討してください。
