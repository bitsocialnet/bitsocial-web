---
title: Tự xây dựng ứng dụng khách Bitsocial của bạn
description: Hướng dẫn dành cho nhà phát triển muốn ra mắt ứng dụng khách Bitsocial độc lập, từ bảng hình ảnh và diễn đàn cho tới các ứng dụng xã hội ngách.
---

# Tự xây dựng ứng dụng khách Bitsocial của bạn

Bitsocial không thắng nhờ có một ứng dụng chính thức cho mọi tình huống sử dụng. Nó thắng khi nhiều ứng dụng khách cùng dùng chung một giao thức trong lúc cạnh tranh nhau về giao diện, văn hóa, khả năng khám phá, thiết lập mặc định và mô hình kinh doanh.

5chan và Seedit là những minh chứng ban đầu, không phải mức trần. Một nhà phát triển phải có thể ra mắt một bảng hình ảnh mới, một diễn đàn, một ứng dụng khách hồ sơ, một ứng dụng xã hội ưu tiên di động, một công cụ cộng đồng ngách, hoặc một ứng dụng khách tập trung dùng Bitsocial ở bên dưới, mà không cần xin phép bất kỳ chủ sở hữu nền tảng nào.

## Nhà phát triển có thể thay đổi những gì

Một ứng dụng khách Bitsocial có thể cạnh tranh bằng các quyết định sản phẩm mà không cần fork toàn bộ mạng lưới:

- giao diện và ngôn ngữ hình ảnh
- luồng làm quen ban đầu
- thiết lập mặc định của cộng đồng
- các bề mặt kiểm duyệt
- mô hình khám phá
- trải nghiệm đa phương tiện
- ràng buộc về di động, máy tính để bàn hoặc băng thông thấp
- cách kiếm tiền và mô hình kinh doanh

Lớp dùng chung là giao thức. Lớp sản phẩm để ngỏ cho cạnh tranh.

## Cách học nhanh nhất

Hãy bắt đầu từ những ứng dụng đã có sẵn:

- Thử [5chan](https://5chan.app) cho các cộng đồng bảng hình ảnh ẩn danh.
- Thử [Seedit](https://seedit.app) cho thảo luận kiểu Reddit.
- Đọc tài liệu [Bitsocial React hooks](https://hooks.bitsocial.net/docs/quickstart/) để tích hợp ở phía ứng dụng khách.
- Đọc tài liệu [Bitsocial CLI](/developer-tools/cli/) cho các thao tác với nút và cộng đồng.

Nếu muốn đi nhanh, trước hết hãy đóng góp cho một ứng dụng đã có. Nếu giao diện, văn hóa hoặc mô hình cộng đồng mà bạn muốn không phù hợp ở đó, hãy dựng một ứng dụng khách riêng.

## Chọn một phiên bản đầu tiên thật hẹp

Phiên bản đầu tiên tốt nhất không phải là một ứng dụng xã hội đa năng. Đó là một ứng dụng khách có một nhóm người dùng rõ ràng và một lý do mạnh mẽ để tồn tại.

Vài điểm khởi đầu tốt:

- một ứng dụng khách bảng hình ảnh gọn gàng hơn cho một nền văn hóa cụ thể
- một ứng dụng khách diễn đàn ưu tiên di động
- một ứng dụng phục vụ đúng một cộng đồng với thiết lập mặc định nghiêm ngặt
- một ứng dụng khách dành cho cộng đồng nhà sáng tạo
- một ứng dụng khách khám phá ở chế độ chỉ đọc
- một bảng điều khiển dành cho người kiểm duyệt hoặc người vận hành
- một ứng dụng khách tối ưu cho một ngôn ngữ, một khu vực hoặc một dòng thiết bị

Những ứng dụng khách nhỏ vẫn hữu ích, vì Bitsocial cho phép chúng lớn lên trong cùng một mạng lưới thay vì nhốt người dùng của chúng trong một cơ sở dữ liệu riêng.

## Các hướng triển khai

Có ba hướng khả thi:

1. Fork một ứng dụng khách sẵn có khi ý tưởng của bạn gần với 5chan hoặc Seedit.
2. Dựng một ứng dụng khách React mới bằng [Bitsocial React hooks](https://hooks.bitsocial.net/).
3. Tự xây dựng phần tích hợp của riêng bạn trên các API của nút và hạ tầng RPC công khai.

RPC công khai sẽ khiến hướng thứ ba thực tế hơn nhiều. Người dùng có thể bắt đầu qua một nhà cung cấp RPC được lưu trữ sẵn và không nắm quyền quản lý khóa, rồi sau đó chuyển sang tự vận hành hoặc sang một nhà cung cấp cạnh tranh khác.

## Nguyên tắc thiết kế

Hãy dựng đúng ứng dụng khách mà cộng đồng của bạn cần có, rồi để các ứng dụng khách tương thích cạnh tranh công khai với nhau.
