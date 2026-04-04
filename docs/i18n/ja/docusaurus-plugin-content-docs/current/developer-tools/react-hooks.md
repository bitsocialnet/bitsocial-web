---
title: React Hooks
description: Bitsocial プロトコル上で分散型ソーシャル アプリケーションを構築するための React フック ライブラリ。
sidebar_position: 1
---

# React Hooks

:::warning 従来の命名
このパッケージは現在、上流のフォークから継承された従来の命名規則を使用しています。コード、API、構成における「plebbit」への参照は、将来のリリースでは「bitsocial」に移行される予定です。機能には影響しません。
:::

`bitsocial-react-hooks` パッケージは、Bitsocial プロトコルと対話するための使い慣れた React フック API を提供します。フィード、コメント、作成者プロフィールの取得、アカウントの管理、コンテンツの公開、コミュニティの購読をすべて中央サーバーに依存せずに処理します。

このライブラリは、[5chan](/apps/5chan/) やその他の Bitsocial クライアント アプリケーションで使用される主要なインターフェイスです。

:::note
`bitsocial-react-hooks` は、AI 支援開発のために維持されている `plebbit/plebbit-react-hooks` の一時的なフォークです。これは、npm に公開されるのではなく、GitHub から直接使用されます。
:::

## インストール

パッケージはまだ npm にないため、特定のコミット ハッシュに固定して、GitHub から直接インストールします。

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

`<commit-hash>` を対象のコミットに置き換えます。

## API の概要

フックは機能カテゴリに編成されています。以下は、各カテゴリで最も一般的に使用されるフックの概要です。完全な署名、パラメータ、戻り値の型については、[GitHub の完全な API リファレンス](https://github.com/bitsocialnet/bitsocial-react-hooks).

### アカウント

ローカル ユーザー アカウント、アイデンティティ、設定を管理します。

- `useAccount(accountName?)` -- アクティブな (または名前付き) アカウント オブジェクトを返します
- `useAccounts()` -- ローカルに保存されているすべてを返しますaccounts
- `useAccountComments(options?)` -- アクティブなアカウントによって公開されたコメントを返します

### コメント

個々のコメントとスレッドを取得して操作します。

- `useComment(commentCid?)` -- CID によって 1 つのコメントを取得します
- `useComments(commentCids?)` -- 複数のコメントを取得しますバッチ
- `useEditedComment(comment?)` -- コメントの最新編集バージョンを返します

### コミュニティ

コミュニティのメタデータと設定を取得します。

- `useSubplebbit(subplebbitAddress?)` -- アドレスでコミュニティを取得します
- `useSubplebbits(subplebbitAddresses?)` -- 複数のコミュニティを取得しますコミュニティ
- `useSubplebbitStats(subplebbitAddress?)` -- 購読者と投稿数を返します

### 著者

著者プロフィールとメタデータを検索します。

- `useAuthor(authorAddress?)` -- 著者プロフィールを取得します
- `useAuthorComments(options?)` -- 特定のユーザーによるコメントを返しますauthor
- `useResolvedAuthorAddress(authorAddress?)` -- 人間が読めるアドレス (ENS など) をそのプロトコル アドレスに解決します

### フィード

コンテンツ フィードを購読し、ページ分割します。

- `useFeed(options?)` -- 1 つ以上の投稿からページ分割されたフィードを返しますコミュニティ
- `useBufferedFeeds(feedOptions?)` -- レンダリングを高速化するために複数のフィードを事前バッファリングします
- `useAuthorFeed(authorAddress?)` -- 特定の作成者による投稿のフィードを返します

### アクション

コンテンツを公開し、書き込み操作を実行します。

- `usePublishComment(options?)` -- 新しいコメントを公開するか、 Reply
- `usePublishVote(options?)` -- 賛成票または反対票を投じます
- `useSubscribe(options?)` -- コミュニティに登録または登録解除します

### 状態と RPC

接続状態を監視し、リモート Bitsocial デーモンと対話します。

- `useClientsStates(options?)` -- の接続状態を返します。 IPFS/pubsub クライアント
- `usePlebbitRpcSettings()` -- 現在の RPC デーモン構成を返します

## 開発

ローカルでフック ライブラリを操作するには:

**前提条件:** Node.js、Corepack が有効、Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

テストとビルドについてはリポジトリの README を参照してくださいコマンド.

## リンク

- **GitHub:** [GitHub の完全な API リファレンス](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **ライセンス:** GPL-2.0 のみ
