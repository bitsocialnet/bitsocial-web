---
title: Bitsocial và mạng xã hội blockchain
description: Lens, DeSo và Steem đưa dữ liệu xã hội hoặc quy tắc lên blockchain như thế nào, và vì sao Bitsocial không dùng blockchain.
---

# Bitsocial và mạng xã hội blockchain

Lens, DeSo và Steem đều đưa hoạt động xã hội lên blockchain. Tài khoản, lượt theo dõi, bài đăng hoặc
các quy tắc xoay quanh chúng trở thành giao dịch được validator sắp thứ tự và lưu trữ. Bitsocial không
dùng blockchain: mạng xã hội không cần thứ tự toàn cục cho từng bài đăng, nên Bitsocial bỏ qua đồng
thuận, gas và staking. Xem [Giao thức ngang hàng](/peer-to-peer-protocol/) để biết lập luận đó.

## Điểm chung

- **Mỗi thao tác ghi đều có người trả tiền.** Lens thu gas, khoản mà ứng dụng có thể tài trợ; DeSo thu
  phí cho mọi hành động; Steem phân bổ quyền thực hiện hành động theo lượng token đã stake.
- **Chuỗi áp đặt một chính sách chống spam cho tất cả.** Phí, stake và chi phí tài khoản áp dụng trên
  toàn mạng thay vì do từng cộng đồng tự chọn.
- **Bản ghi onchain là vĩnh viễn.** Ứng dụng có thể ẩn nội dung, nhưng không thể xóa nó khỏi chuỗi.
- **Trình duyệt là client API.** Ứng dụng web ký giao dịch và đọc dữ liệu qua một nút, bộ lập chỉ mục
  hoặc API do người khác vận hành.

## Lens

