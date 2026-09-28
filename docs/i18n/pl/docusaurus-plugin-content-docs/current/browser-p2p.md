---
title: Peer-to-peer w przeglądarce
description: Jak aplikacja internetowa Bitsocial uruchamia prawdziwy węzeł libp2p w karcie przeglądarki, z jakich transportów korzysta i jaka poprawka w projekcie nadrzędnym sprawiła w 2026 roku, że publikowanie z karty zaczęło działać.
---

# Peer-to-peer w przeglądarce

Aplikacja internetowa Bitsocial nie musi być klientem czyjegoś serwera. Może uruchomić węzeł
[Helia](https://helia.io/) wewnątrz karty przeglądarki, dołączyć do tej samej sieci peer-to-peer, w
której działają węzły desktopowe i CLI, pobierać treści społeczności od innych peerów i publikować
przez pubsub.

Ta strona wyjaśnia, co to faktycznie oznacza, z jakich transportów korzysta, czego nadal nie potrafi
i dlaczego publikowanie z karty przeglądarki zaczęło działać dopiero w 2026 roku.

Szersze omówienie architektury sieci znajdziesz na stronie [Protokół peer-to-peer](/peer-to-peer-protocol/).

## Co działa w karcie przeglądarki

Gdy P2P w przeglądarce jest aktywne, strona utrzymuje prawdziwy węzeł libp2p:

- nawiązuje połączenia z innymi peerami przez bezpieczne WebSockets
- pobiera i weryfikuje treści społeczności od tych peerów, a nie z bramy IPFS
- uczestniczy w gossipsub, więc opublikowanie posta nie wymaga hostowanego dostawcy pubsub
- korzysta z tego samego stosu klienta protokołu (`pkc-js`) co każda inna aplikacja Bitsocial

W praktyce oznacza to, że między czytelnikiem w przeglądarce a społecznością nie stoi żaden operator
bramy. Nie ma jednego punktu końcowego HTTPS, który dałoby się nakłonić do odcięcia społeczności
wszystkim użytkownikom przeglądarek naraz.

## Jak łączą się węzły w przeglądarce

`pkc-js` łączy się z peerami przez **bezpieczne WebSockets**. Połączenia WebRTC i WebTransport są
domyślnie odrzucane przez connection gater, ponieważ w przeglądarce wprowadzają długie i często
zawodne ścieżki zestawiania połączenia — negocjację STUN/ICE, rotację certhash — które spowalniają
ładowanie strony, podczas gdy WebSocket daje bezpośredni i niezawodny transport. Kod, który
świadomie chce użyć WebRTC lub WebTransport, może nadpisać gater przez
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

W praktyce peer w przeglądarce łączy się z węzłami udostępniającymi punkt końcowy WSS, co oznacza,
że takie węzły potrzebują domeny i certyfikatu podpisanego przez CA. Peery działające na łączach
konsumenckich bez takiego zaplecza są osiągane pośrednio, a nie przez bezpośrednie połączenie z karty.

## Dlaczego publikowanie z przeglądarki zaczęło działać dopiero w 2026 roku

Peer-to-peer w przeglądarce nie jest nowym pomysłem. W 2026 roku zmieniło się to, że _posty_ węzła
działającego w przeglądarce zaczęły docierać do reszty sieci.

Specyfikacja pubsub w libp2p wymaga, aby `seqno` wiadomości było liniowo rosnącą 64-bitową liczbą
całkowitą w porządku big-endian. `js-libp2p-gossipsub` generował zamiast tego 8 losowych bajtów,
podczas gdy go-libp2p-pubsub i rust-libp2p używały licznika. Kubo 0.40+ domyślnie włącza
`BasicSeqnoValidator`, który odrzuca każdą wiadomość o seqno nie większym niż najwyższe już
odnotowane od danego peera.

Skutek był taki, że większość wiadomości publikowanych przez węzeł JavaScript — w tym węzeł w
przeglądarce — była po cichu odrzucana przez peery Kubo. W przykładzie odtwarzającym problem
docierały od 2 do 8 z 30 wiadomości.

Zdiagnozowano to w
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) i naprawiono w
**`@libp2p/gossipsub` 15.0.21** w maju 2026 roku. Zanim poprawka trafiła do wydania, węzeł w
przeglądarce mógł się połączyć i czytać, ale jego posty w większości ginęły w drodze do peerów Go.
`pkc-js` dostarcza `@libp2p/gossipsub` w wersji 16.0.4, czyli już po tej poprawce.

## Czego węzeł w przeglądarce nadal nie potrafi

Węzeł w przeglądarce jest prawdziwym peerem, ale nie serwerem. Ma inne ograniczenia niż węzeł
desktopowy czy węzeł działający bez przerwy:

- zwykle nie może przyjmować dowolnych połączeń przychodzących z publicznego internetu
- działa tylko dopóki karta jest otwarta, więc nie jest trwałym hostem danych społeczności
- nie może dołączyć do DHT libp2p, dlatego odkrywanie odbywa się przez routery HTTP
- słabo nadaje się do seedowania na dużą skalę

Pełny hosting społeczności nadal najlepiej powierzyć aplikacji desktopowej, `bitsocial-cli` albo
innemu stale dostępnemu węzłowi. P2P w przeglądarce zmienia to, kto może _czytać i publikować_ bez
bramy; nie znosi potrzeby istnienia peerów, które pozostają online.

## Routery HTTP to nie bramy

Klienci w przeglądarce nadal odpytują [routery HTTP](/peer-to-peer-protocol/#public-key-based-addressing),
aby ustalić, które peery udostępniają obecnie adres danej społeczności. To uczciwy przypis do hasła
„czysty peer-to-peer w przeglądarce” i warto opisać go precyzyjnie:

- router przechowuje wyłącznie adresy peerów przypisane do adresu treści
- nie przechowuje ani nie serwuje treści społeczności, a nawet jej nie zna
- klienci odpytują kilka routerów równolegle i łączą wyniki
- każdy może uruchomić własny, a zmiana routera to zmiana konfiguracji bez migracji danych

Po etapie odkrywania transfer treści i ruch pubsub odbywają się peer-to-peer. Zniknięcie routera
kosztuje cię ścieżkę wyszukiwania, a nie dane. Brama IPFS leży natomiast na ścieżce samej treści.

## Gdzie działa to dzisiaj

- [5chan](/apps/5chan/) domyślnie działa w trybie czystego P2P w przeglądarce w aplikacji
  internetowej pod adresem [5chan.app](https://5chan.app).

## Awaryjne przejście na bramę

Dostęp przez bramę nadal istnieje jako ścieżka zgodności dla przeglądarek i sieci, które nie mogą
dołączyć bezpośrednio. Zobacz [Awaryjne przejście na bramę](/peer-to-peer-protocol/#gateway-fallback).
Docelowa architektura to przede wszystkim P2P w przeglądarce, z bramami jako opcjonalnym
rozwiązaniem awaryjnym, a nie domyślnym wąskim gardłem.
