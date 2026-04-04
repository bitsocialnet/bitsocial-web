# Định dạng cam kết và phát hành

Sử dụng điều này khi đề xuất hoặc triển khai các thay đổi mã có ý nghĩa.

## Cam kết định dạng đề xuất

- **Tiêu đề:** Kiểu cam kết thông thường, ngắn gọn, được bao bọc trong dấu gạch chéo ngược.
- Sử dụng `perf` (không phải `fix`) để tối ưu hóa hiệu suất.
- **Mô tả:** Tùy chọn 2-3 câu thân mật mô tả giải pháp. Ngắn gọn, kỹ thuật, không có dấu đầu dòng.

Ví dụ:

> **Tiêu đề cam kết:** `fix: correct date formatting in timezone conversion`
>
> Đã cập nhật `formatDate()` trong `date-utils.ts` để xử lý đúng cách các chênh lệch múi giờ.

## Định dạng đề xuất vấn đề GitHub

- **Tiêu đề:** Càng ngắn càng tốt, được bao bọc bằng dấu gạch ngang.
- **Mô tả:** 2-3 câu thân mật mô tả vấn đề (không phải giải pháp), như thể vẫn chưa được giải quyết.

Ví dụ:

> **Vấn đề về GitHub:**
>
> - **Tiêu đề:** `Date formatting displays incorrect timezone`
> - **Mô tả:** Dấu thời gian của nhận xét hiển thị múi giờ không chính xác khi người dùng xem bài đăng từ các khu vực khác nhau. Hàm `formatDate()` không tính đến cài đặt múi giờ địa phương của người dùng.
