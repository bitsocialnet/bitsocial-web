# การตั้งค่า Agent Hooks

หากผู้ช่วยเขียนโค้ด AI ของคุณรองรับ hook วงจรการใช้งาน ให้กำหนดค่าสิ่งเหล่านี้สำหรับ repo นี้

## ตะขอแนะนำ

| ฮุค             | คำสั่ง                                     | วัตถุประสงค์                                                                                                                                                                      |
| --------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | จัดรูปแบบไฟล์อัตโนมัติหลังจากแก้ไข AI                                                                                                                                             |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | รัน `corepack yarn install` เมื่อ `package.json` เปลี่ยน                                                                                                                          |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | ตัดการอ้างอิงเก่าและลบสาขางานชั่วคราวที่ผสานรวม                                                                                                                                   |
| `stop`          | `scripts/agent-hooks/verify.sh`            | การสร้างฮาร์ดเกท ผ้าสำลี การตรวจสอบประเภท และการตรวจสอบรูปแบบ เก็บข้อมูล `yarn npm audit` และรัน `yarn knip` แยกกันเป็นการตรวจสอบที่ปรึกษาเมื่อการขึ้นต่อกัน/การนำเข้าเปลี่ยนแปลง |

## ทำไม

- การจัดรูปแบบที่สอดคล้องกัน
- Lockfile ยังคงซิงค์อยู่
- ปัญหาด้านการสร้าง/ผ้าสำลี/ประเภทตรวจพบตั้งแต่เนิ่นๆ
- การมองเห็นความปลอดภัยผ่าน `yarn npm audit`
- สามารถตรวจสอบการพึ่งพา/การนำเข้าดริฟท์ได้ด้วย `yarn knip` โดยไม่ต้องเปลี่ยนให้เป็นตะขอหยุดทั่วโลกที่มีเสียงดัง
- การใช้งาน hook ที่ใช้ร่วมกันหนึ่งครั้งสำหรับทั้ง Codex และ Cursor
- สาขางานชั่วคราวจะสอดคล้องกับเวิร์กโฟลว์เวิร์กทรีของ repo

## ตัวอย่างสคริปต์ Hook

### ฟอร์แมตตะขอ

```bash
#!/bin/bash
# จัดรูปแบบไฟล์ JS/TS อัตโนมัติหลังจากแก้ไข AI
# Hook รับ JSON ผ่าน stdin พร้อม file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### ตรวจสอบฮุค

```bash
#!/bin/bash
# รัน build, lint, typecheck, การตรวจสอบรูปแบบ และการตรวจสอบความปลอดภัยเมื่อตัวแทนเสร็จสิ้น

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

โดยดีฟอลต์ `scripts/agent-hooks/verify.sh` จะออกจากค่าที่ไม่ใช่ศูนย์เมื่อการตรวจสอบที่จำเป็นล้มเหลว ตั้งค่า `AGENT_VERIFY_MODE=advisory` เฉพาะเมื่อคุณต้องการสัญญาณจากต้นไม้ที่หักโดยไม่ปิดกั้นตะขอเท่านั้น เก็บ `yarn knip` ออกจากฮาร์ดเกต เว้นแต่ repo จะตัดสินใจอย่างชัดเจนว่าจะล้มเหลวในปัญหาการนำเข้า/การพึ่งพาคำแนะนำ

### เส้นด้ายติดตั้งตะขอ

```bash
#!/bin/bash
# รันการติดตั้ง corepack Yarn เมื่อ package.json มีการเปลี่ยนแปลง
# Hook รับ JSON ผ่าน stdin พร้อม file_path

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

กำหนดค่าการเดินสายขอเกี่ยวตามเอกสารเครื่องมือตัวแทนของคุณ (`hooks.json` เทียบเท่า ฯลฯ)

ใน repo นี้ `.codex/hooks/*.sh` และ `.cursor/hooks/*.sh` ควรยังคงเป็น wrappers แบบบางที่มอบหมายให้กับการใช้งานที่ใช้ร่วมกันภายใต้ `scripts/agent-hooks/`
