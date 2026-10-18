---
title: Bitsocial i Quorum
description: Jak Quorum, szyfrowany end-to-end komunikator grupowy Quilibrium ze Spaces w stylu Discord, wypada w porównaniu z publicznymi społecznościami peer-to-peer Bitsocial.
---

# Bitsocial i Quorum

[Quorum](https://www.quorummessenger.com/) to komunikator grupowy zbudowany przez Quilibrium Inc. w
jej własnej sieci [Quilibrium](https://quilibrium.com/). Jest zorganizowany jak Discord, ze Spaces,
kanałami, rolami i wiadomościami bezpośrednimi, a wiadomości są w nim szyfrowane end-to-end. Bywa
wymieniany obok Bitsocial, ponieważ oba projekty opisują się jako peer-to-peer i odporne na cenzurę,
z grupami, które same ustalają swoje zasady. Mają jednak różne cele: Quorum prywatne czaty grupowe,
a Bitsocial publiczne społeczności, które każdy może czytać.

Quilibrium przedstawia się jako zdecentralizowana alternatywa dla platform chmurowych: sieć węzłów,
które przechowują dane w zaszyfrowanym hipergrafie i uzgadniają jego stan za pomocą konsensusu,
który sama nazywa Proof of Meaningful Work. Węzły zarabiają QUIL, token sieci, którym uiszcza się
opłaty za korzystanie z niej. Według
[historii Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/) Quorum powstał w 2018 roku
jako Howler, pomysł na prywatną alternatywę dla Discord, i stał się pierwszą aplikacją uruchomioną w
Quilibrium. Quilibrium Inc., założona przez Cassie Heart, rozwija protokół i oferuje Quorum jako
jedną ze swoich usług zarządzanych ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Jak działa Quorum

Poniższe szczegóły pochodzą z kodu źródłowego klientów Quorum,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) dla aplikacji webowej i
desktopowej oraz [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), według stanu
na październik 2026 roku.

- **Tożsamości.** Główna tożsamość użytkownika to zestaw kluczy Ed448, a każde urządzenie dostaje
  własne klucze X448 i Ed448. W przeglądarce klucze są chronione kluczem dostępu (passkey). Adresy
  to hashe zaczynające się od `Qm`, a użytkownicy mogą wyświetlać nazwę użytkownika z usługi nazw
  Quilibrium.
- **Szyfrowanie.** Wiadomości bezpośrednie korzystają z Double Ratchet między urządzeniami. Space
  współdzieli jedną sesję Triple Ratchet między swoimi członkami, którzy podpisują wiadomości
  kluczami przypisanymi do danego Space. Każdy Space jest szyfrowany, a Quorum twierdzi, że sposób,
  w jaki pośredniczy w przekazywaniu wiadomości, nie pozwala usłudze, która je przekazuje, powiązać
  nadawców z odbiorcami.
- **Dołączanie.** Do Spaces dołącza się przez linki z zaproszeniem. Link jednorazowy zawiera w
  adresie URL klucze potrzebne do dołączenia; link publiczny pobiera je z usługi Quorum, a publiczne
  Spaces mogą być wymienione w przeszukiwalnym katalogu.
- **Transport.** Klienci webowy, desktopowy i mobilny łączą się przez HTTPS i WebSocket z jedną
  usługą,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Przekazuje ona zaszyfrowane wiadomości do skrzynki odbiorczej każdego członka i przechowuje
  rejestracje użytkowników, zaszyfrowany manifest każdego Space (kanały, role, emoji), materiały
  zaproszeń, publiczny katalog oraz opcjonalną zaszyfrowaną synchronizację ustawień. Oprogramowanie
  węzła Quilibrium ma usługę skrzynek odbiorczych i hubów o tej samej strukturze, ale ani klienci,
  ani dokumentacja Quilibrium nie mówią, jak ta usługa odnosi się do sieci.
- **Historia.** Klient każdego członka przechowuje własną kopię Space w pamięci lokalnej. Klient
  webowy i desktopowy uzupełnia historię, prosząc członka, który jest online, o synchronizację;
  klient mobilny odtwarza dziennik, który usługa prowadzi dla każdego Space, więc może nadrobić
  zaległości, gdy żaden inny członek nie jest online.
- **Moderacja.** Role dają uprawnienia do usuwania, przypinania, wyciszania i wzmianek `@everyone`.
  Klient każdego członka sprawdza podpis pod każdą akcją moderacyjną i stosuje ją tylko wtedy, gdy
  podpisujący ma odpowiednią rolę. Właściciel może wyrzucić członka, co powoduje rotację kluczy
  Space, dzięki czemu wyrzucony członek nie może czytać nowych wiadomości. Space może wymagać
  podpisanych wiadomości albo pozwalać członkom publikować niepodpisane wiadomości, których
  autorstwu można zaprzeczyć.
- **Kod.** Klient webowy i desktopowy jest objęty licencją AGPL-3.0, a klient mobilny licencją
  GPL-3.0. Klient mobilny ma też portfel kryptowalutowy, integrację z Farcaster i Apex, płatną
  subskrypcję opisaną niżej.

## Czym się różnią

### Prywatne grupy i publiczne społeczności

Space w Quorum to grupa członków: czytać go mogą tylko osoby, które mają jego klucze, a dołączenie
wymaga linku z zaproszeniem. Link publiczny wpuszcza każdego, ale dopiero po dołączeniu. Społeczność
Bitsocial nie ma członkostwa. Każdy może ją czytać, z dowolnej aplikacji, bez dołączania, i każdy
może spróbować opublikować post, o ile przejdzie wyzwanie społeczności.

### Co utrzymuje grupę online

Space w Quorum nie ma węzła hosta. Członkowie wysyłają wiadomości przez usługę Quorum, klient
każdego członka przechowuje kopię, a właściciel nie musi być online, żeby inni mogli rozmawiać.
Społeczność Bitsocial znajduje się na węźle swojego właściciela, który przyjmuje lub odrzuca każdy
post i publikuje najnowszy stan społeczności. Społeczność pozostaje dostępna do czytania, dopóki
peery ją seedują, ale nie może przyjmować nowych postów, gdy jej węzeł jest offline. Zobacz
[Protokół peer-to-peer](/peer-to-peer-protocol/).

### Kto egzekwuje zasady

W Quorum zasady egzekwuje się na brzegu sieci. Klient każdego członka decyduje na podstawie roli
podpisującego, czy zastosować usunięcie, przypięcie lub wyciszenie, a wyrzucenie polega na
przeniesieniu wszystkich pozostałych na nowe klucze. W Bitsocial zasady egzekwuje węzeł
społeczności: post, który nie przejdzie wyzwania lub zasad społeczności, nigdy nie staje się jej
częścią. Zobacz [Lokalna moderacja, a nie globalne zakazy](/local-moderation/).

### Ochrona przed spamem

Quorum powstrzymuje spam głównie za pomocą zaproszeń. Link jednorazowy wpuszcza jedną osobę, link
publiczny wpuszcza każdego, kto go ma, a właściciel może potem wyrzucać członków i wymieniać klucze;
klient ogranicza też tempo własnego wysyłania. Tożsamości Bitsocial to darmowe pary kluczy, więc
każda społeczność wybiera wyzwanie, które uruchamia przed przyjęciem posta, na przykład captchę,
płatność, saldo tokenów albo listę dozwolonych. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Klient i sieć

Aplikacja Quorum jest klientem usługi Quorum, którą prowadzi Quilibrium Inc. Same aplikacje nie
dołączają do sieci peer-to-peer, więc dostęp do Space zależy od tego jednego punktu końcowego. Za
nim Quilibrium jest osobną siecią: w październiku 2026 roku jej
[eksplorator](https://dashboard.quilibrium.com/) pokazywał 114 osiągalnych peerów i 181 proverów
rozłożonych na 99 shardów.

Aplikacja webowa Bitsocial może uruchomić węzeł libp2p w karcie, pobierać treści społeczności od
peerów i publikować przez gossipsub. Wykrywanie peerów odbywa się przez routery HTTP, które zwracają
jedynie adresy dostawców; każdy może uruchomić taki router, a klienci mogą przejść na inny router,
zmieniając swoją konfigurację. Zobacz [Peer-to-peer w przeglądarce](/browser-p2p/).

### Ekonomia

W centrum Quilibrium znajduje się token. QUIL jest wydobywany przez węzły i służy do opłat
sieciowych, a jego opakowana wersja, wQUIL, krąży w Ethereum. Sam Quorum jest darmowy i nie wymaga
płatności ani numeru telefonu. Jego opcjonalna subskrypcja Apex kosztuje
[$5 miesięcznie](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
jest opłacana w wQUIL, SNAP lub USDC w Ethereum i dzielona między Quilibrium Inc. a cztery Spaces
wybrane przez subskrybenta. Bitsocial nie ma w protokole warstwy płatności; społeczność może wymagać
płatności lub tokena za pośrednictwem swojego wyzwania.

### Wiadomości prywatne

Tu przewagę ma Quorum. Wiadomości bezpośrednie i wiadomości w Spaces są szyfrowane end-to-end z
utajnianiem z wyprzedzeniem (forward secrecy), a treść wiadomości dociera do usługi Quorum wyłącznie
jako szyfrogram. Bitsocial skupia się na publicznych społecznościach i nie ma jeszcze natywnych
wiadomości prywatnych. Post Bitsocial jest szyfrowany kluczem węzła społeczności, gdy przemieszcza
się przez pubsub, ale po przyjęciu staje się publiczny.

## Stan projektu

W październiku 2026 roku repozytorium Quorum określało aplikację webową jako wersję beta, a strona
Quorum nadal oznaczała aplikacje w Google Play i App Store jako dostępne wkrótce. Obie aplikacje
klienckie też się rozchodzą: aplikacja mobilna ma portfel oraz funkcje Farcaster i Apex, podczas gdy
klient webowy i desktopowy pokazuje swoje strony Wallet i Farcaster jako dostępne wkrótce, a obie
aplikacje w różny sposób nadrabiają historię Space.

Mainnet Quilibrium doszedł do wersji 2.1 w dniu 30 września 2025 roku, gdy sieć wznowiła działanie
po zatrzymaniu ([ogłoszenie](https://x.com/QuilibriumInc/status/1973082817236984270)). W 2026 roku
węzeł przepisano w języku Rust, z podpisami postkwantowymi na potrzeby konsensusu i protokołem
komunikacyjnym, którym starsze węzły nie potrafią się posługiwać. Część dokumentacji opisuje
projekt, a nie faktycznie działający kod: opisuje
[routing przez mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), ale w
węźle 2.1.0.25 usługa mixnet jest
[zaślepką](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31),
która przyjmuje wiadomości bez ich mieszania.

## Porównanie

| Pytanie                  | Quorum                                                                                          | Bitsocial                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Kategoria                | Szyfrowany end-to-end komunikator grupowy w sieci Quilibrium                                    | Sieć społeczności peer-to-peer                                                                                       |
| Tożsamość                | Główny zestaw kluczy Ed448 plus klucze dla każdego urządzenia, chronione kluczem dostępu        | Pary kluczy Ed25519 dla użytkowników i społeczności                                                                  |
| Kto może czytać          | Członkowie, którzy mają klucze danego Space                                                     | Każdy, z dowolnej aplikacji                                                                                          |
| Gdzie są wiadomości      | Urządzenie każdego członka; klient mobilny odtwarza też dziennik prowadzony przez usługę Quorum | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                                                |
| Z czym łączą się klienci | Usługa Quorum pod adresem `api.quorummessenger.com`                                             | Peery przez libp2p, także z karty przeglądarki                                                                       |
| Społeczności             | Spaces z kanałami, rolami i linkami z zaproszeniem                                              | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                                                       |
| Ochrona przed spamem     | Linki z zaproszeniem, wyrzucanie z wymianą kluczy, limity tempa po stronie klienta              | Wyzwanie danej społeczności przed przyjęciem posta                                                                   |
| Moderacja                | Role egzekwowane przez klienta każdego członka; właściciel wyrzuca                              | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują                                |
| Wiadomości prywatne      | Wiadomości bezpośrednie szyfrowane end-to-end                                                   | Publiczne społeczności; brak jeszcze natywnych wiadomości prywatnych                                                 |
| Ekonomia                 | Token sieciowy QUIL; opcjonalna subskrypcja Apex za $5 miesięcznie                              | Brak w protokole; wyzwanie może wymagać płatności lub tokena                                                         |
| Główny kompromis         | Prywatne, szyfrowane grupy, ale każdy klient zależy od jednej usługi                            | Darmowe tożsamości i dostęp z przeglądarki, ale brak prywatnych wiadomości i przechowywany jest tylko najnowszy stan |
