# Znane niespodzianki

Ten plik śledzi punkty zamieszania specyficzne dla repozytorium, które spowodowały błędy agenta.

## Kryteria wejścia

Dodaj wpis tylko jeśli wszystkie są prawdziwe:

- Jest to specyficzne dla tego repozytorium (nie jest to ogólna porada).
- Prawdopodobnie powtórzy się to w przypadku przyszłych agentów.
- Ma konkretne środki łagodzące, które można zastosować.

Jeśli nie jesteś pewien, zapytaj programistę przed dodaniem wpisu.

## Szablon wpisu

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Wpisy

### Portless zmienia kanoniczny adres URL aplikacji lokalnej

- **Data:** 18.03.2026
- **Obserwowane przez:** Kodeks
- **Kontekst:** Weryfikacja przeglądarki i przepływ dymu
- **Co było zaskakujące:** Domyślny lokalny adres URL nie jest zwykłym portem Vite. Repozytorium oczekuje `https://bitsocial.localhost` przez Portless, więc sprawdzenie `localhost:3000` lub `localhost:5173` może spowodować trafienie w niewłaściwą aplikację lub nic.
- **Skutek:** Sprawdzanie przeglądarki może zakończyć się niepowodzeniem lub zweryfikować niewłaściwy cel, nawet jeśli serwer deweloperski jest w dobrym stanie.
- **Środki zaradcze:** Najpierw użyj `https://bitsocial.localhost`. Pomiń go za pomocą `PORTLESS=0 corepack yarn start` tylko wtedy, gdy wyraźnie potrzebujesz bezpośredniego portu Vite.
- **Stan:** potwierdzony

### Haki Commitizen blokują nieinteraktywne zatwierdzenia

- **Data:** 18.03.2026
- **Obserwowane przez:** Kodeks
- **Kontekst:** Przepływy pracy zatwierdzania oparte na agentach
- **Co było zaskakujące:** `git commit` uruchamia Commitizen poprzez Husky i czeka na interaktywne wejście TTY, które zawiesza powłoki nieinteraktywnych agentów.
- **Skutek:** Agenci mogą zatrzymać się na czas nieokreślony podczas czegoś, co powinno być normalnym zatwierdzeniem.
- **Środki zaradcze:** Użyj `git commit --no-verify -m "message"` w przypadku zatwierdzeń tworzonych przez agenta. Ludzie nadal mogą używać `corepack yarn commit` lub `corepack yarn exec cz`.
- **Stan:** potwierdzony

### Aby uniknąć Yarn Classic, wymagany jest pakiet Corepack

- **Data:** 2026-03-19
- **Obserwowane przez:** Kodeks
- **Kontekst:** Migracja menedżera pakietów do Yarn 4
- **Co było zaskakujące:** Maszyna nadal ma globalną instalację klasycznej Yarn na `PATH`, więc zwykłe `yarn` może zostać przekształcone w wersję v1 zamiast przypiętej wersji Yarn 4.
- **Skutek:** Programiści mogą przypadkowo ominąć przypinanie menedżera pakietów w repozytorium i uzyskać inne zachowanie podczas instalacji lub dane wyjściowe pliku blokującego.
- **Środki zaradcze:** Użyj `corepack yarn ...` dla poleceń powłoki lub uruchom najpierw `corepack enable`, aby zwykłe `yarn` rozwiązało się do przypiętej wersji Yarn 4.
- **Stan:** potwierdzony

### Naprawiono kolizję nazw aplikacji bez portów w drzewach roboczych Bitsocial Web

- **Data:** 30.03.2026
- **Obserwowane przez:** Kodeks
- **Kontekst:** Uruchamianie `yarn start` w jednym drzewie roboczym Bitsocial Web, podczas gdy inne drzewo robocze było już obsługiwane przez Portless
- **Co było zaskakujące:** Użycie dosłownej nazwy aplikacji Portless `bitsocial` w każdym drzewie roboczym powoduje, że sama trasa koliduje, nawet jeśli porty zapasowe są różne, więc drugi proces kończy się niepowodzeniem, ponieważ `bitsocial.localhost` jest już zarejestrowany.
- **Skutek:** Równoległe gałęzie Bitsocial Web mogą się wzajemnie blokować, mimo że Portless ma umożliwiać im bezpieczne współistnienie.
- **Środki zaradcze:** Pozostaw uruchamianie bez portów za `scripts/start-dev.mjs`, które teraz używa trasy `*.bitsocial.localhost` o zasięgu rozgałęzionym poza przypadkiem kanonicznym i powraca do trasy o zasięgu rozgałęzionym, gdy sama nazwa `bitsocial.localhost` jest już zajęta.
- **Stan:** potwierdzony

### Podgląd dokumentów używany do zakodowania portu 3001

- **Data:** 30.03.2026
- **Obserwowane przez:** Kodeks
- **Kontekst:** Uruchamianie `yarn start` wraz z innymi lokalnymi repozytoriami i agentami
- **Co było zaskakujące:** Polecenie root dev uruchomiło obszar roboczy dokumentów z `docusaurus start --port 3001`, więc cała sesja programistyczna kończyła się niepowodzeniem, gdy inny proces posiadał już `3001`, mimo że główna aplikacja korzystała już z funkcji Portless.
- **Skutek:** `yarn start` może zakończyć proces sieciowy natychmiast po jego uruchomieniu, przerywając niepowiązaną pracę lokalną z powodu kolizji portu dokumentów.
- **Środki zaradcze:** Zachowaj uruchamianie dokumentów za `yarn start:docs`, który teraz używa Portless plus `scripts/start-docs.mjs` do honorowania wstrzykniętego wolnego portu lub powrotu do następnego dostępnego portu po bezpośrednim uruchomieniu.
- **Stan:** potwierdzony

