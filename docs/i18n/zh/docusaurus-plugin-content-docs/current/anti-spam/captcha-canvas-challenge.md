---
title: Captcha Canvas Challenge
description: 独立的基于图像的验证码生成器，具有可配置的字符、尺寸和颜色。
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning 遗留命名
该软件包最初是在 `@plebbit` 范围下发布的。它已重命名为`@bitsocial/captcha-canvas-challenge`。对旧名称的引用可能仍出现在旧文档或代码库中。
:::

Captcha Canvas Challenge 是一个独立的图像验证码生成器，最初从`plebbit-js` 中提取。它将随机文本呈现到 HTML 画布上并返回生成的图像，社区可以将这些图像作为垃圾邮件挑战呈现给作者。

**源代码：** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## 要求

- **Node.js** >= 22
- **仅限 ESM**——此软件包不提供 CommonJS 版本。
- **运行时对等依赖关系：** `@plebbit/plebbit-js`（迁移到`@pkc/pkc-js`）

## 安装

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## 配置选项

| 选项         | 类型     | 默认      | 描述                             |
| ------------ | -------- | --------- | -------------------------------- |
| `characters` | `number` | `6`       | 验证码图像中呈现的随机字符数。   |
| `height`     | `number` | `100`     | 生成图像的高度（以像素为单位）。 |
| `width`      | `number` | `300`     | 生成图像的宽度（以像素为单位）。 |
| `colors`     | `string` | `#32cf7e` | 用于验证码文本的主要颜色。       |

## 它是如何运作的

1. 生成器选择配置长度的随机字符串。
2. 该字符串被渲染到带有视觉噪声的画布上以抵抗 OCR。
3. 返回结果图像（和预期答案），以便调用应用程序可以提出质询并稍后验证响应。

由于该包是一个纯粹的图像生成器，因此它本身不处理网络或会话管理。它旨在集成到更大的挑战流程中——例如，作为 [Spam Blocker](./spam-blocker.md) 支持的挑战类型之一。
