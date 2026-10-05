# Znane niespodzianki

Ten plik zbiera specyficzne dla tego repozytorium punkty zapalne, które doprowadziły do błędów agentów.

## Kryteria wpisu

Dodaj wpis tylko wtedy, gdy spełnione są wszystkie warunki:

- Dotyczy wyłącznie tego repozytorium (a nie ogólnych porad).
- Prawdopodobnie powtórzy się u przyszłych agentów.
- Ma konkretny środek zaradczy, który da się zastosować.

W razie wątpliwości zapytaj dewelopera przed dodaniem wpisu.

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

### Produkcyjne domeny aplikacji na Vercelu mogą wrócić do wdrożeń z gałęzi master w Git

- **Data:** 2026-04-28
- **Zaobserwowane przez:** Tommaso + Codex
- **Kontekst:** Weryfikacja kopii lustrzanych aplikacji Seedit i 5chan w katalogu aplikacji Bitsocial Web.
- **Co było zaskakujące:** Projekty `seedit` i `5chan` na Vercelu miały ustawienie `gitProviderOptions.createDeployments = "enabled"`, więc pushe do `master` w GitHub były promowane na domeny produkcyjne, mimo że polityka repozytorium zakłada, iż produkcyjne kopie lustrzane serwują wyłącznie artefakty wydań.
- **Skutek:** Odznaki zweryfikowanej kopii lustrzanej w katalogu aplikacji mogą stać się nieprawdziwe, ponieważ domeny produkcyjne serwują najnowszy commit deweloperski zamiast archiwum ZIP wydania z GitHub, którego hash pliku `index.html` jest zapisany w `about/src/lib/apps-data.ts`.
- **Środek zaradczy:** Przed dodaniem lub odświeżeniem metadanych weryfikacji kopii lustrzanej sprawdź projekt na Vercelu poleceniem `vercel api /v9/projects/<project-id>` i potwierdź, że `gitProviderOptions.createDeployments = "disabled"`. Zawartość archiwum ZIP wydania wdrażaj przez `vercel deploy --prebuilt --prod`, a do wdrożeń deweloperskich używaj `seedit-omega.vercel.app` lub `5chan-omega.vercel.app`.
- **Status:** potwierdzony

### Portless 0.11 używa ponownie starego stanu proxy, dopóki launcher nie wymusi HTTPS

- **Data:** 2026-04-28
- **Zaobserwowane przez:** Tommaso + Codex
- **Kontekst:** Przejście zwykłego przepływu `yarn start` ze starego adresu proxy `http://bitsocial.localhost:1355` na `https://bitsocial.localhost`.
- **Co było zaskakujące:** Nawet z zainstalowanym `portless@0.11.1` Portless nadal korzystał z istniejącego proxy HTTP z `~/.portless/proxy.port = 1355` i wypisywał stary adres `:1355`.
- **Skutek:** Aktualizacja wersji pakietów i dokumentacji nie wystarcza; `yarn start` może nadal ogłaszać i wykorzystywać stary adres, jeśli u współpracownika działa jeszcze stary stan Portless.
- **Środek zaradczy:** Skrypty startowe mają jawnie uruchamiać proxy HTTPS Portless na porcie `443` przed rejestracją tras aplikacji, tak aby przepływ uruchomieniowy odchodził od utrwalonego stanu `1355`, zamiast go dziedziczyć.
- **Status:** potwierdzony

### Portless zmienia kanoniczny lokalny adres aplikacji

- **Data:** 2026-03-18
- **Zaobserwowane przez:** Codex
- **Kontekst:** Weryfikacja w przeglądarce i przepływy smoke
- **Co było zaskakujące:** Domyślnym lokalnym adresem nie jest typowy port Vite. Repozytorium oczekuje `https://bitsocial.localhost` przez Portless, więc sprawdzanie `localhost:3000` lub `localhost:5173` może trafić w niewłaściwą aplikację albo w nic.
- **Skutek:** Sprawdzenia w przeglądarce mogą zawieść lub zweryfikować niewłaściwy cel, nawet gdy serwer deweloperski działa poprawnie.
- **Środek zaradczy:** W pierwszej kolejności używaj `https://bitsocial.localhost` do wszystkich sprawdzeń. Omijaj to przez `PORTLESS=0 corepack yarn start` tylko wtedy, gdy naprawdę potrzebujesz bezpośredniego portu Vite.
- **Status:** potwierdzony

