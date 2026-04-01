# Flusso di lavoro dell'agente a esecuzione prolungata

Utilizza questo playbook quando è probabile che un'attività si estenda su più sessioni, passaggi o agenti generati.

## Obiettivi

- Fornire a ogni nuova sessione un modo rapido per recuperare il contesto
- Mantieni il lavoro incrementale anziché apportare una modifica di grandi dimensioni in un'unica soluzione
- Rileva una linea di base locale non funzionante prima di aggiungere altro codice
- Lascia durevole artefatti di cui la sessione successiva può fidarsi

## Dove mantenere lo stato

- Utilizza `docs/agent-runs/<slug>/` quando umani, robot di revisione o più toolchain necessitano dello stesso stato dell'attività.
- Utilizza una directory locale dello strumento come `.codex/runs/<slug>/` solo quando lo stato dell'attività è intenzionalmente locale su una workstation o una toolchain.
- Non nascondere la condivisione multisessione stato in un file temporaneo privato se un altro collaboratore o agente ne avrà bisogno in seguito.

## File richiesti

Crea questi file all'inizio dell'attività a lunga esecuzione:

- `feature-list.json`
- `progress.md`

Utilizza i modelli in `docs/agent-playbooks/templates/feature-list.template.json` e `docs/agent-playbooks/templates/progress.template.md`.

Preferisci JSON per il elenco delle funzionalità in modo che gli agenti possano aggiornare un numero limitato di campi senza riscrivere l'intero documento.

## Elenco di controllo per l'avvio della sessione

1. Esegui `pwd`.
2. Leggi `progress.md`.
3. Leggi `feature-list.json`.
4. Esegui `git log --oneline -20`.
5. Esegui `./scripts/agent-init.sh --smoke`.
6. Scegli esattamente un elemento con la priorità più alta che sia ancora `pending`, `in_progress` o `blocked`.

Se la fase fumogena fallisce, correggi la linea di base interrotta prima di implementare una nuova sezione di funzionalità.

## Regole di sessione

- Lavora su una funzionalità o porzione di attività alla volta.
- Mantieni l'elenco delle funzionalità stabile e leggibile dalla macchina. Aggiorna stato, note, file e campi di verifica invece di riscrivere elementi non correlati.
- Contrassegna un elemento verificato solo dopo aver eseguito il comando o il flusso utente elencato in quell'elemento.
- Utilizza agenti generati per sezioni delimitate, non per la proprietà complessiva dello stato delle attività.
- Quando un agente figlio possiede un elemento, forniscigli l'ID elemento esatto, i criteri di accettazione e i file che può toccare.

## Fine sessione Elenco di controllo

1. Aggiungi una breve voce di avanzamento a `progress.md`.
2. Aggiorna l'elemento toccato in `feature-list.json`.
3. Registra i comandi esatti eseguiti per la verifica.
4. Cattura elementi bloccanti, follow-up e l'elemento migliore successivo da riprendere.

## Voce di avanzamento consigliata Forma

Utilizza una struttura breve come:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
