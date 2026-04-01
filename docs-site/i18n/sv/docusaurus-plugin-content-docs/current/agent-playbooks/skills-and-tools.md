# Färdigheter och verktyg

Använd den här spelboken när du ställer in/justerar färdigheter och externa verktyg.

## Rekommenderade färdigheter

### Context7 (biblioteksdokument)

För uppdaterade dokument om bibliotek.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramatiker CLI

Använd `playwright-cli` för webbläsarautomatisering (navigering, interaktion, skärmdumpar, tester, extraktion).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Installationsplatser för färdigheter:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel Reacts bästa praxis

För djupare vägledning för React/Next-prestanda.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Hitta färdigheter

Upptäck/installera färdigheter från det öppna ekosystemet.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP-policygrund

Undvik GitHub MCP och webbläsar-MCP-servrar för detta projekt eftersom de lägger till betydande verktygsschema/kontextoverhead.

- GitHub-operationer: använd `gh` CLI.
- Webbläsarfunktioner: använd `playwright-cli`.