### Haki Commitizen blokują nieinteraktywne commity

- **Data:** 2026-03-18
- **Zaobserwowane przez:** Codex
- **Kontekst:** Przepływy commitów prowadzone przez agenta
- **Co było zaskakujące:** `git commit` uruchamia Commitizen przez Husky i czeka na interaktywne wejście z TTY, co zawiesza nieinteraktywne powłoki agentów.
- **Skutek:** Agenci mogą utknąć na czas nieokreślony podczas czegoś, co powinno być zwykłym commitem.
- **Środek zaradczy:** W commitach tworzonych przez agenta używaj `git commit --no-verify -m "message"`. Ludzie mogą nadal korzystać z `corepack yarn commit` lub `corepack yarn exec cz`.
- **Status:** potwierdzony

### Corepack jest konieczny, aby nie trafić na Yarn classic

- **Data:** 2026-03-19
- **Zaobserwowane przez:** Codex
- **Kontekst:** Migracja menedżera pakietów na Yarn 4
- **Co było zaskakujące:** Na maszynie nadal jest globalna instalacja Yarn classic w `PATH`, więc zwykłe `yarn` może rozwiązać się do wersji 1 zamiast do przypiętej wersji Yarn 4.
- **Skutek:** Deweloperzy mogą przypadkiem obejść przypięcie menedżera pakietów w repozytorium i uzyskać inne zachowanie instalacji albo inną zawartość pliku blokady.
- **Środek zaradczy:** W poleceniach powłoki używaj `corepack yarn ...` albo najpierw uruchom `corepack enable`, żeby zwykłe `yarn` rozwiązywało się do przypiętej wersji Yarn 4.
- **Status:** potwierdzony

### Stałe nazwy aplikacji Portless kolidują między worktree Bitsocial Web

- **Data:** 2026-03-30
- **Zaobserwowane przez:** Codex
- **Kontekst:** Uruchamianie `yarn start` w jednym worktree Bitsocial Web, gdy inny worktree już serwował przez Portless
- **Co było zaskakujące:** Użycie dosłownej nazwy aplikacji Portless `bitsocial` w każdym worktree powoduje kolizję samej trasy, nawet gdy porty pod spodem są różne, więc drugi proces kończy się błędem, bo `bitsocial.localhost` jest już zarejestrowane.
- **Skutek:** Równoległe gałęzie Bitsocial Web mogą się nawzajem blokować, choć Portless ma pozwalać im bezpiecznie współistnieć.
- **Środek zaradczy:** Uruchamianie Portless trzymaj w `scripts/start-dev.mjs`, który poza kanonicznym przypadkiem korzysta z trasy `*.bitsocial.localhost` powiązanej z gałęzią i przełącza się na taką trasę, gdy goła nazwa `bitsocial.localhost` jest już zajęta.
- **Status:** potwierdzony

### Podgląd dokumentacji miał kiedyś zapisany na sztywno port 3001

- **Data:** 2026-03-30
- **Zaobserwowane przez:** Codex
- **Kontekst:** Uruchamianie `yarn start` obok innych lokalnych repozytoriów i agentów
- **Co było zaskakujące:** Główne polecenie deweloperskie uruchamiało workspace dokumentacji przez `docusaurus start --port 3001`, więc cała sesja deweloperska zawodziła, gdy inny proces zajmował już `3001`, mimo że główna aplikacja korzystała już z Portless.
- **Skutek:** `yarn start` mogło ubić proces webowy tuż po jego starcie, przerywając niepowiązaną lokalną pracę przez kolizję portu dokumentacji.
- **Środek zaradczy:** Uruchamianie dokumentacji trzymaj za `yarn start:docs`, które korzysta z Portless oraz `scripts/start-docs.mjs`, aby uszanować wstrzyknięty wolny port albo — przy bezpośrednim uruchomieniu — przejść na kolejny dostępny port.
- **Status:** potwierdzony

