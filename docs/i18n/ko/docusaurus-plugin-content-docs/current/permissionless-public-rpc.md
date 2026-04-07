---
title: 무허가 공용 RPC
description: 격리된 사용자, 범위가 지정된 권한 및 커뮤니티 소유권을 갖춘 공개 Bitsocial RPC 서비스에 대한 디자인을 제안했습니다.
---

# 무허가 공용 RPC

이 페이지는 공개 RPC를 구현 세부 사항의 벽 대신 제품 수준의 Bitsocial 제안으로 구성합니다.

## 일반 언어 목표

[Bitsocial Forge](https://bitsocialforge.com)는 운영자를 해당 커뮤니티의 관리자로 전환하지 않고도 많은 사용자가 자신의 Bitsocial 커뮤니티를 원격으로 관리할 수 있도록 하는 공개 RPC 서비스를 실행할 수 있습니다.

이 서비스는 세 가지 제약 조건을 유지하면서 모바일 및 경량 클라이언트를 실용적으로 만들어야 합니다.

1. 사용자는 기본적으로 서로 격리되어 있습니다.
2. 권한은 명시적이고 세부적으로 유지됩니다.
3. 현재 RPC 요청 및 응답 형태와의 호환성은 롤아웃 중에 유지될 수 있습니다.

## 어떤 문제가 해결되나요?

오늘날 가장 간단한 RPC 모델은 일반적으로 하나의 인증 키, 하나의 권한 도메인, 전체 액세스 등 전부 아니면 전무입니다. 이는 단일 운영자에게는 작동하지만 공용 다중 사용자 서비스에는 작동하지 않습니다.

무허가 공개 RPC에는 더 강력한 모델이 필요합니다.

- 하나의 서비스가 많은 사용자를 호스팅할 수 있음
- 각 사용자는 자신의 커뮤니티와 제한을 갖습니다.
- 운영자 정의 정책으로 남용 방지 가능
- 사용자는 나중에 다른 곳으로 이사하거나 자체 호스팅할 수 있습니다.

## 핵심 모델

### 사용자

각 사용자는 인증 자격 증명과 권한 번들을 받습니다.

### 커뮤니티

서비스를 통해 생성된 커뮤니티는 소유자 레코드에 할당됩니다. 관리 방법의 범위를 올바른 사용자에게 지정할 수 있도록 소유권이 명시적으로 추적됩니다.

### 권한

권한은 기능을 기반으로 합니다. "RPC를 사용할 수 있음"에 대한 하나의 부울 대신 서버는 다음을 제어할 수 있습니다.

- 사용자가 만들 수 있는 커뮤니티 수
- 어떤 관리 방법을 사용할 수 있나요?
- 어떤 게시 작업이 허용되나요?
- 어떤 속도 제한이 적용되는지
- 어떤 관리 화면이 표시되는지

### 관리 화면

공용 RPC 자체는 사용자 지향 RPC 동작에 계속 초점을 맞춰야 합니다. 사용자 생성, 소유권 이전, 감사 검토 등의 관리 작업은 별도의 운영자 API 및 대시보드에 속합니다.

## 호환성 입장

사용자에게 제공되는 문서에서는 **커뮤니티** 및 **프로필**과 같은 Bitsocial 용어를 사용해야 합니다.

연결 수준에서 첫 번째 롤아웃에서는 호환성에 유용한 현재 JSON-RPC 전송 및 페이로드 형태를 계속 유지할 수 있습니다. 즉, 전환 기간 동안 일부 호환성 지향 메서드 이름이 유지되거나 뒤에서 모양이 요청되더라도 문서는 Bitsocial 기반을 유지할 수 있습니다.

## 제안된 권한 번들

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

정확한 메소드 이름이 예시되어 있습니다. 중요한 부분은 정책의 형태입니다. 개별 기능은 하나의 수퍼유저 토큰에 묶이는 대신 독립적으로 제어됩니다.

## 연결 흐름

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

권한 인식은 선택 사항으로 유지되어야 합니다. 알림을 무시하는 클라이언트는 서버의 표준 인증 실패를 처리하여 여전히 올바르게 작동할 수 있습니다.

## 소유권 집행

서비스가 커뮤니티를 생성하면 호출 사용자에게 자동으로 소유권을 할당해야 합니다. 거기에서 :

- 커뮤니티 시작, 중지, 편집 및 삭제 작업은 소유자 범위에 속합니다.
- 목록 및 구독 응답은 기본적으로 발신자의 커뮤니티로 설정됩니다.
- 더 넓은 가시성은 기본값이 아닌 명시적인 관리자 권한입니다.

한 가지 극단적인 경우는 매우 중요합니다. 사용자가 자신이 소유하지 않은 커뮤니티에 가입하는 경우 서버는 외부 관찰자가 볼 수 있는 공개 상태만 노출해야 합니다. 소유자 전용 구성 또는 내부 런타임 데이터는 구독 API를 통해 유출되어서는 안 됩니다.

## 권장되는 작업자 표면

관리 API는 지루하고 명시적일 수 있습니다.

- 사용자 나열
- 한 명의 사용자를 검사하다
- 사용자 생성 또는 업데이트
- 사용자 삭제
- 커뮤니티 소유권 이전
- 감사 로그 검사

이 운영자 API에 대한 인증은 최종 사용자 RPC 인증과 완전히 분리되어야 합니다.

## 출시 단계

### 1단계

- 공개 RPC 프로젝트 구조 확립
- 사용자 기록 및 소유권 추적 추가
- 현재 RPC 서버를 포크하거나 확장합니다.

### 2단계

- 권한 번들 구현
- RPC 메소드 계층에서 시행
- 연결 시 권한 메타데이터 반환

### 3단계

- 연산자 API 추가
- 감사 로깅 추가
- 관리자 인증 추가

### 4단계

- 관리 대시보드 배송
- 테스트 남용 통제
- 속도 제한 및 스토리지 할당량 강화

## 공개 질문

### 인증 자격 증명 스팸

인증 생성 비용이 저렴하다면 공용 서비스에는 자격 증명을 발급하기 전에 챌린지 계층이 필요할 수 있습니다. 가능한 방법 중 하나는 커뮤니티 챌린지 모델 자체를 재사용하여 자격 증명 발급이 나머지 네트워크와 동일한 남용 방지 철학을 상속하도록 하는 것입니다.

### 마이그레이션 세부정보

일부 초기 구현에서는 여전히 내부적으로 호환성 지향 메서드 이름을 노출할 수 있습니다. 이는 Bitsocial 문서의 영구 공개 용어가 아닌 마이그레이션 세부 사항으로 처리되어야 합니다.

## 요약

이 제안은 실제로 한 가지에 관한 것입니다. 즉, 관리하지 않고도 공용 RPC 인프라를 유용하게 만드는 것입니다. 좋은 공개 Bitsocial RPC는 백도어를 통해 소유권을 되찾는 새로운 중앙 플랫폼이 아니라 커뮤니티 운영을 위한 선택적인 지원처럼 느껴져야 합니다.
