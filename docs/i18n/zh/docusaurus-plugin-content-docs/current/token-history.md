---
title: BSO 代币历史
description: BSO 代币的完整世代历史，从 2021 年在 Avalanche 上的起点，到如今不可变、无管理员的 Ethereum 合约。
---

# BSO 代币历史

BSO 是一枚以来源为凭的代币。Bitsocial 背后的协议是开放的，代币和链在设计上都是可选的：任何人都可以分叉代码、运行自己的客户端，或在其之上构建自己的经济体系。无法被分叉掉的是来源。BSO 从第一天起就是官方的 Bitsocial 代币，此后的每一次迁移都能在链上验证。

本页按顺序列出代币的每一个世代，并附上完整的合约地址，任何人都可以独立核对这份记录。

## 第 1 代：起点，Avalanche，2021 年

- **链**：Avalanche
- **年份**：2021
- **地址**：`0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **区块浏览器**：[Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

BSO 从这里起步。供应量通过三轮空投和流动性挖矿奖励免费分发，没有预售，也没有抢在社区之前为团队划出份额。当时的合约是可升级代理合约，这在那个阶段是常规做法，让团队可以在代币早期修复问题。

## 第 2 代：迁移到 Ethereum，2024 年

- **链**：Ethereum
- **年份**：2024
- **地址**：`0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **区块浏览器**：[Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

第 2 代把 BSO 从 Avalanche 迁到了 Ethereum，Bitsocial Chain 路线图的其余部分都建立在这里。和第 1 代一样，这个合约仍然是可升级代理合约，在最终的永久合约准备就绪之前又保留了一代。

## 第 3 代：完全不可变，2025 年

- **链**：Ethereum
- **年份**：2025
- **地址**：`0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **区块浏览器**：[Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

第 3 代是当前也是最终的 BSO 合约。它完全不可变，且没有管理员：

- 没有铸造函数，因此供应量无法被增发
- 没有所有者地址，因此没有人能单方面改变合约行为
- 没有暂停函数，因此转账无法被冻结
- 没有代理模式，因此逻辑本身日后也无法被替换

这正是前两代所指向的终态：一枚再也没有管理员密钥可持有的代币。

## 迁移是如何完成的

两次迁移——第 1 代到第 2 代，以及第 2 代到第 3 代——都是被动的 1:1 空投。持有者无需提交申领、无需签名，也无需做任何操作。旧合约上的余额被直接读取，并按 1:1 映射到新合约上，因此持有者的持仓在迁移前后完全一致。

由于新旧合约都仍然公开存在于链上，这个过程的每一步都可以独立验证。任何人都可以把第 1 代或第 2 代的历史持有者快照与当前第 3 代的余额做对比，确认迁移与其宣称的完全一致。这段历史中没有任何一环需要你听信 Bitsocial 的一面之词。

## 全部自行核对

不要凭信任接受上面任何一条，直接查证记录：

- 第 1 代，见 [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- 第 2 代，见 [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- 第 3 代，见 [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- Bitsocial Chain 的现有站点 [chain.bitsocial.net](https://chain.bitsocial.net)

如果某个地址与这里列出的不一致，那它就不是官方的 BSO 代币。
