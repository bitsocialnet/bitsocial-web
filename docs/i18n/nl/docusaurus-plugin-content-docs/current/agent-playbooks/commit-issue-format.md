# Commit- en issue-indeling

Gebruik dit bij het voorstellen of implementeren van betekenisvolle codewijzigingen.

## Commit-suggestie-indeling

- **Titel:** Conventionele Commit-stijl, kort, verpakt in backticks.
- Gebruik `perf` (niet `fix`) voor prestaties optimalisaties.
- **Beschrijving:** Optioneel 2-3 informele zinnen die de oplossing beschrijven. Beknopt, technisch, geen opsommingen.

Voorbeeld:

> **Commit titel:** `fix: correct date formatting in timezone conversion`
>
> `formatDate()` bijgewerkt in `date-utils.ts` om tijdzone-offsets correct af te handelen.

## GitHub probleemsuggestie Formaat

- **Titel:** Zo kort mogelijk, verpakt in backticks.
- **Beschrijving:** 2-3 informele zinnen die het probleem beschrijven (niet de oplossing), alsof het nog steeds niet is opgelost.

Voorbeeld:

> **GitHub-probleem:**
>
> - **Titel:** `Date formatting displays incorrect timezone`
> - **Beschrijving:** Commentaar tijdstempels tonen onjuiste tijdzones wanneer gebruikers berichten uit verschillende regio's bekijken. De functie `formatDate()` houdt geen rekening met de lokale tijdzone-instellingen van de gebruiker.
