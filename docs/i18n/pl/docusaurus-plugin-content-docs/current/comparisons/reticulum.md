---
title: Bitsocial i Reticulum
description: Jak Reticulum, kryptograficzny stos sieciowy dla LoRa i innych łączy o niskiej przepustowości, wypada w porównaniu z Bitsocial i czy Bitsocial mógłby przez niego działać.
---

# Bitsocial i Reticulum

[Reticulum](https://reticulum.network/) to oparty na kryptografii stos sieciowy do budowania sieci
na dowolnych dostępnych nośnikach: radiach LoRa, packet radio, łączach szeregowych, Wi-Fi,
Ethernecie, TCP, UDP czy I2P. Pojawia się w rozmowach obok Bitsocial, ponieważ oba usuwają firmę
pośredniczącą. Robią to jednak na różnych warstwach, więc raczej się uzupełniają, niż ze sobą
konkurują.

## Różne warstwy

Reticulum zastępuje warstwę sieciową. Daje aplikacjom szyfrowane, routowalne punkty końcowe bez
adresów IP, DNS, urzędów certyfikacji ani kont i jest zaprojektowany tak, by działać nawet na łączach
o przepustowości zaledwie 5 bitów na sekundę i MTU wynoszącym 500 bajtów. Nie definiuje postów,
społeczności ani moderacji; dodają je aplikacje zbudowane na jego bazie.

Bitsocial jest protokołem społecznościowym. Działa na stosie IPFS/libp2p przez zwykłe połączenia
internetowe, także z karty przeglądarki, i definiuje społeczności, publikacje oraz wyzwania
antyspamowe ustalane osobno dla każdej społeczności. Zobacz
[Protokół peer-to-peer](/peer-to-peer-protocol/) i [Peer-to-peer w przeglądarce](/browser-p2p/).

W stosie Bitsocial Reticulum znalazłby się mniej więcej tam, gdzie libp2p, a nie tam, gdzie protokół
Bitsocial.

## Jak działa Reticulum

- **Tożsamości.** Tożsamość w Reticulum to 512-bitowy zestaw kluczy: klucz X25519 do szyfrowania i
  klucz Ed25519 do podpisów.
- **Miejsca docelowe.** Aplikacje tworzą miejsca docelowe (destinations), adresowane hashem SHA-256
  skróconym do 16 bajtów. Pakiety nie zawierają adresu źródłowego.
- **Ogłoszenia.** Miejsce docelowe staje się osiągalne po wysłaniu ogłoszenia (announce). Węzły
  transportowe przekazują je dalej i zapamiętują następny przeskok z powrotem, więc żaden węzeł nie
  potrzebuje mapy całej sieci.
- **Szyfrowanie.** Ruch jest domyślnie szyfrowany, z kluczami efemerycznymi i utajnianiem z
  wyprzedzeniem (forward secrecy).
- **LXMF.** Warstwa komunikacyjna [LXMF](https://github.com/markqvist/LXMF) dodaje podpisane
  wiadomości, bezpośrednie doręczanie oraz przechowywanie i przekazywanie dalej (store-and-forward)
  przez węzły propagacyjne dla odbiorców, którzy są offline.

Aplikacje zbudowane w ten sposób to m.in. [Sideband](https://github.com/markqvist/Sideband) do
komunikacji i [Nomad Network](https://github.com/markqvist/NomadNet) do komunikacji oraz hostowania
stron. Podręcznik Reticulum prowadzi [listę programów](https://reticulum.network/manual/software.html).

## Porównanie

| Pytanie                 | Reticulum                                                                                                        | Bitsocial                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Czym jest               | Stos sieciowy                                                                                                    | Protokół społecznościowy peer-to-peer i aplikacje                                             |
| Przeznaczenie           | Dowolny nośnik, aż po wolne łącza radiowe                                                                        | Połączenia internetowe, w tym karty przeglądarki                                              |
| Tożsamość               | Zestaw kluczy X25519 i Ed25519                                                                                   | Pary kluczy Ed25519 dla użytkowników i społeczności                                           |
| Adresy                  | Hash tożsamości i nazwy aplikacji                                                                                | Hash klucza publicznego społeczności                                                          |
| Znajdowanie peera       | Ogłoszenia rozsyłane przez węzły transportowe                                                                    | Routery HTTP zwracają peery udostępniające treść                                              |
| Funkcje społecznościowe | Dodawane przez aplikacje, takie jak Nomad Network                                                                | Społeczności, posty, odpowiedzi i moderacja w protokole                                       |
| Ochrona przed spamem    | Limity częstotliwości ogłoszeń na interfejs; znaczki proof-of-work LXMF, których może wymagać odbiorca lub węzeł | Wyzwanie danej społeczności przed przyjęciem posta                                            |
| Doręczanie offline      | Węzły propagacyjne LXMF przechowują i przekazują dalej wiadomości                                                | Peery nadal serwują najnowszy stan społeczności; publikowanie wymaga, by jej węzeł był online |

## Czy Bitsocial mógłby działać przez Reticulum?

Obecnie nie. Bitsocial nie ma transportu Reticulum, a jego model danych zakłada przepustowość
internetową: klient pobiera od peerów metadane społeczności i treść postów oraz wymienia wiadomości
pubsub, co słabo pasuje do łączy zbudowanych wokół 500-bajtowych pakietów i przepustowości mierzonej
w bitach lub kilobitach na sekundę.

Realistyczna droga jest węższa: klient, który działa przez lokalną sieć mesh, gdy nie ma połączenia,
a potem synchronizuje się z szerszą siecią Bitsocial, gdy osiągalny jest peer lub brama z dostępem
do internetu. Byłby to nowy klient i most, a nie zmiana w protokole, i nie ma tego w obecnej
roadmapie.

## Dla deweloperów

Reticulum jest udostępniany na licencji
[Reticulum License](https://reticulum.network/manual/license.html): warunki w stylu MIT plus dwa
ograniczenia. Oprogramowania nie wolno używać w systemach zaprojektowanych do wyrządzania krzywdy
ludziom ani do tworzenia zbiorów danych treningowych dla AI lub uczenia maszynowego. Przeczytaj
licencję, zanim dołączysz kod Reticulum do aplikacji Bitsocial.

Implementacja referencyjna jest [napisana w Pythonie](https://github.com/markqvist/Reticulum).
Opiekunowie Reticulum ostrzegają, że kilka nieoficjalnych portów Reticulum i LXMF zostało
wygenerowanych maszynowo i zawiera deklaracje licencyjne, które uważają za nieważne, dlatego lepiej
wybierać implementację referencyjną lub programy wymienione w podręczniku.
