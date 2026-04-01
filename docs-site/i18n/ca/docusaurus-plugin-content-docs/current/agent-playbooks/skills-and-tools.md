# Habilitats i eines

Utilitzeu aquest manual quan configureu/ajusteu habilitats i eines externes.

## Habilitats recomanades

### Context7 (documentació de la biblioteca)

Per obtenir documents actualitzats sobre biblioteques.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramaturg CLI

Utilitzeu `playwright-cli` per a l'automatització del navegador (navegació, interacció, captures de pantalla, proves, extracció).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Ubicacions d'instal·lació d'habilitats:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Bones pràctiques de Vercel React

Per obtenir una guia de rendiment més profunda de React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Troba habilitats

Descobriu/instal·leu habilitats de l'ecosistema obert.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Justificació de la política MCP

Eviteu els servidors MCP de GitHub i MCP del navegador per a aquest projecte perquè afegeixen una sobrecàrrega important d'esquema d'eines/context.

- Operacions de GitHub: utilitzeu `gh` CLI.
- Operacions del navegador: utilitzeu `playwright-cli`.
