# Sorprese note

Questo file tiene traccia dei punti di confusione specifici di questo repository che hanno causato errori degli agenti.

## Criteri di inserimento

Aggiungi una voce solo se sono soddisfatte tutte queste condizioni:

- È specifica di questo repository (non è un consiglio generico).
- È probabile che si ripresenti per gli agenti futuri.
- Ha una mitigazione concreta e applicabile.

In caso di dubbio, chiedi allo sviluppatore prima di aggiungere una voce.

## Modello di voce

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

## Voci

### I domini di produzione delle app su Vercel possono tornare ai deployment di Git master

- **Data:** 2026-04-28
- **Osservato da:** Tommaso + Codex
- **Contesto:** verifica dei mirror delle app Seedit e 5chan nella directory delle app di Bitsocial Web.
- **Cosa ha sorpreso:** i progetti Vercel `seedit` e `5chan` avevano `gitProviderOptions.createDeployments = "enabled"`, quindi i push su `master` di GitHub venivano promossi ai domini di produzione, anche se la policy del repository prevede che i mirror di produzione delle app servano soltanto artefatti di release.
- **Impatto:** i badge di mirror verificato nella directory delle app possono diventare falsi, perché i domini di produzione servono l'ultimo commit di sviluppo invece dello ZIP di release su GitHub il cui hash di `index.html` è registrato in `about/src/lib/apps-data.ts`.
- **Mitigazione:** prima di aggiungere o aggiornare i metadati di verifica dei mirror, controlla il progetto Vercel con `vercel api /v9/projects/<project-id>` e conferma che `gitProviderOptions.createDeployments = "disabled"`. Pubblica il contenuto dello ZIP di release con `vercel deploy --prebuilt --prod` e usa `seedit-omega.vercel.app` o `5chan-omega.vercel.app` per i deployment di sviluppo.
- **Stato:** confermato

### Portless 0.11 riusa lo stato del proxy legacy se il launcher non forza HTTPS

- **Data:** 2026-04-28
- **Osservato da:** Tommaso + Codex
- **Contesto:** migrazione del normale flusso `yarn start` dal vecchio URL proxy `http://bitsocial.localhost:1355` a `https://bitsocial.localhost`.
- **Cosa ha sorpreso:** anche con `portless@0.11.1` installato, Portless riutilizzava il proxy HTTP esistente `~/.portless/proxy.port = 1355` e stampava il vecchio URL `:1355`.
- **Impatto:** aggiornare le versioni dei pacchetti e la documentazione non basta: `yarn start` può comunque annunciare e usare il vecchio URL quando un contributore ha in esecuzione uno stato Portless legacy.
- **Mitigazione:** fai in modo che gli script di avvio avviino esplicitamente il proxy HTTPS di Portless sulla porta `443` prima di registrare le route dell'app, così il flusso a runtime abbandona lo stato persistente `1355` invece di ereditarlo.
- **Stato:** confermato

### Portless cambia l'URL locale canonico dell'app

- **Data:** 2026-03-18
- **Osservato da:** Codex
- **Contesto:** verifiche nel browser e flussi di smoke test
- **Cosa ha sorpreso:** l'URL locale predefinito non è la solita porta di Vite. Il repository si aspetta `https://bitsocial.localhost` tramite Portless, quindi controllare `localhost:3000` o `localhost:5173` può colpire l'app sbagliata o non trovare nulla.
- **Impatto:** le verifiche nel browser possono fallire o validare il bersaglio sbagliato anche quando il dev server funziona correttamente.
- **Mitigazione:** usa `https://bitsocial.localhost` come prima scelta. Aggiralo con `PORTLESS=0 corepack yarn start` solo quando ti serve esplicitamente una porta Vite diretta.
- **Stato:** confermato

### Gli hook di Commitizen bloccano i commit non interattivi

