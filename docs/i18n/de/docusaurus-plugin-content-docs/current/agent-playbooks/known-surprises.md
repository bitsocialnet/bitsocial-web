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
- **Was überraschend war:** Die standardmäßige lokale URL ist nicht der übliche Vite-Port. Das Repo erwartet `https://bitsocial.localhost` über Portless, sodass die Überprüfung von `localhost:3000` oder `localhost:5173` möglicherweise die falsche App oder gar nichts trifft.
- **Auswirkungen:** Browserprüfungen können fehlschlagen oder das falsche Ziel validieren, selbst wenn der Entwicklungsserver fehlerfrei ist.
- **Abhilfe:** Verwenden Sie zuerst `https://bitsocial.localhost`. Umgehen Sie es nur mit `PORTLESS=0 corepack yarn start`, wenn Sie explizit einen direkten Vite-Port benötigen.
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
- **Abhilfe:** Behalten Sie den Portless-Start hinter `scripts/start-dev.mjs` bei, der jetzt außerhalb des kanonischen Falls eine verzweigungsbezogene Route `*.bitsocial.localhost` verwendet und auf eine verzweigungsbezogene Route zurückgreift, wenn der bloße Name `bitsocial.localhost` bereits belegt ist.
- **Status:** bestätigt

### Die Vorschau der Dokumente wurde zum Festcodieren von Port 3001 verwendet

- **Datum:** 30.03.2026
- **Beobachtet von:** Codex
- **Kontext:** `yarn start` zusammen mit anderen lokalen Repos und Agents ausführen
- **Was überraschend war:** Der Root-Dev-Befehl führte den Docs-Arbeitsbereich mit `docusaurus start --port 3001` aus, sodass die gesamte Dev-Sitzung immer dann fehlschlug, wenn ein anderer Prozess bereits `3001` besaß, obwohl die Haupt-App bereits Portless verwendete.
- **Auswirkungen:** `yarn start` könnte den Webprozess sofort nach dem Booten beenden und damit nicht zusammenhängende lokale Arbeiten aufgrund einer Docs-Port-Kollision unterbrechen.
- **Abhilfe:** Der Start der Dokumente bleibt hinter `yarn start:docs`, das jetzt Portless plus `scripts/start-docs.mjs` verwendet, um einen injizierten freien Port zu berücksichtigen oder bei direkter Ausführung auf den nächsten verfügbaren Port zurückzugreifen.
- **Status:** bestätigt

### Der Portless-Hostname für Dokumente wurde fest codiert

- **Datum:** 03.04.2026
- **Beobachtet von:** Codex
- **Kontext:** Ausführen von `yarn start` in einem sekundären Bitsocial Web-Arbeitsbaum, während ein anderer Arbeitsbaum bereits Dokumente über Portless bereitstellte
- **Was überraschend war:** `start:docs` registrierte immer noch den wörtlichen Hostnamen `docs.bitsocial.localhost`, sodass `yarn start` fehlschlagen konnte, obwohl die About-App bereits wusste, wie Portless-Routenkollisionen für ihren eigenen Hostnamen vermieden werden konnten.
- **Auswirkung:** Parallele Arbeitsbäume konnten den Root-Dev-Befehl nicht zuverlässig verwenden, da der Docs-Prozess zuerst beendet wurde und `concurrently` dann den Rest der Sitzung beendete.
- **Abhilfe:** Behalten Sie den Start von Dokumenten hinter `scripts/start-docs.mjs` bei, wodurch jetzt derselbe verzweigungsbezogene Portless-Hostname wie die About-App abgeleitet wird und diese gemeinsam genutzte öffentliche URL in das Entwicklungs-Proxy-Ziel `/docs` eingefügt wird.
- **Status:** bestätigt

### Worktree-Shells können die angeheftete Node-Version des Repos verpassen

