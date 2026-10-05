---
title: Bitsocial 与 Reticulum
description: Reticulum 这一面向 LoRa 及其他低带宽链路的加密网络栈与 Bitsocial 有何异同，以及 Bitsocial 能否在其上运行。
---

# Bitsocial 与 Reticulum

[Reticulum](https://reticulum.network/) 是一个基于密码学的网络栈，可以在任何手头可用的载体上构建网络：LoRa 无线电、分组无线电、串行链路、Wi-Fi、以太网、TCP、UDP 或 I2P。它之所以常和 Bitsocial 一起被提起，是因为两者都去掉了夹在中间的公司。不过它们工作在不同的层，因此是互补关系，而不是竞争关系。

## 不同的层

Reticulum 取代的是网络层。它为应用提供加密、可路由的端点，不需要 IP 地址、DNS、证书颁发机构或账号，并且被设计为在慢至每秒 5 比特、MTU 只有 500 字节的链路上依然能够工作。它不定义帖子、社区或审核；这些由构建在它之上的应用来添加。

Bitsocial 是一个社交协议。它运行在 IPFS/libp2p 技术栈之上，使用普通的互联网连接（包括直接在浏览器标签页中运行），并定义了社区、发布内容以及每个社区各自的反垃圾挑战。参见[点对点协议](/peer-to-peer-protocol/)和[浏览器点对点网络](/browser-p2p/)。

放在 Bitsocial 的技术栈里，Reticulum 大致处于 libp2p 所在的位置，而不是 Bitsocial 协议所在的位置。

## Reticulum 的工作原理

- **身份。** Reticulum 身份是一组 512 位的密钥：一把用于加密的 X25519 密钥，加上一把用于签名的 Ed25519 密钥。
- **目的地。** 应用会创建目的地（destination），其地址是截断为 16 字节的 SHA-256 哈希。数据包不携带源地址。
- **宣告。** 目的地通过发送宣告（announce）变得可达。传输节点会转发宣告，并记住通往来源的下一跳，因此任何节点都不需要掌握整个网络的地图。
- **加密。** 流量默认加密，使用临时密钥，并具备前向保密性。
- **LXMF。** [LXMF](https://github.com/markqvist/LXMF) 消息层增加了签名消息、直接投递，以及经由传播节点为离线收件人提供的存储转发。

以这种方式构建的应用包括用于消息通信的 [Sideband](https://github.com/markqvist/Sideband)，以及兼具消息通信和托管页面功能的 [Nomad Network](https://github.com/markqvist/NomadNet)。Reticulum 手册维护着一份[程序列表](https://reticulum.network/manual/software.html)。

## 对比

| 问题         | Reticulum                                                    | Bitsocial                                              |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------ |
| 它是什么     | 网络栈                                                       | 点对点社交协议及应用                                   |
| 设计面向     | 任何载体，低至慢速无线电链路                                 | 互联网连接，包括浏览器标签页                           |
| 身份         | X25519 与 Ed25519 密钥组                                     | 用户和社区各自使用 Ed25519 密钥对                      |
| 地址         | 身份与应用名称的哈希                                         | 社区公钥的哈希                                         |
| 查找对等点   | 由传输节点传播的宣告                                         | HTTP 路由器返回提供者对等点                            |
| 社交功能     | 由 Nomad Network 等应用添加                                  | 社区、帖子、回复和审核都在协议之中                     |
| 垃圾信息控制 | 按接口限制宣告速率；收件人或节点可以要求 LXMF 工作量证明印戳 | 帖子被接受之前须通过所在社区的挑战                     |
| 离线投递     | LXMF 传播节点存储并转发消息                                  | 对等点持续提供社区的最新状态；发布需要该社区的节点在线 |

## Bitsocial 能在 Reticulum 上运行吗？

目前还不能。Bitsocial 没有 Reticulum 传输层，它的数据模型也以互联网带宽为前提：客户端要从对等点获取社区元数据和帖子内容，并交换 pubsub 消息，这与围绕 500 字节数据包设计、吞吐量以每秒比特或千比特计的链路很不匹配。

现实可行的路径要窄得多：一个在断网时通过本地 mesh 网络工作的客户端，等到能连上具备互联网访问的对等点或网关时，再与更广泛的 Bitsocial 网络同步。这需要的是一个新的客户端和桥接，而不是对协议本身的修改，而且它目前不在路线图上。

## 面向开发者

Reticulum 以 [Reticulum 许可证](https://reticulum.network/manual/license.html)发布：在 MIT 风格条款的基础上附加了两项限制。该软件不得用于旨在伤害他人的系统，也不得用于创建 AI 或机器学习训练数据集。在把 Reticulum 代码打包进 Bitsocial 应用之前，请先阅读该许可证。

参考实现[用 Python 编写](https://github.com/markqvist/Reticulum)。Reticulum 维护者警告说，Reticulum 和 LXMF 的若干非官方移植版本是机器生成的，并且带有他们认为无效的许可证声明，因此请优先使用参考实现或手册中列出的程序。
