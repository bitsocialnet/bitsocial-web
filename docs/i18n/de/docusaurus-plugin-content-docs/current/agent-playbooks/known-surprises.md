# Bekannte Überraschungen

Diese Datei sammelt repository-spezifische Stolperstellen, die bereits zu Fehlern von Agenten geführt haben.

## Aufnahmekriterien

Nehmen Sie einen Eintrag nur auf, wenn alle Punkte zutreffen:

- Er betrifft speziell dieses Repository (kein allgemeiner Ratschlag).
- Er wird künftigen Agenten mit hoher Wahrscheinlichkeit erneut begegnen.
- Es gibt eine konkrete Gegenmaßnahme, der man folgen kann.

Fragen Sie im Zweifel den Entwickler, bevor Sie einen Eintrag ergänzen.

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

### Produktionsdomains von Vercel-Apps können unbemerkt wieder auf Git-master-Deployments zurückfallen

- **Datum:** 2026-04-28
- **Beobachtet von:** Tommaso + Codex
- **Kontext:** Prüfung der Seedit- und 5chan-App-Spiegel im App-Verzeichnis von Bitsocial Web.
- **Überraschend war:** In den Vercel-Projekten `seedit` und `5chan` stand `gitProviderOptions.createDeployments = "enabled"`, sodass Pushes auf GitHub `master` auf die Produktionsdomains befördert wurden — obwohl die Repo-Richtlinie vorsieht, dass produktive App-Spiegel ausschließlich Release-Artefakte ausliefern.
- **Auswirkung:** Die Badges für verifizierte Spiegel im App-Verzeichnis können falsch werden, weil die Produktionsdomains den neuesten Entwicklungs-Commit ausliefern statt des GitHub-Release-ZIPs, dessen `index.html`-Hash in `about/src/lib/apps-data.ts` hinterlegt ist.
- **Gegenmaßnahme:** Prüfen Sie das Vercel-Projekt mit `vercel api /v9/projects/<project-id>` und bestätigen Sie `gitProviderOptions.createDeployments = "disabled"`, bevor Sie Metadaten zur Spiegel-Verifikation ergänzen oder auffrischen. Rollen Sie den Inhalt des Release-ZIPs mit `vercel deploy --prebuilt --prod` aus und nutzen Sie `seedit-omega.vercel.app` beziehungsweise `5chan-omega.vercel.app` für Entwicklungs-Deployments.
- **Status:** confirmed

### Portless 0.11 übernimmt alten Proxy-Zustand, solange der Launcher HTTPS nicht erzwingt

- **Datum:** 2026-04-28
- **Beobachtet von:** Tommaso + Codex
- **Kontext:** Umstellung des normalen `yarn start`-Ablaufs von der alten Proxy-URL `http://bitsocial.localhost:1355` auf `https://bitsocial.localhost`.
- **Überraschend war:** Selbst mit installiertem `portless@0.11.1` griff Portless auf den vorhandenen HTTP-Proxy aus `~/.portless/proxy.port = 1355` zurück und gab weiterhin die alte URL mit `:1355` aus.
- **Auswirkung:** Paketversionen und Dokumentation zu aktualisieren reicht nicht; `yarn start` kann die alte URL weiterhin anzeigen und verwenden, wenn bei einem Mitwirkenden noch alter Portless-Zustand läuft.
- **Gegenmaßnahme:** Die Start-Skripte sollen den Portless-HTTPS-Proxy weiterhin ausdrücklich auf Port `443` starten, bevor App-Routen registriert werden. So löst sich der Ablauf zur Laufzeit vom persistierten Zustand mit `1355`, statt ihn zu erben.
- **Status:** confirmed

### Portless verändert die kanonische lokale App-URL

