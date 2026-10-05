---
title: Bitsocial i Mirage
description: Jak Mirage, forum w stylu Reddita działające na własnym blockchainie Cosmos SDK, wypada w porównaniu z Bitsocial i jego aplikacją w stylu Reddita, Seedit.
---

# Bitsocial i Mirage

[Mirage](https://mirage.foundation/) to sieć dyskusyjna w stylu Reddita ze społecznościami, postami w
wątkach i głosowaniem. Zamiast firmowej bazy danych działa na własnym blockchainie, łańcuchu Cosmos
SDK z konsensusem CometBFT. Najbliższym produktem Bitsocial jest [Seedit](/apps/seedit/), aplikacja w
stylu Reddita działająca w sieci Bitsocial, więc porównanie dotyczy głównie tego, jak każdy z
projektów hostuje społeczności, kto jest ich właścicielem i jak są moderowane.

## Jak działa Mirage

- **Węzły.** Węzeł Mirage to jeden kontener Docker z walidatorem, bazą danych PostgreSQL,
  indekserem, API HTTP i frontendem webowym. Każdy węzeł jest też walidatorem. Uruchomienie węzła
  wymaga serwera Ubuntu na amd64 i 10 000 000 tokenów MIRAGE na koncie operatora, według
  [przewodnika wdrożeniowego](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publikowanie.** Przeglądarka podpisuje każdą akcję kluczem secp256k1 użytkownika, a użytkownicy
  darmowi dodatkowo obliczają niewielki proof-of-work. Węzeł opakowuje akcję w transakcję łańcucha i
  płaci opłatę.
- **Odczyt.** Indekser każdego węzła kopiuje dane łańcucha do własnej bazy i udostępnia feedy przez
  API HTTP. Węzły przechowują bloki z około tygodnia, więc długoterminowa historia postów znajduje się
  w bazie każdego węzła, a nowy węzeł startuje bez historii sprzed swojego punktu synchronizacji.
- **Konta.** Konto to klucz wyprowadzony z 12-wyrazowej frazy seed, a ta sama fraza działa na każdym
  węźle. Nazwy użytkowników są zapisywane w łańcuchu i są unikalne w całej sieci.
- **Społeczności.** Każda poprawna nazwa jest już społecznością i nikt nie jest jej właścicielem.
  Płatne zespoły kuratorów liczące do dziesięciu użytkowników utrzymują każdy własny moderowany widok
  społeczności; czytelnicy wybierają widok zespołu, domyślny widok węzła lub widok bez cenzury. Zobacz
  [FAQ Mirage](https://mirage.talk/faq).
- **Token.** Token MIRAGE służy do płacenia za subskrypcje, nagradza autorów i węzły oraz daje
  walidatorom wagę w zarządzaniu. Subskrybenci pomijają proof-of-work i mają wyższe limity.

## Czym się różnią

### Kto jest właścicielem społeczności

W Seedit twórca społeczności trzyma jej parę kluczy, uruchamia jej węzeł lub go deleguje i ją
moderuje. W Mirage nikt nie jest właścicielem społeczności: konkurujące zespoły kuratorów oferują
moderowane widoki tej samej nazwy, a domyślnym widokiem jest widok zespołu wybranego przez
największą liczbę płacących subskrybentów.

### Ochrona przed spamem

Mirage stosuje jedną regułę w całej sieci: darmowi użytkownicy płacą proof-of-work, którego trudność
dostosowuje się do napływającego ruchu, a subskrybenci go pomijają. W Bitsocial każda społeczność
wybiera własne wyzwanie, od captchy przez listy dozwolonych po płatności. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Infrastruktura

Mirage potrzebuje blockchaina. Walidatorzy osiągają konsensus co do każdej akcji, a każdy węzeł
uruchamia pełny stos serwerowy i musi utrzymywać duży stake tokenów. Bitsocial nie ma łańcucha: węzeł
społeczności działa na sprzęcie konsumenckim z aplikacji desktopowej lub `bitsocial-cli`, a
czytelnicy mogą pomagać w udostępnianiu treści.

### Kontrola nad całą siecią

Mirage ma zarządzanie onchain ważone wielkością stake'u walidatorów. Może ono zmieniać trudność, ceny
i emisję tokenów, wybijać lub spalać tokeny oraz powoływać administratorów, których usunięcia
indekser referencyjny stosuje do dowolnego posta. Kod łańcucha pozwala też zarządzaniu
[usuwać konta](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
i
[wysyłać tokeny z dowolnego adresu](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
W październiku 2026 roku bloki łańcucha produkowało czterech walidatorów, a wszystkimi czterema
zarządzały runbooki samego projektu.

Bitsocial nie ma administratora na poziomie protokołu. Właściciele społeczności moderują własne
społeczności, a aplikacje wybierają, co pokazują. Zobacz
[Lokalna moderacja, a nie globalne zakazy](/local-moderation/).

### Przeglądarka

Klient webowy Mirage jest klientem HTTP węzła: przeglądarka podpisuje akcje, ale nie dołącza do sieci
peer-to-peer. Aplikacje Bitsocial mogą uruchamiać węzeł peer-to-peer w karcie przeglądarki. Zobacz
[Peer-to-peer w przeglądarce](/browser-p2p/).

## Porównanie

| Pytanie                  | Mirage                                                                                                                            | Bitsocial                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Kategoria                | Forum na własnym blockchainie (Cosmos SDK)                                                                                        | Sieć społeczności peer-to-peer                                                                                 |
| Tożsamość                | Klucz secp256k1 z 12-wyrazowej frazy seed, z nazwą użytkownika w łańcuchu                                                         | Pary kluczy Ed25519 dla użytkowników i społeczności                                                            |
| Gdzie są posty           | Transakcje łańcucha, a potem baza PostgreSQL każdego węzła                                                                        | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                                          |
| Kto utrzymuje dostępność | Węzły walidatorów, z których każdy trzyma 10 000 000 MIRAGE                                                                       | Węzeł właściciela społeczności plus pomocnicze węzły seedujące                                                 |
| Społeczności             | Nazwy bez właściciela z konkurującymi płatnymi zespołami kuratorów                                                                | Należą do pary kluczy; węzeł właściciela przyjmuje lub odrzuca posty                                           |
| Ochrona przed spamem     | Proof-of-work w całej sieci; subskrybenci go pomijają                                                                             | Wyzwanie danej społeczności przed przyjęciem posta                                                             |
| Moderacja                | Widoki zespołów kuratorów, filtry osobiste, administratorzy powoływani przez zarządzanie                                          | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują                          |
| Ekonomia                 | Token MIRAGE do subskrypcji, nagród i stake'u walidatorów                                                                         | Brak w protokole; wyzwanie może wymagać płatności lub tokena                                                   |
| Przeglądarka             | Klient HTTP węzła                                                                                                                 | Węzeł peer-to-peer w zwykłej karcie przeglądarki                                                               |
| Główny kompromis         | Jeden wspólny, uporządkowany stan i łatwa rejestracja, ale mały zestaw walidatorów i uprawnienia zarządzania obejmujące całą sieć | Nie trzeba łańcucha ani stake'u, ale nie ma globalnej kolejności, a stare treści nie są gwarantowane na zawsze |
