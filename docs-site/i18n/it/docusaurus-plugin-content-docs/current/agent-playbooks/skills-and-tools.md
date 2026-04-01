# Competenze e strumenti

Utilizza questo playbook quando imposti/modifichi competenze e strumenti esterni.

## Competenze consigliate

### Context7 (documenti della libreria)

Per documenti aggiornati sulle librerie.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### CL di Playwright

Utilizza `playwright-cli` per l'automazione del browser (navigazione, interazione, screenshot, test, estrazione).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Posizioni di installazione delle competenze:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Best practice di Vercel React

Per indicazioni più approfondite sulle prestazioni di React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Trova competenze

Scopri/installa competenze dall'ecosistema aperto.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Motivazione della policy MCP

Evita GitHub MCP e browser MCP server per questo progetto perché aggiungono un notevole sovraccarico di schema di strumenti/contesto.

- Operazioni GitHub: utilizzare `gh` CLI.
- Operazioni browser: utilizzare `playwright-cli`.
