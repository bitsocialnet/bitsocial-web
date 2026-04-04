# Quy trình dịch thuật

Dự án này sử dụng các tệp dịch i18next trong `public/translations/{lang}/default.json`.

## Luật lệ

Đừng chỉnh sửa thủ công mọi tệp ngôn ngữ. Sử dụng `scripts/update-translations.js`.

## Thêm hoặc cập nhật khóa

1. Tạo một tệp từ điển tạm thời, ví dụ: `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Áp dụng bản đồ dịch:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Xóa tập tin từ điển tạm thời.

## Các lệnh hữu ích khác

```bash
# Sao chép một khóa từ tiếng Anh sang tất cả các ngôn ngữ (chạy khô rồi viết)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Xóa một khóa khỏi tất cả các ngôn ngữ
node scripts/update-translations.js --key obsolete_key --delete --write

# Kiểm tra các khóa dịch chưa được sử dụng
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
