---
title: 5chan
description: 一个基于 Bitsocial 协议构建的无服务器、去中心化图版，任何人都可以创建并拥有自己的板块。
sidebar_position: 1
---

# 5chan

5chan 是一个运行在 Bitsocial 协议上的无服务器、无管理员、完全去中心化的图版。它沿用了大家熟悉的图版目录结构，同时引入了去中心化的所有权——任何人都可以创建板块，多个板块还可以通过投票机制争夺同一个目录位置。

## 下载

| 平台 | 链接                           |
| ---- | ------------------------------ |
| 网页 | [5chan.app](https://5chan.app) |
| 桌面 | 支持 Mac、Windows 和 Linux     |
| 移动 | 支持 Android                   |

## 板块如何运作

5chan 使用经典的目录布局（例如 `/b/`、`/g/`）把内容组织成板块。传统图版由中心管理员控制每一个板块，而 5chan 允许任何用户创建并完全拥有自己的板块。当多个板块指向同一个目录位置时，它们会竞争这个位置；参见[目录](/directories/)。

### 创建板块

要创建新板块，你需要把 `bitsocial-cli` 作为点对点节点运行。这样可以确保你的板块以去中心化的方式托管，而不依赖任何中心服务器。

### 目录位置分配

每个目录的候选板块都列在 [bitsocialnet/lists](https://github.com/bitsocialnet/lists) 仓库中的 `5chan-directories/5chan-<code>-directory.json` 文件里，板块通过向该文件提交 pull request 来加入目录。5chan 还使用 [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting) 为每个目录举行投票竞赛：每位 5chan Pass 持有者有一票，为未列入的板块投票即可提名它。这些竞赛目前在 Base Sepolia 测试网上运行，票数会显示出来，但不会改变列表的排序。

## 内部实现

在底层，5chan 使用共享的 Bitsocial 协议客户端层来完成网络交互。5chan.app 上的网页应用默认在浏览器中运行一个 Helia
节点，因此一个普通的标签页就是网络中的一个对等节点：它从其他对等节点加载板块，并通过 pubsub 发布内容，内容路径上没有中心化的
IPFS 网关。关于这背后涉及什么、以及浏览器节点仍然做不到什么，参见[浏览器点对点](/browser-p2p/)。

## 链接

- **GitHub**：[github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**：[t.me/fivechandev](https://t.me/fivechandev)
- **许可证**：GPL-2.0-only
