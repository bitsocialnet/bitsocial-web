---
title: Captcha Canvas Challenge
description: 構成可能な文字、寸法、色を備えたスタンドアロンの画像ベースのキャプチャ ジェネレーター。
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Legacy Naming
このパッケージは当初、`@plebbit` スコープで公開されました。名前が `@bitsocial/captcha-canvas-challenge` に変更されました。古い名前への参照は、古いドキュメントやコードベースにまだ記載されている場合があります。
:::

Captcha Canvas Challenge は、もともと `plebbit-js` から抽出されたスタンドアロンの画像キャプチャ ジェネレーターです。ランダム化されたテキストを HTML キャンバスにレンダリングし、結果の画像を返します。コミュニティはスパム チャレンジとして作成者にその画像を提示できます。

**ソース コード:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## 要件

- **Node.js** >= 22
- **ESM のみ** -- このパッケージには CommonJS ビルドは同梱されません。
- **ランタイム ピアの依存関係:** `@plebbit/plebbit-js` (`@pkc/pkc-js` への移行)

## インストール

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## 構成オプション

| オプション   | タイプ   | デフォルト | 説明                                                   |
| ------------ | -------- | ---------- | ------------------------------------------------------ |
| `characters` | `number` | `6`        | キャプチャ画像にレンダリングされるランダムな文字の数。 |
| `height`     | `number` | `100`      | 生成された画像の高さ (ピクセル単位)。                  |
| `width`      | `number` | `300`      | 生成された画像の幅 (ピクセル単位)。                    |
| `colors`     | `string` | `#32cf7e`  | キャプチャ テキストに使用される原色。                  |

## 仕組み

1. ジェネレーターは、設定された長さのランダムな文字列を選択します。
2. 文字列は、OCR に耐えるために視覚的なノイズを含むキャンバス上にレンダリングされます。
3. 結果の画像 (および期待される応答) が返されるため、呼び出し側アプリケーションはチャレンジを提示し、後で応答を検証できます。

パッケージは純粋なイメージ ジェネレーターであるため、パッケージ上ではネットワークやセッション管理を処理しません。自分のもの。これは、たとえば [スパムブロッカー](./spam-blocker.md) でサポートされるチャレンジ タイプの 1 つとして、より大きなチャレンジ フローに統合されることを目的としています。
