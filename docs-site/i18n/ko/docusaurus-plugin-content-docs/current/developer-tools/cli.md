---
title: CLI
description: Bitsocial 노드 실행, 커뮤니티 생성 및 프로토콜 작업 관리를 위한 명령줄 인터페이스입니다.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
이 패키지는 현재 업스트림 종속성에서 상속된 레거시 명명 규칙을 사용합니다. 명령, 출력 및 구성에서 "plebbit"에 대한 참조는 향후 릴리스에서 "bitsocial"로 마이그레이션됩니다. 기능은 영향을 받지 않습니다.
:::

`bitsocial-cli`는 Bitsocial 프로토콜 백엔드와 상호작용하기 위한 명령줄 도구입니다. 로컬 P2P 데몬을 실행하고, 커뮤니티를 생성 및 구성하고, 콘텐츠를 게시할 수 있습니다. 이 모든 것이 터미널에서 가능합니다.

`plebbit-js` 위에 구축되었으며 커뮤니티 생성 및 노드 관리를 위해 [5chan](/apps/5chan/) 및 [Seed](/apps/seedit/)에서 사용됩니다.

## 설치

사전 구축된 바이너리는 Windows, macOS 및 Linux에서 사용할 수 있습니다. GitHub에서 플랫폼에 대한 최신 릴리스를 다운로드하세요:

**[GitHub 릴리스에서 다운로드](https://github.com/bitsocialnet/bitsocial-cli/releases)**

다운로드 후 바이너리 실행 파일을 만듭니다(macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## 데몬 실행

CLI의 가장 일반적인 용도는 Bitsocial 노드를 실행하는 것입니다. 데몬은 P2P 네트워킹 계층을 시작하고 로컬을 노출합니다. 클라이언트가 연결할 수 있는 API.

```bash
bitsocial-cli daemon
```

처음 실행 시 데몬은 노드, 커뮤니티 및 설정을 관리하기 위한 브라우저 기반 그래픽 인터페이스인 **WebUI**에 대한 링크를 출력합니다.

## 주요 명령

|
| ------------------- | ----------------------------------------------------- |
| `daemon` | Bitsocial P2P 노드 시작 |
| `create subplebbit` | 새 커뮤니티 만들기 |
| `subplebbit edit` | 커뮤니티 설정 업데이트(제목, 설명, 규칙) |
| `subplebbit list` | 이 노드에서 호스팅되는 커뮤니티 나열 |
| `subplebbit start` | 특정 커뮤니티에 봉사 시작하기 |
| `subplebbit stop` | 특정 커뮤니티 서비스 중지 |

`--help`로 명령을 실행하여 사용 가능한 옵션과 플래그를 확인하세요.

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## 일반적인 작업 흐름

새 커뮤니티 호스팅을 위한 일반적인 설정 흐름:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

커뮤니티는 이제 Bitsocial 네트워크에 라이브이며 호환되는 모든 클라이언트에서 액세스할 수 있습니다.

## 링크

- **GitHub:** [비트소셜넷/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
