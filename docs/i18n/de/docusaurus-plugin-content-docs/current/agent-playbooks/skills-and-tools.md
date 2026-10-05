# Skills und Werkzeuge

Gemeinsame Skills liegen in `.agents/skills/`. Bearbeiten Sie diese Quellen und führen Sie anschließend `yarn ai-workflow:sync` aus, um `.claude/skills/` für Claude Code zu erzeugen. Codex und Cursor erkennen `.agents/skills/` direkt; stellen Sie die doppelten Wurzelverzeichnisse `.codex/skills/` oder `.cursor/skills/` nicht wieder her.

Gemeinsame Rollen-Prompts liegen in `.agents/roles/*.md`. Das ist ein repository-spezifisches Quellformat, kein nativer Erkennungspfad für Agenten. `scripts/ai-workflow-files.mjs` wandelt diese Quellen in die unten aufgeführten app-spezifischen Dateien um; `yarn ai-workflow:sync` schreibt sie. Committen Sie die erzeugten Dateien zusammen mit ihren Quellen, damit ein frischer Checkout die native Konfiguration hat, ohne zuerst einen Generator auszuführen. Entfernen Sie nach dem Löschen einer Quelle deren veraltete erzeugte Ausgaben ausdrücklich; der Validator meldet sie, statt Dateien stillschweigend zu löschen.

## Native Erkennungspfade

Am 2026-09-12 mit der offiziellen Dokumentation abgeglichen:

