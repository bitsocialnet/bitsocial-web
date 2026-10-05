---
title: Bitsocial và Lapis Net
description: Lapis Net, giao thức xã hội ngang hàng viết bằng Kotlin với điểm tin cậy riêng cho từng người xem và khả năng hiển thị được bảo chứng bằng Bitcoin, so với Bitsocial ra sao.
---

# Bitsocial và Lapis Net

[Lapis Net](https://net.lapisproject.dev/) là một giao thức mạng xã hội ngang hàng viết bằng Kotlin cho
JVM. Nó độc lập đi đến những nền tảng gần với Bitsocial: danh tính dựa trên cặp khóa, lưu trữ nội dung
kiểu IPFS và libp2p gossipsub. Hai bên khác nhau ở chỗ đặt việc lọc spam và tuyển chọn nội dung ở đâu.
Lapis cho mỗi người xem một đồ thị tin cậy riêng và để các khoản thanh toán Bitcoin và Lightning nâng
khả năng hiển thị; Bitsocial để mỗi cộng đồng quyết định nội dung nào được phép đăng.

Lapis là một bản mẫu chạy được. Theo [kho mã](https://github.com/lapisproject-dev/Lapis-Net) của nó,
vào tháng 10 năm 2026 nó chưa có mạng công khai, và việc kết nối hai nút là một bước thủ công.

## Lapis hoạt động như thế nào

- **Danh tính.** Mỗi danh tính là một cặp khóa secp256k1, tương thích với khóa Bitcoin, kèm một khóa
  Ed25519 gắn với nó để làm peer ID của libp2p.
- **Lưu trữ và lan truyền.** Nội dung được lưu bằng Nabu, một bản triển khai IPFS trên libp2p (DHT và
  Bitswap), và được lan truyền bằng libp2p gossipsub.
- **Chấm điểm.** Bốn loại điểm tùy chọn nằm trên một lõi giữ trung lập về việc tuyển chọn nội dung:
  - Veritas, mạng lưới tin cậy được tính từ đồ thị tin cậy của chính từng người xem
  - Virtus, khả năng hiển thị được bảo chứng bằng bằng chứng thanh toán onchain hoặc Lightning, giảm
    dần theo thời gian
  - Karma, lượt thích miễn phí có trọng số theo Veritas
  - Madli, điểm uy tín mà các nút lưu về hành vi của nhau
- **Nhắn tin.** Tin nhắn trực tiếp mã hóa đầu cuối, cuộc gọi thoại một-một và một hệ thống tin nhắn bất
  đồng bộ giống email là một phần của dự án.
- **Client.** Mỗi người dùng chạy một nút JVM. Client tham chiếu là giao diện web do chính nút cục bộ
  đó phục vụ.

## Khác biệt ở đâu

### Ai lọc spam

Lapis lọc ở phía người xem. Nội dung lan truyền, rồi đồ thị tin cậy của từng người xem và quy tắc thanh
toán của ứng dụng họ dùng quyết định nội dung nào nổi lên. Bitsocial lọc ở cấp cộng đồng: bài đăng phải
vượt qua thử thách của cộng đồng trước khi nút cộng đồng chấp nhận nó, nên spam bị từ chối không bao
giờ trở thành một phần của cộng đồng. Xem [Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Ai nắm quyền

Trong Lapis, mỗi người xem quyết định tin ai, và bên vận hành mỗi ứng dụng quyết định cách hiển thị trả
phí hoạt động trong ứng dụng đó. Trong Bitsocial, chủ cộng đồng đặt quy tắc cho riêng cộng đồng đó, và
ứng dụng tự chọn nội dung hiển thị. Cả hai đều không có quản trị viên ở cấp giao thức.

### Kinh tế

Lapis tích hợp bằng chứng thanh toán Bitcoin và Lightning vào điểm hiển thị. Bitsocial không có lớp
thanh toán trong giao thức; một cộng đồng có thể yêu cầu thanh toán hoặc token thông qua thử thách của
mình.

### Trình duyệt

Ứng dụng Bitsocial có thể chạy nút ngang hàng ngay trong một tab trình duyệt bình thường. Xem
[Ngang hàng trong trình duyệt](/browser-p2p/). Giao diện trình duyệt của Lapis là một trang cục bộ do
nút JVM của người dùng phục vụ.

### Phạm vi

Lapis tích hợp tin nhắn trực tiếp, cuộc gọi thoại và thư. Bitsocial tập trung vào cộng đồng công khai
và chưa có tin nhắn trực tiếp tích hợp sẵn.

## So sánh

| Câu hỏi          | Lapis Net                                                                                    | Bitsocial                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Phân loại        | Giao thức xã hội ngang hàng (bản mẫu)                                                        | Mạng cộng đồng ngang hàng                                                                             |
| Danh tính        | Cặp khóa secp256k1 kèm peer ID Ed25519 được gắn                                              | Cặp khóa Ed25519 cho người dùng và cộng đồng                                                          |
| Nơi bài đăng nằm | Lưu trữ Nabu (IPFS trên libp2p) trên các nút tham gia                                        | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                                              |
| Cộng đồng        | Không có đối tượng cộng đồng; việc tuyển chọn diễn ra theo từng người xem và từng ứng dụng   | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                                         |
| Kiểm soát spam   | Đồ thị tin cậy của người xem, hiển thị trả phí, tiền đặt cọc Lightning cho tin nhắn đầu tiên | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                                        |
| Kiểm duyệt       | Đồ thị tin cậy của từng người xem; bên vận hành ứng dụng đặt quy tắc hiển thị trả phí        | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị                       |
| Kinh tế          | Bằng chứng thanh toán Bitcoin và Lightning trong việc chấm điểm                              | Không có trong giao thức; thử thách có thể yêu cầu thanh toán hoặc token                              |
| Trình duyệt      | Giao diện web cục bộ do một nút JVM phục vụ                                                  | Nút ngang hàng ngay trong một tab trình duyệt bình thường                                             |
| Mạng             | Bản mẫu chưa có mạng công khai                                                               | Mạng đang hoạt động với các ứng dụng như [5chan](/apps/5chan/) và [Seedit](/apps/seedit/)             |
| Đánh đổi chính   | Hệ thống uy tín và nhắn tin tích hợp phong phú, nhưng chưa có mạng công khai                 | Lõi nhỏ hơn và chạy được trong trình duyệt, nhưng không có uy tín hay tin nhắn trực tiếp tích hợp sẵn |

## Chúng có thể hoạt động cùng nhau không?

Thử thách của Bitsocial là mã tùy ý, nên một điểm tin cậy kiểu Lapis cũng có thể trở thành một thử
thách. Thử thách `whitelist` tích hợp sẵn đã có thể đọc danh sách địa chỉ được phép từ URL. Một dịch vụ
công bố các địa chỉ Bitsocial mà một đồ thị Veritas tin tưởng có thể cho phép những tác giả đó bỏ qua
CAPTCHA trong một cộng đồng. Điều đó cần một cách liên kết danh tính Lapis với địa chỉ Bitsocial, và
hiện chưa có thứ gì như vậy.
