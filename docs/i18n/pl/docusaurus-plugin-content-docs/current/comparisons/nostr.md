---
title: Bitsocial i Nostr
description: Jak oparty na przekaźnikach model Nostr wypada w porównaniu ze społecznościami peer-to-peer Bitsocial, od ścieżki danych i tożsamości po grupy, ochronę przed spamem i moderację.
---

# Bitsocial i Nostr

Nostr nie mieści się dobrze ani w kategorii federacji, ani blockchaina. Instancje nie wydają
użytkownikom kont i nie ma tu łańcucha, konsensusu, gazu ani globalnej kolejności. Nostr lepiej
opisać jako **media społecznościowe oparte na przekaźnikach**: użytkownicy mają pary kluczy,
podpisują zdarzenia i publikują je do przekaźników, czyli zwykłych serwerów, które je przechowują i
udostępniają ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Według
[README](https://github.com/nostr-protocol/nostr) samego Nostr protokół nie opiera się na technikach
peer-to-peer.

Pod jednym ważnym względem stawia to Nostr bliżej Bitsocial niż systemy federacyjne czy
blockchainowe: tożsamość jest kryptograficzna i przenośna. Różnice dotyczą warstwy danych i tego, kto
pilnuje bramy.

## Jak działa Nostr

- **Zdarzenia i przekaźniki.** Każdy post, profil czy reakcja to podpisane zdarzenie JSON. Klienci
  publikują zdarzenia do przekaźników przez WebSockety i subskrybują je z filtrami; przekaźniki
  przechowują zdarzenia i udostępniają je z powrotem. Przekaźniki nie komunikują się ze sobą.
- **Replikacja.** Użytkownicy zwykle publikują do kilku przekaźników. Badanie 712 przekaźników z
  2023 roku wykazało, że przeciętny post znajdował się na 34,6 z nich
  ([Wei i Tyson](https://arxiv.org/abs/2402.05709)).
- **Znajdowanie czyichś postów.** Użytkownicy publikują listę przekaźników, do których piszą i z
  których czytają ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), a klienci
  pobierają posty użytkownika z jego przekaźników do zapisu.
- **Tożsamość.** Każdy użytkownik to klucz secp256k1, który składa podpisy Schnorra. Specyfikacje
  nie definiują rotacji ani odzyskiwania kluczy, więc utrata klucza oznacza utratę konta. Opcjonalne
  identyfikatory w postaci `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) są sprawdzane na podstawie
  pliku na serwerze WWW danej domeny.
- **Grupy.** Zalecanym mechanizmem społeczności są grupy oparte na przekaźnikach
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): przekaźnik hostuje grupę,
  egzekwuje jej zasady członkostwa i publikowania przed przyjęciem posta oraz podpisuje jej metadane.
  Starsze społeczności zatwierdzane przez moderatorów
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) są obecnie oznaczone jako
  niezalecane na rzecz NIP-29.
- **Ochrona przed spamem.** Każdy przekaźnik sam wybiera swoją bramę: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), uwierzytelnianie i listy
  dozwolonych ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), płatności lub
  limity częstotliwości. Klienci dodają listy wyciszonych i oceny zaufania.
- **Multimedia.** Obrazy i wideo są przesyłane na osobne serwery plików HTTP.

## Czym się różnią

### Kto przechowuje i udostępnia posty

W Nostr przekaźniki są warstwą przechowywania i dostarczania: jakiś serwer musi utrzymywać każdy post
online. W Bitsocial routery HTTP jedynie pomagają klientom znaleźć peery. Nie przechowują postów,
profili, metadanych społeczności ani stanu moderacji; klienci pobierają treść z węzła społeczności i
od peerów, które ją seedują. Zobacz [Protokół peer-to-peer](/peer-to-peer-protocol/).

### Kto pilnuje bramy

Bramy zapisu w Nostr należą do operatorów przekaźników. Poza grupami NIP-29 klucz odrzucony przez
jeden przekaźnik może opublikować to samo zdarzenie w dowolnym przekaźniku, który je przyjmie, a to,
co widzą czytelnicy, zależy od przekaźników, z których czyta ich klient. Grupa NIP-29 jest bliższa
społeczności Bitsocial: jej przekaźnik macierzysty przyjmuje lub odrzuca posty. Nadal jednak to
przekaźnik określa, co mogą robić role w grupie, a historia grupy pozostaje związana z tym
przekaźnikiem, chyba że inny przekaźnik zgodzi się ją przejąć.

W Bitsocial społeczność jest obiektem kryptograficznym z własną parą kluczy. Węzeł społeczności
uruchamia wyzwanie wybrane przez właściciela i publikuje przyjęty stan do sieci peer-to-peer. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Utrzymanie infrastruktury

Przekaźnik to serwer z domeną i punktem końcowym WebSocket, a popularne przekaźniki ponoszą koszty
przechowywania i transferu tego, co udostępniają. Badanie z 2023 roku szacowało, że około 95%
darmowych przekaźników nie było w stanie pokryć kosztów z darowizn. Węzeł społeczności Bitsocial
działa na sprzęcie konsumenckim, a peery czytające społeczność mogą pomagać ją udostępniać.

### Przeglądarka

Webowy klient Nostr otwiera połączenia WebSocket bezpośrednio z przekaźnikami, więc serwer aplikacji
nie jest potrzebny. Aplikacja webowa Bitsocial uruchamia w karcie węzeł peer-to-peer i pobiera treść
od peerów. Zobacz [Peer-to-peer w przeglądarce](/browser-p2p/).

### Stare treści

Posty Nostr są szeroko replikowane między przekaźnikami, co pomaga starym postom przetrwać. Bitsocial
przechowuje najnowszy stan społeczności i nie gwarantuje starych treści na zawsze.

## Porównanie

| Pytanie                  | Nostr                                                                                                              | Bitsocial                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Kategoria                | Protokół oparty na przekaźnikach                                                                                   | Sieć społeczności peer-to-peer                                                        |
| Tożsamość                | Klucz użytkownika secp256k1, bez rotacji w specyfikacjach                                                          | Pary kluczy Ed25519 dla użytkowników i społeczności                                   |
| Gdzie są posty           | Przekaźniki wybrane przez autora, często liczne                                                                    | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                 |
| Kto utrzymuje dostępność | Operatorzy przekaźników                                                                                            | Węzeł właściciela społeczności plus pomocnicze węzły seedujące                        |
| Społeczności             | Grupy hostowane na przekaźnikach (NIP-29)                                                                          | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                        |
| Ochrona przed spamem     | Polityka każdego przekaźnika: proof-of-work, uwierzytelnianie, płatności, listy dozwolonych, limity częstotliwości | Wyzwanie danej społeczności przed przyjęciem posta                                    |
| Moderacja                | Polityki przekaźników, listy wyciszonych w klientach, etykiety i zgłoszenia                                        | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują |
| Nazwy                    | Opcjonalne identyfikatory w postaci `name@domain`, sprawdzane przez HTTPS                                          | Nazwy `.bso` i `.eth` wskazujące na klucze                                            |
| Przeglądarka             | Klient WebSocket przekaźników                                                                                      | Węzeł peer-to-peer w zwykłej karcie przeglądarki                                      |
| Główny kompromis         | Przenośna tożsamość i szeroka replikacja, ale dostępność i polityka zależne od przekaźników                        | Mniejsza zależność od przekaźników, ale stare treści nie są gwarantowane na zawsze    |
