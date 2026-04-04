# Quy trình làm việc của tác nhân chạy dài

Sử dụng cẩm nang này khi một nhiệm vụ có khả năng kéo dài nhiều phiên, chuyển giao hoặc tác nhân được sinh ra.

## Bàn thắng

- Cung cấp cho mỗi phiên mới một cách nhanh chóng để lấy lại bối cảnh
- Giữ công việc tăng dần thay vì thực hiện một thay đổi lớn
- Nắm bắt đường cơ sở cục bộ bị hỏng trước khi thêm mã khác
- Để lại những hiện vật bền bỉ mà phiên tiếp theo có thể tin tưởng

## Nơi giữ trạng thái

- Sử dụng `docs/agent-runs/<slug>/` khi con người, bot đánh giá hoặc nhiều chuỗi công cụ cần trạng thái nhiệm vụ giống nhau.
- Chỉ sử dụng thư mục công cụ cục bộ như `.codex/runs/<slug>/` khi trạng thái tác vụ được cố ý cục bộ đối với một máy trạm hoặc một chuỗi công cụ.
- Không ẩn trạng thái chia sẻ nhiều phiên trong một tệp cào riêng tư nếu người đóng góp hoặc đại lý khác sẽ cần nó sau này.

## Tệp cần thiết

Tạo các tệp này khi bắt đầu tác vụ dài hạn:

- `feature-list.json`
- `progress.md`

Sử dụng các mẫu trong `docs/agent-playbooks/templates/feature-list.template.json` và `docs/agent-playbooks/templates/progress.template.md`.

Ưu tiên JSON cho danh sách tính năng để tổng đài viên có thể cập nhật một số ít trường mà không cần viết lại toàn bộ tài liệu.

## Danh sách kiểm tra bắt đầu phiên

1. Chạy `pwd`.
2. Đọc `progress.md`.
3. Đọc `feature-list.json`.
4. Chạy `git log --oneline -20`.
5. Chạy `./scripts/agent-init.sh --smoke`.
6. Chọn chính xác một mục có mức độ ưu tiên cao nhất vẫn là `pending`, `in_progress` hoặc `blocked`.

Nếu bước khói không thành công, hãy sửa đường cơ sở bị hỏng trước khi triển khai một lát tính năng mới.

## Quy tắc phiên

- Làm việc trên một tính năng hoặc phần nhiệm vụ tại một thời điểm.
- Giữ cho danh sách tính năng có thể đọc được bằng máy và ổn định. Cập nhật trạng thái, ghi chú, tệp và trường xác minh thay vì viết lại các mục không liên quan.
- Chỉ đánh dấu một mục đã được xác minh sau khi chạy lệnh hoặc luồng người dùng được liệt kê trong mục đó.
- Sử dụng các tác nhân được sinh ra cho các lát giới hạn, không phải cho quyền sở hữu trạng thái nhiệm vụ tổng thể.
- Khi một tác nhân con sở hữu một mục, hãy cung cấp cho nó id mục chính xác, tiêu chí chấp nhận và các tệp mà nó có thể chạm vào.

## Danh sách kiểm tra kết thúc phiên

1. Thêm một mục tiến trình ngắn vào `progress.md`.
2. Cập nhật mục được chạm vào trong `feature-list.json`.
3. Ghi lại chính xác các lệnh chạy để xác minh.
4. Nắm bắt các phần chặn, phần theo dõi và mục tốt nhất tiếp theo để tiếp tục.

## Hình dạng mục nhập tiến độ được đề xuất

Sử dụng cấu trúc ngắn như:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
