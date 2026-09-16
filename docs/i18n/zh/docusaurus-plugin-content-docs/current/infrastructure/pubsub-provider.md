---
title: Pubsub 提供方
description: 面向 Bitsocial 运营者的备用 pubsub 中继与委托路由提供方。
sidebar_position: 3
---

# Pubsub 提供方

Pubsub 提供方是一项运营者服务，用于运行与 Bitsocial 兼容的 pubsub 备用中继，并内置一个 Kubo 节点。5chan 和 Seedit 等现代 Bitsocial 客户端默认在浏览器中使用纯点对点网络，但这项服务依然有用：它可以作为可选的回退路径，服务于关闭了浏览器 P2P 的用户，也服务于希望提供公共兼容端点的运营者。

- **GitHub**：[bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker 镜像**：[`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **许可证**：GPL-3.0-or-later

## 它运行了什么

- 一个公共 HTTP 代理，转发 pubsub、网关、名称提供方和委托路由等路由
- 一个启用了 pubsub 的内置 Kubo 节点
- 位于 `/routing/v1/providers` 的委托 HTTP 路由提供方
- 位于 `/metrics` 的 Prometheus 指标
- 对完整 Kubo RPC API 的可选 basic-auth 访问

## 端口

默认值的选择使得 Pubsub 提供方可以与 [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) 运行在同一台 VPS 上，而不会发生 swarm 端口冲突。

| 用途           | 默认值                        | 说明                                              |
| -------------- | ----------------------------- | ------------------------------------------------- |
| 公共 HTTP 代理 | 应用 `8000`，Docker 主机 `80` | 设置 `PUBSUB_PROVIDER_HTTP_PORT` 可更改主机端口。 |
| Kubo swarm     | `4002` TCP/UDP                | 避开 seeder 默认的 Kubo swarm 端口 `4001`。       |
| Kubo API       | `5001`，仅限本地              | 由代理在内部使用。                                |
| Kubo 网关      | `8080`，仅限本地              | 由代理在内部使用。                                |

## Docker 部署

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

查看日志：

```bash
docker logs --follow pubsub-provider
```

测试代理：

```bash
curl http://127.0.0.1/commit-hash
```

## 升级

如果你此前运行的是旧的 `latest` 镜像，请强制 Compose 用已固定版本的发布镜像重建容器：

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

确认正在运行的是修复后的镜像：

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

日志中应当出现 `using Kubo binary at /app/bin/ipfs`，并且不应出现 `downloading ipfs`。

## 与 Bitsocial Seeder 一同运行

如果同一台主机同时运行 `bitsocial-seeder`，请把 Pubsub 提供方保持在 swarm 端口 `4002` 或其他非 `4001` 的端口上：

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

这样可以避免两个 Kubo 节点同时绑定 TCP/UDP `4001` 时出现的端口冲突。

## 配置

常用的环境变量覆盖项：

```env
PUBSUB_PROVIDER_HTTP_PORT=80
PUBSUB_PROVIDER_SWARM_PORT=4002
PUBSUB_PROVIDER_PORTS=8000
KUBO_RPC_URL=http://127.0.0.1:5001/api/v0
IPFS_GATEWAY_URL=http://127.0.0.1:8080
HTTP_ROUTER_URLS=https://example-router.invalid
PUBSUB_PROVIDER_ROUTING_STORE_PATH=
BASIC_AUTH_USERNAME=
BASIC_AUTH_PASSWORD=
IPFS_GATEWAY_USE_SUBDOMAINS=false
SHUTDOWN_KEY=
ETH_PROVIDER_URL=
ETH_PROVIDER_URL_WS=
SOL_PROVIDER_URL=
```

请把该提供方当作备用中继来使用，而不是浏览器 P2P 的替代品。当网络需要专门的对等节点发现能力时，仍应单独运行 tracker 基础设施。
