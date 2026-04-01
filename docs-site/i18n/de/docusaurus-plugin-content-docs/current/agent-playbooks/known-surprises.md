# Bekannte Überraschungen

Diese Datei verfolgt Repository-spezifische Verwirrungspunkte, die Agentenfehler verursacht haben.

## Teilnahmekriterien

Fügen Sie nur dann einen Eintrag hinzu, wenn alle wahr sind:

- Es ist spezifisch für dieses Repository (keine allgemeine Empfehlung).
- Es ist wahrscheinlich, dass es bei zukünftigen Agenten wieder auftritt.
- Es gibt eine konkrete Abhilfemaßnahme, die befolgt werden kann.

Wenn Sie unsicher sind, fragen Sie den Entwickler, bevor Sie einen Eintrag hinzufügen.

## Eintragsvorlage

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Einträge

### Portless ändert die kanonische lokale App-URL

- **Datum:** 18.03.2026
- **Beobachtet von:** Codex
- **Kontext:** Browserüberprüfung und Rauchentwicklung
- **Was überraschend war:** Die standardmäßige lokale URL ist nicht der übliche Vite-Port. Das Repo erwartet `http://bitsocial.localhost:1355` über Portless, sodass die Überprüfung von `localhost:3000` oder `localhost:5173` möglicherweise die falsche App oder gar nichts trifft.
- **Auswirkungen:** Browserprüfungen können fehlschlagen oder das falsche Ziel validieren, selbst wenn der Entwicklungsserver fehlerfrei ist.
- **Abhilfe:** Verwenden Sie zuerst `http://bitsocial.localhost:1355`. Umgehen Sie es nur mit `PORTLESS=0 corepack yarn start`, wenn Sie explizit einen direkten Vite-Port benötigen.
- **Status:** bestätigt

### Commitizen-Hooks blockieren nicht interaktive Commits

- **Datum:** 18.03.2026
- **Beobachtet von:** Codex
- **Kontext:** Agentengesteuerte Commit-Workflows
- **Was überraschend war:** `git commit` löst Commitizen über Husky aus und wartet auf interaktive TTY-Eingaben, wodurch nicht interaktive Agent-Shells hängen bleiben.
- **Auswirkungen:** Agenten können während eines eigentlich normalen Commits auf unbestimmte Zeit ins Stocken geraten.
- **Abhilfe:** Verwenden Sie `git commit --no-verify -m "message"` für vom Agenten erstellte Commits. Menschen können weiterhin `corepack yarn commit` oder `corepack yarn exec cz` verwenden.
- **Status:** bestätigt

### Corepack ist erforderlich, um Yarn Classic zu vermeiden

- **Datum:** 19.03.2026
- **Beobachtet von:** Codex
- **Kontext:** Migration des Paketmanagers zu Yarn 4
- **Was überraschend war:** Der Computer verfügt immer noch über eine globale Yarn Classic-Installation auf `PATH`, sodass die Ausführung von einfachem `yarn` zu Version 1 statt zur angehefteten Yarn 4-Version aufgelöst werden kann.
- **Auswirkungen:** Entwickler können versehentlich die Paketmanager-Anheftung des Repos umgehen und ein anderes Installationsverhalten oder eine andere Sperrdateiausgabe erhalten.
- **Abhilfe:** Verwenden Sie `corepack yarn ...` für Shell-Befehle oder führen Sie zuerst `corepack enable` aus, damit einfaches `yarn` in die angeheftete Yarn 4-Version aufgelöst wird.
- **Status:** bestätigt

### Problem behoben, bei dem Portless-App-Namen in Bitsocial-Web-Arbeitsbäumen kollidierten

- **Datum:** 30.03.2026
- **Beobachtet von:** Codex
- **Kontext:** `yarn start` wird in einem Bitsocial Web-Arbeitsbaum gestartet, während ein anderer Arbeitsbaum bereits über Portless bereitgestellt wurde
- **Was überraschend war:** Die Verwendung des wörtlichen portlosen App-Namens `bitsocial` in jedem Arbeitsbaum führt zu einer Kollision der Route selbst, selbst wenn die Backing-Ports unterschiedlich sind, sodass der zweite Prozess fehlschlägt, weil `bitsocial.localhost` bereits registriert ist.
- **Auswirkungen:** Parallele Bitsocial-Webzweige können sich gegenseitig blockieren, obwohl Portless dafür gedacht ist, dass sie sicher koexistieren.
- **Abhilfe:** Behalten Sie den Portless-Start hinter `scripts/start-dev.mjs` bei, der jetzt außerhalb des kanonischen Falls eine verzweigungsbezogene Route `*.bitsocial.localhost:1355` verwendet und auf eine verzweigungsbezogene Route zurückgreift, wenn der bloße Name `bitsocial.localhost` bereits belegt ist.
- **Status:** bestätigt

### Die Vorschau der Dokumente wurde zum Festcodieren von Port 3001 verwendet

- **Datum:** 30.03.2026
- **Beobachtet von:** Codex
- **Kontext:** `yarn start` zusammen mit anderen lokalen Repos und Agents ausführen
- **Was überraschend war:** Der Root-Dev-Befehl führte den Docs-Arbeitsbereich mit `docusaurus start --port 3001` aus, sodass die gesamte Dev-Sitzung immer dann fehlschlug, wenn ein anderer Prozess bereits `3001` besaß, obwohl die Haupt-App bereits Portless verwendete.
- **Auswirkungen:** `yarn start` könnte den Webprozess sofort nach dem Booten beenden und damit nicht zusammenhängende lokale Arbeiten aufgrund einer Dokument-Port-Kollision unterbrechen.
- **Abhilfe:** Der Start der Dokumente bleibt hinter `yarn start:docs`, das jetzt Portless plus `scripts/start-docs.mjs` verwendet, um einen injizierten freien Port zu berücksichtigen oder bei direkter Ausführung auf den nächsten verfügbaren Port zurückzugreifen.
- **Status:** bestätigt