### Nazwa hosta Portless dla dokumentacji była zapisana na sztywno

- **Data:** 2026-04-03
- **Zaobserwowane przez:** Codex
- **Kontekst:** Uruchamianie `yarn start` w dodatkowym worktree Bitsocial Web, gdy inny worktree już serwował dokumentację przez Portless
- **Co było zaskakujące:** `start:docs` nadal rejestrowało dosłowną nazwę hosta `docs.bitsocial.localhost`, więc `yarn start` mogło zawieść, mimo że aplikacja about potrafiła już unikać kolizji tras Portless dla własnej nazwy hosta.
- **Skutek:** Równoległe worktree nie mogły niezawodnie korzystać z głównego polecenia deweloperskiego, bo proces dokumentacji kończył się pierwszy, a `concurrently` ubijało resztę sesji.
- **Środek zaradczy:** Uruchamianie dokumentacji trzymaj w `scripts/start-docs.mjs`, który wyprowadza tę samą powiązaną z gałęzią nazwę hosta Portless co aplikacja about i wstrzykuje ten wspólny publiczny adres jako cel deweloperskiego proxy `/docs`.
- **Status:** potwierdzony

### Powłoki w worktree mogą pomijać przypiętą w repozytorium wersję Node

- **Data:** 2026-04-03
- **Zaobserwowane przez:** Codex
- **Kontekst:** Uruchamianie `yarn start` w worktree Git, takich jak `.claude/worktrees/*` albo sąsiednie checkouty worktree
- **Co było zaskakujące:** Niektóre powłoki w worktree rozwiązywały `node` i `yarn node` do Node `25.2.1` z Homebrew, mimo że repozytorium przypina `22.12.0` w `.nvmrc`, więc `yarn start` mogło po cichu uruchamiać launchery deweloperskie na niewłaściwym środowisku uruchomieniowym.
- **Skutek:** Zachowanie serwera deweloperskiego może się rozjeżdżać między głównym checkoutem a worktree, co utrudnia odtwarzanie błędów i łamie oczekiwany w repozytorium łańcuch narzędzi Node 22.
- **Środek zaradczy:** Launchery deweloperskie trzymaj w `scripts/start-dev.mjs` i `scripts/start-docs.mjs`, które ponownie uruchamiają się pod binarką Node z `.nvmrc`, gdy bieżąca powłoka ma złą wersję. Konfiguracja powłoki powinna nadal preferować `nvm use`.
- **Status:** potwierdzony

### Pozostałości po `docs-site/` mogą ukryć brakujące źródła dokumentacji po refaktorze

- **Data:** 2026-04-01
- **Zaobserwowane przez:** Codex
- **Kontekst:** Porządkowanie monorepo po scaleniu, po przeniesieniu projektu Docusaurus z `docs-site/` do `docs/`
- **Co było zaskakujące:** Stary katalog `docs-site/` może zostać na dysku ze starymi, ale ważnymi plikami, takimi jak `i18n/`, nawet gdy śledzone repozytorium przeszło już na `docs/`. Sprawia to, że refaktor wygląda lokalnie na zduplikowany, i może ukryć fakt, że śledzone tłumaczenia dokumentacji nie zostały faktycznie przeniesione do `docs/`.
- **Skutek:** Agenci mogą usunąć stary katalog jako „śmieci” i przypadkiem stracić jedyną lokalną kopię tłumaczeń dokumentacji albo dalej edytować skrypty wskazujące na martwą ścieżkę `docs-site/`.
- **Środek zaradczy:** Traktuj `docs/` jako jedyny kanoniczny projekt dokumentacji. Zanim usuniesz jakiekolwiek lokalne pozostałości po `docs-site/`, przywróć śledzone źródła, takie jak `docs/i18n/`, i zaktualizuj skrypty oraz haki, aby przestały odwoływać się do `docs-site`.
- **Status:** potwierdzony

