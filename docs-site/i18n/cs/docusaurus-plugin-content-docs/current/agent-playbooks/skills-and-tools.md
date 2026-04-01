# Dovednosti a nástroje

Tuto příručku použijte při nastavování/upravování dovedností a externích nástrojů.

## Doporučené dovednosti

### Context7 (dokumenty v knihovně)

Pro aktuální dokumenty v knihovnách.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramatik CLI

Použijte `playwright-cli` pro automatizaci prohlížeče (navigace, interakce, snímky obrazovky, testy, extrakce).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Místa instalace dovedností:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React Best Practices

Pro hlubší vedení výkonu React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Najít dovednosti

Objevte/nainstalujte dovednosti z otevřeného ekosystému.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Odůvodnění politiky MCP

Pro tento projekt se vyhněte GitHub MCP a serverům MCP v prohlížeči, protože zvyšují značnou režii schématu/kontextu nástrojů.

- Operace GitHub: použijte `gh` CLI.
- Operace prohlížeče: použijte `playwright-cli`.
