---
title: EVM Contract Call Challenge
description: Thử thách chống thư rác xác minh các điều kiện trên chuỗi bằng cách gọi hợp đồng thông minh EVM.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Đặt tên kế thừa
Gói này ban đầu được xuất bản trong phạm vi `@plebbit`. Nó đã được đổi tên thành `@bitsocial/evm-contract-challenge`. Các tham chiếu đến tên cũ vẫn có thể xuất hiện trong tài liệu hoặc cơ sở mã cũ hơn.
:::

Thử thách cuộc gọi hợp đồng EVM là một cơ chế chống thư rác nhằm xác minh các điều kiện trên chuỗi trước khi cho phép xuất bản. Ban đầu được trích xuất từ ​​`plebbit-js` dưới dạng một gói độc lập, nó cho phép chủ sở hữu cộng đồng yêu cầu tác giả đáp ứng các tiêu chí do hợp đồng thông minh xác định -- ví dụ: giữ số dư mã thông báo tối thiểu -- để đăng.

**Mã nguồn:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Yêu cầu

- **Node.js** >= 22
- **Chỉ dành cho ESM** -- gói này không gửi các bản dựng CommonJS.
- **Phụ thuộc ngang hàng trong thời gian chạy:** `@plebbit/plebbit-js` (di chuyển sang `@pkc/pkc-js`)

## Cài đặt

```bash
npm install @bitsocial/evm-contract-challenge
```

## Tùy chọn cấu hình

| Tùy chọn      | Loại     | Mô tả                                                                                    |
| ------------- | -------- | ---------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Chuỗi cần truy vấn (ví dụ: `eth`, `matic`, `avax`).                                      |
| `address`     | `string` | Địa chỉ hợp đồng thông minh để gọi.                                                      |
| `abi`         | `string` | Đoạn ABI cho hàm đang được gọi.                                                          |
| `condition`   | `string` | Biểu thức so sánh được đánh giá dựa trên giá trị trả lại của hợp đồng (ví dụ: `> 1000`). |
| `error`       | `string` | Thông báo lỗi hiển thị cho các tác giả không đáp ứng điều kiện.                          |

## Ví dụ

Chủ sở hữu cộng đồng muốn hạn chế đăng bài đối với các tác giả nắm giữ hơn 1.000 mã thông báo ERC-20 cụ thể sẽ định cấu hình thử thách bằng:

- `chainTicker`: `"eth"`
- `address`: địa chỉ hợp đồng mã thông báo
- `abi`: ABI cho `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Khi một tác giả cố gắng xuất bản, thử thách sẽ gọi `balanceOf` kèm theo địa chỉ của tác giả và kiểm tra xem giá trị trả về có thỏa mãn điều kiện hay không. Nếu có, việc xuất bản sẽ tiếp tục; nếu không, thông báo lỗi đã cấu hình sẽ được trả về.

## Khi nào nên sử dụng nó

Thử thách cuộc gọi hợp đồng EVM lý tưởng cho:

- **Cộng đồng kiểm soát mã thông báo** hạn chế đăng bài cho chủ sở hữu mã thông báo.
- **Quyền truy cập được kiểm soát bởi NFT** trong đó yêu cầu quyền sở hữu một NFT cụ thể.
- **Không gian quản trị DAO** nơi sự tham gia được giới hạn ở chủ sở hữu mã thông báo quản trị.

Đối với các cộng đồng không dựa vào danh tính trên chuỗi, thay vào đó hãy xem xét [Spam Blocker](./spam-blocker.md) hoặc [Voucher Challenge](./voucher-challenge.md).