### Wielojęzyczny podgląd dokumentacji potrafi gwałtownie zwiększyć zużycie RAM podczas weryfikacji

- **Data:** 2026-04-01
- **Zaobserwowane przez:** Codex
- **Kontekst:** Naprawianie i18n dokumentacji, routingu lokalizacji i zachowania Pagefind przy użyciu `yarn start:docs` oraz Playwright
- **Co było zaskakujące:** Domyślny tryb podglądu dokumentacji wykonuje teraz pełną wielojęzyczną kompilację dokumentacji wraz z indeksowaniem Pagefind, zanim zacznie serwować, a utrzymywanie tego procesu obok kilku sesji Playwright lub Chrome potrafi zużyć znacznie więcej RAM niż zwykła pętla deweloperska Vite albo Docusaurus w jednym języku.
- **Skutek:** Maszynie może zabraknąć pamięci, sesje przeglądarki mogą się wykładać, a przerwane uruchomienia mogą zostawić nieaktualne serwery dokumentacji lub przeglądarki headless, które dalej zjadają pamięć.
- **Środek zaradczy:** Do prac nad dokumentacją, które nie wymagają weryfikacji tras lokalizacji ani Pagefind, wybieraj `DOCS_START_MODE=live yarn start:docs`. Domyślnego wielojęzycznego podglądu używaj tylko wtedy, gdy musisz sprawdzić przetłumaczone trasy albo Pagefind. Utrzymuj jedną sesję Playwright, zamykaj stare sesje przeglądarki przed otwarciem nowych i zatrzymaj serwer dokumentacji po weryfikacji, jeśli nie jest już potrzebny.
- **Status:** potwierdzony

### `translate-docs.py` może zostawić lokalizacje dokumentacji przetłumaczone w połowie lub z zepsutymi celami linków

- **Data:** 2026-04-06
- **Zaobserwowane przez:** Codex
- **Kontekst:** Naprawianie zlokalizowanych tras i treści dokumentacji po tym, jak `yarn start:docs` serwowało angielskie strony szczegółów albo nie potrafiło zbudować wyjścia dla lokalizacji
- **Co było zaskakujące:** Potok tłumaczenia dokumentacji miał jednocześnie dwa specyficzne dla repozytorium tryby awarii: `scripts/translate-docs.py` wyciągał tylko niewielki podzbiór komunikatów `DocsHome`, gdy wywołania `tr(...)` miały formy, których nie potrafił sparsować, a przetłumaczony markdown w `docs/i18n/**` mógł zawierać maszynowo przetłumaczone slugi albo artefakty `ZXQPLACEHOLDER` wewnątrz celów linków.
- **Skutek:** Zlokalizowane strony główne mogą po cichu wracać do angielskiego, zlokalizowane strony szczegółów mogą wyglądać na nieprzetłumaczone, a pełne `yarn docs:build` może zawieść na zepsutych linkach w lokalizacji, mimo że źródłowa dokumentacja jest poprawna.
- **Środek zaradczy:** Po zmianie tłumaczeń dokumentacji lub wygenerowaniu plików lokalizacji zawsze uruchom `yarn docs:build` z katalogu głównego repozytorium, przeskanuj markdown w `docs/i18n/**` pod kątem `ZXQPLACEHOLDER` i sprawdź, czy przetłumaczone linki nadal wskazują kanoniczne slugi dokumentów, takie jak `/apps/5chan/`, a nie przetłumaczone ścieżki URL. Jeśli zmieniły się teksty `DocsHome`, potwierdź, że `scripts/translate-docs.py` nadal wyciąga wszystkie komunikaty `docs.home.*`.
- **Status:** potwierdzony

### Sprawdzenia bez JS dla witryny about muszą korzystać z trasy Portless, a nie z osobnego podglądu SSR

