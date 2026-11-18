---
title: Spam Blocker
description: Dịch vụ phát hiện spam tập trung với chấm điểm rủi ro, thử thách OAuth và ngưỡng phân hạng có thể cấu hình.
sidebar_position: 1
---

# Spam Blocker

Spam Blocker là một dịch vụ phát hiện spam tập trung, có nhiệm vụ đánh giá các nội dung được gửi lên và gán cho chúng điểm rủi ro. Dịch vụ này gồm hai gói:

- **`@bitsocial/spam-blocker-server`** -- máy chủ HTTP cung cấp các API đánh giá và thử thách.
- **`@bitsocial/spam-blocker-challenge`** -- gói máy khách gọn nhẹ mà các cộng đồng tích hợp để gửi nội dung đi đánh giá.

**Mã nguồn:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Cách chấm điểm rủi ro

Mọi nội dung gửi tới điểm cuối `/evaluate` đều nhận được một điểm rủi ro dạng số. Điểm này là tổ hợp có trọng số của nhiều tín hiệu khác nhau:

| Tín hiệu           | Mô tả                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Tuổi tài khoản     | Tài khoản càng mới thì điểm rủi ro càng cao.                                                                                |
| Karma              | Karma tích lũy trong cộng đồng làm giảm rủi ro.                                                                             |
| Uy tín tác giả     | Dữ liệu uy tín do bộ lập chỉ mục mạng chạy nền thu thập.                                                                    |
| Phân tích nội dung | Các quy tắc suy đoán ở mức văn bản (mật độ liên kết, mẫu spam đã biết, v.v.).                                               |
| Tần suất đăng      | Đăng liên tiếp dồn dập từ cùng một tác giả làm tăng rủi ro.                                                                 |
| Thông tin về IP    | Định vị ở cấp quốc gia và tra cứu các nguồn dữ liệu về mối đe dọa. Địa chỉ IP thô không bao giờ được chia sẻ với cộng đồng. |

## Ngưỡng phân hạng

Điểm rủi ro được ánh xạ vào một trong bốn hạng có thể cấu hình, quyết định điều gì diễn ra tiếp theo:

1. **Tự động chấp nhận** -- điểm đủ thấp nên nội dung được duyệt mà không cần thử thách nào.
2. **OAuth là đủ** -- tác giả phải hoàn tất xác minh OAuth mới được tiếp tục.
3. **OAuth và thêm nữa** -- chỉ OAuth thì chưa đủ; cần thêm bước xác minh bổ sung (ví dụ CAPTCHA).
4. **Tự động từ chối** -- điểm quá cao; nội dung bị từ chối ngay lập tức.

Mọi giá trị ngưỡng đều có thể cấu hình riêng cho từng cộng đồng.

## Luồng thử thách

Khi một nội dung rơi vào hạng đòi hỏi xác minh, luồng thử thách bắt đầu:

1. Trước tiên, tác giả được yêu cầu xác thực qua **OAuth** (GitHub, Google, Twitter và các nhà cung cấp được hỗ trợ khác).
2. Nếu riêng OAuth là chưa đủ (hạng 3), một **CAPTCHA dự phòng** dựa trên Cloudflare Turnstile sẽ được hiển thị.
3. Danh tính OAuth chỉ dùng cho việc xác minh -- nó **không bao giờ được chia sẻ** với cộng đồng hay với người dùng khác.

## Các điểm cuối API

### `POST /evaluate`

Gửi một nội dung để đánh giá rủi ro. Trả về điểm rủi ro đã tính và hạng thử thách cần thực hiện.

### `POST /challenge/verify`

Gửi kết quả của một thử thách đã hoàn tất (token OAuth, lời giải CAPTCHA, hoặc cả hai) để xác minh.

### `GET /iframe/:sessionId`

Trả về một trang HTML có thể nhúng, hiển thị giao diện thử thách phù hợp cho phiên tương ứng.

## Giới hạn tần suất

Giới hạn tần suất được áp dụng linh hoạt dựa trên tuổi và uy tín của tác giả. Tác giả mới hoặc có uy tín thấp chịu giới hạn chặt hơn, trong khi tác giả lâu năm được hưởng ngưỡng thoáng hơn. Cách này chặn được các đợt spam ồ ạt mà không gây phiền cho những người tham gia đáng tin cậy.

## Bộ lập chỉ mục mạng chạy nền

Máy chủ chạy một bộ lập chỉ mục nền, liên tục thu thập dữ liệu trên mạng để xây dựng và duy trì dữ liệu uy tín của tác giả. Dữ liệu này được đưa thẳng vào quy trình chấm điểm rủi ro, giúp hệ thống nhận ra những người tham gia thiện chí lặp lại ở nhiều cộng đồng.

## Quyền riêng tư

Spam Blocker được thiết kế với sự chú trọng vào quyền riêng tư:

- Danh tính OAuth chỉ được dùng để xác minh thử thách và **không bao giờ bị tiết lộ** cho các cộng đồng.
- Đơn vị vận hành dịch vụ lưu địa chỉ IP thô để phát hiện lạm dụng và gửi chúng đến một nhà cung cấp thông tin IP bên thứ ba để phân loại.
- Cộng đồng chỉ nhận được mã quốc gia, mức rủi ro IP và ước tính loại kết nối, không bao giờ nhận được IP thô.

## Cơ sở dữ liệu

Máy chủ dùng **SQLite** (thông qua `better-sqlite3`) để lưu trữ cục bộ dữ liệu uy tín, trạng thái phiên và cấu hình.
