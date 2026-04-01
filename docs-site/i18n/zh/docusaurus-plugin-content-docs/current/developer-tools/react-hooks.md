---
title: 反应钩子
description: React hooks 库用于在 Bitsocial 协议上构建去中心化社交应用程序。
sidebar_position: 1
---

# 反应钩子

:::warning Legacy Naming
该包当前使用从其上游分支继承的旧命名约定。代码、API 和配置中对“plebbit”的引用将在未来版本中迁移到“bitsocial”。功能不受影响。
:::

`bitsocial-react-hooks` 包提供了熟悉的 React hooks API，用于与 Bitsocial 协议进行交互。它可以处理获取提要、评论和作者个人资料、管理帐户、发布内容和订阅社区——所有这些都无需依赖中央服务器。

该库是[5酱](/apps/5chan/)和其他Bitsocial客户端应用程序使用的主要接口。

:::note
`bitsocial-react-hooks` 是为 AI 辅助开发而维护的 `plebbit/plebbit-react-hooks` 的临时分支。它直接从 GitHub 使用，而不是发布到 npm。
:::

## 安装

由于该包尚未出现在 npm 上，因此请直接从 GitHub 安装它，并固定到特定的提交哈希：

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

将 `<commit-hash>` 替换为您要定位的提交。

## API概述

钩子被组织成功能类别。以下是每个类别中最常用的挂钩的摘要。有关完整的签名、参数和返回类型，请参阅 [GitHub 上的完整 API 参考](https://github.com/bitsocialnet/bitsocial-react-hooks).

### 账户

管理本地用户帐户、身份和设置。

- `useAccount(accountName?)` -- 返回活动（或命名）帐户对象
- `useAccounts()` -- 返回所有本地存储的帐户
- `useAccountComments(options?)` -- 返回活动帐户发布的评论

### 评论

获取个人评论和话题并与之交互。

- `useComment(commentCid?)` -- 通过其 CID 获取单个评论
- `useComments(commentCids?)` -- 批量获取多条评论
- `useEditedComment(comment?)` -- 返回评论的最新编辑版本

### 社区

检索社区元数据和设置。

- `useSubplebbit(subplebbitAddress?)` -- 按地址获取社区
- `useSubplebbits(subplebbitAddresses?)` -- 获取多个社区
- `useSubplebbitStats(subplebbitAddress?)` -- 返回订阅者和帖子计数

### 作者

查找作者简介和元数据。

- `useAuthor(authorAddress?)` -- 获取作者简介
- `useAuthorComments(options?)` -- 返回特定作者的评论
- `useResolvedAuthorAddress(authorAddress?)`——将人类可读的地址（例如，ENS）解析为其协议地址

### 饲料

订阅内容提要并对其进行分页。

- `useFeed(options?)`——返回来自一个或多个社区的帖子的分页提要
- `useBufferedFeeds(feedOptions?)`——预缓冲多个提要以加快渲染速度
- `useAuthorFeed(authorAddress?)` -- 返回特定作者的帖子提要

### 行动

发布内容并执行写入操作。

- `usePublishComment(options?)` -- 发布新评论或回复
- `usePublishVote(options?)` -- 投赞成票或反对票
- `useSubscribe(options?)` -- 订阅或取消订阅社区

### 状态和 RPC

监视连接状态并与远程 Bitsocial 守护程序交互。

- `useClientsStates(options?)` -- 返回 IPFS/pubsub 客户端的连接状态
- `usePlebbitRpcSettings()` -- 返回当前 RPC 守护进程配置

## 发展

要在本地处理 hooks 库：

**先决条件：** Node.js、启用 Corepack、Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

有关测试和构建命令，请参阅存储库自述文件。

## 链接

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **许可证：** 仅 GPL-2.0
