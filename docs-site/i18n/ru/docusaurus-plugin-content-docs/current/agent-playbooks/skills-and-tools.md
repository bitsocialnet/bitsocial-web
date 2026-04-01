# Навыки и инструменты

Используйте это руководство при настройке/корректировке навыков и внешних инструментов.

## Рекомендуемые навыки

### Context7 (библиотечная документация)

Для получения актуальной документации по библиотекам.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Драматург CLI

Используйте `playwright-cli` для автоматизации браузера (навигация, взаимодействие, снимки экрана, тесты, извлечение).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Места установки навыков:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Лучшие практики Vercel React

Более подробное руководство по производительности React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Найдите навыки

Откройте для себя/примените навыки из открытой экосистемы.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Обоснование политики MCP

Избегайте GitHub MCP и серверов MCP браузера для этого проекта, поскольку они добавляют значительные накладные расходы на схему инструментов/контекст.

- Операции GitHub: используйте CLI `gh`.
- Операции браузера: используйте `playwright-cli`.
