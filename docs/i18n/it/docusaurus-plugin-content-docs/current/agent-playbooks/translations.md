# Traduzioni

Il sito about usa JSON i18next in `about/public/translations/{lang}/default.json`. Le traduzioni delle pagine sorgente di Docusaurus si trovano a parte, in `docs/i18n/`.

## Chiavi del sito about

Usa `.agents/skills/translate/SKILL.md`. Ricava dal disco le lingue attuali e preserva segnaposto, markup, termini tecnici e nomi di marchi. Per richieste più ampie, gli agenti figli possono generare mappe indipendenti, ma un unico agente genitore applica in modo seriale ogni scrittura sulle lingue; lo script di aggiornamento non prevede un lock di scrittura.

Usa un percorso di mappa univoco e riservato all'attività. Fai un'anteprima con `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, poi applica con gli stessi argomenti e `--write`. Dopo la scrittura verifica copertura/valori e rimuovi solo le mappe temporanee create da questa attività.

Usa `--delete` per le rimozioni richieste. Ispeziona i risultati di `--audit --dry` prima di un `--audit --write` autorizzato; le chiavi di traduzione dinamiche richiedono una revisione manuale del sorgente. Copia il testo inglese in ogni lingua solo per un termine tecnico, un marchio o un segnaposto.

## Pagine Docusaurus

`scripts/translate-docs.py` è uno strumento di scrittura in blocco per tutte le pagine/lingue e non ha un filtro per singolo file; non usarlo per una modifica di traduzione circoscritta. `scripts/check-docs-translations.py` è il verificatore in sola lettura e supporta `--locales` e `--paths`.

Mantieni blocchi di codice, link, codice inline, indirizzi di contratto, intestazioni, tabelle e admonition allineati al sorgente inglese. Risolvi gli errori del verificatore; gli avvisi `frontmatter-untranslated` sui nomi di marchi possono essere attesi. Segui `docs/AGENTS.md` ed esegui la build dalla radice quando modifichi il tema della documentazione o il comportamento i18n, così l'output statico e Pagefind restano allineati.

## Revisione semantica facoltativa

Per chiavi i18next selezionate, usa `scripts/jev/translation-README.md`. Per le pagine di documentazione, esegui prima `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Il comando richiede una selezione esplicita di lingue/pagine, esegue il verificatore strutturale e riporta la revisione semantica come non verificata finché l'inferenza live non è abilitata. Aggiungi `--live` solo con l'autorizzazione al provider e il budget previsti dall'attività; la configurazione privata condivisa della macchina fornisce le credenziali e un modello fissato. Le variabili d'ambiente e `--model` possono sovrascrivere questa configurazione. Il comando non modifica mai le traduzioni.

L'adattatore per le pagine preserva il contesto dell'intera pagina e limita ogni pagina a 24 KB e ogni esecuzione a 30 coppie. Per pagine più grandi, prepara coppie di paragrafi sorgente/traduzione allineate esplicitamente per `translations.mjs --pairs`; non accoppiare automaticamente i paragrafi in base all'indice. I risultati semantici sono consultivi: ispeziona i problemi segnalati e l'incertezza, e mantieni i controlli deterministici su codice/link/indirizzi.
