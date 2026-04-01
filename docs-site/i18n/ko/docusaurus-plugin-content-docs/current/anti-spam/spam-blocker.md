---
title: 스팸 차단기
description: 위험 점수, OAuth 문제 및 구성 가능한 계층 임계값을 갖춘 중앙 집중식 스팸 탐지 서비스입니다.
sidebar_position: 1
---

# 스팸 차단기

:::warning Legacy Naming
이 패키지는 원래 `@plebbit` 범위로 게시되었습니다. `@bitsocial/spam-blocker-server` 및 `@bitsocial/spam-blocker-challenge`로 이름이 변경되었습니다. 이전 이름에 대한 참조는 이전 문서나 코드베이스에 계속 나타날 수 있습니다.
:::

Spam Blocker는 들어오는 출판물을 평가하고 위험 점수를 할당하는 중앙 집중식 스팸 탐지 서비스입니다. 이는 두 가지 패키지로 구성됩니다.

- **`@bitsocial/spam-blocker-server`** -- 평가 및 챌린지 API를 호스팅하는 HTTP 서버.
- **`@bitsocial/spam-blocker-challenge`** -- 커뮤니티가 평가용 발행물을 보내기 위해 통합하는 경량 클라이언트 패키지.

**소스 코드:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## 위험 점수 산정 방식

`/evaluate` 엔드포인트에 제출된 모든 발행물은 숫자 위험 점수를 받습니다. 점수는 여러 신호의 가중치 조합입니다:

| 신호              | 설명                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| 계정 연령         | 최신 계정은 더 높은 위험을 받습니다. scores.                                                                |
| Karma             | Accumulated community karma reduces risk.                                                                   |
| Author reputation | Reputation data gathered by the background network indexer.                                                 |
| Content analysis  | Text-level heuristics (link density, known spam patterns, etc.).                                            |
| Velocity          | Rapid successive posts from the same author increase risk.                                                  |
| IP 인텔리전스     | 국가 수준 위치 정보 및 위협 피드 조회. 국가 코드만 저장됩니다. 원시 IP 주소는 커뮤니티와 공유되지 않습니다. |

## 계층 임계값

위험 점수는 다음 단계를 결정하는 구성 가능한 4개 계층 중 하나에 매핑됩니다.

1. **자동 수락** -- 점수는 아무런 문제 없이 게시가 승인될 만큼 낮습니다. 챌린지.
2. **OAuth 충족** -- 계속하려면 작성자가 OAuth 확인을 완료해야 합니다.
3. **OAuth-plus-more** -- OAuth만으로는 충분하지 않으며 추가 확인(예: CAPTCHA)이 필요합니다.
4. **자동 거부** -- 점수가 너무 높으므로 게시가 완전히 거부됩니다.

커뮤니티.

## 챌린지 흐름

게시물이 검증이 필요한 계층에 속하면 챌린지 흐름이 시작됩니다.

1. 작성자에게 먼저 **OAuth**(GitHub, Google, Twitter 및 기타 지원 제공업체)를 통해 인증하라는 메시지가 표시됩니다.
2. OAuth만으로는 충분하지 않은 경우(계층 3) Cloudflare Turnstile에서 제공하는 **CAPTCHA 폴백**은 다음과 같습니다. 제시됩니다.
3. OAuth ID는 확인용으로만 사용되며 커뮤니티나 다른 사용자와 **결코 공유되지 않습니다**.

## API 엔드포인트

### `POST /evaluate`

위험 평가를 위해 발행물을 제출합니다. 계산된 위험 점수와 필수 챌린지 계층을 반환합니다.

### `POST /challenge/verify`

검증을 위해 완료된 챌린지(OAuth 토큰, CAPTCHA 솔루션 또는 둘 다)의 결과를 제출합니다.

### `GET /iframe/:sessionId`

반환 주어진 세션에 대해 적절한 챌린지 UI를 렌더링하는 내장 가능한 HTML 페이지.

## 속도 제한

작성자의 연령과 평판에 따라 비율 제한이 동적으로 적용됩니다. 신인이거나 평판이 낮은 저자는 더 엄격한 제한을 받는 반면, 기존 저자는 더 관대한 제한을 받습니다. 이는 신뢰할 수 있는 참가자에게 불이익을 주지 않고 스팸 홍수를 방지합니다.

## 백그라운드 네트워크 인덱서

서버는 작성자 평판 데이터를 구축하고 유지하기 위해 네트워크를 지속적으로 크롤링하는 백그라운드 인덱서를 실행합니다. 이 데이터는 위험 채점 파이프라인에 직접 입력되어 시스템이 커뮤니티 전체에서 반복적으로 선의의 참가자를 인식할 수 있도록 합니다.

## 개인 정보 보호

스팸 차단기는 개인 정보 보호를 염두에 두고 설계되었습니다.

- OAuth ID는 문제 확인에만 사용되며 커뮤니티에 **절대 공개되지 않습니다**.
- IP 주소는 **국가 코드만**으로 확인됩니다. 원시 IP는 저장되거나 공유되지 않습니다.

## 데이터베이스

서버는 평판 데이터, 세션 상태 및 구성의 로컬 지속성을 위해 **SQLite**(`better-sqlite3`를 통해)를 사용합니다.
