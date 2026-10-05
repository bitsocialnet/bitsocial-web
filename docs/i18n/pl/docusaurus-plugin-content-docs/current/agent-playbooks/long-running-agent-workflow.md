# Długotrwała praca agenta

Używaj trwałego stanu zadania, gdy praca wymaga wznowienia lub przekazania albo gdy pojedynczy przebieg jest na tyle długi, że kompaktowanie kontekstu mogłoby zgubić informacje o pozostałej pracy. Małe zadania nie potrzebują tablicy ani pliku postępu. Przy pracy współdzielonej prowadź zwięzłe `feature-list.json` i `progress.md` w katalogu `docs/agent-runs/<slug>/` właściwym dla zadania, korzystając w razie potrzeby z istniejących szablonów.

Zapisuj oczekiwany rezultat, bieżącą gałąź/worktree, własność plików, ukończone zmiany, kontrole wraz z wynikami, posiadane procesy/sesje oraz następny nierozwiązany krok. Nie przechowuj danych uwierzytelniających ani dowolnych zrzutów kodu źródłowego. Oznaczaj funkcję jako ukończoną dopiero wtedy, gdy jej kryteria akceptacji zostały zweryfikowane.

Po wznowieniu sprawdź stan Gita, najnowszy postęp i odpowiedni kod źródłowy, zanim zaczniesz edytować. Wykorzystuj ponownie zgodne zasoby, które posiadasz; uruchamiaj serwer deweloperski tylko wtedy, gdy potrzebuje go następna kontrola. Dobieraj kontrole według wpływu, korzystając z [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), zamiast powtarzać niezmieniony pełny przebieg.

Utrzymuj powiązaną delegowaną pracę w wyraźnych granicach i bez nakładania się. Jeden agent odpowiada za ciężkie kontrole i sesje przeglądarki. Aktualizuj trwały stan, gdy ukończony fragment, blokada lub przekazanie zmienia to, co musi wiedzieć następna osoba; nie loguj mechanicznie każdego polecenia.
