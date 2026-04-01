# Commit- und Issue-Format

Verwenden Sie dies, wenn Sie sinnvolle Codeänderungen vorschlagen oder implementieren.

## Commit-Vorschlagsformat

- **Titel:** Konventioneller Commits-Stil, kurz, in Backticks verpackt.
- Verwenden Sie `perf` (nicht `fix`) für Leistungsoptimierungen.
- **Beschreibung:** Optional 2-3 informelle Sätze, die die Lösung beschreiben. Prägnant, technisch, ohne Aufzählungspunkte.

Beispiel:

> **Commit-Titel:** `fix: correct date formatting in timezone conversion`
>
> `formatDate()` in `date-utils.ts` aktualisiert, um Zeitzonenversätze ordnungsgemäß zu verarbeiten.

## Format für GitHub-Problemvorschläge

- **Titel:** So kurz wie möglich, verpackt in Backticks.
- **Beschreibung:** 2-3 informelle Sätze, die das Problem (nicht die Lösung) beschreiben, als ob es noch ungelöst wäre.

Beispiel:

> **GitHub-Problem:**
>
> - **Titel:** `Date formatting displays incorrect timezone`
> - **Beschreibung:** Kommentar-Zeitstempel zeigen falsche Zeitzonen an, wenn Benutzer Beiträge aus verschiedenen Regionen ansehen. Die Funktion `formatDate()` berücksichtigt nicht die lokalen Zeitzoneneinstellungen des Benutzers.
