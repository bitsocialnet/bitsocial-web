# Fluxo de trabalho de agente de longa duração

Use este manual quando uma tarefa provavelmente abranger várias sessões, transferências ou agentes gerados.

## Metas

- Dê a cada nova sessão uma maneira rápida de recuperar o contexto
- Mantenha o trabalho incremental em vez de realizar uma grande mudança única
- Capture uma linha de base local quebrada antes de adicionar mais código
- Deixe artefatos duráveis ​​nos quais a próxima sessão possa confiar

## Onde manter o estado

- Use `docs/agent-runs/<slug>/` quando humanos, bots de revisão ou vários conjuntos de ferramentas precisarem do mesmo estado de tarefa.
- Use um diretório local de ferramenta, como `.codex/runs/<slug>/`, somente quando o estado da tarefa for intencionalmente local para uma estação de trabalho ou uma cadeia de ferramentas.
- Não oculte o estado compartilhado de múltiplas sessões em um arquivo temporário privado se outro colaborador ou agente precisar dele mais tarde.

## Arquivos necessários

Crie estes arquivos no início da tarefa de longa duração:

- `feature-list.json`
- `progress.md`

Use os modelos em `docs/agent-playbooks/templates/feature-list.template.json` e `docs/agent-playbooks/templates/progress.template.md`.

Prefira JSON para a lista de recursos para que os agentes possam atualizar um pequeno número de campos sem reescrever o documento inteiro.

## Lista de verificação de início da sessão

1. Execute `pwd`.
2. Leia `progress.md`.
3. Leia `feature-list.json`.
4. Execute `git log --oneline -20`.
5. Execute `./scripts/agent-init.sh --smoke`.
6. Escolha exatamente um item de maior prioridade que ainda seja `pending`, `in_progress` ou `blocked`.

Se a etapa de fumaça falhar, corrija a linha de base quebrada antes de implementar uma nova fatia de recurso.

## Regras da Sessão

- Trabalhe em um recurso ou fatia de tarefa por vez.
- Mantenha a lista de recursos legível por máquina e estável. Atualize status, notas, arquivos e campos de verificação em vez de reescrever itens não relacionados.
- Marque apenas um item como verificado após executar o comando ou fluxo de usuário listado nesse item.
- Use agentes gerados para fatias limitadas, não para propriedade geral do estado da tarefa.
- Quando um agente filho possui um item, forneça a ele o ID exato do item, os critérios de aceitação e os arquivos que ele pode acessar.

## Lista de verificação de fim de sessão

1. Anexe uma breve entrada de progresso a `progress.md`.
2. Atualize o item tocado em `feature-list.json`.
3. Registre os comandos exatos executados para verificação.
4. Capture bloqueadores, acompanhamentos e o próximo melhor item para retomar.

## Formato de entrada de progresso recomendado

Use uma estrutura curta como:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
