# Compétences et outils

Utilisez ce playbook lors de la configuration/ajustement des compétences et des outils externes.

## Compétences recommandées

### Context7 (documents de bibliothèque)

Pour des documents à jour sur les bibliothèques.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramaturge CLI

Utilisez `playwright-cli` pour l'automatisation du navigateur (navigation, interaction, captures d'écran, tests, extraction).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Emplacements d'installation des compétences :

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Meilleures pratiques Vercel React

Pour des conseils plus approfondis sur les performances de React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Trouver des compétences

Découvrez/installez les compétences de l’écosystème ouvert.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Justification de la politique du MCP

Évitez les serveurs GitHub MCP et de navigateur MCP pour ce projet, car ils ajoutent une surcharge importante de schéma d'outil/de contexte.

- Opérations GitHub : utilisez la CLI `gh`.
- Opérations du navigateur : utilisez `playwright-cli`.
