---
title: パーミッションレス パブリック RPC
description: 分離されたユーザー、範囲指定されたパーミッション、およびコミュニティの所有権を備えたパブリック Bitsocial RPC サービスの設計案。
---

# パーミッションレス パブリック RPC

元のパブリック RPC 提案は、古いプレビット用語で書かれた GitHub の問題として存在していました。このページは、そのアイデアを Bitsocial 言語で書き直して、実装の詳細の壁ではなく、製品レベルの提案としてまとめています。

## わかりやすい目標

Bitsocial Forge は、オペレーターをコミュニティの管理者にすることなく、多くのユーザーが自分の Bitsocial コミュニティをリモートで管理できるようにするパブリック RPC サービスを実行できます。

このサービスは、次の 3 つの機能を維持しながら、モバイル クライアントと軽量クライアントを実用的なものにする必要があります。制約:

1. ユーザーはデフォルトで互いに分離されたままになります。
2. 権限は明示的かつ詳細に保たれます。
3. 現在の RPC リクエストと応答の形状との互換性は、ロールアウト中に維持できます。

## それが解決する問題

現在、最も単純な RPC モデルは通常、オール オアナッシングです。1 つの認証キー、1 つの権限ドメイン、フル アクセスです。これは単一のオペレータでは機能しますが、パブリック マルチユーザー サービスでは機能しません。

パーミッションレス パブリック RPC には、より強力なモデルが必要です。

- 1 つのサービスで多くのユーザーをホストできる
- 各ユーザーが独自のコミュニティと制限を取得できる
- オペレーター定義のポリシーで悪用を防止できる
- ユーザーは後で移動したり、後でセルフホストしたりできる

## コアモデル

### ユーザー

各ユーザーは、認証資格情報と権限バンドルを取得します。

### コミュニティ

サービスを通じて作成されたコミュニティは、所有者レコードに割り当てられます。所有権は明示的に追跡されるため、管理方法の範囲を適切なユーザーに限定できます。

### 権限

権限は機能ベースです。 「RPC を使用できる」を表す 1 つのブール値の代わりに、サーバーは以下を制御できます。

- ユーザーが作成できるコミュニティの数
- 使用可能な管理方法
- 許可される公開操作
- 適用されるレート制限
- 表示される管理画面

### 管理画面

パブリック RPC 自体に重点を置く必要があるユーザー向けの RPC 動作。ユーザーの作成、所有権の移転、監査レビューなどの管理タスクは、別のオペレーター API とダッシュボードに属します。

## 互換性のスタンス

ユーザー向けのドキュメントでは、**コミュニティ** や **プロファイル** などの Bitsocial 用語を使用する必要があります。

ワイヤ レベルでは、最初のロールアウトでは、互換性に役立つ現在の JSON-RPC トランスポートとペイロードの形状を保持できます。言い換えれば、移行期間中に一部の従来のメソッド名やリクエスト シェイプが舞台裏で維持されていたとしても、ドキュメントは古いプレビット ドキュメントのように話す必要はなくなりました。

## 提案されたパーミッション バンドル

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

正確なメソッド名は例示です。重要な部分はポリシーの形状です。個々の機能は 1 つのスーパーユーザー トークンにバンドルされるのではなく、独立して制御されます。

## 接続フロー

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

権限の認識はオプションのままである必要があります。通知を無視したクライアントでも、サーバーからの標準的な認証エラーを処理することで正しく動作できます。

## 所有権の強制

サービスはコミュニティを作成するときに、呼び出し側ユーザーに所有権を自動的に割り当てる必要があります。そこから:

- コミュニティの開始、停止、編集、削除のアクションは所有者スコープです
- リストとサブスクリプションの応答は、発信者自身のコミュニティにデフォルトで設定されます
- より広範な可視性は、デフォルトではなく明示的な管理者権限です

1 つのエッジ ケースが非常に重要です。ユーザーが**自分が所有していない**コミュニティにサブスクライブしている場合、サーバーは外部の観察者が参照できる公開状態のみを公開する必要があります。所有者限定の構成または内部ランタイム データは、サブスクリプション API を通じて決して漏洩してはなりません。

## 推奨されるオペレーター サーフェス

管理 API は、退屈で明示的なままになる可能性があります。

- ユーザーのリスト
- 1 人のユーザーの検査
- ユーザーの作成または更新
- ユーザーの削除
- コミュニティの転送所有権
- 監査ログの検査

このオペレーター API の認証は、エンドユーザーの RPC 認証とは完全に分離されている必要があります。

## ロールアウト フェーズ

### フェーズ 1

- パブリック RPC プロジェクト構造を確立する
- ユーザー レコードと所有権追跡を追加する
- 現在の RPC サーバーをフォークまたは拡張する

### フェーズ 2

- 権限バンドルを実装する
- RPC メソッド層で強制する
- return接続時の権限メタデータ

### フェーズ 3

- オペレーター API を追加
- 監査ログを追加
- 管理者認証を追加

### フェーズ 4

- 管理ダッシュボードを出荷
- 不正行為制御をテスト
- レート制限とストレージを強化クォータ

## 未解決の質問

### 認証資格情報スパム

認証の作成が安価な場合、公共サービスは資格情報を発行する前にチャレンジ層を必要とする可能性があります。考えられる 1 つの方法は、コミュニティ チャレンジ モデル自体を再利用して、認証情報の発行がネットワークの残りの部分と同じ不正行為防止の理念を継承することです。

### レガシーな名前付け

一部の初期の実装では、互換性のためにレガシーなメソッド名が内部的に公開されている場合があります。これは、Bitsocial ドキュメントの永続的な公開語彙としてではなく、移行の詳細として扱う必要があります。

## 概要

この提案の本質は 1 つであり、公開 RPC インフラストラクチャを保管せずに有用なものにすることです。優れたパブリック Bitsocial RPC は、バックドアを通じて所有権を取り戻す新しい中央プラットフォームのようなものではなく、コミュニティを運営するためのオプションの支援のように感じられるべきです。