- **Data:** 2026-03-18
- **Osservato da:** Codex
- **Contesto:** flussi di commit guidati dagli agenti
- **Cosa ha sorpreso:** `git commit` attiva Commitizen tramite Husky e resta in attesa di input interattivo da TTY, il che blocca le shell non interattive degli agenti.
- **Impatto:** gli agenti possono restare bloccati a tempo indeterminato durante quello che dovrebbe essere un normale commit.
- **Mitigazione:** usa `git commit --no-verify -m "message"` per i commit creati dagli agenti. Le persone possono continuare a usare `corepack yarn commit` o `corepack yarn exec cz`.
- **Stato:** confermato

### Corepack è necessario per evitare Yarn classic

- **Data:** 2026-03-19
- **Osservato da:** Codex
- **Contesto:** migrazione del package manager a Yarn 4
- **Cosa ha sorpreso:** la macchina ha ancora un'installazione globale di Yarn classic nel `PATH`, quindi eseguire `yarn` da solo può risolvere alla v1 invece che alla versione di Yarn 4 fissata dal repository.
- **Impatto:** chi sviluppa può aggirare per sbaglio il pinning del package manager del repository e ottenere un comportamento di installazione o un lockfile diversi.
- **Mitigazione:** usa `corepack yarn ...` per i comandi da shell, oppure esegui prima `corepack enable` così che `yarn` da solo risolva alla versione di Yarn 4 fissata.
- **Stato:** confermato

### I nomi fissi delle app Portless collidono tra i worktree di Bitsocial Web

- **Data:** 2026-03-30
- **Osservato da:** Codex
- **Contesto:** avvio di `yarn start` in un worktree di Bitsocial Web mentre un altro worktree stava già servendo tramite Portless
- **Cosa ha sorpreso:** usare in ogni worktree il nome app Portless letterale `bitsocial` fa collidere la route stessa, anche quando le porte sottostanti sono diverse, quindi il secondo processo fallisce perché `bitsocial.localhost` risulta già registrato.
- **Impatto:** branch paralleli di Bitsocial Web possono bloccarsi a vicenda, anche se Portless dovrebbe permettere loro di coesistere in sicurezza.
- **Mitigazione:** mantieni l'avvio di Portless dietro `scripts/start-dev.mjs`, che ora usa una route `*.bitsocial.localhost` con ambito di branch fuori dal caso canonico e ripiega su una route con ambito di branch quando il nome semplice `bitsocial.localhost` è già occupato.
- **Stato:** confermato

### L'anteprima della documentazione fissava la porta 3001 nel codice

- **Data:** 2026-03-30
- **Osservato da:** Codex
- **Contesto:** esecuzione di `yarn start` insieme ad altri repository e agenti locali
- **Cosa ha sorpreso:** il comando di sviluppo alla radice eseguiva il workspace della documentazione con `docusaurus start --port 3001`, quindi l'intera sessione di sviluppo falliva ogni volta che un altro processo occupava già la porta `3001`, anche se l'app principale usava già Portless.
- **Impatto:** `yarn start` poteva terminare il processo web subito dopo l'avvio, interrompendo lavoro locale non correlato per una collisione sulla porta della documentazione.
- **Mitigazione:** mantieni l'avvio della documentazione dietro `yarn start:docs`, che ora usa Portless insieme a `scripts/start-docs.mjs` per rispettare una porta libera iniettata dall'esterno o ripiegare sulla prima porta disponibile quando viene eseguito direttamente.
- **Stato:** confermato

### Il nome host Portless della documentazione era fissato nel codice

- **Data:** 2026-04-03
- **Osservato da:** Codex
- **Contesto:** esecuzione di `yarn start` in un worktree secondario di Bitsocial Web mentre un altro worktree stava già servendo la documentazione tramite Portless
- **Cosa ha sorpreso:** `start:docs` registrava ancora il nome host letterale `docs.bitsocial.localhost`, quindi `yarn start` poteva fallire anche se l'app about sapeva già come evitare le collisioni di route Portless per il proprio nome host.
- **Impatto:** i worktree paralleli non potevano usare in modo affidabile il comando di sviluppo alla radice, perché il processo della documentazione usciva per primo e `concurrently` terminava poi il resto della sessione.
- **Mitigazione:** mantieni l'avvio della documentazione dietro `scripts/start-docs.mjs`, che ora deriva lo stesso nome host Portless con ambito di branch dell'app about e inietta quell'URL pubblico condiviso nel target del proxy di sviluppo `/docs`.
- **Stato:** confermato

