---
title: Thư mục
description: Cách các ứng dụng Bitsocial cho phép các cộng đồng cạnh tranh một tên chủ đề thay vì để tên đó thuộc mãi về người giành được trước.
---

# Thư mục

Trên Reddit, một cái tên như `r/opensource` chỉ có thể thuộc về một cộng đồng duy nhất, và ai kiểm soát cộng đồng đó thì giữ luôn cái tên. Nếu đội ngũ kiểm duyệt đưa ra những quyết định mà người dùng không thích, lựa chọn duy nhất là lập `r/opensource2`. Cộng đồng mới bắt đầu với số người đăng ký bằng không, dù phần lớn những người đã đăng ký `r/opensource` quan tâm đến mã nguồn mở chứ không phải đội ngũ kiểm duyệt cụ thể đó.

Các ứng dụng Bitsocial tránh được điều này nhờ **thư mục**. Thư mục là một tên chủ đề, chẳng hạn `opensource`, mà các cộng đồng cạnh tranh để giành lấy. Đường dẫn ngắn của tên đó mở cộng đồng hiện đang xếp hạng cao nhất, nên một cộng đồng tốt hơn có thể tiếp quản cái tên mà không cần xin phép ai.

## Cách hoạt động

1. **Mã thư mục là một tên chủ đề.** Seedit dùng các đường dẫn như `/s/funny`. 5chan dùng các đường dẫn kiểu bảng hình ảnh như `/g/`.
2. **Các cộng đồng cạnh tranh với tư cách ứng viên.** Mỗi thư mục có một danh sách cộng đồng ứng viên, mỗi cộng đồng có địa chỉ chính xác riêng, chẳng hạn `funny-posting.bso`.
3. **Ứng viên xếp hạng cao nhất giành đường dẫn.** Mở `/s/funny` sẽ hiển thị bên thắng hiện tại.
4. **Thua cuộc không xóa gì cả.** Cộng đồng không thắng vẫn giữ địa chỉ, bài đăng và người đăng ký của mình, và bất kỳ ai vẫn có thể mở trực tiếp cộng đồng đó.

## Cái tên là cửa trước, không phải danh tính

Mã thư mục chỉ là một đường dẫn để khám phá. Mọi thứ lâu dài đều trỏ tới một cộng đồng cụ thể:

- Đăng ký từ `/s/funny` nghĩa là đăng ký địa chỉ chính xác của bên thắng hiện tại. Bản thân mã thư mục không bao giờ được lưu thành một lượt đăng ký.
- Liên kết bài đăng luôn dùng địa chỉ chính xác của cộng đồng, nên một liên kết cũ không thể chuyển sang trỏ tới một cộng đồng khác sau khi bên thắng thay đổi.
- Khi bên thắng thay đổi, Seedit giữ nguyên các lượt đăng ký hiện có và hỏi từng người đăng ký xem muốn chuyển sang bên thắng mới, giữ cả hai, hay giữ cộng đồng hiện tại. Tự động chuyển là tùy chọn phải chủ động bật cho từng thư mục, và mỗi lần tự động chuyển sẽ hiển thị một thông báo kèm nút hoàn tác.

Vì vậy, một cộng đồng cạnh tranh không lấy đi lượt đăng ký của ai. Nó giành được cái tên: khách truy cập mới sẽ đến với nó, còn người đăng ký hiện tại được lựa chọn chỉ bằng một cú nhấp. Những người thích cộng đồng cũ hơn vẫn giữ nó.

## Vì sao không theo kiểu ai đến trước được trước

- **Không chiếm chỗ tên.** Chỉ nắm giữ một cái tên hay là chưa đủ. Một cộng đồng phải tiếp tục là ứng viên tốt nhất cho cái tên đó.
- **Không có quản trị viên nào cấp tên.** Việc để quản trị viên phân bổ tên sẽ tái tạo quyền phủ quyết tập trung mà Bitsocial được xây dựng để loại bỏ.
- **Đối thủ vẫn có đường đến với khán giả.** Một cộng đồng đối thủ nhắm vào cùng cái tên thay vì phải làm lại từ đầu dưới một cái tên kém hơn.
- **Các ứng dụng khách thống nhất về bên thắng.** Seedit xếp hạng ứng viên một cách tất định, nên mọi ứng dụng khách đọc cùng một bản chụp thư mục đã chốt đều hiển thị cùng một bên thắng. Seedit không thay bằng ứng viên khác chỉ vì bên thắng tạm thời không truy cập được trên kết nối của một người dùng.

## Cách chọn bên thắng hiện nay

Các ứng viên được công bố dưới dạng tệp JSON trong kho mã [bitsocialnet/lists](https://github.com/bitsocialnet/lists), mỗi thư mục một tệp, và một cộng đồng tham gia thư mục bằng một pull request vào tệp của thư mục đó. Đây là bước khởi động ban đầu. Mục tiêu là để bỏ phiếu thay thế pull request làm cách quyết định bên thắng.

- **Seedit** xếp hạng các ứng viên của một thư mục theo điểm, sau đó theo thời điểm được thêm vào, rồi theo địa chỉ. Mỗi tệp thư mục có một số hiệu bản sửa đổi, và mọi thay đổi đối với ứng viên hoặc bên thắng đều công bố một bản sửa đổi mới.
- **5chan** tổ chức một cuộc bỏ phiếu cho mỗi thư mục bằng [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Các ứng dụng khách trao đổi lá phiếu đã ký qua libp2p gossipsub và tự tính kết quả, không có máy chủ nào đếm phiếu. Muốn bỏ phiếu phải nắm giữ 5chan Pass, một token không thể chuyển nhượng, và mỗi người nắm giữ có một phiếu. Bỏ phiếu cho một bảng chưa có trong danh sách sẽ đề cử bảng đó. Các cuộc bỏ phiếu hiện chạy trên mạng thử nghiệm Base Sepolia, và cho đến khi rời khỏi mạng thử nghiệm, kết quả được hiển thị nhưng không sắp xếp lại danh sách.

## Giao thức hay ứng dụng?

Thư mục không thuộc PKC, lớp ngang hàng lưu trữ và truyền tải các cộng đồng. Chúng là một quy ước mà các ứng dụng khách áp dụng phía trên lớp đó, cùng với danh sách mặc định và tìm kiếm; xem [Khám phá nội dung](./content-discovery.md). Một ứng dụng khách có thể đọc cùng các tệp thư mục, tự công bố tệp riêng, hoặc bỏ qua thư mục hoàn toàn, và người dùng vẫn có thể mở bất kỳ cộng đồng nào bằng địa chỉ của nó.
