---
title: Bitsocial và Nostr
description: Mô hình dựa trên relay của Nostr so với các cộng đồng ngang hàng của Bitsocial ra sao, từ đường đi dữ liệu và danh tính đến nhóm, kiểm soát spam và kiểm duyệt.
---

# Bitsocial và Nostr

Nostr không thuộc hẳn nhóm liên hợp hay nhóm blockchain. Người dùng không được các instance cấp tài
khoản, và cũng không có chuỗi, đồng thuận, gas hay thứ tự toàn cục. Mô tả sát hơn thì Nostr là **mạng
xã hội dựa trên relay**: người dùng giữ cặp khóa, ký các sự kiện và xuất bản chúng lên relay, vốn là
những máy chủ bình thường lưu trữ và phục vụ các sự kiện đó
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Chính
[README](https://github.com/nostr-protocol/nostr) của Nostr nói rằng nó không dựa vào các kỹ thuật
ngang hàng.

Điều đó khiến Nostr gần với Bitsocial hơn so với các hệ thống liên hợp hay blockchain ở một điểm quan
trọng: danh tính mang tính mật mã và có thể mang theo. Khác biệt nằm ở lớp dữ liệu và ở việc ai là
người gác cổng.

## Nostr hoạt động như thế nào

- **Sự kiện và relay.** Mỗi bài đăng, hồ sơ hay lượt bày tỏ cảm xúc là một sự kiện JSON có chữ ký.
  Client xuất bản sự kiện lên relay qua WebSockets và đăng ký theo bộ lọc; relay lưu sự kiện và trả
  chúng về. Các relay không trao đổi với nhau.
- **Sao chép.** Người dùng thường xuất bản lên nhiều relay. Một nghiên cứu năm 2023 trên 712 relay cho
  thấy trung bình mỗi bài đăng có mặt trên 34,6 relay trong số đó
  ([Wei và Tyson](https://arxiv.org/abs/2402.05709)).
- **Tìm bài đăng của một người.** Người dùng xuất bản danh sách các relay họ ghi vào và đọc từ đó
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), và client lấy bài đăng của
  người dùng từ các relay ghi của chính người đó.
- **Danh tính.** Mỗi người dùng là một khóa secp256k1 ký bằng chữ ký Schnorr. Đặc tả không định nghĩa
  việc xoay vòng hay khôi phục khóa, nên mất khóa là mất tài khoản. Các định danh `name@domain` tùy
  chọn ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) được xác minh dựa trên một
  tệp trên máy chủ web của tên miền đó.
- **Nhóm.** Cơ chế cộng đồng được khuyến nghị là nhóm dựa trên relay
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): một relay lưu trữ nhóm, áp dụng
  quy tắc thành viên và đăng bài của nhóm trước khi chấp nhận bài đăng, và ký siêu dữ liệu của nhóm.
  Các cộng đồng cũ hơn do người kiểm duyệt phê duyệt
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) nay bị đánh dấu là không khuyến
  nghị, nhường chỗ cho NIP-29.
- **Kiểm soát spam.** Mỗi relay tự chọn cách gác cổng: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), xác thực và danh sách cho phép
  ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), thanh toán hoặc giới hạn tốc
  độ. Client bổ sung danh sách tắt tiếng và điểm tin cậy.
- **Phương tiện.** Hình ảnh và video được tải lên các máy chủ tệp HTTP riêng.

## Khác biệt ở đâu

### Ai lưu trữ và phục vụ bài đăng

Trong Nostr, relay là lớp lưu trữ và phân phối: mỗi bài đăng đều cần một máy chủ giữ cho nó trực
tuyến. Trong Bitsocial, router HTTP chỉ giúp client tìm ra các peer. Chúng không lưu bài đăng, hồ sơ,
siêu dữ liệu cộng đồng hay trạng thái kiểm duyệt; client lấy nội dung từ nút của cộng đồng và các peer
đang seed cộng đồng đó. Xem [Giao thức ngang hàng](/peer-to-peer-protocol/).

