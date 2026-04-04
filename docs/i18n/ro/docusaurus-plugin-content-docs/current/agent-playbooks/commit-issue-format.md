# Format pentru commit și issue

Folosiți asta când propuneți sau implementați modificări semnificative ale codului.

## Format sugestie commit

- **Titlu:** Stil Conventional Commits, scurt, înfășurat în backticks.
- Folosiți `perf` (nu `fix`) pentru optimizări de performanță.
- **Descriere:** 2-3 propoziții informale opționale care descriu soluția. Concis, tehnic, fără puncte marcatoare.

Exemplu:

> **Titlu commit:** `fix: correct date formatting in timezone conversion`
>
> `formatDate()` actualizat în `date-utils.ts` pentru a gestiona corect decalările de fus orar.

## Format sugestie issue GitHub

- **Titlu:** Cât mai scurt posibil, înfășurat în backticks.
- **Descriere:** 2-3 propoziții informale care descriu problema (nu soluția), ca și cum ar fi încă nerezolvată.

Exemplu:

> **Issue GitHub:**
>
> - **Titlu:** `Date formatting displays incorrect timezone`
> - **Descriere:** Marcajele de timp ale comentariilor afișează fusuri orare incorecte atunci când utilizatorii vizualizează postări din regiuni diferite. Funcția `formatDate()` nu ține cont de setările de fus orar locale ale utilizatorului.
