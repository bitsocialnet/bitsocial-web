# مهارت ها و ابزار

هنگام تنظیم/تنظیم مهارت ها و ابزارهای خارجی از این کتاب بازی استفاده کنید.

## مهارت های توصیه شده

### Context7 (اسناد کتابخانه)

برای اسناد به روز در کتابخانه ها.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### نمایشنامه نویس CLI

از `playwright-cli` برای اتوماسیون مرورگر (ناوبری، تعامل، اسکرین شات، آزمایش، استخراج) استفاده کنید.

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

مکان های نصب مهارت:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### بهترین روش های Vercel React

برای راهنمایی عملکرد عمیق‌تر React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### یافتن مهارت ها

مهارت‌ها را از اکوسیستم باز کشف/نصب کنید.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## منطق سیاست MCP

از GitHub MCP و سرورهای MCP مرورگر برای این پروژه خودداری کنید زیرا آنها سربار ابزار-شما/زمینه قابل توجهی را اضافه می کنند.

- عملیات GitHub: از `gh` CLI استفاده کنید.
- عملیات مرورگر: از `playwright-cli` استفاده کنید.
