# Sorprese note

Questo file tiene traccia dei punti di confusione specifici del repository che hanno causato errori dell'agente.

## Criteri di voce

Aggiungi una voce solo se sono tutte vere:

- È specifico per questo repository (non un consiglio generico).
- È probabile che si ripresenti per gli agenti futuri.
- Ha una mitigazione concreta che può essere seguita.

In caso di dubbi, chiedere al sviluppatore prima di aggiungere una voce.

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

### Portless modifica l'URL canonico dell'app locale

- **Data:** 18-03-2026
- **Osservato da:** Codex
- **Contesto:** Verifica del browser e flussi di fumo
- **Ciò che è stato sorprendente:** L'URL locale predefinito non è il solito porto di Vite. Il repository prevede `http://bitsocial.localhost:1355` tramite Portless, quindi il controllo di `localhost:3000` o `localhost:5173` può colpire l'app sbagliata o niente.
- **Impatto:** i controlli del browser possono fallire o convalidare la destinazione sbagliata anche quando il server di sviluppo è integro.
- **Mitigazione:** utilizzare prima `http://bitsocial.localhost:1355`. Evitalo solo con `PORTLESS=0 corepack yarn start` quando hai esplicitamente bisogno di una porta Vite diretta.
- **Stato:** confermato

### Gli hook committizen bloccano i commit non interattivi

- **Data:** 18-03-2026
- **Osservato da:** Codex
- **Contesto:** flussi di lavoro di commit gestiti da agenti
- **Ciò che è stato sorprendente:** `git commit` attiva Commitizen tramite Husky e attende il TTY interattivo input, che blocca le shell degli agenti non interattivi.
- **Impatto:** gli agenti possono bloccarsi indefinitamente durante quello che dovrebbe essere un commit normale.
- **Mitigazione:** utilizzare `git commit --no-verify -m "message"` per i commit creati dagli agenti. Gli esseri umani possono ancora utilizzare `corepack yarn commit` o `corepack yarn exec cz`.
- **Stato:** confermato

### È necessario Corepack per evitare Yarn classic

- **Data:** 2026-03-19
- **Osservato da:** Codex
- **Contesto:** Migrazione del gestore pacchetti a Yarn 4
- **Ciò che è stato sorprendente:** La macchina ha ancora un'installazione globale di Yarn classic su `PATH`, quindi l'esecuzione semplice di `yarn` può risolvere la versione v1 anziché la versione Yarn 4 bloccata.
- **Impatto:** Gli sviluppatori possono ignorare accidentalmente il blocco del gestore pacchetti del repository e ottenere un comportamento di installazione o un output del file di lock diverso.
- **Mitigazione:** Usa `corepack yarn ...` per i comandi della shell o esegui `corepack enable` prima così semplice `yarn` si risolve nella versione Yarn 4 bloccata.
- **Stato:** confermato

### Risolti i nomi delle app Portless che si scontrano tra gli alberi di lavoro Bitsocial Web

- **Data:** 2026-03-30
- **Osservato da:** Codex
- **Contesto:** Avvio di `yarn start` in un albero di lavoro Bitsocial Web mentre un altro albero di lavoro era già utilizzato tramite Portless
- **Ciò che è stato sorprendente:** L'uso letterale del nome dell'app Portless `bitsocial` in ogni albero di lavoro fa sì che il percorso stesso entri in collisione, anche quando le porte di supporto sono diverse, quindi il secondo processo fallisce perché `bitsocial.localhost` è già registrato.
- **Impatto:** I rami Web Bitsocial paralleli possono bloccarsi a vicenda anche se Portless è pensato per lasciarli coesistere in modo sicuro.
- **Mitigazione:** Mantieni l'avvio Portless dietro `scripts/start-dev.mjs`, che ora utilizza una route `*.bitsocial.localhost:1355` con ambito ramo al di fuori del caso canonico e ritorna a una route con ambito ramo quando il nome `bitsocial.localhost` nudo è già occupato.
- **Stato:** confermato

### Anteprima dei documenti utilizzata per codificare la porta 3001

- **Data:** 2026-03-30
- **Osservato da:** Codex
- **Contesto:** in esecuzione `yarn start` insieme ad altri repository e agenti locali
- **Ciò che è stato sorprendente:** Il comando root dev eseguiva l'area di lavoro docs con `docusaurus start --port 3001`, quindi l'intera sessione di sviluppo falliva ogni volta che un altro processo possedeva già `3001`, anche se l'app principale era già utilizzata Senza porta.
- **Impatto:** `yarn start` potrebbe uccidere il processo web immediatamente dopo l'avvio, interrompendo il lavoro locale non correlato a causa di una collisione della porta documenti.
- **Mitigazione:** Mantieni l'avvio dei documenti dietro `yarn start:docs`, che ora utilizza Portless plus `scripts/start-docs.mjs` per onorare una porta libera inserita o ricorrere alla successiva porta disponibile quando viene eseguito direttamente.
- **Stato:** confermato
