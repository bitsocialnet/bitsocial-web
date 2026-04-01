---
title: Bot Telegram
description: Các bot cung cấp dữ liệu theo dõi danh sách cộng đồng Bitsocial và chuyển tiếp bài đăng tới các kênh Telegram.
sidebar_position: 3
---

# Bot Telegram

Các bot Bitsocial Telegram giám sát danh sách cộng đồng khách hàng trên mạng Bitsocial và tự động chuyển tiếp các bài đăng mới vào các kênh Telegram. Mỗi tin nhắn được chuyển tiếp bao gồm các nút nội tuyến liên kết trở lại bài đăng gốc trên 5chan và Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bot](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bot có sẵn

| Bot                          | Trạng thái      | Mô tả                                                                           |
| ---------------------------- | --------------- | ------------------------------------------------------------------------------- |
| **Nguồn cấp dữ liệu 5chan**  | Đang hoạt động  | Giám sát tất cả các thư mục 5chan và chuyển tiếp các bài đăng mới tới Telegram. |
| **Nguồn cấp dữ liệu Seedit** | Đã lên kế hoạch | Sẽ cung cấp chức năng tương tự cho cộng đồng Seedit.                            |

## Cài đặt

### Điều kiện tiên quyết

- Node.js
- Sợi
- Mã thông báo bot Telegram (tạo một mã thông qua [cha bot](https://t.me/BotFather))

### Cài đặt

Sao chép kho lưu trữ và cài đặt phụ thuộc:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Cấu hình

Tạo tệp `.env` trong thư mục gốc của dự án bằng mã thông báo bot của bạn:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Đang chạy

Khởi động bot sau khi định cấu hình môi trường của bạn:

```bash
yarn start
```

## Định dạng bài đăng

Khi bot chuyển tiếp một bài đăng tới Telegram, nó sẽ bao gồm hai nút nội tuyến:

- **Xem trên 5chan** -- Mở bài đăng trong ứng dụng khách web 5chan.
- **Xem trên Seedit** -- Mở bài đăng trong ứng dụng web Seedit.

Điều này cho phép người đăng ký Telegram chuyển thẳng đến chuỗi thảo luận đầy đủ trên bất kỳ ứng dụng khách nào họ thích.
