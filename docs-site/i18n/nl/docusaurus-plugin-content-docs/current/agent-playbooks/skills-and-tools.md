# Vaardigheden en tools

Gebruik dit draaiboek bij het instellen/aanpassen van vaardigheden en externe tools.

## Aanbevolen vaardigheden

### Context7 (bibliotheekdocumenten)

Voor up-to-date documenten over bibliotheken.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Playwright CLI

Gebruik `playwright-cli` voor browserautomatisering (navigatie, interactie, schermafbeeldingen, tests, extractie).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Skill-installatielocaties:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React Best Practices

Voor diepere React/Next-prestatierichtlijnen.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Vind vaardigheden

Ontdek/installeer vaardigheden uit het open ecosysteem.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP-beleid Reden

Vermijd GitHub MCP- en browser-MCP-servers voor dit project omdat deze aanzienlijke overhead voor tool-schema/context toevoegen.

- GitHub-bewerkingen: gebruik `gh` CLI.
- Browserbewerkingen: gebruik `playwright-cli`.
