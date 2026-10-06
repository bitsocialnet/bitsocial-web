---
title: Bitsocial i Secure Scuttlebutt
description: Jak Secure Scuttlebutt (SSB) i jego aplikacja Manyverse wypadają w porównaniu z Bitsocial, od feedów typu append-only i replikacji opartej na grafie obserwacji po społeczności, ochronę przed spamem i synchronizację offline.
---

# Bitsocial i Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) to społecznościowy protokół peer-to-peer, który
Dominic Tarr stworzył w 2014 roku. [Manyverse](https://www.manyver.se/) to jego najbardziej znana
aplikacja, dostępna na systemy Android i iOS oraz na komputery;
[Patchwork](https://github.com/ssbc/patchwork) był głównym klientem desktopowym, zanim go
zarchiwizowano. Spośród systemów porównywanych w tej dokumentacji SSB jest duchem najbliższy
Bitsocial: żadnych serwerów na ścieżce danych, żadnego blockchaina, żadnej globalnej kolejności i
klucze Ed25519 jako tożsamość. Oba projekty dokonały jednak przeciwnych wyborów co do tego, co
przechowuje każdy peer i gdzie zatrzymywany jest spam.

## Jak działa Scuttlebutt

- **Feedy.** Każda tożsamość to para kluczy Ed25519, zapisywana jako `@<public key>.ed25519`.
  Wszystko, co użytkownik publikuje, trafia do jego własnego feedu, czyli dziennika typu append-only
  (można do niego tylko dopisywać), w którym każda podpisana wiadomość zawiera numer sekwencyjny i
  hash poprzedniej wiadomości. Według
  [przewodnika po protokole](https://ssbc.github.io/scuttlebutt-protocol-guide/) opublikowanej
  wiadomości nie można już zmienić.
- **Replikacja.** Peery kopiują całe feedy, a nie pojedyncze posty, a o tym, które feedy peer
  przechowuje, decyduje graf obserwacji. Patchwork na przykład wyświetlał feedy oddalone maksymalnie
  o dwa przeskoki i replikował feedy oddalone maksymalnie o trzy. Dzięki epidemicznym drzewom
  rozgłoszeniowym (EBT) peery porównują najnowszy numer sekwencyjny, jaki mają dla każdego feedu, i
  wysyłają tylko to, czego brakuje.
- **Połączenia.** Peery uwierzytelniają się za pomocą mechanizmu secret handshake i szyfrują ruch za
  pomocą box stream. Uzgadnianie połączenia jest powiązane z identyfikatorem sieci, więc peery z
  osobnej sieci SSB o innym identyfikatorze nie mogą połączyć się z siecią główną.
- **Znajdowanie peerów.** Peery ogłaszają się w sieci lokalnej przez rozgłoszenie UDP i
  synchronizują się przez LAN; Manyverse synchronizuje się też przez Bluetooth. W internecie
  użytkownicy polegają na węzłach typu **pub**, czyli stale dostępnych peerach, które po
  wykorzystaniu kodu zaproszenia zaczynają cię obserwować, a następnie przechowują i udostępniają
  twój feed, oraz na węzłach typu **room**, które nie przechowują feedów, ale tunelują połączenia
  między swoimi członkami.
- **Bloby i wiadomości prywatne.** Obrazy i inne pliki to bloby adresowane treścią, pobierane od
  peerów, z domyślnym limitem rozmiaru 5 MB w obecnych implementacjach. Wiadomości prywatne są
  szyfrowane dla maksymalnie siedmiu odbiorców i publikowane jako szyfrogram w feedzie autora.

## Czym się różnią

### Co przechowuje peer

Peer SSB przechowuje pełną kopię każdego feedu w swoim zasięgu replikacji, od pierwszej wiadomości
każdego feedu, i udostępnia te feedy innym. To pozwala SSB działać offline, ale zajmowane miejsce
rośnie z każdą wiadomością w zasięgu, a nowa instalacja musi pobrać te feedy, zanim pokaże coś
więcej. Klient Bitsocial pobiera najnowszy stan otwieranych społeczności z węzła społeczności i od
peerów, które ją seedują, a sieć przechowuje tylko ten najnowszy stan. Zobacz
[Protokół peer-to-peer](/peer-to-peer-protocol/).

### Usuwanie i urządzenia

Ponieważ feed jest łańcuchem hashy, SSB nie ma usuwania w skali całej sieci: peer może skasować
wiadomości z własnej bazy danych, ale nie może wycofać ich z kopii innych peerów. Publikowanie tym
samym kluczem z dwóch urządzeń albo z przywróconej kopii zapasowej rozwidla feed (fork), więc
zwykłym rozwiązaniem jest jedna tożsamość na urządzenie. PZP, protokół następca od zespołu
Manyverse, wymienia usuwanie, wiele urządzeń na konto i feedy odporne na rozwidlenia wśród głównych
zmian względem SSB ([wpis zapowiadający](https://www.manyver.se/blog/2024-07-03/)). Węzeł
społeczności Bitsocial publikuje nową wersję stanu społeczności przy każdej aktualizacji, więc
treści usunięte przez jej moderatorów wypadają z najnowszego stanu.

### Kogo możesz usłyszeć

Zasięg replikacji SSB pełni zarazem funkcję filtra spamu. Feed nieznajomego dociera do ciebie tylko
wtedy, gdy obserwuje go ktoś w zasięgu twoich przeskoków, a zablokowanie feedu sprawia, że twój
węzeł przestaje go replikować. Spam zostaje na zewnątrz, ale nowi użytkownicy też, dopóki ktoś ich
nie zaobserwuje. Bitsocial pozwala każdemu publikować w społeczności, a węzeł społeczności decyduje
za pomocą swojego wyzwania, czy post zostanie przyjęty. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Społeczności

SSB nie ma obiektu społeczności. Kanały i hashtagi to etykiety na pojedynczych postach, odpowiedzi w
wątku znajdują się w feedach ich autorów, a to, ile wątku widzisz, zależy od tego, które z tych
feedów ma twój węzeł. Węzły typu room mogą mieć moderatorów i listy członków, ale decydują one o
tym, kto może łączyć się przez dany węzeł, a nie o tym, co jest publikowane. Społeczność Bitsocial
to pełnoprawny obiekt z własną parą kluczy, zasadami, moderatorami i wyzwaniem.

### Infrastruktura

Oba projekty trzymają serwery poza ścieżką danych i oba opierają się na pomocnikach. Węzły typu pub
to w SSB najbliższy odpowiednik usługi hostowanej: przechowują i udostępniają feedy wszystkich,
których obserwują. Węzły typu room są bliższe routerom HTTP w Bitsocial, bo ani jedne, ani drugie
nie przechowują treści, ale room przekazuje połączenie między swoimi członkami, podczas gdy router
zwraca jedynie adresy dostawców i nie bierze udziału w transferze. Podobnie jak peer SSB, węzeł
społeczności Bitsocial działa na sprzęcie konsumenckim i musi być online, aby przyjmować nowe posty.

### Offline i sieci lokalne

Tu SSB ma przewagę. Dwa peery SSB w tej samej sieci Wi-Fi albo połączone przez Bluetooth w Manyverse
mogą się synchronizować bez połączenia z internetem, a wszystko, co już zostało zreplikowane,
pozostaje dostępne do czytania offline. Deklarowanym głównym celem Manyverse jest uniezależnienie
sieci społecznościowych od dostępu do internetu. Bitsocial potrzebuje połączenia z internetem, aby
znaleźć peery i publikować.

### Przeglądarka

Główne aplikacje SSB zawierają pełny węzeł SSB: Manyverse dołącza go do swoich aplikacji mobilnych i
desktopowych. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) uruchamiał SSB w
przeglądarce z częściową replikacją i połączeniami przez węzły typu room, a w 2022 roku został
zarchiwizowany. Aplikacje Bitsocial uruchamiają węzeł peer-to-peer w zwykłej karcie przeglądarki.
Zobacz [Peer-to-peer w przeglądarce](/browser-p2p/).

### Wiadomości prywatne

SSB ma wbudowane szyfrowane wiadomości prywatne. Bitsocial skupia się na publicznych społecznościach
i nie ma jeszcze natywnych wiadomości prywatnych.

## Stan projektu

André Staltz, twórca Manyverse, w kwietniu 2024 roku wycofał się z SSB, Manyverse i planowanego
następcy obu projektów ([jego ostatnia aktualizacja](https://www.manyver.se/blog/2024-04-05/)). W
lipcu 2024 roku Jacob Karlsson uruchomił tego następcę jako [PZP](https://pzp.wiki/) i napisał, że
nie będzie już pracował nad Manyverse i nie zna nikogo innego, kto by to planował. W październiku
2026 roku repozytoria PZP w serwisie [Codeberg](https://codeberg.org/pzp) nie miały żadnych
aktualizacji od grudnia 2024 roku. Repozytorium Patchwork jest zarchiwizowane, a jego ostatnim
wydaniem jest v3.18.1, zaś zespół stojący za Planetary, aplikacją SSB na iOS, przeszedł w 2023 roku
na Nostr ze swoją aplikacją Nos. Sieć SSB nadal działa dzięki peerom i węzłom typu pub, które ludzie
utrzymują online, ale jej główne aplikacje nie są już rozwijane.

## Porównanie

| Pytanie              | Secure Scuttlebutt                                                                                  | Bitsocial                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Kategoria            | Protokół gossip peer-to-peer                                                                        | Sieć społeczności peer-to-peer                                                                       |
| Tożsamość            | Jedna para kluczy Ed25519 na urządzenie                                                             | Pary kluczy Ed25519 dla użytkowników i społeczności                                                  |
| Gdzie są posty       | Feed autora typu append-only, kopiowany przez każdego peera, który go replikuje                     | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                                |
| Co przechowuje peer  | Pełna historia każdego feedu w zasięgu obserwacji                                                   | Najnowszy stan społeczności, które czyta lub seeduje                                                 |
| Społeczności         | Brak obiektu społeczności; kanały i hashtagi oznaczają posty                                        | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                                       |
| Ochrona przed spamem | Zasięg replikacji wyznaczany przez graf obserwacji oraz blokady                                     | Wyzwanie danej społeczności przed przyjęciem posta                                                   |
| Moderacja            | Obserwacje i blokady każdego użytkownika                                                            | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują                |
| Serwery pomocnicze   | Węzły typu pub przechowują i udostępniają feedy; węzły typu room tunelują połączenia                | Routery HTTP zwracają peery udostępniające treść i same nie przechowują treści                       |
| Offline              | Synchronizacja przez LAN i Bluetooth bez internetu                                                  | Wymaga połączenia z internetem                                                                       |
| Przeglądarka         | Aplikacje zawierają pełny węzeł SSB                                                                 | Węzeł peer-to-peer w zwykłej karcie przeglądarki                                                     |
| Sieć                 | Działa, ale jej główne aplikacje nie są już rozwijane                                               | Działająca sieć z aplikacjami takimi jak [5chan](/apps/5chan/) i [Seedit](/apps/seedit/)             |
| Główny kompromis     | Działa offline i nie wymaga hostingu, ale feedy rosną bez końca, a nieznajomi pozostają niewidoczni | Otwarte publikowanie i obsługa przeglądarek, ale wymaga internetu i przechowuje tylko najnowszy stan |
