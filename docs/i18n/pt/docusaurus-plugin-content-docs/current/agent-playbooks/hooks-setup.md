# Configuração de ganchos de agente

Se o seu assistente de codificação de IA suportar ganchos de ciclo de vida, configure-os para este repositório.

## Ganchos recomendados

| Gancho          | Comando                                    | Finalidade                                                                                                                                                                                                                     |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Formatar arquivos automaticamente após edições de IA                                                                                                                                                                           |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Execute `corepack yarn install` quando `package.json` for alterado                                                                                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Eliminar referências obsoletas e excluir ramificações de tarefas temporárias integradas                                                                                                                                        |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Verificações de construção, lint, verificação de tipo e formato de hard-gate; mantenha `yarn npm audit` informativo e execute `yarn knip` separadamente como uma auditoria consultiva quando as dependências/importações mudam |

## Por que

- Formatação consistente
- Lockfile permanece sincronizado
- Problemas de build/lint/type detectados antecipadamente
- Visibilidade de segurança via `yarn npm audit`
- O desvio de dependência/importação pode ser verificado com `yarn knip` sem transformá-lo em um gancho de parada global barulhento
- Uma implementação de gancho compartilhada para Codex e Cursor
- As ramificações de tarefas temporárias permanecem alinhadas com o fluxo de trabalho da árvore de trabalho do repositório

## Exemplo de scripts de gancho

### Gancho de formato

```bash
#!/bin/bash
# Formatar automaticamente arquivos JS/TS após edições de IA
# Hook recebe JSON via stdin com file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Verifique o gancho

```bash
#!/bin/bash
# Execute build, lint, typecheck, verificação de formato e auditoria de segurança quando o agente terminar

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Por padrão, `scripts/agent-hooks/verify.sh` sai diferente de zero quando uma verificação necessária falha. Defina `AGENT_VERIFY_MODE=advisory` somente quando você precisar intencionalmente do sinal de uma árvore quebrada sem bloquear o gancho. Mantenha `yarn knip` fora do controle, a menos que o repositório decida explicitamente falhar em problemas de importação/dependência de consultoria.

### Gancho de instalação de fio

```bash
#!/bin/bash
# Execute corepack yarn install quando package.json for alterado
# Hook recebe JSON via stdin com file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

Configure a fiação do gancho de acordo com a documentação da ferramenta do agente (`hooks.json`, equivalente, etc.).

Neste repositório, `.codex/hooks/*.sh` e `.cursor/hooks/*.sh` devem permanecer como thin wrappers que delegam para as implementações compartilhadas em `scripts/agent-hooks/`.
