---
title: Bitsocial 与 Quorum
description: Quilibrium 旗下采用 Discord 式 Spaces 的端到端加密群组通讯应用 Quorum，与 Bitsocial 的公开点对点社区有何异同。
---

# Bitsocial 与 Quorum

[Quorum](https://www.quorummessenger.com/) 是 Quilibrium Inc. 在其 [Quilibrium](https://quilibrium.com/) 网络上构建的群组通讯应用。它的组织方式类似 Discord，有 Space、频道、角色和私信，消息采用端到端加密。它会被拿来与 Bitsocial 相提并论，是因为两者都自称是点对点、抗审查的，并且群组可以自行制定规则。不过两者的目标不同：Quorum 面向私密群聊，Bitsocial 面向任何人都能阅读的公开社区。

Quilibrium 将自己描述为云平台的去中心化替代方案：一个由节点组成的网络，这些节点把数据保存在加密的超图（hypergraph）中，并通过一种被 Quilibrium 称为 Proof of Meaningful Work 的共识机制就其状态达成一致。节点赚取网络代币 QUIL，QUIL 用于支付使用费。根据 [Quilibrium 的故事](https://docs.quilibrium.com/docs/discover/q-story/)，Quorum 起源于 2018 年的 Howler，即一个打造私密版 Discord 替代品的构想，后来成为第一个在 Quilibrium 上线的应用。由 Cassie Heart 创立的 Quilibrium Inc. 负责开发该协议，并把 Quorum 作为其托管服务之一提供（[FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)）。

## Quorum 的工作原理

以下细节来自截至 2026 年 10 月的 Quorum 客户端源代码：网页版和桌面版应用对应 [quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop)，另有 [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile)。

- **身份。** 用户的主身份是一组 Ed448 密钥，每台设备还有各自的 X448 和 Ed448 密钥。在浏览器中，这些密钥由通行密钥（passkey）保护。地址是以 `Qm` 开头的哈希，用户可以显示来自 Quilibrium 名称服务的用户名。
- **加密。** 私信在设备之间使用 Double Ratchet。一个 Space 的成员共享同一个 Triple Ratchet 会话，并用该 Space 专属的密钥为自己的消息签名。每个 Space 都经过加密，Quorum 表示，它的消息中转（message brokering）机制使负责中继消息的服务无法把发送者和接收者关联起来。
- **加入。** 用户通过邀请链接进入 Space。一次性链接把加入所需的密钥直接放在 URL 中；公开链接则从 Quorum 服务获取这些密钥，公开的 Space 还可以列在可搜索的目录中。
- **传输。** 网页版、桌面版和移动版客户端都通过 HTTPS 和 WebSocket 连接到同一个服务：[`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7)。该服务把加密消息中继到每位成员的收件箱，并存储用户注册信息、每个 Space 的加密清单（频道、角色、表情）、邀请材料、公开目录以及可选的加密设置同步。Quilibrium 的节点软件中有一个结构相同的收件箱和 hub 服务，但无论是客户端还是 Quilibrium 的文档，都没有说明这个服务与网络是如何对应的。
- **历史记录。** 每位成员的客户端都在本地存储中保留一份自己的 Space 副本。网页版和桌面版客户端通过请求一位在线成员进行同步来补齐历史记录；移动版客户端则回放服务为每个 Space 保存的日志，因此即使没有其他成员在线，它也能跟上进度。
- **审核。** 角色可授予删除、置顶、禁言和 `@everyone` 提及的权限。每位成员的客户端都会检查每项审核操作上的签名，只有签名者拥有相应角色时才会执行。所有者可以踢出成员，这会轮换 Space 的密钥，使被踢出的成员无法阅读新消息。Space 可以要求消息必须签名，也可以允许成员发布未签名、可否认（deniable）的消息。
- **代码。** 网页版和桌面版客户端采用 AGPL-3.0 许可，移动版客户端采用 GPL-3.0 许可。移动版客户端还带有加密货币钱包、Farcaster 集成，以及下文介绍的付费订阅 Apex。

## 两者的区别

### 私密群组与公开社区

Quorum 的 Space 是一个成员群组：只有持有其密钥的人才能阅读，加入需要邀请链接。公开链接允许任何人进入，但前提是先加入。Bitsocial 社区没有成员资格。任何人都可以从任何应用阅读它，无需加入，任何人也都可以尝试发帖，但须通过社区的挑战。

### 是什么让群组保持在线

Quorum 的 Space 没有主机节点。成员通过 Quorum 服务发送消息，每位成员的客户端都保留一份副本，所有者不必在线，其他人也能交流。Bitsocial 社区存放在其所有者的节点上，由该节点接受或拒绝每条帖子，并发布社区的最新状态。只要有对等点为其做种，社区就仍然可读，但在其节点离线期间无法接受新帖子。参见[点对点协议](/peer-to-peer-protocol/)。

### 由谁执行规则

在 Quorum 中，规则在边缘（edge）执行。每位成员的客户端根据签名者的角色，自行决定是否执行删除、置顶或禁言，而踢人是通过把其他所有人迁移到新密钥来实现的。在 Bitsocial 中，规则在社区节点上执行：未通过社区挑战或不符合社区规则的帖子永远不会成为社区的一部分。参见[本地审核，而非全局封禁](/local-moderation/)。

### 垃圾信息控制

Quorum 主要通过邀请把垃圾信息挡在外面。一次性链接只允许一个人加入，公开链接允许任何持有它的人加入，所有者事后还可以踢人并更换密钥；客户端也会限制自身的发送频率。Bitsocial 身份是免费的密钥对，因此每个社区会选择一项在接受帖子之前运行的挑战，例如验证码、付费、代币余额或白名单。参见[自定义反垃圾邮件挑战](/custom-challenges/)。

### 客户端与网络

Quorum 应用是 Quorum 服务的客户端，该服务由 Quilibrium Inc. 运营。这些应用本身并不加入点对点网络，因此能否访问某个 Space 取决于这一个端点。在它背后，Quilibrium 自成一个网络：2026 年 10 月，其[探索器](https://dashboard.quilibrium.com/)显示有 114 个可达对等点，以及分布在 99 个分片上的 181 个证明者（prover）。

Bitsocial 网页应用可以在标签页中运行 libp2p 节点，从对等点获取社区内容，并通过 gossipsub 发布。对等点发现通过 HTTP 路由器进行，这些路由器只返回提供者地址；任何人都可以运行路由器，客户端也可以通过修改配置来更换路由器。参见[浏览器点对点网络](/browser-p2p/)。

### 经济机制

Quilibrium 以代币为核心。QUIL 由节点挖出，用于支付网络费用，其封装版本 wQUIL 在 Ethereum 上流通。Quorum 本身免费，不需要付费，也不需要电话号码。它的可选订阅 Apex 价格为[每月 5 美元](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8)，以 Ethereum 上的 wQUIL、SNAP 或 USDC 支付，费用在 Quilibrium Inc. 和订阅者选择的四个 Space 之间分配。Bitsocial 的协议中没有支付层；社区可以通过自己的挑战要求付费或代币。

### 私信

这是 Quorum 更强的地方。私信和 Space 消息都采用具备前向保密性的端到端加密，消息内容只以密文形式到达 Quorum 服务。Bitsocial 专注于公开社区，目前还没有原生私信。Bitsocial 帖子在通过 pubsub 传输时会用社区节点的密钥加密，但一旦被接受就是公开的。

## 项目现状

2026 年 10 月，Quorum 仓库将网页应用称为测试版（beta），Quorum 网站也仍把 Google Play 和 App Store 应用列为“即将推出”。两个客户端之间也存在差异：移动应用具备钱包、Farcaster 和 Apex 功能，而网页版和桌面版客户端把其 Wallet 和 Farcaster 页面显示为“即将推出”，两者补齐 Space 历史记录的方式也不同。

Quilibrium 主网于 2025 年 9 月 30 日达到 2.1 版，当时网络在一次停摆后恢复运行（[公告](https://x.com/QuilibriumInc/status/1973082817236984270)）。2026 年，节点用 Rust 重写，共识采用后量子签名，并采用旧节点无法使用的线路协议（wire protocol）。部分文档描述的是设计而非实际运行的代码：它们描述了 [mixnet 路由](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/)，但在节点 2.1.0.25 中，mixnet 服务是一个[桩实现（stub）](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)，接收消息但不进行混合。

## 对比

| 问题             | Quorum                                                     | Bitsocial                                              |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| 类别             | Quilibrium 网络上的端到端加密群组通讯应用                  | 点对点社区网络                                         |
| 身份             | Ed448 主密钥组加上每台设备的密钥，由通行密钥保护           | 用户和社区各自使用 Ed25519 密钥对                      |
| 谁能阅读         | 持有 Space 密钥的成员                                      | 任何人，从任何应用                                     |
| 消息存放在哪里   | 每位成员的设备；移动版客户端还会回放 Quorum 服务保存的日志 | 社区所有者的节点，以及读取并为其做种的对等点           |
| 客户端连接到哪里 | 位于 `api.quorummessenger.com` 的 Quorum 服务              | 通过 libp2p 连接对等点，包括从浏览器标签页连接         |
| 社区             | 带有频道、角色和邀请链接的 Space                           | 一等对象，由其节点接受或拒绝帖子                       |
| 垃圾信息控制     | 邀请链接、踢人并更换密钥、客户端限速                       | 帖子被接受之前须通过所在社区的挑战                     |
| 审核             | 由每位成员的客户端执行的角色；由所有者踢人                 | 社区所有者审核自己的社区；应用自行决定显示什么         |
| 私信             | 端到端加密的私信                                           | 公开社区；目前还没有原生私信                           |
| 经济机制         | QUIL 网络代币；可选的每月 5 美元 Apex 订阅                 | 协议中没有；挑战可以要求付费或代币                     |
| 主要取舍         | 私密的加密群组，但每个客户端都依赖同一个服务               | 免费身份和浏览器访问，但没有私信功能，且只保留最新状态 |
