---
title: React Hooks
description: Thư viện React hooks để xây dựng các ứng dụng xã hội phi tập trung trên giao thức Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning Đặt tên kế thừa
Gói này hiện đang sử dụng các quy ước đặt tên cũ được kế thừa từ nhánh ngược dòng của nó. Các tham chiếu đến "plebbit" trong mã, API và cấu hình sẽ được chuyển sang "bitsocial" trong bản phát hành trong tương lai. Chức năng không bị ảnh hưởng.
:::

Gói `bitsocial-react-hooks` cung cấp API hook React quen thuộc để tương tác với giao thức Bitsocial. Nó xử lý việc tìm nạp nguồn cấp dữ liệu, nhận xét và hồ sơ tác giả, quản lý tài khoản, xuất bản nội dung và đăng ký cộng đồng -- tất cả đều không cần dựa vào máy chủ trung tâm.

Thư viện này là giao diện chính được sử dụng bởi [5chan](/apps/5chan/) và các ứng dụng khách Bitsocial khác.

:::note
`bitsocial-react-hooks` là một nhánh tạm thời của `plebbit/plebbit-react-hooks` được duy trì để phát triển với sự hỗ trợ của AI. Nó được sử dụng trực tiếp từ GitHub thay vì được xuất bản lên npm.
:::

## Cài đặt

Vì gói chưa có trên npm, nên hãy cài đặt nó trực tiếp từ GitHub, ghim vào hàm băm xác nhận cụ thể:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Thay thế `<commit-hash>` bằng cam kết bạn muốn nhắm mục tiêu.

## Tổng quan về API

Các hook được tổ chức thành các loại chức năng. Dưới đây là bản tóm tắt các hook được sử dụng phổ biến nhất trong mỗi danh mục. Để biết đầy đủ về chữ ký, tham số và kiểu trả về, hãy xem [tham chiếu API đầy đủ trên GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Tài khoản

Quản lý tài khoản người dùng cục bộ, danh tính và cài đặt.

- `useAccount(accountName?)` -- trả về đối tượng tài khoản đang hoạt động (hoặc được đặt tên)
- `useAccounts()` - trả về tất cả tài khoản được lưu trữ cục bộ
- `useAccountComments(options?)` -- trả về các nhận xét được đăng bởi tài khoản đang hoạt động

### Bình luận

Tìm nạp và tương tác với các nhận xét và chủ đề riêng lẻ.

- `useComment(commentCid?)` -- tìm nạp một nhận xét bằng CID của nó
- `useComments(commentCids?)` - tìm nạp nhiều nhận xét theo đợt
- `useEditedComment(comment?)` -- trả về phiên bản chỉnh sửa mới nhất của nhận xét

### Cộng đồng

Truy xuất siêu dữ liệu và cài đặt cộng đồng.

- `useSubplebbit(subplebbitAddress?)` -- tìm nạp cộng đồng theo địa chỉ
- `useSubplebbits(subplebbitAddresses?)` -- tìm nạp nhiều cộng đồng
- `useSubplebbitStats(subplebbitAddress?)` -- trả về số người đăng ký và số bài đăng

### tác giả

Tra cứu hồ sơ tác giả và siêu dữ liệu.

- `useAuthor(authorAddress?)` - tìm nạp hồ sơ tác giả
- `useAuthorComments(options?)` -- trả về nhận xét của một tác giả cụ thể
- `useResolvedAuthorAddress(authorAddress?)` - phân giải địa chỉ con người có thể đọc được (ví dụ: ENS) thành địa chỉ giao thức của nó

### Nguồn cấp dữ liệu

Đăng ký và phân trang nguồn cấp dữ liệu nội dung.

- `useFeed(options?)` -- trả về nguồn cấp dữ liệu bài đăng được phân trang từ một hoặc nhiều cộng đồng
- `useBufferedFeeds(feedOptions?)` -- đệm trước nhiều nguồn cấp dữ liệu để hiển thị nhanh hơn
- `useAuthorFeed(authorAddress?)` -- trả về nguồn cấp dữ liệu bài đăng của một tác giả cụ thể

### hành động

Xuất bản nội dung và thực hiện các thao tác ghi.

- `usePublishComment(options?)` -- đăng nhận xét hoặc phản hồi mới
- `usePublishVote(options?)` -- bỏ phiếu tán thành hoặc phản đối
- `useSubscribe(options?)` -- đăng ký hoặc hủy đăng ký khỏi cộng đồng

### Các bang và RPC

Giám sát trạng thái kết nối và tương tác với daemon Bitsocial từ xa.

- `useClientsStates(options?)` - trả về trạng thái kết nối của máy khách IPFS/pubsub
- `usePlebbitRpcSettings()` - trả về cấu hình daemon RPC hiện tại

## Phát triển

Để làm việc trên thư viện hook cục bộ:

**Điều kiện tiên quyết:** Node.js, đã bật Corepack, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Tham khảo kho lưu trữ README để biết các lệnh kiểm tra và xây dựng.

## Liên kết

- **GitHub:** [tham chiếu API đầy đủ trên GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Giấy phép:** Chỉ dành cho GPL-2.0
