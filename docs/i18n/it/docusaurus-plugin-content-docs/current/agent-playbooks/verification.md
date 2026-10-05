# Verifica

Scegli i controlli in base al comportamento modificato e all'incertezza residua. Riusa le prove positive già ottenute per lo stesso stato finale; ripeti i controlli dopo modifiche pertinenti o fallimenti. I requisiti espliciti di CI, release o utente restano comunque validi.

| Modifica                                                       | Controlli appropriati                                                                                                             |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Solo prosa/commenti/formattazione                              | Diff, riferimenti, generatori pertinenti; nessuna build dell'app                                                                  |
| Sorgenti/configurazione del flusso di lavoro AI                | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; rigenera gli indici LLM quando il contesto è cambiato |
| Helper o script isolato                                        | Invocazione/fixture mirate e controlli di sintassi o di tipi/lint per il codice interessato                                       |
| Modifica a runtime condiviso, dipendenze, build o integrazioni | Controlli mirati sulle parti interessate più i controlli di build/tipi/lint pertinenti indicati sotto                             |
| Solo CSS/tema/layout                                           | Route/viewport/temi interessati nei browser selezionati; build quando sono cambiati import, asset o l'elaborazione CSS            |
| Stato/effetti/prestazioni React                                | Comportamento interessato e indicazioni React applicabili; Doctor quando la diagnostica chiarisce un problema concreto            |

## Controlli del progetto

- `yarn build:verify` seleziona il workspace interessato. Per un ambito noto usa `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` o `yarn docs:build:verify`.
- `yarn build` esegue intenzionalmente la build di produzione completa di about/docs, incluse tutte le lingue della documentazione. Usalo per una validazione dell'intera release o per modifiche che giustificano quell'ambito.
- `yarn lint`, `yarn typecheck` e `yarn format:check` coprono i gate esistenti del repository; per una modifica circoscritta a uno script usa prima i suoi controlli mirati di sintassi/fixture/formattazione.
- Le modifiche al manifest o al lockfile richiedono `corepack yarn install`, `yarn deps:check-pinned` e `yarn deps:check-hardened`. `yarn knip` è consultivo per dipendenze/import.
- I controlli delle traduzioni della documentazione sono in [translations.md](translations.md); non eseguire lo strumento di scrittura in blocco delle traduzioni per una modifica mirata alla documentazione.

## Prove nel browser e responsabilità

Usa Chrome per piccole modifiche isolate nel browser. Aggiungi Firefox e WebKit per CSS/layout/responsività condivisi, API sensibili al browser, interazioni ampie, release o criteri cross-browser espliciti. Includi i layout mobile e il comportamento touch interessati. Un semplice ridimensionamento del viewport non equivale all'emulazione touch. Scegli route e contenuti reali partendo dal sorgente invece di dare per scontato che gli esempi siano disponibili.

Usa `playwright-cli` tramite `./scripts/pw-session.sh`. Su tutta la macchina è attivo un solo browser alla volta; i motori selezionati vengono eseguiti in sequenza e ogni sessione esatta di cui sei responsabile viene chiusa anche dopo un fallimento. Riusa una sessione autorizzata di proprietà del chiamante senza chiuderla. Non usare mai una pulizia globale dei browser e non fermare un server di cui non è chiaro il responsabile. Per il lavoro che riguarda solo la documentazione non servono browser né server.

Per il lavoro sulle prestazioni, confronta lo stesso flusso con viewport, contenuti, impostazioni di rete/CPU, modalità di build e overhead di misurazione equivalenti. Distingui le osservazioni dalle cause sospette. Usa la skill di profilazione quando queste misurazioni rispondono alla richiesta effettiva.

## Prove finali

Un solo agente è responsabile della verifica pesante. Ispeziona i carichi di lavoro attivi e serializza installazioni, build/suite complete, Doctor, lavoro su Android/Electron e profilazione nel browser. Riporta comandi/esiti e limitazioni specifiche; dati mancanti o un motore saltato non sono un risultato positivo. Le fixture degli strumenti verificano formati e meccanismi, non il rilevamento end-to-end da parte delle app né la qualità delle decisioni del modello.

## Controlli React automatici

`yarn agent:verify` esegue le build selezionate seguite da `yarn doctor:check` e `yarn perf:check`. `perf:check` include il selftest di compatibilità del collector e di regressione intenzionale, quindi né la CI né il percorso di verifica degli agenti hanno bisogno di un passaggio `perf:test` separato. Installa una sola volta gli strumenti browser con versione fissata tramite `yarn perf:install` (`--with-deps` nella CI Linux). Usa i filtri per target/scenario per riesecuzioni mirate dopo il passaggio completo pertinente. I budget degli scenari sono espliciti in `scripts/react-perf/config.mjs`; conserva le prove e correggi una regressione prima di prendere in considerazione una modifica giustificata della baseline. Le normali build di produzione omettono Bippy; i comandi separati `build:profile:*` forniscono la strumentazione ufficiale di profilazione di React.

Lo scenario about `apps-search` procede al ritmo dei valori di URL/input applicati per ogni carattere. Il suo esito positivo copre quella sequenza di query applicate, non la reattività alla digitazione rapida. Usa una riproduzione separata con input veloce quando valuti la perdita di caratteri o la reattività dell'input.
