---
title: Bitsocial 与 Farcaster
description: 拥有链上账号、存储租金和 Snapchain 验证者网络的 Farcaster，与 Bitsocial 的点对点社区有何异同。
---

# Bitsocial 与 Farcaster

[Farcaster](https://docs.farcaster.xyz/) 把身份放在区块链上，把社交数据放在链下。账号、应用密钥和存储付款存放在 OP Mainnet 的合约中，OP Mainnet 是一条 Ethereum 二层网络。帖子（称为 cast）以及关注和回应，都是由 [Snapchain](https://snapchain.farcaster.xyz/) 存储的签名消息；Snapchain 是一个类区块链网络，于 2025 年取代了 Farcaster 早先的 Hub 网络。

## Farcaster 的工作原理

- **账号。** 账号是一个数字形式的 Farcaster ID，归一个 Ethereum 地址所有，该地址还可以设置一个恢复地址。应用使用在链上注册的委托应用密钥发帖；应用密钥无法接管账号。
- **存储租金。** 每个账号都要租用存储单元，目前每单元每年 0.20 美元。自 2025 年 7 月起租用的单元可容纳 100 条 cast；超出部分会从最旧的 cast 开始裁剪。速率限制随租用的存储量而提高。
- **Snapchain。** 验证者通过 Tendermint 式共识把消息排序成区块，每个全节点都保存整个网络的数据。据[节点指南](https://snapchain.farcaster.xyz/getting-started)，节点需要约 16 GB 内存和 2 TB 存储。
- **名称。** 默认用户名称为 fname，免费，由 Farcaster 自己的名称服务器发放，该服务器[可以收回它们](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames)。用户也可以改用在 Ethereum 上注册的 `.eth` 名称。
- **频道。** 主题频道是 Farcaster 客户端的一项实验性功能。频道中的 cast 属于协议数据，但频道元数据、关注和审核都[存储在客户端中](https://docs.farcaster.xyz/learn/what-is-farcaster/channels)。
- **读取。** 应用通过自己运行的 Snapchain 节点或托管服务商读取数据，通常是 Neynar。

## 两者的区别

### 区块链与验证者

Farcaster 的账号和付款依赖 OP Mainnet，所有社交数据的排序则依赖类区块链网络 Snapchain。Snapchain 的验证者集合是许可制的。其白皮书称，大约有十个分布在全球的验证者时，审查就会变得困难；2026 年 10 月，它的[验证者列表](https://snapchain.farcaster.xyz/validators)规模比这更小，而且多数密钥属于 Neynar，后者在 2026 年 1 月[收购了 Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster)。Bitsocial 没有链、验证者或共识。

### 为发帖付费

每个 Farcaster 账号都要支付存储租金，而存储量决定了网络会保留该账号多少历史。在 Bitsocial 中，发帖在协议层面不花任何钱；每个社区自行决定是否要求验证码、付费、代币或其他东西。参见[自定义反垃圾邮件挑战](/custom-challenges/)。

### 社区

Farcaster 频道是客户端功能：客户端存储频道元数据并执行频道审核，因此在某个频道中被屏蔽的 cast 仍可能在网络上有效，并在其他应用中可见。在 Bitsocial 中，社区是拥有自己密钥对的协议对象，由社区的节点接受或拒绝帖子。

### 运行基础设施

Farcaster 节点保存整个网络，因此其存储会随全部活动一起增长；Farcaster 预计其增长会逼近最大的云盘容量。Bitsocial 社区节点只保存自己的社区，可以在消费级硬件上运行。

### 浏览器

Farcaster 浏览器应用是某个节点或服务商的 HTTP 客户端。Bitsocial 网页应用可以在标签页内运行点对点节点。参见[浏览器点对点网络](/browser-p2p/)。

## 对比

| 问题           | Farcaster                                             | Bitsocial                                                  |
| -------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| 类别           | 链上身份，社交数据由验证者排序                        | 点对点社区网络                                             |
| 身份           | 归 Ethereum 地址所有的 Farcaster ID，配有委托应用密钥 | 用户和社区各自使用 Ed25519 密钥对                          |
| 帖子存放在哪里 | Snapchain，在每个全节点上复制，受付费存储上限约束     | 社区所有者的节点，以及读取并为其做种的对等点               |
| 谁让它保持在线 | Snapchain 验证者和节点运营者                          | 社区所有者的节点，加上协助做种的节点                       |
| 社区           | 由 Farcaster 客户端管理的实验性频道                   | 一等对象，由其节点接受或拒绝帖子                           |
| 垃圾信息控制   | 存储租金和速率限制，外加应用层面的垃圾标签            | 帖子被接受之前须通过所在社区的挑战                         |
| 审核           | 客户端中的频道主持人、应用过滤、验证者层面的审查风险  | 社区所有者审核自己的社区；应用自行决定显示什么             |
| 名称           | Farcaster 可收回的免费 fname，或 `.eth` 名称          | 解析到密钥的 `.bso` 和 `.eth` 名称                         |
| 浏览器         | 节点或服务商的 HTTP 客户端                            | 普通浏览器标签页中的点对点节点                             |
| 主要取舍       | 一致的全局数据集，但有租金、依赖链，且验证者集合很小  | 没有费用也没有链，但没有全局数据集，旧内容也不保证永久留存 |
