# Arbeitsablauf zur Fehleruntersuchung

Verwenden Sie dies, wenn ein Fehler in einer bestimmten Datei/Zeile/Codeblock gemeldet wird.

## Obligatorischer erster Schritt

Überprüfen Sie vor der Bearbeitung den Git-Verlauf auf den relevanten Code. Frühere Mitwirkende haben möglicherweise Verhalten für einen Grenzfall/eine Problemumgehung eingeführt.

## Arbeitsablauf

1. Durchsuchen Sie die letzten Commit-Titel (nur Titel) für die Datei/den Bereich:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Untersuchen Sie nur relevante Commits mit bereichsbezogenen Unterschieden:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Fahren Sie mit der Reproduktion und Korrektur fort, nachdem Sie den Verlaufskontext verstanden haben.

## Fehlerbehebungsregel

Wenn es blockiert ist, durchsuchen Sie das Internet nach aktuellen Korrekturen/Problemumgehungen.
