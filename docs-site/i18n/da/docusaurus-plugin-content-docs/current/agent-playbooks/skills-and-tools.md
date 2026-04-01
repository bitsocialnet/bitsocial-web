# Færdigheder og værktøjer

Brug denne spillebog, når du opsætter/justerer færdigheder og eksternt værktøj.

## Anbefalede færdigheder

### Context7 (biblioteksdokumenter)

For opdaterede dokumenter om biblioteker.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramatiker CLI

Brug `playwright-cli` til browserautomatisering (navigation, interaktion, skærmbilleder, test, udtræk).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Installationssteder for færdigheder:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React bedste praksis

For dybere React/Next-ydelsesvejledning.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Find færdigheder

Opdag/installer færdigheder fra det åbne økosystem.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP-politisk begrundelse

Undgå GitHub MCP og browser MCP-servere til dette projekt, fordi de tilføjer betydelige værktøjsskema/kontekstoverhead.

- GitHub-operationer: brug `gh` CLI.
- Browserhandlinger: brug `playwright-cli`.
