# Forplikte og utstede format

Bruk dette når du foreslår eller implementerer meningsfulle kodeendringer.

## Forplikte forslagsformat

- **Tittel:** Konvensjonell Commit-stil, kort, pakket inn i baklengs.
- Bruk `perf` (ikke `fix`) for ytelsesoptimalisering.
- **Beskrivelse:** Valgfrie 2-3 uformelle setninger som beskriver løsningen. Konsis, teknisk, ingen punkt.

Eksempel:

> **Forpliktelsestittel:** `fix: correct date formatting in timezone conversion`
>
> Oppdaterte `formatDate()` i `date-utils.ts` for å håndtere tidssoneforskyvninger på riktig måte.

## GitHub-problemforslagsformat

- **Tittel:** Så kort som mulig, pakket inn i backticks.
- **Beskrivelse:** 2-3 uformelle setninger som beskriver problemet (ikke løsningen), som om det fortsatt er uløst.

Eksempel:

> **GitHub-problem:**
>
> - **Tittel:** `Date formatting displays incorrect timezone`
> - **Beskrivelse:** Tidsstempler for kommentarer viser feil tidssoner når brukere ser innlegg fra forskjellige regioner. `formatDate()`-funksjonen tar ikke hensyn til brukerens lokale tidssoneinnstillinger.
