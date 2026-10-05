# Hook của agent

Các hook vòng đời đã được commit chỉ định dạng những tệp JavaScript/TypeScript được chỉnh sửa thành công, thông qua oxfmt đã cài đặt. Logic dùng chung nằm trong `scripts/agent-hooks/format.mjs`; mỗi trình bao bọc gốc đều ủy quyền cho nó.

| Ứng dụng | Cấu hình gốc | Sự kiện |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude không đọc một tệp `.claude/hooks.json` độc lập. Mỗi ứng dụng vẫn tự kiểm soát mức tin cậy của dự án và việc hook có được bật hay không; hãy kiểm tra thiết lập hiện tại của ứng dụng thay vì vượt qua cơ chế tin cậy. `.codex/config.toml` là cấu hình của kho lưu trữ, không phải nơi đăng ký lệnh hook.

Trình định dạng xác thực sự kiện/payload, việc chỉnh sửa có thành công hay không, phần mở rộng tệp, và việc tệp có nằm trong kho lưu trữ hay không, kể cả khi đi qua symlink. Khi thiếu phụ thuộc hoặc đầu vào không liên quan, nó không làm gì cả. Các lệnh dùng mảng đối số và tắt quyền truy cập mạng của Corepack; hook không cài đặt phụ thuộc, không chạy build/review và không thay đổi Git.

Hãy chạy các bước kiểm tra một cách tường minh theo [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Chạy `yarn ai-workflow:sync`, `yarn ai-workflow:check` và `yarn ai-workflow:test` sau khi thay đổi quy trình. Fixture dùng các tệp dùng một lần và các lệnh gọi trình định dạng giả; chúng không chứng minh rằng từng ứng dụng đã nạp cấu hình của mình. Sau khi nâng cấp, hãy tải lại ứng dụng và kiểm tra danh mục của nó.

Skill thiết kế Impeccable và các trình trợ giúp thực thi của nó vẫn có sẵn khi cần trong `.agents/skills/impeccable`. Hook Codex trước đây của nó trỏ tới một thư mục không tồn tại; giờ quy trình thiết kế chạy khi skill được chọn, không còn hook thiết kế nào luôn bật. Skill này không được cấu hình lại các hook của dự án như một bước thiết kế tiện thể.
