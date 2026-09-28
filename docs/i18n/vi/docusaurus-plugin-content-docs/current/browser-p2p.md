---
title: Ngang hàng trong trình duyệt
description: Cách một ứng dụng web Bitsocial chạy một nút libp2p thực thụ ngay trong tab trình duyệt, nó dùng những phương thức truyền tải nào, và bản sửa lỗi thượng nguồn năm 2026 giúp việc đăng bài từ tab hoạt động được.
---

# Ngang hàng trong trình duyệt

Một ứng dụng web Bitsocial không nhất thiết phải là máy khách của máy chủ do người khác vận hành. Nó
có thể chạy một nút [Helia](https://helia.io/) ngay bên trong tab trình duyệt, tham gia đúng mạng
ngang hàng mà các nút máy tính để bàn và CLI đang dùng, lấy nội dung cộng đồng từ các máy ngang hàng
và đăng bài qua pubsub.

Trang này giải thích điều đó thực sự có nghĩa là gì, nó dùng những phương thức truyền tải nào, nó vẫn
chưa làm được gì, và vì sao mãi tới năm 2026 việc đăng bài từ một tab mới hoạt động.

Về thiết kế tổng thể của mạng, xem [Giao thức ngang hàng](/peer-to-peer-protocol/).

## Những gì chạy trong tab

Khi P2P trong trình duyệt được bật, trang web nắm giữ một nút libp2p thực thụ:

- nó kết nối tới các máy ngang hàng khác qua WebSockets bảo mật
- nó lấy và xác minh nội dung cộng đồng từ chính các máy ngang hàng đó, chứ không phải từ một cổng IPFS
- nó tham gia gossipsub, nên việc đăng bài không cần đến một nhà cung cấp pubsub được lưu trữ sẵn
- nó dùng cùng ngăn xếp máy khách giao thức (`pkc-js`) như mọi ứng dụng Bitsocial khác

Hệ quả thực tế là không có nhà điều hành cổng nào đứng giữa người đọc trên web và một cộng đồng.
Không tồn tại một điểm cuối HTTPS duy nhất nào có thể bị gây sức ép để loại bỏ một cộng đồng khỏi tầm
với của mọi người dùng trình duyệt cùng một lúc.

## Cách các nút trình duyệt kết nối

`pkc-js` kết nối tới các máy ngang hàng qua **WebSockets bảo mật**. Kết nối WebRTC và WebTransport bị
từ chối theo mặc định thông qua một bộ chặn kết nối, vì trong trình duyệt chúng thêm vào những đường
thiết lập kết nối dài và hay thất bại — thương lượng STUN/ICE, xoay vòng certhash — làm chậm quá
trình tải trang, trong khi WebSocket cho một phương thức truyền tải trực tiếp và đáng tin cậy. Bên
gọi nào thực sự muốn dùng WebRTC hoặc WebTransport có thể ghi đè bộ chặn này qua
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Hệ quả thực tế là một máy ngang hàng trong trình duyệt chỉ kết nối được tới những nút có điểm cuối
WSS, nghĩa là các nút đó cần một tên miền và một chứng chỉ do CA ký. Những máy ngang hàng nằm sau
đường truyền gia dụng mà không có chứng chỉ sẽ được tiếp cận gián tiếp thay vì được gọi trực tiếp từ
tab.

## Vì sao mãi tới năm 2026 việc đăng bài từ trình duyệt mới hoạt động

Ngang hàng trong trình duyệt không phải ý tưởng mới. Điều thay đổi trong năm 2026 là _bài đăng_ của
một nút trình duyệt giờ đây đến được phần còn lại của mạng.

Đặc tả pubsub của libp2p yêu cầu `seqno` của tin nhắn phải là một số nguyên 64-bit big-endian tăng
tuyến tính. `js-libp2p-gossipsub` lại sinh ra 8 byte ngẫu nhiên, trong khi go-libp2p-pubsub và
rust-libp2p đều dùng một bộ đếm. Kubo 0.40+ bật `BasicSeqnoValidator` theo mặc định, và bộ này loại
bỏ mọi tin nhắn có seqno không lớn hơn giá trị cao nhất đã thấy từ máy ngang hàng đó.

Hệ quả là hầu hết tin nhắn do một nút JavaScript đăng — kể cả nút trình duyệt — đều bị các máy ngang
hàng chạy Kubo âm thầm loại bỏ. Một bản tái hiện lỗi đo được chỉ 2 đến 8 trong số 30 tin nhắn tới
nơi.

Vấn đề được chẩn đoán trong
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) và được sửa
trong **`@libp2p/gossipsub` 15.0.21** vào tháng 5 năm 2026. Trước khi bản sửa đó xuất hiện, một nút
trình duyệt có thể kết nối và đọc, nhưng bài đăng của nó phần lớn biến mất trên đường tới các máy
ngang hàng chạy Go. `pkc-js` đi kèm `@libp2p/gossipsub` 16.0.4, tức là đã qua bản sửa đó.

