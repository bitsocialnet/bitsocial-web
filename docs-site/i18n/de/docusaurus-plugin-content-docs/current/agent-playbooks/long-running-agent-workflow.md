# Agent-Workflow mit langer Laufzeit

Verwenden Sie dieses Playbook, wenn sich eine Aufgabe wahrscheinlich über mehrere Sitzungen, Übergaben oder erzeugte Agenten erstreckt.

## Ziele

- Geben Sie jeder neuen Sitzung eine schnelle Möglichkeit, den Kontext wiederherzustellen
- Führen Sie die Arbeit inkrementell durch, anstatt eine große Änderung auf einmal vorzunehmen
- Erkennen Sie eine defekte lokale Baseline, bevor Sie weiteren Code hinzufügen
- Hinterlassen Sie dauerhafte Artefakte, denen die nächste Sitzung vertrauen kann

## Wo man den Staat behält

- Verwenden Sie `docs/agent-runs/<slug>/`, wenn Menschen, Review-Bots oder mehrere Toolchains denselben Aufgabenstatus benötigen.
- Verwenden Sie ein Tool-lokales Verzeichnis wie `.codex/runs/<slug>/` nur, wenn der Aufgabenstatus absichtlich lokal für eine Workstation oder eine Toolchain ist.
- Verstecken Sie den Status der gemeinsamen Nutzung mehrerer Sitzungen nicht in einer privaten Scratch-Datei, wenn er später von einem anderen Mitwirkenden oder Agenten benötigt wird.

## Erforderliche Dateien

Erstellen Sie diese Dateien zu Beginn der Aufgabe mit langer Laufzeit:

- `feature-list.json`
- `progress.md`

Verwenden Sie die Vorlagen in `docs/agent-playbooks/templates/feature-list.template.json` und `docs/agent-playbooks/templates/progress.template.md`.

Bevorzugen Sie JSON für die Funktionsliste, damit Agenten eine kleine Anzahl von Feldern aktualisieren können, ohne das gesamte Dokument neu schreiben zu müssen.

## Checkliste für den Sitzungsstart

1. Führen Sie `pwd` aus.
2. Lesen Sie `progress.md`.
3. Lesen Sie `feature-list.json`.
4. Führen Sie `git log --oneline -20` aus.
5. Führen Sie `./scripts/agent-init.sh --smoke` aus.
6. Wählen Sie genau ein Element mit der höchsten Priorität aus, das noch `pending`, `in_progress` oder `blocked` ist.

Wenn der Smoke-Schritt fehlschlägt, reparieren Sie die defekte Baseline, bevor Sie einen neuen Feature-Slice implementieren.

## Sitzungsregeln

- Arbeiten Sie jeweils an einem Funktions- oder Aufgabenbereich.
- Halten Sie die Funktionsliste maschinenlesbar und stabil. Aktualisieren Sie Status, Notizen, Dateien und Überprüfungsfelder, anstatt nicht verwandte Elemente neu zu schreiben.
- Markieren Sie ein Element erst als verifiziert, nachdem Sie den in diesem Element aufgeführten Befehl oder Benutzerablauf ausgeführt haben.
- Verwenden Sie gespawnte Agenten für begrenzte Slices, nicht für den gesamten Task-Status-Eigentum.
- Wenn ein untergeordneter Agent ein Element besitzt, geben Sie ihm die genaue Element-ID, die Akzeptanzkriterien und die Dateien an, die er möglicherweise berührt.

## Checkliste zum Sitzungsende

1. Hängen Sie einen kurzen Fortschrittseintrag an `progress.md` an.
2. Aktualisieren Sie das berührte Element in `feature-list.json`.
3. Notieren Sie die genauen ausgeführten Befehle zur Überprüfung.
4. Erfassen Sie Blocker, Folgemaßnahmen und das nächstbeste Element zum Fortsetzen.

## Empfohlene Fortschrittseintragsform

Verwenden Sie eine kurze Struktur wie:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