[Lens](https://lens.xyz/) chạy trên Lens Chain, một layer 2 của Ethereum xây dựng bằng ZK Stack của
ZKsync và dùng Avail cho tính sẵn có của dữ liệu. Mask Network
[đã đảm nhận vai trò quản lý Lens từ tháng 1 năm 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Trên chuỗi:** tài khoản là hợp đồng thông minh, tên người dùng là NFT bên trong các không gian tên,
  và đồ thị, nhóm, bảng tin cùng quy tắc của chúng cũng là hợp đồng.
- **Ngoài chuỗi:** văn bản và phương tiện của bài đăng nằm trong một tệp JSON tại một URI, thường là
  trên Grove, dịch vụ lưu trữ của Lens đặt phía trước IPFS. Lượt bày tỏ cảm xúc và dấu trang do Lens API
  nắm giữ, và ứng dụng đọc dữ liệu qua API đó.
- **Spam và rào chắn:** giao dịch cần gas bằng GHO, khoản mà ứng dụng có thể tài trợ kèm giới hạn tốc
  độ. Quy tắc của bảng tin và nhóm có thể yêu cầu nắm giữ token hoặc thanh toán.
- **Vận hành chuỗi:** [L2BEAT](https://l2beat.com/scaling/projects/lens) xếp Lens Chain vào loại
  validium Stage 0 với một bên vận hành tập trung có thể từ chối đưa giao dịch vào.

## DeSo

[DeSo](https://docs.deso.org/) là một blockchain layer 1 được xây dựng cho ứng dụng xã hội. Nó chuyển
từ proof-of-work sang proof-of-stake vào tháng 7 năm 2024.

- **Trên chuỗi:** hồ sơ, bài đăng, lượt thích, lượt theo dõi và tin nhắn trực tiếp đều là giao dịch
  được mọi nút đầy đủ lưu trữ. Hình ảnh và video được lưu trữ ngoài chuỗi; nút tham chiếu dùng Google
  Cloud Storage và Cloudflare Stream.
- **Spam:** mọi hành động đều trả phí bằng DESO. Người dùng mới thường nhận DESO khởi đầu từ một nút
  sau khi xác minh số điện thoại.
- **Kiểm duyệt:** mỗi nút tự quyết định hiển thị gì bằng cách đưa vào danh sách đen hoặc danh sách xám,
  nhưng [nội dung vẫn nằm trên chuỗi](https://docs.deso.org/deso-blockchain/content-moderation).
- **Cộng đồng:** tài liệu không mô tả thành phần cơ bản nào cho cộng đồng hay diễn đàn; một "cộng đồng"
  là một bảng tin do ứng dụng tuyển chọn.
- **Chạy nút:** theo
  [hướng dẫn cho validator](https://docs.deso.org/deso-validators/run-a-validator), validator cần ít
  nhất 32 GB RAM và 200 GB ổ đĩa.

## Steem

[Steem](https://steem.com/) là một blockchain xã hội trả thưởng bằng token cho tác giả và người tuyển
chọn nội dung, với [Steemit](https://steemit.com/) là ứng dụng blog chính. Hive tách khỏi Steem vào năm
2020; theo [whitepaper của Hive](https://hive.io/whitepaper.pdf), cuộc fork diễn ra sau khi Steemit Inc.
được bán cho Justin Sun.

- **Trên chuỗi:** bài đăng văn bản, bình luận, phiếu bầu và lịch sử chỉnh sửa của chúng, được sắp thứ
  tự bởi 21 witness được bầu, cứ ba giây tạo một khối. Hình ảnh được lưu trữ ngoài chuỗi.
- **Spam:** hành động tiêu tốn Resource Credits, vốn tăng theo lượng STEEM đã stake. Tạo tài khoản tốn
  STEEM; Steemit trả khoản này cho người dùng xác minh địa chỉ email và số điện thoại.
- **Cộng đồng:** chúng là
  [các thao tác tùy chỉnh do một bộ lập chỉ mục diễn giải](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  bên ngoài cơ chế đồng thuận. Người kiểm duyệt có thể tắt tiếng bài đăng, khiến bài bị ẩn trong ứng
  dụng nhưng vẫn nằm trên chuỗi.
- **Phần thưởng:** lạm phát cấp vốn cho phần thưởng, và phiếu bầu có trọng số theo stake quyết định cách
  chia, nên những người nắm giữ lớn định hình điều gì được chú ý.

## So sánh

| Câu hỏi           | Lens                                                                                  | DeSo                                                                | Steem                                                                          | Bitsocial                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Chuỗi             | Layer 2 của Ethereum (validium ZK Stack)                                              | Layer 1 riêng, proof-of-stake                                       | Chuỗi riêng, proof-of-stake ủy quyền                                           | Không có                                                                                         |
| Nội dung bài đăng | JSON ngoài chuỗi, thường trên Grove                                                   | Văn bản trên chuỗi; phương tiện ngoài chuỗi                         | Văn bản trên chuỗi; hình ảnh ngoài chuỗi                                       | Trên nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                                    |
| Danh tính         | Tài khoản hợp đồng thông minh; NFT tên người dùng                                     | Cặp khóa với hồ sơ onchain                                          | Tài khoản chuỗi có tên với khóa phân cấp                                       | Cặp khóa Ed25519 cho người dùng và cộng đồng                                                     |
| Cộng đồng         | Nhóm và bảng tin dưới dạng hợp đồng có quy tắc                                        | Không có thành phần cơ bản cho cộng đồng                            | Cộng đồng do bộ lập chỉ mục diễn giải, bên ngoài đồng thuận                    | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                                    |
| Kiểm soát spam    | Gas (thường được tài trợ), quy tắc token hoặc thanh toán                              | Phí cho mọi hành động; tiền khởi đầu sau khi kiểm tra số điện thoại | Resource Credits từ stake; tạo tài khoản mất phí                               | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                                   |
| Kiểm duyệt        | Quản trị viên nhóm, quy tắc onchain, ẩn ở cấp API                                     | Mỗi nút tự lọc nội dung hiển thị                                    | Tắt tiếng trong cộng đồng, phiếu phản đối theo trọng số stake, bộ lọc ứng dụng | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị                  |
| Vận hành          | Bên vận hành chuỗi cùng Lens API và Grove                                             | Validator có ít nhất 32 GB RAM                                      | Các witness được bầu cùng các nút API và lập chỉ mục                           | Một nút cộng đồng trên phần cứng phổ thông, cùng các seeder hỗ trợ                               |
| Đánh đổi chính    | Quy tắc onchain lập trình được, nhưng nội dung và việc đọc phụ thuộc dịch vụ của Lens | Kho dữ liệu mở, nhưng mọi hành động đều tốn phí và tồn tại mãi mãi  | Phần thưởng tích hợp sẵn, nhưng stake định hình khả năng hiển thị và quản trị  | Không phí, không stake, nhưng không có thứ tự toàn cục và nội dung cũ không được bảo đảm mãi mãi |