- **Datum:** 2026-03-18
- **Beobachtet von:** Codex
- **Kontext:** Browser-Verifikation und Smoke-Abläufe
- **Überraschend war:** Die lokale Standard-URL ist nicht der übliche Vite-Port. Das Repo erwartet `https://bitsocial.localhost` über Portless, sodass ein Test gegen `localhost:3000` oder `localhost:5173` die falsche App oder gar nichts trifft.
- **Auswirkung:** Browser-Prüfungen können fehlschlagen oder das falsche Ziel bestätigen, obwohl der Dev-Server einwandfrei läuft.
- **Gegenmaßnahme:** Verwenden Sie `https://bitsocial.localhost` als Erstes. Umgehen Sie das nur mit `PORTLESS=0 corepack yarn start`, wenn Sie ausdrücklich einen direkten Vite-Port benötigen.
- **Status:** confirmed

### Commitizen-Hooks blockieren nicht-interaktive Commits

- **Datum:** 2026-03-18
- **Beobachtet von:** Codex
- **Kontext:** Agentengesteuerte Commit-Abläufe
- **Überraschend war:** `git commit` löst über Husky Commitizen aus und wartet auf interaktive TTY-Eingaben, was nicht-interaktive Agenten-Shells hängen lässt.
- **Auswirkung:** Agenten können bei einem eigentlich normalen Commit unbegrenzt blockieren.
- **Gegenmaßnahme:** Nutzen Sie für Commits von Agenten `git commit --no-verify -m "message"`. Menschen können weiterhin `corepack yarn commit` oder `corepack yarn exec cz` verwenden.
- **Status:** confirmed

### Corepack ist nötig, damit nicht Yarn Classic greift

- **Datum:** 2026-03-19
- **Beobachtet von:** Codex
- **Kontext:** Umstellung des Paketmanagers auf Yarn 4
- **Überraschend war:** Auf der Maschine liegt weiterhin eine globale Installation von Yarn Classic im `PATH`, sodass ein einfaches `yarn` auf v1 statt auf die festgelegte Yarn-4-Version zeigen kann.
- **Auswirkung:** Entwickler können die Paketmanager-Festlegung des Repos versehentlich umgehen und erhalten abweichendes Installationsverhalten oder eine andere Lockfile-Ausgabe.
- **Gegenmaßnahme:** Verwenden Sie in der Shell `corepack yarn ...` oder führen Sie zuerst `corepack enable` aus, damit ein einfaches `yarn` auf die festgelegte Yarn-4-Version zeigt.
- **Status:** confirmed

### Feste Portless-App-Namen kollidieren zwischen Bitsocial-Web-Worktrees

- **Datum:** 2026-03-30
- **Beobachtet von:** Codex
- **Kontext:** Start von `yarn start` in einem Bitsocial-Web-Worktree, während ein anderer Worktree bereits über Portless auslieferte
- **Überraschend war:** Wird in jedem Worktree wörtlich der Portless-App-Name `bitsocial` verwendet, kollidiert schon die Route selbst — auch bei unterschiedlichen Backing-Ports. Der zweite Prozess scheitert, weil `bitsocial.localhost` bereits registriert ist.
- **Auswirkung:** Parallele Bitsocial-Web-Branches können sich gegenseitig blockieren, obwohl Portless gerade ihr gefahrloses Nebeneinander ermöglichen soll.
- **Gegenmaßnahme:** Lassen Sie den Portless-Start weiterhin über `scripts/start-dev.mjs` laufen. Das Skript nutzt außerhalb des kanonischen Falls eine branch-bezogene Route unter `*.bitsocial.localhost` und weicht auf eine solche Route aus, sobald der schlichte Name `bitsocial.localhost` schon belegt ist.
- **Status:** confirmed

### Die Docs-Vorschau hatte früher Port 3001 fest verdrahtet

- **Datum:** 2026-03-30
- **Beobachtet von:** Codex
- **Kontext:** Betrieb von `yarn start` neben anderen lokalen Repos und Agenten
- **Überraschend war:** Der Root-Dev-Befehl startete den Docs-Workspace mit `docusaurus start --port 3001`. Damit scheiterte die gesamte Dev-Sitzung, sobald ein anderer Prozess `3001` bereits belegte — obwohl die Haupt-App längst Portless nutzte.
- **Auswirkung:** `yarn start` konnte den Web-Prozess unmittelbar nach dem Hochfahren beenden und wegen einer Kollision am Docs-Port unbeteiligte lokale Arbeit unterbrechen.
- **Gegenmaßnahme:** Lassen Sie den Docs-Start weiterhin über `yarn start:docs` laufen. Der Befehl setzt inzwischen auf Portless plus `scripts/start-docs.mjs`, berücksichtigt einen übergebenen freien Port und weicht bei direktem Aufruf auf den nächsten verfügbaren Port aus.
- **Status:** confirmed

