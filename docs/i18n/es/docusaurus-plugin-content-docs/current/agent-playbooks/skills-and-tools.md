# Habilidades y herramientas

Utilice este manual al configurar/ajustar habilidades y herramientas externas.

## Habilidades recomendadas

### Context7 (documentos de la biblioteca)

Para documentos actualizados sobre bibliotecas.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### CLI de dramaturgo

Utilice `playwright-cli` para la automatización del navegador (navegación, interacción, capturas de pantalla, pruebas, extracción).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Ubicaciones de instalación de habilidades:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Mejores prácticas de reacción de Vercel

Para obtener una guía de rendimiento más profunda de React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### encontrar habilidades

Descubra/instale habilidades del ecosistema abierto.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Justificación de la política de MCP

Evite GitHub MCP y los servidores MCP del navegador para este proyecto porque agregan una importante sobrecarga de esquema/contexto de herramientas.

- Operaciones de GitHub: utilice la CLI `gh`.
- Operaciones del navegador: utilice `playwright-cli`.
