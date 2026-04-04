# Flusso di lavoro di indagine sui bug

Utilizzalo quando viene segnalato un bug in un file/riga/blocco di codice specifico.

## Primo passaggio obbligatorio

Prima di modificare, controlla la cronologia git per il codice pertinente. I contributori precedenti potrebbero aver introdotto un comportamento per un caso limite/una soluzione alternativa.

## Flusso di lavoro

1. Scansiona i titoli dei commit recenti (solo titoli) per il file/l'area:

```bash
# Titoli di commit recenti per un file specifico
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Titoli di commit recenti per un intervallo di linee specifico
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Ispeziona solo i commit rilevanti con differenze con ambito:

```bash
# Mostra messaggio di commit + diff per un file
git show <commit-hash> -- path/to/file.tsx
```

3. Continua con la riproduzione e correggi dopo aver compreso il contesto della cronologia.

## Regola di risoluzione dei problemi

Quando bloccato, cerca sul Web quelli recenti correzioni/soluzioni alternative.
