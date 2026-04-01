# Thiết lập móc tác nhân

Nếu trợ lý mã hóa AI của bạn hỗ trợ các móc nối vòng đời, hãy định cấu hình các móc nối này cho kho lưu trữ này.

## Móc được đề xuất

| Móc             | Lệnh                                       | Mục đích                                                                                                                                                                                                   |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Tự động định dạng tệp sau khi chỉnh sửa AI                                                                                                                                                                 |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Chạy `corepack yarn install` khi `package.json` thay đổi                                                                                                                                                   |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Cắt bớt các tài liệu tham khảo cũ và xóa các nhánh tác vụ tạm thời được tích hợp                                                                                                                           |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Xây dựng cổng cứng, kiểm tra lỗi mã nguồn, đánh máy và định dạng; lưu giữ thông tin về `yarn npm audit` và chạy `yarn knip` riêng biệt dưới dạng kiểm tra tư vấn khi các phần phụ thuộc/nhập khẩu thay đổi |

## Tại sao

- Định dạng nhất quán
- Lockfile vẫn được đồng bộ hóa
- Các vấn đề về xây dựng/lint/loại được phát hiện sớm
- Khả năng hiển thị bảo mật qua `yarn npm audit`
- Có thể kiểm tra sự phụ thuộc/sự trôi dạt nhập khẩu bằng `yarn knip` mà không biến nó thành một móc dừng toàn cầu ồn ào
- Một triển khai hook chia sẻ cho cả Codex và Cursor
- Các nhánh nhiệm vụ tạm thời luôn phù hợp với quy trình làm việc của repo

## Tập lệnh móc ví dụ

### Móc định dạng

```bash
#!/bin/bash
# Auto-format JS/TS files after AI edits
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Xác minh móc

```bash
#!/bin/bash
# Run build, lint, typecheck, format check, and security audit when agent finishes

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Theo mặc định, `scripts/agent-hooks/verify.sh` thoát khác 0 khi kiểm tra bắt buộc không thành công. Chỉ đặt `AGENT_VERIFY_MODE=advisory` khi bạn cố tình cần tín hiệu từ cây gãy mà không chặn móc. Giữ `yarn knip` ngoài cổng cứng trừ khi repo quyết định rõ ràng là không thành công về các vấn đề nhập/phụ thuộc tư vấn.

### Móc cài sợi

```bash
#!/bin/bash
# Run corepack yarn install when package.json is changed
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

Định cấu hình nối dây móc theo tài liệu công cụ đại lý của bạn (`hooks.json`, tương đương, v.v.).

Trong kho lưu trữ này, `.codex/hooks/*.sh` và `.cursor/hooks/*.sh` sẽ vẫn ở dạng trình bao bọc mỏng ủy quyền cho việc triển khai được chia sẻ trong `scripts/agent-hooks/`.
