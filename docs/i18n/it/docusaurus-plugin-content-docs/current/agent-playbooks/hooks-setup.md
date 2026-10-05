# Hook degli agenti

Gli hook del ciclo di vita versionati si limitano a formattare, tramite l'oxfmt installato, i file JavaScript/TypeScript modificati con successo. La logica condivisa si trova in `scripts/agent-hooks/format.mjs`; ogni wrapper nativo delega a essa.

| App | Configurazione nativa | Evento |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude non legge un file `.claude/hooks.json` autonomo. Ogni app continua a controllare la fiducia nel progetto e l'abilitazione degli hook; ispezionane le impostazioni correnti invece di aggirare il meccanismo di fiducia. `.codex/config.toml` è configurazione del repository, non un registro di comandi per gli hook.

Il formatter convalida evento/payload, l'esito positivo della modifica, l'estensione del file e l'appartenenza al repository, symlink compresi. Con dipendenze mancanti o input non pertinente non viene eseguito nulla. I comandi usano un array di argomenti con l'accesso di rete di Corepack disabilitato; gli hook non installano dipendenze, non eseguono build/revisioni e non modificano Git.

Esegui i controlli in modo esplicito secondo [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Dopo aver modificato il flusso di lavoro, esegui `yarn ai-workflow:sync`, `yarn ai-workflow:check` e `yarn ai-workflow:test`. Le fixture usano file usa e getta e invocazioni fittizie del formatter; non dimostrano che ogni app abbia caricato la propria configurazione. Dopo gli aggiornamenti, ricarica l'app e ispezionane il catalogo.

La skill di design Impeccable e i suoi helper eseguibili restano disponibili su richiesta in `.agents/skills/impeccable`. Il suo vecchio hook per Codex puntava a una directory inesistente; ora il flusso di design viene eseguito quando la sua skill viene selezionata, senza alcun hook di design sempre attivo. La skill non deve riconfigurare gli hook del progetto come passaggio accessorio del lavoro di design.
