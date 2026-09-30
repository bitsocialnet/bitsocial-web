---
title: Lịch sử token BSO
description: Toàn bộ lịch sử các thế hệ của token BSO, từ khởi nguồn trên Avalanche năm 2021 đến hợp đồng Ethereum bất biến, không quản trị viên của ngày hôm nay.
---

# Lịch sử token BSO

BSO là một đồng token mà giá trị nằm ở nguồn gốc. Giao thức đứng sau Bitsocial là mở, còn token và chuỗi thì tùy chọn theo đúng thiết kế: ai cũng có thể fork mã nguồn, chạy ứng dụng khách riêng, hoặc xây dựng nền kinh tế của riêng mình bên trên đó. Thứ không thể fork đi được là nguồn gốc. BSO là token chính thức của Bitsocial ngay từ ngày đầu, và mọi lần di chuyển kể từ đó đều có thể kiểm chứng trên chuỗi.

Trang này liệt kê từng thế hệ của token theo thứ tự, kèm địa chỉ hợp đồng đầy đủ để bất kỳ ai cũng có thể tự đối chiếu hồ sơ một cách độc lập.

## Gen 1: khởi nguồn, Avalanche, 2021

- **Chuỗi**: Avalanche
- **Năm**: 2021
- **Địa chỉ**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Trình khám phá**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Đây là nơi BSO bắt đầu. Nguồn cung được phát miễn phí qua ba đợt airdrop và phần thưởng khai thác thanh khoản, không có đợt bán trước và không có phần phân bổ nào dành riêng cho đội ngũ được cắt ra trước cộng đồng. Hợp đồng khi đó là một proxy có thể nâng cấp, vốn là thông lệ phổ biến ở thời điểm ấy và cho phép đội ngũ phát hành các bản sửa lỗi trong giai đoạn đầu đời của token.

## Gen 2: chuyển sang Ethereum, 2024

- **Chuỗi**: Ethereum
- **Năm**: 2024
- **Địa chỉ**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Trình khám phá**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 đưa BSO từ Avalanche sang Ethereum, nơi phần còn lại của lộ trình Bitsocial Chain được xây dựng. Giống Gen 1, hợp đồng này vẫn là một proxy có thể nâng cấp, được giữ thêm một thế hệ nữa trong lúc hợp đồng cuối cùng và vĩnh viễn đang được chuẩn bị.

## Gen 3: bất biến hoàn toàn, 2025

- **Chuỗi**: Ethereum
- **Năm**: 2025
- **Địa chỉ**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Trình khám phá**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 là hợp đồng BSO hiện hành và cũng là hợp đồng cuối cùng. Nó bất biến hoàn toàn và không có quản trị viên:

- không có hàm phát hành thêm, nên nguồn cung không thể bị thổi phồng
- không có địa chỉ chủ sở hữu, nên không ai có thể đơn phương thay đổi hành vi của hợp đồng
- không có hàm tạm dừng, nên không thể đóng băng việc chuyển token
- không có mô hình proxy, nên bản thân phần logic cũng không thể bị thay thế về sau

Đây chính là trạng thái cuối mà hai thế hệ đầu tiên hướng tới: một token không còn khóa quản trị nào để ai đó nắm giữ.

## Các lần di chuyển đã diễn ra như thế nào

Mỗi lần di chuyển, từ Gen 1 sang Gen 2 và từ Gen 2 sang Gen 3, đều là một đợt airdrop thụ động theo tỷ lệ 1:1. Người nắm giữ không cần gửi yêu cầu nhận, không cần ký thông điệp, không cần làm gì cả. Số dư trên hợp đồng cũ được đọc trực tiếp và sao chiếu 1:1 sang hợp đồng mới, nên vị thế của người nắm giữ được bảo toàn chính xác qua mỗi lần di chuyển.

Vì cả hợp đồng cũ lẫn hợp đồng mới đều vẫn công khai và nằm trên chuỗi, mọi bước của quá trình này đều có thể kiểm chứng độc lập. Bất kỳ ai cũng có thể đối chiếu ảnh chụp số dư lịch sử của người nắm giữ ở Gen 1 hoặc Gen 2 với số dư Gen 3 hiện tại và xác nhận rằng lần di chuyển đúng như những gì nó tuyên bố. Không phần nào trong lịch sử này buộc bạn phải tin vào lời của Bitsocial.

## Hãy tự kiểm chứng mọi thứ

Đừng chấp nhận bất cứ điều gì ở trên chỉ bằng niềm tin. Hãy kiểm tra hồ sơ trực tiếp:

- Gen 1 trên [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 trên [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 trên [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- trang chuỗi hiện tại tại [chain.bitsocial.net](https://chain.bitsocial.net)

Nếu một địa chỉ không khớp với những gì được liệt kê ở đây, đó không phải token BSO chính thức.