- **Datum:** 03.04.2026
- **Beobachtet von:** Codex
- **Kontext:** Ausführen von `yarn start` in Git-Arbeitsbäumen wie `.claude/worktrees/*` oder Geschwister-Arbeitsbaum-Checkouts
- **Was überraschend war:** Einige Worktree-Shells haben `node` und `yarn node` in den Homebrew-Knoten `25.2.1` aufgelöst, obwohl das Repo `22.12.0` in `.nvmrc` feststeckt, sodass `yarn start` die Entwicklungsstarter unter der falschen Laufzeit stillschweigend ausführen konnte.
- **Auswirkungen:** Das Verhalten des Dev-Servers kann zwischen dem Haupt-Checkout und den Arbeitsbäumen schwanken, was die Reproduktion von Fehlern erschwert und die erwartete Node-22-Toolchain des Repos verletzt.
- **Abhilfe:** Behalten Sie die Entwicklungsstarter hinter `scripts/start-dev.mjs` und `scripts/start-docs.mjs` bei, die jetzt unter der Binärdatei des Knotens `.nvmrc` erneut ausgeführt werden, wenn die aktuelle Shell die falsche Version hat. Das Shell-Setup sollte weiterhin `nvm use` bevorzugen.
- **Status:** bestätigt

### `docs-site/`-Reste können fehlende Dokumentquellen nach dem Refactor verbergen

- **Datum:** 01.04.2026
- **Beobachtet von:** Codex
- **Kontext:** Post-Merge-Monorepo-Bereinigung nach dem Verschieben des Docusaurus-Projekts von `docs-site/` nach `docs/`
- **Was überraschend war:** Der alte Ordner `docs-site/` kann mit veralteten, aber wichtigen Dateien wie `i18n/` auf der Festplatte verbleiben, selbst nachdem das verfolgte Repo nach `docs/` verschoben wurde. Dadurch sieht der Refactor lokal dupliziert aus und kann die Tatsache verbergen, dass die Übersetzungen verfolgter Dokumente nicht tatsächlich in `docs/` verschoben wurden.
- **Auswirkungen:** Agenten können den alten Ordner als „Junk“ löschen und versehentlich die einzige lokale Kopie der Dokumentübersetzungen verlieren oder weiterhin Skripts bearbeiten, die immer noch auf den toten `docs-site/`-Pfad verweisen.
- **Abhilfe:** Behandeln Sie `docs/` als das einzige kanonische Dokumentprojekt. Bevor Sie lokale `docs-site/`-Reste löschen, stellen Sie die nachverfolgte Quelle wie `docs/i18n/` wieder her und aktualisieren Sie Skripte und Hooks, um nicht mehr auf `docs-site` zu verweisen.
- **Status:** bestätigt

### Die Vorschau von Dokumenten mit mehreren Standorten kann während der Überprüfung zu RAM-Spitzen führen

- **Datum:** 01.04.2026
- **Beobachtet von:** Codex
- **Kontext:** Behebung von Dokumenten i18n, Locale-Routing und Pagefind-Verhalten mit `yarn start:docs` plus Playwright
- **Was überraschend war:** Der standardmäßige Vorschaumodus für Dokumente führt jetzt vor der Bereitstellung einen vollständigen Dokumentaufbau mit mehreren Standorten und eine Pagefind-Indizierung durch. Wenn dieser Prozess neben mehreren Playwright- oder Chrome-Sitzungen am Leben bleibt, kann dies viel mehr RAM verbrauchen als eine normale Vite- oder Docusaurus-Entwicklungsschleife mit einem Standort.
- **Auswirkungen:** Der Speicher des Computers kann eingeschränkt werden, Browsersitzungen können abstürzen und unterbrochene Ausführungen können veraltete Dokumentenserver oder kopflose Browser zurücklassen, die weiterhin Speicher verbrauchen.
- **Abhilfe:** Für Dokumentarbeiten, die keine Locale-Route- oder Pagefind-Überprüfung erfordern, bevorzugen Sie `DOCS_START_MODE=live yarn start:docs`. Verwenden Sie die standardmäßige Multilocale-Vorschau nur, wenn Sie übersetzte Routen oder Pagefind validieren müssen. Behalten Sie eine einzelne Playwright-Sitzung bei, schließen Sie alte Browsersitzungen, bevor Sie neue öffnen, und stoppen Sie den Dokumentenserver nach der Überprüfung, wenn Sie ihn nicht mehr benötigen.
- **Status:** bestätigt
