---
title: BSO 확인자
description: 내장된 캐싱 및 교차 플랫폼 지원을 통해 ENS TXT 레코드를 사용하여 .bso 도메인 이름을 공개 키로 확인합니다.
sidebar_position: 1
---

# BSO 확인자

BSO 확인자는 ENS에 저장된 Bitsocial TXT 레코드를 읽어 `.bso` 도메인 이름을 해당 공개 키로 변환합니다. 공유 viem 클라이언트, 영구 캐싱을 제공하고 Node.js 및 브라우저 환경 모두에서 작동합니다.

- **GitHub**: [bitsocialnet/bso-리졸버](https://github.com/bitsocialnet/bso-resolver)
- **라이센스**: GPL-2.0 전용

## 설치

```bash
npm install @bitsocial/bso-resolver
```

## 해석기 생성

구성 객체를 생성자에 전달하여 해석기를 인스턴스화합니다:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| 매개변수   | 필수 | Description                                         |
| ---------- | ---- | --------------------------------------------------- |
| `key`      | Yes  | Identifier for the resolver instance.               |
| `provider` | Yes  | Transport configuration (see below).                |
| `dataPath` | No   | Directory for the SQLite cache file (Node.js only). |

### Provider 옵션

`provider` 매개변수는 세 가지 형식을 허용합니다.

- **`"viem"`** -- viem에서 제공하는 기본 대중 교통을 사용합니다.
- **HTTP(S) URL** -- JSON-RPC 끝점을 통해 연결합니다(예: `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- WebSocket RPC 엔드포인트(예: `wss://mainnet.infura.io/ws/v3/YOUR_KEY`)를 통해 연결합니다.

## 방법

### `resolve({ name, abortSignal? })`

`.bso` 이름을 조회하고 관련 공개 키를 반환합니다. 선택적인 `AbortSignal`는 다음과 같습니다. 장기 실행 요청을 취소하기 위해 전달됩니다.

### `canResolve({ name })`

해결 프로그램이 지정된 이름을 처리할 수 있는지 여부를 나타내는 부울을 반환합니다. 이를 사용하여 전체 해결을 시도하기 전에 지원을 확인합니다.

### `destroy()`

확인자를 해제하고 데이터베이스 연결을 닫고 리소스를 해제합니다. 확인자가 더 이상 필요하지 않을 때 이 호출을 호출하세요.

## 캐싱

확인된 이름은 중복 네트워크 조회를 줄이기 위해 자동으로 캐시됩니다. 캐싱 백엔드는 런타임 환경에 따라 선택됩니다:

| 환경     | 백엔드         | 참고                                                                      |
| -------- | -------------- | ------------------------------------------------------------------------- |
| Node.js  | SQLite         | `dataPath`에 저장되어 있습니다. 동시 액세스를 위해 WAL 모드를 사용합니다. |
| 브라우저 | 인덱스DB       | 기본 IndexedDB 트랜잭션을 사용합니다.                                     |
| 대체     | 인메모리 `Map` | SQLite나 IndexedDB를 모두 사용할 수 없을 때 사용됩니다.                   |

모든 캐시 항목에는 **1시간 TTL**이 있으며 만료 후 자동으로 제거됩니다.

## pkc-js와의 통합

리졸버는 `nameResolvers` 옵션을 통해 pkc-js에 직접 연결할 수 있으므로 키 중에 투명한 `.bso` 이름 확인이 가능합니다. 조회:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## 동시성

리졸버는 동시 사용 시 안전하도록 설계되었습니다.

- 단일 공유 viem 클라이언트는 중복 연결을 방지합니다.
- SQLite는 WAL(Write-Ahead Logging) 모드에서 작동하여 차단 없이 동시 읽기를 허용합니다.
- 브라우저 캐싱은 기본 IndexedDB 트랜잭션에 의존합니다. 격리.

## 플랫폼 진입점

패키지는 Node.js 및 브라우저 빌드에 대한 별도의 진입점을 제공합니다. `package.json`의 `exports` 필드를 지원하는 번들러는 자동으로 올바른 항목을 선택합니다.