### Der feste Portless-Hostname der Docs war hart codiert

- **Datum:** 2026-04-03
- **Beobachtet von:** Codex
- **Kontext:** Betrieb von `yarn start` in einem zweiten Bitsocial-Web-Worktree, während ein anderer Worktree die Docs bereits über Portless auslieferte
- **Überraschend war:** `start:docs` registrierte weiterhin wörtlich den Hostnamen `docs.bitsocial.localhost`, sodass `yarn start` scheitern konnte, obwohl die About-App Portless-Routenkollisionen für ihren eigenen Hostnamen längst zu vermeiden wusste.
- **Auswirkung:** Parallele Worktrees konnten den Root-Dev-Befehl nicht zuverlässig nutzen, weil der Docs-Prozess zuerst ausstieg und `concurrently` daraufhin den Rest der Sitzung beendete.
- **Gegenmaßnahme:** Lassen Sie den Docs-Start weiterhin über `scripts/start-docs.mjs` laufen. Das Skript leitet inzwischen denselben branch-bezogenen Portless-Hostnamen ab wie die About-App und reicht diese gemeinsame öffentliche URL an das Dev-Proxy-Ziel für `/docs` weiter.
- **Status:** confirmed

### Worktree-Shells können die im Repo festgelegte Node-Version verfehlen

- **Datum:** 2026-04-03
- **Beobachtet von:** Codex
- **Kontext:** Betrieb von `yarn start` in Git-Worktrees wie `.claude/worktrees/*` oder benachbarten Worktree-Checkouts
- **Überraschend war:** Manche Worktree-Shells lösten `node` und `yarn node` auf Homebrew-Node `25.2.1` auf, obwohl das Repo in `.nvmrc` auf `22.12.0` festgelegt ist. `yarn start` konnte die Dev-Launcher damit stillschweigend unter der falschen Laufzeit ausführen.
- **Auswirkung:** Das Verhalten des Dev-Servers kann zwischen Haupt-Checkout und Worktrees auseinanderlaufen. Fehler werden dadurch schwer reproduzierbar, und die erwartete Node-22-Toolchain des Repos wird verletzt.
- **Gegenmaßnahme:** Lassen Sie die Dev-Launcher weiterhin über `scripts/start-dev.mjs` und `scripts/start-docs.mjs` laufen; beide führen sich inzwischen unter der Node-Binary aus `.nvmrc` neu aus, wenn die aktuelle Shell auf der falschen Version liegt. Die Shell-Einrichtung sollte trotzdem `nvm use` bevorzugen.
- **Status:** confirmed

### Überreste von `docs-site/` können nach dem Refactor fehlende Docs-Quellen verdecken

- **Datum:** 2026-04-01
- **Beobachtet von:** Codex
- **Kontext:** Aufräumen des Monorepos nach dem Merge, nachdem das Docusaurus-Projekt von `docs-site/` nach `docs/` umgezogen war
- **Überraschend war:** Der alte Ordner `docs-site/` kann mit veralteten, aber wichtigen Dateien wie `i18n/` auf der Festplatte liegen bleiben, selbst nachdem das versionierte Repo zu `docs/` gewechselt ist. Der Refactor wirkt lokal dadurch doppelt vorhanden, und es fällt nicht auf, dass versionierte Docs-Übersetzungen gar nicht nach `docs/` mitgezogen wurden.
- **Auswirkung:** Agenten löschen den alten Ordner womöglich als „Müll“ und verlieren dabei die einzige lokale Kopie der Docs-Übersetzungen — oder sie pflegen weiterhin Skripte, die auf den toten Pfad `docs-site/` zeigen.
- **Gegenmaßnahme:** Behandeln Sie `docs/` als einziges kanonisches Docs-Projekt. Stellen Sie versionierte Quellen wie `docs/i18n/` wieder her und passen Sie Skripte und Hooks so an, dass sie `docs-site` nicht mehr referenzieren, bevor Sie lokale Überreste unter `docs-site/` löschen.
- **Status:** confirmed

