# Formát závazku a vydání

Použijte to při navrhování nebo implementaci smysluplných změn kódu.

## Potvrdit formát návrhu

- **Název:** Styl konvenčních závazků, krátký, zabalený do backticks.
- Pro optimalizaci výkonu použijte `perf` (nikoli `fix`).
- **Popis:** Volitelné 2–3 neformální věty popisující řešení. Stručné, technické, žádné odrážky.

Příklad:

> **Název závazku:** `fix: correct date formatting in timezone conversion`
>
> Aktualizováno `formatDate()` v `date-utils.ts`, aby správně zpracovávalo posuny časových pásem.

## Formát návrhu na vydání GitHubu

- **Nadpis:** Co nejkratší, zabalený do backticks.
- **Popis:** 2–3 neformální věty popisující problém (nikoli řešení), jako by stále nebyly vyřešeny.

Příklad:

> **Problém GitHubu:**
>
> - **Název:** `Date formatting displays incorrect timezone`
> - **Popis:** Časová razítka komentářů zobrazují nesprávná časová pásma, když si uživatelé prohlížejí příspěvky z různých oblastí. Funkce `formatDate()` nebere v úvahu nastavení místního časového pásma uživatele.
