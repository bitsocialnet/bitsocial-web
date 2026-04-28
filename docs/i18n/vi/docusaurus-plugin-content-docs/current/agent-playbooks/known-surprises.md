# Những điều ngạc nhiên đã biết

Tệp này theo dõi các điểm nhầm lẫn dành riêng cho kho lưu trữ đã gây ra lỗi cho tác nhân.

## Tiêu chí đầu vào

Chỉ thêm một mục nếu tất cả đều đúng:

- Nó dành riêng cho kho lưu trữ này (không phải lời khuyên chung chung).
- Nó có khả năng tái diễn cho các đại lý trong tương lai.
- Nó có một biện pháp giảm nhẹ cụ thể có thể được tuân theo.

Nếu không chắc chắn, hãy hỏi nhà phát triển trước khi thêm mục nhập.

## Mẫu mục nhập

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Bài dự thi

### Portless thay đổi URL ứng dụng cục bộ chuẩn

- **Ngày:** 2026-03-18
- **Người quan sát:** Codex
- **Bối cảnh:** Xác minh trình duyệt và luồng khói
- **Điều đáng ngạc nhiên:** URL cục bộ mặc định không phải là cổng Vite thông thường. Kho lưu trữ mong đợi `https://bitsocial.localhost` thông qua Portless, vì vậy việc kiểm tra `localhost:3000` hoặc `localhost:5173` có thể nhấn nhầm ứng dụng hoặc không có gì cả.
- **Tác động:** Quá trình kiểm tra trình duyệt có thể không thành công hoặc xác thực sai mục tiêu ngay cả khi máy chủ nhà phát triển hoạt động tốt.
- **Giảm nhẹ:** Sử dụng `https://bitsocial.localhost` trước. Chỉ bỏ qua nó với `PORTLESS=0 corepack yarn start` khi bạn thực sự cần một cổng Vite trực tiếp.
- **Trạng thái:** đã xác nhận

### Móc cam kết chặn các cam kết không tương tác

- **Ngày:** 2026-03-18
- **Người quan sát:** Codex
- **Bối cảnh:** Quy trình công việc cam kết do tác nhân điều khiển
- **Điều đáng ngạc nhiên:** `git commit` kích hoạt Commitizen thông qua Husky và chờ đầu vào TTY tương tác, treo các vỏ tác nhân không tương tác.
- **Tác động:** Đại lý có thể bị đình trệ vô thời hạn trong thời gian thực hiện một cam kết thông thường.
- **Giảm nhẹ:** Sử dụng `git commit --no-verify -m "message"` cho các cam kết do tác nhân tạo. Con người vẫn có thể sử dụng `corepack yarn commit` hoặc `corepack yarn exec cz`.
- **Trạng thái:** đã xác nhận

### Cần có Corepack để tránh Yarn classic

- **Ngày:** 2026-03-19
- **Người quan sát:** Codex
- **Bối cảnh:** Di chuyển trình quản lý gói sang Sợi 4
- **Điều đáng ngạc nhiên:** Máy vẫn có bản cài đặt Yarn cổ điển toàn cầu trên `PATH`, do đó, việc chạy `yarn` đơn giản có thể phân giải thành v1 thay vì phiên bản Yarn 4 được ghim.
- **Tác động:** Các nhà phát triển có thể vô tình bỏ qua việc ghim trình quản lý gói của repo và nhận được hành vi cài đặt hoặc đầu ra tệp khóa khác nhau.
- **Giảm nhẹ:** Sử dụng `corepack yarn ...` cho các lệnh shell hoặc chạy `corepack enable` trước để `yarn` đơn giản chuyển sang phiên bản Yarn 4 được ghim.
- **Trạng thái:** đã xác nhận

### Đã sửa lỗi tên ứng dụng Portless xung đột trên các cây làm việc của Bitsocial Web

- **Ngày:** 2026-03-30
- **Người quan sát:** Codex
- **Bối cảnh:** Bắt đầu `yarn start` trong một cây làm việc Bitsocial Web trong khi một cây làm việc khác đã phân phát thông qua Portless
- **Điều đáng ngạc nhiên:** Việc sử dụng tên ứng dụng không cổng theo nghĩa đen là `bitsocial` trong mỗi cây làm việc sẽ khiến tuyến đường tự xung đột, ngay cả khi các cổng hỗ trợ khác nhau, do đó quá trình thứ hai không thành công vì `bitsocial.localhost` đã được đăng ký.
- **Tác động:** Các nhánh Web Bitsocial song song có thể chặn lẫn nhau mặc dù Portless nhằm mục đích cho phép chúng cùng tồn tại một cách an toàn.
- **Giảm thiểu:** Duy trì hoạt động khởi động không có cổng phía sau `scripts/start-dev.mjs`, hiện sử dụng tuyến `*.bitsocial.localhost` trong phạm vi nhánh bên ngoài trường hợp chính tắc và quay trở lại tuyến trong phạm vi nhánh khi tên `bitsocial.localhost` trần đã được sử dụng.
- **Trạng thái:** đã xác nhận

### Bản xem trước tài liệu được sử dụng cho cổng mã cứng 3001

- **Ngày:** 2026-03-30
- **Người quan sát:** Codex
- **Bối cảnh:** Chạy `yarn start` cùng với các đại lý và kho lưu trữ địa phương khác
- **Điều đáng ngạc nhiên:** Lệnh nhà phát triển gốc đã chạy không gian làm việc tài liệu với `docusaurus start --port 3001`, vì vậy toàn bộ phiên nhà phát triển không thành công bất cứ khi nào một quy trình khác đã sở hữu `3001`, mặc dù ứng dụng chính đã sử dụng Portless.
- **Tác động:** `yarn start` có thể tắt tiến trình web ngay sau khi khởi động, làm gián đoạn công việc cục bộ không liên quan do xung đột cổng tài liệu.
- **Giảm nhẹ:** Duy trì quá trình khởi động tài liệu sau `yarn start:docs`, hiện sử dụng Portless cộng với `scripts/start-docs.mjs` để hỗ trợ cổng miễn phí được đưa vào hoặc quay trở lại cổng khả dụng tiếp theo khi chạy trực tiếp.
- **Trạng thái:** đã xác nhận
