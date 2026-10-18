---
title: Bài đăng ở đâu và tồn tại bao lâu
description: >-
  Vì sao bài đăng Bitsocial được ký và định địa chỉ theo nội dung nhưng không phải node nào cũng lưu mãi,
  ai giữ chúng trực tuyến và các kho lưu trữ giữ cho nội dung cũ còn đọc được thế nào.
---

# Bài đăng ở đâu và tồn tại bao lâu

Bitsocial không lưu mọi bài đăng trên blockchain hay trong cơ sở dữ liệu của một công ty. Node riêng của mỗi
cộng đồng giữ các bài đăng của cộng đồng đó, người đọc và người seed giúp phục vụ chúng, và bất kỳ ai muốn có một
bản ghi vĩnh viễn đều có thể tự giữ. Việc lưu bài đăng mãi mãi là **tùy chọn, không bắt buộc**: giao thức không
buộc mọi người tham gia phải lưu toàn bộ lịch sử của mạng.

Trang này giải thích ý nghĩa thực tế của điều đó, vì cụm “không được lưu mãi mãi” rất dễ bị hiểu nhầm thành
“biến mất” hoặc “cứ tin tôi đi”.

## Tính xác thực và tính sẵn sàng là hai câu hỏi khác nhau

Có hai câu hỏi khác nhau về một bài đăng:

1. **Nó có thật không?** Tác giả này có viết nó không, và cộng đồng này có chấp nhận nó không?
2. **Nó vẫn trực tuyến chứ?** Hôm nay có ai lấy được nó không?

Bitsocial trả lời câu hỏi thứ nhất bằng mật mã học, chứ không bằng sự tin cậy. Mọi bài đăng đều được ký bằng cặp
khóa của tác giả, và khi một cộng đồng đã chấp nhận nó, bài đăng được lưu dưới một mã định danh nội dung (CID):
một hash của chính xác các byte của nó. Bất cứ ai lấy một bài đăng đều có thể tự kiểm tra chữ ký và hash. Một node,
router, gateway hoặc kho lưu trữ không thể thay đổi văn bản bài đăng hay làm giả bài đăng của người khác mà không
làm cho việc kiểm tra thất bại.

Câu hỏi thứ hai là về việc ai giữ một bản sao, và đó là phần duy nhất không được bảo đảm.

## Ai giữ bài đăng trực tuyến

- **Node của cộng đồng.** Node của người sở hữu chấp nhận bài đăng và giữ chúng trong cơ sở dữ liệu của nó chừng
  nào cộng đồng còn giữ chúng. Đây là bản sao luôn tồn tại khi cộng đồng còn đang hoạt động. Xem
  [Giao thức ngang hàng](/peer-to-peer-protocol/).
- **Người đọc.** Các ứng dụng máy tính như ứng dụng Electron 5chan seed những cộng đồng chúng tải trong khi đang
  chạy, nên các cộng đồng phổ biến được nhiều peer phục vụ, giống như torrent phổ biến. Một tab trình duyệt có
  thể lưu đệm và kiểm tra tính hợp lệ của nội dung khi đang mở, nhưng không phải là máy chủ tồn tại lâu dài.
- **Người seed.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) cho phép bất kỳ ai đóng
  góp dung lượng luôn hoạt động từ một VPS hoặc máy dự phòng. Nó ghim các trang mới nhất và cập nhật bài đăng của
  cộng đồng, đồng thời giúp các cộng đồng được lưu trữ phía sau router gia đình có thể tải trong trình duyệt.
- **Người lưu trữ.** Bất kỳ ai cũng có thể thu thập dữ liệu của cộng đồng và giữ mọi thứ họ thấy. Các kho lưu trữ
  là các dịch vụ thông thường được xây trên mạng, không phải một vai trò đặc biệt trong giao thức.

## Cộng đồng tự chọn thời hạn lưu giữ

