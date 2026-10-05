# Skills e ferramentas

As skills compartilhadas ficam em `.agents/skills/`. Edite essas fontes e depois rode `yarn ai-workflow:sync` para gerar `.claude/skills/` para o Claude Code. O Codex e o Cursor descobrem `.agents/skills/` diretamente; não restaure as raízes duplicadas `.codex/skills/` ou `.cursor/skills/`.

Os prompts de papéis compartilhados ficam em `.agents/roles/*.md`. Esse é um formato de fonte específico do repositório, não um caminho nativo de descoberta de agentes. `scripts/ai-workflow-files.mjs` converte essas fontes nos arquivos específicos de cada app listados abaixo; `yarn ai-workflow:sync` os grava. Faça commit dos arquivos gerados junto com suas fontes, para que um checkout novo tenha a configuração nativa sem precisar rodar um gerador antes. Depois de remover uma fonte, remova explicitamente as saídas geradas obsoletas; o validador as aponta em vez de apagar arquivos silenciosamente.

## Caminhos nativos de descoberta

Verificado na documentação oficial em 2026-09-12:

| App         | Instruções do projeto                                                                                 | Skills usadas por este repositório      | Agentes personalizados usados por este repositório |
| ----------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                           | `.agents/skills/<name>/SKILL.md`        | `.codex/agents/<name>.toml` gerado                 |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` continua disponível para regras condicionais específicas do Cursor | `.agents/skills/<name>/SKILL.md`        | `.cursor/agents/<name>.md` gerado                  |
| Claude Code | `CLAUDE.md` importa `@AGENTS.md`                                                                      | `.claude/skills/<name>/SKILL.md` gerado | `.claude/agents/<name>.md` gerado                  |

Fontes: [skills do Codex](https://learn.chatgpt.com/docs/build-skills), [subagentes do Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [regras do Cursor](https://cursor.com/docs/rules), [skills do Cursor](https://cursor.com/docs/skills), [subagentes do Cursor](https://cursor.com/docs/subagents), [memória do Claude](https://code.claude.com/docs/en/memory), [skills do Claude](https://code.claude.com/docs/en/skills), [subagentes do Claude](https://code.claude.com/docs/en/sub-agents).

Não substitua os diretórios nativos de agentes por `.agents/roles` nem suponha que o Claude descobre `.agents/skills`. O Claude ainda pode ler um arquivo referenciado ali como contexto comum do projeto. O Cursor também descobre `.claude/skills` por compatibilidade; as cópias permanecem sincronizadas, mas o guia de skills publicado pelo Cursor não especifica deduplicação entre essas raízes. Verifique o catálogo de skills do app instalado em vez de prometer que entradas duplicadas não podem aparecer.

Os diretórios de IA usam finais de linha LF por meio do `.gitattributes`, para que o texto gerado permaneça idêntico entre plataformas. Os assets de apoio das skills são copiados byte a byte.

## Skills

| Skill                                | Finalidade                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `commit`                             | Criar commits locais autorizados e com escopo definido                                                       |
| `commit-format`, `issue-format`      | Formatar sugestões quando solicitado                                                                         |
| `make-closed-issue`                  | Criar uma issue autorizada, um commit com escopo definido e um PR                                            |
| `review-and-merge-pr`                | Triar o feedback de PRs; corrigir/publicar/fazer merge apenas dentro do escopo solicitado                    |
| `fix-merge-conflicts`                | Resolver conflitos e verificar o resultado do merge                                                          |
| `release`                            | Preparar o texto da release e executar etapas de release autorizadas                                         |
| `code-quality-review`                | Revisar diffs não triviais ou uma preocupação de qualidade solicitada explicitamente                         |
| `retro`                              | Transformar erros demonstrados em verificações ou orientações focadas que evitem a recorrência               |
| `refactor-pass`, `deslop`            | Limpeza solicitada de mudanças existentes                                                                    |
| `debug-agent`                        | Depuração baseada em evidências, com instrumentação quando necessário                                        |
| `you-might-not-need-an-effect`       | Revisão focada de effects/memo                                                                               |
| `vercel-react-best-practices`        | Orientações de desempenho de React aplicáveis; ignore regras de Next.js ou só de servidor neste cliente Vite |
| `translate`                          | Gerar traduções e depois aplicar os mapas por meio de um único gravador                                      |
| `playwright-cli`, `inspect-elements` | Verificação no navegador e mapeamento do DOM para o código-fonte                                             |
| `profile-browsing`                   | Profiling de navegador e de React com escopo definido                                                        |
| `test-apk`                           | Verificar um wrapper Android do app complementar que tenha sido fornecido                                    |
| `impeccable`, `improve-threejs`      | Design de interface com escopo definido e revisão de renderização Three.js                                   |
| `implement-plan`                     | Executar um plano com delegação opcional e limitada                                                          |
| `readme`                             | Manter documentação do projeto verificada                                                                    |
| `context7`                           | Obter documentação de bibliotecas adequada à versão                                                          |
| `find-skills`                        | Encontrar skills adicionais quando solicitado explicitamente                                                 |

## Papéis e modelos

Mantenha papéis personalizados para `browser-check`, `profiler`, `test-apk`, `translator` e `reviewer`. Use o papel embutido de worker/general-purpose ou explorer do harness para implementação comum e descoberta de código. O agente pai define critérios de aceitação e responsabilidades; um único responsável roda as verificações pesadas.

Os arquivos de agente do Codex incluem `name`, `description` e `developer_instructions`. `.codex/config.toml` limita os filhos concorrentes a quatro usando `max_concurrent_threads_per_session`. Os metadados compartilhados de papéis contêm o nome, a descrição e um modo de sandbox opcional; eles deliberadamente não têm campos de modelo.

Deixe os campos de modelo e de raciocínio de fora das skills versionadas e dos agentes personalizados nos três apps. Isso permite escolhas no momento da invocação, padrões do usuário e herança do agente pai, de acordo com a precedência documentada de cada app. Aliases de família do Claude reduzem a manutenção de versões, mas ainda escolhem uma família; um modelo versionado do Cursor exige atualizações futuras. Mantenha essas escolhas nas configurações do usuário/da sessão quando necessário. A herança não promete a escolha automática do melhor modelo atual. Não invente um alias `latest` nem adicione pesquisa de catálogo de modelos a tarefas rotineiras. Veja [seleção no Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [seleção no Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) e [seleção no Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` corresponde ao sandbox do Codex e ao `readonly` do Cursor; no Claude, a lista de ferramentas e as instruções do papel restringem o fluxo de revisão, mas o acesso ao Bash não é um sandbox no nível do sistema operacional.

