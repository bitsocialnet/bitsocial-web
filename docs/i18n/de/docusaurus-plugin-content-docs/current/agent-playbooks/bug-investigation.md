# Arbeitsablauf zur Fehleruntersuchung

Verwenden Sie dies, wenn ein Fehler in einer bestimmten Datei/Zeile/Codeblock gemeldet wird.

## Obligatorischer erster Schritt

Überprüfen Sie vor der Bearbeitung den Git-Verlauf auf den relevanten Code. Frühere Mitwirkende haben möglicherweise Verhalten für einen Grenzfall/eine Problemumgehung eingeführt.

## Arbeitsablauf

1. Durchsuchen Sie die letzten Commit-Titel (nur Titel) für die Datei/den Bereich:

```bash
# Aktuelle Commit-Titel für eine bestimmte Datei
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Aktuelle Commit-Titel für einen bestimmten Zeilenbereich
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Untersuchen Sie nur relevante Commits mit bereichsbezogenen Unterschieden:

```bash
# Commit-Nachricht + Diff für eine Datei anzeigen
git show <commit-hash> -- path/to/file.tsx
```

3. Fahren Sie mit der Reproduktion und Korrektur fort, nachdem Sie den Verlaufskontext verstanden haben.

## Fehlerbehebungsregel

Wenn es blockiert ist, durchsuchen Sie das Internet nach aktuellen Korrekturen/Problemumgehungen.
