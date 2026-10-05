---
title: Bitsocial và Farcaster
description: Farcaster, với tài khoản onchain, phí thuê lưu trữ và mạng validator Snapchain, so với các cộng đồng ngang hàng của Bitsocial ra sao.
---

# Bitsocial và Farcaster

[Farcaster](https://docs.farcaster.xyz/) giữ danh tính trên blockchain và dữ liệu xã hội ở ngoài
blockchain. Tài khoản, khóa ứng dụng và khoản thanh toán lưu trữ nằm trong các hợp đồng trên OP
Mainnet, một layer 2 của Ethereum. Bài đăng, gọi là cast, cùng với lượt theo dõi và lượt bày tỏ cảm
xúc, là những thông điệp có chữ ký được lưu trữ bởi [Snapchain](https://snapchain.farcaster.xyz/), một
mạng giống blockchain đã thay thế mạng Hub trước đây của Farcaster vào năm 2025.

## Farcaster hoạt động như thế nào

- **Tài khoản.** Một tài khoản là một Farcaster ID dạng số, thuộc sở hữu của một địa chỉ Ethereum; địa
  chỉ này cũng có thể đặt một địa chỉ khôi phục. Ứng dụng đăng bài bằng khóa ứng dụng được ủy quyền và
  đăng ký onchain; khóa ứng dụng không thể chiếm quyền tài khoản.
- **Phí thuê lưu trữ.** Mỗi tài khoản thuê các đơn vị lưu trữ, hiện là 0,20 USD mỗi đơn vị mỗi năm.
  Một đơn vị thuê từ tháng 7 năm 2025 chứa được 100 cast; vượt quá mức đó, các cast cũ nhất sẽ bị xóa
  bớt. Giới hạn tốc độ tăng theo dung lượng lưu trữ đã thuê.
- **Snapchain.** Các validator sắp xếp thông điệp thành khối bằng cơ chế đồng thuận kiểu Tendermint, và
  mọi nút đầy đủ đều giữ dữ liệu của toàn mạng. Theo
  [hướng dẫn chạy nút](https://snapchain.farcaster.xyz/getting-started), mỗi nút cần khoảng 16 GB RAM
  và 2 TB dung lượng lưu trữ.
- **Tên.** Tên người dùng mặc định, gọi là fname, là miễn phí và do máy chủ tên của chính Farcaster cấp;
  máy chủ này [có thể thu hồi chúng](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames).
  Người dùng có thể dùng tên `.eth` đăng ký trên Ethereum thay thế.
- **Kênh.** Kênh theo chủ đề là một tính năng thử nghiệm của client Farcaster. Các cast trong kênh là
  dữ liệu giao thức, nhưng siêu dữ liệu kênh, lượt theo dõi kênh và việc kiểm duyệt
  [được lưu trong client](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Đọc dữ liệu.** Ứng dụng đọc dữ liệu qua một nút Snapchain do họ tự chạy hoặc qua một nhà cung cấp
  dịch vụ được quản lý, thường là Neynar.

## Khác biệt ở đâu

### Blockchain và validator

Farcaster phụ thuộc vào OP Mainnet cho tài khoản và thanh toán, và vào Snapchain, một mạng giống
blockchain, để sắp thứ tự toàn bộ dữ liệu xã hội. Tập validator của Snapchain cần được cấp phép.
Whitepaper của nó cho rằng việc kiểm duyệt (censorship) trở nên khó khăn với khoảng mười validator
phân bố toàn cầu; vào tháng 10 năm 2026,
[danh sách validator](https://snapchain.farcaster.xyz/validators) của nó nhỏ hơn thế, và phần lớn khóa
thuộc về Neynar, công ty đã
[mua lại Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) vào tháng 1 năm 2026.
Bitsocial không có chuỗi, validator hay cơ chế đồng thuận.

### Trả tiền để đăng bài

Mỗi tài khoản Farcaster đều trả phí thuê lưu trữ, và dung lượng lưu trữ giới hạn lượng lịch sử của tài
khoản mà mạng giữ lại. Trong Bitsocial, đăng bài không tốn gì ở cấp giao thức; mỗi cộng đồng tự quyết
định có yêu cầu captcha, thanh toán, token hay thứ gì khác hay không. Xem
[Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Cộng đồng

Kênh Farcaster là một tính năng của client: client lưu siêu dữ liệu của kênh và thực thi việc kiểm
duyệt kênh, nên một cast bị chặn trong kênh vẫn có thể hợp lệ trên mạng và hiển thị trong ứng dụng
khác. Trong Bitsocial, cộng đồng là đối tượng giao thức có cặp khóa riêng, và nút của cộng đồng chấp
nhận hoặc từ chối bài đăng.

### Vận hành hạ tầng

Một nút Farcaster giữ toàn bộ mạng, nên dung lượng lưu trữ của nó tăng theo mọi hoạt động; Farcaster dự
báo mức tăng sẽ tiến tới cỡ những ổ đĩa đám mây lớn nhất. Một nút cộng đồng Bitsocial chỉ giữ các cộng
đồng của chính nó và chạy trên phần cứng phổ thông.

### Trình duyệt

Một ứng dụng Farcaster trên trình duyệt là client HTTP của một nút hoặc nhà cung cấp. Một ứng dụng web
Bitsocial có thể chạy nút ngang hàng ngay trong tab. Xem
[Ngang hàng trong trình duyệt](/browser-p2p/).

## So sánh

| Câu hỏi                       | Farcaster                                                                                         | Bitsocial                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Phân loại                     | Danh tính onchain với dữ liệu xã hội do validator sắp thứ tự                                      | Mạng cộng đồng ngang hàng                                                                             |
| Danh tính                     | Farcaster ID thuộc sở hữu của một địa chỉ Ethereum, với khóa ứng dụng được ủy quyền               | Cặp khóa Ed25519 cho người dùng và cộng đồng                                                          |
| Nơi bài đăng nằm              | Snapchain, được sao chép trên mọi nút đầy đủ, trong giới hạn lưu trữ đã trả phí                   | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                                              |
| Ai giữ cho nó luôn trực tuyến | Validator Snapchain và người vận hành nút                                                         | Nút của chủ cộng đồng cùng các seeder hỗ trợ                                                          |
| Cộng đồng                     | Kênh thử nghiệm do client Farcaster quản lý                                                       | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                                         |
| Kiểm soát spam                | Phí thuê lưu trữ và giới hạn tốc độ, cùng nhãn spam ở cấp ứng dụng                                | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                                        |
| Kiểm duyệt                    | Người quản lý kênh trong client, bộ lọc ứng dụng, rủi ro kiểm duyệt ở cấp validator               | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị                       |
| Tên                           | fname miễn phí mà Farcaster có thể thu hồi, hoặc tên `.eth`                                       | Tên `.bso` và `.eth` phân giải ra khóa                                                                |
| Trình duyệt                   | Client HTTP của một nút hoặc nhà cung cấp                                                         | Nút ngang hàng ngay trong một tab trình duyệt bình thường                                             |
| Đánh đổi chính                | Một tập dữ liệu toàn cục nhất quán, nhưng phải trả phí thuê, phụ thuộc chuỗi và tập validator nhỏ | Không phí, không chuỗi, nhưng không có tập dữ liệu toàn cục và nội dung cũ không được bảo đảm mãi mãi |