### Die mehrsprachige Docs-Vorschau kann den RAM-Verbrauch während der Verifikation hochtreiben

- **Datum:** 2026-04-01
- **Beobachtet von:** Codex
- **Kontext:** Korrekturen an Docs-i18n, Locale-Routing und Pagefind-Verhalten mit `yarn start:docs` plus Playwright
- **Überraschend war:** Der Standardmodus der Docs-Vorschau erzeugt inzwischen vor dem Ausliefern einen vollständigen mehrsprachigen Docs-Build samt Pagefind-Indexierung. Bleibt dieser Prozess neben mehreren Playwright- oder Chrome-Sitzungen aktiv, verbraucht er deutlich mehr RAM als eine normale Vite- oder einsprachige Docusaurus-Dev-Schleife.
- **Auswirkung:** Der Speicher der Maschine wird knapp, Browsersitzungen können abstürzen, und abgebrochene Läufe hinterlassen unter Umständen alte Docs-Server oder Headless-Browser, die weiter Speicher belegen.
- **Gegenmaßnahme:** Bevorzugen Sie für Docs-Arbeiten ohne Prüfung von Locale-Routen oder Pagefind den Modus `DOCS_START_MODE=live yarn start:docs`. Die vollständige mehrsprachige Vorschau nur dann, wenn übersetzte Routen oder Pagefind tatsächlich zu validieren sind. Halten Sie genau eine Playwright-Sitzung offen, schließen Sie alte Browsersitzungen vor dem Öffnen neuer, und stoppen Sie den Docs-Server nach der Verifikation, sobald Sie ihn nicht mehr brauchen.
- **Status:** confirmed

### `translate-docs.py` kann Docs-Locales halb übersetzt oder mit defekten Linkzielen hinterlassen

- **Datum:** 2026-04-06
- **Beobachtet von:** Codex
- **Kontext:** Reparatur lokalisierter Docs-Routen und -Inhalte, nachdem `yarn start:docs` englische Detailseiten auslieferte oder die Locale-Ausgabe nicht bauen konnte
- **Überraschend war:** Die Übersetzungs-Pipeline der Docs hatte zwei repo-spezifische Fehlermodi gleichzeitig: `scripts/translate-docs.py` extrahierte nur einen kleinen Teil der `DocsHome`-Meldungen, sobald `tr(...)`-Aufrufe in Formen vorlagen, die das Skript nicht parste; und übersetztes Markdown unter `docs/i18n/**` konnte maschinell übersetzte Slugs oder `ZXQPLACEHOLDER`-Artefakte innerhalb von Linkzielen enthalten.
- **Auswirkung:** Lokalisierte Startseiten fallen stillschweigend auf Englisch zurück, lokalisierte Detailseiten wirken unübersetzt, und ein vollständiges `yarn docs:build` kann an defekten Locale-Links scheitern, obwohl die Quelldokumente gültig sind.
- **Gegenmaßnahme:** Führen Sie nach Änderungen an Docs-Übersetzungen oder nach dem Neugenerieren von Locale-Dateien immer `yarn docs:build` aus dem Repo-Root aus, durchsuchen Sie das Markdown unter `docs/i18n/**` nach `ZXQPLACEHOLDER` und prüfen Sie, dass übersetzte Links weiterhin auf kanonische Doc-Slugs wie `/apps/5chan/` zeigen statt auf übersetzte URL-Pfade. Hat sich der Text von `DocsHome` geändert, vergewissern Sie sich, dass `scripts/translate-docs.py` weiterhin alle `docs.home.*`-Meldungen extrahiert.
- **Status:** confirmed

### No-JS-Prüfungen der About-Site müssen über die Portless-Route laufen, nicht über eine eigenständige SSR-Vorschau