### Naprawiono dokumentację Portless nazwa hosta była zakodowana na stałe

- **Data:** 2026-04-03
- **Obserwowane przez:** Kodeks
- **Kontekst:** Uruchamianie `yarn start` w dodatkowym drzewie roboczym Bitsocial Web, podczas gdy inne drzewo robocze już udostępniało dokumenty przez Portless
- **Co było zaskakujące:** `start:docs` nadal rejestrował dosłowną nazwę hosta `docs.bitsocial.localhost`, więc `yarn start` mógł się nie powieść, mimo że aplikacja about już wiedziała, jak uniknąć kolizji tras bez portów dla własnej nazwy hosta.
- **Skutek:** Równoległe drzewa robocze nie mogły w sposób niezawodny używać polecenia root dev, ponieważ proces dokumentów zakończył się jako pierwszy, a następnie `concurrently` zakończył resztę sesji.
- **Środki zaradcze:** Zachowaj uruchamianie dokumentów za `scripts/start-docs.mjs`, które teraz wyprowadza tę samą bezportową nazwę hosta o zasięgu branżowym, co aplikacja z informacjami i wstawia ten wspólny publiczny adres URL do docelowego serwera proxy dewelopera `/docs`.
- **Stan:** potwierdzony

### W powłokach Worktree może brakować wersji Node przypiętej do repozytorium

- **Data:** 2026-04-03
- **Obserwowane przez:** Kodeks
- **Kontekst:** Uruchamianie `yarn start` w drzewach roboczych Git, takich jak `.claude/worktrees/*` lub w kasach rodzeństwa
- **Co było zaskakujące:** Niektóre powłoki drzewa roboczego rozwiązały `node` i `yarn node` na węzeł Homebrew `25.2.1`, mimo że piny repo `22.12.0` w `.nvmrc`, więc `yarn start` mógł po cichu uruchomić programy uruchamiające deweloperów pod złym czas wykonania.
- **Skutek:** Zachowanie serwera deweloperskiego może dryfować pomiędzy główną kasą a drzewem roboczym, utrudniając reprodukcję błędów i naruszając oczekiwany zestaw narzędzi Node 22 repozytorium.
- **Środki zaradcze:** Pozostaw programy uruchamiające deweloperów za `scripts/start-dev.mjs` i `scripts/start-docs.mjs`, które teraz uruchamiają się ponownie w pliku binarnym węzła `.nvmrc`, gdy bieżąca powłoka jest w niewłaściwej wersji. Konfiguracja powłoki powinna nadal preferować `nvm use`.
- **Stan:** potwierdzony

### Resztki `docs-site/` mogą ukryć brakujące źródło dokumentów po refaktoryzacji

- **Data:** 2026-04-01
- **Obserwowane przez:** Kodeks
- **Kontekst:** Porządkowanie monorepo po połączeniu po przeniesieniu projektu Docusaurus z `docs-site/` do `docs/`
- **Co było zaskakujące:** Stary folder `docs-site/` może pozostać na dysku z nieaktualnymi, ale ważnymi plikami, takimi jak `i18n/`, nawet po przeniesieniu śledzonego repozytorium do `docs/`. To sprawia, że ​​refaktor wygląda na zduplikowany lokalnie i może ukryć fakt, że tłumaczenia śledzonych dokumentów nie zostały w rzeczywistości przeniesione do `docs/`.
- **Skutek:** Agenci mogą usunąć stary folder jako „śmieci” i przypadkowo utracić jedyną lokalną kopię tłumaczeń dokumentów lub nadal edytować skrypty, które nadal wskazują nieaktywną ścieżkę `docs-site/`.
- **Zagrożenie:** traktuj `docs/` jako jedyny kanoniczny projekt dokumentów. Przed usunięciem jakichkolwiek lokalnych resztek `docs-site/` przywróć śledzone źródło, takie jak `docs/i18n/` i zaktualizuj skrypty i hooki, aby nie odwoływały się do `docs-site`.
- **Stan:** potwierdzony

### Podgląd dokumentów wielolokalnych może zwiększyć ilość pamięci RAM podczas weryfikacji

- **Data:** 2026-04-01
- **Obserwowane przez:** Kodeks
- **Kontekst:** Naprawianie dokumentów i18n, routingu ustawień regionalnych i zachowania Pagefind za pomocą `yarn start:docs` plus Playwright
- **Co było zaskakujące:** domyślny tryb podglądu dokumentów umożliwia teraz pełną kompilację dokumentów w wielu lokalizacjach oraz indeksowanie Pagefind przed udostępnieniem, a utrzymywanie tego procesu przy wielu sesjach Playwright lub Chrome może zużywać znacznie więcej pamięci RAM niż normalna pętla deweloperska Vite lub Docusaurus z jedną lokalizacją.
- **Skutek:** pamięć komputera może być ograniczona, sesje przeglądarki mogą ulec awarii, a przerwane działanie może spowodować pozostawienie przestarzałych serwerów dokumentów lub przeglądarek bezgłowych, które nadal zużywają pamięć.
- **Środki zaradcze:** W przypadku pracy z dokumentami, która nie wymaga weryfikacji lokalizacji lub weryfikacji Pagefind, wybierz `DOCS_START_MODE=live yarn start:docs`. Używaj domyślnego podglądu wielolokalnego tylko wtedy, gdy chcesz sprawdzić przetłumaczone trasy lub Pagefind. Zachowaj jedną sesję Playwright, zamknij stare sesje przeglądarki przed otwarciem nowych i zatrzymaj serwer dokumentów po weryfikacji, jeśli nie jest już potrzebny.
- **Stan:** potwierdzony