| App         | Projektanweisungen                                                                         | Von diesem Repository genutzte Skills     | Von diesem Repository genutzte benutzerdefinierte Agenten |
| ----------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- | --------------------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                | `.agents/skills/<name>/SKILL.md`          | Erzeugte `.codex/agents/<name>.toml`                      |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` bleibt für Cursor-spezifische bedingte Regeln verfügbar | `.agents/skills/<name>/SKILL.md`          | Erzeugte `.cursor/agents/<name>.md`                       |
| Claude Code | `CLAUDE.md` importiert `@AGENTS.md`                                                        | Erzeugte `.claude/skills/<name>/SKILL.md` | Erzeugte `.claude/agents/<name>.md`                       |

Quellen: [Codex-Skills](https://learn.chatgpt.com/docs/build-skills), [Codex-Subagenten](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor-Regeln](https://cursor.com/docs/rules), [Cursor-Skills](https://cursor.com/docs/skills), [Cursor-Subagenten](https://cursor.com/docs/subagents), [Claude-Memory](https://code.claude.com/docs/en/memory), [Claude-Skills](https://code.claude.com/docs/en/skills), [Claude-Subagenten](https://code.claude.com/docs/en/sub-agents).

Ersetzen Sie die nativen Agentenverzeichnisse nicht durch `.agents/roles` und gehen Sie nicht davon aus, dass Claude `.agents/skills` erkennt. Claude kann eine dort referenzierte Datei trotzdem als gewöhnlichen Projektkontext lesen. Cursor erkennt aus Kompatibilitätsgründen auch `.claude/skills`; die Kopien bleiben synchron, aber Cursors veröffentlichte Skill-Anleitung legt nicht fest, ob Einträge über diese Wurzelverzeichnisse hinweg dedupliziert werden. Prüfen Sie den Skill-Katalog der installierten App, statt zu versprechen, dass keine doppelten Einträge auftauchen können.

Die KI-Verzeichnisse verwenden über `.gitattributes` LF-Zeilenenden, damit erzeugter Text plattformübergreifend identisch bleibt. Unterstützende Skill-Assets werden byteweise kopiert.

## Skills

| Skill                                | Zweck                                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Autorisierte, klar abgegrenzte lokale Commits erstellen                                                        |
| `commit-format`, `issue-format`      | Auf Anfrage Formatvorschläge machen                                                                            |
| `make-closed-issue`                  | Ein autorisiertes Issue, einen abgegrenzten Commit und einen PR erstellen                                      |
| `review-and-merge-pr`                | PR-Feedback sichten; nur im angefragten Umfang korrigieren, veröffentlichen oder mergen                        |
| `fix-merge-conflicts`                | Konflikte auflösen und das zusammengeführte Ergebnis verifizieren                                              |
| `release`                            | Release-Texte vorbereiten und autorisierte Release-Schritte ausführen                                          |
| `code-quality-review`                | Nicht triviale Diffs oder ein ausdrücklich angefragtes Qualitätsanliegen prüfen                                |
| `retro`                              | Nachgewiesene Fehler in gezielte Prüfungen oder Leitlinien umwandeln, die eine Wiederholung verhindern         |
| `refactor-pass`, `deslop`            | Angefragtes Aufräumen bestehender Änderungen                                                                   |
| `debug-agent`                        | Belegbasiertes Debugging, bei Bedarf mit Instrumentierung                                                      |
| `you-might-not-need-an-effect`       | Gezieltes Review von Effects und Memos                                                                         |
| `vercel-react-best-practices`        | Zutreffende React-Performance-Leitlinien; Next.js- und reine Server-Regeln für diesen Vite-Client überspringen |
| `translate`                          | Übersetzungen erzeugen und die Maps dann über einen einzigen Schreiber anwenden                                |
| `playwright-cli`, `inspect-elements` | Browser-Verifikation und Zuordnung vom DOM zum Quellcode                                                       |
| `profile-browsing`                   | Abgegrenztes Browser- und React-Profiling                                                                      |
| `test-apk`                           | Einen bereitgestellten Android-Begleit-Wrapper verifizieren                                                    |
| `impeccable`, `improve-threejs`      | Abgegrenztes Interface-Design und Review des Three.js-Renderings                                               |
| `implement-plan`                     | Einen Plan ausführen, optional mit begrenzter Delegation                                                       |
| `readme`                             | Verifizierte Projektdokumentation pflegen                                                                      |
| `context7`                           | Zur Version passende Bibliotheksdokumentation abrufen                                                          |
| `find-skills`                        | Auf ausdrückliche Anfrage zusätzliche Skills finden                                                            |

## Rollen und Modelle

Behalten Sie die benutzerdefinierten Rollen für `browser-check`, `profiler`, `test-apk`, `translator` und `reviewer` bei. Verwenden Sie für gewöhnliche Implementierung und Code-Erkundung die eingebaute Worker-/General-Purpose- oder Explorer-Rolle des Harness. Der übergeordnete Agent legt Akzeptanzkriterien und Zuständigkeiten fest; ein einziger Zuständiger führt aufwendige Prüfungen aus.

Codex-Agentendateien enthalten `name`, `description` und `developer_instructions`. `.codex/config.toml` begrenzt gleichzeitige Kind-Agenten über `max_concurrent_threads_per_session` auf vier. Gemeinsame Rollenmetadaten enthalten Name, Beschreibung und einen optionalen Sandbox-Modus; Modellfelder fehlen absichtlich.

Lassen Sie Modell- und Reasoning-Felder in eingecheckten Skills und benutzerdefinierten Agenten in allen drei Apps weg. So greifen die Wahl beim Aufruf, Nutzervorgaben und die Vererbung vom übergeordneten Agenten gemäß der dokumentierten Rangfolge der jeweiligen App. Aliasse für Claude-Modellfamilien verringern den Pflegeaufwand bei neuen Versionen, legen aber dennoch eine Familie fest; ein versioniertes Cursor-Modell erfordert künftige Aktualisierungen. Halten Sie solche Entscheidungen bei Bedarf in Nutzer- oder Sitzungseinstellungen fest. Vererbung verspricht keine automatische Wahl des derzeit besten Modells. Erfinden Sie keinen `latest`-Alias und ergänzen Sie Routineaufgaben nicht um Recherchen im Modellkatalog. Siehe [Auswahl in Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Auswahl in Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) und [Auswahl in Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` entspricht der Sandbox von Codex und `readonly` in Cursor; bei Claude beschränken die Werkzeugliste und die Rollenanweisungen den Review-Workflow, Bash-Zugriff ist jedoch keine Sandbox auf Betriebssystemebene.

Gemeinsames Skill-Frontmatter verwendet, wo zutreffend, `disable-model-invocation: true` für Workflows, die der Nutzer aufruft. Die entsprechende Einstellung von Codex steht in `agents/openai.yaml` als `policy.allow_implicit_invocation: false`; der Validator verlangt beides. Aufrufmetadaten ergänzen die Regeln zur ausdrücklichen Autorisierung; eine Review-Anfrage autorisiert niemals eine Veröffentlichung, nur weil ein Skill Veröffentlichungsschritte enthält.

