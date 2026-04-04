# Formato commit ed emissione

Utilizzalo quando proponi o implementi modifiche significative al codice.

## Formato suggerimento commit

- **Titolo:** Stile commit convenzionale, breve, racchiuso tra apici inversi.
- Utilizza `perf` (non `fix`) per l'ottimizzazione delle prestazioni.
- **Descrizione:** Facoltativo 2-3 frasi informali che descrivono la soluzione. Conciso, tecnico, senza elenchi puntati.

Esempio:

> **Titolo vincolato:** `fix: correct date formatting in timezone conversion`
>
> Aggiornato `formatDate()` in `date-utils.ts` per gestire correttamente le differenze di fuso orario.

## Formato suggerimento problemi GitHub

- **Titolo:** Breve quanto possibile, racchiusi tra apici inversi.
- **Descrizione:** 2-3 frasi informali che descrivono il problema (non la soluzione), come se fosse ancora irrisolto.

Esempio:

> **Problema di GitHub:**
>
> - **Titolo:** `Date formatting displays incorrect timezone`
> - **Descrizione:** I timestamp dei commenti mostrano fusi orari errati quando gli utenti visualizzano post da diverse regioni. La funzione `formatDate()` non tiene conto delle impostazioni del fuso orario locale dell'utente.
