# Skill e strumenti

Le skill condivise si trovano in `.agents/skills/`. Modifica questi sorgenti, poi esegui `yarn ai-workflow:sync` per generare `.claude/skills/` per Claude Code. Codex e Cursor rilevano direttamente `.agents/skills/`; non ripristinare le radici duplicate `.codex/skills/` o `.cursor/skills/`.

I prompt di ruolo condivisi si trovano in `.agents/roles/*.md`. Si tratta di un formato sorgente specifico del repository, non di un percorso nativo di rilevamento degli agenti. `scripts/ai-workflow-files.mjs` converte questi sorgenti nei file specifici per ogni app indicati sotto; `yarn ai-workflow:sync` li scrive. Includi nel commit i file generati insieme ai loro sorgenti, così un checkout pulito dispone della configurazione nativa senza dover prima eseguire un generatore. Dopo aver rimosso un sorgente, rimuovi esplicitamente i suoi output generati obsoleti; il validatore li segnala invece di eliminare file in silenzio.

## Percorsi di rilevamento nativi

Verificati rispetto alla documentazione ufficiale il 2026-09-12:

| App         | Istruzioni del progetto                                                                           | Skill usate da questo repository          | Agenti personalizzati usati da questo repository |
| ----------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| Codex       | `AGENTS.md`                                                                                       | `.agents/skills/<name>/SKILL.md`          | `.codex/agents/<name>.toml` generato             |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` resta disponibile per regole condizionali specifiche di Cursor | `.agents/skills/<name>/SKILL.md`          | `.cursor/agents/<name>.md` generato              |
| Claude Code | `CLAUDE.md` importa `@AGENTS.md`                                                                  | `.claude/skills/<name>/SKILL.md` generato | `.claude/agents/<name>.md` generato              |

Fonti: [skill di Codex](https://learn.chatgpt.com/docs/build-skills), [subagenti di Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [regole di Cursor](https://cursor.com/docs/rules), [skill di Cursor](https://cursor.com/docs/skills), [subagenti di Cursor](https://cursor.com/docs/subagents), [memoria di Claude](https://code.claude.com/docs/en/memory), [skill di Claude](https://code.claude.com/docs/en/skills), [subagenti di Claude](https://code.claude.com/docs/en/sub-agents).

Non sostituire le directory native degli agenti con `.agents/roles` e non dare per scontato che Claude rilevi `.agents/skills`. Claude può comunque leggere un file lì referenziato come normale contesto del progetto. Anche Cursor rileva `.claude/skills` per compatibilità; le copie restano sincronizzate, ma la sua guida pubblicata sulle skill non specifica la deduplicazione tra queste radici. Controlla il catalogo delle skill dell'app installata invece di promettere che non possano comparire voci duplicate.

Le directory AI usano terminazioni di riga LF tramite `.gitattributes`, così il testo generato resta identico su tutte le piattaforme. Gli asset di supporto delle skill vengono copiati byte per byte.

## Skill

| Skill                                | Scopo                                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `commit`                             | Creare commit locali autorizzati e circoscritti                                                             |
| `commit-format`, `issue-format`      | Formattare suggerimenti quando richiesto                                                                    |
| `make-closed-issue`                  | Creare una issue autorizzata, un commit circoscritto e una PR                                               |
| `review-and-merge-pr`                | Smistare il feedback sulle PR; correggere/pubblicare/fare merge solo entro l'ambito richiesto               |
| `fix-merge-conflicts`                | Risolvere i conflitti e verificare il risultato del merge                                                   |
| `release`                            | Preparare i testi della release ed eseguire i passaggi di release autorizzati                               |
| `code-quality-review`                | Revisionare diff non banali o un problema di qualità richiesto esplicitamente                               |
| `retro`                              | Trasformare errori dimostrati in controlli o indicazioni mirate che ne impediscano il ripetersi             |
| `refactor-pass`, `deslop`            | Pulizia richiesta di modifiche esistenti                                                                    |
| `debug-agent`                        | Debug basato sulle prove, con strumentazione quando serve                                                   |
| `you-might-not-need-an-effect`       | Revisione mirata di effect/memo                                                                             |
| `vercel-react-best-practices`        | Indicazioni applicabili sulle prestazioni React; salta le regole solo Next.js/server per questo client Vite |
| `translate`                          | Generare traduzioni, poi applicare le mappe tramite un unico scrittore                                      |
| `playwright-cli`, `inspect-elements` | Verifica nel browser e mappatura dal DOM al sorgente                                                        |
| `profile-browsing`                   | Profilazione circoscritta di browser e React                                                                |
| `test-apk`                           | Verificare un wrapper Android companion fornito                                                             |
| `impeccable`, `improve-threejs`      | Design di interfacce circoscritto e revisione del rendering Three.js                                        |
| `implement-plan`                     | Eseguire un piano con delega opzionale e limitata                                                           |
| `readme`                             | Mantenere documentazione di progetto verificata                                                             |
| `context7`                           | Recuperare documentazione delle librerie adatta alla versione                                               |
| `find-skills`                        | Trovare skill aggiuntive quando richiesto esplicitamente                                                    |

## Ruoli e modelli

Mantieni i ruoli personalizzati per `browser-check`, `profiler`, `test-apk`, `translator` e `reviewer`. Per la normale implementazione e l'esplorazione del codice usa il ruolo integrato worker/general-purpose o explorer dell'harness. Il genitore assegna i criteri di accettazione e le responsabilità; un solo responsabile esegue i controlli pesanti.

I file degli agenti Codex includono `name`, `description` e `developer_instructions`. `.codex/config.toml` limita a quattro i figli concorrenti tramite `max_concurrent_threads_per_session`. I metadati condivisi dei ruoli contengono il nome, la descrizione e una modalità sandbox opzionale; deliberatamente non hanno campi per il modello.

Lascia i campi del modello e del ragionamento fuori dalle skill e dagli agenti personalizzati versionati in tutte e tre le app. Questo permette le scelte al momento dell'invocazione, i default dell'utente e l'ereditarietà dal genitore secondo la precedenza documentata da ciascuna app. Gli alias di famiglia di Claude riducono la manutenzione delle versioni ma scelgono comunque una famiglia; un modello Cursor con versione esplicita richiede aggiornamenti futuri. Quando servono, tieni queste scelte nelle impostazioni dell'utente o della sessione. L'ereditarietà non promette la scelta automatica del miglior modello attuale. Non inventare un alias `latest` e non aggiungere ricerche nel catalogo dei modelli alle attività di routine. Vedi [selezione in Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [selezione in Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) e [selezione in Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` corrisponde alla sandbox di Codex e a `readonly` di Cursor; l'elenco degli strumenti di Claude e le istruzioni del ruolo limitano il suo flusso di revisione, ma l'accesso a Bash non è una sandbox a livello di sistema operativo.