## Prüfungen und Erkennung

- `yarn ai-workflow:sync` erzeugt die Kompatibilitätsausgaben mit den installierten `js-yaml` und `smol-toml` neu.
- `yarn ai-workflow:check` parst Quellen, Frontmatter und Konfigurationen und prüft erzeugte Ausgaben, Aufrufmetadaten, die Platzierung von Modellfeldern sowie die Verdrahtung des reinen Formatter-Hooks. Modellbezeichner gleicht es nicht mit dem Katalog eines Anbieters ab.
- `yarn ai-workflow:test` führt isolierte Node-Fixtures für Hook-Payloads und für die Erzeugung und Validierung des Workflows aus.
- Verifizieren Sie nach dem Upgrade einer Agenten-App, dass diese App Skills und Rollen erkennt. Syntax- und Paritätsprüfungen ersetzen keine Prüfung des Loaders. Laden Sie die App neu, wenn eine bestehende Sitzung noch einen alten Katalog verwendet.
- Hooks setzen das Projektvertrauen und die Hook-Prüfung des Harness voraus; umgehen Sie das Vertrauen nicht, nur damit eine Prüfung besteht. Siehe [hooks-setup.md](hooks-setup.md).

## Nützliche Anweisungen pflegen

Folgen Sie [OpenAIs Leitfaden zu Skills und Prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (geprüft am 2026-09-12): Halten Sie Beschreibungen präzise, laden Sie Details nur, wenn sie relevant sind, und wahren Sie den vom Nutzer angefragten Umfang. Gemeinsame Skills dienen unterschiedlichen Modellen; behalten Sie projektspezifische Invarianten bei und lassen Sie Spielraum für routinemäßige Implementierungsentscheidungen.

Halten Sie Zweck, Entscheidungsgrenzen und wesentliche Einschränkungen eines Skills in `SKILL.md` fest. Verlinken Sie umfangreiche modusspezifische Befehle oder Beispiele als optionale Referenzen. Nennen Sie Auslösebedingungen früh in kurzen Beschreibungen; ein passendes Schlüsselwort allein sollte die Aufgabe nicht ausweiten. Behalten Sie bestehende Aufrufmetadaten bei, sofern ihr Verhalten nicht bewusst geändert wird.

Testen Sie nach einer wesentlichen Änderung der Anweisungen einige repräsentative kleine und große Anfragen. Prüfen Sie, welche Skills und Referenzen ausgewählt wurden, ob die Aktionen im vorgesehenen Umfang blieben, ob die Verifikation zur Änderung passte und ob die autorisierte Arbeit abgeschlossen wurde. Schema- und Fixture-Tests belegen die Korrektheit der Werkzeuge, nicht die Entscheidungsqualität der Agenten.

## Werkzeuge und Browser-Zuständigkeit

Bevorzugen Sie den vorhandenen Skill- und Werkzeugkatalog sowie die installierten Projekt-CLIs. Verwenden Sie `gh` für GitHub, `playwright-cli` für Browser-Verifikation und offizielle bzw. versionsspezifische Dokumentation, wenn es auf das Verhalten einer Bibliothek ankommt. Installieren Sie keine doppelten Skills und laden Sie kein ungepinntes Paket, nur um einen vorhandenen Formatter auszuführen.

Der MCP-Overhead hängt vom Harness ab: Verzögertes Laden von Werkzeugen kann vermeiden, dass jedes Schema vorab geladen wird. Halten Sie Integrationen relevant, statt MCP an sich für überholt zu halten. Bestehende CLI-Entscheidungen bleiben für Reproduzierbarkeit und Ressourcenkontrolle nützlich.

Alle Browser-Sitzungen verwenden `./scripts/pw-session.sh`, das maschinenweit nur einen aktiven Browser zulässt. Starten Sie standardmäßig eine frische, isolierte Sitzung. Zugriff auf den aktuellen persönlichen Browser erfordert eine ausdrückliche Autorisierung; diese Autorisierung gilt dann auch für die folgenden Schritte. Wählen Sie Browser und Viewports passend zum betroffenen Verhalten, führen Sie ausgewählte Engines nacheinander aus, schließen Sie beim Aufräumen genau die benannte Sitzung und verwenden Sie niemals `close-all`/`kill-all`. Siehe den Skill `playwright-cli` und [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
