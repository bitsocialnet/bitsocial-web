---
title: Pubsub Provider
description: Bitsocial 운영자를 위한 대체 pubsub 릴레이 및 위임 라우팅 제공자.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider는 Kubo 노드를 함께 묶어 Bitsocial 호환 pubsub 대체 릴레이를 운영하기 위한 운영자용 서비스입니다. 5chan과 Seedit 같은 최신 Bitsocial 클라이언트는 기본적으로 브라우저에서 순수 피어 투 피어 방식으로 통신하지만, 이 서비스는 브라우저 P2P를 끈 사용자를 위한 선택적 대체 경로로, 또는 공개 호환 엔드포인트를 두고 싶은 운영자에게 여전히 쓸모가 있습니다.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker 이미지**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **라이선스**: GPL-3.0-or-later

## 무엇을 실행하는가

- pubsub, 게이트웨이, 이름 제공자, 위임 라우팅 경로를 위한 공개 HTTP 프록시
- pubsub이 켜진 상태로 함께 묶인 Kubo 노드
- `/routing/v1/providers`에서 제공되는 위임 HTTP 라우팅 제공자
- `/metrics`에서 제공되는 Prometheus 메트릭
- 전체 Kubo RPC API에 대한 선택적 basic-auth 접근

## 포트

기본값은 Pubsub Provider가 같은 VPS에서 [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/)와 나란히 돌아가면서도 swarm 포트가 충돌하지 않도록 정해졌습니다.

| 용도             | 기본값                        | 참고                                                             |
| ---------------- | ----------------------------- | ---------------------------------------------------------------- |
| 공개 HTTP 프록시 | 앱 `8000`, Docker 호스트 `80` | 호스트 포트를 바꾸려면 `PUBSUB_PROVIDER_HTTP_PORT`를 설정합니다. |
| Kubo swarm       | `4002` TCP/UDP                | 시더의 기본 Kubo swarm 포트 `4001`을 피합니다.                   |
| Kubo API         | `5001` 로컬 전용              | 프록시가 내부적으로 사용합니다.                                  |
| Kubo 게이트웨이  | `8080` 로컬 전용              | 프록시가 내부적으로 사용합니다.                                  |

## Docker 설정

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

로그 확인:

```bash
docker logs --follow pubsub-provider
```

프록시 테스트:

```bash
curl http://127.0.0.1/commit-hash
```

## 업그레이드

이전에 예전 `latest` 이미지를 사용했다면, 고정 게시된 이미지로 컨테이너를 다시 만들도록 Compose에 강제하세요.

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

수정된 이미지가 실행 중인지 확인합니다.

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

로그에는 `using Kubo binary at /app/bin/ipfs`가 있어야 하고 `downloading ipfs`는 없어야 합니다.

## Bitsocial Seeder와 함께 실행하기

같은 호스트에서 `bitsocial-seeder`도 실행한다면 Pubsub Provider의 swarm 포트를 `4002`나 `4001`이 아닌 다른 포트로 유지하세요.

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

이렇게 하면 두 Kubo 노드가 모두 TCP/UDP `4001`에 바인딩하려 할 때 생기는 포트 충돌을 피할 수 있습니다.

## 설정

자주 쓰는 환경 변수 재정의:

```env
PUBSUB_PROVIDER_HTTP_PORT=80
PUBSUB_PROVIDER_SWARM_PORT=4002
PUBSUB_PROVIDER_PORTS=8000
KUBO_RPC_URL=http://127.0.0.1:5001/api/v0
IPFS_GATEWAY_URL=http://127.0.0.1:8080
HTTP_ROUTER_URLS=https://example-router.invalid
PUBSUB_PROVIDER_ROUTING_STORE_PATH=
BASIC_AUTH_USERNAME=
BASIC_AUTH_PASSWORD=
IPFS_GATEWAY_USE_SUBDOMAINS=false
SHUTDOWN_KEY=
ETH_PROVIDER_URL=
ETH_PROVIDER_URL_WS=
SOL_PROVIDER_URL=
```

이 제공자는 브라우저 P2P를 대신하는 수단이 아니라 대체 릴레이로 사용하세요. 네트워크에 전용 피어 탐색 용량이 필요할 때는 트래커 인프라를 별도로 계속 운영하세요.