- **Data:** 2026-04-12
- **Zaobserwowane przez:** Codex
- **Kontekst:** Weryfikacja obsługi braku JS w witrynie `about/` z worktree gałęzi
- **Co było zaskakujące:** Osobny podgląd SSR może wyglądać na sprawny, podczas gdy właściwa trasa Portless powiązana z gałęzią wciąż serwuje niewłaściwą powłokę aplikacji albo starszy proces. W tym repozytorium prawdziwym lokalnym kontraktem jest nazwa hosta Portless z `yarn start`, a nie doraźny serwer podglądu.
- **Skutek:** Agenci mogą błędnie stwierdzić, że obsługa braku JS działa, albo przeoczyć regresje widoczne wyłącznie na `*.bitsocial.localhost`.
- **Środek zaradczy:** Do weryfikacji `about/` w przeglądarce zawsze uruchamiaj prawdziwy lokalny serwer przez `yarn start` lub `yarn start:about` i najpierw testuj powiązany z gałęzią adres Portless. Jeśli nazwa hosta Portless wygląda na nieaktualną, sprawdź i zatrzymaj stary proces przed ponownym testem.
- **Status:** potwierdzony

### `chain/` był niewidoczny dla `yarn build:verify` i `yarn doctor`

- **Data:** 2026-07-05
- **Zaobserwowane przez:** Codex
- **Kontekst:** Weryfikacja diffa dotyczącego wyłącznie chain/ po dodaniu do monorepo workspace'u `chain/` (samodzielna aplikacja Vite dla `chain.bitsocial.net`).
- **Co było zaskakujące:** `scripts/verify-build.mjs` rozpoznawał tylko prefiksy ścieżek `about/`, `docs/` i `stats/`, więc diff obejmujący jedynie chain/ wypisywał „No targeted build checks matched the current diff” i nie uruchamiał żadnej kompilacji, mimo że `build:chain` już istniało w głównym `package.json`. Osobno `yarn doctor` był zaszyty na sztywno jako `react-doctor about -y`, więc zmiany React w `chain/src` nie miały żadnego pokrycia React Doctor.
- **Skutek:** Agenci weryfikujący zmiany w chain musieli wiedzieć, że mają wywołać `yarn build:chain` bezpośrednio, zamiast ufać `yarn build:verify`, a problemy React w `chain/src` (efekty, hooki, martwy kod) pozostawały niewykryte przez `yarn doctor`.
- **Środek zaradczy:** `scripts/verify-build.mjs` ma teraz gałąź dla `chain/` odwzorowującą tę dla `about/`, a `doctor` / `doctor:verbose` uruchamiają `react-doctor --project about,chain -y` w jednym wywołaniu. `doctor:score` pozostaje ograniczone do `about`, ponieważ `--score` po cichu nic nie wypisuje w połączeniu z `--project` dla więcej niż jednego projektu; jeśli potrzebny jest wynik dla chain, użyj `yarn react-doctor --project about,chain --verbose -y` (albo `--json`).
- **Status:** potwierdzony

### P2P w przeglądarce działa na bezpiecznych WebSockets; pkc-js domyślnie odrzuca WebRTC i WebTransport

