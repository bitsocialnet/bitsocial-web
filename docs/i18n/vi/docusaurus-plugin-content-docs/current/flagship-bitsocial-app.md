---
title: Phi tập trung hóa Twitter/X
description: "Giai đoạn 3 của kế hoạch tổng thể: một lựa chọn thay thế Twitter/X phi tập trung, có trọng tâm cho đối thoại công khai ưu tiên văn bản, với hạ tầng có thể thay thế."
---

# Phi tập trung hóa Twitter/X

Giai đoạn 3 là kế hoạch xây dựng một lựa chọn thay thế Twitter/X phi tập trung và có trọng tâm. Trung tâm của nó là đối thoại công khai ưu tiên văn bản: bài đăng ngắn, phản hồi, đăng lại, theo dõi, thảo luận theo thời gian thực và cộng đồng, với lớp nền tảng được mở ra.

Twitter/X vẫn được định hình bởi bài đăng, văn bản và việc chia sẻ ý tưởng. Ứng dụng khách Giai đoạn 3 nên cạnh tranh bằng trải nghiệm cốt lõi đó và làm cho trải nghiệm ấy hoạt động thật xuất sắc.

Trang này mô tả hướng đi của sản phẩm, không phải đặc tả phát hành đã khóa. Giao diện chính xác, nguồn cấp dữ liệu mặc định, mô hình quảng cáo, tính năng AI và thị trường RPC có thể thay đổi khi giao thức và các ứng dụng ban đầu trưởng thành.

## Điều đó cần chứng tỏ điều gì

Ứng dụng khách nên chứng minh rằng một mạng xã hội dựa trên hồ sơ có thể tránh trở thành nền tảng nắm quyền kiểm soát danh tính và hồ sơ của người dùng:

- người dùng có thể sở hữu danh tính và hồ sơ
- cộng đồng và các nút hồ sơ có thể ở trạng thái ngang hàng
- cộng đồng có thể mang lại hiệu ứng mạng trên các ứng dụng khách Bitsocial
- Các nhà cung cấp RPC có thể làm cho ứng dụng trở nên thuận tiện mà không nắm quyền kiểm soát danh tính hoặc hồ sơ của người dùng
- thuật toán nguồn cấp dữ liệu có thể là dịch vụ tùy chọn thay vì luật nền tảng
- các ứng dụng khách khác vẫn có thể cạnh tranh trên cùng một mạng

Mục tiêu là xây dựng ứng dụng khách đối thoại công khai mạnh nhất có thể và cho thấy giao thức có thể mở rộng đến đâu.

## Quen thuộc về mục đích, có thể thay thế theo thiết kế

Trải nghiệm mặc định nên cạnh tranh với phần cốt lõi của Twitter/X: nguồn cấp dữ liệu trang chủ nhanh, bài đăng văn bản, theo dõi, phản hồi, phân phối qua đăng lại, cộng đồng, thông báo, tìm kiếm và chế độ xem For You được xếp hạng có thể dùng ngay.

Bitsocial Forge có thể chạy dịch vụ nguồn cấp dữ liệu và RPC mặc định đầu tiên. Mặc định đó có thể bao gồm nguồn cấp dữ liệu được xếp hạng và quảng cáo để ứng dụng có cảm giác hoàn chỉnh vào ngày đầu tiên thay vì yêu cầu người dùng phổ thông tự tập hợp toàn bộ ngăn xếp.

Điểm khác biệt là lựa chọn mặc định không được trở thành nhà tù. Người dùng nên có thể chuyển đổi RPC, nguồn cấp dữ liệu, phiên bản, hệ thống xếp hạng, quảng cáo và nhà cung cấp khám phá, hoặc loại bỏ hoàn toàn việc xếp hạng. Ứng dụng khách có thể đưa ra lựa chọn mặc định rõ ràng trong lần khởi chạy đầu tiên mà vẫn giữ mọi dịch vụ quan trọng ở trạng thái có thể thay thế.

Nhờ đó, ứng dụng khách có thể tùy chỉnh nhiều hơn một nền tảng thông thường. Một người dùng có thể giữ nguồn cấp dữ liệu mặc định được xếp hạng kèm quảng cáo. Người khác có thể dùng nguồn cấp dữ liệu theo thời gian mà không xếp hạng. Người khác nữa có thể chọn RPC tập trung vào quyền riêng tư, dịch vụ khám phá do cộng đồng vận hành, nguồn cấp dữ liệu trả phí không quảng cáo hoặc thuật toán ngách dành cho một nhóm văn hóa cụ thể.

## Cộng đồng xuyên ứng dụng khách

Cộng đồng sẽ quan trọng hơn nhiều so với các nhóm biệt lập trong một ứng dụng.

Trên X/Twitter, các cộng đồng được giới hạn bên trong X. Chúng có thể hữu ích nhưng kế thừa các giới hạn của một nền tảng, một hệ thống tài khoản, một ngăn xếp đề xuất và một bề mặt sản phẩm.

