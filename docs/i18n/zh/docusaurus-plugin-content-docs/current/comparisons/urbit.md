---
title: Bitsocial 与 Urbit
description: 由个人服务器组成、使用基于 Ethereum 的 Urbit ID、并在 Tlon Messenger 中由主机运行群组的网络 Urbit，与 Bitsocial 的点对点社区有何异同。
---

# Bitsocial 与 Urbit

[Urbit](https://urbit.org/) 是一个由个人服务器组成的网络。每个用户都有一台始终在线的计算机，称为飞船（ship）。飞船运行 Urbit 自己的操作系统（Arvo），该系统用 Urbit 自己的语言（Nock 和 Hoon）编写，而飞船本身由一个 Urbit ID 标识。Urbit 的主要社交应用是 [Tlon Messenger](https://tlon.io/)，由 Tlon 开发；Tlon 是 2013 年为开发 Urbit 而成立的公司。

Urbit 的目标是取代整个计算栈，因此它是一个远比 Bitsocial 宽泛的项目。不过，它的社交层采用了与 Bitsocial 相近的模式：社区存放在其所有者的节点上，由该节点决定接纳什么内容。两者的分歧在于谁必须运行服务器，以及如何把垃圾信息挡在外面。

## Urbit 的工作原理

- **Urbit ID。** 每艘飞船都有一个 Urbit ID：一个以可发音名称显示的数字，例如 `~sampel-palnet`。一层（Layer 1）ID 是 NFT，其所有权和网络公钥记录在 Ethereum 上的 Azimuth 合约中。二层（Layer 2）ID 于 2021 年加入，用于降低费用，采用“朴素 rollup”（naive rollup）：其交易会分批发布到 Ethereum，但其所有权并不存储在 Azimuth 合约中，而是由每艘飞船在本地计算。根据 [Urbit ID 文档](https://docs.urbit.org/urbit-id/what-is-urbit-id)和 [Get on Urbit](https://docs.urbit.org/get-on-urbit) 指南，Tlon 运行着一个供公众免费使用的 roller。
- **固定的层级结构。** 地址空间中有 256 个星系、65,536 颗恒星，以及约 40 亿颗供日常使用的行星。星系发行恒星，恒星发行行星，每颗行星还可以为自己的设备发行卫星。彗星是飞船为自己生成的免费 ID，从不接触区块链。星系所有者组成 Galactic Senate，负责就 Azimuth 合约的升级进行投票，并选举 Urbit Foundation 的董事会。
- **网络。** 飞船之间以点对点方式交换加密数据包。自 2026 年 7 月起，网络协议改为 [Directed Messaging](https://urbit.org/blog/directed-messaging)，它是对旧版 Ames 协议以内容为中心的重写。对等点发现由星系负责：根据 [Directed Messaging 论文](https://urbitsystems.tech/article/v03-i01/directed-messaging)，每个星系都会记录其下属飞船所在的位置，并向它们中继数据包，直到两艘飞船能够直接互相连通为止；如果防火墙阻止直连，则在此期间一直中继。
- **群组。** 在 Tlon Messenger 中，群组托管在其创建者的飞船上。根据 [Tlon FAQ](https://tlon.io/posts/faq)，成员把消息发送给主机，由主机分发到每位成员的飞船上，每位成员的飞船都会保留自己的副本。主机控制角色、频道和入群审批。群组可以是公开、私密或秘密的，并且可以[封禁单艘飞船或整个 ID 等级](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon)。频道可以是聊天、笔记本，或图片和链接的合集。
- **托管。** 在 Tlon 注册的新用户会得到一艘由 Tlon 运行的飞船，其密钥由 Tlon 代为保管。用户可以导出飞船及其主票据（master ticket），在别处运行：可以运行在 [Native Planet](https://www.nativeplanet.io/) 设备上，也可以在 Linux、macOS 或 Windows 上用 Vere 运行时运行。飞船目前还不能直接存储大文件，因此 Tlon Messenger 会把图片和其他媒体放在兼容 S3 的云存储中。

## 两者的区别

### 谁必须运行服务器

在 Urbit 上，每个参与者都是一台服务器。Tlon 的应用是用户自己飞船的前端，就连阅读群组也要经过这艘飞船。不自己运行飞船的人就去租一艘，这又把托管服务商带回了画面：Tlon 持有托管用户的密钥，并保留有限的维护访问权限，不过用户可以带着整艘飞船离开。

在 Bitsocial 上，只有社区所有者需要一个始终在线的节点。读者和发帖者可以在浏览器标签页中运行点对点节点，他们的账号是由应用保存的密钥对。参见[浏览器点对点网络](/browser-p2p/)。即便有人使用托管节点，Bitsocial 的设计目标也是让他们能够把保持在线的职责委托出去，而不必交出身份的保管权。参见[身份和社区所有权](/identity-and-ownership/)。

### 社区主机

这是两者最接近的地方。Tlon 群组和 Bitsocial 社区都存放在其所有者的节点上。主机决定谁可以发帖、执行审核并分发结果，两个协议都没有在主机之上设置版主。在两者中，主机都必须在线。Tlon 的 FAQ 说，如果主机离线，“群组会和他们一起下线”；而 Bitsocial 社区在其节点离线期间无法接受新帖子。

两者存储内容的方式不同。每位成员的飞船都保留一份群组历史的副本，因此在主机宕机期间，成员仍可阅读已经收到的内容。Bitsocial 读者从社区的节点或为其做种的对等点获取社区的最新状态，因此离线社区只要还有对等点持有它就仍然可读，但网络只保留最新状态。

Tlon 群组还有成员列表，其主机可以将群组设为仅限邀请。Bitsocial 社区没有成员资格：任何人都可以阅读，任何人也都可以尝试发帖，但须通过社区的挑战。

### 垃圾信息与身份

Urbit 通过让身份变得稀缺来对抗垃圾信息。行星的供应量是固定的，每一颗都由一颗恒星发行。免费的彗星绕过了这种稀缺性，因此希望维持稀缺性的群组会把彗星拒之门外：Urbit 的文档提到，有些群组拒绝彗星，而 Tlon 群组只需一项设置就能封禁整个彗星等级。一旦彗星被拒之门外，被封禁的用户想要回来，就需要从某颗恒星的所有者那里另外获得一颗行星。声誉也可以沿着层级传递：Azimuth 包含一个 Censures 合约，允许星系和恒星标记 ID。由于稀缺性内置于地址空间之中，它在每个拒绝彗星的群组中都以同样的方式发挥作用。

Bitsocial 身份是免费的密钥对。每个社区在接受帖子之前会选择自己的挑战，例如验证码、付费、代币余额或白名单，其他社区可以做出不同的选择。参见[自定义反垃圾邮件挑战](/custom-challenges/)。

### 区块链与治理

Urbit 的身份层依赖 Ethereum。Azimuth 合约记录一层的所有权和网络密钥，二层交易分批发布到 Ethereum，而 Galactic Senate 可以升级管理 Azimuth 的合约。同样这 256 个星系还负责对等点发现和中继，因此一组固定的身份同时承担着治理和网络的部分路由。

Bitsocial 身份是无需注册的密钥对。`.bso` 和 `.eth` 名称是解析到这些密钥对的可选别名。对等点发现通过 HTTP 路由器进行，这些路由器只返回提供者地址；任何人都可以运行路由器，客户端也可以通过修改配置来更换路由器。

### 范围

Urbit 是一台通用计算机。一艘飞船可以托管 Git 远程仓库、个人知识库或 AI 智能体，Tlon Messenger 只是众多程序之一。为 Urbit 开发，大多意味着为 Arvo 编写 Hoon 应用。Bitsocial 是面向公开社区的协议，拥有 [5chan](/apps/5chan/) 和 [Seedit](/apps/seedit/) 等应用。它运行在现有技术栈（libp2p、IPFS 和浏览器）之上，而不是取而代之，其客户端也用普通的 Web 工具构建。参见[构建你自己的客户端](/build-your-own-client/)。

### 私信

这是 Urbit 更强的地方。私信从一艘飞船直接发往另一艘，飞船之间的所有流量都经过加密，群组也可以是私密或秘密的。Tlon 指出，消息在传输过程中是加密的，但在飞船上以未加密形式存储。Bitsocial 专注于公开社区，目前还没有原生私信。

## 项目现状

Urbit 经历过一番动荡。据 [CoinDesk 报道](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project)，2024 年 8 月，负责引导核心开发的非营利组织 Urbit Foundation 解雇了其执行董事；创始人 Curtis Yarvin 在没有正式头衔的情况下回归主导战略，几名核心开发者离开，而基金会的资金只够维持几个月。Yarvin 提议把 Azimuth 迁移到现有的 Ethereum 二层网络（很可能选择 Base），并发行可兑换为行星的同质化“签证”代币。截至 2026 年 10 月，Urbit 的 [ID 文档](https://docs.urbit.org/urbit-id/what-is-urbit-id)仍在描述位于 Ethereum 上、带有朴素 rollup 的 Azimuth。2025 年 10 月，Galactic Senate 更换了基金会的董事会，新董事会任命了新的执行董事（[公告](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)）。

开发仍在继续。Directed Messaging 于 2026 年 7 月 14 日随 408k 版本上线。2026 年 6 月，Tlon Messenger [开放了公开注册，不再设候补名单](https://urbit.org/blog/this-month-in-urbit-june-2026)，Tlon 现在把自己定位为人与 AI 智能体协同工作的地方。

## 对比

| 问题           | Urbit                                                                      | Bitsocial                                              |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| 类别           | 个人服务器网络和操作系统                                                   | 点对点社区网络                                         |
| 身份           | Urbit ID：约 40 亿颗位于 Ethereum 或其二层 rollup 上的行星，外加免费的彗星 | 用户和社区各自使用 Ed25519 密钥对                      |
| 谁运行服务器   | 每个用户，在自己的飞船或托管的飞船上                                       | 社区所有者；读者和发帖者可以使用浏览器标签页           |
| 帖子存放在哪里 | 群组主机的飞船，以及每位成员飞船上的副本                                   | 社区所有者的节点，以及读取并为其做种的对等点           |
| 社区           | 由创建者飞船托管、带成员列表的群组                                         | 一等对象，由其节点接受或拒绝帖子                       |
| 垃圾信息控制   | 由恒星发行的稀缺 ID；群组封禁飞船或整个等级                                | 帖子被接受之前须通过所在社区的挑战                     |
| 审核           | 群组主机设定的角色和封禁                                                   | 社区所有者审核自己的社区；应用自行决定显示什么         |
| 对等点发现     | 星系为其下属飞船记录位置并进行中继                                         | HTTP 路由器返回提供者对等点，不存储任何内容            |
| 治理           | 由 256 个星系组成的 Galactic Senate 就 Azimuth 升级投票                    | 在协议层面没有凌驾于身份或社区之上的权威               |
| 私信           | 加密私信和仅限邀请的群组                                                   | 公开社区；目前还没有原生私信                           |
| 主要取舍       | 一台完整的个人计算机，带私密群组，但每个用户都需要一艘始终在线的飞船       | 免费身份和浏览器访问，但没有私信功能，且只保留最新状态 |
