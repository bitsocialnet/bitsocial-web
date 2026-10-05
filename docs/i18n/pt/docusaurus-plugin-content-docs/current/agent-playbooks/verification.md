# Verificação

Escolha as verificações com base no comportamento alterado e na incerteza que ainda resta. Reaproveite evidências bem-sucedidas para o mesmo estado final; rode de novo após edições ou falhas relevantes. Requisitos explícitos de CI, de release ou do usuário continuam valendo.

| Mudança                                                             | Verificações adequadas                                                                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Apenas texto/comentários/formatação                                 | Diff, referências, geradores relevantes; sem build do app                                                                      |
| Fontes/configuração do fluxo de trabalho de IA                      | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; regenere os índices de LLM quando o contexto mudar |
| Helper ou script isolado                                            | Invocação/fixtures focadas e verificações de sintaxe ou de tipos/lint para o código afetado                                    |
| Mudança em runtime, dependência, build ou integração compartilhados | Verificações focadas no que foi afetado, mais as verificações relevantes de build/tipos/lint abaixo                            |
| Apenas CSS/tema/layout                                              | Rotas/viewports/temas afetados nos navegadores selecionados; build quando imports, assets ou o processamento de CSS mudarem    |
| Estado/effects/desempenho do React                                  | Comportamento afetado e as orientações de React aplicáveis; Doctor quando o diagnóstico resolver uma dúvida concreta           |

## Verificações do projeto

- `yarn build:verify` seleciona o workspace afetado. Para um escopo conhecido, use `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` ou `yarn docs:build:verify`.
- `yarn build` roda intencionalmente o build de produção completo de about/docs, incluindo todos os locales da documentação. Use-o para validação de toda a release ou para mudanças que justifiquem esse escopo.
- `yarn lint`, `yarn typecheck` e `yarn format:check` cobrem os gates existentes do repositório; para uma edição pontual de script, use primeiro as verificações focadas de sintaxe/fixtures/formatação dele.
- Mudanças em manifesto/lockfile exigem `corepack yarn install`, `yarn deps:check-pinned` e `yarn deps:check-hardened`. `yarn knip` é consultivo para dependências/imports.
- As verificações de traduções da documentação estão em [translations.md](translations.md); não rode o gravador de traduções em massa para uma mudança pontual na documentação.

## Evidências de navegador e responsabilidade

Use o Chrome para mudanças pequenas e isoladas no navegador. Acrescente Firefox e WebKit para CSS/layout/responsividade compartilhados, APIs sensíveis ao navegador, interações amplas, releases ou critérios explícitos entre navegadores. Inclua layouts móveis e comportamento de toque afetados. Redimensionar o viewport, por si só, não é emulação de toque. Escolha rotas e conteúdos reais a partir do código-fonte, em vez de supor que os exemplos estejam disponíveis.

Use o `playwright-cli` por meio de `./scripts/pw-session.sh`. Há um único navegador ativo na máquina inteira; os engines selecionados rodam em sequência, e cada sessão exata que pertence a você é fechada mesmo após uma falha. Reaproveite uma sessão autorizada de quem fez a chamada sem fechá-la. Nunca use limpeza global de navegadores nem pare um servidor cuja responsabilidade não esteja clara. Trabalho apenas de documentação não precisa de navegador nem de servidor.

Em trabalhos de desempenho, compare o mesmo fluxo com viewport, conteúdo, configurações de rede/CPU, modo de build e overhead de medição equivalentes. Diferencie observações de causas suspeitas. Use a skill de profiling quando essas medições responderem ao pedido real.

## Evidências finais

Um único agente é responsável pela verificação pesada. Inspecione as cargas de trabalho ativas e serialize instalações, builds/suítes completas, Doctor, trabalho com Android/Electron e profiling de navegador. Relate comandos/resultados e limitações específicas; dados ausentes ou um engine pulado não são um resultado aprovado. Fixtures de ferramentas verificam formatos e mecânica, não a descoberta de ponta a ponta pelos apps nem a qualidade das decisões do modelo.

## Verificações automáticas de React

`yarn agent:verify` roda os builds selecionados seguidos de `yarn doctor:check` e `yarn perf:check`. `perf:check` inclui o autoteste de compatibilidade do coletor e de regressão deliberada, então nem a CI nem o caminho de verificação do agente precisam de uma execução separada de `perf:test`. Instale as ferramentas de navegador fixadas uma única vez com `yarn perf:install` (`--with-deps` na CI em Linux). Use filtros de alvo/cenário para reexecuções focadas depois da execução completa relevante. Os orçamentos de cada cenário estão explícitos em `scripts/react-perf/config.mjs`; preserve as evidências e corrija uma regressão antes de considerar uma mudança justificada na baseline. Builds de produção comuns omitem o Bippy; comandos `build:profile:*` separados fornecem a instrumentação oficial de profiling do React.

O cenário `apps-search` do about dita seu ritmo esperando, a cada caractere, que o valor da URL/entrada seja efetivado. Um resultado aprovado cobre essa sequência de consultas efetivadas, não a responsividade com digitação rápida. Use uma reprodução separada com entrada rápida ao avaliar perda de caracteres ou responsividade de entrada.
