---
title: Giải thích đầy đủ về giao thức Bitsocial
description: Hướng dẫn bằng tiếng Anh đơn giản về cộng đồng Bitsocial, tra cứu ngang hàng, xuất bản, thử thách chống thư rác, kiểm duyệt và ứng dụng.
---

# Giải thích đầy đủ về giao thức Bitsocial

Trang này giải thích về Bitsocial mà không cho rằng bạn đã hiểu về mạng ngang hàng, khóa mật mã, IPFS hoặc pubsub.

Một số chi tiết được đơn giản hóa có mục đích. Để có phiên bản kỹ thuật hơn, hãy đọc trang [Giao thức ngang hàng](./peer-to-peer-protocol.md).

## Phiên bản ngắn

Bitsocial là một giao thức dành cho các ứng dụng xã hội nơi cộng đồng được sở hữu bởi các khóa thay vì cơ sở dữ liệu của công ty.

Một cộng đồng Bitsocial có một địa chỉ. Các ứng dụng sử dụng địa chỉ đó để tìm các đồng nghiệp đang phục vụ cộng đồng, tìm nạp các bài đăng mới nhất từ ​​các đồng nghiệp đó và xuất bản các bài đăng mới thông qua kênh tin nhắn ngang hàng. Trước khi bài đăng được chấp nhận, cộng đồng có thể yêu cầu thử thách chống thư rác như hình ảnh xác thực, mã mời, thanh toán, kiểm tra mã thông báo, kiểm tra kiểm duyệt AI, danh sách cho phép hoặc bất kỳ quy tắc nào khác có thể được mã hóa.

Đó là ý tưởng cốt lõi:

1. Một cộng đồng được kiểm soát bởi một khóa riêng.
2. Khóa công khai cung cấp cho cộng đồng một địa chỉ ổn định.
3. Đồng nghiệp giúp người đọc tìm và tìm kiếm cộng đồng.
4. Nút cộng đồng chấp nhận hoặc từ chối bài đăng mới.
5. Chính sách chống thư rác thuộc về mỗi cộng đồng chứ không thuộc về một nền tảng toàn cầu.

## Tại sao băm lại quan trọng

Băm là một dấu vân tay ngắn cho dữ liệu.

Nếu hai người băm cùng một tệp, họ sẽ nhận được cùng một dấu vân tay. Nếu tập tin thay đổi, dấu vân tay sẽ thay đổi. Điều đó làm cho hàm băm trở nên hữu ích trong việc tìm kiếm và kiểm tra dữ liệu mà không cần tin tưởng một công ty sẽ cho bạn biết tệp đó là gì.

Hệ thống ngang hàng sử dụng ý tưởng này liên tục. Thay vì yêu cầu một trang web cung cấp "tệp có tên photo.png", một trang web ngang hàng có thể yêu cầu mạng cung cấp dữ liệu bằng một dấu vân tay cụ thể. Nếu một thiết bị ngang hàng khác trả về dữ liệu sai, quá trình kiểm tra hàm băm sẽ không thành công.

Bitsocial sử dụng hàm băm và số nhận dạng nội dung cho dữ liệu bài đăng và các phần khác của trạng thái cộng đồng. Điểm quan trọng rất đơn giản: dữ liệu có thể được xử lý theo bản chất của nó chứ không chỉ theo nơi công ty lưu trữ dữ liệu đó.

## Tại sao khóa công khai lại quan trọng

Khóa chung và khóa riêng là một cặp trùng khớp.

Khóa riêng là bí mật. Đó là thứ mang lại sự kiểm soát. Khóa công khai được chia sẻ an toàn. Nó cho phép mọi người khác kiểm tra xem tin nhắn, cập nhật hoặc hành động kiểm duyệt có thực sự đến từ khóa riêng phù hợp hay không.

Đây là cách Bitsocial tránh các tài khoản nền tảng thông thường. Một công ty không cần phải cấp giấy tờ tùy thân. Một hàng cơ sở dữ liệu không cần xác định chủ sở hữu. Cặp khóa là cơ quan có thẩm quyền.

Nói một cách dễ hiểu:

- khóa riêng là tay cầm điều khiển của chủ sở hữu
- khóa chung là danh tính hoặc địa chỉ công khai
- chữ ký chứng minh rằng một hành động đến từ chủ sở hữu

## Cộng đồng Bitsocial là gì

Cộng đồng Bitsocial không chỉ là một trang trong một ứng dụng.

Nó có cặp khóa riêng. Khóa công khai cung cấp cho cộng đồng một địa chỉ mạng ổn định. Khóa riêng kiểm soát các cập nhật về trạng thái của cộng đồng, chẳng hạn như siêu dữ liệu, quy tắc, danh sách người kiểm duyệt, cấu hình thử thách và con trỏ tới nội dung được chấp nhận mới nhất.

