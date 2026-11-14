---
title: Bitsocial Chain
description: Giai đoạn 3 của kế hoạch tổng thể, trình bày lớp kinh tế appchain Ethereum L2 được đề xuất cho các ứng dụng Bitsocial.
---

# Bitsocial Chain

Bitsocial Chain là lớp kinh tế appchain Ethereum L2 được đề xuất cho các ứng dụng Bitsocial. Trang
web dành riêng cho chuỗi này hiện nằm tại [chain.bitsocial.net](https://chain.bitsocial.net).

Lớp xã hội ngang hàng cho phép cộng đồng, danh tính và nội dung tồn tại bên ngoài cơ sở dữ liệu của
một nền tảng tập trung. Bitsocial Chain nhằm bổ sung các thành phần nền tảng dùng chung cho việc đặt
tên, kiếm tiền và thanh toán, những thứ khiến các ứng dụng đó khó bị cắt nguồn tài chính hơn.

## Nó dự kiến hỗ trợ những gì

- các tên miền Bitsocial phi tập trung như `.bso`
- trao thưởng và tặng tiền boa
- hạ tầng kiếm tiền bền vững
- thanh khoản dùng chung giữa các ứng dụng
- các cấu trúc tài chính mà ngân hàng hay nền tảng khó bóp nghẹt hơn
- hiệu ứng mạng không phụ thuộc vào việc một công ty sở hữu toàn bộ hạ tầng

Mục tiêu không phải là đặt cơ chế token lên hàng đầu. Mục tiêu là làm cho những ứng dụng xã hội hữu
ích trở nên bền vững hơn, dễ gọi vốn hơn và bớt phụ thuộc vào các nhà cung cấp thanh toán hay dịch vụ
đặt tên tập trung.

## Bản chứng minh khái niệm hiện tại

Bản chứng minh khái niệm đầu tiên của Bitsocial Chain tập trung vào các tên `.bso` gốc. Nó cho thấy
một sổ đăng ký tên có thể được suy ra từ lịch sử Ethereum L1 mà không cần đưa nội dung xã hội lên
chuỗi:

- người dùng gửi các ý định đăng ký, cập nhật, chuyển nhượng và thu hồi thông qua những giao dịch
  Ethereum L1 thông thường
- bất kỳ ai cũng có thể chạy node suy dẫn và dựng lại đúng trạng thái sổ đăng ký `.bso` đó
- một bộ phân giải ánh xạ tên `.bso` sang khóa công khai Bitsocial mà các ứng dụng khách vốn đã dùng
  trên giao thức ngang hàng
- bài đăng, lượt bình chọn, kiểm duyệt, nguồn cấp dữ liệu và nội dung cộng đồng vẫn nằm ngoài chuỗi
  và giữ tính ngang hàng

Bản chứng minh khái niệm đó chưa phải là một lần ra mắt Stage 2 ở môi trường sản xuất. Nó chưa có hệ
thống chứng minh, cơ chế tranh chấp, mã nguồn đã kiểm toán, bản triển khai chính thức, biểu phí cuối
cùng hay mô hình quản trị cuối cùng. Định hướng dài hạn của nó là minh bạch theo mặc định và tương
thích với quyền riêng tư ngay từ khâu thiết kế: chuỗi lõi là công khai, còn các tính năng tặng tiền
boa, thanh toán, trao thưởng và thanh khoản trong tương lai nên tránh việc buộc gắn vĩnh viễn danh
tính xã hội với lịch sử ví.

## Vì sao điều này quan trọng

Phi tập trung hóa cộng đồng và danh tính là điều cần thiết, nhưng chừng đó chưa đủ để phi tập trung
hóa toàn bộ mạng xã hội.

Nếu các ứng dụng xã hội vẫn phụ thuộc vào một vài hạ tầng kinh tế tập trung, chúng vẫn dễ bị gây sức
ép, bị loại khỏi nền tảng hoặc bị cắt nguồn tài chính. Bitsocial Chain là lời giải được đề xuất cho
lớp phụ thuộc thứ hai đó.

## Quan hệ với các ứng dụng

Bitsocial Chain nên nằm bên dưới các ứng dụng Bitsocial chứ không thay thế chúng.

Kết quả mà người dùng nhìn thấy nên là:

- cộng đồng vẫn giữ tính ngang hàng
- các ứng dụng vẫn giữ được nét riêng
- người dùng có được những tính năng đặt tên và kiếm tiền thiết thực
- nhà sáng tạo và cộng đồng có thể nhận ủng hộ từ nhiều ứng dụng khách khác nhau
- giá trị có thể luân chuyển trong hệ sinh thái mà không tái tạo ra một chủ sở hữu nền tảng tập trung

## Vì sao phần này đến sau giải pháp thay thế Twitter/X

Kế hoạch tổng thể hiện tại đặt Bitsocial Chain sau giải pháp thay thế Twitter/X, vì ứng dụng đó không cần chuỗi. Hồ sơ chạy như các nút hồ sơ thông qua RPC không lưu ký, và tên `.bso` có thể bắt đầu trên một sổ đăng ký tạm thời trên mạng chính Ethereum ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) rồi chuyển sang chuỗi sau này.

Bitsocial Chain không nên đánh đổi tính phi tập trung để ra mắt sớm hơn. Nó không nên thêm bất kỳ giả định tin cậy nào ngoài chính Ethereum: không có khóa nâng cấp, không có hội đồng bảo mật và không có nhà vận hành nào có thể kiểm duyệt hay dừng nó. Thiết kế hàng đầu cho điều đó, một native rollup, phụ thuộc vào một bản nâng cấp Ethereum chưa được lên lịch. Cho đến khi chuỗi có thể đạt chuẩn đó, giải pháp thay thế Twitter/X sẽ phát triển cơ sở người dùng mà chuỗi sẽ phục vụ.

## Nguyên tắc thiết kế

Vì Bitsocial Chain vẫn là hạ tầng được đề xuất chứ chưa phải sản phẩm đã ra mắt, kế hoạch cần giữ kỷ
luật:

- Ứng dụng và cộng đồng đi trước. Lớp mạng phải làm cho các sản phẩm xã hội thực tế mạnh hơn.
- Tính năng thiết thực đi trước. Tên miền, trao thưởng, tặng tiền boa và thanh toán dễ giải thích hơn
  so với một kiến trúc tài chính trừu tượng.
- Đóng góp thực chất quan trọng hơn hype. Các thành phần kinh tế nền tảng nên tưởng thưởng cho sự
  tham gia, việc xây dựng và sự ủng hộ cộng đồng.
- Việc chọn lọc là hợp lệ. Các ứng dụng có thể định hình xếp hạng, thiết lập mặc định và khả năng
  khám phá để ưu tiên những cộng đồng bền vững.
- Cơ chế cụ thể vẫn còn để ngỏ. Trang này giải thích vai trò của Bitsocial Chain, chứ không phải một
  lời hứa cố định về mô hình kinh tế cuối cùng.
