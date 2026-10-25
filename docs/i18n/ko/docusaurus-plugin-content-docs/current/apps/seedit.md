---
title: Seedit
description: Bitsocial 프로토콜을 기반으로 구축된 서버리스, 분산형 Reddit 스타일 포럼으로 누구나 커뮤니티를 만들고 소유할 수 있습니다.
sidebar_position: 2
---

# Seedit

Seedit은 Bitsocial 프로토콜을 기반으로 구축된 구식 Reddit에 대한 서버리스, 관리자리스, 완전히 분산화된 대안입니다. 이는 사용자에게 자신의 커뮤니티에 대한 완전한 소유권을 부여합니다. 누구나 커뮤니티를 만들 수 있으며 여러 커뮤니티가 `/s/funny` 같은 하나의 짧은 경로를 두고 경쟁할 수 있습니다.

## 다운로드

| 플랫폼   | 링크                                                   |
| -------- | ------------------------------------------------------ |
| 웹       | [seedit.app](https://seedit.app)                       |
| 웹(ENS)  | Brave 브라우저 또는 IPFS Companion을 통한 `seedit.eth` |
| 데스크톱 | Mac, Windows 및 Linux에서 사용 가능                    |
| 모바일   | Android에서 사용 가능                                  |

## 커뮤니티 작동 방식

Seedit는 콘텐츠를 다음과 같이 구성합니다. 하위 레딧과 유사한 커뮤니티. 각 커뮤니티는 생성자가 소유하며 중앙 집중식 관리 없이 운영됩니다. 여러 커뮤니티가 `/s/funny` 같은 동일한 [디렉터리](/directories/) 경로를 두고 경쟁할 수 있으며, 이 경로는 현재 1위 커뮤니티를 엽니다. 구독과 게시물 링크는 항상 정확한 커뮤니티를 가리킵니다.

### 커뮤니티 생성

새 커뮤니티를 생성하는 방법에는 두 가지가 있습니다.

1. **데스크톱 클라이언트** — 데스크톱 애플리케이션에 내장된 GUI를 사용하여 커뮤니티를 설정하고 구성합니다.
2. **bitsocial-cli** — 명령줄에서 커뮤니티를 생성하고 관리하려면 CLI 도구를 실행하세요.

### 기본 커뮤니티 목록

새 계정은 [bitsocialnet/lists](https://github.com/bitsocialnet/lists) 저장소의 `seedit-default-subscriptions.json`에 정의된, 정확한 주소로 지정된 커뮤니티들의 기본 목록을 구독합니다. 디렉터리 후보는 같은 저장소의 `seedit-directories/seedit-<code>-directory.json` 파일에 등록되어 있습니다. 두 목록 중 어디에든 커뮤니티를 추가하려면 커뮤니티 세부 정보와 함께 풀 요청을 제출하세요.

## 링크

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **텔레그램**: [t.me/seeditreact](https://t.me/seeditreact)
- **라이센스**: GPL-2.0 전용