## Những gì một nút trình duyệt vẫn chưa làm được

Nút trình duyệt là một máy ngang hàng thực thụ, không phải máy chủ. Nó có những giới hạn khác với nút
máy tính để bàn hoặc nút chạy liên tục:

- nó thường không thể chấp nhận các kết nối đến tùy ý từ internet công cộng
- nó chỉ hoạt động khi tab còn mở, nên nó không phải nơi lưu trữ lâu dài cho dữ liệu của một cộng đồng
- nó không thể tham gia DHT của libp2p, đó là lý do việc khám phá phải đi qua các bộ định tuyến HTTP
- nó không hợp để phân phát dữ liệu ở quy mô lớn

Việc lưu trữ trọn vẹn một cộng đồng vẫn nên do ứng dụng máy tính để bàn, `bitsocial-cli`, hoặc một
nút chạy liên tục khác đảm nhận. P2P trong trình duyệt thay đổi chuyện ai có thể _đọc và đăng bài_ mà
không cần cổng; nó không xóa bỏ nhu cầu về những máy ngang hàng luôn trực tuyến.

## Bộ định tuyến HTTP không phải là cổng

Máy khách trình duyệt vẫn truy vấn [bộ định tuyến HTTP](/peer-to-peer-protocol/#public-key-based-addressing)
để biết những máy ngang hàng nào đang cung cấp địa chỉ của một cộng đồng. Đây là dấu sao trung thực
bên cạnh câu "ngang hàng thuần túy trong trình duyệt", và cần nói cho thật chính xác:

- một bộ định tuyến chỉ lưu địa chỉ của các máy ngang hàng ứng với một địa chỉ nội dung
- nó không lưu, không phục vụ, thậm chí không biết nội dung của cộng đồng
- máy khách truy vấn song song nhiều bộ định tuyến rồi gộp kết quả lại
- ai cũng có thể tự chạy một cái, và đổi bộ định tuyến chỉ là thay đổi cấu hình, không phải chuyển dữ liệu

Sau bước khám phá, việc truyền nội dung và lưu lượng pubsub diễn ra trực tiếp giữa các máy ngang
hàng. Một bộ định tuyến biến mất chỉ khiến bạn mất một đường tra cứu, chứ không mất dữ liệu. Ngược
lại, một cổng IPFS nằm ngay trên đường đi của nội dung.

## Nơi điều này đang chạy hôm nay

- [5chan](/apps/5chan/) mặc định chạy P2P thuần túy trong trình duyệt ở ứng dụng web tại
  [5chan.app](https://5chan.app).

## Dự phòng cổng

Truy cập qua cổng vẫn tồn tại như một đường tương thích cho những trình duyệt hoặc mạng không thể
tham gia trực tiếp. Xem [Dự phòng cổng](/peer-to-peer-protocol/#gateway-fallback). Kiến trúc mục tiêu
là ưu tiên P2P trong trình duyệt, với cổng chỉ là phương án dự phòng tùy chọn thay vì nút thắt cổ
chai mặc định.
