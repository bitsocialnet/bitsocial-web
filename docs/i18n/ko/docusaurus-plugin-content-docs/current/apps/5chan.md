---
title: 5chan
description: Bitsocial 프로토콜 위에 구축된 서버리스 탈중앙화 이미지보드로, 누구나 보드를 만들고 소유할 수 있습니다.
sidebar_position: 1
---

# 5chan

5chan은 Bitsocial 프로토콜 위에서 동작하는 서버리스·관리자 없는 완전 탈중앙화 이미지보드입니다. 익숙한 이미지보드 디렉터리 구조를 그대로 따르면서 탈중앙화된 소유권을 더했습니다. 누구나 보드를 만들 수 있고, 여러 보드가 투표를 통해 같은 디렉터리 자리를 두고 경쟁할 수 있습니다.

## 다운로드

| 플랫폼   | 링크                              |
| -------- | --------------------------------- |
| 웹       | [5chan.app](https://5chan.app)    |
| 데스크톱 | Mac, Windows, Linux에서 사용 가능 |
| 모바일   | Android에서 사용 가능             |

## 보드가 작동하는 방식

5chan은 고전적인 디렉터리 구조(예: `/b/`, `/g/`)를 사용해 콘텐츠를 보드 단위로 정리합니다. 중앙 관리자가 모든 보드를 통제하는 기존 이미지보드와 달리, 5chan에서는 어떤 사용자든 자기 보드를 만들고 완전히 소유할 수 있습니다. 여러 보드가 같은 디렉터리 자리를 노릴 경우, 그 자리를 두고 경쟁합니다. 자세한 내용은 [디렉터리](/directories/)를 참고하세요.

### 보드 만들기

새 보드를 만들려면 `bitsocial-cli`를 P2P 노드로 실행해야 합니다. 이렇게 하면 중앙 서버에 의존하지 않고 탈중앙화된 방식으로 보드가 호스팅됩니다.

### 디렉터리 배정

각 디렉터리의 후보 보드는 [bitsocialnet/lists](https://github.com/bitsocialnet/lists) 저장소의 `5chan-directories/5chan-<code>-directory.json` 파일에 등록되며, 보드는 해당 파일에 풀 리퀘스트를 보내 디렉터리에 참여합니다. 5chan은 또한 [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting)을 사용해 디렉터리마다 투표 경선을 운영합니다. 5chan Pass 보유자는 각자 한 표를 가지며, 목록에 없는 보드에 투표하면 그 보드를 후보로 추천하게 됩니다. 경선은 현재 Base Sepolia 테스트넷에서 진행되며, 집계는 표시되지만 목록 순서를 바꾸지는 않습니다.

## 내부 구조

내부적으로 5chan은 네트워크 통신에 공용 Bitsocial 프로토콜 클라이언트 계층을 사용합니다.
5chan.app 웹 앱은 기본적으로 브라우저에서 Helia 노드를 실행하므로, 평범한 탭 하나가 그대로
네트워크의 피어가 됩니다. 다른 피어에게서 보드를 불러오고 pubsub으로 게시하며, 콘텐츠 경로에
중앙화된 IPFS 게이트웨이가 끼어들지 않습니다. 여기에 무엇이 필요한지, 그리고 브라우저 노드가
여전히 할 수 없는 일은 무엇인지는 [브라우저 P2P](/browser-p2p/)를 참고하세요.

## 링크

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **라이선스**: GPL-2.0-only
