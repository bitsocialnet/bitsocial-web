---
title: Khám phá nội dung
description: Cách Bitsocial tách biệt khám phá ngang hàng với quản lý cấp ứng dụng.
---

# Khám phá nội dung

Bitsocial không đưa một nguồn cấp dữ liệu toàn cầu, chỉ mục tìm kiếm hoặc thuật toán xếp hạng vào giao thức. Nó tách khám phá nội dung thành hai lớp:

1. **Tra cứu mạng** tìm các đồng nghiệp hiện đang phục vụ một cộng đồng đã biết.
2. **Quản lý ứng dụng** quyết định cộng đồng, bảng, danh sách hoặc bài đăng nào mà sản phẩm hiển thị đầu tiên.

Điều này giữ cho giao thức có kích thước nhỏ trong khi vẫn chừa chỗ cho nhiều trải nghiệm khám phá cạnh tranh.

## Tra cứu mạng

Mỗi cộng đồng đều có một địa chỉ ổn định được lấy từ khóa công khai của nó. Khi một máy khách đã biết địa chỉ đó, nó sẽ truy vấn các bộ định tuyến HTTP hạng nhẹ để tìm các đồng nghiệp tự công bố là nhà cung cấp địa chỉ đó.

Các bộ định tuyến chỉ trả về địa chỉ ngang hàng của nhà cung cấp. Họ không lưu trữ các bài đăng, siêu dữ liệu, danh sách người dùng hoặc thư mục cộng đồng mà con người có thể đọc được. Sau khi khách hàng nhận được địa chỉ ngang hàng, nó sẽ kết nối với các đồng nghiệp đó và tìm nạp siêu dữ liệu cộng đồng mới nhất cùng với các con trỏ nội dung, sau đó tìm nạp dữ liệu bài đăng thực tế bằng hàm băm.

Điều này trả lời câu hỏi về giao thức: "Tôi có thể lấy trạng thái mới nhất cho cộng đồng này ở đâu?"

## Quản lý ứng dụng

Câu hỏi riêng về sản phẩm là: "Người dùng nên xem cộng đồng nào đầu tiên?"

Bitsocial để việc đó cho các ứng dụng, danh sách và người dùng thay vì đưa một câu trả lời vào mạng. Ví dụ bao gồm:

- một khách hàng hiển thị các cộng đồng mà người dùng đã theo dõi
- danh sách mặc định được quản lý cho ứng dụng kiểu Reddit
- khe thư mục cho ứng dụng kiểu bảng hình ảnh
- chỉ mục tìm kiếm hoặc xếp hạng được duy trì bởi một ứng dụng cụ thể
- liên kết trực tiếp được chia sẻ bởi người dùng

Ứng dụng có thể lập chỉ mục, xếp hạng, lọc hoặc đánh dấu những thứ khác nhau mà không biến những lựa chọn đó thành luật giao thức. Nếu bề mặt khám phá của một ứng dụng không hữu ích thì ứng dụng khác có thể xây dựng một bề mặt khám phá khác trên cùng các cộng đồng cơ bản.

## Ứng dụng hiện tại

5chan hiện sử dụng các đường dẫn thư mục quen thuộc như `/b/` hoặc `/g/`. Việc phân công thư mục ngày nay được quản lý thông qua danh sách công khai, với các phiên bản trong tương lai dự kiến ​​sẽ hỗ trợ tạo bảng trong ứng dụng và bỏ phiếu cho các vị trí thư mục.

Seedit sử dụng danh sách cộng đồng mặc định cho trang đầu của nó. Các cộng đồng vẫn có thể được tạo và chia sẻ bên ngoài danh sách mặc định đó.

Trong cả hai trường hợp, danh sách cấp ứng dụng sẽ giúp người dùng tìm nội dung nào đó để mở và sau đó, việc tra cứu cấp giao thức sẽ phân giải cộng đồng đã chọn thành các đồng nghiệp.

## Tại sao sự phân chia này lại quan trọng

Một mạng phi tập trung duy nhất vẫn cần khả năng khám phá tốt, nhưng lớp khám phá có thể thay thế được. Giao thức cốt lõi của Bitsocial tập trung vào khả năng đánh địa chỉ, tra cứu ngang hàng, xuất bản và chống thư rác. Việc quản lý nằm trên lớp đó, nơi các ứng dụng có thể thử nghiệm các thư mục, danh sách mặc định, nguồn cấp dữ liệu, chính sách tìm kiếm, bỏ phiếu và kiểm duyệt mà không yêu cầu di chuyển trên toàn mạng.
