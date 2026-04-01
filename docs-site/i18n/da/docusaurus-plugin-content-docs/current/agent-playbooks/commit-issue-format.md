# Forpligtelse og udstedelsesformat

Brug dette, når du foreslår eller implementerer meningsfulde kodeændringer.

## Forpligte forslagsformat

- **Titel:** Konventionel Commit-stil, kort, pakket ind i baglæns.
- Brug `perf` (ikke `fix`) til ydeevneoptimeringer.
- **Beskrivelse:** Valgfri 2-3 uformelle sætninger, der beskriver løsningen. Kortfattet, teknisk, ingen punkttegn.

Eksempel:

> **Commit titel:** `fix: correct date formatting in timezone conversion`
>
> Opdateret `formatDate()` i `date-utils.ts` for korrekt at håndtere tidszoneforskydninger.

## GitHub-problemforslagsformat

- **Titel:** Så kort som muligt, pakket ind i backticks.
- **Beskrivelse:** 2-3 uformelle sætninger, der beskriver problemet (ikke løsningen), som om det stadig er uløst.

Eksempel:

> **GitHub problem:**
>
> - **Titel:** `Date formatting displays incorrect timezone`
> - **Beskrivelse:** Kommentartidsstempler viser forkerte tidszoner, når brugere ser indlæg fra forskellige regioner. `formatDate()`-funktionen tager ikke højde for brugerens lokale tidszoneindstillinger.
