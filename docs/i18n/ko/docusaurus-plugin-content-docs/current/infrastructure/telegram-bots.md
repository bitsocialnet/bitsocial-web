---
title: Telegram Bots
description: Bitsocial 커뮤니티 목록을 모니터링하고 게시물을 Telegram 채널에 전달하는 피드 봇입니다.
sidebar_position: 3
---

# Telegram Bots

Bitsocial Telegram 봇은 Bitsocial 네트워크의 클라이언트 커뮤니티 목록을 모니터링하고 자동으로 새 게시물을 Telegram 채널에 전달합니다. 전달된 각 메시지에는 5chan 및 Seedit의 원본 게시물로 다시 연결되는 인라인 버튼이 포함되어 있습니다.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## 사용 가능한 봇

| 봇              | 상태     | 설명                                                                    |
| --------------- | -------- | ----------------------------------------------------------------------- |
| **5chan 피드**  | 활동적인 | 모든 5chan 디렉터리를 모니터링하고 새 게시물을 Telegram으로 전달합니다. |
| **Seedit 피드** | 예정     | Seedit 커뮤니티에 동일한 기능을 제공합니다.                             |

## 설정

### 전제조건

- Node.js
- 방사
- Telegram 봇 토큰([BotFather](https://t.me/BotFather)을 통해 생성)

### 설치

저장소를 복제하고 종속 항목을 설치합니다.

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### 구성

봇 토큰을 사용하여 프로젝트 루트에 `.env` 파일을 만듭니다.

```env
BOT_TOKEN=your_telegram_bot_token
```

### 달리기

환경을 구성한 후 봇을 시작합니다.

```bash
yarn start
```

## 게시물 형식

봇이 텔레그램에 게시물을 전달할 때 두 개의 인라인 버튼이 포함됩니다:

- **5chan에서 보기** -- 5chan 웹 클라이언트에서 게시물을 엽니다.
- **Seedit에서 보기** -- Seedit 웹 클라이언트에서 게시물을 엽니다.

이를 통해 Telegram 가입자는 원하는 클라이언트의 전체 토론 스레드로 직접 이동할 수 있습니다.