Il frontmatter condiviso delle skill usa `disable-model-invocation: true` per i flussi di lavoro invocati dall'utente, dove applicabile. L'impostazione corrispondente di Codex si trova in `agents/openai.yaml` come `policy.allow_implicit_invocation: false`; il validatore le richiede entrambe. I metadati di invocazione integrano le regole di autorizzazione esplicita; una richiesta di revisione non autorizza mai una pubblicazione solo perché una skill include passaggi di pubblicazione.

## Controlli e rilevamento

- `yarn ai-workflow:sync` rigenera gli output di compatibilità usando `js-yaml` e `smol-toml` installati.
- `yarn ai-workflow:check` analizza sorgenti/frontmatter/configurazioni e controlla gli output generati, i metadati di invocazione, la posizione dei campi del modello e il collegamento dell'hook di sola formattazione. Non risolve gli identificatori dei modelli rispetto al catalogo di un provider.
- `yarn ai-workflow:test` esegue fixture Node isolate per i payload degli hook e per la generazione/validazione del flusso di lavoro.
- Dopo aver aggiornato un'applicazione per agenti, verifica in quell'applicazione il rilevamento di skill/ruoli. I controlli di sintassi/parità non sostituiscono una verifica del loader. Ricarica l'applicazione se una sessione esistente conserva un catalogo vecchio.
- Gli hook richiedono la fiducia nel progetto e la revisione degli hook da parte dell'harness; non aggirare la fiducia per far passare un controllo. Vedi [hooks-setup.md](hooks-setup.md).

## Mantenere istruzioni utili

Segui le [indicazioni di OpenAI su skill e prompt](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (riviste il 2026-09-12): mantieni le descrizioni precise, carica i dettagli solo quando sono pertinenti e preserva l'ambito richiesto dall'utente. Le skill condivise servono modelli diversi; conserva le invarianti specifiche del progetto lasciando libere le scelte di implementazione ordinarie.

Tieni in `SKILL.md` lo scopo di una skill, i suoi confini decisionali e i vincoli essenziali. Collega come riferimenti opzionali i comandi o gli esempi corposi specifici di una modalità. Metti le condizioni di attivazione all'inizio di descrizioni brevi; una parola chiave corrispondente, da sola, non dovrebbe ampliare l'attività. Preserva i metadati di invocazione esistenti, a meno che non se ne stia cambiando intenzionalmente il comportamento.

Dopo una modifica sostanziale alle istruzioni, metti alla prova alcune richieste rappresentative, piccole e grandi. Controlla quali skill/riferimenti sono stati selezionati, se le azioni sono rimaste nell'ambito, se la verifica era adeguata alla modifica e se il lavoro autorizzato è stato completato. I test di schema e le fixture stabiliscono la correttezza degli strumenti, non la qualità delle decisioni dell'agente.

## Strumenti e responsabilità del browser

Preferisci il catalogo esistente di skill/strumenti e le CLI di progetto installate. Usa `gh` per GitHub, `playwright-cli` per la verifica nel browser e la documentazione ufficiale o specifica della versione quando conta il comportamento di una libreria. Evita di installare skill duplicate o di scaricare un pacchetto senza versione fissata solo per eseguire un formatter già esistente.

Il sovraccarico degli MCP dipende dall'harness: il caricamento differito degli strumenti può evitare di caricare subito ogni schema. Mantieni pertinenti le integrazioni invece di considerare obsoleto MCP in sé. Le scelte esistenti basate su CLI restano utili per la riproducibilità e il controllo delle risorse.

Tutte le sessioni del browser usano `./scripts/pw-session.sh`, che impone un solo browser attivo su tutta la macchina. Per impostazione predefinita usa una sessione nuova e isolata. L'accesso al browser personale in uso richiede un'autorizzazione esplicita; riusa quell'autorizzazione nei passaggi successivi. Scegli browser/viewport in base al comportamento interessato, esegui i motori selezionati in sequenza, durante la pulizia chiudi esattamente la sessione con il nome usato e non usare mai `close-all`/`kill-all`. Vedi la skill `playwright-cli` e [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
