---
title: CLI
description: Bitsocial ノードの実行、コミュニティの作成、プロトコル操作の管理のためのコマンドライン インターフェイス。
sidebar_position: 2
---

# CLI

:::warning 従来の命名
このパッケージは現在、上流の依存関係から継承された従来の命名規則を使用しています。コマンド、出力、構成における「plebbit」への参照は、将来のリリースでは「bitsocial」に移行される予定です。機能には影響しません。
:::

`bitsocial-cli` は、Bitsocial プロトコル バックエンドと対話するためのコマンドライン ツールです。ローカル P2P デーモンの実行、コミュニティの作成と構成、コンテンツの公開をすべてターミナルから行うことができます。

これは `plebbit-js` の上に構築され、コミュニティの作成とノード管理のために [5chan](/apps/5chan/) と [Seedit](/apps/seedit/) によって使用されます。

## インストール

事前に構築されたバイナリは Windows、macOS、Linux で利用できます。 GitHub からプラットフォームの最新リリースをダウンロードします:

**[GitHub リリースからダウンロード](https://github.com/bitsocialnet/bitsocial-cli/releases)**

ダウンロード後、バイナリ実行可能ファイルを作成します (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## デーモンの実行

CLI の最も一般的な用途は、Bitsocial ノードの実行です。デーモンは P2P を開始します。

```bash
bitsocial-cli daemon
```

最初の起動時に、デーモンはノード、コミュニティ、設定を管理するためのブラウザベースのグラフィカル インターフェイスである **WebUI** へのリンクを出力します。

## 主要なコマンド

|
| ------------------- | ----------------------------------------------------- |
| `daemon` | Bitsocial P2P ノードを開始します |
| `create subplebbit` |新しいコミュニティを作成します |
| `subplebbit edit` |コミュニティ設定 (タイトル、説明、ルール) を更新します |
| `subplebbit list` |このノードでホストされているコミュニティをリストします |
| `subplebbit start` |特定のコミュニティへのサービス提供を開始 |
| `subplebbit stop` |特定のコミュニティへの提供を停止する |

`--help` でコマンドを実行すると、利用可能なオプションとフラグが表示されます:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## 一般的なワークフロー

新しいコミュニティをホストするための一般的なセットアップ フロー:

```bash
# 1. デーモンの起動
bitsocial-cli daemon

# 2.別の端末でコミュニティを作成する
bitsocial-cli create subplebbit

# 3. コミュニティを設定する
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. 提供を開始します
bitsocial-cli subplebbit start <address>
```

コミュニティは現在 Bitsocial ネットワーク上で稼働しており、互換性のあるクライアントからアクセスできます。

## リンク

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
