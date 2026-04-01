---
title: Thử thách Canvas Captcha
description: Trình tạo hình ảnh xác thực dựa trên hình ảnh độc lập với các ký tự, kích thước và màu sắc có thể định cấu hình.
sidebar_position: 2
---

# Thử thách Canvas Captcha

:::warning Legacy Naming
Gói này ban đầu được xuất bản trong phạm vi `@plebbit`. Nó đã được đổi tên thành `@bitsocial/captcha-canvas-challenge`. Các tham chiếu đến tên cũ vẫn có thể xuất hiện trong tài liệu hoặc cơ sở mã cũ hơn.
:::

Captcha Canvas Challenge là một trình tạo hình ảnh xác thực độc lập ban đầu được trích xuất từ ​​`plebbit-js`. Nó hiển thị văn bản ngẫu nhiên trên khung vẽ HTML và trả về hình ảnh thu được mà cộng đồng có thể hiển thị cho tác giả dưới dạng thách thức spam.

**Mã nguồn:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Yêu cầu

- **Node.js** >= 22
- **Chỉ dành cho ESM** -- gói này không gửi các bản dựng CommonJS.
- **Phụ thuộc ngang hàng trong thời gian chạy:** `@plebbit/plebbit-js` (di chuyển sang `@pkc/pkc-js`)

## Cài đặt

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Tùy chọn cấu hình

| Tùy chọn     | Loại     | Mặc định  | Mô tả                                                      |
| ------------ | -------- | --------- | ---------------------------------------------------------- |
| `characters` | `number` | `6`       | Số ký tự ngẫu nhiên được hiển thị trong hình ảnh xác thực. |
| `height`     | `number` | `100`     | Chiều cao của hình ảnh được tạo bằng pixel.                |
| `width`      | `number` | `300`     | Chiều rộng của hình ảnh được tạo bằng pixel.               |
| `colors`     | `string` | `#32cf7e` | Màu chính được sử dụng cho văn bản xác thực.               |

## Nó hoạt động như thế nào

1. Trình tạo chọn một chuỗi ngẫu nhiên có độ dài được định cấu hình.
2. Chuỗi được hiển thị trên canvas có nhiễu hình ảnh để chống lại OCR.
3. Hình ảnh thu được (và câu trả lời mong đợi) được trả về để ứng dụng gọi điện có thể đưa ra thử thách và sau đó xác minh phản hồi.

Vì gói này là một trình tạo hình ảnh thuần túy nên nó không tự xử lý việc quản lý mạng hoặc phiên. Nó nhằm mục đích được tích hợp vào luồng thách thức lớn hơn -- ví dụ: là một trong những loại thách thức được hỗ trợ bởi [chế chặn thư rác](./spam-blocker.md).
