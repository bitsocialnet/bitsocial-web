---
title: BSO Resolver
description: 使用 ENS TXT 记录将 .bso 域名解析为公钥，并具有内置缓存和跨平台支持。
sidebar_position: 1
---

# BSO Resolver

BSO 解析器通过读取存储在 ENS 上的 Bitsocial TXT 记录，将 `.bso` 域名转换为其相应的公钥。它提供共享的 viem 客户端、持久缓存，并可在 Node.js 和浏览器环境中工作。

- **GitHub**：[bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **许可证**：仅限 GPL-2.0

## 安装

```bash
npm install @bitsocial/bso-resolver
```

## 创建解析器

通过将配置对象传递给构造函数来实例化解析器：

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| 范围       | 必需的 | 描述                                    |
| ---------- | ------ | --------------------------------------- |
| `key`      | 是的   | 解析器实例的标识符。                    |
| `provider` | 是的   | 传输配置（见下文）。                    |
| `dataPath` | 不     | SQLite 缓存文件的目录（仅限 Node.js）。 |

### 提供商选项

`provider` 参数接受三种格式：

- **`"viem"`** -- 使用 viem 提供的默认公共交通。
- **HTTP(S) URL** -- 通过 JSON-RPC 端点进行连接（例如，`https://mainnet.infura.io/v3/YOUR_KEY`）。
- **WebSocket URL** - 通过 WebSocket RPC 端点（例如 `wss://mainnet.infura.io/ws/v3/YOUR_KEY`）进行连接。

## 方法

### `resolve({ name, abortSignal? })`

查找`.bso` 名称并返回关联的公钥。可以传递可选的`AbortSignal`来取消长时间运行的请求。

### `canResolve({ name })`

返回一个布尔值，指示解析器是否能够处理给定的名称。在尝试完整解决方案之前，请使用它来检查支持情况。

### `destroy()`

拆除解析器，关闭数据库连接并释放资源。当不再需要解析器时调用此方法。

## 缓存

解析的名称会自动缓存，以减少冗余的网络查找。根据运行时环境选择缓存后端：

| 环境    | 后端        | 笔记                                        |
| ------- | ----------- | ------------------------------------------- |
| Node.js | SQLite      | 存储在`dataPath`。使用WAL模式进行并发访问。 |
| 浏览器  | 索引数据库  | 使用本机 IndexedDB 事务。                   |
| 倒退    | 内存中`Map` | 当 SQLite 和 IndexedDB 都不可用时使用。     |

所有缓存条目都有**一小时的 TTL**，并且在过期后会自动逐出。

## 与 pkc-js 集成

解析器可以通过 `nameResolvers` 选项直接插入 pkc-js，从而在密钥查找期间启用透明的 `.bso` 名称解析：

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## 并发性

解析器被设计为在并发使用下是安全的：

- 单个共享 viem 客户端避免了冗余连接。
- SQLite 以 WAL（预写日志记录）模式运行，允许并发读取而不会阻塞。
- 浏览器缓存依赖于本机 IndexedDB 事务进行隔离。

## 平台入口点

该包为 Node.js 和浏览器构建提供了单独的入口点。支持`package.json` 中`exports` 字段的捆绑器将自动选择正确的一个。
