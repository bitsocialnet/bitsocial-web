---
title: 텔레그램 봇
description: 비트소셜 커뮤니티 목록을 모니터링하고 게시물을 텔레그램 채널에 전달하는 피드 봇입니다.
sidebar_position: 3
---

# 텔레그램 봇

Bitsocial Telegram 봇은 Bitsocial 네트워크의 클라이언트 커뮤니티 목록을 모니터링하고 자동으로 새 게시물을 Telegram 채널에 전달합니다. 전달된 각 메시지에는 5chan 및 Seedit의 원래 게시물로 다시 연결되는 인라인 버튼이 포함되어 있습니다.

- **GitHub**: [비트소셜넷/ 비트소셜-텔레그램-봇](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## 사용 가능한 봇

| 봇              | 상태 | 설명                                                                    |
| --------------- | ---- | ----------------------------------------------------------------------- |
| **5chan 피드**  | 활성 | 모두 모니터링 5chan은 새 게시물을 Telegram에 디렉토리화하고 전달합니다. |
| **Seedit 피드** | 예정 | Seedit 커뮤니티에 동일한 기능을 제공합니다.                             |

## 설정

### 전제 조건

- Node.js
- Yarn
- 텔레그램 봇 토큰([봇아버지]를 통해 토큰 생성(https://t.me/BotFather))

### 설치

저장소 복제 및 종속성 설치:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### 구성

봇 토큰을 사용하여 프로젝트 루트에 `.env` 파일 생성:

```env
BOT_TOKEN=your_telegram_bot_token
```

### 실행

구성 후 봇 시작) 환경:

```bash
yarn start
```

## 게시물 형식

봇이 Telegram으로 게시물을 전달할 때 두 개의 인라인 버튼이 포함됩니다:

- **5chan에서 보기** -- 5chan 웹 클라이언트에서 게시물을 엽니다.
- **Seedit에서 보기** -- Seedit 웹 클라이언트에서 게시물을 엽니다.

이를 통해 Telegram 가입자는 어느 클라이언트에서든 전체 토론 스레드로 직접 이동할 수 있습니다. 선호합니다.
