---
title: Bitsocial và Quorum
description: Quorum, ứng dụng nhắn tin nhóm mã hóa đầu cuối của Quilibrium với các Space theo kiểu Discord, so với các cộng đồng ngang hàng công khai của Bitsocial ra sao.
---

# Bitsocial và Quorum

[Quorum](https://www.quorummessenger.com/) là một ứng dụng nhắn tin nhóm do Quilibrium Inc. xây
dựng trên mạng [Quilibrium](https://quilibrium.com/) của mình. Nó được tổ chức giống Discord, với
Space, kênh, vai trò và tin nhắn trực tiếp, và tin nhắn của nó được mã hóa đầu cuối. Quorum được
nhắc đến cạnh Bitsocial vì cả hai đều tự mô tả là ngang hàng và chống kiểm duyệt, với các nhóm tự
đặt ra quy tắc của mình. Hai bên nhắm tới những mục tiêu khác nhau: Quorum nhắm tới trò chuyện nhóm
riêng tư, còn Bitsocial nhắm tới các cộng đồng công khai mà ai cũng đọc được.

Quilibrium tự mô tả là một giải pháp thay thế phi tập trung cho các nền tảng đám mây: một mạng lưới
các nút lưu dữ liệu trong một siêu đồ thị (hypergraph) được mã hóa và thống nhất về trạng thái của
dữ liệu đó thông qua một cơ chế đồng thuận mà Quilibrium gọi là Proof of Meaningful Work. Các nút
kiếm được QUIL, token của mạng, dùng để trả phí sử dụng. Quorum bắt đầu từ năm 2018 với tên Howler,
một ý tưởng về giải pháp thay thế riêng tư cho Discord, và trở thành ứng dụng đầu tiên chạy chính
thức trên Quilibrium, theo
[câu chuyện của Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc., do
Cassie Heart sáng lập, phát triển giao thức và cung cấp Quorum như một trong các dịch vụ được quản lý
của mình ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Quorum hoạt động như thế nào

Các chi tiết dưới đây lấy từ mã nguồn client của Quorum, tính đến tháng 10 năm 2026:
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) cho ứng dụng web và máy tính,
và [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile).

- **Danh tính.** Danh tính chủ của người dùng là một bộ khóa Ed448, và mỗi thiết bị nhận các khóa
  X448 và Ed448 riêng. Trong trình duyệt, các khóa được bảo vệ bằng một passkey. Địa chỉ là các hàm
  băm bắt đầu bằng `Qm`, và người dùng có thể hiển thị tên người dùng từ dịch vụ tên của Quilibrium.
- **Mã hóa.** Tin nhắn trực tiếp dùng Double Ratchet giữa các thiết bị. Một Space dùng chung một
  phiên Triple Ratchet cho tất cả thành viên, và các thành viên ký tin nhắn của mình bằng khóa riêng
  cho Space đó. Mọi Space đều được mã hóa, và Quorum cho biết cơ chế môi giới tin nhắn (message
  brokering) của họ ngăn dịch vụ chuyển tiếp tin nhắn liên kết người gửi với người nhận.
- **Tham gia.** Người dùng vào Space bằng liên kết mời. Liên kết dùng một lần mang theo khóa để tham
  gia ngay trong URL; liên kết công khai lấy các khóa đó từ dịch vụ Quorum, và các Space công khai có
  thể được liệt kê trong một danh bạ có thể tìm kiếm.
- **Truyền tải.** Các client web, máy tính và di động đều kết nối qua HTTPS và một WebSocket tới một
  dịch vụ duy nhất,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Dịch vụ này chuyển tiếp tin nhắn đã mã hóa tới hộp thư đến của từng thành viên, và lưu đăng ký
  người dùng, manifest đã mã hóa của từng Space (kênh, vai trò, emoji), dữ liệu lời mời, danh bạ công
  khai và tính năng đồng bộ cài đặt đã mã hóa tùy chọn. Phần mềm nút của Quilibrium có một dịch vụ
  inbox và hub với cùng cấu trúc, nhưng cả các client lẫn tài liệu của Quilibrium đều không nói dịch
  vụ này ánh xạ vào mạng như thế nào.
- **Lịch sử.** Client của mỗi thành viên giữ bản sao riêng của Space trong bộ nhớ cục bộ. Client web
  và máy tính bổ sung lịch sử còn thiếu bằng cách nhờ một thành viên đang trực tuyến đồng bộ; client
  di động phát lại một nhật ký mà dịch vụ lưu cho từng Space, nên có thể bắt kịp ngay cả khi không có
  thành viên nào khác trực tuyến.
- **Kiểm duyệt.** Vai trò cấp quyền xóa, ghim, tắt tiếng và nhắc `@everyone`. Client của mọi thành
  viên kiểm tra chữ ký trên mỗi hành động kiểm duyệt và chỉ áp dụng nếu người ký có đúng vai trò. Chủ
  sở hữu có thể đuổi (kick) một thành viên, việc này xoay vòng khóa của Space để thành viên bị đuổi
  không đọc được tin nhắn mới. Một Space có thể bắt buộc tin nhắn phải có chữ ký hoặc cho phép thành
  viên đăng tin nhắn không ký, có thể chối bỏ (deniable).
- **Mã nguồn.** Client web và máy tính được cấp phép theo AGPL-3.0, còn client di động theo GPL-3.0.
  Client di động còn có ví tiền mã hóa, tích hợp Farcaster và Apex, một gói đăng ký trả phí được mô
  tả bên dưới.

## Khác biệt ở đâu

### Nhóm riêng tư và cộng đồng công khai

Một Space của Quorum là một nhóm thành viên: chỉ những người giữ khóa của nó mới đọc được, và muốn
tham gia cần có liên kết mời. Liên kết công khai cho phép bất kỳ ai vào, nhưng chỉ sau khi đã tham
gia. Một cộng đồng Bitsocial không có tư cách thành viên. Ai cũng có thể đọc nó, từ bất kỳ ứng dụng
nào, mà không cần tham gia, và ai cũng có thể thử đăng bài, với điều kiện vượt qua thử thách của cộng
đồng.

### Điều gì giữ một nhóm trực tuyến

Một Space của Quorum không có nút lưu trữ. Thành viên gửi tin nhắn qua dịch vụ Quorum, client của
mọi thành viên đều giữ một bản sao, và chủ sở hữu không cần trực tuyến để người khác trò chuyện. Một
cộng đồng Bitsocial nằm trên nút của chủ sở hữu, nút này chấp nhận hoặc từ chối từng bài đăng và
công bố trạng thái mới nhất của cộng đồng. Cộng đồng vẫn đọc được chừng nào các peer còn seed nó,
nhưng không thể nhận bài đăng mới khi nút của nó ngoại tuyến. Xem
[Giao thức ngang hàng](/peer-to-peer-protocol/).

### Ai thực thi quy tắc

Trong Quorum, việc thực thi diễn ra ở rìa (edge). Client của mỗi thành viên tự quyết định có áp dụng
một thao tác xóa, ghim hay tắt tiếng hay không, dựa trên vai trò của người ký, và việc đuổi thành
viên hoạt động bằng cách chuyển mọi người còn lại sang khóa mới. Trong Bitsocial, việc thực thi diễn
ra tại nút cộng đồng: một bài đăng không vượt qua thử thách hoặc quy tắc của cộng đồng sẽ không bao
giờ trở thành một phần của cộng đồng. Xem
[Kiểm duyệt cục bộ, không phải lệnh cấm toàn cầu](/local-moderation/).

### Kiểm soát spam

Quorum ngăn spam chủ yếu bằng lời mời. Liên kết dùng một lần chỉ cho một người vào, liên kết công
khai cho bất kỳ ai có nó vào, và sau đó chủ sở hữu có thể đuổi thành viên và đổi khóa; client cũng tự
giới hạn tốc độ gửi của chính nó. Danh tính Bitsocial là các cặp khóa miễn phí, nên mỗi cộng đồng
chọn một thử thách để chạy trước khi chấp nhận một bài đăng, chẳng hạn captcha, thanh toán, số dư
token hoặc danh sách cho phép. Xem [Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Client và mạng

Một ứng dụng Quorum là client của dịch vụ Quorum, do Quilibrium Inc. vận hành. Bản thân các ứng dụng
không tham gia mạng ngang hàng, nên việc truy cập một Space phụ thuộc vào endpoint duy nhất đó. Phía
sau nó, Quilibrium là một mạng riêng: vào tháng 10 năm 2026,
[trình khám phá](https://dashboard.quilibrium.com/) của mạng này hiển thị 114 peer có thể kết nối và
181 prover trên 99 shard.

Một ứng dụng web Bitsocial có thể chạy một nút libp2p ngay trong tab, lấy nội dung cộng đồng từ các
peer và đăng qua gossipsub. Việc khám phá peer đi qua các router HTTP chỉ trả về địa chỉ của nhà cung
cấp; ai cũng có thể chạy một router, và client có thể đổi router bằng cách thay đổi cấu hình. Xem
[Ngang hàng trong trình duyệt](/browser-p2p/).

### Kinh tế

Quilibrium lấy token làm cốt lõi. QUIL được các nút khai thác và dùng để trả phí mạng, còn một phiên
bản bọc (wrapped) là wQUIL lưu hành trên Ethereum. Bản thân Quorum miễn phí và không cần thanh toán
hay số điện thoại. Gói đăng ký Apex tùy chọn có giá
[5 đô la mỗi tháng](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
được thanh toán bằng wQUIL, SNAP hoặc USDC trên Ethereum và được chia giữa Quilibrium Inc. với bốn
Space do người đăng ký chọn. Bitsocial không có lớp thanh toán trong giao thức; một cộng đồng có thể
yêu cầu thanh toán hoặc token thông qua thử thách của mình.

### Tin nhắn riêng tư

Đây là chỗ Quorum mạnh hơn. Tin nhắn trực tiếp và tin nhắn trong Space được mã hóa đầu cuối với tính
bảo mật chuyển tiếp, và nội dung tin nhắn chỉ đến được dịch vụ Quorum dưới dạng bản mã. Bitsocial tập
trung vào cộng đồng công khai và chưa có tin nhắn trực tiếp tích hợp sẵn. Một bài đăng Bitsocial được
mã hóa bằng khóa của nút cộng đồng khi di chuyển qua pubsub, nhưng sau khi được chấp nhận thì nó là
công khai.

## Tình trạng dự án

Vào tháng 10 năm 2026, kho mã Quorum gọi ứng dụng web là bản beta, và trang web Quorum vẫn liệt kê
các ứng dụng trên Google Play và App Store là "sắp ra mắt". Hai client cũng khác nhau: ứng dụng di
động có các tính năng ví, Farcaster và Apex, trong khi client web và máy tính hiển thị các trang
Wallet và Farcaster là "sắp ra mắt", và hai client bắt kịp lịch sử Space theo những cách khác nhau.

Mainnet của Quilibrium đạt phiên bản 2.1 vào ngày 30 tháng 9 năm 2025, khi mạng hoạt động trở lại sau
một lần dừng ([thông báo](https://x.com/QuilibriumInc/status/1973082817236984270)). Năm 2026, nút
được viết lại bằng Rust, với chữ ký hậu lượng tử cho cơ chế đồng thuận và một giao thức truyền dẫn
(wire protocol) mà các nút cũ không hiểu được. Một số phần của tài liệu mô tả thiết kế thay vì mã
đang chạy: chúng mô tả
[định tuyến mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), nhưng
trong nút 2.1.0.25, dịch vụ mixnet là một
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
nhận tin nhắn mà không trộn chúng.

## So sánh

| Câu hỏi                | Quorum                                                                                  | Bitsocial                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Phân loại              | Ứng dụng nhắn tin nhóm mã hóa đầu cuối trên mạng Quilibrium                             | Mạng cộng đồng ngang hàng                                                                                       |
| Danh tính              | Bộ khóa chủ Ed448 cùng khóa riêng cho từng thiết bị, được bảo vệ bằng passkey           | Cặp khóa Ed25519 cho người dùng và cộng đồng                                                                    |
| Ai đọc được            | Thành viên giữ khóa của Space                                                           | Bất kỳ ai, từ bất kỳ ứng dụng nào                                                                               |
| Nơi tin nhắn nằm       | Thiết bị của từng thành viên; client di động còn phát lại nhật ký do dịch vụ Quorum lưu | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                                                        |
| Client kết nối tới đâu | Dịch vụ Quorum tại `api.quorummessenger.com`                                            | Các peer qua libp2p, kể cả từ một tab trình duyệt                                                               |
| Cộng đồng              | Space với kênh, vai trò và liên kết mời                                                 | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                                                   |
| Kiểm soát spam         | Liên kết mời, đuổi kèm đổi khóa, giới hạn tốc độ phía client                            | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                                                  |
| Kiểm duyệt             | Vai trò do client của mọi thành viên thực thi; chủ sở hữu đuổi thành viên               | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị                                 |
| Tin nhắn riêng tư      | Tin nhắn trực tiếp mã hóa đầu cuối                                                      | Cộng đồng công khai; chưa có tin nhắn trực tiếp tích hợp sẵn                                                    |
| Kinh tế                | Token mạng QUIL; gói đăng ký Apex tùy chọn 5 đô la mỗi tháng                            | Không có trong giao thức; thử thách có thể yêu cầu thanh toán hoặc token                                        |
| Đánh đổi chính         | Nhóm riêng tư, được mã hóa, nhưng mọi client đều phụ thuộc vào một dịch vụ              | Danh tính miễn phí và truy cập qua trình duyệt, nhưng không có nhắn tin riêng tư và chỉ giữ trạng thái mới nhất |
