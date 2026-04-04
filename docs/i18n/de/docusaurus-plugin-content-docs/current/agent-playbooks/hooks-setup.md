# Agent-Hooks-Setup

Wenn Ihr KI-Codierungsassistent Lebenszyklus-Hooks unterstützt, konfigurieren Sie diese für dieses Repo.

## Empfohlene Haken

| Haken           | Befehl                                     | Zweck                                                                                                                                                                                           |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Dateien nach AI-Bearbeitungen automatisch formatieren                                                                                                                                           |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Führen Sie `corepack yarn install` aus, wenn sich `package.json` ändert                                                                                                                         |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Veraltete Referenzen bereinigen und integrierte temporäre Aufgabenzweige löschen                                                                                                                |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-Gate-Build-, Lint-, Typ- und Formatprüfungen; Halten Sie `yarn npm audit` informativ und führen Sie `yarn knip` separat als beratende Prüfung aus, wenn sich Abhängigkeiten/Importe ändern |

## Warum

- Konsistente Formatierung
- Lockfile bleibt synchron
- Build-/Lint-/Type-Probleme werden frühzeitig erkannt
- Sicherheitstransparenz über `yarn npm audit`
- Abhängigkeits-/Importdrift kann mit `yarn knip` überprüft werden, ohne dass es zu einem lauten globalen Stopp-Hook wird
- Eine gemeinsame Hook-Implementierung für Codex und Cursor
- Temporäre Aufgabenverzweigungen bleiben mit dem Arbeitsbaum-Workflow des Repos ausgerichtet

## Beispiel-Hook-Skripte

### Format-Hook

```bash
#!/bin/bash
# JS/TS-Dateien nach AI-Bearbeitungen automatisch formatieren
# Hook empfängt JSON über stdin mit file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Hook überprüfen

```bash
#!/bin/bash
# Führen Sie Build, Lint, Typprüfung, Formatprüfung und Sicherheitsüberprüfung aus, wenn der Agent fertig ist

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Standardmäßig wird `scripts/agent-hooks/verify.sh` mit einem Wert ungleich Null beendet, wenn eine erforderliche Prüfung fehlschlägt. Legen Sie `AGENT_VERIFY_MODE=advisory` nur fest, wenn Sie absichtlich ein Signal von einem gebrochenen Baum benötigen, ohne den Hook zu blockieren. Halten Sie `yarn knip` vom Hard-Gate fern, es sei denn, das Repo entscheidet ausdrücklich, bei beratenden Import-/Abhängigkeitsproblemen fehlzuschlagen.

### Garninstallationshaken

```bash
#!/bin/bash
# Führen Sie corepack Yarn Install aus, wenn package.json geändert wird
# Hook empfängt JSON über stdin mit file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

Konfigurieren Sie die Hakenverkabelung gemäß Ihren Agent-Tool-Dokumenten (`hooks.json`, Äquivalent usw.).

In diesem Repo sollten `.codex/hooks/*.sh` und `.cursor/hooks/*.sh` als Thin Wrapper bleiben, die an die gemeinsam genutzten Implementierungen unter `scripts/agent-hooks/` delegieren.
