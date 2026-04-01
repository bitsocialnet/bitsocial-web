# Aftësitë dhe Mjetet

Përdoreni këtë libër lojërash kur konfiguroni/rregulloni aftësitë dhe veglat e jashtme.

## Aftësitë e rekomanduara

### Konteksti 7 (dokumentet e bibliotekës)

Për dokumente të përditësuara mbi bibliotekat.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramaturg CLI

Përdorni `playwright-cli` për automatizimin e shfletuesit (navigacion, ndërveprim, pamje nga ekrani, teste, nxjerrje).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Vendndodhjet e instalimit të aftësive:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Praktikat më të mira të Vercel React

Për udhëzime më të thella të performancës React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Gjeni Aftësitë

Zbuloni/instaloni aftësi nga ekosistemi i hapur.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Arsyetimi i politikës MCP

Shmangni serverët MCP të GitHub dhe MCP të shfletuesit për këtë projekt, sepse ata shtojnë ngarkesë të konsiderueshme të skemës së veglave/kontekstit.

- Operacionet GitHub: përdorni `gh` CLI.
- Veprimet e shfletuesit: përdorni `playwright-cli`.
