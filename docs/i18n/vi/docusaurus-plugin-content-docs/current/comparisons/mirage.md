---
title: Bitsocial và Mirage
description: Mirage, một diễn đàn kiểu Reddit chạy trên blockchain Cosmos SDK riêng, so với Bitsocial và ứng dụng kiểu Reddit Seedit của nó ra sao.
---

# Bitsocial và Mirage

[Mirage](https://mirage.foundation/) là một mạng thảo luận kiểu Reddit với các cộng đồng, bài đăng dạng
luồng và lượt bình chọn. Thay vì cơ sở dữ liệu của một công ty, nó chạy trên blockchain riêng, một
chuỗi Cosmos SDK dùng đồng thuận CometBFT. Sản phẩm gần nhất của Bitsocial là [Seedit](/apps/seedit/),
một ứng dụng kiểu Reddit trên mạng Bitsocial, nên phần so sánh chủ yếu xoay quanh cách mỗi bên lưu trữ,
sở hữu và kiểm duyệt cộng đồng.

## Mirage hoạt động như thế nào

- **Nút.** Một nút Mirage là một container Docker chứa một validator, một cơ sở dữ liệu PostgreSQL, một
  bộ lập chỉ mục, một HTTP API và giao diện web. Mỗi nút cũng là một validator. Theo
  [hướng dẫn triển khai](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md),
  để chạy một nút cần một máy chủ Ubuntu trên amd64 và 10.000.000 token MIRAGE trong tài khoản của
  người vận hành.
- **Đăng bài.** Trình duyệt ký mọi hành động bằng khóa secp256k1 của người dùng, và người dùng miễn phí
  còn phải tính một proof-of-work nhỏ. Nút gói hành động vào một giao dịch trên chuỗi và trả phí.
- **Đọc dữ liệu.** Bộ lập chỉ mục của mỗi nút sao chép dữ liệu chuỗi vào cơ sở dữ liệu riêng và phục vụ
  bảng tin qua HTTP API. Các nút giữ khoảng một tuần khối, nên lịch sử bài đăng dài hạn nằm trong cơ sở
  dữ liệu của từng nút, và một nút mới khởi đầu mà không có lịch sử trước điểm đồng bộ của nó.
- **Tài khoản.** Một tài khoản là một khóa được suy ra từ cụm từ khôi phục 12 từ, và cùng cụm từ đó
  dùng được trên mọi nút. Tên người dùng được ghi trên chuỗi và là duy nhất trên toàn mạng.
- **Cộng đồng.** Mọi tên hợp lệ đều đã là một cộng đồng, và không ai sở hữu nó. Các nhóm tuyển chọn trả
  phí, mỗi nhóm tối đa mười người dùng, duy trì một chế độ xem đã kiểm duyệt của cộng đồng; người đọc
  chọn chế độ xem của một nhóm, chế độ mặc định của nút hoặc chế độ xem không kiểm duyệt. Xem
  [Câu hỏi thường gặp của Mirage](https://mirage.talk/faq).
- **Token.** Token MIRAGE dùng để trả phí thuê bao, thưởng cho tác giả và nút, và trao trọng số quản trị
  cho validator. Người thuê bao được bỏ qua proof-of-work và có giới hạn cao hơn.

## Khác biệt ở đâu

### Ai sở hữu một cộng đồng

Trong Seedit, người tạo cộng đồng giữ cặp khóa của nó, tự chạy hoặc ủy thác việc chạy nút của nó, và
kiểm duyệt nó. Trong Mirage, không ai sở hữu một cộng đồng: các nhóm tuyển chọn cạnh tranh cung cấp
những chế độ xem đã kiểm duyệt của cùng một tên, và chế độ xem mặc định là của nhóm được nhiều người
thuê bao trả phí chọn nhất.

### Kiểm soát spam

Mirage áp dụng một quy tắc cho toàn mạng: người dùng miễn phí trả bằng proof-of-work có độ khó điều
chỉnh theo lưu lượng đến, còn người thuê bao được bỏ qua. Trong Bitsocial, mỗi cộng đồng tự chọn thử
thách riêng, từ captcha đến danh sách cho phép hay thanh toán. Xem
[Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Hạ tầng

Mirage cần một blockchain. Validator đạt đồng thuận cho mọi hành động, và mỗi nút chạy cả một ngăn xếp
máy chủ đầy đủ và phải nắm giữ một lượng stake token lớn. Bitsocial không có chuỗi: một nút cộng đồng
chạy trên phần cứng phổ thông từ ứng dụng máy tính hoặc `bitsocial-cli`, và người đọc có thể giúp chia
sẻ nội dung.

### Quyền kiểm soát toàn mạng

Mirage có cơ chế quản trị onchain theo trọng số stake của validator. Cơ chế này có thể thay đổi độ khó,
giá và lượng phát hành token, đúc hoặc đốt token, và bổ nhiệm các quản trị viên mà lệnh xóa của họ được
bộ lập chỉ mục tham chiếu áp dụng cho bất kỳ bài đăng nào. Mã nguồn của chuỗi còn cho phép cơ chế quản
trị
[xóa tài khoản](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
và
[gửi token từ bất kỳ địa chỉ nào](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
Vào tháng 10 năm 2026, bốn validator tạo khối cho chuỗi, và cả bốn đều được quản lý theo các runbook
của chính dự án.

Bitsocial không có quản trị viên ở cấp giao thức. Chủ cộng đồng kiểm duyệt cộng đồng của mình và ứng
dụng tự chọn nội dung hiển thị. Xem
[Kiểm duyệt cục bộ, không phải lệnh cấm toàn cầu](/local-moderation/).

### Trình duyệt

Web client của Mirage là client HTTP của một nút: trình duyệt ký các hành động nhưng không tham gia
mạng ngang hàng. Ứng dụng Bitsocial có thể chạy nút ngang hàng ngay trong tab trình duyệt. Xem
[Ngang hàng trong trình duyệt](/browser-p2p/).

## So sánh

| Câu hỏi                       | Mirage                                                                                                      | Bitsocial                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Phân loại                     | Diễn đàn trên blockchain riêng (Cosmos SDK)                                                                 | Mạng cộng đồng ngang hàng                                                                           |
| Danh tính                     | Khóa secp256k1 từ cụm từ khôi phục 12 từ, kèm tên người dùng onchain                                        | Cặp khóa Ed25519 cho người dùng và cộng đồng                                                        |
| Nơi bài đăng nằm              | Giao dịch trên chuỗi, sau đó là cơ sở dữ liệu PostgreSQL của từng nút                                       | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                                            |
| Ai giữ cho nó luôn trực tuyến | Các nút validator, mỗi nút nắm giữ 10.000.000 MIRAGE                                                        | Nút của chủ cộng đồng cùng các seeder hỗ trợ                                                        |
| Cộng đồng                     | Tên không có chủ, với các nhóm tuyển chọn trả phí cạnh tranh nhau                                           | Thuộc sở hữu của một cặp khóa; nút của chủ sở hữu chấp nhận hoặc từ chối bài đăng                   |
| Kiểm soát spam                | Proof-of-work trên toàn mạng; người thuê bao được bỏ qua                                                    | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                                      |
| Kiểm duyệt                    | Chế độ xem của nhóm tuyển chọn, bộ lọc cá nhân, quản trị viên do cơ chế quản trị bổ nhiệm                   | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị                     |
| Kinh tế                       | Token MIRAGE cho thuê bao, phần thưởng và stake của validator                                               | Không có trong giao thức; thử thách có thể yêu cầu thanh toán hoặc token                            |
| Trình duyệt                   | Client HTTP của một nút                                                                                     | Nút ngang hàng ngay trong một tab trình duyệt bình thường                                           |
| Đánh đổi chính                | Một trạng thái chung có thứ tự và đăng ký dễ dàng, nhưng tập validator nhỏ và quyền quản trị trên toàn mạng | Không cần chuỗi hay stake, nhưng không có thứ tự toàn cục và nội dung cũ không được bảo đảm mãi mãi |
