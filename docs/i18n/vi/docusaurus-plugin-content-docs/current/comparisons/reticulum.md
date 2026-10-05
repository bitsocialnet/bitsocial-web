---
title: Bitsocial và Reticulum
description: Reticulum, ngăn xếp mạng dựa trên mật mã dành cho LoRa và các đường truyền băng thông thấp khác, so với Bitsocial ra sao, và liệu Bitsocial có thể chạy trên nó hay không.
---

# Bitsocial và Reticulum

[Reticulum](https://reticulum.network/) là một ngăn xếp mạng dựa trên mật mã học, dùng để xây dựng
mạng trên bất kỳ phương tiện truyền dẫn nào đang có: sóng vô tuyến LoRa, vô tuyến gói, liên kết nối
tiếp, Wi-Fi, Ethernet, TCP, UDP hoặc I2P. Nó thường được nhắc đến cùng Bitsocial vì cả hai đều loại
bỏ công ty đứng ở giữa. Chúng làm điều đó ở những tầng khác nhau, nên bổ sung cho nhau chứ không phải
là đối thủ cạnh tranh.

## Những tầng khác nhau

Reticulum thay thế tầng mạng. Nó cung cấp cho ứng dụng các điểm cuối được mã hóa, có thể định tuyến
mà không cần địa chỉ IP, DNS, tổ chức cấp chứng chỉ hay tài khoản, và được thiết kế để vẫn hoạt động
trên những đường truyền chậm tới 5 bit mỗi giây với MTU 500 byte. Nó không định nghĩa bài đăng, cộng
đồng hay việc kiểm duyệt; các ứng dụng xây dựng bên trên sẽ bổ sung những thứ đó.

Bitsocial là một giao thức xã hội. Nó chạy trên ngăn xếp IPFS/libp2p qua các kết nối internet thông
thường, kể cả từ một tab trình duyệt, và định nghĩa cộng đồng, nội dung đăng tải cùng thử thách chống
spam riêng cho từng cộng đồng. Xem [Giao thức ngang hàng](/peer-to-peer-protocol/) và
[Ngang hàng trong trình duyệt](/browser-p2p/).

Trong ngăn xếp của Bitsocial, Reticulum sẽ nằm gần đúng ở vị trí của libp2p, chứ không phải ở vị trí
của giao thức Bitsocial.

## Reticulum hoạt động như thế nào

- **Danh tính.** Một danh tính Reticulum là một bộ khóa 512 bit: một khóa X25519 để mã hóa và một
  khóa Ed25519 để ký.
- **Đích.** Ứng dụng tạo ra các đích (destination), được định địa chỉ bằng một hàm băm SHA-256 cắt
  ngắn còn 16 byte. Gói tin không mang địa chỉ nguồn.
- **Thông báo.** Một đích trở nên có thể liên lạc được bằng cách gửi một thông báo (announce). Các nút
  trung chuyển chuyển tiếp thông báo đó và ghi nhớ bước nhảy kế tiếp để quay về, nên không nút nào cần
  bản đồ của toàn bộ mạng.
- **Mã hóa.** Lưu lượng được mã hóa theo mặc định, với khóa tạm thời và tính bảo mật chuyển tiếp.
- **LXMF.** Tầng nhắn tin [LXMF](https://github.com/markqvist/LXMF) bổ sung tin nhắn có chữ ký, gửi
  trực tiếp, và lưu rồi chuyển tiếp qua các nút lan truyền cho những người nhận đang ngoại tuyến.

Các ứng dụng được xây dựng theo cách này gồm [Sideband](https://github.com/markqvist/Sideband) để
nhắn tin và [Nomad Network](https://github.com/markqvist/NomadNet) để nhắn tin và lưu trữ trang. Sách
hướng dẫn Reticulum duy trì một
[danh sách chương trình](https://reticulum.network/manual/software.html).

## So sánh

| Câu hỏi             | Reticulum                                                                                                       | Bitsocial                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Nó là gì            | Ngăn xếp mạng                                                                                                   | Giao thức xã hội ngang hàng và các ứng dụng                                                                 |
| Được thiết kế cho   | Mọi phương tiện truyền dẫn, kể cả những liên kết vô tuyến chậm                                                  | Kết nối internet, kể cả tab trình duyệt                                                                     |
| Danh tính           | Bộ khóa X25519 và Ed25519                                                                                       | Cặp khóa Ed25519 cho người dùng và cộng đồng                                                                |
| Địa chỉ             | Hàm băm của một danh tính và tên ứng dụng                                                                       | Hàm băm khóa công khai của một cộng đồng                                                                    |
| Tìm một peer        | Thông báo được các nút trung chuyển lan truyền                                                                  | Router HTTP trả về các peer cung cấp                                                                        |
| Tính năng xã hội    | Do các ứng dụng như Nomad Network bổ sung                                                                       | Cộng đồng, bài đăng, trả lời và kiểm duyệt nằm ngay trong giao thức                                         |
| Kiểm soát spam      | Giới hạn tốc độ thông báo theo từng giao diện; tem proof-of-work của LXMF mà người nhận hoặc nút có thể yêu cầu | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                                              |
| Gửi khi ngoại tuyến | Các nút lan truyền LXMF lưu và chuyển tiếp tin nhắn                                                             | Các peer tiếp tục phục vụ trạng thái mới nhất của cộng đồng; đăng bài cần nút của cộng đồng đang trực tuyến |

## Bitsocial có thể chạy trên Reticulum không?

Hiện tại thì chưa. Bitsocial không có tầng truyền tải Reticulum, và mô hình dữ liệu của nó giả định
băng thông internet: một client lấy siêu dữ liệu cộng đồng và nội dung bài đăng từ các peer và trao
đổi tin nhắn pubsub, điều vốn rất khó khớp với những đường truyền được xây dựng quanh các gói 500 byte
và thông lượng tính bằng bit hoặc kilobit mỗi giây.

Hướng đi thực tế hẹp hơn nhiều: một client hoạt động qua mạng mesh cục bộ khi bị ngắt kết nối, rồi
đồng bộ với mạng Bitsocial rộng hơn khi có thể liên lạc với một peer hoặc cổng có truy cập internet.
Đó sẽ là một client và một cầu nối mới chứ không phải một thay đổi đối với giao thức, và nó không nằm
trong lộ trình hiện tại.

## Dành cho nhà phát triển

Reticulum được phát hành theo
[Giấy phép Reticulum](https://reticulum.network/manual/license.html): các điều khoản kiểu MIT cộng
thêm hai hạn chế. Phần mềm không được dùng trong các hệ thống được thiết kế để gây hại cho con người,
hoặc để tạo bộ dữ liệu huấn luyện AI hay học máy. Hãy đọc giấy phép này trước khi đóng gói mã
Reticulum vào một ứng dụng Bitsocial.

Bản triển khai tham chiếu được [viết bằng Python](https://github.com/markqvist/Reticulum). Những người
duy trì Reticulum cảnh báo rằng một số bản port không chính thức của Reticulum và LXMF được tạo bằng
máy và mang những tuyên bố giấy phép mà họ coi là vô hiệu, vì vậy hãy ưu tiên bản triển khai tham
chiếu hoặc các chương trình được liệt kê trong sách hướng dẫn.