O frontmatter das skills compartilhadas usa `disable-model-invocation: true` para fluxos de trabalho invocados pelo usuário, quando aplicável. A configuração correspondente do Codex fica em `agents/openai.yaml` como `policy.allow_implicit_invocation: false`; o validador exige as duas. Os metadados de invocação complementam as regras explícitas de autorização; um pedido de revisão nunca autoriza publicação só porque uma skill inclui etapas de publicação.

## Verificações e descoberta

- `yarn ai-workflow:sync` regenera as saídas de compatibilidade usando o `js-yaml` e o `smol-toml` instalados.
- `yarn ai-workflow:check` faz o parsing de fontes/frontmatter/configurações e verifica as saídas geradas, os metadados de invocação, a posição dos campos de modelo e a ligação do hook que só formata. Ele não valida identificadores de modelo contra o catálogo de um provedor.
- `yarn ai-workflow:test` roda fixtures isoladas em Node para payloads de hooks e para a geração/validação do fluxo de trabalho.
- Depois de atualizar um app de agente, verifique nele a descoberta de skills/papéis. Verificações de sintaxe/paridade não substituem uma verificação do carregador. Recarregue o app se uma sessão existente mantiver um catálogo antigo.
- Hooks exigem a confiança no projeto e a revisão de hooks do harness; não contorne a confiança para fazer uma verificação passar. Veja [hooks-setup.md](hooks-setup.md).

## Mantendo instruções úteis

Siga as [orientações da OpenAI sobre skills e prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (revisadas em 2026-09-12): mantenha as descrições precisas, carregue detalhes apenas quando forem relevantes e preserve o escopo pedido pelo usuário. As skills compartilhadas atendem modelos diferentes; mantenha as invariantes específicas do projeto e deixe espaço para escolhas rotineiras de implementação.

Mantenha a finalidade, os limites de decisão e as restrições essenciais de uma skill em `SKILL.md`. Coloque comandos ou exemplos extensos e específicos de cada modo como referências opcionais com link. Ponha as condições de acionamento no início de descrições curtas; uma palavra-chave correspondente, sozinha, não deve ampliar a tarefa. Preserve os metadados de invocação existentes, a menos que o comportamento deles esteja sendo alterado de propósito.

Depois de uma mudança substancial nas instruções, teste alguns pedidos representativos, pequenos e grandes. Verifique quais skills/referências foram selecionadas, se as ações ficaram dentro do escopo, se a verificação correspondeu à mudança e se o trabalho autorizado foi concluído. Testes de schema e de fixtures atestam a correção das ferramentas, não a qualidade das decisões do agente.

## Ferramentas e responsabilidade pelo navegador

Prefira o catálogo existente de skills/ferramentas e as CLIs instaladas no projeto. Use `gh` para o GitHub, `playwright-cli` para verificação no navegador e documentação oficial/específica da versão quando o comportamento de uma biblioteca importar. Evite instalar skills duplicadas ou baixar um pacote sem versão fixada só para rodar um formatador que já existe.

O overhead do MCP depende do harness: o carregamento adiado de ferramentas pode evitar carregar todos os schemas de antemão. Mantenha as integrações relevantes em vez de tratar o próprio MCP como obsoleto. As escolhas de CLI existentes continuam úteis para reprodutibilidade e controle de recursos.

Todas as sessões de navegador usam `./scripts/pw-session.sh`, que impõe um único navegador ativo na máquina inteira. Por padrão, comece com uma sessão nova e isolada. O acesso ao navegador pessoal atual exige autorização explícita; reaproveite essa autorização nas etapas seguintes. Escolha navegadores/viewports conforme o comportamento afetado, rode os engines selecionados em sequência, feche exatamente a sessão nomeada na limpeza e nunca use `close-all`/`kill-all`. Veja a skill `playwright-cli` e [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
