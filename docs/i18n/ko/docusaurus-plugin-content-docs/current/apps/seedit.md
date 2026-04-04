---
title: seedit
description: Bitsocial 프로토콜을 기반으로 구축된 서버리스, 분산형 Reddit 스타일 포럼으로 누구나 커뮤니티를 만들고 소유할 수 있습니다.
sidebar_position: 2
---

# seedit

Seedit은 Bitsocial 프로토콜을 기반으로 구축된 구식 Reddit에 대한 서버리스, 관리자리스, 완전히 분산화된 대안입니다. 이는 사용자에게 자신의 커뮤니티에 대한 완전한 소유권을 부여합니다. 누구나 커뮤니티를 만들 수 있으며 여러 커뮤니티가 기본 목록 슬롯을 두고 경쟁할 수 있습니다.

## 다운로드

| 플랫폼   | 링크                                                   |
| -------- | ------------------------------------------------------ |
| 웹       | [seedit.app](https://seedit.app)                       |
| 웹(ENS)  | Brave 브라우저 또는 IPFS Companion을 통한 `seedit.eth` |
| 데스크톱 | Mac, Windows 및 Linux에서 사용 가능                    |
| 모바일   | Android에서 사용 가능                                  |

## 커뮤니티 작동 방식

seedit는 콘텐츠를 다음과 같이 구성합니다. 하위 레딧과 유사한 커뮤니티. 각 커뮤니티는 생성자가 소유하며 중앙 집중식 관리 없이 운영됩니다. 여러 커뮤니티가 동일한 기본 슬롯을 대상으로 하는 경우 해당 위치를 놓고 경쟁할 수 있습니다.

### 커뮤니티 생성

새 커뮤니티를 생성하는 방법에는 두 가지가 있습니다.

1. **데스크톱 클라이언트** — 데스크톱 애플리케이션에 내장된 GUI를 사용하여 커뮤니티를 설정하고 구성합니다.
2. **bitsocial-cli** — 명령줄에서 커뮤니티를 생성하고 관리하려면 CLI 도구를 실행하세요.

### 기본 커뮤니티 목록

첫 페이지에 나타나는 기본 커뮤니티 목록은 목록 저장소 내의 `default-multisub.json`에 정의되어 있습니다. 커뮤니티를 기본값에 추가하려면 커뮤니티 세부 정보와 함께 풀 요청을 제출하세요.

## 링크

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **텔레그램**: [t.me/seeditreact](https://t.me/seeditreact)
- **라이센스**: GPL-2.0 전용
