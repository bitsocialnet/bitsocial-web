---
title: CLI
description: 用于运行 Bitsocial 节点、创建社区和管理协议操作的命令行界面。
sidebar_position: 2
---

# CLI

:::warning 遗留命名
该包当前使用从其上游依赖项继承的旧命名约定。在未来版本中，命令、输出和配置中对“plebbit”的引用将迁移到“bitsocial”。功能不受影响。
:::

`bitsocial-cli` 是一个用于与 Bitsocial 协议后端交互的命令行工具。它允许您运行本地 P2P 守护程序、创建和配置社区以及发布内容——所有这些都可以从终端进行。

它构建在 `plebbit-js` 之上，由 [5chan](/apps/5chan/) 和 [Seedit](/apps/seedit/) 用于社区创建和节点管理。

## 安装

预构建的二进制文件适用于 Windows、macOS 和 Linux。从 GitHub 下载适合您平台的最新版本：

**[从 GitHub 版本下载](https://github.com/bitsocialnet/bitsocial-cli/releases)**

下载后，制作二进制可执行文件（macOS/Linux）：

```bash
chmod +x bitsocial-cli
```

## 运行守护进程

CLI 最常见的用途是运行 Bitsocial 节点。该守护进程启动 P2P 网络层并公开客户端可以连接的本地 API。

```bash
bitsocial-cli daemon
```

首次启动时，守护程序输出指向 **WebUI** 的链接，这是一个基于浏览器的图形界面，用于管理节点、社区和设置。如果您更喜欢 GUI 而不是终端命令，这非常有用。

## 按键命令

| 命令                | 描述                             |
| ------------------- | -------------------------------- |
| `daemon`            | 启动Bitsocial P2P节点            |
| `create subplebbit` | 创建一个新社区                   |
| `subplebbit edit`   | 更新社区设置（标题、描述、规则） |
| `subplebbit list`   | 列出此节点上托管的社区           |
| `subplebbit start`  | 开始服务特定社区                 |
| `subplebbit stop`   | 停止服务特定社区                 |

使用 `--help` 运行任何命令以查看可用选项和标志：

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## 典型工作流程

托管新社区的常见设置流程：

```bash
# 1.启动守护进程
bitsocial-cli daemon

# 2. 在另一个终端中，创建一个社区
bitsocial-cli create subplebbit

# 3. 配置社区
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4.开始上菜
bitsocial-cli subplebbit start <address>
```

该社区现已在 Bitsocial 网络上上线，可以从任何兼容的客户端访问。

## 链接

- **GitHub：** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
