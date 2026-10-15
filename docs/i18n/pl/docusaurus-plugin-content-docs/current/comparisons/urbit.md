---
title: Bitsocial i Urbit
description: Jak Urbit, sieć osobistych serwerów z identyfikatorami Urbit ID opartymi na Ethereum i grupami w Tlon Messenger prowadzonymi przez ich hosta, wypada w porównaniu ze społecznościami peer-to-peer Bitsocial.
---

# Bitsocial i Urbit

[Urbit](https://urbit.org/) to sieć osobistych serwerów. Każdy użytkownik ma stale włączony komputer
nazywany statkiem (ship), który działa pod kontrolą własnego systemu operacyjnego Urbit (Arvo),
napisanego we własnych językach Urbit (Nock i Hoon), i jest identyfikowany przez Urbit ID. Główna
aplikacja społecznościowa Urbit to [Tlon Messenger](https://tlon.io/), zbudowana przez Tlon, firmę
założoną w 2013 roku w celu rozwijania Urbit.

Urbit dąży do zastąpienia całego stosu obliczeniowego, więc jest projektem znacznie szerszym niż
Bitsocial. Jego warstwa społecznościowa korzysta jednak z modelu bliskiego Bitsocial: społeczność
znajduje się na węźle swojego właściciela, a ten węzeł decyduje, co zostanie wpuszczone. Oba
projekty różnią się tym, kto musi utrzymywać serwer, i tym, w jaki sposób powstrzymują spam.

## Jak działa Urbit

- **Urbit ID.** Każdy statek ma Urbit ID: liczbę wyświetlaną jako dająca się wymówić nazwa, na
  przykład `~sampel-palnet`. Identyfikatory warstwy 1 to NFT, których własność i sieciowe klucze
  publiczne są zapisane w kontraktach Azimuth w Ethereum. Identyfikatory warstwy 2, dodane w 2021
  roku w celu obniżenia opłat, korzystają z tzw. „naive rollup”: ich transakcje są publikowane w
  Ethereum partiami, ale ich własność nie jest przechowywana w kontrakcie Azimuth i każdy statek
  oblicza ją lokalnie. Według
  [dokumentacji Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) i strony
  [Get on Urbit](https://docs.urbit.org/get-on-urbit) Tlon prowadzi roller, z którego każdy może
  korzystać bezpłatnie.
- **Stała hierarchia.** Przestrzeń adresowa obejmuje 256 galaktyk, 65 536 gwiazd i około 4 miliardów
  planet do codziennego użytku. Galaktyki wydają gwiazdy, gwiazdy wydają planety, a każda planeta
  może wydawać księżyce dla własnych urządzeń. Komety to darmowe identyfikatory, które statek
  generuje sam dla siebie i które nigdy nie trafiają do blockchaina. Właściciele galaktyk tworzą
  Galactic Senate, który głosuje nad aktualizacjami kontraktów Azimuth i wybiera zarząd Urbit
  Foundation.
- **Sieć.** Statki wymieniają zaszyfrowane pakiety w trybie peer-to-peer. Od lipca 2026 roku
  protokołem sieciowym jest [Directed Messaging](https://urbit.org/blog/directed-messaging),
  napisana od nowa, zorientowana na treść wersja starszego protokołu Ames. Według
  [artykułu o Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging) za
  wykrywanie peerów odpowiadają galaktyki: każda z nich śledzi, gdzie znajdują się podległe jej
  statki, i przekazuje do nich pakiety, dopóki oba statki nie będą mogły połączyć się bezpośrednio,
  albo tak długo, jak uniemożliwia to zapora sieciowa.
- **Grupy.** W Tlon Messenger grupa jest hostowana przez statek jej twórcy. Według
  [FAQ Tlon](https://tlon.io/posts/faq) członkowie wysyłają wiadomości do hosta, który rozsyła je do
  statków wszystkich członków, a statek każdego członka przechowuje własną kopię. Host kontroluje
  role, kanały i przyjmowanie członków. Grupa może być publiczna, prywatna lub tajna i może
  [banować pojedyncze statki lub całe rangi identyfikatorów](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanały to czaty, notatniki albo kolekcje obrazów i linków.
- **Hosting.** Rejestracja w Tlon daje nowemu użytkownikowi statek obsługiwany przez Tlon, z
  kluczami, które Tlon przechowuje w depozycie. Użytkownik może wyeksportować statek wraz z jego
  master ticket i uruchomić go gdzie indziej: na urządzeniu
  [Native Planet](https://www.nativeplanet.io/) albo za pomocą środowiska uruchomieniowego Vere w
  systemie Linux, macOS lub Windows. Statki nie mogą jeszcze bezpośrednio przechowywać dużych
  plików, więc Tlon Messenger umieszcza obrazy i inne multimedia w chmurowej pamięci masowej zgodnej
  z S3.

## Czym się różnią

### Kto musi utrzymywać serwer

W Urbit każdy uczestnik jest serwerem. Aplikacje Tlon są interfejsami do własnego statku użytkownika
i nawet czytanie grupy odbywa się przez ten statek. Ci, którzy nie uruchamiają statku samodzielnie,
wynajmują go, co ponownie wprowadza do gry dostawcę hostingu: Tlon przechowuje klucze hostowanych
użytkowników i zachowuje ograniczony dostęp na potrzeby konserwacji, choć użytkownicy mogą odejść z
całym swoim statkiem.

W Bitsocial stale włączonego węzła potrzebują tylko właściciele społeczności. Czytelnicy i autorzy
postów mogą uruchomić węzeł peer-to-peer w karcie przeglądarki, a ich konto to para kluczy
przechowywana przez aplikację. Zobacz [Peer-to-peer w przeglądarce](/browser-p2p/). Gdy ktoś jednak
korzysta z hostowanego węzła, projekt Bitsocial ma mu pozwolić delegować dostępność bez oddawania
tożsamości pod cudzą pieczę. Zobacz [Tożsamość i własność społeczności](/identity-and-ownership/).

### Host społeczności

Tu oba projekty są sobie najbliższe. Grupa Tlon i społeczność Bitsocial znajdują się na węźle
swojego właściciela. Host decyduje, kto może publikować, stosuje moderację i rozsyła wynik, a żaden
z protokołów nie stawia moderatora ponad hostem. W obu przypadkach host musi być online. FAQ Tlon
mówi, że gdy host przechodzi w tryb offline, „grupa pada razem z nim”, a społeczność Bitsocial nie
może przyjmować nowych postów, gdy jej węzeł jest offline.

Treści przechowywane są inaczej. Statek każdego członka przechowuje kopię historii grupy, więc
członkowie mogą nadal czytać to, co już otrzymali, gdy host nie działa. Czytelnik Bitsocial pobiera
najnowszy stan społeczności z jej węzła lub od peerów, które ją seedują, więc społeczność offline
pozostaje dostępna do czytania, dopóki mają ją peery, ale sieć przechowuje tylko najnowszy stan.

Grupa Tlon ma też listę członków, a jej host może sprawić, że dołączyć można tylko na zaproszenie.
Społeczność Bitsocial nie ma członkostwa: każdy może ją czytać i każdy może spróbować opublikować
post, o ile przejdzie jej wyzwanie.

### Spam i tożsamość

Urbit walczy ze spamem, czyniąc tożsamość rzadkim zasobem. Pula planet jest stała, a każdą z nich
wydaje gwiazda. Darmowe komety omijają tę rzadkość, więc grupy, które chcą ją zachować, ich nie
wpuszczają: dokumentacja Urbit zauważa, że niektóre grupy odrzucają komety, a grupa Tlon może jednym
ustawieniem zbanować całą rangę komet. Gdy komety są już wykluczone, zbanowany użytkownik potrzebuje
innej planety od właściciela gwiazdy, aby wrócić. Reputacja również może podążać za hierarchią:
Azimuth zawiera kontrakt Censures, który pozwala galaktykom i gwiazdom oznaczać identyfikatory.
Ponieważ rzadkość jest wbudowana w przestrzeń adresową, działa tak samo w każdej grupie, która nie
wpuszcza komet.

Tożsamości Bitsocial to darmowe pary kluczy. Każda społeczność sama wybiera wyzwanie, które
obowiązuje przed przyjęciem posta, na przykład captchę, płatność, saldo tokenów albo listę
dozwolonych, a inne społeczności mogą wybrać inaczej. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Blockchain i zarządzanie

Warstwa tożsamości Urbit zależy od Ethereum. Kontrakty Azimuth rejestrują własność i klucze sieciowe
warstwy 1, transakcje warstwy 2 są publikowane w Ethereum partiami, a Galactic Senate może
zaktualizować kontrakt, który zarządza Azimuth. Te same 256 galaktyk zajmuje się też wykrywaniem
peerów i przekazywaniem pakietów, więc stały zbiór tożsamości odpowiada zarówno za zarządzanie, jak
i za część routingu w sieci.

Tożsamości Bitsocial to pary kluczy, które nie wymagają rejestracji. Nazwy `.bso` i `.eth` są
opcjonalnymi aliasami, które na nie wskazują. Wykrywanie peerów odbywa się przez routery HTTP, które
zwracają jedynie adresy dostawców; każdy może uruchomić taki router, a klienci mogą przejść na inny
router, zmieniając swoją konfigurację.

### Zakres

Urbit to komputer ogólnego przeznaczenia. Statek może hostować zdalne repozytorium Git, osobistą
bazę wiedzy lub agentów AI, a Tlon Messenger to tylko jeden program spośród wielu. Tworzenie dla
Urbit polega głównie na pisaniu aplikacji w Hoon dla Arvo. Bitsocial to protokół dla publicznych
społeczności, z aplikacjami takimi jak [5chan](/apps/5chan/) i [Seedit](/apps/seedit/). Działa na
istniejącym stosie (libp2p, IPFS i przeglądarka), zamiast go zastępować, a jego klientów buduje się
zwykłymi narzędziami webowymi. Zobacz [Zbuduj własnego klienta](/build-your-own-client/).

### Wiadomości prywatne

Tu przewagę ma Urbit. Wiadomości bezpośrednie trafiają z jednego statku prosto do drugiego, cały
ruch między statkami jest szyfrowany, a grupy mogą być prywatne lub tajne. Tlon zaznacza, że
wiadomości są szyfrowane podczas przesyłania, ale na statku przechowywane są bez szyfrowania.
Bitsocial skupia się na publicznych społecznościach i nie ma jeszcze natywnych wiadomości
prywatnych.

## Stan projektu

Urbit przeszedł poważne wstrząsy. W sierpniu 2024 roku Urbit Foundation, organizacja non-profit
kierująca rozwojem rdzenia, zwolniła swojego dyrektora wykonawczego; założyciel Curtis Yarvin
wrócił, by bez formalnego stanowiska kierować strategią, kilku kluczowych deweloperów odeszło, a
środki Foundation miały wystarczyć zaledwie na kilka miesięcy,
[jak podał CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin zaproponował przeniesienie Azimuth do istniejącej sieci warstwy 2 Ethereum, najpewniej do
Base, oraz emisję zamiennych tokenów typu „wiza”, które można przekształcać w planety. W
październiku 2026 roku [dokumentacja ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) Urbit
nadal opisuje Azimuth w Ethereum wraz z jego „naive rollup”. W październiku 2025 roku Galactic
Senate wymienił zarząd Foundation, a nowy zarząd powołał nowego dyrektora wykonawczego
([ogłoszenie](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Rozwój trwa. Directed Messaging został uruchomiony 14 lipca 2026 roku wraz z wydaniem 408k. W
czerwcu 2026 roku Tlon Messenger
[otworzył publiczną rejestrację bez listy oczekujących](https://urbit.org/blog/this-month-in-urbit-june-2026),
a Tlon przedstawia się teraz jako miejsce, w którym ludzie i agenci AI pracują razem.

## Porównanie

| Pytanie              | Urbit                                                                                                | Bitsocial                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Kategoria            | Sieć osobistych serwerów i system operacyjny                                                         | Sieć społeczności peer-to-peer                                                                                       |
| Tożsamość            | Urbit ID: około 4 miliardów planet w Ethereum lub w rollupie warstwy 2, plus darmowe komety          | Pary kluczy Ed25519 dla użytkowników i społeczności                                                                  |
| Kto utrzymuje serwer | Każdy użytkownik, na własnym lub hostowanym statku                                                   | Właściciele społeczności; czytelnicy i autorzy postów mogą korzystać z karty przeglądarki                            |
| Gdzie są posty       | Statek hosta grupy i kopia na statku każdego członka                                                 | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                                                |
| Społeczności         | Grupy hostowane przez statek twórcy, z listami członków                                              | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                                                       |
| Ochrona przed spamem | Rzadkie identyfikatory wydawane przez gwiazdy; grupy banują statki lub całe rangi                    | Wyzwanie danej społeczności przed przyjęciem posta                                                                   |
| Moderacja            | Role i bany ustalane przez hosta grupy                                                               | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują                                |
| Wykrywanie peerów    | Galaktyki śledzą podległe im statki i przekazują dla nich pakiety                                    | Routery HTTP zwracają peery udostępniające treść i same nie przechowują treści                                       |
| Zarządzanie          | Galactic Senate złożony z 256 galaktyk głosuje nad aktualizacjami Azimuth                            | Brak władzy na poziomie protokołu nad tożsamościami czy społecznościami                                              |
| Wiadomości prywatne  | Szyfrowane wiadomości bezpośrednie i grupy tylko na zaproszenie                                      | Publiczne społeczności; brak jeszcze natywnych wiadomości prywatnych                                                 |
| Główny kompromis     | Cały osobisty komputer z prywatnymi grupami, ale każdy użytkownik potrzebuje stale włączonego statku | Darmowe tożsamości i dostęp z przeglądarki, ale brak prywatnych wiadomości i przechowywany jest tylko najnowszy stan |
