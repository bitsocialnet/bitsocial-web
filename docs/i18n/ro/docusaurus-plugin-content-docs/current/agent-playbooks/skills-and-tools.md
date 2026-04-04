# Abilități și instrumente

Utilizați acest manual atunci când configurați/ajustați abilitățile și instrumentele externe.

## Abilități recomandate

### Context7 (documente de bibliotecă)

Pentru documente actualizate despre biblioteci.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramaturg CLI

Utilizați `playwright-cli` pentru automatizarea browserului (navigație, interacțiune, capturi de ecran, teste, extracție).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Locații de instalare a aptitudinilor:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Cele mai bune practici Vercel React

Pentru îndrumări mai profunde privind performanța React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Găsiți abilități

Descoperiți/instalați abilități din ecosistemul deschis.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Motivul politicii MCP

Evitați serverele GitHub MCP și browser MCP pentru acest proiect, deoarece adaugă o suprasarcină semnificativă pentru schema instrumentelor/context.

- Operațiuni GitHub: utilizați `gh` CLI.
- Operațiuni cu browser: utilizați `playwright-cli`.
