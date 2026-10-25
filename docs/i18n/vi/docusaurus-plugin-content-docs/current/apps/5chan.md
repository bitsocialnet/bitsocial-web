---
title: 5chan
description: Bảng hình ảnh phi tập trung, không máy chủ, được xây dựng trên giao thức Bitsocial, nơi bất kỳ ai cũng có thể tạo và sở hữu bảng.
sidebar_position: 1
---

# 5chan

5chan là một bảng hình ảnh không máy chủ, không quản trị viên và phi tập trung hoàn toàn, chạy trên giao thức Bitsocial. Nó giữ nguyên cấu trúc thư mục bảng hình ảnh quen thuộc, đồng thời đưa vào quyền sở hữu phi tập trung — bất kỳ ai cũng có thể tạo một bảng, và nhiều bảng có thể cạnh tranh cùng một vị trí thư mục thông qua cơ chế bỏ phiếu.

## Tải xuống

| Nền tảng           | Liên kết                         |
| ------------------ | -------------------------------- |
| Web                | [5chan.app](https://5chan.app)   |
| Máy tính để bàn    | Có sẵn cho Mac, Windows và Linux |
| Điện thoại di động | Có sẵn cho Android               |

## Các bảng hoạt động ra sao

5chan sắp xếp nội dung thành các bảng theo bố cục thư mục cổ điển (ví dụ `/b/`, `/g/`). Khác với những bảng hình ảnh truyền thống nơi một quản trị viên trung tâm kiểm soát mọi bảng, 5chan cho phép bất kỳ người dùng nào tạo và sở hữu trọn vẹn bảng của riêng mình. Khi nhiều bảng cùng nhắm tới một vị trí thư mục, chúng cạnh tranh vị trí đó; xem [Thư mục](/directories/).

### Tạo một bảng

Để tạo một bảng mới, bạn cần chạy `bitsocial-cli` với vai trò một nút ngang hàng. Cách này bảo đảm bảng của bạn được lưu trữ theo hướng phi tập trung, không phụ thuộc vào bất kỳ máy chủ trung tâm nào.

### Gán vị trí thư mục

Các bảng ứng viên của mỗi thư mục được liệt kê trong một tệp `5chan-directories/5chan-<code>-directory.json` thuộc kho mã [bitsocialnet/lists](https://github.com/bitsocialnet/lists), và một bảng tham gia thư mục bằng một pull request vào tệp đó. 5chan cũng tổ chức một cuộc bỏ phiếu cho mỗi thư mục bằng [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): mỗi người nắm giữ 5chan Pass có một phiếu, và bỏ phiếu cho một bảng chưa có trong danh sách sẽ đề cử bảng đó. Các cuộc bỏ phiếu hiện chạy trên mạng thử nghiệm Base Sepolia, nơi kết quả được hiển thị nhưng không sắp xếp lại danh sách.

## Bên trong

Ở phía dưới, 5chan dùng lớp ứng dụng khách giao thức Bitsocial dùng chung cho mọi tương tác mạng.
Ứng dụng web tại 5chan.app mặc định chạy một nút Helia ngay trong trình duyệt, nên một tab bình
thường cũng tham gia mạng với vai trò một nút ngang hàng: nó tải các bảng từ những nút ngang hàng
khác và xuất bản qua pubsub, không có cổng IPFS tập trung nào nằm trên đường đi của nội dung. Xem
[Ngang hàng trên trình duyệt](/browser-p2p/) để biết điều đó kéo theo những gì và một nút trình
duyệt vẫn chưa làm được gì.

## Liên kết

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Giấy phép**: GPL-2.0-only
