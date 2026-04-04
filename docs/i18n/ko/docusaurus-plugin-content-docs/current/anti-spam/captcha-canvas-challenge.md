---
title: Captcha Canvas Challenge
description: 구성 가능한 문자, 크기 및 색상을 갖춘 독립형 이미지 기반 보안 문자 생성기입니다.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning 레거시 명명
이 패키지는 원래 `@plebbit` 범위로 게시되었습니다. `@bitsocial/captcha-canvas-challenge`로 이름이 변경되었습니다. 이전 이름에 대한 참조는 이전 문서나 코드베이스에 계속 나타날 수 있습니다.
:::

보안 문자 캔버스 챌린지는 원래 `plebbit-js`에서 추출된 독립형 이미지 보안 문자 생성기입니다. 무작위 텍스트를 HTML 캔버스에 렌더링하고 결과 이미지를 반환하며, 커뮤니티는 이를 스팸 문제로 작성자에게 제시할 수 있습니다.

**소스 코드:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## 요구 사항

- **Node.js** >= 22
- **ESM 전용** -- 이 패키지는 CommonJS 빌드를 제공하지 않습니다.
- **런타임 피어 종속성:** `@plebbit/plebbit-js`(`@pkc/pkc-js`로 마이그레이션)

## 설치

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## 구성 옵션

| 옵션         | 유형     | 기본값    | 설명                                              |
| ------------ | -------- | --------- | ------------------------------------------------- |
| `characters` | `number` | `6`       | 보안 문자 이미지에 렌더링된 임의의 문자 수입니다. |
| `height`     | `number` | `100`     | 생성된 이미지의 높이(픽셀)입니다.                 |
| `width`      | `number` | `300`     | 생성된 이미지의 너비(픽셀)입니다.                 |
| `colors`     | `string` | `#32cf7e` | 보안 문자 텍스트에 사용되는 기본 색상입니다.      |

## 작동 방식

1. 생성기는 구성된 길이의 무작위 문자열을 선택합니다.
2. 문자열은 OCR을 방지하기 위해 시각적 노이즈가 있는 캔버스에 렌더링됩니다.
3. 결과 이미지(및 예상 답변)가 반환되므로 호출 애플리케이션이 문제를 제시하고 나중에 응답을 확인할 수 있습니다.

패키지는 순수 이미지 생성기이므로 네트워킹이나 세션 관리를 처리하지 않습니다. 그 자체. 예를 들어 [Spam Blocker](./spam-blocker.md)에서 지원하는 인증 확인 유형 중 하나로 더 큰 인증 확인 흐름에 통합될 예정입니다.