Thời gian một cộng đồng giữ các bài đăng cũ là quyết định của người sở hữu, không phải quy tắc giao thức. Một số
cộng đồng muốn có lịch sử nhiều năm. Những cộng đồng khác được thiết kế để quên: các board 5chan hoạt động như một
imageboard, nơi các thread rơi khỏi board, chuyển vào một kho lưu trữ và bị xóa khỏi node của board sau một khoảng
thời gian nhất định (mặc định là 48 giờ). Một cộng đồng cũng có thể bỏ qua kho lưu trữ hoàn toàn.

Cùng một giao thức hỗ trợ cả hai vì việc lưu giữ là chính sách do từng cộng đồng đặt ra, không phải chi phí mà mọi
node phải trả.

## Tại sao không lưu mọi thứ mãi mãi?

Một mạng yêu cầu mọi node phải giữ mọi bài đăng mãi mãi phải trả giá cho điều đó bằng cách nào đó:

- **Blockchain** buộc mọi node đầy đủ phải lưu toàn bộ lịch sử, nên yêu cầu đối với node tăng theo toàn bộ hoạt
  động, và việc đăng bài thường tốn phí.
- **Lưu trữ trả phí**, như tiền thuê lưu trữ của Farcaster, buộc người dùng trả tiền để giữ lịch sử của họ và xóa
  những bài đăng cũ nhất vượt quá phần họ đã trả. Xem [Bitsocial và Farcaster](/comparisons/farcaster/).
- **Máy chủ tập trung** giữ mọi thứ, nhưng chỉ trong chừng mực một công ty còn muốn làm vậy, theo các quy tắc của
  công ty đó.

Mạng xã hội không cần một sổ cái toàn cục. Việc bài đăng A được chấp nhận sớm hơn bài đăng B một mili giây không
quan trọng, và hầu hết bài đăng cũ hiếm khi được đọc. Bitsocial cho mỗi node cộng đồng chỉ giữ các cộng đồng của
riêng nó, khiến việc lưu trữ đủ rẻ cho laptop, Raspberry Pi hoặc VPS nhỏ. Xem
[Tại sao không dùng blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Đánh đổi

Nếu không ai giữ một bản sao của bài đăng, nó có thể trở nên không sẵn sàng. CID của bài đăng không bao giờ thay
đổi, nhưng CID chỉ là một địa chỉ: nội dung chỉ còn lấy được khi ít nhất một node đang phục vụ nó. Nếu node của một
cộng đồng ngừng hoạt động vĩnh viễn và không người đọc, người seed hoặc kho lưu trữ nào giữ các bài đăng của nó,
những bài đăng đó sẽ mất.

Đó là cái giá thẳng thắn của việc không đòi hỏi một sổ cái toàn cục. Đó cũng là cái giá mà mọi nền tảng lớn đã phải
trả: các bài đăng cũ biến mất khỏi chúng khi tài khoản, máy chủ hoặc công ty biến mất. Khác biệt là trên Bitsocial,
giữ lại một thứ không cần sự cho phép của bất kỳ ai.

## Giữ lại điều quan trọng

- **Tự vận hành node cộng đồng.** Người sở hữu cộng đồng giữ node chạy sẽ giữ lịch sử của cộng đồng, chừng nào các
  cài đặt của cộng đồng còn lưu giữ lịch sử đó.
- **Seed.** Để một ứng dụng máy tính mở hoặc chạy `bitsocial-seeder` sẽ giữ các cộng đồng sẵn sàng cho người khác.
- **Lưu trữ.** Các kho lưu trữ độc lập giữ cho thread cũ còn đọc và tìm kiếm được sau khi cộng đồng bỏ chúng.
  [5archive.org](https://5archive.org) lưu trữ các board 5chan và
  [seeditarchive.org](https://seeditarchive.org) lưu trữ các cộng đồng Seedit. Cả hai đều mã nguồn mở, vì vậy
  bất kỳ ai cũng có thể vận hành một bản sao hoặc một kho lưu trữ cạnh tranh.

Vì mọi bài đăng đã lưu trữ vẫn được ký, một kho lưu trữ không thể âm thầm viết lại điều ai đó đã nói: người đọc có
thể kiểm tra chữ ký của bài đăng đã lưu trữ theo cùng cách như với một bài đăng đang hoạt động.
