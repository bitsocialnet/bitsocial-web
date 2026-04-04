---
title: RPC công cộng không được phép
description: Thiết kế được đề xuất cho dịch vụ Bitsocial RPC công khai với người dùng bị cô lập, quyền có phạm vi và quyền sở hữu cộng đồng.
---

# RPC công cộng không được phép

Đề xuất RPC công khai ban đầu tồn tại dưới dạng vấn đề GitHub được viết bằng thuật ngữ plebbit cũ. Trang này viết lại ý tưởng đó bằng ngôn ngữ Bitsocial và đóng khung nó như một đề xuất cấp sản phẩm thay vì một bức tường chi tiết triển khai.

## Mục tiêu ngôn ngữ đơn giản

Bitsocial Forge có thể chạy dịch vụ RPC công cộng cho phép nhiều người dùng quản lý cộng đồng Bitsocial của riêng họ từ xa mà không cần biến nhà điều hành thành người giám sát các cộng đồng đó.

Dịch vụ này sẽ giúp các ứng dụng khách di động và nhẹ trở nên thiết thực trong khi vẫn đảm bảo ba hạn chế:

1. Người dùng được cách ly với nhau theo mặc định.
2. Quyền vẫn rõ ràng và chi tiết.
3. Khả năng tương thích với hình dạng phản hồi và yêu cầu RPC hiện tại có thể được duy trì trong quá trình triển khai.

## Nó giải quyết được vấn đề gì

Ngày nay, mô hình RPC đơn giản nhất thường là tất cả hoặc không có gì: một khóa xác thực, một miền quyền, toàn quyền truy cập. Điều đó áp dụng cho một nhà điều hành nhưng không áp dụng cho dịch vụ công cộng nhiều người dùng.

RPC công cộng không được phép cần một mô hình mạnh mẽ hơn:

- một dịch vụ có thể lưu trữ nhiều người dùng
- mỗi người dùng có cộng đồng và giới hạn của riêng họ
- chính sách do nhà điều hành xác định có thể ngăn ngừa lạm dụng
- người dùng vẫn có thể chuyển đi hoặc tự lưu trữ sau này

## Mô hình cốt lõi

### Người dùng

Mỗi người dùng nhận được thông tin xác thực cùng với gói quyền.

### Cộng đồng

Các cộng đồng được tạo thông qua dịch vụ sẽ được gán cho một bản ghi chủ sở hữu. Quyền sở hữu được theo dõi rõ ràng để có thể áp dụng các phương pháp quản lý cho đúng người dùng.

### Quyền

Quyền dựa trên khả năng. Thay vì một boolean cho “có thể sử dụng RPC”, máy chủ có thể kiểm soát:

- người dùng có thể tạo bao nhiêu cộng đồng
- những phương pháp quản lý nào có sẵn
- những hoạt động xuất bản nào được phép
- giới hạn tỷ lệ nào được áp dụng
- những bề mặt quản trị nào được hiển thị

### Bề mặt quản trị

Bản thân RPC công khai nên tập trung vào hành vi RPC mà người dùng phải đối mặt. Các tác vụ quản trị như tạo người dùng, chuyển quyền sở hữu và đánh giá kiểm tra thuộc về một bảng điều khiển và API của nhà điều hành riêng biệt.

## Lập trường tương thích

Tài liệu hướng tới người dùng nên sử dụng các thuật ngữ Bitsocial như **cộng đồng** và **hồ sơ**.

Ở cấp độ dây, lần triển khai đầu tiên vẫn có thể duy trì hình dạng tải trọng và truyền tải JSON-RPC hiện tại ở những nơi hữu ích cho khả năng tương thích. Nói cách khác: các tài liệu không còn cần phải nói như các tài liệu plebbit cũ nữa, ngay cả khi giai đoạn chuyển tiếp giữ lại một số tên phương thức cũ hoặc hình dạng yêu cầu ở hậu trường.

