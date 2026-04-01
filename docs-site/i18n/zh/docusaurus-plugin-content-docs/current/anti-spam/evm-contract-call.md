---
title: EVM 合约调用挑战
description: 通过调用 EVM 智能合约来验证链上条件的反垃圾邮件挑战。
sidebar_position: 4
---

# EVM 合约调用挑战

:::warning Legacy Naming
该包最初是在 `@plebbit` 范围下发布的。它已重命名为 `@bitsocial/evm-contract-challenge`。对旧名称的引用可能仍出现在旧文档或代码库中。
:::

EVM 合约调用挑战是一种反垃圾邮件机制，可在允许发布之前验证链上条件。最初作为独立包从 `plebbit-js` 中提取，它允许社区所有者要求作者满足智能合约定义的标准（例如，持有最低代币余额）才能发帖。

**源代码：** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## 要求

- **Node.js** >= 22
- **仅限 ESM**——此软件包不提供 CommonJS 版本。
- **运行时对等依赖项：** `@plebbit/plebbit-js`（迁移到 `@pkc/pkc-js`）

## 安装

```bash
npm install @bitsocial/evm-contract-challenge
```

## 配置选项

| 选项          | 类型          | 描述                                               |
| ------------- | ------------- | -------------------------------------------------- |
| ZXQ占位符0ZXQ | ZXQ占位符1ZXQ | 要查询的链（例如，`eth`、`matic`、`avax`）。       |
| ZXQ占位符0ZXQ | ZXQ占位符1ZXQ | 要调用的智能合约地址。                             |
| ZXQ占位符0ZXQ | ZXQ占位符1ZXQ | 被调用函数的 ABI 片段。                            |
| ZXQ占位符0ZXQ | ZXQ占位符1ZXQ | 根据合约返回值计算的比较表达式（例如，`> 1000`）。 |
| ZXQ占位符0ZXQ | ZXQ占位符1ZXQ | 向不满足条件的作者显示的错误消息。                 |

## 例子

想要限制向持有超过 1,000 个特定 ERC-20 代币的作者发帖的社区所有者可以将挑战配置为：

- ZXQ占位符0ZXQ：ZXQ占位符1ZXQ
- `address`：代币合约地址
- `abi`：`balanceOf(address)` 的 ABI
- ZXQ占位符0ZXQ：ZXQ占位符1ZXQ
- ZXQ占位符0ZXQ：ZXQ占位符1ZXQ

当作者尝试发布时，挑战会使用作者的地址调用 `balanceOf` 并检查返回的值是否满足条件。如果是，则继续发布；否则，返回配置的错误信息。

## 何时使用它

EVM 合约调用挑战赛非常适合：

- **令牌门禁社区**限制向令牌持有者发帖。
- **NFT 门控访问**，需要特定 NFT 的所有权。
- **DAO 治理空间**，参与仅限于治理代币持有者。

对于不依赖链上身份的社区，请考虑使用 [垃圾邮件拦截器](./spam-blocker.md) 或 [优惠券挑战](./voucher-challenge.md)。
