---
title: Seedit
description: 誰もがコミュニティを作成して所有できる、Bitsocial プロトコルに基づいて構築されたサーバーレスで分散型の Reddit スタイルのフォーラム。
sidebar_position: 2
---

# Seedit

Seedit は、Bitsocial プロトコルに基づいて構築された、古いスタイルの Reddit に代わるサーバーレス、管理者不要の完全分散型の代替手段です。これにより、ユーザーは自分のコミュニティに対する完全な所有権を得ることができます。誰でもコミュニティを作成でき、複数のコミュニティが `/s/funny` のような同じ短いルートをめぐって競い合うことができます。

## ダウンロード

| プラットフォーム | リンク                                                    |
| ---------------- | --------------------------------------------------------- |
| ウェブ           | [seedit.app](https://seedit.app)                          |
| Web (ENS)        | `seedit.eth` (Brave ブラウザーまたは IPFS Companion 経由) |
| デスクトップ     | Mac、Windows、Linux で利用可能                            |
| モバイル         | Android で利用可能                                        |

## コミュニティの仕組み

Seedit は、次のようなコミュニティにコンテンツを編成します。サブレディット。各コミュニティは作成者によって所有され、集中管理なしで動作します。複数のコミュニティが `/s/funny` のような同じ[ディレクトリ](/directories/)のルートをめぐって競い合うことができ、そのルートを開くと現在の勝者が表示されます。購読と投稿へのリンクは、常に特定のコミュニティを正確に指します。

### コミュニティの作成

新しいコミュニティを作成するには、次の 2 つの方法があります。

1. **デスクトップ クライアント** - デスクトップ アプリケーションの組み込み GUI を使用して、コミュニティをセットアップおよび構成します。
2. **bitsocial-cli** — CLI ツールを実行して、コマンド ラインからコミュニティを作成および管理します。

### デフォルト コミュニティ リスト

新しいアカウントは、[bitsocialnet/lists](https://github.com/bitsocialnet/lists) リポジトリの `seedit-default-subscriptions.json` で定義された、特定のコミュニティからなるデフォルトリストを購読します。ディレクトリの候補は、同じリポジトリ内の `seedit-directories/seedit-<code>-directory.json` ファイルに掲載されています。どちらかのリストにコミュニティを追加するには、コミュニティの詳細を含むプルリクエストを送信します。

## リンク

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **テレグラム**: [t.me/seeditreact](https://t.me/seeditreact)
- **ライセンス**: GPL-2.0 のみ
