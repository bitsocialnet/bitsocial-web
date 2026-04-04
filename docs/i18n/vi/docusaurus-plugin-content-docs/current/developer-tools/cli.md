---
title: CLI
description: Giao diện dòng lệnh để chạy nút Bitsocial, tạo cộng đồng và quản lý các hoạt động giao thức.
sidebar_position: 2
---

# CLI

:::warning Đặt tên kế thừa
Gói này hiện đang sử dụng các quy ước đặt tên cũ được kế thừa từ phần phụ thuộc ngược dòng của nó. Các tham chiếu đến "plebbit" trong lệnh, đầu ra và cấu hình sẽ được chuyển sang "bitsocial" trong bản phát hành trong tương lai. Chức năng không bị ảnh hưởng.
:::

`bitsocial-cli` là một công cụ dòng lệnh để tương tác với phần phụ trợ giao thức Bitsocial. Nó cho phép bạn chạy daemon P2P cục bộ, tạo và định cấu hình cộng đồng cũng như xuất bản nội dung -- tất cả đều từ thiết bị đầu cuối.

Nó được xây dựng dựa trên `plebbit-js` và được [5chan](/apps/5chan/) và [Seedit](/apps/seedit/) sử dụng để tạo cộng đồng và quản lý nút.

## Cài đặt

Các tệp nhị phân dựng sẵn có sẵn cho Windows, macOS và Linux. Tải xuống bản phát hành mới nhất cho nền tảng của bạn từ GitHub:

**[Tải xuống từ Bản phát hành GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Sau khi tải xuống, hãy tạo tệp nhị phân có thể thực thi được (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Chạy Daemon

Việc sử dụng CLI phổ biến nhất là chạy nút Bitsocial. Daemon khởi động lớp mạng P2P và hiển thị API cục bộ mà máy khách có thể kết nối.

```bash
bitsocial-cli daemon
```

Trong lần khởi chạy đầu tiên, daemon sẽ xuất ra các liên kết đến **WebUI**, một giao diện đồ họa dựa trên trình duyệt để quản lý nút, cộng đồng và cài đặt của bạn. Điều này hữu ích nếu bạn thích GUI hơn các lệnh đầu cuối.

## Các lệnh chính

| Lệnh                | Mô tả                                                |
| ------------------- | ---------------------------------------------------- |
| `daemon`            | Bắt đầu nút P2P Bitsocial                            |
| `create subplebbit` | Tạo một cộng đồng mới                                |
| `subplebbit edit`   | Cập nhật cài đặt cộng đồng (tiêu đề, mô tả, quy tắc) |
| `subplebbit list`   | Liệt kê các cộng đồng được lưu trữ trên nút này      |
| `subplebbit start`  | Bắt đầu phục vụ một cộng đồng cụ thể                 |
| `subplebbit stop`   | Ngừng phục vụ một cộng đồng cụ thể                   |

Chạy bất kỳ lệnh nào với `--help` để xem các tùy chọn và cờ có sẵn:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Quy trình làm việc điển hình

Quy trình thiết lập chung để lưu trữ một cộng đồng mới:

```bash
# 1. Khởi động trình nền
bitsocial-cli daemon

# 2. Trong một thiết bị đầu cuối khác, tạo một cộng đồng
bitsocial-cli create subplebbit

# 3. Cấu hình cộng đồng
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Bắt đầu phục vụ nó
bitsocial-cli subplebbit start <address>
```

Cộng đồng hiện đang hoạt động trên mạng Bitsocial và có thể truy cập được từ bất kỳ ứng dụng khách tương thích nào.

## Liên kết

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
