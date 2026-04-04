# Fluxo de trabalho de investigação de bugs

Use isto quando um bug for relatado em um bloco de arquivo/linha/código específico.

## Primeiro passo obrigatório

Antes de editar, verifique o histórico do git para obter o código relevante. Colaboradores anteriores podem ter introduzido comportamento para um caso extremo/solução alternativa.

## Fluxo de trabalho

1. Verifique os títulos de commit recentes (somente títulos) para o arquivo/área:

```bash
# Títulos de commits recentes para um arquivo específico
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Títulos de commits recentes para um intervalo de linhas específico
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspecione apenas commits relevantes com diferenças de escopo:

```bash
# Mostrar mensagem de commit + diferença para um arquivo
git show <commit-hash> -- path/to/file.tsx
```

3. Continue com a reprodução e corrija depois de compreender o contexto histórico.

## Regra de solução de problemas

Quando bloqueado, pesquise na web por correções/soluções alternativas recentes.
