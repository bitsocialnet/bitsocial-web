# Surpresas Conhecidas

Este arquivo rastreia pontos de confusão específicos do repositório que causaram erros do agente.

## Critérios de entrada

Adicione uma entrada somente se todas forem verdadeiras:

- É específico para este repositório (não um conselho genérico).
- É provável que se repita para futuros agentes.
- Tem uma mitigação concreta que pode ser seguida.

Se não tiver certeza, pergunte ao desenvolvedor antes de adicionar uma entrada.

## Modelo de entrada

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entradas

### Portless altera o URL canônico do aplicativo local

- **Data:** 18/03/2026
- **Observado por:** Codex
- **Contexto:** Verificação do navegador e fluxos de fumaça
- **O que foi surpreendente:** O URL local padrão não é a porta normal do Vite. O repo espera `https://bitsocial.localhost` por meio do Portless, portanto, verificar `localhost:3000` ou `localhost:5173` pode atingir o aplicativo errado ou nada.
- **Impacto:** as verificações do navegador podem falhar ou validar o destino errado mesmo quando o servidor de desenvolvimento está íntegro.
- **Mitigação:** Use `https://bitsocial.localhost` primeiro. Ignore-o apenas com `PORTLESS=0 corepack yarn start` quando você precisar explicitamente de uma porta Vite direta.
- **Status:** confirmado

### Ganchos Commitizen bloqueiam commits não interativos

- **Data:** 18/03/2026
- **Observado por:** Codex
- **Contexto:** fluxos de trabalho de confirmação orientados por agente
- **O que foi surpreendente:** `git commit` aciona o Commitizen por meio do Husky e aguarda a entrada TTY interativa, que trava shells de agentes não interativos.
- **Impacto:** os agentes podem parar indefinidamente durante o que deveria ser um commit normal.
- **Mitigação:** Use `git commit --no-verify -m "message"` para confirmações criadas pelo agente. Os humanos ainda podem usar `corepack yarn commit` ou `corepack yarn exec cz`.
- **Status:** confirmado

### Corepack é necessário para evitar o Yarn clássico

- **Data:** 19/03/2026
- **Observado por:** Codex
- **Contexto:** Migração do gerenciador de pacotes para o Yarn 4
- **O que foi surpreendente:** A máquina ainda tem uma instalação global do Yarn Classic em `PATH`, portanto, executar `yarn` simples pode resolver para v1 em vez da versão fixada do Yarn 4.
- **Impacto:** os desenvolvedores podem acidentalmente ignorar a fixação do gerenciador de pacotes do repositório e obter um comportamento de instalação ou saída de arquivo de bloqueio diferente.
- **Mitigação:** Use `corepack yarn ...` para comandos shell ou execute `corepack enable` primeiro para que `yarn` simples resolva para a versão fixa do Yarn 4.
- **Status:** confirmado

### Nomes de aplicativos Portless corrigidos colidem nas árvores de trabalho da Bitsocial Web

- **Data:** 30/03/2026
- **Observado por:** Codex
- **Contexto:** Iniciando `yarn start` em uma árvore de trabalho Bitsocial Web enquanto outra árvore de trabalho já estava servindo através do Portless
- **O que foi surpreendente:** Usar o nome literal do aplicativo Portless `bitsocial` em cada árvore de trabalho faz com que a própria rota colida, mesmo quando as portas de apoio são diferentes, então o segundo processo falha porque `bitsocial.localhost` já está registrado.
- **Impacto:** As ramificações paralelas da Bitsocial Web podem bloquear umas às outras, mesmo que o objetivo do Portless seja permitir que elas coexistam com segurança.
- **Mitigação:** Mantenha a inicialização do Portless atrás de `scripts/start-dev.mjs`, que agora usa uma rota `*.bitsocial.localhost` com escopo de ramificação fora do caso canônico e retorna para uma rota com escopo de ramificação quando o nome `bitsocial.localhost` vazio já estiver ocupado.
- **Status:** confirmado

### Visualização do Documentos usada para codificar a porta 3001

- **Data:** 30/03/2026
- **Observado por:** Codex
- **Contexto:** Executando `yarn start` junto com outros repositórios e agentes locais
- **O que foi surpreendente:** O comando root dev executou o espaço de trabalho docs com `docusaurus start --port 3001`, portanto, toda a sessão de desenvolvimento falhou sempre que outro processo já possuía `3001`, mesmo que o aplicativo principal já usasse Portless.
- **Impacto:** `yarn start` pode encerrar o processo da Web imediatamente após sua inicialização, interrompendo o trabalho local não relacionado devido a uma colisão de porta de documentos.
- **Mitigação:** Mantenha a inicialização dos documentos atrás de `yarn start:docs`, que agora usa Portless mais `scripts/start-docs.mjs` para honrar uma porta livre injetada ou retornar para a próxima porta disponível quando executado diretamente.
- **Status:** confirmado
