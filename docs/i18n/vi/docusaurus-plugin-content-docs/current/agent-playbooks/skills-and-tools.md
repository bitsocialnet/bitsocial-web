# Kỹ năng và công cụ

Sử dụng cẩm nang này khi thiết lập/điều chỉnh các kỹ năng và công cụ bên ngoài.

## Kỹ năng được đề xuất

### Context7 (tài liệu thư viện)

Để có tài liệu cập nhật về thư viện.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Nhà viết kịch CLI

Sử dụng `playwright-cli` để tự động hóa trình duyệt (điều hướng, tương tác, chụp ảnh màn hình, kiểm tra, trích xuất).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Vị trí cài đặt kỹ năng:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Các phương pháp hay nhất về phản ứng của Vercel

Để biết hướng dẫn hiệu suất React/Next sâu hơn.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Tìm kỹ năng

Khám phá/cài đặt các kỹ năng từ hệ sinh thái mở.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Cơ sở lý luận về chính sách MCP

Tránh sử dụng máy chủ MCP GitHub và MCP trình duyệt cho dự án này vì chúng bổ sung thêm chi phí ngữ cảnh/lược đồ công cụ đáng kể.

- Hoạt động GitHub: sử dụng `gh` CLI.
- Hoạt động của trình duyệt: sử dụng `playwright-cli`.
