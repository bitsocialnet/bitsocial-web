# Flusso di lavoro di indagine sui bug

Utilizzalo quando viene segnalato un bug in un file/riga/blocco di codice specifico.

## Primo passaggio obbligatorio

Prima di modificare, controlla la cronologia git per il codice pertinente. I contributori precedenti potrebbero aver introdotto un comportamento per un caso limite/una soluzione alternativa.

## Flusso di lavoro

1. Scansiona i titoli dei commit recenti (solo titoli) per il file/l'area:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Ispeziona solo i commit rilevanti con differenze con ambito:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Continua con la riproduzione e correggi dopo aver compreso il contesto della cronologia.

## Regola di risoluzione dei problemi

Quando bloccato, cerca sul Web quelli recenti correzioni/soluzioni alternative.
