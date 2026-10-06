---
title: Bitsocial và Secure Scuttlebutt
description: Secure Scuttlebutt (SSB) và ứng dụng Manyverse của nó so với Bitsocial ra sao, từ feed chỉ ghi nối và sao chép theo đồ thị theo dõi đến cộng đồng, kiểm soát spam và đồng bộ ngoại tuyến.
---

# Bitsocial và Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) là một giao thức xã hội ngang hàng do Dominic
Tarr tạo ra năm 2014. [Manyverse](https://www.manyver.se/) là ứng dụng nổi tiếng nhất của nó, có
trên Android, iOS và máy tính; [Patchwork](https://github.com/ssbc/patchwork) từng là client máy
tính chính trước khi bị lưu trữ (archived). Trong các hệ thống được so sánh trong tài liệu này, SSB
gần với Bitsocial nhất về tinh thần: không có máy chủ trên đường đi dữ liệu, không có blockchain,
không có thứ tự toàn cục, và dùng khóa Ed25519 làm danh tính. Hai bên đã có những lựa chọn trái
ngược về việc mỗi peer lưu trữ gì và spam bị chặn ở đâu.

## Scuttlebutt hoạt động như thế nào

- **Feed.** Mỗi danh tính là một cặp khóa Ed25519, được viết dưới dạng `@<public key>.ed25519`. Mọi
  thứ người dùng xuất bản đều đi vào feed của chính họ, một nhật ký chỉ ghi nối (append-only), trong
  đó mỗi thông điệp có chữ ký mang một số thứ tự và hàm băm của thông điệp trước đó. Theo
  [hướng dẫn giao thức](https://ssbc.github.io/scuttlebutt-protocol-guide/), một thông điệp đã đăng
  thì không thể sửa đổi.
- **Sao chép.** Các peer sao chép toàn bộ feed chứ không phải từng bài đăng riêng lẻ, và đồ thị theo
  dõi quyết định peer giữ những feed nào. Chẳng hạn, Patchwork hiển thị các feed cách tối đa hai
  bước nhảy và sao chép các feed cách tối đa ba bước nhảy. Với epidemic broadcast trees (EBT), các
  peer so sánh số thứ tự mới nhất mà mình đang có cho từng feed và chỉ gửi phần còn thiếu.
- **Kết nối.** Các peer xác thực bằng secret handshake (bắt tay bí mật) và mã hóa lưu lượng bằng box
  stream. Quá trình bắt tay gắn với một mã định danh mạng, nên các peer trên một mạng SSB riêng có
  mã định danh khác không thể kết nối vào mạng chính.
- **Tìm peer.** Các peer tự thông báo sự hiện diện trên mạng cục bộ qua UDP broadcast và đồng bộ qua
  LAN; Manyverse còn đồng bộ qua Bluetooth. Trên internet, người dùng dựa vào **pubs**, những peer
  luôn trực tuyến sẽ theo dõi lại bạn sau khi bạn dùng mã mời, rồi lưu trữ và phục vụ feed của bạn,
  và dựa vào **rooms**, vốn không lưu feed nào nhưng tạo đường hầm kết nối giữa các thành viên của
  chúng.
- **Blob và tin nhắn riêng tư.** Hình ảnh và các tệp khác là những blob định địa chỉ theo nội dung
  được lấy từ các peer, với giới hạn kích thước mặc định 5 MB trong các bản triển khai hiện tại. Tin
  nhắn riêng tư được mã hóa cho tối đa bảy người nhận và được xuất bản dưới dạng bản mã trong feed
  của tác giả.

## Khác biệt ở đâu

### Một peer lưu trữ gì

Một peer SSB giữ bản sao đầy đủ của mọi feed trong phạm vi sao chép của nó, tính từ thông điệp đầu
tiên của từng feed, và phục vụ các feed đó cho người khác. Đó là điều giúp SSB hoạt động ngoại
tuyến, nhưng dung lượng lưu trữ tăng theo mỗi thông điệp trong phạm vi, và một bản cài đặt mới phải
tải các feed đó về trước khi hiển thị được nhiều thứ. Một client Bitsocial lấy trạng thái mới nhất
của các cộng đồng mà nó mở từ nút của cộng đồng và các peer đang seed cộng đồng đó, và mạng chỉ giữ
trạng thái mới nhất ấy. Xem [Giao thức ngang hàng](/peer-to-peer-protocol/).

### Xóa và thiết bị

Vì feed là một chuỗi băm, SSB không có cơ chế xóa trên toàn mạng: một peer có thể bỏ thông điệp khỏi
cơ sở dữ liệu của chính mình nhưng không thể rút chúng khỏi bản sao của các peer khác. Đăng bằng
cùng một khóa từ hai thiết bị, hoặc từ một bản sao lưu đã khôi phục, sẽ làm feed bị rẽ nhánh (fork),
nên cách làm thường thấy là mỗi thiết bị một danh tính. PZP, giao thức kế nhiệm do nhóm Manyverse
phát triển, liệt kê việc xóa, nhiều thiết bị trên một tài khoản và feed chịu được rẽ nhánh trong số
những thay đổi chính so với SSB ([bài ra mắt](https://www.manyver.se/blog/2024-07-03/)). Một nút
cộng đồng Bitsocial xuất bản phiên bản mới của trạng thái cộng đồng ở mỗi lần cập nhật, nên nội dung
mà người kiểm duyệt của cộng đồng gỡ bỏ sẽ biến mất khỏi trạng thái mới nhất.

### Bạn có thể nghe được ai

Phạm vi sao chép của SSB đồng thời là bộ lọc spam của nó. Feed của một người lạ chỉ đến được với bạn
nếu có ai đó trong phạm vi bước nhảy của bạn theo dõi người đó, và chặn một feed sẽ khiến nút của
bạn ngừng sao chép feed đó. Spam bị giữ ở ngoài, nhưng người mới cũng vậy cho đến khi có ai đó theo
dõi họ. Bitsocial cho phép bất kỳ ai đăng vào một cộng đồng, và nút của cộng đồng quyết định thông
qua thử thách của mình xem bài đăng có được chấp nhận hay không. Xem
[Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Cộng đồng

SSB không có đối tượng cộng đồng. Kênh và hashtag là nhãn gắn trên từng bài đăng riêng lẻ, các trả
lời trong một chuỗi thảo luận nằm trong feed của những người viết chúng, và bạn thấy được bao nhiêu
phần của chuỗi thảo luận tùy thuộc vào việc nút của bạn có những feed nào trong số đó. Rooms có thể
có người kiểm duyệt và danh sách thành viên, nhưng chúng kiểm soát ai được kết nối qua room, chứ
không kiểm soát nội dung được xuất bản. Một cộng đồng Bitsocial là một đối tượng hạng nhất có cặp
khóa, quy tắc, người kiểm duyệt và thử thách riêng.

### Hạ tầng

Cả hai đều giữ máy chủ nằm ngoài đường đi dữ liệu, và cả hai đều dựa vào các thành phần trợ giúp.
Pubs là thứ gần nhất với một dịch vụ hosting mà SSB có: chúng lưu trữ và phục vụ feed của tất cả
những người mà chúng theo dõi. Rooms gần với router HTTP của Bitsocial hơn vì cả hai đều không lưu
nội dung, nhưng một room chuyển tiếp kết nối giữa các thành viên của nó, còn router chỉ trả về địa
chỉ của nhà cung cấp và không tham gia vào việc truyền dữ liệu. Giống như một peer SSB, một nút cộng
đồng Bitsocial chạy trên phần cứng phổ thông, và nó phải trực tuyến để chấp nhận bài đăng mới.

### Ngoại tuyến và mạng cục bộ

Đây là điểm SSB mạnh hơn. Hai peer SSB trên cùng một mạng Wi-Fi, hoặc qua Bluetooth trong Manyverse,
có thể đồng bộ mà không cần kết nối internet, và mọi thứ đã được sao chép vẫn đọc được khi ngoại
tuyến. Mục tiêu chính được Manyverse công bố là làm cho mạng xã hội không phụ thuộc vào kết nối
internet. Bitsocial cần kết nối internet để tìm peer và để đăng bài.

### Trình duyệt

Các ứng dụng SSB chính đi kèm một nút SSB đầy đủ: Manyverse đóng gói một nút trong ứng dụng di động
và máy tính của mình. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) từng chạy SSB
bên trong trình duyệt với cơ chế sao chép một phần và kết nối qua rooms, và đã bị lưu trữ vào năm 2022.
Ứng dụng Bitsocial chạy một nút ngang hàng trong một tab trình duyệt bình thường. Xem
[Ngang hàng trong trình duyệt](/browser-p2p/).

### Tin nhắn riêng tư

SSB tích hợp sẵn tin nhắn riêng tư được mã hóa. Bitsocial tập trung vào cộng đồng công khai và chưa
có tin nhắn trực tiếp tích hợp sẵn.

## Tình trạng dự án

André Staltz, người xây dựng Manyverse, đã rời khỏi SSB, Manyverse và giao thức kế nhiệm dự kiến của
chúng vào tháng 4 năm 2024
([bản cập nhật cuối cùng của anh](https://www.manyver.se/blog/2024-04-05/)). Vào tháng 7 năm 2024,
Jacob Karlsson ra mắt giao thức kế nhiệm đó với tên [PZP](https://pzp.wiki/) và viết rằng anh sẽ
không làm gì thêm cho Manyverse và không biết ai khác có kế hoạch tiếp tục. Vào tháng 10 năm 2026,
các kho mã PZP trên [Codeberg](https://codeberg.org/pzp) không có cập nhật nào sau tháng 12 năm 2024.
Kho mã của Patchwork đã bị lưu trữ với v3.18.1 là bản phát hành cuối cùng, và nhóm đứng sau
Planetary, một ứng dụng SSB cho iOS, đã chuyển sang Nostr với ứng dụng Nos của họ vào năm 2023. Mạng
SSB vẫn chạy trên các peer và pubs mà mọi người duy trì trực tuyến, nhưng các ứng dụng chính của nó
không còn được phát triển.

## So sánh

| Câu hỏi          | Secure Scuttlebutt                                                                              | Bitsocial                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Phân loại        | Giao thức gossip ngang hàng                                                                     | Mạng cộng đồng ngang hàng                                                                 |
| Danh tính        | Một cặp khóa Ed25519 cho mỗi thiết bị                                                           | Cặp khóa Ed25519 cho người dùng và cộng đồng                                              |
| Nơi bài đăng nằm | Feed chỉ ghi nối của tác giả, được sao lại ở mọi peer sao chép feed đó                          | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                                  |
| Một peer giữ gì  | Toàn bộ lịch sử của mọi feed trong phạm vi theo dõi của nó                                      | Trạng thái mới nhất của các cộng đồng mà nó đọc hoặc seed                                 |
| Cộng đồng        | Không có đối tượng cộng đồng; kênh và hashtag gắn nhãn bài đăng                                 | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                             |
| Kiểm soát spam   | Phạm vi sao chép theo đồ thị theo dõi và việc chặn                                              | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                            |
| Kiểm duyệt       | Việc theo dõi và chặn của từng người dùng                                                       | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị           |
| Máy chủ hỗ trợ   | Pubs lưu trữ và phục vụ feed; rooms tạo đường hầm kết nối                                       | Router HTTP trả về các peer cung cấp và không lưu nội dung                                |
| Ngoại tuyến      | Đồng bộ qua LAN và Bluetooth mà không cần internet                                              | Cần kết nối internet                                                                      |
| Trình duyệt      | Ứng dụng đóng gói một nút SSB đầy đủ                                                            | Nút ngang hàng ngay trong một tab trình duyệt bình thường                                 |
| Mạng             | Vẫn chạy, nhưng các ứng dụng chính không còn được phát triển                                    | Mạng đang hoạt động với các ứng dụng như [5chan](/apps/5chan/) và [Seedit](/apps/seedit/) |
| Đánh đổi chính   | Hoạt động ngoại tuyến và không cần hosting, nhưng feed phình to mãi mãi và người lạ vẫn vô hình | Xuất bản mở và hỗ trợ trình duyệt, nhưng cần internet và chỉ giữ trạng thái mới nhất      |
