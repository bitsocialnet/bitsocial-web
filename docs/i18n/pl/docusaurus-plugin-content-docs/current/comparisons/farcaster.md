---
title: Bitsocial i Farcaster
description: Jak Farcaster, z kontami onchain, czynszem za przechowywanie danych i siecią walidatorów Snapchain, wypada w porównaniu ze społecznościami peer-to-peer Bitsocial.
---

# Bitsocial i Farcaster

[Farcaster](https://docs.farcaster.xyz/) trzyma tożsamość na blockchainie, a dane społecznościowe poza
nim. Konta, klucze aplikacji i opłaty za przechowywanie znajdują się w kontraktach na OP Mainnet,
sieci warstwy 2 Ethereum. Posty, nazywane castami, a także obserwacje i reakcje to podpisane
wiadomości przechowywane przez [Snapchain](https://snapchain.farcaster.xyz/), sieć przypominającą
blockchain, która w 2025 roku zastąpiła wcześniejszą sieć Hubów Farcastera.

## Jak działa Farcaster

- **Konta.** Konto to numeryczny identyfikator Farcaster ID należący do adresu Ethereum, który może
  też ustawić adres odzyskiwania. Aplikacje publikują za pomocą delegowanych kluczy aplikacji
  zarejestrowanych onchain; klucz aplikacji nie może przejąć konta.
- **Czynsz za przechowywanie.** Każde konto wynajmuje jednostki przestrzeni, obecnie po 0,20 USD za
  jednostkę rocznie. Jednostka wynajęta od lipca 2025 roku mieści 100 castów; powyżej tej liczby
  najstarsze casty są usuwane. Limity częstotliwości rosną wraz z wynajętą przestrzenią.
- **Snapchain.** Walidatorzy porządkują wiadomości w bloki za pomocą konsensusu w stylu Tendermint, a
  każdy pełny węzeł przechowuje dane całej sieci. Węzły potrzebują około 16 GB RAM i 2 TB przestrzeni
  dyskowej, według [przewodnika po węzłach](https://snapchain.farcaster.xyz/getting-started).
- **Nazwy.** Domyślne nazwy użytkowników, nazywane fnames, są darmowe i wydawane przez własny serwer
  nazw Farcastera, który
  [może je odebrać](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Zamiast tego
  użytkownicy mogą używać nazwy `.eth` zarejestrowanej w Ethereum.
- **Kanały.** Kanały tematyczne to eksperymentalna funkcja klienta Farcaster. Casty w kanale są
  danymi protokołu, ale metadane kanałów, obserwacje i moderacja są
  [przechowywane w kliencie](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Odczyt.** Aplikacje czytają dane przez węzeł Snapchain, który same uruchamiają, albo przez
  zarządzanego dostawcę, zwykle Neynar.

## Czym się różnią

### Blockchainy i walidatorzy

Farcaster zależy od OP Mainnet w kwestii kont i płatności oraz od Snapchain, sieci przypominającej
blockchain, w kwestii porządkowania wszystkich danych społecznościowych. Zestaw walidatorów
Snapchain jest zamknięty (permissioned). Według jego whitepapera cenzura staje się trudna przy około
dziesięciu walidatorach rozproszonych po świecie; w październiku 2026 roku
[lista walidatorów](https://snapchain.farcaster.xyz/validators) była krótsza, a większość kluczy
należała do firmy Neynar, która
[przejęła Farcastera](https://neynar.com/blog/neynar-is-acquiring-farcaster) w styczniu 2026 roku.
Bitsocial nie ma łańcucha, walidatorów ani konsensusu.

### Płacenie za publikowanie

Każde konto Farcaster płaci czynsz za przechowywanie, a wynajęta przestrzeń ogranicza, ile historii
konta sieć zachowuje. W Bitsocial publikowanie nic nie kosztuje na poziomie protokołu; każda
społeczność decyduje, czy wymagać captchy, płatności, tokena czy czegoś innego. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Społeczności

Kanały Farcaster to funkcja klienta: klient przechowuje ich metadane i egzekwuje moderację kanałów,
więc cast zablokowany w kanale może pozostać ważny w sieci i widoczny w innych aplikacjach. W
Bitsocial społeczności to obiekty protokołu z własną parą kluczy, a węzeł społeczności przyjmuje lub
odrzuca posty.

### Utrzymanie infrastruktury

Węzeł Farcaster przechowuje całą sieć, więc zajmowana przez niego przestrzeń rośnie wraz z całą
aktywnością; Farcaster prognozuje wzrost w stronę największych dysków w chmurze. Węzeł społeczności
Bitsocial przechowuje tylko własne społeczności i działa na sprzęcie konsumenckim.

### Przeglądarka

Przeglądarkowa aplikacja Farcaster jest klientem HTTP węzła lub dostawcy. Aplikacja webowa Bitsocial
może uruchomić węzeł peer-to-peer w karcie. Zobacz [Peer-to-peer w przeglądarce](/browser-p2p/).

## Porównanie

| Pytanie                  | Farcaster                                                                                   | Bitsocial                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategoria                | Tożsamość onchain z danymi społecznościowymi porządkowanymi przez walidatorów               | Sieć społeczności peer-to-peer                                                                        |
| Tożsamość                | Farcaster ID należący do adresu Ethereum, z delegowanymi kluczami aplikacji                 | Pary kluczy Ed25519 dla użytkowników i społeczności                                                   |
| Gdzie są posty           | Snapchain, replikowany na każdym pełnym węźle, w granicach opłaconej przestrzeni            | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                                 |
| Kto utrzymuje dostępność | Walidatorzy Snapchain i operatorzy węzłów                                                   | Węzeł właściciela społeczności plus pomocnicze węzły seedujące                                        |
| Społeczności             | Eksperymentalne kanały zarządzane przez klienta Farcaster                                   | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                                        |
| Ochrona przed spamem     | Czynsz za przechowywanie i limity częstotliwości, plus etykiety spamu na poziomie aplikacji | Wyzwanie danej społeczności przed przyjęciem posta                                                    |
| Moderacja                | Gospodarze kanałów w kliencie, filtry aplikacji, ryzyko cenzury na poziomie walidatorów     | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują                 |
| Nazwy                    | Darmowe fnames, które Farcaster może odebrać, lub nazwy `.eth`                              | Nazwy `.bso` i `.eth` wskazujące na klucze                                                            |
| Przeglądarka             | Klient HTTP węzła lub dostawcy                                                              | Węzeł peer-to-peer w zwykłej karcie przeglądarki                                                      |
| Główny kompromis         | Jeden spójny globalny zbiór danych, ale czynsz, łańcuchy i mały zestaw walidatorów          | Bez opłat i łańcuchów, ale bez globalnego zbioru danych, a stare treści nie są gwarantowane na zawsze |
