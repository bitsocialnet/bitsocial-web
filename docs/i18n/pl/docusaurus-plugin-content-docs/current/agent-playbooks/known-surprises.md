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

- **Data:** 2026-03-18
- **Obserwowane przez:** Kodeks
- **Kontekst:** Weryfikacja przeglądarki i przepływ dymu
- **Co było zaskakujące:** Domyślny lokalny adres URL nie jest zwykłym portem Vite. Repozytorium oczekuje `http://bitsocial.localhost:1355` przez Portless, więc sprawdzenie `localhost:3000` lub `localhost:5173` może spowodować trafienie w niewłaściwą aplikację lub nic.
- **Skutek:** Sprawdzanie przeglądarki może zakończyć się niepowodzeniem lub zweryfikować niewłaściwy cel, nawet jeśli serwer deweloperski jest w dobrym stanie.
- **Środki zaradcze:** Najpierw użyj `http://bitsocial.localhost:1355`. Pomiń go za pomocą `PORTLESS=0 corepack yarn start` tylko wtedy, gdy wyraźnie potrzebujesz bezpośredniego portu Vite.
- **Stan:** potwierdzony

### Haki Commitizen blokują nieinteraktywne zatwierdzenia

- **Data:** 2026-03-18
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
- **Co było zaskakujące:** Maszyna nadal ma globalną instalację klasycznej przędzy na `PATH`, więc działająca zwykła `yarn` może zostać przekształcona w wersję 1 zamiast przypiętej wersji Yarn 4.
- **Skutek:** Programiści mogą przypadkowo ominąć przypinanie menedżera pakietów w repozytorium i uzyskać inne zachowanie podczas instalacji lub dane wyjściowe pliku blokującego.
- **Środki zaradcze:** Użyj `corepack yarn ...` dla poleceń powłoki lub uruchom najpierw `corepack enable`, aby zwykłe `yarn` rozwiązało się do przypiętej wersji Yarn 4.
- **Stan:** potwierdzony

### Naprawiono kolizję nazw aplikacji bez portów w drzewach roboczych Bitsocial Web

- **Data:** 30.03.2026
- **Obserwowane przez:** Kodeks
- **Kontekst:** Uruchamianie `yarn start` w jednym drzewie roboczym Bitsocial Web, podczas gdy inne drzewo robocze było już obsługiwane przez Portless
- **Co było zaskakujące:** Użycie dosłownej nazwy aplikacji bez portów `bitsocial` w każdym drzewie roboczym powoduje, że sama trasa koliduje, nawet jeśli porty zapasowe są różne, więc drugi proces kończy się niepowodzeniem, ponieważ `bitsocial.localhost` jest już zarejestrowany.
- **Skutek:** Równoległe gałęzie Bitsocial Web mogą się wzajemnie blokować, mimo że Portless ma umożliwiać im bezpieczne współistnienie.
- **Środki zaradcze:** Pozostaw uruchamianie bez portów za `scripts/start-dev.mjs`, które teraz używa trasy `*.bitsocial.localhost:1355` o zasięgu rozgałęzionym poza przypadkiem kanonicznym i powraca do trasy o zasięgu rozgałęzionym, gdy sama nazwa `bitsocial.localhost` jest już zajęta.
- **Stan:** potwierdzony

### Podgląd dokumentów używany do zakodowania portu 3001

- **Data:** 30.03.2026
- **Obserwowane przez:** Kodeks
- **Kontekst:** Uruchamianie `yarn start` wraz z innymi lokalnymi repozytoriami i agentami
- **Co było zaskakujące:** Polecenie root dev uruchomiło obszar roboczy dokumentów z `docusaurus start --port 3001`, więc cała sesja programistyczna kończyła się niepowodzeniem, gdy inny proces posiadał już `3001`, mimo że główna aplikacja korzystała już z funkcji Portless.
- **Skutek:** `yarn start` może zakończyć proces sieciowy natychmiast po jego uruchomieniu, przerywając niepowiązaną pracę lokalną z powodu kolizji portu dokumentów.
- **Środki zaradcze:** Zachowaj uruchamianie dokumentów za `yarn start:docs`, który teraz używa Portless plus `scripts/start-docs.mjs` do honorowania wstrzykniętego wolnego portu lub powrotu do następnego dostępnego portu po bezpośrednim uruchomieniu.
- **Stan:** potwierdzony
