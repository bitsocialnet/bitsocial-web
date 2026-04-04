# ทักษะและเครื่องมือ

ใช้ Playbook นี้เมื่อตั้งค่า/ปรับทักษะและเครื่องมือภายนอก

## ทักษะที่แนะนำ

### Context7 (เอกสารห้องสมุด)

สำหรับเอกสารล่าสุดเกี่ยวกับห้องสมุด

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### นักเขียนบทละคร CLI

ใช้ `playwright-cli` สำหรับการทำงานอัตโนมัติของเบราว์เซอร์ (การนำทาง การโต้ตอบ ภาพหน้าจอ การทดสอบ การแตกไฟล์)

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

สถานที่ติดตั้งทักษะ:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### แนวทางปฏิบัติที่ดีที่สุดของ Vercel React

สำหรับคำแนะนำด้านประสิทธิภาพ React/Next ที่ลึกซึ้งยิ่งขึ้น

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### ค้นหาทักษะ

ค้นพบ/ติดตั้งทักษะจากระบบนิเวศแบบเปิด

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## เหตุผลของนโยบาย MCP

หลีกเลี่ยง GitHub MCP และเซิร์ฟเวอร์ MCP ของเบราว์เซอร์สำหรับโปรเจ็กต์นี้ เนื่องจากมีการเพิ่มโอเวอร์เฮดของเครื่องมือ-สคีมา/บริบทที่สำคัญ

- การดำเนินการ GitHub: ใช้ `gh` CLI
- การทำงานของเบราว์เซอร์: ใช้ `playwright-cli`