- **Data:** 2026-08-02
- **Zaobserwowane przez:** Claude
- **Kontekst:** Pisanie tekstów strony docelowej i dokumentacji o tym, jak działa P2P Bitsocial w przeglądarce
- **Co było zaskakujące:** `@pkcprotocol/pkc-js` dostarcza domyślny connection gater, który odrzuca połączenia WebRTC i WebTransport w przeglądarce — `dist/browser/helia/dial-transport-filter.js` eksportuje `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Komentarz w źródle podaje powód: w przeglądarce te transporty dokładają długie i często zawodzące ścieżki nawiązywania połączenia (STUN/ICE, rotacja certhash), które spowalniają ładowanie, podczas gdy WebSocket jest bezpośredni i niezawodny. Każdy żywy peer w panelu statusu P2P na blogu pokazuje „Secure WebSocket”. Gater mieszka w `node_modules`, więc nic w repozytorium na niego nie wskazuje.
- **Skutek:** Bardzo łatwo napisać technicznie wiarygodny, ale fałszywy tekst publiczny — na przykład przypisać zasługę umożliwienia P2P Bitsocial w przeglądarce temu, że WebTransport osiągnął status Baseline w przeglądarkach w marcu 2026. To twierdzenie trafiło na stronę docelową, do tabeli porównawczej i na dwie strony dokumentacji, zanim deweloper je wyłapał. Błędne twierdzenia o architekturze na publicznych stronach są sprawdzane dokładnie przez tę deweloperską publiczność, do której serwis jest kierowany.
- **Środek zaradczy:** Nigdy nie wnioskuj, jakich transportów używa Bitsocial, z tego, co libp2p albo platforma przeglądarki obsługuje w teorii. Sprawdź aktualną listę odrzuceń w `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js`, potwierdź, że w `about/src/` nie ma nadpisania `connectionGater`, i przeczytaj etykiety transportów na żywo w panelu „P2P status” na blogu, zanim postawisz jakiekolwiek publiczne twierdzenie. Zmianą upstream, która faktycznie odblokowała publikowanie z przeglądarki, była poprawka monotonicznego seqno w gossipsub w `@libp2p/gossipsub` 15.0.21 (maj 2026); pkc-js dostarcza obecnie 16.0.4.
- **Status:** potwierdzony

### Względne linki `./page.md` z nieprzetłumaczonej strony dokumentacji psują każdą zlokalizowaną kompilację

- **Data:** 2026-08-02
- **Zaobserwowane przez:** Claude
- **Kontekst:** Dodanie nowej strony tylko po angielsku, `docs/browser-p2p.md`, która linkowała do istniejącej dokumentacji przez `./peer-to-peer-protocol.md` i `./apps/5chan.md`
- **Co było zaskakujące:** Każda lokalizacja w `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` odwzorowuje drzewo dokumentacji. Nowa strona nieobecna w tych kopiach nadal renderuje się w każdej lokalizacji dzięki awaryjnemu angielskiemu, ale jej względne linki markdown przestają się rozwiązywać — Docusaurus generuje `/ar/browser-p2p/peer-to-peer-protocol.md/` i przerywa kompilację komunikatem „Docusaurus found broken links!”. Co istotne, `yarn build:verify` i `yarn docs:build:verify` budują tylko `en` i przechodzą bez błędu; ujawnia to dopiero pełne `yarn docs:build`, które przerywa się na pierwszej lokalizacji alfabetycznie (`ar`).
- **Skutek:** Zmiana w dokumentacji może przejść wszystkie szybkie lokalne sprawdzenia i mimo to zepsuć produkcyjną kompilację wielojęzyczną. Awaria wygląda też na niezwiązaną ze zmianą, bo błąd wskazuje ścieżkę lokalizacji, której autor nigdy nie dotykał.
- **Środek zaradczy:** Na każdej stronie dokumentacji, która nie ma kopii w `docs/i18n/**`, używaj linków od katalogu głównego (`/peer-to-peer-protocol/`, `/apps/5chan/`) zamiast względnych linków `.md`; Docusaurus sam dokłada prefiks lokalizacji. Istniejącym przykładem jest `docs/build-your-own-client.md`. Przed przekazaniem jakiejkolwiek zmiany, która dodaje lub linkuje stronę dokumentacji, uruchom pełne `yarn docs:build`, a nie tylko `build:verify`.
- **Status:** potwierdzony

### Równoległe uruchomienia `update-translations.js` po cichu gubią klucze

- **Data:** 2026-08-02
- **Zaobserwowane przez:** Claude
- **Kontekst:** Zastosowanie 26 przetłumaczonych kluczy i18next we wszystkich 36 lokalizacjach przy użyciu umiejętności `translate`
- **Co było zaskakujące:** Każde wywołanie to odczyt-modyfikacja-zapis na wszystkich 36 plikach lokalizacji, więc dwa równoległe wywołania nadpisują się nawzajem i jeden klucz znika bez żadnego błędu. Umiejętność `translate` wprost każe uruchamiać do 4 subagentów równolegle, a każdy z nich wywołałby ten skrypt.
- **Skutek:** Zawodzi po cichu: klucze znikają z przypadkowych lokalizacji, a diff nadal wygląda wiarygodnie.
- **Środek zaradczy:** Nigdy nie pozwalaj subagentom-tłumaczom zapisywać plików lokalizacji równolegle — niech generują wyłącznie pliki JSON ze słownikami, a potem zastosuj każdy klucz szeregowo z agenta nadrzędnego. Po zastosowaniu sprawdź programowo, że każdy klucz istnieje we wszystkich 35 nieangielskich lokalizacjach i że żadna wartość nie jest bajt w bajt identyczna z angielskim źródłem.
- **Status:** potwierdzony
- **Aktualizacja (2026-08-10):** Skrypt wyznaczał wcześniej katalog docelowy także jako `path.join(process.cwd(), "public", "translations")`, więc udokumentowane polecenie uruchamiane z katalogu głównego repozytorium kończyło się błędem „Translations directory not found” i trzeba było uruchamiać je z `about/`. Teraz skrypt ustala workspace na podstawie bieżącego katalogu lub własnej lokalizacji i działa z dowolnego miejsca. Opisana wyżej pułapka współbieżności pozostaje bez zmian.

### Deweloperskie kontrolki adnotacji mogą przechwytywać sterowane kliknięcia

- **Kontekst:** Serwisy about i chain mają stałe kontrolki w prawym dolnym rogu, gdzie w trybie deweloperskim pojawia się też pasek narzędzi Agentation.
- **Środek zaradczy:** `scripts/pw-session.sh open` rejestruje `window.__NO_DEV_TOOLBAR__ = true` przed przeładowaniem strony. Inicjalizator Agentation respektuje też `__VISUAL_TESTING__` i `__PROFILING__`; inspekcja źródeł pozostaje dostępna niezależnie od tego. Bezpośrednia automatyzacja przeglądarki musi ustawić tę samą flagę przed wczytaniem aplikacji.

### `skills add` instaluje kopie dla Codex i Cursor w ignorowanym przez Git katalogu `.agents/`

- **Data:** 2026-08-18
- **Zaobserwowane przez:** Tommaso + Claude
- **Kontekst:** Instalowanie umiejętności `improve-threejs` z `millionco/react-doctor` za pomocą CLI `skills` (`vercel-labs/skills`).
- **Co było zaskakujące:** `npx skills add <repo> --skill <name> --agent codex` i `--agent cursor` zapisują do `.agents/skills/<name>/`, a nie do `.codex/skills/` ani `.cursor/skills/`. `AGENTS.md` zabrania katalogu `.agents/` na poziomie repozytorium, a `.gitignore:29` go ignoruje, więc obie kopie po cichu pozostają nieśledzone. Tylko `--agent claude-code` zapisuje do oczekiwanego `.claude/skills/`. Ponadto udokumentowana forma z przecinkami (`--agent claude-code,codex,cursor`) kończy się błędem „Invalid agents” i niczego nie instaluje, choć każda nazwa z osobna jest poprawna.
- **Skutek:** Instalacja zgłasza sukces, a dwie z trzech kopii dla poszczególnych narzędzi trafiają w miejsce, które nigdy nie zostanie zatwierdzone, więc po świeżym sklonowaniu Codex i Cursor po cichu nie mają tej umiejętności. Forma z przecinkami może też dać instalację, która nic nie robi, a wygląda na udaną.
- **Obecny środek zaradczy:** Repozytorium śledzi teraz `.agents/skills` jako kanoniczne źródło i generuje kopie dla Claude za pomocą `yarn ai-workflow:sync`. Dawny zakaz `.agents` i reguła ignorowania zostały usunięte. Nie kopiuj nowych umiejętności do trzech niezależnych katalogów głównych; po dodaniu umiejętności sprawdź zgodność wygenerowanych plików i katalog umiejętności w aplikacji.
- **Status:** potwierdzony
