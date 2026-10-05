# Hooks de agente

Os hooks de ciclo de vida versionados no repositório apenas formatam arquivos JavaScript/TypeScript editados com sucesso, usando o oxfmt instalado. A lógica compartilhada fica em `scripts/agent-hooks/format.mjs`; cada wrapper nativo delega para ela.

| App | Configuração nativa | Evento |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

O Claude não lê um `.claude/hooks.json` avulso. Cada app continua controlando a confiança no projeto e se os hooks estão habilitados; inspecione as configurações atuais em vez de contornar a confiança. `.codex/config.toml` é configuração do repositório, não um registro de comandos de hook.

O formatador valida o evento/payload, o sucesso da edição, a extensão do arquivo e se ele está contido no repositório, inclusive considerando symlinks. Dependências ausentes ou entradas irrelevantes não geram nenhum trabalho. Os comandos usam um array de argumentos com o acesso à rede do Corepack desativado; hooks não instalam dependências, não rodam builds/revisões e não alteram o Git.

Rode as verificações explicitamente de acordo com [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Rode `yarn ai-workflow:sync`, `yarn ai-workflow:check` e `yarn ai-workflow:test` depois de alterar o fluxo de trabalho. As fixtures usam arquivos descartáveis e invocações simuladas do formatador; elas não provam que cada app carregou sua configuração. Recarregue o app e inspecione o catálogo dele após atualizações.

A skill de design Impeccable e seus helpers executáveis continuam disponíveis sob demanda em `.agents/skills/impeccable`. O antigo hook dela no Codex apontava para um diretório inexistente; o fluxo de design agora roda quando a skill é selecionada, sem nenhum hook de design sempre ativo. A skill não deve reconfigurar os hooks do projeto como um passo incidental de design.
