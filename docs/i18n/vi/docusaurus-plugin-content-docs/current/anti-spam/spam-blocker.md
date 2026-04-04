---
title: Spam Blocker
description: Dịch vụ phát hiện thư rác tập trung với tính năng chấm điểm rủi ro, thử thách OAuth và ngưỡng cấp độ có thể định cấu hình.
sidebar_position: 1
---

# Spam Blocker

:::warning Đặt tên kế thừa
Gói này ban đầu được xuất bản trong phạm vi `@plebbit`. Nó đã được đổi tên thành `@bitsocial/spam-blocker-server` và `@bitsocial/spam-blocker-challenge`. Tham chiếu đến tên cũ vẫn có thể xuất hiện trong tài liệu hoặc cơ sở mã cũ hơn.
:::

Trình chặn thư rác là một dịch vụ phát hiện thư rác tập trung nhằm đánh giá các ấn phẩm đến và ấn định điểm rủi ro. Nó bao gồm hai gói:

- **`@bitsocial/spam-blocker-server`** -- máy chủ HTTP lưu trữ các API đánh giá và thử thách.
- **`@bitsocial/spam-blocker-challenge`** -- một gói ứng dụng khách nhẹ được cộng đồng tích hợp để gửi ấn phẩm đi đánh giá.

**Mã nguồn:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Cách tính điểm rủi ro hoạt động

Mọi ấn phẩm được gửi tới điểm cuối `/evaluate` đều nhận được điểm rủi ro bằng số. Điểm số là sự kết hợp có trọng số của một số tín hiệu:

| Tín hiệu           | Mô tả                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tuổi tài khoản     | Tài khoản mới nhận được điểm rủi ro cao hơn.                                                                                                                  |
| Nghiệp chướng      | Nghiệp cộng đồng tích lũy làm giảm rủi ro.                                                                                                                    |
| Danh tiếng tác giả | Dữ liệu danh tiếng được thu thập bởi người lập chỉ mục mạng nền.                                                                                              |
| Phân tích nội dung | Chẩn đoán cấp độ văn bản (mật độ liên kết, các mẫu thư rác đã biết, v.v.).                                                                                    |
| Vận tốc            | Các bài đăng liên tiếp nhanh chóng từ cùng một tác giả sẽ làm tăng rủi ro.                                                                                    |
| Trí tuệ IP         | Định vị địa lý cấp quốc gia và tra cứu nguồn cấp dữ liệu mối đe dọa. Chỉ mã quốc gia được lưu trữ -- địa chỉ IP thô không bao giờ được chia sẻ với cộng đồng. |

## Ngưỡng cấp

Điểm rủi ro ánh xạ tới một trong bốn cấp có thể định cấu hình để xác định điều gì xảy ra tiếp theo:

1. **Tự động chấp nhận** -- điểm đủ thấp để ấn phẩm được phê duyệt mà không gặp bất kỳ thách thức nào.
2. **OAuth đủ** -- tác giả phải hoàn tất quy trình xác minh OAuth để tiếp tục.
3. **OAuth-plus-more** -- Chỉ OAuth thôi là chưa đủ; cần phải xác minh bổ sung (ví dụ: CAPTCHA).
4. **Tự động từ chối** -- điểm quá cao; ấn phẩm bị từ chối hoàn toàn.

Tất cả các giá trị ngưỡng đều có thể được cấu hình cho mỗi cộng đồng.

## Luồng thử thách

Khi một ấn phẩm rơi vào cấp độ yêu cầu xác minh, quy trình thử thách sẽ bắt đầu:

1. Trước tiên, tác giả được nhắc xác thực qua **OAuth** (GitHub, Google, Twitter và các nhà cung cấp được hỗ trợ khác).
2. Nếu chỉ OAuth là không đủ (cấp 3), **dự phòng CAPTCHA** do Cloudflare Turnstile cung cấp sẽ được hiển thị.
3. Danh tính OAuth chỉ được sử dụng để xác minh -- nó **không bao giờ được chia sẻ** với cộng đồng hoặc những người dùng khác.

## Điểm cuối API

### `POST /evaluate`

Gửi một ấn phẩm để đánh giá rủi ro. Trả về điểm rủi ro được tính toán và cấp độ thử thách được yêu cầu.

### `POST /challenge/verify`

Gửi kết quả của thử thách đã hoàn thành (mã thông báo OAuth, giải pháp CAPTCHA hoặc cả hai) để xác minh.

### `GET /iframe/:sessionId`

Trả về trang HTML có thể nhúng để hiển thị giao diện người dùng thử thách phù hợp cho phiên nhất định.

## Giới hạn tỷ lệ

Giới hạn tỷ lệ được áp dụng linh hoạt dựa trên độ tuổi và danh tiếng của tác giả. Các tác giả mới hơn hoặc có uy tín thấp hơn phải đối mặt với những giới hạn chặt chẽ hơn, trong khi các tác giả đã thành danh được hưởng những ngưỡng hào phóng hơn. Điều này ngăn chặn lũ thư rác mà không phạt những người tham gia đáng tin cậy.

## Trình lập chỉ mục mạng nền

Máy chủ chạy một trình lập chỉ mục nền liên tục thu thập dữ liệu trên mạng để xây dựng và duy trì dữ liệu danh tiếng của tác giả. Dữ liệu này được cung cấp trực tiếp vào quy trình chấm điểm rủi ro, cho phép hệ thống nhận ra những người tham gia có thiện chí lặp lại trong các cộng đồng.

## Sự riêng tư

Trình chặn thư rác được thiết kế chú trọng đến quyền riêng tư:

- Danh tính OAuth chỉ được sử dụng để xác minh thử thách và **không bao giờ được tiết lộ** cho cộng đồng.
- Địa chỉ IP được phân giải thành **chỉ mã quốc gia**; IP thô không được lưu trữ hoặc chia sẻ.

## Cơ sở dữ liệu

Máy chủ sử dụng **SQLite** (thông qua `better-sqlite3`) để duy trì cục bộ dữ liệu danh tiếng, trạng thái phiên và cấu hình.