- **Datum:** 2026-04-12
- **Beobachtet von:** Codex
- **Kontext:** Prüfung der No-JS-Unterstützung der Site unter `about/` aus einem Branch-Worktree heraus
- **Überraschend war:** Eine eigenständige SSR-Vorschau kann gesund wirken, während die eigentliche branch-bezogene Portless-Route noch die falsche App-Shell oder einen älteren Prozess ausliefert. In diesem Repo ist der tatsächliche lokale Vertrag der Portless-Hostname aus `yarn start`, nicht ein improvisierter Vorschau-Server.
- **Auswirkung:** Agenten behaupten womöglich fälschlich, die No-JS-Unterstützung funktioniere, oder übersehen Regressionen, die nur unter `*.bitsocial.localhost` auftreten.
- **Gegenmaßnahme:** Starten Sie für die Browser-Verifikation von `about/` stets den echten lokalen Server mit `yarn start` oder `yarn start:about` und testen Sie zuerst die branch-bezogene Portless-URL. Wirkt ein Portless-Hostname veraltet, untersuchen und stoppen Sie den alten Prozess vor dem erneuten Test.
- **Status:** confirmed

### `chain/` war für `yarn build:verify` und `yarn doctor` unsichtbar

- **Datum:** 2026-07-05
- **Beobachtet von:** Codex
- **Kontext:** Verifikation eines Diffs, das nur chain/ betraf, nachdem der Workspace `chain/` (eigenständige Vite-App für `chain.bitsocial.net`) ins Monorepo aufgenommen worden war.
- **Überraschend war:** `scripts/verify-build.mjs` kannte nur die Pfadpräfixe `about/`, `docs/` und `stats/`. Ein Diff, das nur chain/ betraf, gab daher "No targeted build checks matched the current diff" aus und baute überhaupt nichts, obwohl `build:chain` in der Root-`package.json` längst existierte. Davon unabhängig war `yarn doctor` fest auf `react-doctor about -y` verdrahtet, sodass React-Änderungen unter `chain/src` null Abdeckung durch React Doctor erhielten.
- **Auswirkung:** Wer chain-Änderungen verifizierte, musste wissen, dass `yarn build:chain` direkt aufzurufen war, statt `yarn build:verify` zu vertrauen; React-Probleme in `chain/src` (Effects, Hooks, toter Code) blieben für `yarn doctor` unsichtbar.
- **Gegenmaßnahme:** `scripts/verify-build.mjs` hat inzwischen einen `chain/`-Zweig analog zu dem für `about/`, und `doctor` sowie `doctor:verbose` rufen in einem einzigen Aufruf `react-doctor --project about,chain -y` auf. `doctor:score` bleibt auf `about` beschränkt, weil `--score` in Kombination mit `--project` für mehr als ein Projekt stillschweigend nichts ausgibt; wird ein Score für chain gebraucht, nutzen Sie `yarn react-doctor --project about,chain --verbose -y` (oder `--json`).
- **Status:** confirmed

### Browser-P2P läuft über sichere WebSockets; pkc-js verweigert WebRTC und WebTransport standardmäßig

