# المهارات والأدوات

استخدم دليل اللعب هذا عند إعداد/ضبط المهارات والأدوات الخارجية.

## المهارات الموصى بها

### السياق 7 (مستندات المكتبة)

للحصول على مستندات محدثة في المكتبات.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### الكاتب المسرحي CLI

استخدم `playwright-cli` لأتمتة المتصفح (التنقل والتفاعل ولقطات الشاشة والاختبارات والاستخراج).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

مواقع تثبيت المهارات:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React أفضل الممارسات

للحصول على إرشادات أعمق بشأن رد الفعل/الأداء التالي.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### البحث عن المهارات

اكتشاف/تثبيت المهارات من النظام البيئي المفتوح.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## الأساس المنطقي لسياسة MCP

تجنب خوادم GitHub MCP وخوادم MCP للمتصفح لهذا المشروع لأنها تضيف حملًا كبيرًا لمخطط الأداة/السياق.

- عمليات GitHub: استخدم `gh` CLI.
- عمليات المتصفح: استخدم `playwright-cli`.
