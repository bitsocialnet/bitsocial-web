# Ferdigheter og verktøy

Bruk denne lekeboken når du setter opp/justerer ferdigheter og eksternt verktøy.

## Anbefalte ferdigheter

### Context7 (biblioteksdokumenter)

For oppdaterte dokumenter om biblioteker.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramatiker CLI

Bruk `playwright-cli` for nettleserautomatisering (navigasjon, interaksjon, skjermbilder, tester, utvinning).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Installasjonssteder for ferdigheter:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel Reacts beste praksis

For dypere React/Next ytelsesveiledning.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Finn ferdigheter

Oppdag/installer ferdigheter fra det åpne økosystemet.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP-policybegrunnelse

Unngå GitHub MCP og nettleser MCP-servere for dette prosjektet fordi de legger til betydelig verktøyskjema/kontekstoverhead.

- GitHub-operasjoner: bruk `gh` CLI.
- Nettleseroperasjoner: bruk `playwright-cli`.