- **Datum:** 2026-08-02
- **Beobachtet von:** Claude
- **Kontext:** Verfassen von Texten für Landingpage und Dokumentation darüber, wie Bitsocial-Browser-P2P funktioniert
- **Überraschend war:** `@pkcprotocol/pkc-js` liefert einen Standard-Connection-Gater mit, der WebRTC- und WebTransport-Dials im Browser ablehnt — `dist/browser/helia/dial-transport-filter.js` exportiert `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Der Kommentar im Quelltext nennt den Grund: Im Browser bringen diese Transporte lange, häufig scheiternde Wege zum Verbindungsaufbau mit sich (STUN/ICE, Certhash-Rotation), die das Laden verlangsamen, während WebSocket direkt und verlässlich ist. Jeder aktive Peer im P2P-Statuspanel des Blogs zeigt "Secure WebSocket". Der Gater steckt in `node_modules`, sodass nichts im Repo darauf hindeutet.
- **Auswirkung:** Es ist sehr leicht, technisch plausible, aber falsche öffentliche Texte zu schreiben — etwa WebTransport, das im März 2026 Browser-Baseline erreichte, dafür verantwortlich zu machen, dass Bitsocial-Browser-P2P möglich wurde. Genau diese Behauptung ging in die Landingpage, die Vergleichstabelle und zwei Dokumentationsseiten, bevor der Entwickler sie bemerkte. Falsche Architekturaussagen auf öffentlichen Seiten werden ausgerechnet von jenem Entwicklerpublikum überprüft, das die Site adressiert.
- **Gegenmaßnahme:** Schließen Sie niemals daraus, was libp2p oder die Browser-Plattform grundsätzlich unterstützen, auf die von Bitsocial tatsächlich genutzten Transporte. Sehen Sie in `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` die aktuelle Deny-Liste nach, vergewissern Sie sich, dass unter `about/src/` keine Überschreibung von `connectionGater` existiert, und lesen Sie die tatsächlichen Transport-Bezeichnungen im P2P-Statuspanel des Blogs, bevor Sie öffentliche Aussagen treffen. Die Upstream-Änderung, die das Veröffentlichen aus dem Browser wirklich freigeschaltet hat, war die Korrektur der monotonen gossipsub-seqno in `@libp2p/gossipsub` 15.0.21 (Mai 2026); pkc-js liefert derzeit 16.0.4 mit.
- **Status:** confirmed

### Relative `./page.md`-Links aus einer nicht übersetzten Docs-Seite brechen jeden lokalisierten Build

- **Datum:** 2026-08-02
- **Beobachtet von:** Claude
- **Kontext:** Ergänzung einer neuen, nur englischen Seite `docs/browser-p2p.md`, die mit `./peer-to-peer-protocol.md` und `./apps/5chan.md` auf bestehende Dokumente verwies
- **Überraschend war:** Jede Locale unter `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` spiegelt den Docs-Baum. Eine neue Seite, die in diesen Spiegeln fehlt, wird über den englischen Fallback zwar in jeder Locale gerendert, aber ihre relativen Markdown-Links lösen nicht mehr auf — Docusaurus erzeugt `/ar/browser-p2p/peer-to-peer-protocol.md/` und lässt den Build mit "Docusaurus found broken links!" scheitern. Entscheidend: `yarn build:verify` und `yarn docs:build:verify` bauen nur `en` und laufen sauber durch; erst ein vollständiges `yarn docs:build` deckt das Problem auf, und es bricht bei der alphabetisch ersten Locale (`ar`) ab.
- **Auswirkung:** Eine Docs-Änderung kann jede schnelle lokale Prüfung bestehen und trotzdem den mehrsprachigen Produktions-Build zerstören. Der Fehler sieht zudem so aus, als hätte er nichts mit der Änderung zu tun, weil die Meldung einen Locale-Pfad nennt, den die Autorin oder der Autor nie angefasst hat.
- **Gegenmaßnahme:** Verwenden Sie in jeder Docs-Seite, die nicht nach `docs/i18n/**` gespiegelt ist, root-relative Links (`/peer-to-peer-protocol/`, `/apps/5chan/`) statt relativer `.md`-Links; Docusaurus stellt ihnen die Locale automatisch voran. `docs/build-your-own-client.md` ist das vorhandene Beispiel. Führen Sie ein vollständiges `yarn docs:build` aus — nicht nur `build:verify` —, bevor Sie eine Änderung übergeben, die eine Docs-Seite hinzufügt oder verlinkt.
- **Status:** confirmed

### Parallele Läufe von `update-translations.js` verlieren stillschweigend Schlüssel

- **Datum:** 2026-08-02
- **Beobachtet von:** Claude
- **Kontext:** Anwendung von 26 übersetzten i18next-Schlüsseln auf alle 36 Locales über den Skill `translate`
- **Überraschend war:** Jeder Aufruf ist ein Read-Modify-Write über alle 36 Locale-Dateien: Laufen zwei Aufrufe gleichzeitig, überschreiben sie einander, und ein Schlüssel verschwindet ohne Fehlermeldung. Der Skill `translate` weist ausdrücklich an, bis zu vier Subagenten parallel zu starten, von denen jeder das Skript aufrufen würde.
- **Auswirkung:** Der Fehler bleibt still: Schlüssel fehlen in beliebigen Locales, und das Diff sieht trotzdem plausibel aus.
- **Gegenmaßnahme:** Lassen Sie Übersetzer-Subagenten niemals gleichzeitig Locale-Dateien schreiben — sie sollen nur Wörterbuch-JSON-Dateien ausgeben, deren Schlüssel der übergeordnete Agent anschließend seriell anwendet. Prüfen Sie nach dem Anwenden programmatisch, dass jeder Schlüssel in allen 35 nicht-englischen Locales vorhanden und kein Wert byte-identisch mit der englischen Quelle ist.
- **Status:** confirmed
- **Nachtrag (2026-08-10):** Früher löste das Skript sein Ziel zusätzlich als `path.join(process.cwd(), "public", "translations")` auf, sodass der dokumentierte Befehl aus dem Repo-Root mit "Translations directory not found" scheiterte und aus `about/` heraus ausgeführt werden musste. Inzwischen ermittelt es den Workspace aus dem aktuellen Verzeichnis oder aus seinem eigenen Speicherort und funktioniert von überall. Die oben beschriebene Nebenläufigkeitsfalle besteht unverändert.

### Annotations-Bedienelemente der Entwicklungsumgebung können automatisierte Klicks abfangen

- **Kontext:** Die About- und die Chain-Site haben feste Bedienelemente in der unteren rechten Ecke, wo in der Entwicklung auch die Agentation-Toolbar erscheint.
- **Gegenmaßnahme:** `scripts/pw-session.sh open` registriert `window.__NO_DEV_TOOLBAR__ = true`, bevor die Seite neu geladen wird. Der Agentation-Initialisierer berücksichtigt außerdem `__VISUAL_TESTING__` und `__PROFILING__`; die Quellcode-Inspektion bleibt unabhängig davon verfügbar. Direkte Browser-Automatisierung muss dasselbe Flag setzen, bevor die Anwendung geladen wird.

### `skills add` installiert die Kopien für Codex und Cursor in das von Git ignorierte Verzeichnis `.agents/`

- **Datum:** 2026-08-18
- **Beobachtet von:** Tommaso + Claude
- **Kontext:** Installation des Skills `improve-threejs` aus `millionco/react-doctor` mit der CLI `skills` (`vercel-labs/skills`).
- **Überraschend war:** `npx skills add <repo> --skill <name> --agent codex` und `--agent cursor` schreiben beide nach `.agents/skills/<name>/`, nicht nach `.codex/skills/` oder `.cursor/skills/`. `AGENTS.md` verbietet ein `.agents/`-Verzeichnis auf Repo-Ebene, und `.gitignore:29` ignoriert es, sodass beide Kopien stillschweigend unversioniert bleiben. Nur `--agent claude-code` schreibt in das erwartete `.claude/skills/`. Unabhängig davon scheitert die dokumentierte kommagetrennte Form (`--agent claude-code,codex,cursor`) mit "Invalid agents" und installiert nichts, obwohl jeder Name für sich gültig ist.
- **Auswirkung:** Die Installation meldet Erfolg, während zwei der drei Toolchain-Kopien an einem Ort landen, der nie committet wird, sodass Codex und Cursor nach einem frischen Klon stillschweigend ohne den Skill dastehen. Die Kommaform kann außerdem eine wirkungslose Installation erzeugen, die wie ein Erfolg aussieht.
- **Aktuelle Gegenmaßnahme:** Das Repository versioniert jetzt `.agents/skills` als kanonische Quelle und erzeugt die Claude-Kopien mit `yarn ai-workflow:sync`. Das frühere Verbot von `.agents` und die Ignore-Regel wurden entfernt. Kopieren Sie neue Skills nicht in drei unabhängige Wurzelverzeichnisse; prüfen Sie nach dem Hinzufügen eines Skills die Parität der erzeugten Dateien und den Katalog der App.
- **Status:** confirmed