Điều đó có nghĩa là một cộng đồng có thể tồn tại lâu hơn một giao diện. Một ứng dụng có thể hiển thị nó dưới dạng bảng. Một ứng dụng khác có thể hiển thị nó dưới dạng diễn đàn. Ứng dụng trong tương lai có thể hiển thị nó trong nguồn cấp dữ liệu dựa trên hồ sơ. Ứng dụng có thể thay đổi nhưng địa chỉ cộng đồng vẫn trỏ đến cùng một cộng đồng được sở hữu.

## Cách đọc hoạt động

Khi người dùng mở cộng đồng Bitsocial, ứng dụng sẽ không yêu cầu một cơ sở dữ liệu trung tâm cho trang.

Dòng chảy gần hơn với điều này:

1. Ứng dụng đã biết địa chỉ cộng đồng hoặc lấy địa chỉ đó từ danh sách, liên kết, bề mặt tìm kiếm hoặc
   tên mà con người có thể đọc được.
2. Ứng dụng sẽ hỏi các bộ định tuyến hạng nhẹ mà các thiết bị ngang hàng hiện đang cung cấp địa chỉ cộng đồng đó.
3. Các bộ định tuyến chỉ trả về địa chỉ ngang hàng. Họ không trả lại bài đăng, quy tắc, hồ sơ hoặc cộng đồng
   siêu dữ liệu.
4. Ứng dụng kết nối với các đồng nghiệp và tìm nạp trạng thái cộng đồng mới nhất.
5. Trạng thái đó chứa các con trỏ để đăng nội dung.
6. Ứng dụng tìm nạp nội dung bài đăng từ các ứng dụng ngang hàng và hiển thị nội dung đó trong giao diện xã hội bình thường.

Bộ định tuyến chỉ là một công cụ trợ giúp tra cứu. Nó gần giống với việc hỏi "ai có cái này?" hơn là hỏi "vui lòng phục vụ tôi toàn bộ trang web."

Để biết thêm chi tiết về phần phân chia này, hãy đọc [Khám phá nội dung](./content-discovery.md).

## Cách đăng bài hoạt động

Đăng bài khác với đọc vì mạng ngang hàng mở có thể bị spam.

Bitsocial xử lý việc xuất bản thông qua luồng phản hồi-thách thức:

1. Người dùng viết một bài đăng hoặc trả lời.
2. Ứng dụng tham gia chủ đề tin nhắn ngang hàng của cộng đồng.
3. Ứng dụng yêu cầu nút cộng đồng thực hiện một thử thách.
4. Nút cộng đồng gửi lại thử thách.
5. Người dùng hoặc ứng dụng hoàn thành thử thách.
6. Ứng dụng sẽ gửi bài đăng kèm theo câu trả lời thử thách.
7. Nút cộng đồng kiểm tra câu trả lời và bài đăng.
8. Nếu vượt qua, nút cộng đồng sẽ chấp nhận bài đăng vào bản cập nhật tiếp theo của cộng đồng.
9. Những người đọc khác lấy trạng thái cộng đồng cập nhật từ các đồng nghiệp.

Thử thách xảy ra trước khi bài đăng trở thành một phần của trạng thái cộng đồng được chấp nhận. Đó là điểm khác biệt quan trọng so với các hệ thống nơi thư rác được chấp nhận trước và ẩn sau.

## Tại sao thách thức chống thư rác lại quan trọng

Hầu hết các nền tảng xã hội đều biến việc chống thư rác thành chính sách nền tảng. Một công ty quyết định những gì được coi là tài khoản hợp lệ, bài đăng hợp lệ, phạm vi tiếp cận hợp lệ hoặc người dùng hợp lệ.

Bitsocial tách biệt những thứ đó. Giao thức cung cấp cho cộng đồng một cách để yêu cầu một thử thách trước khi chấp nhận một bài đăng, nhưng nó không buộc mọi cộng đồng phải sử dụng cùng một thử thách.

Một cộng đồng có thể sử dụng hình ảnh xác thực. Người khác có thể sử dụng mã mời. Một cách khác có thể yêu cầu kiểm tra SMS, thanh toán, NFT, số dư mã thông báo, điểm kiểm duyệt AI, bằng chứng về danh tiếng, danh sách cho phép dành riêng cho cộng đồng hoặc quy tắc tùy chỉnh.

Tính linh hoạt đó rất quan trọng vì thư rác thay đổi. Quy tắc thư rác ở cấp độ giao thức trở nên cũ kỹ. Thử thách cấp cộng đồng có thể phát triển mà không cần di chuyển toàn bộ mạng.

Để biết phần giải thích tập trung, hãy đọc [Thử chống thư rác tùy chỉnh](./custom-challenges.md).

## Cách thức hoạt động của sự kiểm duyệt

Bitsocial không bị kiểm duyệt. Đó là sự kiểm duyệt mà không cần một siêu quản trị viên toàn cầu.