## Gói quyền được đề xuất

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Tên phương pháp chính xác là minh họa. Phần quan trọng là hình thức của chính sách: các khả năng riêng lẻ được kiểm soát độc lập thay vì được gộp thành một mã thông báo siêu người dùng.

## Luồng kết nối

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Nhận thức về quyền nên ở trạng thái tùy chọn. Máy khách bỏ qua thông báo vẫn có thể hoạt động chính xác bằng cách xử lý các lỗi ủy quyền tiêu chuẩn từ máy chủ.

## Thực thi quyền sở hữu

Khi dịch vụ tạo một cộng đồng, nó sẽ tự động gán quyền sở hữu cho người dùng đang gọi. Từ đó:

- Các hành động bắt đầu, dừng, chỉnh sửa và xóa của cộng đồng đều nằm trong phạm vi chủ sở hữu
- danh sách và phản hồi đăng ký mặc định cho cộng đồng của chính người gọi
- khả năng hiển thị rộng hơn là quyền quản trị viên rõ ràng, không phải mặc định

Trường hợp một bên rất quan trọng: nếu người dùng đăng ký vào một cộng đồng mà họ **không** sở hữu, thì máy chủ chỉ phải hiển thị trạng thái công khai mà bất kỳ người quan sát bên ngoài nào cũng có thể nhìn thấy. Cấu hình chỉ dành cho chủ sở hữu hoặc dữ liệu thời gian chạy nội bộ sẽ không bao giờ bị rò rỉ thông qua API đăng ký.

## Bề mặt vận hành được đề xuất

API quản trị có thể vẫn nhàm chán và rõ ràng:

- liệt kê người dùng
- kiểm tra một người dùng
- tạo hoặc cập nhật người dùng
- xóa người dùng
- chuyển quyền sở hữu cộng đồng
- kiểm tra nhật ký kiểm tra

Việc xác thực cho API nhà điều hành này phải tách biệt hoàn toàn với xác thực RPC của người dùng cuối.

## Giai đoạn triển khai

### Giai đoạn 1

- thiết lập cấu trúc dự án RPC công cộng
- thêm hồ sơ người dùng và theo dõi quyền sở hữu
- rẽ nhánh hoặc mở rộng máy chủ RPC hiện tại

### Giai đoạn 2

- triển khai các gói quyền
- thực thi chúng ở lớp phương thức RPC
- trả lại siêu dữ liệu quyền khi kết nối

### Giai đoạn 3

- thêm API toán tử
- thêm nhật ký kiểm tra
- thêm xác thực quản trị viên

### Giai đoạn 4

- gửi bảng điều khiển quản trị
- kiểm tra kiểm soát lạm dụng
- thắt chặt giới hạn tỷ lệ và hạn ngạch lưu trữ

## Câu hỏi mở

### Thư rác xác thực xác thực

Nếu việc tạo xác thực không tốn kém, các dịch vụ công có thể cần một lớp thử thách trước khi cấp thông tin xác thực. Một cách khả thi là sử dụng lại chính mô hình thách thức cộng đồng để việc cấp chứng chỉ kế thừa triết lý chống lạm dụng giống như phần còn lại của mạng.

### Đặt tên kế thừa

Một số triển khai ban đầu vẫn có thể hiển thị tên phương thức cũ trong nội bộ để tương thích. Điều đó nên được coi là chi tiết di chuyển, không phải là từ vựng công khai vĩnh viễn của tài liệu Bitsocial.

## Bản tóm tắt

Đề xuất này thực sự là về một điều: làm cho cơ sở hạ tầng RPC công cộng trở nên hữu ích mà không cần quản lý nó. Một RPC Bitsocial công khai tốt sẽ giống như một sự hỗ trợ tùy chọn cho các cộng đồng đang điều hành, chứ không giống như một nền tảng trung tâm mới đòi lại quyền sở hữu thông qua cửa sau.
