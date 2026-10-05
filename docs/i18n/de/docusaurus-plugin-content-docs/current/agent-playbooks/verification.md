# Verifikation

Wählen Sie Prüfungen anhand des geänderten Verhaltens und der verbleibenden Unsicherheit aus. Verwenden Sie erfolgreiche Belege für denselben Endzustand wieder; führen Sie Prüfungen nach relevanten Änderungen oder Fehlschlägen erneut aus. Ausdrückliche Anforderungen aus CI, Release oder vom Nutzer gelten weiterhin.

| Änderung                                                             | Angemessene Prüfungen                                                                                                                    |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Nur Prosa/Kommentare/Formatierung                                    | Diff, Verweise, relevante Generatoren; kein App-Build                                                                                    |
| Quellen/Konfiguration des KI-Workflows                               | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; LLM-Indizes neu erzeugen, wenn sich der Kontext geändert hat |
| Isolierter Helfer oder isoliertes Skript                             | Gezielter Aufruf/Fixtures sowie Syntax- oder Typ-/Lint-Prüfungen für den betroffenen Code                                                |
| Änderung an gemeinsamer Laufzeit, Abhängigkeiten, Build, Integration | Gezielte Prüfungen der betroffenen Teile plus die relevanten Build-/Typ-/Lint-Prüfungen unten                                            |
| Nur CSS/Theme/Layout                                                 | Betroffene Routen/Viewports/Themes in ausgewählten Browsern; Build, wenn sich Importe, Assets oder die CSS-Verarbeitung geändert haben   |
| React-State/Effects/Performance                                      | Betroffenes Verhalten und zutreffende React-Leitlinien; Doctor, wenn seine Diagnosen ein konkretes Problem klären                        |

## Projektprüfungen

- `yarn build:verify` wählt den betroffenen Workspace aus. Ist der Umfang bekannt, verwenden Sie `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` oder `yarn docs:build:verify`.
- `yarn build` führt absichtlich den vollständigen Produktions-Build von About-Site und Docs aus, einschließlich aller Docs-Locales. Verwenden Sie ihn für eine Validierung des gesamten Releases oder für Änderungen, die diesen Umfang rechtfertigen.
- `yarn lint`, `yarn typecheck` und `yarn format:check` decken die bestehenden Gates des Repositorys ab; bei einer eng begrenzten Skriptänderung führen Sie zuerst die gezielten Syntax-, Fixture- und Formatprüfungen für dieses Skript aus.
- Änderungen an Manifest oder Lockfile erfordern `corepack yarn install`, `yarn deps:check-pinned` und `yarn deps:check-hardened`. `yarn knip` ist für Abhängigkeiten/Importe nur ein Hinweisgeber.
- Prüfungen für Docs-Übersetzungen stehen in [translations.md](translations.md); führen Sie für eine gezielte Docs-Änderung nicht den Bulk-Writer für Übersetzungen aus.

## Browser-Belege und Zuständigkeit

Verwenden Sie Chrome für kleine, isolierte Browser-Änderungen. Nehmen Sie Firefox und WebKit hinzu bei gemeinsam genutztem CSS, Layout oder Responsive-Verhalten, bei browserabhängigen APIs, umfangreichen Interaktionen, Releases oder ausdrücklichen Cross-Browser-Kriterien. Beziehen Sie betroffene mobile Layouts und Touch-Verhalten ein. Eine bloße Größenänderung des Viewports ist keine Touch-Emulation. Wählen Sie tatsächliche Routen und Inhalte anhand des Quellcodes aus, statt anzunehmen, dass Beispiele verfügbar sind.

Verwenden Sie `playwright-cli` über `./scripts/pw-session.sh`. Maschinenweit ist nur ein Browser aktiv; ausgewählte Engines laufen nacheinander, und jede eigene Sitzung wird gezielt geschlossen, auch nach einem Fehlschlag. Eine autorisierte Sitzung, die dem Aufrufer gehört, verwenden Sie wieder, ohne sie zu schließen. Verwenden Sie niemals ein globales Browser-Cleanup und beenden Sie keinen Server, dessen Eigentümer unklar ist. Für reine Dokumentationsarbeit sind weder Browser noch Server nötig.

Vergleichen Sie bei Performance-Arbeit denselben Ablauf mit gleichwertigem Viewport, Inhalt, Netzwerk-/CPU-Einstellungen, Build-Modus und Messaufwand. Unterscheiden Sie Beobachtungen von vermuteten Ursachen. Verwenden Sie den Profiling-Skill, wenn diese Messungen die eigentliche Anfrage beantworten.

## Abschließende Belege

Ein einziger Agent ist für aufwendige Verifikation zuständig. Prüfen Sie laufende Workloads und serialisieren Sie Installationen, Builds/vollständige Testsuites, Doctor, Android-/Electron-Arbeit und Browser-Profiling. Berichten Sie Befehle und Ergebnisse sowie konkrete Einschränkungen; fehlende Daten oder eine übersprungene Engine sind kein bestandenes Ergebnis. Tooling-Fixtures verifizieren Formate und Mechanik, nicht die End-to-End-Erkennung durch die jeweilige App oder die Entscheidungsqualität des Modells.

## Automatische React-Prüfungen

`yarn agent:verify` führt die ausgewählten Builds aus, gefolgt von `yarn doctor:check` und `yarn perf:check`. `perf:check` enthält den Selbsttest für Collector-Kompatibilität und absichtliche Regressionen, sodass weder CI noch der Verifikationspfad für Agenten einen separaten `perf:test`-Durchlauf braucht. Installieren Sie die gepinnten Browser-Werkzeuge einmalig mit `yarn perf:install` (`--with-deps` in Linux-CI). Nutzen Sie nach dem vollständigen relevanten Durchlauf Ziel- und Szenariofilter für gezielte Wiederholungen. Die Budgets der Szenarien sind in `scripts/react-perf/config.mjs` explizit festgelegt; bewahren Sie Belege auf und beheben Sie eine Regression, bevor Sie eine begründete Änderung der Baseline in Betracht ziehen. Gewöhnliche Produktions-Builds lassen Bippy weg; separate `build:profile:*`-Befehle liefern die offizielle Profiling-Instrumentierung von React.

Das Szenario `apps-search` der About-Site wartet nach jedem Zeichen, bis der Wert in URL und Eingabefeld übernommen wurde, bevor es das nächste tippt. Ein bestandenes Ergebnis deckt diese Abfolge übernommener Suchanfragen ab, nicht die Reaktionsfähigkeit bei schnellem Tippen. Verwenden Sie eine separate Reproduktion mit schneller Eingabe, wenn Sie verlorene Zeichen oder die Reaktionsfähigkeit der Eingabe bewerten.