### Ai là người gác cổng

Ở Nostr, quyền gác cổng việc ghi thuộc về người vận hành relay. Ngoài các nhóm NIP-29, một khóa bị một
relay từ chối vẫn có thể xuất bản cùng sự kiện đó lên bất kỳ relay nào chấp nhận nó, và những gì người
đọc thấy phụ thuộc vào việc client của họ đọc từ relay nào. Một nhóm NIP-29 gần với cộng đồng
Bitsocial hơn: relay chủ của nhóm chấp nhận hoặc từ chối bài đăng. Dù vậy, relay vẫn quy định các vai
trò trong nhóm được làm gì, và lịch sử của nhóm vẫn gắn với relay đó trừ khi một relay khác đồng ý
tiếp quản.

Trong Bitsocial, cộng đồng là một đối tượng mật mã có cặp khóa riêng. Nút của cộng đồng chạy bất kỳ
thử thách nào mà chủ sở hữu chọn và xuất bản trạng thái đã chấp nhận vào mạng ngang hàng. Xem
[Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Vận hành hạ tầng

Một relay là một máy chủ có tên miền và điểm cuối WebSocket, và các relay phổ biến phải gánh chi phí
lưu trữ và băng thông cho những gì chúng phục vụ. Nghiên cứu năm 2023 ước tính khoảng 95% relay miễn
phí không thể trang trải chi phí bằng tiền quyên góp. Một nút cộng đồng Bitsocial chạy trên phần cứng
phổ thông, và các peer đọc một cộng đồng có thể giúp chia sẻ cộng đồng đó.

### Trình duyệt

Một web client của Nostr mở kết nối WebSocket thẳng tới các relay, nên không cần máy chủ ứng dụng. Một
ứng dụng web Bitsocial chạy một nút ngang hàng trong tab và lấy nội dung từ các peer. Xem
[Ngang hàng trong trình duyệt](/browser-p2p/).

### Nội dung cũ

Bài đăng Nostr được sao chép rộng rãi giữa các relay, điều này giúp bài cũ tồn tại lâu. Bitsocial giữ
trạng thái mới nhất của cộng đồng và không bảo đảm nội dung cũ tồn tại mãi mãi.

## So sánh

| Câu hỏi                       | Nostr                                                                                               | Bitsocial                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Phân loại                     | Giao thức dựa trên relay                                                                            | Mạng cộng đồng ngang hàng                                                       |
| Danh tính                     | Khóa người dùng secp256k1, đặc tả không có cơ chế xoay vòng khóa                                    | Cặp khóa Ed25519 cho người dùng và cộng đồng                                    |
| Nơi bài đăng nằm              | Các relay do tác giả chọn, thường là nhiều relay                                                    | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                        |
| Ai giữ cho nó luôn trực tuyến | Người vận hành relay                                                                                | Nút của chủ cộng đồng cùng các seeder hỗ trợ                                    |
| Cộng đồng                     | Nhóm do relay lưu trữ (NIP-29)                                                                      | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                   |
| Kiểm soát spam                | Chính sách của từng relay: proof-of-work, xác thực, thanh toán, danh sách cho phép, giới hạn tốc độ | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                  |
| Kiểm duyệt                    | Chính sách relay, danh sách tắt tiếng phía client, nhãn và báo cáo                                  | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị |
| Tên                           | Định danh `name@domain` tùy chọn, được kiểm tra qua HTTPS                                           | Tên `.bso` và `.eth` phân giải ra khóa                                          |
| Trình duyệt                   | Client WebSocket của các relay                                                                      | Nút ngang hàng ngay trong một tab trình duyệt bình thường                       |
| Đánh đổi chính                | Danh tính mang theo được và sao chép rộng, nhưng khả năng sẵn sàng và chính sách phụ thuộc relay    | Ít phụ thuộc relay hơn, nhưng nội dung cũ không được bảo đảm mãi mãi            |
