---
title: Seedit
description: 一个基于 Bitsocial 协议构建的无服务器、去中心化 Reddit 风格的论坛，任何人都可以在其中创建和拥有社区。
sidebar_position: 2
---

# Seedit

Seedit 是一种无服务器、无管理且完全去中心化的旧式 Reddit 替代方案，基于 Bitsocial 协议构建。它赋予用户对其社区的完全所有权——任何人都可以创建社区，多个社区可以竞争同一个短路径，例如 `/s/funny`。

## 下载

| 平台       | 链接                                            |
| ---------- | ----------------------------------------------- |
| 网页       | [seedit.app](https://seedit.app)                |
| 网络 (ENS) | `seedit.eth` 通过 Brave 浏览器或 IPFS Companion |
| 桌面       | 适用于 Mac、Windows 和 Linux                    |
| 手机       | 适用于 Android                                  |

## 社区如何运作

Seedit 将内容组织到类似于 Reddit 子版块的社区中。每个社区均由其创建者拥有，并且在没有集中管理的情况下运作。多个社区可以竞争同一个[目录](/directories/)路径，例如 `/s/funny`，该路径会打开当前的胜出者。订阅和帖子链接始终指向确切的社区。

### 创建社区

创建新社区有两种方法：

1. **桌面客户端** — 使用桌面应用程序中的内置 GUI 来设置和配置您的社区。
2. **bitsocial-cli** — 运行 CLI 工具以从命令行创建和管理社区。

### 默认社区列表

新账户会订阅一份由确切社区组成的默认列表，该列表定义在 [bitsocialnet/lists](https://github.com/bitsocialnet/lists) 仓库的 `seedit-default-subscriptions.json` 中。目录候选者列在同一仓库的 `seedit-directories/seedit-<code>-directory.json` 文件中。要将您的社区添加到其中任一列表，请提交包含您社区详细信息的 pull request。

## 链接

- **GitHub**：[github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **电报**：[t.me/seeditreact](https://t.me/seeditreact)
- **许可证**：仅限 GPL-2.0
