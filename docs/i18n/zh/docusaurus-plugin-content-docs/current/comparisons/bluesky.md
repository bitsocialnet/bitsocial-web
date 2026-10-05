---
title: Bitsocial 与 Bluesky
description: 依靠个人数据服务器、中继和 AppView 运作的 Bluesky 与 AT Protocol，与 Bitsocial 的点对点社区有何异同。
---

# Bitsocial 与 Bluesky

[Bluesky](https://bsky.app/) 是一款构建在 [AT Protocol](https://atproto.com/) 上的微博客应用，该协议由 Bluesky Social PBC 设计。这一协议把社交网络拆分为多个独立的服务：个人数据服务器托管账号，中继把它们汇聚成一条数据流，AppView 再为这条数据流建立索引，生成人们看到的时间线和讨论串。它的文档写道，账号数据存储在托管服务器上，“而不是采用点对点模型”（[概览](https://atproto.com/guides/overview)）。

## AT Protocol 的工作原理

- **服务器上的仓库。** 每条帖子、点赞或关注都是作者签名仓库中的一条记录，仓库托管在个人数据服务器（PDS）上。默认服务器由 Bluesky 运营，任何人也都可以自行托管。
- **中继。** 中继订阅每一个 PDS，并把变更作为一条数据流重新广播出去，这条流称为 firehose。自 2025 年的一次协议更新起，中继不再归档每个仓库，运行成本因此大幅下降（[Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)）。
- **AppView。** AppView 为整个 firehose 建立索引，提供时间线、完整的回复串、计数和搜索。它是网络中最耗资源的部分。
- **身份。** 账号是一个 DID：通常是登记在一个全球目录中的 `did:plc`，或绑定到某个域名的 `did:web`。DID 文档列出账号的用户名、签名密钥和当前服务器。签名密钥由 PDS 持有；`did:plc` 还允许用户持有轮换密钥，这样无需旧托管方配合也能迁移（[身份指南](https://atproto.com/guides/identity)）。
- **用户名。** 用户名是 DNS 名称，例如 `alice.bsky.social` 或用户自己拥有的域名，并会与 DID 相互核验。
- **审核。** 托管和触达是彼此分离的层。任何人都可以运行标注服务，用户可以叠加使用多个标注服务（[审核指南](https://atproto.com/guides/moderation)），但 Bluesky 应用始终会应用 Bluesky 自己的审核。作者可以限制谁能回复自己的帖子，并隐藏回复。

## 两者的区别

### 服务器还是对等点

Bluesky 的数据存放在服务器上：PDS 托管每个账号，中继传送 firehose，AppView 提供客户端所显示的内容。浏览器是这些服务的 HTTP 客户端，从来不是对等点。在 Bitsocial 中，内容由社区的节点和读取该社区的对等点提供，网页应用也可以运行自己的点对点节点。参见[浏览器点对点网络](/browser-p2p/)。

### 全局视图还是社区

AT Protocol 是为单一全局视图设计的：AppView 能看到每一条回复，因此讨论串和搜索都是完整的。Bitsocial 没有全局索引；每个社区发布自己的状态，应用在此基础上构建发现功能。参见[内容发现](/content-discovery/)。

Bluesky 目前没有面向公开帖子的社区对象。2026 年 6 月，它[宣布推出原生社区](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k)，在部分隐私级别下发帖需经批准；截至 2026 年 10 月，该功能尚未上线。在 Bitsocial 中，社区是核心对象，由社区的节点接受或拒绝帖子。

### 垃圾信息控制

Bluesky 通过服务器上的速率限制、中继对新托管方的限制、自动检测、人工审查和标签来应对垃圾信息，作者也可以限制回复。不存在社区层面的关口来决定帖子在被接受之前必须通过什么。在 Bitsocial 中，每个社区自行选择挑战。参见[自定义反垃圾邮件挑战](/custom-challenges/)。

### 谁持有密钥

Bluesky 自家服务器上的账号用密码登录，这些服务器以托管方式保管账号的签名密钥（[Kleppmann 等人](https://arxiv.org/abs/2402.03239)）。据一位 Bluesky 协议工程师称，[大多数账号没有独立掌控的轮换密钥](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t)。Bitsocial 身份是由用户的应用生成并持有的密钥对。

### 运行基础设施

个人服务器很便宜：[参考 PDS](https://github.com/bluesky-social/pds) 建议为最多 20 个用户配备 1 GB 内存。独立运行覆盖全网的 AppView 是一项大工程；2025 年搭建的一个 AppView [每月花费约 200 美元](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w)，主要用于 16 TB 存储。Bitsocial 没有需要复制的全局索引，社区节点可以在消费级硬件上运行。

## 对比

| 问题           | Bluesky（AT Protocol）                                | Bitsocial                                      |
| -------------- | ----------------------------------------------------- | ---------------------------------------------- |
| 类别           | 带全局索引的联邦式服务器                              | 点对点社区网络                                 |
| 身份           | DID，签名密钥通常由服务器持有                         | 用户和社区各自使用 Ed25519 密钥对              |
| 帖子存放在哪里 | 作者在个人数据服务器上的仓库                          | 社区所有者的节点，以及读取并为其做种的对等点   |
| 谁让它保持在线 | PDS 托管方、中继和 AppView，默认由 Bluesky 运营       | 社区所有者的节点，加上协助做种的节点           |
| 社区           | 公开帖子暂无社区（已于 2026 年宣布）                  | 一等对象，由其节点接受或拒绝帖子               |
| 垃圾信息控制   | 服务器速率限制、自动检测、标签、回复控制              | 帖子被接受之前须通过所在社区的挑战             |
| 审核           | 可叠加的标注服务；Bluesky 应用始终应用 Bluesky 的审核 | 社区所有者审核自己的社区；应用自行决定显示什么 |
| 名称           | 与 DID 相互核验的 DNS 用户名                          | 解析到密钥的 `.bso` 和 `.eth` 名称             |
| 浏览器         | PDS 和 AppView 的 HTTP 客户端                         | 普通浏览器标签页中的点对点节点                 |
| 主要取舍       | 全局讨论串和搜索完整，但聚合需要重型服务器            | 没有沉重的全局索引，但也没有完整的全网视图     |
