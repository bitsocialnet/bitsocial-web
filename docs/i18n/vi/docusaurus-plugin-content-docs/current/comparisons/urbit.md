---
title: Bitsocial và Urbit
description: Urbit, một mạng lưới máy chủ cá nhân với Urbit ID dựa trên Ethereum và các nhóm do bên lưu trữ vận hành trong Tlon Messenger, so với các cộng đồng ngang hàng của Bitsocial ra sao.
---

# Bitsocial và Urbit

[Urbit](https://urbit.org/) là một mạng lưới máy chủ cá nhân. Mỗi người dùng có một máy tính luôn
bật gọi là con tàu (ship), chạy hệ điều hành riêng của Urbit (Arvo) được viết bằng các ngôn ngữ
riêng của Urbit (Nock và Hoon), và được định danh bằng một Urbit ID. Ứng dụng xã hội chính của Urbit
là [Tlon Messenger](https://tlon.io/), do Tlon xây dựng, công ty được thành lập năm 2013 để phát
triển Urbit.

Urbit hướng tới thay thế toàn bộ ngăn xếp điện toán, nên đây là một dự án rộng hơn Bitsocial rất
nhiều. Tuy vậy, tầng xã hội của nó dùng một mô hình gần với Bitsocial: một cộng đồng nằm trên nút
của chủ sở hữu, và nút đó quyết định những gì được phép vào. Hai bên khác nhau ở chỗ ai phải chạy
máy chủ và spam bị chặn bên ngoài bằng cách nào.

## Urbit hoạt động như thế nào

- **Urbit ID.** Mỗi tàu có một Urbit ID: một con số được hiển thị dưới dạng một cái tên phát âm
  được, chẳng hạn `~sampel-palnet`. ID layer 1 là các NFT có quyền sở hữu và khóa công khai dùng cho
  mạng được ghi trong các hợp đồng Azimuth trên Ethereum. ID layer 2, được bổ sung năm 2021 để giảm
  phí, dùng một "naive rollup": giao dịch của chúng được đăng lên Ethereum theo lô, nhưng quyền sở
  hữu của chúng không được lưu trong hợp đồng Azimuth, và mỗi tàu tự tính toán quyền sở hữu đó một
  cách cục bộ. Tlon vận hành một roller miễn phí cho mọi người sử dụng, theo
  [tài liệu Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) và hướng dẫn
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Hệ thống phân cấp cố định.** Không gian địa chỉ có 256 thiên hà, 65.536 ngôi sao và khoảng 4 tỷ
  hành tinh để dùng hằng ngày. Thiên hà cấp phát ngôi sao, ngôi sao cấp phát hành tinh, và mỗi hành
  tinh có thể cấp phát mặt trăng cho các thiết bị của chính nó. Sao chổi là các ID miễn phí mà một
  tàu tự tạo cho mình và không bao giờ chạm tới blockchain. Chủ sở hữu các thiên hà hợp thành
  Galactic Senate, cơ quan bỏ phiếu về việc nâng cấp các hợp đồng Azimuth và bầu ra hội đồng quản
  trị của Urbit Foundation.
- **Mạng.** Các tàu trao đổi gói tin được mã hóa theo kiểu ngang hàng. Từ tháng 7 năm 2026, giao
  thức mạng là [Directed Messaging](https://urbit.org/blog/directed-messaging), một bản viết lại lấy
  nội dung làm trung tâm của giao thức Ames cũ hơn. Các thiên hà đảm nhận việc khám phá peer: mỗi
  thiên hà theo dõi vị trí của các tàu bên dưới nó và chuyển tiếp gói tin đến chúng cho đến khi hai
  tàu có thể kết nối trực tiếp với nhau, hoặc chừng nào tường lửa còn ngăn cản điều đó, theo
  [bài báo về Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Nhóm.** Trong Tlon Messenger, một nhóm được lưu trữ trên tàu của người tạo ra nó. Thành viên gửi
  tin nhắn đến bên lưu trữ, bên này phân phối chúng tới tàu của mọi thành viên, và tàu của mỗi thành
  viên giữ bản sao riêng, theo [FAQ của Tlon](https://tlon.io/posts/faq). Bên lưu trữ kiểm soát vai
  trò, kênh và việc kết nạp thành viên. Một nhóm có thể công khai, riêng tư hoặc bí mật, và có thể
  [cấm từng tàu riêng lẻ hoặc cả một cấp ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kênh là các cuộc trò chuyện, sổ ghi chép hoặc bộ sưu tập hình ảnh và liên kết.
- **Hosting.** Đăng ký với Tlon sẽ cho người dùng mới một tàu do Tlon vận hành, với các khóa do Tlon
  giữ hộ. Người dùng có thể xuất tàu cùng master ticket (khóa chủ) của nó và chạy ở nơi khác: trên
  một thiết bị [Native Planet](https://www.nativeplanet.io/), hoặc với môi trường chạy Vere trên
  Linux, macOS hay Windows. Tàu hiện chưa thể lưu trực tiếp các tệp lớn, nên Tlon Messenger đặt hình
  ảnh và các nội dung đa phương tiện khác trong kho lưu trữ đám mây tương thích S3.

## Khác biệt ở đâu

### Ai phải chạy máy chủ

Trên Urbit, mọi người tham gia đều là một máy chủ. Các ứng dụng của Tlon là giao diện cho chính tàu
của người dùng, và ngay cả việc đọc một nhóm cũng đi qua tàu đó. Những ai không tự chạy tàu thì thuê
một chiếc, và điều này đưa nhà cung cấp hosting trở lại bức tranh: Tlon giữ khóa của những người
dùng mà họ lưu trữ hộ và giữ quyền truy cập hạn chế để bảo trì, dù người dùng có thể rời đi cùng
toàn bộ con tàu của mình.

Trên Bitsocial, chỉ chủ cộng đồng mới cần một nút luôn bật. Người đọc và người đăng bài có thể chạy
một nút ngang hàng ngay trong tab trình duyệt, và tài khoản của họ là một cặp khóa do ứng dụng giữ.
Xem [Ngang hàng trong trình duyệt](/browser-p2p/). Khi ai đó dùng một nút được lưu trữ hộ, thiết kế
của Bitsocial hướng tới việc cho phép họ ủy thác việc duy trì trực tuyến mà không phải trao quyền
nắm giữ danh tính. Xem [Danh tính và quyền sở hữu cộng đồng](/identity-and-ownership/).

### Bên lưu trữ cộng đồng

Đây là chỗ hai bên gần nhau nhất. Một nhóm Tlon và một cộng đồng Bitsocial đều nằm trên nút của chủ
sở hữu. Bên lưu trữ quyết định ai được đăng bài, áp dụng kiểm duyệt và phân phối kết quả, và không
giao thức nào đặt người kiểm duyệt nào lên trên bên lưu trữ. Ở cả hai, bên lưu trữ phải trực tuyến.
FAQ của Tlon viết rằng nếu bên lưu trữ ngoại tuyến, "nhóm cũng sập theo họ", và một cộng đồng
Bitsocial không thể nhận bài đăng mới khi nút của nó ngoại tuyến.

Hai bên lưu nội dung theo cách khác nhau. Tàu của mỗi thành viên giữ một bản sao lịch sử của nhóm,
nên thành viên vẫn đọc được những gì đã nhận trong lúc bên lưu trữ ngừng hoạt động. Một người đọc
Bitsocial lấy trạng thái mới nhất của cộng đồng từ nút của cộng đồng hoặc từ các peer đang seed nó,
nên một cộng đồng ngoại tuyến vẫn đọc được chừng nào các peer còn giữ nó, nhưng mạng chỉ giữ trạng
thái mới nhất.

Một nhóm Tlon còn có danh sách thành viên, và bên lưu trữ có thể đặt nhóm ở chế độ chỉ dành cho
người được mời. Một cộng đồng Bitsocial không có tư cách thành viên: ai cũng có thể đọc, và ai cũng
có thể thử đăng bài, với điều kiện vượt qua thử thách của cộng đồng.

### Spam và danh tính

Urbit chống spam bằng cách làm cho danh tính trở nên khan hiếm. Nguồn cung hành tinh là cố định và
mỗi hành tinh đều do một ngôi sao cấp phát. Sao chổi miễn phí lách qua sự khan hiếm đó, nên những
nhóm muốn sự khan hiếm này còn hiệu lực sẽ từ chối chúng: tài liệu của Urbit ghi nhận rằng một số
nhóm không chấp nhận sao chổi, và một nhóm Tlon có thể cấm toàn bộ cấp sao chổi chỉ bằng một thiết
lập. Một khi sao chổi đã bị chặn ngoài cửa, người dùng bị cấm cần một hành tinh khác từ chủ của một
ngôi sao để quay lại. Danh tiếng cũng có thể đi theo hệ thống phân cấp: Azimuth có một hợp đồng
Censures cho phép thiên hà và ngôi sao gắn cờ các ID. Vì sự khan hiếm được xây dựng sẵn trong không
gian địa chỉ, nó hoạt động giống nhau ở mọi nhóm từ chối sao chổi.

Danh tính Bitsocial là các cặp khóa miễn phí. Mỗi cộng đồng tự chọn thử thách của mình trước khi
chấp nhận một bài đăng, chẳng hạn captcha, thanh toán, số dư token hoặc danh sách cho phép, và các
cộng đồng khác có thể chọn khác. Xem [Thử thách chống thư rác tùy chỉnh](/custom-challenges/).

### Blockchain và quản trị

Tầng danh tính của Urbit phụ thuộc vào Ethereum. Các hợp đồng Azimuth ghi lại quyền sở hữu và khóa
mạng ở layer 1, các giao dịch layer 2 được đăng lên Ethereum theo lô, và Galactic Senate có thể nâng
cấp hợp đồng chi phối Azimuth. Chính 256 thiên hà đó cũng đảm nhận việc khám phá peer và chuyển
tiếp, nên một tập danh tính cố định gánh cả việc quản trị lẫn một phần định tuyến của mạng.

Danh tính Bitsocial là các cặp khóa không cần đăng ký. Tên `.bso` và `.eth` là các bí danh tùy chọn
phân giải ra các khóa đó. Việc khám phá peer đi qua các router HTTP chỉ trả về địa chỉ của nhà cung
cấp; ai cũng có thể chạy một router, và client có thể đổi router bằng cách thay đổi cấu hình.

### Phạm vi

Urbit là một máy tính đa dụng. Một tàu có thể lưu trữ một Git remote, một cơ sở tri thức cá nhân
hoặc các tác tử AI, và Tlon Messenger chỉ là một chương trình trong số nhiều chương trình. Xây dựng
cho Urbit chủ yếu là viết ứng dụng Hoon cho Arvo. Bitsocial là một giao thức cho các cộng đồng công
khai, với các ứng dụng như [5chan](/apps/5chan/) và [Seedit](/apps/seedit/). Nó chạy trên ngăn xếp
sẵn có (libp2p, IPFS và trình duyệt) thay vì thay thế ngăn xếp đó, và các client của nó được xây
dựng bằng công cụ web thông thường. Xem
[Tự xây dựng ứng dụng khách của bạn](/build-your-own-client/).

### Tin nhắn riêng tư

Đây là chỗ Urbit mạnh hơn. Tin nhắn trực tiếp đi thẳng từ tàu này sang tàu khác, mọi lưu lượng giữa
các tàu đều được mã hóa, và nhóm có thể riêng tư hoặc bí mật. Tlon lưu ý rằng tin nhắn được mã hóa
khi truyền nhưng được lưu không mã hóa trên tàu. Bitsocial tập trung vào cộng đồng công khai và chưa
có tin nhắn trực tiếp tích hợp sẵn.

## Tình trạng dự án

Urbit đã trải qua nhiều biến động. Vào tháng 8 năm 2024, Urbit Foundation, tổ chức phi lợi nhuận
định hướng việc phát triển lõi, đã sa thải giám đốc điều hành; nhà sáng lập Curtis Yarvin quay lại
dẫn dắt chiến lược mà không có chức danh chính thức, một số nhà phát triển lõi rời đi, và nguồn tiền
của Foundation chỉ còn đủ cho vài tháng, theo
[tin của CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin đề xuất chuyển Azimuth sang một layer 2 sẵn có của Ethereum, nhiều khả năng là Base, và phát
hành các token "visa" có thể thay thế lẫn nhau (fungible) và chuyển đổi được thành hành tinh. Tính
đến tháng 10 năm 2026, [tài liệu về ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) của Urbit
vẫn mô tả Azimuth trên Ethereum cùng naive rollup của nó. Vào tháng 10 năm 2025, Galactic Senate đã
thay thế hội đồng quản trị của Foundation, và hội đồng mới đã bổ nhiệm một giám đốc điều hành mới
([thông báo](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Hoạt động phát triển vẫn tiếp tục. Directed Messaging chính thức hoạt động cùng bản phát hành 408k
vào ngày 14 tháng 7 năm 2026. Vào tháng 6 năm 2026, Tlon Messenger
[mở đăng ký công khai không cần danh sách chờ](https://urbit.org/blog/this-month-in-urbit-june-2026),
và giờ đây Tlon tự giới thiệu mình là nơi con người và các tác tử AI làm việc cùng nhau.

## So sánh

| Câu hỏi           | Urbit                                                                                                | Bitsocial                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Phân loại         | Mạng máy chủ cá nhân và hệ điều hành                                                                 | Mạng cộng đồng ngang hàng                                                                                       |
| Danh tính         | Urbit ID: khoảng 4 tỷ hành tinh trên Ethereum hoặc rollup layer 2 của nó, cùng các sao chổi miễn phí | Cặp khóa Ed25519 cho người dùng và cộng đồng                                                                    |
| Ai chạy máy chủ   | Mọi người dùng, trên tàu của chính họ hoặc một tàu được lưu trữ hộ                                   | Chủ cộng đồng; người đọc và người đăng bài có thể dùng một tab trình duyệt                                      |
| Nơi bài đăng nằm  | Tàu của bên lưu trữ nhóm và một bản sao trên tàu của mỗi thành viên                                  | Nút của chủ cộng đồng và các peer đọc, seed cộng đồng đó                                                        |
| Cộng đồng         | Nhóm do tàu của người tạo lưu trữ, có danh sách thành viên                                           | Đối tượng hạng nhất có nút tự chấp nhận hoặc từ chối bài đăng                                                   |
| Kiểm soát spam    | ID khan hiếm do các ngôi sao cấp phát; nhóm cấm từng tàu hoặc cả một cấp                             | Thử thách của từng cộng đồng trước khi bài đăng được chấp nhận                                                  |
| Kiểm duyệt        | Vai trò và lệnh cấm của bên lưu trữ nhóm                                                             | Chủ cộng đồng kiểm duyệt cộng đồng của mình; ứng dụng tự chọn nội dung hiển thị                                 |
| Khám phá peer     | Thiên hà theo dõi và chuyển tiếp cho các tàu bên dưới chúng                                          | Router HTTP trả về các peer cung cấp và không lưu nội dung                                                      |
| Quản trị          | Galactic Senate gồm 256 thiên hà bỏ phiếu về các bản nâng cấp Azimuth                                | Không có thẩm quyền cấp giao thức nào đối với danh tính hay cộng đồng                                           |
| Tin nhắn riêng tư | Tin nhắn trực tiếp được mã hóa và nhóm chỉ dành cho người được mời                                   | Cộng đồng công khai; chưa có tin nhắn trực tiếp tích hợp sẵn                                                    |
| Đánh đổi chính    | Cả một máy tính cá nhân với nhóm riêng tư, nhưng mọi người dùng đều cần một tàu luôn bật             | Danh tính miễn phí và truy cập qua trình duyệt, nhưng không có nhắn tin riêng tư và chỉ giữ trạng thái mới nhất |
