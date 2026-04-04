---
title: EVM Contract Call Challenge
description: EVM 스마트 계약을 호출하여 온체인 조건을 확인하는 스팸 방지 챌린지입니다.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning 레거시 명명
이 패키지는 원래 `@plebbit` 범위로 게시되었습니다. `@bitsocial/evm-contract-challenge`로 이름이 변경되었습니다. 이전 이름에 대한 참조는 이전 문서나 코드베이스에 계속 나타날 수 있습니다.
:::

EVM 계약 호출 챌린지는 게시를 허용하기 전에 온체인 조건을 확인하는 스팸 방지 메커니즘입니다. 원래 `plebbit-js`에서 독립 실행형 패키지로 추출된 이 패키지를 사용하면 커뮤니티 소유자가 게시하기 위해 작성자가 스마트 계약에서 정의한 기준(예: 최소 토큰 잔액 보유 등)을 충족하도록 요구할 수 있습니다.

**소스 코드:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## 요구 사항

- **Node.js** >= 22
- **ESM 전용** -- 이 패키지는 CommonJS 빌드를 제공하지 않습니다.
- **런타임 피어 종속성:** `@plebbit/plebbit-js`(`@pkc/pkc-js`로 마이그레이션)

## 설치

```bash
npm install @bitsocial/evm-contract-challenge
```

## 구성 옵션

| 옵션        | 유형                           | 설명                                                          |
| ----------- | ------------------------------ | ------------------------------------------------------------- |
| `string`    | 쿼리할 체인(예: `eth`, `avax`) |
| `string`    | 호출할 스마트 계약 주소입니다. |
| `abi`       | `string`                       | 호출되는 함수에 대한 ABI 조각입니다.                          |
| `condition` | `string`                       | 계약 반환 값(예: `> 1000`)에 대해 평가되는 비교 표현식입니다. |
| `error`     | `string`                       | 조건을 충족하지 않는 작성자에게 표시되는 오류 메시지입니다.   |

## 예

특정 ERC-20 토큰을 1,000개 이상 보유하고 있는 작성자에게 게시를 제한하려는 커뮤니티 소유자는 다음과 같이 챌린지를 구성합니다.

- `chainTicker`: `"eth"`
- `address`: 토큰 계약 주소
- `abi`: `balanceOf(address)`에 대한 ABI
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

저작자가 게시를 시도하면 챌린지에서 `balanceOf`를 호출합니다. 작성자의 주소로 반환된 값이 조건을 만족하는지 확인합니다. 그렇다면 출판이 진행됩니다. 그렇지 않으면 구성된 오류 메시지가 반환됩니다.

## 사용 시기

EVM 계약 호출 챌린지는 다음과 같은 경우에 이상적입니다.

- **토큰 관리 커뮤니티**는 토큰 보유자에 대한 게시를 제한합니다.
- **NFT 관리 액세스** 특정 NFT의 소유권이 필요합니다.
- **DAO 거버넌스 공간** 참여는 거버넌스 토큰으로 제한됩니다.

온체인 신원에 의존하지 않는 커뮤니티의 경우 대신 [Spam Blocker](./spam-blocker.md) 또는 [Voucher Challenge](./voucher-challenge.md)를 고려하세요.