Một cộng đồng có thể có chủ sở hữu và người kiểm duyệt. Địa chỉ của người điều hành là một phần của trạng thái cộng đồng. Khi người điều hành thực hiện một hành động, hành động đó có thể được ký. Nút cộng đồng và khách hàng có thể kiểm tra chữ ký đối với danh sách người kiểm duyệt.

Điều đó mang lại cho sự kiểm duyệt một phạm vi cục bộ:

- chủ sở hữu cộng đồng kiểm soát cộng đồng đó
- người điều hành hành động thông qua các khóa được cộng đồng công nhận
- ứng dụng vẫn có thể chọn những gì họ lập chỉ mục, xếp hạng, ẩn hoặc đánh dấu
- không có tài khoản công ty cấp giao thức nào có thể xóa mọi danh tính hoặc chiếm giữ mọi cộng đồng

Trong thực tế, điều này có nghĩa là một cộng đồng có thể loại bỏ thư rác hoặc thực thi các quy tắc trong không gian riêng của mình mà không cần biến các quy tắc của mình thành luật cho toàn bộ mạng.

Đối với chế độ xem chính sách, hãy đọc [Kiểm tra cục bộ, không phải lệnh toàn cầu](./local-moderation.md).

## Thêm ứng dụng gì

Giao thức không quyết định toàn bộ sản phẩm sẽ trông như thế nào.

Một ứng dụng bổ sung thêm trải nghiệm của con người xung quanh giao thức:

- danh sách cộng đồng mặc định
- tìm kiếm và khám phá
- nguồn cấp dữ liệu và xếp hạng
- Giao diện bố cục và đăng bài
- xử lý phương tiện truyền thông
- công cụ kiểm duyệt
- bao bì trên thiết bị di động, máy tính để bàn hoặc trình duyệt
- mô hình kinh doanh và mặc định

Đó là lý do tại sao Bitsocial có thể hỗ trợ các kiểu ứng dụng khác nhau. 5chan có thể giống như một bảng hình ảnh. Seedit có thể giống như một cuộc thảo luận kiểu diễn đàn. Các khách hàng khác có thể xây dựng các bề mặt khám phá, hệ thống xếp hạng, chế độ xem kiểm duyệt hoặc mặc định cộng đồng khác nhau trong khi vẫn sử dụng các cộng đồng Bitsocial tương thích bên dưới.

Giao thức giữ quyền sở hữu và xuất bản di động. Ứng dụng cạnh tranh về chất lượng sản phẩm.

## RPC công cộng bổ sung những gì

Chạy trực tiếp một nút cộng đồng ngang hàng rất mạnh mẽ, nhưng không phải ai cũng muốn quản lý một máy luôn bật.

RPC công cộng là lớp dịch vụ có thể giúp Bitsocial thuận tiện hơn. Nhà cung cấp RPC công cộng có thể giúp người dùng quản lý cộng đồng từ điện thoại hoặc máy khách hạng nhẹ, trong khi mô hình sở hữu lâu dài vẫn cho phép người dùng chuyển đi, tự lưu trữ hoặc chọn nhà cung cấp cạnh tranh.

Sự khác biệt quan trọng:

- RPC có thể hỗ trợ về thời gian hoạt động và sự thuận tiện
- RPC không nên trở thành quyền giám hộ vĩnh viễn
- mối quan hệ chủ sở hữu phải được gắn với các khóa chứ không phải với cơ sở dữ liệu của một nhà cung cấp

## Bitsocial không phải là gì

Bitsocial không phải là mạng xã hội blockchain. Phương tiện truyền thông xã hội không cần mọi bài đăng đều trở thành giao dịch trong một sổ cái toàn cầu.

Bitsocial không phải là liên đoàn theo nghĩa ActPub. Cộng đồng không cần phải là tài khoản trên một máy chủ có một tên miền, một quản trị viên và một cơ sở dữ liệu máy chủ.

Bitsocial cũng không phải là một ứng dụng. Đây là lớp giao thức dùng chung cho các ứng dụng, cộng đồng, nút, bộ định tuyến, nhà cung cấp RPC, dịch vụ khám phá, mô-đun chống thư rác và công cụ kiểm duyệt.

Vấn đề không phải là mọi người dùng đều cần hiểu tất cả những điều này trước khi đăng. Vấn đề là sản phẩm có thể mang lại cảm giác bình thường trong khi mô hình sở hữu bên dưới lại khác.

## Đi đâu tiếp theo

- [Giao thức ngang hàng](./peer-to-peer-protocol.md) giải thích luồng kỹ thuật.
- [Khám phá nội dung](./content-discovery.md) giải thích việc tra cứu mạng và quản lý ứng dụng.
- [Thử chống rác tùy chỉnh](./custom-challenges.md) giải thích hệ thống thử thách.
- [Bản sắc và quyền sở hữu cộng đồng](./identity-and-ownership.md) giải thích về kiểm soát khóa
  quyền sở hữu.
- [Xây dựng khách hàng riêng của bạn](/build-your-own-client/) giải thích cách các ứng dụng độc lập có thể xây dựng trên đó
  cùng một mạng.
