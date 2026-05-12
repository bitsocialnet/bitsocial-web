---
title: 5chan
description: Một bảng hình ảnh phi tập trung, không có máy chủ được xây dựng trên giao thức Bitsocial nơi bất kỳ ai cũng có thể tạo và sở hữu bảng.
sidebar_position: 1
---

:::warning[Đặt tên kế thừa]
Cơ sở mã của dự án này vẫn sử dụng cách đặt tên "plebbit" kế thừa từ trước khi đổi thương hiệu Bitsocial. Tên gói, tham chiếu API và một số thuật ngữ nội bộ sẽ được cập nhật trong bản phát hành sau này. Chức năng được mô tả ở đây là hiện hành — chỉ có cách đặt tên là lỗi thời.
:::

# 5chan

5chan là một bảng hình ảnh không có máy chủ, không có quản trị viên và được phân quyền hoàn toàn chạy trên giao thức Bitsocial. Nó tuân theo cấu trúc thư mục bảng hình ảnh quen thuộc đồng thời giới thiệu quyền sở hữu phi tập trung — bất kỳ ai cũng có thể tạo một bảng và nhiều bảng có thể cạnh tranh để giành cùng một vị trí thư mục thông qua cơ chế bỏ phiếu.

## Tải xuống

| Nền tảng           | Liên kết                         |
| ------------------ | -------------------------------- |
| Web                | [5chan.app](https://5chan.app)   |
| Máy tính để bàn    | Có sẵn cho Mac, Windows và Linux |
| Điện thoại di động | Có sẵn cho Android               |

## Bảng hoạt động như thế nào

5chan sắp xếp nội dung thành các bảng bằng cách sử dụng bố cục thư mục cổ điển (ví dụ: `/b/`, `/g/`). Không giống như bảng hình ảnh truyền thống nơi quản trị viên trung tâm kiểm soát mọi bảng, 5chan cho phép bất kỳ người dùng nào tạo và sở hữu hoàn toàn bảng của riêng họ. Khi nhiều bảng nhắm vào cùng một vị trí thư mục, chúng sẽ cạnh tranh vị trí đó thông qua biểu quyết.

### Tạo một bảng

Để tạo một bảng mới, bạn cần chạy `bitsocial-cli` dưới dạng nút ngang hàng. Điều này đảm bảo bảng của bạn được lưu trữ theo cách phi tập trung mà không cần dựa vào bất kỳ máy chủ trung tâm nào.

### Bài tập thư mục

Việc gán vị trí thư mục (bảng nào xuất hiện ở đường dẫn nào) hiện được quản lý thông qua các yêu cầu kéo GitHub tới tệp `5chan-directories.json`. Đây là quy trình tạm thời — các bản phát hành trong tương lai sẽ hỗ trợ tạo bảng trong ứng dụng và bỏ phiếu dựa trên pubsub để tự động xử lý việc gán thư mục.

## Nội bộ

Về cơ bản, 5chan sử dụng lớp máy khách giao thức Bitsocial được chia sẻ cho các tương tác mạng của mình. Ứng dụng web tại 5chan.app cũng có thể chạy nút Helia trong trình duyệt khi trình duyệt P2P được bật từ Cài đặt nâng cao, do đó người đọc có thể tải từ các thiết bị ngang hàng mà không cần cổng IPFS tập trung. Xem phần P2P của trình duyệt trong ghi chú giao thức ngang hàng.

## Liên kết

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Giấy phép**: Chỉ GPL-2.0
