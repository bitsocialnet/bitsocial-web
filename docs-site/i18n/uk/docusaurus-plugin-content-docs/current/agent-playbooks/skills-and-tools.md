# Навички та інструменти

Використовуйте цей посібник, коли налаштовуєте/коригуєте навички та зовнішні інструменти.

## Рекомендовані навички

### Context7 (бібліотека документів)

Для найновіших документів про бібліотеки.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Драматург КЛІ

Використовуйте `playwright-cli` для автоматизації браузера (навігація, взаємодія, скріншоти, тести, вилучення).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Місця встановлення навичок:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Рекомендації Vercel React

Для глибших інструкцій щодо ефективності React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Знайдіть навички

Відкрийте/встановіть навички з відкритої екосистеми.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Обґрунтування політики MCP

Уникайте GitHub MCP і серверів MCP браузера для цього проекту, оскільки вони додають значні витрати на схему інструментів/контекст.

- Операції GitHub: використовуйте `gh` CLI.
- Операції браузера: використовуйте `playwright-cli`.