### Le shell dei worktree possono non usare la versione di Node fissata dal repository

- **Data:** 2026-04-03
- **Osservato da:** Codex
- **Contesto:** esecuzione di `yarn start` in worktree Git come `.claude/worktrees/*` o in checkout di worktree affiancati
- **Cosa ha sorpreso:** alcune shell dei worktree risolvevano `node` e `yarn node` al Node `25.2.1` di Homebrew anche se il repository fissa `22.12.0` in `.nvmrc`, quindi `yarn start` poteva eseguire silenziosamente i launcher di sviluppo sul runtime sbagliato.
- **Impatto:** il comportamento del dev server può divergere tra il checkout principale e i worktree, rendendo i bug difficili da riprodurre e violando la toolchain Node 22 attesa dal repository.
- **Mitigazione:** mantieni i launcher di sviluppo dietro `scripts/start-dev.mjs` e `scripts/start-docs.mjs`, che ora si ri-eseguono con il binario Node indicato da `.nvmrc` quando la shell corrente ha la versione sbagliata. La configurazione della shell dovrebbe comunque preferire `nvm use`.
- **Stato:** confermato

### I residui di `docs-site/` possono nascondere sorgenti della documentazione mancanti dopo il refactor

- **Data:** 2026-04-01
- **Osservato da:** Codex
- **Contesto:** pulizia del monorepo dopo il merge, a seguito dello spostamento del progetto Docusaurus da `docs-site/` a `docs/`
- **Cosa ha sorpreso:** la vecchia cartella `docs-site/` può restare sul disco con file obsoleti ma importanti come `i18n/`, anche dopo che il repository tracciato è passato a `docs/`. Questo fa sembrare il refactor duplicato in locale e può nascondere il fatto che le traduzioni della documentazione tracciate non sono state davvero spostate in `docs/`.
- **Impatto:** gli agenti possono eliminare la vecchia cartella considerandola «spazzatura» e perdere per sbaglio l'unica copia locale delle traduzioni della documentazione, oppure continuare a modificare script che puntano ancora al percorso morto `docs-site/`.
- **Mitigazione:** tratta `docs/` come l'unico progetto di documentazione canonico. Prima di eliminare qualsiasi residuo locale di `docs-site/`, ripristina i sorgenti tracciati come `docs/i18n/` e aggiorna script e hook perché smettano di riferirsi a `docs-site`.
- **Stato:** confermato

### L'anteprima multilingua della documentazione può far esplodere il consumo di RAM durante la verifica

- **Data:** 2026-04-01
- **Osservato da:** Codex
- **Contesto:** correzione dell'i18n della documentazione, del routing per lingua e del comportamento di Pagefind con `yarn start:docs` più Playwright
- **Cosa ha sorpreso:** la modalità di anteprima predefinita della documentazione esegue ora una build multilingua completa più l'indicizzazione Pagefind prima di servire i contenuti, e tenere vivo quel processo insieme a più sessioni Playwright o Chrome può consumare molta più RAM di un normale ciclo di sviluppo Vite o Docusaurus a lingua singola.
- **Impatto:** la macchina può restare a corto di memoria, le sessioni del browser possono andare in crash e le esecuzioni interrotte possono lasciare dietro di sé server della documentazione o browser headless obsoleti che continuano a consumare memoria.
- **Mitigazione:** per il lavoro sulla documentazione che non richiede la verifica delle route per lingua o di Pagefind, preferisci `DOCS_START_MODE=live yarn start:docs`. Usa l'anteprima multilingua predefinita solo quando devi validare le route tradotte o Pagefind. Tieni una sola sessione Playwright, chiudi le vecchie sessioni del browser prima di aprirne di nuove e ferma il server della documentazione dopo la verifica se non ti serve più.
- **Stato:** confermato

### `translate-docs.py` può lasciare le lingue della documentazione tradotte a metà o con target di link rotti

