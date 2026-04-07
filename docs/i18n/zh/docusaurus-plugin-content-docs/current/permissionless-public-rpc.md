---
title: 无需许可的公共 RPC
description: 公共 Bitsocial RPC 服务的拟议设计，具有独立的用户、范围权限和社区所有权。
---

# 无需许可的公共 RPC

最初的公共 RPC 提案以旧的 plebbit 术语编写的 GitHub 问题存在。本页面用 Bitsocial 语言重写了这个想法，并将其框架为产品级提案，而不是一堵实施细节墙。

## 通俗易懂的语言目标

[Bitsocial Forge](https://bitsocialforge.com) 可以运行公共 RPC 服务，让许多用户远程管理自己的 Bitsocial 社区，而无需将操作员变成这些社区的托管人。

该服务应该使移动和轻量级客户端实用，同时保留三个限制：

1. 默认情况下，用户彼此保持隔离。
2. 权限保持明确且细化。
3. 在推出期间可以保留与当前 RPC 请求和响应形状的兼容性。

## 它解决什么问题

如今，最简单的 RPC 模型通常是全有或全无：一个身份验证密钥、一个权限域、完全访问权限。这适用于单个运营商，但不适用于公共多用户服务。

无许可的公共 RPC 需要更强大的模型：

- 一项服务可以托管多个用户
- 每个用户都有自己的社区和限制
- 运营商定义的策略可以防止滥用
- 用户稍后仍可以离开或自行托管

## 核心模型

### 用户

每个用户都会获得一个身份验证凭证和一个权限包。

### 社区

通过该服务创建的社区将分配给所有者记录。明确跟踪所有权，以便将管理方法限定在正确的用户范围内。

### 权限

权限是基于能力的。服务器可以控制：而不是“可以使用 RPC”的布尔值：

- 一个用户可以创建多少个社区
- 有哪些管理方法可供选择
- 允许哪些发布操作
- 适用什么速率限制
- 哪些管理界面可见

### 管理界面

公共 RPC 本身应该专注于面向用户的 RPC 行为。用户创建、所有权转让和审计审查等管理任务属于单独的操作员 API 和仪表板。

## 兼容性立场

面向用户的文档应使用 Bitsocial 术语，例如 **社区** 和 **个人资料**。

在线路级别，第一次部署仍然可以保留当前的 ​​JSON-RPC 传输和有效负载形状，这对于兼容性很有用。换句话说：文档不再需要像旧的 plebbit 文档那样进行讨论，即使过渡期在幕后保留了一些遗留方法名称或请求形状。

## 提议的权限包

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

确切的方法名称是说明性的。重要的部分是策略的形式：独立控制各个功能，而不是捆绑到一个超级用户令牌中。

## 连接流程

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

权限意识应该保持可选。忽略通知的客户端仍然可以通过处理来自服务器的标准授权失败来正确运行。

## 所有权执行

当服务创建社区时，它应该自动将所有权分配给调用用户。从那里：

- 社区启动、停止、编辑和删除操作是所有者范围内的
- 列表和订阅响应默认为调用者自己的社区
- 更广泛的可见性是明确的管理员权限，而不是默认权限

一个边缘情况非常重要：如果用户订阅了他们**不**拥有的社区，则服务器必须只公开任何外部观察者应该看到的公共状态。仅限所有者的配置或内部运行时数据绝不能通过订阅 API 泄​​漏。

## 建议的操作面

管理 API 可以保持无聊和明确：

- 列出用户
- 检查一名用户
- 创建或更新用户
- 删除用户
- 转让社区所有权
- 检查审计日志

此操作员 API 的身份验证应与最终用户 RPC 身份验证完全分开。

## 推出阶段

### 第一阶段

- 建立公共RPC项目结构
- 添加用户记录和所有权跟踪
- 分叉或扩展当前的 RPC 服务器

### 第二阶段

- 实施权限捆绑
- 在 RPC 方法层强制执行它们
- 返回连接时的权限元数据

### 第三阶段

- 添加运营商API
- 添加审计日志记录
- 添加管理员身份验证

### 第四阶段

- 发送管理仪表板
- 测试滥用控制
- 收紧速率限制和存储配额

## 开放式问题

### 身份验证凭据垃圾邮件

如果身份验证创建成本低廉，公共服务在颁发凭证之前可能需要挑战层。一种可能的途径是重用社区挑战模型本身，以便凭证发布继承与网络其他部分相同的反滥用理念。

### 旧版命名

一些早期的实现可能仍会在内部公开遗留方法名称以实现兼容性。这应该被视为迁移细节，而不是 Bitsocial 文档的永久公共词汇。

## 概括

该提案实际上是关于一件事：使公共 RPC 基础设施变得有用，而不使其成为托管。一个好的公共 Bitsocial RPC 应该感觉像是运行社区的可选帮助，而不是像一个通过后门收回所有权的新中央平台。
