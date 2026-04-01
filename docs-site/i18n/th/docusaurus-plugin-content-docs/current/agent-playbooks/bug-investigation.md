# ขั้นตอนการตรวจสอบข้อผิดพลาด

ใช้สิ่งนี้เมื่อมีการรายงานจุดบกพร่องในไฟล์/บรรทัด/บล็อกโค้ดเฉพาะ

## ขั้นตอนแรกบังคับ

ก่อนแก้ไข ให้ตรวจสอบประวัติ git เพื่อดูโค้ดที่เกี่ยวข้อง ผู้ร่วมให้ข้อมูลก่อนหน้านี้อาจแนะนำลักษณะการทำงานสำหรับกรณี Edge/วิธีแก้ไขปัญหาเฉพาะหน้า

## ขั้นตอนการทำงาน

1. สแกนชื่อการคอมมิตล่าสุด (ชื่อเรื่องเท่านั้น) สำหรับไฟล์/พื้นที่:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. ตรวจสอบเฉพาะการคอมมิตที่เกี่ยวข้องด้วยขอบเขตที่แตกต่าง:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. ทำซ้ำและแก้ไขต่อหลังจากทำความเข้าใจบริบทของประวัติศาสตร์แล้ว

## กฎการแก้ไขปัญหา

เมื่อถูกบล็อก ให้ค้นหาเว็บเพื่อดูการแก้ไข/วิธีแก้ไขปัญหาล่าสุด