- **Data:** 2026-04-06
- **Osservato da:** Codex
- **Contesto:** correzione delle route e dei contenuti localizzati della documentazione dopo che `yarn start:docs` serviva pagine di dettaglio in inglese o non riusciva a produrre l'output per una lingua
- **Cosa ha sorpreso:** la pipeline di traduzione della documentazione aveva contemporaneamente due modalità di fallimento specifiche del repository: `scripts/translate-docs.py` estraeva solo un piccolo sottoinsieme dei messaggi di `DocsHome` quando le chiamate `tr(...)` usavano forme che non sapeva analizzare, e il markdown tradotto sotto `docs/i18n/**` poteva contenere slug tradotti automaticamente o artefatti `ZXQPLACEHOLDER` all'interno dei target dei link.
- **Impatto:** le homepage localizzate possono ricadere silenziosamente sull'inglese, le pagine di dettaglio localizzate possono apparire non tradotte e un `yarn docs:build` completo può fallire su link di lingua rotti anche se la documentazione sorgente è valida.
- **Mitigazione:** dopo aver cambiato le traduzioni della documentazione o rigenerato i file di lingua, esegui sempre `yarn docs:build` dalla radice del repository, cerca `ZXQPLACEHOLDER` nel markdown sotto `docs/i18n/**` e verifica che i link tradotti puntino ancora agli slug canonici della documentazione come `/apps/5chan/` invece che a percorsi URL tradotti. Se la copy di `DocsHome` è cambiata, conferma che `scripts/translate-docs.py` estragga ancora tutti i messaggi `docs.home.*`.
- **Stato:** confermato

### Le verifiche no-JS del sito about devono usare la route Portless, non un'anteprima SSR autonoma

- **Data:** 2026-04-12
- **Osservato da:** Codex
- **Contesto:** verifica del supporto no-JS per il sito `about/` da un worktree di branch
- **Cosa ha sorpreso:** un'anteprima SSR autonoma può sembrare a posto mentre la route Portless con ambito di branch sta ancora servendo la shell dell'app sbagliata o un processo più vecchio. In questo repository il contratto locale reale è il nome host Portless prodotto da `yarn start`, non un server di anteprima improvvisato.
- **Impatto:** gli agenti possono affermare erroneamente che il supporto no-JS funziona, oppure non accorgersi di regressioni che si manifestano solo su `*.bitsocial.localhost`.
- **Mitigazione:** per la verifica nel browser di `about/`, avvia sempre il vero server locale con `yarn start` o `yarn start:about` e prova per primo l'URL Portless con ambito di branch. Se un nome host Portless sembra obsoleto, ispeziona e ferma il vecchio processo prima di riprovare.
- **Stato:** confermato

### `chain/` era invisibile a `yarn build:verify` e `yarn doctor`

- **Data:** 2026-07-05
- **Osservato da:** Codex
- **Contesto:** verifica di un diff limitato a chain/ dopo l'aggiunta al monorepo del workspace `chain/` (app Vite autonoma per `chain.bitsocial.net`).
- **Cosa ha sorpreso:** `scripts/verify-build.mjs` riconosceva solo i prefissi di percorso `about/`, `docs/` e `stats/`, quindi un diff limitato a chain/ stampava "No targeted build checks matched the current diff" e non eseguiva alcuna build, anche se `build:chain` esisteva già nel `package.json` alla radice. Separatamente, `yarn doctor` era fissato su `react-doctor about -y`, quindi le modifiche React sotto `chain/src` non ricevevano alcuna copertura di React Doctor.
- **Impatto:** chi verificava modifiche a chain doveva sapere di dover chiamare direttamente `yarn build:chain` invece di fidarsi di `yarn build:verify`, e i problemi React in `chain/src` (effetti, hook, codice morto) restavano invisibili a `yarn doctor`.
- **Mitigazione:** `scripts/verify-build.mjs` ha ora un ramo `chain/` speculare a quello di `about/`, e `doctor` / `doctor:verbose` eseguono ora `react-doctor --project about,chain -y` in un'unica invocazione. `doctor:score` resta limitato ad `about` perché `--score` non stampa nulla, in silenzio, quando è combinato con `--project` per più di un progetto; usa `yarn react-doctor --project about,chain --verbose -y` (o `--json`) se ti serve un punteggio per chain.
- **Stato:** confermato

