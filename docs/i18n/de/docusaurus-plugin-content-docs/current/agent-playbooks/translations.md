# Übersetzungen

Die About-Site verwendet i18next-JSON unter `about/public/translations/{lang}/default.json`. Die Quellübersetzungen für Docusaurus liegen separat in `docs/i18n/`.

## Schlüssel der About-Site

Verwenden Sie `.agents/skills/translate/SKILL.md`. Ermitteln Sie die aktuellen Locales anhand der Dateien auf der Festplatte und bewahren Sie Platzhalter, Markup, Fachbegriffe und Markennamen. Bei größeren Anfragen können Kind-Agenten unabhängige Maps erzeugen, aber ein einziger übergeordneter Agent wendet alle Schreibvorgänge für die Locales nacheinander an; der Updater hat keine Schreibsperre.

Verwenden Sie einen eindeutigen Map-Pfad, der dieser Aufgabe gehört. Prüfen Sie die Vorschau mit `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` und wenden Sie die Änderung dann mit denselben Argumenten und `--write` an. Verifizieren Sie nach dem Schreiben Abdeckung und Werte und entfernen Sie nur die temporären Maps, die dieser Aufgabe gehören.

Verwenden Sie `--delete` für angefragte Entfernungen. Prüfen Sie die Befunde von `--audit --dry`, bevor Sie ein autorisiertes `--audit --write` ausführen; dynamische Übersetzungsschlüssel erfordern eine manuelle Durchsicht des Quellcodes. Kopieren Sie den englischen Text nur bei Fachbegriffen, Marken oder Platzhaltern in jede Locale.

## Docusaurus-Seiten

`scripts/translate-docs.py` ist ein Bulk-Writer für alle Seiten und Locales und hat keinen Filter pro Datei; verwenden Sie ihn nicht für eine eng begrenzte Übersetzungsänderung. `scripts/check-docs-translations.py` ist der schreibgeschützte Verifizierer und unterstützt `--locales` und `--paths`.

Halten Sie Code-Fences, Links, Inline-Code, Vertragsadressen, Überschriften, Tabellen und Admonitions mit der englischen Quelle abgeglichen. Beheben Sie Fehler des Verifizierers; `frontmatter-untranslated`-Warnungen bei Markennamen sind zu erwarten. Folgen Sie `docs/AGENTS.md` und bauen Sie über das Repo-Root, wenn Sie das Docs-Theme oder das i18n-Verhalten ändern, damit die statische Ausgabe und Pagefind übereinstimmen.

## Optionale semantische Prüfung

Für ausgewählte i18next-Schlüssel verwenden Sie `scripts/jev/translation-README.md`. Für Dokumentationsseiten führen Sie zuerst `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md` aus. Das erfordert eine ausdrückliche Auswahl von Locales und Seiten, führt den strukturellen Verifizierer aus und meldet die semantische Prüfung als unverifiziert, bis Live-Inferenz aktiviert ist. Fügen Sie `--live` nur mit der Anbieterautorisierung und dem Budget der Aufgabe hinzu; die gemeinsame private Maschinenkonfiguration liefert Zugangsdaten und ein gepinntes Modell. Umgebungsvariablen und `--model` können diese Einrichtung überschreiben. Der Befehl bearbeitet niemals Übersetzungen.

Der Seitenadapter bewahrt den Kontext der ganzen Seite und begrenzt jede Seite auf 24 KB und jeden Lauf auf 30 Paare. Bereiten Sie für größere Seiten ausdrücklich aufeinander abgestimmte Absatzpaare aus Quelle und Übersetzung für `translations.mjs --pairs` vor; paaren Sie Absätze nicht automatisch nach ihrem Index. Semantische Ergebnisse sind nur Hinweise: Prüfen Sie gemeldete Probleme und Unsicherheiten, und behalten Sie die deterministischen Prüfungen von Code, Links und Adressen bei.
