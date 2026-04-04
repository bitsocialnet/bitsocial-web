# ขั้นตอนการแปล

โปรเจ็กต์นี้ใช้ไฟล์การแปล i18next ใน `public/translations/{lang}/default.json`

## กฎ

อย่าแก้ไขไฟล์ทุกภาษาด้วยตนเอง ใช้ `scripts/update-translations.js`

## เพิ่มหรืออัปเดตคีย์

1. สร้างไฟล์พจนานุกรมชั่วคราว เช่น `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. ใช้แผนที่การแปล:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. ลบไฟล์พจนานุกรมชั่วคราว

## คำสั่งที่เป็นประโยชน์อื่น ๆ

```bash
# คัดลอกคีย์จากภาษาอังกฤษไปยังทุกภาษา (ทดลองรันแล้วจึงเขียน)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# ลบคีย์ออกจากทุกภาษา
node scripts/update-translations.js --key obsolete_key --delete --write

# ตรวจสอบคีย์การแปลที่ไม่ได้ใช้
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
