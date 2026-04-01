---
title: Mintpass
description: Hệ thống xác thực dựa trên NFT giúp cộng đồng Bitsocial xác minh người dùng và giảm các cuộc tấn công sybil.
sidebar_position: 2
---

# Mintpass

Mintpass là một hệ thống xác thực dựa trên NFT dành cho cộng đồng Bitsocial. Người dùng tạo ra NFT xác minh không thể chuyển nhượng sau khi hoàn thành một thử thách (chẳng hạn như SMS OTP) và cộng đồng có thể kiểm tra quyền sở hữu NFT để đề phòng các cuộc tấn công giả mạo như phiếu bầu giả, trốn tránh lệnh cấm và spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Giấy phép**: MIT

## Nó hoạt động như thế nào

Luồng xác minh có bốn bước:

1. **Yêu cầu** -- Người dùng truy cập `mintpass.org/request` để bắt đầu quá trình.
2. **Thử thách** -- Người dùng hoàn tất xác minh mật khẩu một lần qua SMS.
3. **Đúc tiền** -- Sau khi xác minh thành công, NFT không thể chuyển nhượng sẽ được đúc vào ví của người dùng.
4. **Xác minh** -- Cộng đồng truy vấn quyền sở hữu NFT để xác nhận người dùng đã được xác minh.

Vì NFT không thể chuyển nhượng nên nó vẫn bị ràng buộc với ví đã hoàn tất xác minh, ngăn người dùng giao dịch hoặc bán trạng thái đã xác minh của họ.

## Cấu trúc dự án

Kho lưu trữ được tổ chức thành ba khu vực chính:

| Thư mục      | Mục đích                                                        |
| ------------ | --------------------------------------------------------------- |
| `contracts/` | Hợp đồng thông minh vững chắc để xác minh NFT.                  |
| `challenge/` | Lớp tích hợp cho hệ thống thử thách Bitsocial.                  |
| `web/`       | Giao diện người dùng Next.js và React dành cho luồng khai thác. |

## Quyền riêng tư và xử lý dữ liệu

Mintpass áp dụng cách tiếp cận dữ liệu tối thiểu:

- **Dữ liệu hoạt động** (mã OTP, mã thông báo phiên) được lưu trữ trong Redis với các TTL ngắn và tự động hết hạn.
- **Liên kết đúc tiền** (liên kết giữa danh tính đã được xác minh và ví) là bản ghi liên tục duy nhất.

Không có số điện thoại hoặc thông tin cá nhân nào được giữ lại sau khi cửa sổ xác minh đóng lại.

## Lớp bảo mật tùy chọn

Các nhà điều hành cộng đồng có thể kích hoạt các biện pháp bảo vệ bổ sung tùy thuộc vào mô hình mối đe dọa của họ:

- **Kiểm tra danh tiếng IP** -- Chấm điểm các yêu cầu gửi đến dựa trên cơ sở dữ liệu lạm dụng đã biết.
- **Đánh giá rủi ro điện thoại** -- Gắn cờ các số VoIP hoặc số dùng một lần trước khi đưa ra thử thách.
- **Khóa địa lý** -- Hạn chế xác minh ở các khu vực cụ thể.
- **Thời gian hồi chiêu trên mỗi IP** -- Số lần thử xác minh lặp lại có giới hạn tỷ lệ từ cùng một địa chỉ.

## Ngăn xếp công nghệ

| Lớp                  | Công nghệ                                        |
| -------------------- | ------------------------------------------------ |
| Hợp đồng             | Solidity, được triển khai với Hardhat và Foundry |
| Giao diện người dùng | Next.js + Phản ứng                               |
| Mạng                 | Cơ sở (Ethereum L2)                              |

Việc triển khai trên Base giúp chi phí gas ở mức thấp đồng thời thừa hưởng sự đảm bảo an ninh của Ethereum.

## Lộ trình

Các cải tiến theo kế hoạch bao gồm:

- **Tùy chọn trả tiền để đúc tiền** -- Cho phép cộng đồng yêu cầu một khoản phí nhỏ cho việc đúc tiền, bổ sung thêm rào cản kinh tế.
- **Tín hiệu xác minh bổ sung** -- Mở rộng ngoài SMS sang các tín hiệu nhận dạng khác.
- **Công cụ quản trị mở rộng** -- Bảng điều khiển và bảng điều khiển phong phú hơn dành cho người điều hành cộng đồng.
