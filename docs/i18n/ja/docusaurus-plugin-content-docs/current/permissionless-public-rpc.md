---
title: 許可のないパブリック RPC
description: 分離されたユーザー、範囲指定されたアクセス許可、およびコミュニティの所有権を備えたパブリック Bitsocial RPC サービスの設計案。
---

# 許可のないパブリック RPC

このページでは、実装の詳細の壁ではなく、パブリック RPC を製品レベルの Bitsocial 提案として組み立てます。

## わかりやすい目標

[Bitsocial Forge](https://bitsocialforge.com) は、オペレーターがコミュニティの管理者になることなく、多くのユーザーが自分の Bitsocial コミュニティをリモートで管理できるパブリック RPC サービスを実行できます。

このサービスは、次の 3 つの制約を維持しながら、モバイルおよび軽量クライアントを実用的なものにする必要があります。

1. デフォルトでは、ユーザーは互いに隔離されたままになります。
2. 権限は明示的かつ詳細なままです。
3. 現在の RPC 要求および応答の形状との互換性は、ロールアウト中に維持できます。

## どのような問題を解決するのか

現在、最も単純な RPC モデルは通常、1 つの認証キー、1 つの権限ドメイン、フル アクセスというオール オアナッシングです。これは単一のオペレータでは機能しますが、パブリック マルチユーザー サービスでは機能しません。

パーミッションレスなパブリック RPC には、より強力なモデルが必要です。

- 1 つのサービスで多くのユーザーをホストできる
- 各ユーザーは独自のコミュニティと制限を取得します
- オペレータ定義のポリシーにより悪用を防止できる
- ユーザーは後で離れたり自己ホストしたりすることができます

## コアモデル

### ユーザー

各ユーザーは、認証資格情報と権限バンドルを取得します。

### コミュニティ

サービスを通じて作成されたコミュニティは、所有者レコードに割り当てられます。所有権は明示的に追跡されるため、管理方法の範囲を適切なユーザーに限定できます。

### 権限

権限は機能ベースです。 「RPC を使用できる」を表す 1 つのブール値の代わりに、サーバーは以下を制御できます。

- ユーザーが作成できるコミュニティの数
- どのような管理方法が利用可能か
- どのような公開操作が許可されるか
- どのようなレート制限が適用されるか
- どの管理画面が表示されるか

### 管理画面

パブリック RPC 自体は、ユーザー向けの RPC 動作に重点を置く必要があります。ユーザーの作成、所有権の移転、監査レビューなどの管理タスクは、別のオペレーター API およびダッシュボードに属します。

## 互換性のスタンス

ユーザー向けのドキュメントでは、**コミュニティ** や **プロフィール** などの Bitsocial 用語を使用する必要があります。

ワイヤ レベルでは、最初のロールアウトでも現在の JSON-RPC トランスポートとペイロードの形状を維持でき、互換性に役立ちます。言い換えれば、移行期間中に互換性を重視したメソッド名やリクエスト形状が舞台裏で維持されていたとしても、ドキュメントは Bitsocial ネイティブのままであり続けることができます。

## 提案された権限バンドル

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

正確なメソッド名は一例です。重要な部分はポリシーの形状です。個々の機能は 1 つのスーパーユーザー トークンにバンドルされるのではなく、独立して制御されます。

## 接続の流れ

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

権限の認識はオプションのままにする必要があります。通知を無視したクライアントでも、サーバーからの標準的な認証エラーを処理することで正しく動作できます。

## 所有権の強制

サービスがコミュニティを作成するときは、呼び出し元のユーザーに所有権を自動的に割り当てる必要があります。そこから:

- コミュニティの開始、停止、編集、および削除のアクションは所有者スコープです
- リストとサブスクリプションの応答はデフォルトで発信者自身のコミュニティに設定されます
- より広い可視性はデフォルトではなく明示的な管理者権限です

1 つのエッジ ケースが非常に重要です。ユーザーが**自分が所有していない**コミュニティにサブスクライブしている場合、サーバーは、外部の観察者が参照できる公開状態のみを公開する必要があります。所有者のみの構成または内部ランタイム データは、サブスクリプション API を通じて決して漏洩してはなりません。

## 推奨されるオペレーター面

管理 API は退屈で明示的なままになる場合があります。

- ユーザーをリストする
- 1人のユーザーを検査する
- ユーザーを作成または更新する
- ユーザーを削除する
- コミュニティの所有権を譲渡する
- 監査ログを検査する

このオペレーター API の認証は、エンドユーザーの RPC 認証とは完全に分離されている必要があります。

## 展開フェーズ

### フェーズ 1

- パブリック RPC プロジェクト構造を確立する
- ユーザーレコードと所有権追跡を追加する
- 現在の RPC サーバーをフォークまたは拡張します

### フェーズ2

- 権限バンドルを実装する
- RPC メソッド層でそれらを強制する
- 接続時に権限メタデータを返す

### フェーズ 3

- オペレーターAPIを追加する
- 監査ログを追加する
- 管理者認証を追加する

### フェーズ4

- 管理ダッシュボードを出荷する
- テストの乱用防止
- レート制限とストレージ割り当てを強化する

## 未解決の質問

### 認証資格情報スパム

認証の作成が安価な場合、公共サービスでは資格情報を発行する前にチャレンジ層が必要になる場合があります。考えられるルートの 1 つは、コミュニティ チャレンジ モデル自体を再利用して、資格情報の発行がネットワークの他の部分と同じ不正行為防止の理念を継承することです。

### 移行の詳細

一部の初期の実装では、互換性を重視したメソッド名が内部的に公開されている場合があります。これは、Bitsocial ドキュメントの永続的な公開用語としてではなく、移行の詳細として扱う必要があります。

## 概要

この提案の本質はただ 1 つであり、パブリック RPC インフラストラクチャを保管せずに有用なものにすることです。優れたパブリック Bitsocial RPC は、バックドアを通じて所有権を取り戻す新しい中央プラットフォームのようなものではなく、コミュニティを運営するためのオプションの支援のように感じられるべきです。
