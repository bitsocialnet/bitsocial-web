# Habilidades e ferramentas

Use este manual ao configurar/ajustar habilidades e ferramentas externas.

## Habilidades recomendadas

### Context7 (documentos da biblioteca)

Para documentos atualizados sobre bibliotecas.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### CLI do dramaturgo

Use `playwright-cli` para automação do navegador (navegação, interação, capturas de tela, testes, extração).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Locais de instalação de habilidades:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Práticas recomendadas do Vercel React

Para obter orientações mais profundas sobre desempenho do React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Encontre habilidades

Descubra/instale habilidades do ecossistema aberto.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Fundamentação da Política MCP

Evite servidores GitHub MCP e navegador MCP para este projeto porque eles adicionam sobrecarga significativa de esquema de ferramenta/contexto.

- Operações GitHub: use `gh` CLI.
- Operações do navegador: use `playwright-cli`.
