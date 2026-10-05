# Weryfikacja

Dobieraj kontrole na podstawie zmienionego zachowania i pozostałej niepewności. Wykorzystuj ponownie udane dowody dla tego samego stanu końcowego; uruchamiaj kontrole ponownie po istotnych edycjach lub niepowodzeniach. Jawne wymagania CI, wydania lub użytkownika nadal obowiązują.

| Zmiana                                                                                   | Odpowiednie kontrole                                                                                                                 |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Tylko proza/komentarze/formatowanie                                                      | Diff, odwołania, odpowiednie generatory; bez budowania aplikacji                                                                     |
| Źródła/konfiguracja przepływu pracy AI                                                   | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; wygeneruj ponownie indeksy LLM, gdy zmienił się kontekst |
| Odizolowany helper lub skrypt                                                            | Ukierunkowane wywołanie/fixtures oraz kontrole składni albo typów/lintera dla dotkniętego kodu                                       |
| Zmiana współdzielonego środowiska uruchomieniowego, zależności, budowania lub integracji | Ukierunkowane kontrole dotkniętych obszarów plus odpowiednie kontrole budowania/typów/lintera opisane niżej                          |
| Tylko CSS/motyw/układ                                                                    | Dotknięte trasy/viewporty/motywy w wybranych przeglądarkach; budowanie, gdy zmieniły się importy, zasoby lub przetwarzanie CSS       |
| Stan/efekty/wydajność React                                                              | Dotknięte zachowanie i odpowiednie wytyczne React; Doctor, gdy diagnostyka rozstrzyga konkretny problem                              |

## Kontrole projektu

- `yarn build:verify` wybiera dotknięty workspace. Dla znanego zakresu użyj `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` lub `yarn docs:build:verify`.
- `yarn build` celowo uruchamia pełne produkcyjne budowanie about/docs, łącznie ze wszystkimi lokalizacjami dokumentacji. Używaj go do walidacji całego wydania lub przy zmianach, które uzasadniają taki zakres.
- `yarn lint`, `yarn typecheck` i `yarn format:check` obejmują istniejące bramki repozytorium; przy wąskiej zmianie skryptu najpierw użyj jego ukierunkowanych kontroli składni/fixtures/formatowania.
- Zmiany manifestu/pliku blokady wymagają `corepack yarn install`, `yarn deps:check-pinned` i `yarn deps:check-hardened`. `yarn knip` ma charakter doradczy w kwestii zależności/importów.
- Kontrole tłumaczeń dokumentacji opisano w [translations.md](translations.md); nie uruchamiaj masowego zapisu tłumaczeń przy ukierunkowanej zmianie dokumentacji.

## Dowody z przeglądarki i własność

Do małych, odizolowanych zmian w przeglądarce używaj Chrome. Dodaj Firefox i WebKit przy współdzielonym CSS/układzie/responsywności, API zależnych od przeglądarki, szerokich interakcjach, wydaniach lub jawnych kryteriach międzyprzeglądarkowych. Uwzględnij dotknięte układy mobilne i zachowanie dotykowe. Sama zmiana rozmiaru viewportu nie jest emulacją dotyku. Wybieraj rzeczywiste trasy i treści na podstawie kodu źródłowego, zamiast zakładać, że przykłady są dostępne.

Używaj `playwright-cli` przez `./scripts/pw-session.sh`. W całej maszynie aktywna jest jedna przeglądarka; wybrane silniki działają po kolei, a każda posiadana przez Ciebie sesja jest zamykana, nawet po niepowodzeniu. Wykorzystaj ponownie autoryzowaną sesję należącą do wywołującego, nie zamykając jej. Nigdy nie używaj globalnego sprzątania przeglądarek ani nie zatrzymuj serwera o niejasnej własności. Praca wyłącznie nad dokumentacją nie wymaga przeglądarki ani serwera.

Przy pracy nad wydajnością porównuj ten sam przepływ przy równoważnym viewporcie, treści, ustawieniach sieci/CPU, trybie budowania i narzucie pomiarowym. Odróżniaj obserwacje od podejrzewanych przyczyn. Użyj umiejętności profilowania, gdy te pomiary odpowiadają na faktyczne zlecenie.

## Dowody końcowe

Jeden agent odpowiada za ciężką weryfikację. Sprawdź aktywne obciążenia i wykonuj szeregowo instalacje, budowania/pełne zestawy testów, Doctor, prace nad Android/Electron i profilowanie przeglądarki. Raportuj polecenia/wyniki i konkretne ograniczenia; brakujące dane lub pominięty silnik to nie jest wynik pozytywny. Fixtures narzędzi weryfikują formaty i mechanikę, a nie pełne wykrywanie w aplikacjach ani jakość decyzji modelu.

## Automatyczne kontrole React

`yarn agent:verify` uruchamia wybrane budowania, a po nich `yarn doctor:check` i `yarn perf:check`. `perf:check` zawiera autotest zgodności kolektora i celowo wprowadzonej regresji, więc ani CI, ani ścieżka weryfikacji agenta nie potrzebuje osobnego przebiegu `perf:test`. Zainstaluj przypięte narzędzia przeglądarkowe jednorazowo za pomocą `yarn perf:install` (`--with-deps` w CI na Linuksie). Po pełnym odpowiednim przebiegu używaj filtrów celów/scenariuszy do ukierunkowanych powtórzeń. Budżety scenariuszy są jawnie zapisane w `scripts/react-perf/config.mjs`; zachowaj dowody i napraw regresję, zanim rozważysz uzasadnioną zmianę punktu odniesienia. Zwykłe budowania produkcyjne pomijają Bippy; osobne polecenia `build:profile:*` dostarczają oficjalną instrumentację profilowania React.

Scenariusz `apps-search` serwisu about po każdym znaku czeka, aż wartość URL i pola wejściowego zostanie zatwierdzona, i dopiero wtedy wysyła kolejny klawisz. Jego pozytywny wynik obejmuje tę sekwencję zatwierdzonych zapytań, a nie responsywność przy szybkim pisaniu. Do oceny utraty znaków lub responsywności wprowadzania używaj osobnej reprodukcji z szybkim wprowadzaniem.
