---
title: Voucher Challenge
description: Thử thách chống thư rác ngăn chặn việc xuất bản các mã phiếu thưởng duy nhất do chủ sở hữu cộng đồng phân phối.
sidebar_position: 3
---

# Voucher Challenge

Thử thách phiếu thưởng là một cơ chế chống thư rác nhằm kiểm soát việc xuất bản nội dung bằng các mã phiếu thưởng duy nhất. Thay vì dựa vào khả năng phát hiện tự động, nó chuyển niềm tin sang chủ sở hữu cộng đồng, người sẽ phân phối mã theo cách thủ công cho những người mà họ tin tưởng.

**Mã nguồn:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Nó hoạt động như thế nào

1. Chủ sở hữu cộng đồng tạo một hoặc nhiều mã chứng từ duy nhất.
2. Chủ sở hữu phân phối các mã đó cho các tác giả đáng tin cậy thông qua kênh mà họ lựa chọn (tin nhắn trực tiếp, email, trực tiếp, v.v.).
3. Khi một tác giả cố gắng xuất bản, hệ thống thử thách sẽ nhắc họ nhập mã chứng từ.
4. Mã được xác thực -- nếu mã đó là chính hãng và chưa được sử dụng thì ấn phẩm sẽ được chấp nhận.

Mỗi mã phiếu thưởng được gắn với một tác giả cụ thể sau khi đổi, ngăn người khác sử dụng lại.

## Khi nào nên sử dụng nó

Thử thách Voucher phù hợp nhất cho:

- **Cộng đồng chỉ mời** nơi tư cách thành viên bị hạn chế có chủ ý.
- **Không gian được tuyển chọn** nơi chủ sở hữu đích thân kiểm tra từng người tham gia.
- **Môi trường có độ tin cậy cao** nơi việc chấm điểm thư rác tự động là không cần thiết hoặc không mong muốn.

Bởi vì nó yêu cầu phân phối mã thủ công nên nó không mở rộng ra các cộng đồng mở lớn. Đối với những trường hợp đó, hãy xem xét [Spam Blocker](./spam-blocker.md) hoặc [EVM Contract Call Challenge](./evm-contract-call.md) thay thế.

## Tích hợp

Thử thách Voucher cắm vào giao diện thử thách tương tự được sử dụng bởi các gói chống thư rác khác trong hệ sinh thái Bitsocial. Chủ sở hữu cộng đồng kích hoạt nó thông qua cài đặt cộng đồng của họ và thử thách sẽ tự động được đưa ra cho tác giả khi họ cố gắng đăng bài.
