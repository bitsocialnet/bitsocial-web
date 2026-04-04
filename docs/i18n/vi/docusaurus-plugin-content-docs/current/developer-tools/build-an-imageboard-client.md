---
title: Xây dựng ứng dụng khách bảng hình ảnh
description: Hướng dẫn đóng góp Giai đoạn 1 dành cho những người xây dựng muốn cung cấp trải nghiệm bảng hình ảnh mới trên Bitsocial.
sidebar_position: 1
---

# Xây dựng ứng dụng khách bảng hình ảnh

Giai đoạn 1 không phải là về một ứng dụng chính thức bao trùm toàn bộ danh mục. 5chan là điểm chứng minh đầu tiên, nhưng mục tiêu thực tế là một hệ sinh thái bảng hình ảnh rộng lớn: nhiều ứng dụng khách Bitsocial với các ngôn ngữ hình ảnh khác nhau, mặc định kiểm duyệt, mô hình thư mục và cộng đồng mục tiêu.

## Giai đoạn 1 cần gì

- Các khách hàng kiểu 4chan quen thuộc để làm quen với xu hướng phổ biến
- Khách hàng lấy cảm hứng từ Altchan với các nền văn hóa và gói hội đồng khác nhau
- Ứng dụng khách ưu tiên di động hoặc có băng thông thấp
- Các khách hàng thuộc một cộng đồng hoặc một nhóm khách hàng có mặc định có quan điểm mạnh mẽ
- Các luồng kiểm duyệt, phương tiện, giới thiệu hoặc khám phá tốt hơn so với ứng dụng đầu tiên được cung cấp

## Cách giúp đỡ nhanh nhất

Nếu bạn muốn con đường vận chuyển ngắn nhất, trước tiên hãy đóng góp trực tiếp cho 5chan:

- Khám phá ứng dụng trực tiếp tại [5chan.app](https://5chan.app)
- Xem lại nguồn tại [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Tham gia cuộc trò chuyện của người xây dựng tại [t.me/5chandev](https://t.me/fivechandev)

## Xây dựng khách hàng của riêng bạn

Nếu 5chan không phù hợp với cộng đồng hoặc giao diện bạn muốn, thay vào đó hãy xây dựng một ứng dụng khách riêng. Các máy khách Bitsocial tương thích có thể chia sẻ cùng một mạng mà không cần chia sẻ các quyết định về sản phẩm giống nhau.

1. Tìm hiểu các công cụ đối mặt với giao thức:
   - [Móc phản ứng Bitsocial](../react-hooks/)
   - [CLI xã hội Bit](../cli/)
2. Quyết định loại bảng hình ảnh bạn đang thực sự xây dựng.
Trước tiên, hãy chọn cấu trúc bảng, giả định nhận dạng, mô hình kiểm duyệt, luồng khám phá và ngôn ngữ hình ảnh.
3. Chọn lộ trình thực hiện phù hợp với dự án.
Fork 5chan nếu bạn muốn di chuyển nhanh với đế imageboard quen thuộc. Bắt đầu mới nếu giao diện người dùng hoặc mô hình tương tác cần phải khác biệt hoàn toàn.
4. Gửi một phiên bản đầu tiên hẹp.
Một khách hàng phục vụ tốt một cộng đồng thực sự sẽ có giá trị hơn một bản sao mơ hồ nhằm mục đích làm hài lòng tất cả mọi người.
5. Công bố kết quả và để cộng đồng kiểm tra nó.
Bitsocial cải thiện khi các nhà xây dựng bên ngoài cung cấp những khách hàng có quan điểm cạnh tranh về chất lượng sản phẩm thay vì chờ đợi một ứng dụng chính thức làm mọi thứ.

## Nguyên tắc thiết kế

Bitsocial không giành chiến thắng nếu chỉ có một khách hàng may mắn. Nó thắng khi nhiều khách hàng có thể cùng tồn tại, phân nhánh, chuyên môn hóa và phục vụ các nhu cầu mà ứng dụng đầu tiên sẽ không bao giờ làm được.