Một cộng đồng Bitsocial có thể được tạo, lưu trữ, khám phá và sử dụng qua nhiều ứng dụng khách khác nhau. Điều đó có nghĩa là ứng dụng khách Giai đoạn 3 có thể hiển thị cộng đồng và bài đăng từ mạng Bitsocial rộng hơn, không chỉ từ những người dùng bắt đầu bên trong nó. Một cộng đồng có thể đồng thời có hoạt động từ ứng dụng khách imageboard, ứng dụng khách thảo luận kiểu Reddit, ứng dụng khách diễn đàn ngách, ứng dụng di động và ứng dụng khách Giai đoạn 3.

Đó là lợi thế cốt lõi của hiệu ứng mạng: một ứng dụng khách có thể mang lại cảm giác quen thuộc cho người dùng phổ thông trong khi vẫn thu được giá trị từ nhiều ứng dụng khách, nút cộng đồng, nhà cung cấp RPC và các dịch vụ độc lập.

## Thuật toán nguồn cấp dữ liệu tùy chọn

Ứng dụng khách Giai đoạn 3 không nên áp đặt một hệ thống xếp hạng toàn cầu duy nhất lên mọi người.

Thuật toán nguồn cấp dữ liệu phải được chọn tham gia. Người dùng có thể chọn thuật toán từ thị trường, chuyển đổi nhà cung cấp, sử dụng thuật toán từ một công ty, sử dụng thuật toán do nhà điều hành ẩn danh điều hành, sử dụng thuật toán do cộng đồng xây dựng, chạy thuật toán cá nhân hoặc không sử dụng thuật toán nào cả.

Các nhà cung cấp RPC công cộng là nơi tự nhiên để các dịch vụ này cạnh tranh. Họ có thể lập chỉ mục, xếp hạng và đề xuất nội dung nhưng không nên kiểm soát danh tính hoặc hồ sơ của người dùng.

Những dịch vụ đó cũng có thể cạnh tranh về hình dạng của ứng dụng. Một RPC có thể cung cấp nguồn cấp dữ liệu được xếp hạng có quảng cáo. Một cái khác có thể cung cấp nguồn cấp dữ liệu theo trình tự thời gian không được xếp hạng. Một người khác có thể chuyên về quyền riêng tư, dịch thuật, kiểm duyệt, khám phá cộng đồng hoặc biểu đồ xã hội thích hợp.

Nếu xét về mặt kinh tế, các dịch vụ nguồn cấp dữ liệu được hỗ trợ bởi RPC có thể bổ sung các tính năng AI tương tự như những gì các nền tảng chính thống đang cố gắng đưa vào nguồn cấp dữ liệu của họ: bản dịch tự động, bản tóm tắt, câu trả lời được bot hỗ trợ, câu trả lời tìm kiếm, hỗ trợ kiểm duyệt hoặc bối cảnh kiểu ghi chú của cộng đồng.

Những tính năng đó phải là lựa chọn dịch vụ chứ không phải yêu cầu về giao thức. RPC mặc định có thể cạnh tranh bằng cách cung cấp nguồn cấp dữ liệu phong phú hơn, nhưng người dùng và các ứng dụng khách cạnh tranh vẫn có thể chọn các lựa chọn thay thế đơn giản hơn, riêng tư, theo trình tự thời gian, không có quảng cáo hoặc dành riêng cho cộng đồng.

## RPC không kiểm soát danh tính hoặc hồ sơ của người dùng

Mỗi người dùng sẽ có thể tham gia với tư cách là một nút ngang hàng đầy đủ thông qua RPC mà không cấp cho nhà cung cấp RPC quyền sở hữu đối với danh tính hoặc hồ sơ của họ.

Đường dẫn được lưu trữ quan trọng vì hầu hết người dùng sẽ không bắt đầu bằng cách chạy máy chủ. Đường dẫn thoát cũng quan trọng không kém: người dùng có thể di chuyển đến nút hồ sơ của riêng họ trên phần cứng có thông số kỹ thuật thấp, bao gồm Raspberry Pi, bất cứ khi nào họ muốn.

Đó là sự khác biệt giữa sự thuận tiện và việc trao quyền kiểm soát cho nhà cung cấp.

## Đối thoại công khai được Bitsocial Chain củng cố

Bitsocial Chain có thể đưa khả năng đặt tên bền vững, thanh toán, tiền boa, phần thưởng và các cơ chế tài chính khác trực tiếp vào đối thoại công khai.

Ứng dụng khách Giai đoạn 3 vẫn tập trung vào bài đăng, văn bản, chia sẻ ý tưởng và thảo luận theo thời gian thực, đồng thời chia sẻ cộng đồng và hiệu ứng mạng với các ứng dụng khách Bitsocial khác.
