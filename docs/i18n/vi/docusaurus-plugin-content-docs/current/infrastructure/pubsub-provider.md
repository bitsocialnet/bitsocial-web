---
title: Pubsub Provider
description: Bộ chuyển tiếp pubsub dự phòng và nhà cung cấp định tuyến ủy quyền dành cho nhà điều hành Bitsocial.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider là dịch vụ dành cho nhà điều hành, dùng để chạy một bộ chuyển tiếp pubsub dự phòng tương thích với Bitsocial kèm một nút Kubo đi sẵn. Các máy khách Bitsocial hiện đại như 5chan và Seedit mặc định dùng mạng ngang hàng thuần túy trong trình duyệt, nhưng dịch vụ này vẫn hữu ích như một đường dự phòng tùy chọn cho người dùng tắt P2P trong trình duyệt, hoặc cho nhà điều hành muốn có các điểm cuối tương thích công khai.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker image**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Giấy phép**: GPL-3.0-or-later

## Nó chạy những gì

- một proxy HTTP công khai cho các tuyến pubsub, cổng, name-provider và định tuyến ủy quyền
- một nút Kubo đi sẵn đã bật pubsub
- một nhà cung cấp định tuyến HTTP ủy quyền tại `/routing/v1/providers`
- các chỉ số Prometheus tại `/metrics`
- tùy chọn truy cập toàn bộ API RPC của Kubo bằng basic-auth

## Cổng mạng

Các giá trị mặc định được chọn sao cho Pubsub Provider chạy được cạnh [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) trên cùng một VPS mà không xung đột cổng swarm.

| Mục đích             | Mặc định                                     | Ghi chú                                                   |
| -------------------- | -------------------------------------------- | --------------------------------------------------------- |
| Proxy HTTP công khai | `8000` cho ứng dụng, `80` cho máy chủ Docker | Đặt `PUBSUB_PROVIDER_HTTP_PORT` để đổi cổng trên máy chủ. |
| Swarm của Kubo       | `4002` TCP/UDP                               | Tránh cổng swarm Kubo mặc định `4001` của seeder.         |
| API của Kubo         | `5001` chỉ cục bộ                            | Được proxy dùng nội bộ.                                   |
| Cổng Kubo            | `8080` chỉ cục bộ                            | Được proxy dùng nội bộ.                                   |

## Cài đặt bằng Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Xem nhật ký:

```bash
docker logs --follow pubsub-provider
```

Kiểm tra proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Nâng cấp

Nếu trước đây bạn chạy ảnh `latest` cũ, hãy buộc Compose tạo lại container từ ảnh đã xuất bản được ghim phiên bản:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Xác nhận ảnh đã sửa đang chạy:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Nhật ký phải chứa `using Kubo binary at /app/bin/ipfs` và không được chứa `downloading ipfs`.

## Chạy cùng Bitsocial Seeder

Nếu cùng một máy chủ cũng chạy `bitsocial-seeder`, hãy giữ Pubsub Provider ở cổng swarm `4002` hoặc một cổng khác không phải `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Cách này tránh được xung đột cổng xảy ra khi hai nút Kubo cùng cố gắn vào TCP/UDP `4001`.

## Cấu hình

Các biến môi trường thường được ghi đè:

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

Hãy dùng dịch vụ này như một bộ chuyển tiếp dự phòng, không phải để thay thế P2P trong trình duyệt. Vẫn nên chạy hạ tầng tracker riêng khi mạng cần năng lực khám phá máy ngang hàng chuyên dụng.
