# Agent-Hooks

Die eingecheckten Lifecycle-Hooks formatieren ausschließlich erfolgreich bearbeitete JavaScript-/TypeScript-Dateien mit dem installierten oxfmt. Die gemeinsame Logik liegt in `scripts/agent-hooks/format.mjs`; jeder native Wrapper delegiert an sie.

| App | Native Konfiguration | Ereignis |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude liest keine eigenständige `.claude/hooks.json`. Jede App steuert weiterhin selbst das Projektvertrauen und ob Hooks aktiviert sind; prüfen Sie ihre aktuellen Einstellungen, statt das Vertrauen zu umgehen. `.codex/config.toml` ist Repository-Konfiguration, keine Registry für Hook-Befehle.

Der Formatter validiert Ereignis und Payload, den Erfolg der Bearbeitung, die Dateiendung und dass die Datei innerhalb des Repositorys liegt, Symlinks eingeschlossen. Fehlende Abhängigkeiten oder irrelevante Eingaben lösen keine Arbeit aus. Befehle verwenden ein Argument-Array bei deaktiviertem Netzwerkzugriff für Corepack; Hooks installieren keine Abhängigkeiten, führen keine Builds oder Reviews aus und verändern Git nicht.

Führen Sie Prüfungen ausdrücklich gemäß [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) aus. Führen Sie nach Änderungen am Workflow `yarn ai-workflow:sync`, `yarn ai-workflow:check` und `yarn ai-workflow:test` aus. Fixtures verwenden Wegwerfdateien und vorgetäuschte Formatter-Aufrufe; sie beweisen nicht, dass jede App ihre Konfiguration geladen hat. Laden Sie die App nach Upgrades neu und prüfen Sie ihren Katalog.

Der Design-Skill Impeccable und seine ausführbaren Helfer bleiben bei Bedarf unter `.agents/skills/impeccable` verfügbar. Sein früherer Codex-Hook verwies auf ein fehlendes Verzeichnis; der Design-Workflow läuft jetzt, wenn sein Skill ausgewählt wird, ohne einen dauerhaft aktiven Design-Hook. Der Skill darf Projekt-Hooks nicht nebenbei im Rahmen eines Design-Schritts umkonfigurieren.
