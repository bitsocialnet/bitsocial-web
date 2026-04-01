# Format zatwierdzania i wydawania

Użyj tego, proponując lub wdrażając znaczące zmiany w kodzie.

## Zatwierdź format sugestii

- **Tytuł:** Konwencjonalny styl Commit, krótki, zawinięty w tył.
- Użyj `perf` (nie `fix`) do optymalizacji wydajności.
- **Opis:** Opcjonalne 2-3 nieformalne zdania opisujące rozwiązanie. Zwięźle, technicznie, bez wypunktowań.

Przykład:

> **Tytuł zatwierdzenia:** `fix: correct date formatting in timezone conversion`
>
> Zaktualizowano `formatDate()` w `date-utils.ts`, aby poprawnie obsługiwać przesunięcia stref czasowych.

## Format sugestii dotyczących problemów w GitHub

- **Tytuł:** Najkrótszy, jak to możliwe, owinięty tyłkami.
- **Opis:** 2-3 nieformalne zdania opisujące problem (a nie rozwiązanie), tak jakby wciąż był nierozwiązany.

Przykład:

> **Problem z GitHubem:**
>
> - **Tytuł:** `Date formatting displays incorrect timezone`
> - **Opis:** Sygnatury czasowe komentarzy pokazują nieprawidłowe strefy czasowe, gdy użytkownicy przeglądają posty z różnych regionów. Funkcja `formatDate()` nie uwzględnia ustawień lokalnej strefy czasowej użytkownika.
