---
title: Bitsocial và ActivityPub
description: Fediverse, với Mastodon cho microblog và Lemmy cho các cộng đồng kiểu Reddit, so với các cộng đồng ngang hàng của Bitsocial ra sao.
---

# Bitsocial và ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) là tiêu chuẩn W3C đứng sau Fediverse. Người dùng
chọn một máy chủ, gọi là instance, nơi lưu trữ tài khoản của họ, và các máy chủ trao đổi bài đăng với
nhau. [Mastodon](https://joinmastodon.org/) là phần mềm microblog nổi tiếng nhất của nó;
[Lemmy](https://join-lemmy.org/) là một trang tổng hợp liên kết kiêm diễn đàn kiểu Reddit, được xây
dựng từ các cộng đồng theo chủ đề, điều khiến nó trở thành lựa chọn trong Fediverse gần nhất với các
ứng dụng Bitsocial như [Seedit](/apps/seedit/).

## ActivityPub hoạt động như thế nào

- **Hộp thư đến và hộp thư đi.** Mỗi tài khoản có một hộp thư đến và một hộp thư đi. Máy chủ chuyển
  các hoạt động vào hộp thư đến trên máy chủ khác, và mỗi máy chủ nhận lưu bản sao riêng của những gì
  người dùng của nó theo dõi.
- **Danh tính thuộc về máy chủ.** ID tài khoản và bài đăng là địa chỉ HTTPS trên tên miền của máy chủ
  gốc. Một handle Mastodon có dạng `@user@domain`, được phân giải bằng WebFinger, và máy chủ thay mặt
  người dùng ký các thông điệp liên hợp.
- **Client.** Ứng dụng và trình duyệt chỉ giao tiếp với máy chủ của chính người dùng, qua API của máy
  chủ đó.
- **Cộng đồng Lemmy.** Một cộng đồng là một tác nhân nhóm được lưu trữ trên một instance. Người dùng
  gửi bài đăng tới cộng đồng, và cộng đồng phát lại chúng cho những người theo dõi; theo tiêu chuẩn
  diễn đàn chung
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), cộng đồng có
  thể kiểm tra bài đăng trước, thậm chí tới mức người kiểm duyệt phê duyệt thủ công.
- **Kiểm duyệt.** Kiểm duyệt mang tính cục bộ ở từng máy chủ. Quản trị viên có thể đình chỉ tài khoản,
  chặn toàn bộ máy chủ hoặc chỉ liên hợp theo danh sách cho phép; Lemmy còn có người kiểm duyệt cho
  từng cộng đồng.
- **Kiểm soát spam.** ActivityPub không định nghĩa cơ chế chống spam nào. Mastodon và Lemmy kiểm soát
  việc đăng ký bằng phê duyệt, lời mời, câu hỏi đăng ký, captcha và xác minh email, rồi dựa vào giới
  hạn tốc độ, báo cáo và kiểm duyệt.

## Khác biệt ở đâu

### Danh tính thuộc về một tên miền

Một tài khoản Fediverse thuộc về tên miền của máy chủ của nó. Mastodon có thể chuyển hướng người theo
dõi sang tài khoản mới, nhưng [bài đăng không được chuyển theo](https://docs.joinmastodon.org/user/moving/),
việc chuyển phải bắt đầu từ máy chủ cũ, và có thời gian chờ 30 ngày. Trong Bitsocial, hồ sơ và cộng
đồng là cặp khóa, nên đổi máy chủ lưu trữ hay ứng dụng không làm thay đổi danh tính. Xem
[Danh tính và quyền sở hữu cộng đồng](/identity-and-ownership/).

### Cộng đồng nằm ở đâu

Một cộng đồng Lemmy có cấu trúc gần với cộng đồng Bitsocial: bài đăng gửi tới cộng đồng, và cộng đồng
có thể kiểm tra chúng trước khi phát lại. Khác biệt là nơi nó tồn tại. Một cộng đồng Lemmy chỉ có thể
được tạo trên instance gốc của người tạo, quản trị viên instance có
[toàn quyền kiểm soát](https://join-lemmy.org/docs/users/05-censorship-resistance.html) đối với nó, và
không có cách nào được ghi trong tài liệu để chuyển nó sang instance khác. Một cộng đồng Bitsocial
chính là cặp khóa của riêng nó: chủ sở hữu có thể chạy nút của nó ở bất cứ đâu, và không có quản trị
viên máy chủ nào đứng trên nó.

### Kiểm soát spam

Máy chủ Fediverse chủ yếu chặn spam ở khâu đăng ký và kiểm duyệt về sau. Một cộng đồng Bitsocial chạy
thử thách với mọi bài đăng trước khi chấp nhận, và mỗi cộng đồng tự chọn thử thách của mình: captcha,
danh sách cho phép, thanh toán hoặc bất kỳ đoạn mã nào khác. Xem
[Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Vận hành hạ tầng

Vận hành một instance nghĩa là duy trì một máy chủ luôn hoạt động với tên miền, TLS và email. Mastodon
còn cần PostgreSQL, Redis và các tiến trình chạy nền; Lemmy nhẹ hơn, khoảng 150 MB RAM theo số liệu của
chính dự án. Mỗi instance lưu bản sao của nội dung từ xa mà người dùng của nó theo dõi. Một nút cộng
đồng Bitsocial không cần tên miền hay chứng chỉ và chạy từ ứng dụng máy tính hoặc `bitsocial-cli`.

### Máy chủ đem lại điều gì

Máy chủ Fediverse giữ toàn bộ lịch sử và phục vụ nó một cách đáng tin cậy, và Mastodon có công cụ kiểm
duyệt trưởng thành được xây dựng qua nhiều năm. Bitsocial không bảo đảm nội dung cũ tồn tại mãi mãi,
và công cụ kiểm duyệt của nó nằm trong từng ứng dụng.

## So sánh

| Câu hỏi                       | ActivityPub (Mastodon, Lemmy)                                                                      | Bitsocial                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Phân loại                     | Máy chủ liên hợp                                                                                   | Mạng cộng đồng ngang hàng                                                       |
| Danh tính                     | Tài khoản trên tên miền của một máy chủ, do máy chủ ký                                             | Cặp khóa Ed25519 cho người dùng và cộng đồng                                    |
| Nơi bài đăng nằm              | Máy chủ gốc, cùng bản sao trên mọi máy chủ theo dõi                                                | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                        |
| Ai giữ cho nó luôn trực tuyến | Quản trị viên instance                                                                             | Nút của chủ cộng đồng cùng các seeder hỗ trợ                                    |
| Cộng đồng                     | Cộng đồng Lemmy được lưu trữ trên một instance                                                     | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                   |
| Kiểm soát spam                | Rào cản khi đăng ký, giới hạn tốc độ, báo cáo và kiểm duyệt                                        | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                  |
| Kiểm duyệt                    | Quản trị viên máy chủ và người kiểm duyệt cộng đồng, cục bộ ở từng máy chủ                         | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị |
| Tên                           | Handle `@user@domain` và `!community@domain`                                                       | Tên `.bso` và `.eth` phân giải ra khóa                                          |
| Trình duyệt                   | Client của máy chủ riêng của người dùng                                                            | Nút ngang hàng ngay trong một tab trình duyệt bình thường                       |
| Đánh đổi chính                | Lịch sử đáng tin cậy và kiểm duyệt trưởng thành, nhưng danh tính và cộng đồng thuộc về một máy chủ | Không cần máy chủ hay tên miền, nhưng nội dung cũ không được bảo đảm mãi mãi    |
