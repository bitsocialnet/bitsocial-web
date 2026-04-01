# Commit and Issue Format

Använd detta när du föreslår eller implementerar meningsfulla kodändringar.

## Bekräfta förslagsformat

- **Titel:** Konventionell Commit-stil, kort, insvept i backticks.
- Använd `perf` (inte `fix`) för prestandaoptimeringar.
- **Beskrivning:** Valfria 2-3 informella meningar som beskriver lösningen. Kortfattad, teknisk, inga kulpunkter.

Exempel:

> **Bekräftelsetitel:** `fix: correct date formatting in timezone conversion`
>
> Uppdaterade `formatDate()` i `date-utils.ts` för att korrekt hantera tidszonförskjutningar.

## GitHub-problemförslagsformat

- **Titel:** Så kort som möjligt, insvept i backticks.
- **Beskrivning:** 2-3 informella meningar som beskriver problemet (inte lösningen), som om det fortfarande var olöst.

Exempel:

> **GitHub-problem:**
>
> - **Titel:** `Date formatting displays incorrect timezone`
> - **Beskrivning:** Kommentartidsstämplar visar felaktiga tidszoner när användare ser inlägg från olika regioner. `formatDate()`-funktionen tar inte hänsyn till användarens lokala tidszoninställningar.