### Il P2P nel browser gira su WebSockets sicuri; pkc-js nega WebRTC e WebTransport per impostazione predefinita

- **Data:** 2026-08-02
- **Osservato da:** Claude
- **Contesto:** scrittura dei testi della landing page e della documentazione su come funziona il P2P nel browser di Bitsocial
- **Cosa ha sorpreso:** `@pkcprotocol/pkc-js` include un connection gater predefinito che rifiuta i dial WebRTC e WebTransport nel browser: `dist/browser/helia/dial-transport-filter.js` esporta `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Il commento nel suo sorgente ne spiega il motivo: nel browser quei trasporti aggiungono percorsi di instaurazione della connessione lunghi e spesso fallimentari (STUN/ICE, rotazione del certhash) che rallentano il caricamento, mentre WebSocket è diretto e affidabile. Ogni peer attivo nel pannello di stato P2P del blog mostra "Secure WebSocket". Il gater vive in `node_modules`, quindi nulla nel repository ne fa sospettare l'esistenza.
- **Impatto:** è molto facile scrivere testi pubblici tecnicamente plausibili ma falsi, per esempio attribuendo a WebTransport, arrivato alla Baseline dei browser a marzo 2026, il merito di aver reso possibile il P2P nel browser di Bitsocial. Quell'affermazione è finita nella landing page, nella tabella di confronto e in due pagine della documentazione prima che lo sviluppatore se ne accorgesse. Le affermazioni sbagliate sull'architettura nelle pagine pubbliche vengono verificate esattamente dal pubblico di sviluppatori a cui il sito si rivolge.
- **Mitigazione:** non dedurre mai quali trasporti usa Bitsocial da ciò che libp2p o la piattaforma browser supportano in linea di principio. Controlla la deny list attuale in `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js`, conferma che non esista alcun override di `connectionGater` sotto `about/src/` e leggi le etichette di trasporto reali nel pannello "P2P status" del blog prima di fare qualsiasi affermazione pubblica. Il cambiamento upstream che ha davvero sbloccato la pubblicazione dal browser è stata la correzione del seqno monotono di gossipsub in `@libp2p/gossipsub` 15.0.21 (maggio 2026); pkc-js include attualmente la 16.0.4.
- **Stato:** confermato

### I link relativi `./page.md` da una pagina di documentazione non tradotta rompono ogni build localizzata

- **Data:** 2026-08-02
- **Osservato da:** Claude
- **Contesto:** aggiunta di una nuova pagina solo in inglese, `docs/browser-p2p.md`, che rimandava a documenti esistenti con `./peer-to-peer-protocol.md` e `./apps/5chan.md`
- **Cosa ha sorpreso:** ogni lingua sotto `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` rispecchia l'albero della documentazione. Una nuova pagina assente da quei mirror viene comunque resa in ogni lingua tramite il fallback inglese, ma i suoi link markdown relativi non si risolvono più: Docusaurus emette `/ar/browser-p2p/peer-to-peer-protocol.md/` e fa fallire la build con "Docusaurus found broken links!". Il punto cruciale è che `yarn build:verify` e `yarn docs:build:verify` compilano solo `en` e passano senza problemi; solo un `yarn docs:build` completo fa emergere il problema, e si interrompe alla prima lingua in ordine alfabetico (`ar`).
- **Impatto:** una modifica alla documentazione può superare ogni controllo locale veloce e rompere comunque la build multilingua di produzione. Il fallimento sembra anche non correlato alla modifica, dato che l'errore nomina un percorso di lingua che chi ha scritto la pagina non ha mai toccato.
- **Mitigazione:** in qualsiasi pagina di documentazione non rispecchiata in `docs/i18n/**`, usa link relativi alla radice (`/peer-to-peer-protocol/`, `/apps/5chan/`) invece dei link relativi `.md`; Docusaurus vi antepone automaticamente la lingua. `docs/build-your-own-client.md` è l'esempio già presente. Esegui un `yarn docs:build` completo, non solo `build:verify`, prima di consegnare qualsiasi modifica che aggiunga o colleghi una pagina di documentazione.
- **Stato:** confermato

### Le esecuzioni concorrenti di `update-translations.js` perdono chiavi in silenzio

- **Data:** 2026-08-02
- **Osservato da:** Claude
- **Contesto:** applicazione di 26 chiavi i18next tradotte a tutte le 36 lingue tramite la skill `translate`
- **Cosa ha sorpreso:** ogni invocazione è un ciclo lettura-modifica-scrittura su tutti e 36 i file di lingua, quindi due invocazioni contemporanee si sovrascrivono a vicenda e una chiave sparisce senza alcun errore. La skill `translate` prescrive esplicitamente di avviare fino a 4 subagenti in parallelo, e ognuno di loro chiamerebbe lo script.
- **Impatto:** il problema fallisce in silenzio: le chiavi spariscono da lingue arbitrarie e il diff continua a sembrare plausibile.
- **Mitigazione:** non lasciare mai che i subagenti traduttori scrivano i file di lingua in parallelo: falli produrre soltanto file JSON di dizionario, poi applica ogni chiave in modo seriale dall'agente genitore. Dopo l'applicazione, verifica in modo programmatico che ogni chiave esista in tutte le 35 lingue non inglesi e che nessun valore sia identico byte per byte al sorgente inglese.
- **Stato:** confermato
- **Aggiornamento (2026-08-10):** in passato lo script risolveva anche la propria destinazione come `path.join(process.cwd(), "public", "translations")`, quindi il comando documentato dalla radice del repository falliva con "Translations directory not found" e andava eseguito da `about/`. Ora risolve il workspace a partire dalla directory corrente o dalla propria posizione, e funziona da qualsiasi punto. La trappola di concorrenza descritta sopra resta invariata.

### I controlli di annotazione in sviluppo possono intercettare i clic automatizzati

- **Contesto:** i siti about e chain hanno controlli fissi nell'angolo in basso a destra, dove in sviluppo compare anche la toolbar di Agentation.
- **Mitigazione:** `scripts/pw-session.sh open` registra `window.__NO_DEV_TOOLBAR__ = true` prima di ricaricare la pagina. L'inizializzatore di Agentation rispetta anche `__VISUAL_TESTING__` e `__PROFILING__`; l'ispezione del sorgente resta disponibile in modo indipendente. L'automazione diretta del browser deve impostare lo stesso flag prima di caricare l'applicazione.

### `skills add` installa le copie per Codex e Cursor nella directory `.agents/` ignorata da Git

- **Data:** 2026-08-18
- **Osservato da:** Tommaso + Claude
- **Contesto:** installazione della skill `improve-threejs` da `millionco/react-doctor` con la CLI `skills` (`vercel-labs/skills`).
- **Cosa ha sorpreso:** `npx skills add <repo> --skill <name> --agent codex` e `--agent cursor` scrivono entrambi in `.agents/skills/<name>/`, non in `.codex/skills/` o `.cursor/skills/`. `AGENTS.md` vieta una directory `.agents/` a livello di repository e `.gitignore:29` la ignora, quindi entrambe le copie restano non tracciate senza alcun avviso. Solo `--agent claude-code` scrive nella directory prevista, `.claude/skills/`. Separatamente, la forma documentata con valori separati da virgole (`--agent claude-code,codex,cursor`) fallisce con "Invalid agents" e non installa nulla, anche se ogni nome, preso da solo, è valido.
- **Impatto:** l'installazione segnala un successo mentre due delle tre copie per le toolchain finiscono in un posto che non entrerà mai in un commit, così dopo un clone pulito Codex e Cursor restano senza la skill senza che nessuno se ne accorga. La forma con le virgole può anche produrre un'installazione che non fa nulla ma sembra riuscita.
- **Mitigazione attuale:** il repository ora traccia `.agents/skills` come sorgente canonico e genera le copie per Claude con `yarn ai-workflow:sync`. Il precedente divieto su `.agents` e la relativa regola di esclusione sono stati rimossi. Non copiare le nuove skill in tre radici indipendenti; dopo aver aggiunto una skill, controlla la parità degli output generati e il catalogo dell'app.
- **Stato:** confermato
