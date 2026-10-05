---
title: Bitsocial và Bluesky
description: Bluesky và AT Protocol, với máy chủ dữ liệu cá nhân, relay và AppView, so với các cộng đồng ngang hàng của Bitsocial ra sao.
---

# Bitsocial và Bluesky

[Bluesky](https://bsky.app/) là một ứng dụng microblog xây dựng trên
[AT Protocol](https://atproto.com/), giao thức do Bluesky Social PBC thiết kế. Giao thức này chia một
mạng xã hội thành các dịch vụ riêng biệt: máy chủ dữ liệu cá nhân lưu trữ tài khoản, relay gom chúng
thành một luồng duy nhất, và AppView lập chỉ mục luồng đó thành các dòng thời gian và chuỗi thảo luận
mà mọi người nhìn thấy. Tài liệu của nó mô tả dữ liệu tài khoản được lưu trên các máy chủ lưu trữ,
"trái ngược với mô hình ngang hàng" ([tổng quan](https://atproto.com/guides/overview)).

## AT Protocol hoạt động như thế nào

- **Kho dữ liệu trên máy chủ.** Mỗi bài đăng, lượt thích hay lượt theo dõi là một bản ghi trong kho dữ
  liệu có chữ ký của tác giả, được lưu trữ trên một máy chủ dữ liệu cá nhân (PDS). Bluesky vận hành các
  máy chủ mặc định, và bất kỳ ai cũng có thể tự lưu trữ máy chủ riêng.
- **Relay.** Relay đăng ký theo dõi mọi PDS và phát lại các thay đổi thành một luồng duy nhất, gọi là
  firehose. Từ một bản cập nhật giao thức năm 2025, chúng không còn lưu trữ mọi kho dữ liệu, nhờ đó chi
  phí vận hành rẻ hơn nhiều ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView.** Một AppView lập chỉ mục toàn bộ firehose và phục vụ dòng thời gian, chuỗi trả lời đầy
  đủ, số đếm và tìm kiếm. Đây là phần tốn tài nguyên nhất của mạng.
- **Danh tính.** Một tài khoản là một DID: thường là `did:plc`, được đăng ký trong một thư mục toàn cầu
  duy nhất, hoặc `did:web`, gắn với một tên miền. Tài liệu DID liệt kê handle, khóa ký và máy chủ hiện
  tại của tài khoản. PDS giữ khóa ký; `did:plc` còn cho phép người dùng giữ khóa xoay vòng để có thể
  chuyển đi mà không cần máy chủ cũ hỗ trợ
  ([hướng dẫn về danh tính](https://atproto.com/guides/identity)).
- **Handle.** Handle là tên DNS, chẳng hạn `alice.bsky.social` hoặc một tên miền người dùng sở hữu,
  được xác minh đối chiếu với DID.
- **Kiểm duyệt.** Lưu trữ và phạm vi tiếp cận là hai lớp riêng biệt. Bất kỳ ai cũng có thể chạy một
  dịch vụ gắn nhãn và người dùng có thể xếp chồng nhiều dịch vụ
  ([hướng dẫn kiểm duyệt](https://atproto.com/guides/moderation)), nhưng ứng dụng Bluesky luôn áp dụng
  cơ chế kiểm duyệt riêng của Bluesky. Tác giả có thể giới hạn ai được trả lời bài đăng của mình và ẩn
  các câu trả lời.

## Khác biệt ở đâu

### Máy chủ hay peer

Dữ liệu của Bluesky nằm trên máy chủ: một PDS lưu trữ mỗi tài khoản, relay chuyển tải firehose, và
AppView phục vụ những gì client hiển thị. Trình duyệt là một client HTTP của các dịch vụ đó, không bao
giờ là một peer. Trong Bitsocial, nút của cộng đồng và các peer đọc cộng đồng đó phục vụ nội dung, và
một ứng dụng web có thể chạy nút ngang hàng của riêng mình. Xem
[Ngang hàng trong trình duyệt](/browser-p2p/).

### Góc nhìn toàn cục hay cộng đồng

AT Protocol được thiết kế cho một góc nhìn toàn cục duy nhất: AppView thấy mọi câu trả lời, nên chuỗi
thảo luận và tìm kiếm đều đầy đủ. Bitsocial không có chỉ mục toàn cục; mỗi cộng đồng tự xuất bản trạng
thái của mình, và ứng dụng xây dựng tính năng khám phá dựa trên đó. Xem
[Khám phá nội dung](/content-discovery/).

Hiện Bluesky chưa có đối tượng cộng đồng cho bài đăng công khai. Vào tháng 6 năm 2026, Bluesky
[công bố cộng đồng tích hợp sẵn](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k), trong đó
việc đăng bài cần được phê duyệt ở một số mức riêng tư; đến tháng 10 năm 2026, tính năng này vẫn chưa
ra mắt. Trong Bitsocial, cộng đồng là đối tượng cốt lõi, và nút của cộng đồng chấp nhận hoặc từ chối
bài đăng.

### Kiểm soát spam

Bluesky xử lý spam bằng giới hạn tốc độ trên máy chủ của mình, giới hạn đối với máy chủ lưu trữ mới ở
relay, phát hiện tự động, xem xét thủ công và nhãn, và tác giả có thể hạn chế trả lời. Không có cổng
nào ở cấp cộng đồng quyết định một bài đăng phải vượt qua điều gì trước khi được chấp nhận. Trong
Bitsocial, mỗi cộng đồng tự chọn thử thách riêng. Xem
[Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Ai giữ khóa

Các tài khoản trên máy chủ của chính Bluesky đăng nhập bằng mật khẩu, và các máy chủ đó giữ khóa ký của
họ theo hình thức lưu ký ([Kleppmann và cộng sự](https://arxiv.org/abs/2402.03239)). Theo một kỹ sư
giao thức của Bluesky,
[hầu hết tài khoản không có khóa xoay vòng được kiểm soát độc lập](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Một danh tính Bitsocial là cặp khóa do ứng dụng của người dùng tạo ra và nắm giữ.

### Vận hành hạ tầng

Một máy chủ cá nhân rất rẻ: [PDS tham chiếu](https://github.com/bluesky-social/pds) khuyến nghị 1 GB
RAM cho tối đa 20 người dùng. Một AppView độc lập cho toàn mạng là một dự án lớn; một AppView được xây
dựng năm 2025 [tốn khoảng 200 đô la mỗi tháng](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), chủ yếu
cho 16 TB dung lượng lưu trữ. Bitsocial không có chỉ mục toàn cục nào cần sao chép, và một nút cộng
đồng chạy trên phần cứng phổ thông.

## So sánh

| Câu hỏi                       | Bluesky (AT Protocol)                                                                 | Bitsocial                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Phân loại                     | Máy chủ liên hợp với một chỉ mục toàn cục                                             | Mạng cộng đồng ngang hàng                                                        |
| Danh tính                     | DID, với khóa ký thường do máy chủ giữ                                                | Cặp khóa Ed25519 cho người dùng và cộng đồng                                     |
| Nơi bài đăng nằm              | Kho dữ liệu của tác giả trên một máy chủ dữ liệu cá nhân                              | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                         |
| Ai giữ cho nó luôn trực tuyến | Máy chủ PDS, relay và AppView, mặc định do Bluesky vận hành                           | Nút của chủ cộng đồng cùng các seeder hỗ trợ                                     |
| Cộng đồng                     | Chưa có cho bài đăng công khai (đã công bố năm 2026)                                  | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                    |
| Kiểm soát spam                | Giới hạn tốc độ trên máy chủ, phát hiện tự động, nhãn, kiểm soát trả lời              | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                   |
| Kiểm duyệt                    | Dịch vụ gắn nhãn xếp chồng được; ứng dụng Bluesky luôn áp dụng kiểm duyệt của Bluesky | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị  |
| Tên                           | Handle DNS được xác minh đối chiếu với DID                                            | Tên `.bso` và `.eth` phân giải ra khóa                                           |
| Trình duyệt                   | Client HTTP của một PDS và một AppView                                                | Nút ngang hàng ngay trong một tab trình duyệt bình thường                        |
| Đánh đổi chính                | Chuỗi thảo luận và tìm kiếm toàn cục đầy đủ, nhưng việc tổng hợp cần máy chủ lớn      | Không có chỉ mục toàn cục nặng nề, nhưng cũng không có góc nhìn đầy đủ toàn mạng |
