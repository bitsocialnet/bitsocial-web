# Flujo de trabajo de investigación de errores

Utilícelo cuando se informe de un error en un archivo/línea/bloque de código específico.

## Primer paso obligatorio

Antes de editar, consulte el historial de git para ver el código relevante. Es posible que los colaboradores anteriores hayan introducido un comportamiento para un caso límite/solución alternativa.

## Flujo de trabajo

1. Escanee títulos de confirmaciones recientes (solo títulos) para el archivo/área:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspeccione solo confirmaciones relevantes con diferencias de ámbito:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Continúe con la reproducción y corrija después de comprender el contexto histórico.

## Regla de solución de problemas

Cuando esté bloqueado, busque en la web correcciones/soluciones alternativas recientes.
