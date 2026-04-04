# Quy trình điều tra lỗi

Sử dụng điều này khi một lỗi được báo cáo trong một khối tệp/dòng/mã cụ thể.

## Bước đầu tiên bắt buộc

Trước khi chỉnh sửa, hãy kiểm tra lịch sử git để biết mã liên quan. Những người đóng góp trước đây có thể đã giới thiệu hành vi cho một trường hợp/cách giải quyết khác.

## Quy trình làm việc

1. Quét các tiêu đề cam kết gần đây (chỉ tiêu đề) cho tệp/khu vực:

```bash
# Tiêu đề cam kết gần đây cho một tệp cụ thể
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Tiêu đề cam kết gần đây cho một phạm vi dòng cụ thể
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Chỉ kiểm tra các cam kết có liên quan với các khác biệt trong phạm vi:

```bash
# Hiển thị thông báo cam kết + khác biệt cho một tệp
git show <commit-hash> -- path/to/file.tsx
```

3. Tiếp tục tái tạo và sửa chữa sau khi hiểu bối cảnh lịch sử.

## Quy tắc khắc phục sự cố

Khi bị chặn, hãy tìm kiếm trên web các bản sửa lỗi/cách giải quyết gần đây.
