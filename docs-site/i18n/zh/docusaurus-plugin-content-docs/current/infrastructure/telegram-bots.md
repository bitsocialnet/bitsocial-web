---
title: 电报机器人
description: 监控 Bitsocial 社区列表并将帖子转发到 Telegram 频道的 Feed 机器人。
sidebar_position: 3
---

# 电报机器人

Bitsocial Telegram 机器人监控 Bitsocial 网络上的客户社区列表，并自动将新帖子转发到 Telegram 频道。每条转发的消息都包含内嵌按钮，可链接回 5chan 和 Seeedit 上的原始帖子。

- **GitHub**: [bitsocialnet/bitsocial-电报机器人](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## 可用的机器人

| 机器人           | 状态 | 描述                                           |
| ---------------- | ---- | ---------------------------------------------- |
| **5chan 饲料**   | 活跃 | 监控所有 5chan 目录并将新帖子转发到 Telegram。 |
| **种子编辑饲料** | 计划 | 将为 Seeedit 社区提供相同的功能。              |

## 设置

### 先决条件

- Node.js
- 纱
- 一个 Telegram 机器人代币（通过 [机器人之父](https://t.me/BotFather)) 创建一个

### 安装

克隆存储库并安装依赖项：

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### 配置

使用您的机器人令牌在项目根目录中创建 `.env` 文件：

```env
BOT_TOKEN=your_telegram_bot_token
```

### 跑步

配置环境后启动机器人：

```bash
yarn start
```

## 帖子格式

当机器人将帖子转发到 Telegram 时，它包含两个内联按钮：

- **在 5chan 上查看** -- 在 5chan Web 客户端中打开帖子。
- **在 Seeedit 上查看** -- 在 Seeedit Web 客户端中打开帖子。

这使得 Telegram 订阅者可以在他们喜欢的客户端上直接跳转到完整的讨论线程。
