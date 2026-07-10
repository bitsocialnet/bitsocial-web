---
title: Kompletne wyjaśnienie protokołu Bitsocial dla laika
description: Prosty przewodnik po społecznościach Bitsocial, wyszukiwanie peerów, publikowanie, wyzwania antyspamowe, moderacja i aplikacje.
---

# Kompletne wyjaśnienie protokołu Bitsocial dla laika

Ta strona wyjaśnia Bitsocial bez zakładania, że ​​znasz już sieci peer-to-peer, klucze kryptograficzne, IPFS lub pubsub.

Niektóre szczegóły zostały celowo uproszczone. Bardziej techniczną wersję znajdziesz na stronie [Protokół Peer-to-Peer](./peer-to-peer-protocol.md).

## Krótka wersja

Bitsocial to protokół dla aplikacji społecznościowych, w których społeczności są własnością kluczy, a nie firmowej bazy danych.

Społeczność Bitsocial ma adres. Aplikacje używają tego adresu do wyszukiwania równorzędnych użytkowników obsługujących społeczność, pobierania najnowszych postów od tych równorzędnych i publikowania nowych postów za pośrednictwem kanału wiadomości peer-to-peer. Zanim post zostanie zaakceptowany, społeczność może wymagać wyzwania antyspamowego, takiego jak captcha, kod zaproszenia, płatność, sprawdzenie tokena, sprawdzenie moderacji AI, lista dozwolonych lub inna reguła, którą można zakodować.

Oto podstawowa idea:

1. Społeczność jest kontrolowana za pomocą klucza prywatnego.
2. Klucz publiczny zapewnia społeczności stabilny adres.
3. Współpracownicy pomagają czytelnikom znaleźć i pobrać społeczność.
4. Węzeł społeczności akceptuje lub odrzuca nowe posty.
5. Polityka antyspamowa należy do każdej społeczności, a nie do jednej globalnej platformy.

## Dlaczego skróty mają znaczenie

Hash to krótki odcisk palca dla danych.

Jeśli dwie osoby zaszyfrują dokładnie ten sam plik, otrzymają ten sam odcisk palca. Jeśli plik się zmieni, odcisk palca ulegnie zmianie. To sprawia, że ​​skróty są przydatne do wyszukiwania i sprawdzania danych bez ufania firmie, która powie Ci, jaki to plik.

Systemy peer-to-peer stale korzystają z tego pomysłu. Zamiast pytać jedną witrynę o „plik o nazwie photo.png”, inny użytkownik może poprosić sieć o dane z określonym odciskiem palca. Jeśli inny peer zwróci nieprawidłowe dane, sprawdzenie skrótu zakończy się niepowodzeniem.

Bitsocial używa skrótów i identyfikatorów treści do danych postów i innych elementów stanu społeczności. Ważna kwestia jest prosta: dane można rozpatrywać na podstawie tego, czym są, a nie tylko tego, gdzie firma je hostowała.

## Dlaczego klucze publiczne mają znaczenie

Klucz publiczny i klucz prywatny stanowią dopasowaną parę.

Klucz prywatny jest tajny. To jest to, co daje kontrolę. Klucz publiczny można bezpiecznie udostępniać. Pozwala wszystkim innym sprawdzić, czy wiadomość, aktualizacja lub akcja moderacyjna rzeczywiście pochodzi z pasującego klucza prywatnego.

W ten sposób Bitsocial unika zwykłych kont na platformie. Firma nie musi wydawać tożsamości. Wiersz bazy danych nie musi definiować właściciela. Para kluczy to autorytet.

W prostych słowach:

- klucz prywatny to uchwyt kontrolny właściciela
- klucz publiczny to tożsamość publiczna lub adres
- podpisy świadczą o tym, że działanie wyszło od właściciela

## Czym jest społeczność Bitsocial

Społeczność Bitsocial to nie tylko strona w jednej aplikacji.

Ma własną parę kluczy. Klucz publiczny zapewnia społeczności stabilny adres sieciowy. Klucz prywatny kontroluje aktualizacje stanu społeczności, takie jak metadane, reguły, lista moderatorów, konfiguracja wyzwań i wskaźniki do ostatnio zaakceptowanych treści.

Oznacza to, że społeczność może przetrwać jeden interfejs. Jedna aplikacja może pokazać to jako tablicę. Inna aplikacja może wyświetlić to jako forum. Przyszła aplikacja będzie mogła wyświetlać to w kanale opartym na profilu. Aplikacja może się zmienić, ale adres społeczności nadal wskazuje na tę samą społeczność, której właścicielem jest ta sama społeczność.

## Jak działa czytanie

Kiedy użytkownik otwiera społeczność Bitsocial, aplikacja nie pyta jednej centralnej bazy danych o stronę.

Przepływ jest bliższy temu:

1. Aplikacja zna już adres społeczności lub pobiera go z listy, łącza, obszaru wyszukiwania lub
   nazwa czytelna dla człowieka.
2. Aplikacja pyta lekkie routery, które urządzenia równorzędne udostępniają obecnie ten adres społeczności.
3. Routery zwracają tylko adresy równorzędne. Nie zwracają postów, zasad, profili ani społeczności
   metadane.
4. Aplikacja łączy się z urządzeniami równorzędnymi i pobiera najnowszy stan społeczności.
5. Ten stan zawiera wskazówki umożliwiające opublikowanie treści.
6. Aplikacja pobiera treść postów od innych użytkowników i wyświetla ją w normalnym interfejsie społecznościowym.

Router jest jedynie pomocnikiem w wyszukiwaniu. Bliżej jest do pytania „kto to ma?” niż pytanie „proszę o udostępnienie całej witryny”.

Więcej szczegółów na temat tego podziału znajdziesz w artykule [Odkrywanie treści](./content-discovery.md).

## Jak działa wysyłanie

Publikowanie różni się od czytania tym, że otwarte sieci peer-to-peer mogą być spamowane.

Bitsocial obsługuje publikację poprzez przepływ wyzwanie-odpowiedź:

1. Użytkownik pisze post lub odpowiedź.
2. Aplikacja dołącza do tematu wiadomości peer-to-peer społeczności.
3. Aplikacja prosi węzeł społeczności o wyzwanie.
4. Węzeł społeczności odsyła wyzwanie.
5. Użytkownik lub aplikacja kończy wyzwanie.
6. Aplikacja wyśle ​​posta wraz z odpowiedzią na wyzwanie.
7. Węzeł społeczności sprawdza odpowiedź i post.
8. Jeśli zakończy się pomyślnie, węzeł społeczności zaakceptuje wpis w następnej aktualizacji społeczności.
9. Inni czytelnicy pobierają zaktualizowany stan społeczności od partnerów.

Wyzwanie ma miejsce, zanim post stanie się częścią zaakceptowanego stanu społeczności. Na tym właśnie polega istotna różnica w porównaniu z systemami, w których spam jest najpierw akceptowany, a następnie ukrywany.

## Dlaczego wyzwania antyspamowe są ważne

Większość platform społecznościowych przekształca ochronę antyspamową w politykę platformy. Jedna firma decyduje, co liczy się jako ważne konto, ważny post, prawidłowy zasięg lub ważny użytkownik.

Bitsocial oddziela te rzeczy. Protokół umożliwia społecznościom zażądanie wyzwania przed zaakceptowaniem postu, ale nie zmusza każdej społeczności do skorzystania z tego samego wyzwania.

Jedna społeczność może używać captcha. Inny może użyć kodów zaproszenia. Inny może wymagać czeku SMS, płatności, NFT, salda tokenów, wyniku moderacji AI, potwierdzenia reputacji, listy dozwolonych specyficznej dla społeczności lub reguły niestandardowej.

Ta elastyczność ma znaczenie, ponieważ spam się zmienia. Reguła dotycząca spamu na poziomie protokołu staje się nieaktualna. Wyzwanie na poziomie społeczności może ewoluować bez migracji całej sieci.

Bardziej szczegółowe wyjaśnienie można znaleźć w artykule [Niestandardowe wyzwania modułu Anti-Spam](./custom-challenges.md).

## Jak działa umiar

Bitsocial nie jest wolny od moderacji. To moderacja bez jednego globalnego superadministratora.

Społeczność może mieć właścicieli i moderatorów. Adresy moderatorów są częścią stanu społeczności. Gdy moderator podejmie jakąś akcję, może ona zostać podpisana. Węzeł społeczności i klienci mogą sprawdzić podpis na liście moderatorów.

Dzięki temu moderacja ma zasięg lokalny:

- właściciel społeczności kontroluje tę społeczność
- moderatorzy działają za pomocą kluczy rozpoznawanych przez społeczność
- aplikacje nadal mogą wybierać, co indeksują, oceniają, ukrywają lub wyróżniają
- żadne konto firmowe na poziomie protokołu nie jest w stanie wymazać każdej tożsamości ani przejąć każdej społeczności

W praktyce oznacza to, że społeczność może usuwać spam lub egzekwować zasady we własnej przestrzeni, nie zmieniając swoich zasad w prawo obowiązujące w całej sieci.

Aby zapoznać się z zasadami, przeczytaj [Lokalna moderacja, a nie globalne bany](./local-moderation.md).

## Jakie aplikacje dodają

Protokół nie decyduje o tym, jak powinien wyglądać cały produkt.

Aplikacja dodaje ludzkie doświadczenie wokół protokołu:

- domyślne listy społeczności
- poszukiwanie i odkrywanie
- kanały i rankingi
- układ i interfejs wysyłania
- obsługa multimediów
- narzędzia moderacyjne
- opakowania mobilne, stacjonarne lub przeglądarkowe
- model biznesowy i wartości domyślne

Dlatego Bitsocial może obsługiwać różne style aplikacji. 5chan może przypominać tablicę obrazkową. Seedit może przypominać dyskusję w stylu forum. Inni klienci mogą tworzyć różne powierzchnie odkrywania, systemy rankingowe, widoki moderacji lub domyślne ustawienia społeczności, jednocześnie korzystając z kompatybilnych społeczności Bitsocial.

Protokół zapewnia przenośność własności i publikacji. Aplikacje konkurują jakością produktu.

## Co dodaje publiczne RPC

Bezpośrednie uruchomienie węzła społeczności peer-to-peer daje duże możliwości, ale nie każdy chce zarządzać zawsze aktywną maszyną.

Publiczny RPC to warstwa usług, która może uczynić Bitsocial wygodniejszym. Publiczny dostawca RPC może pomóc użytkownikom zarządzać społecznościami za pomocą telefonu lub lekkiego klienta, podczas gdy długoterminowy model własności powinien nadal pozwalać użytkownikom na przeprowadzkę, samodzielne hostowanie lub wybór konkurencyjnego dostawcy.

Rozróżnienie ma znaczenie:

- RPC może pomóc w zapewnieniu dostępności i wygody
- RPC nie powinno stać się opieką stałą
- relacja właściciela powinna pozostać powiązana z kluczami, a nie z bazą danych jednego dostawcy

## Czym Bitsocial nie jest

Bitsocial nie jest siecią społecznościową typu blockchain. Media społecznościowe nie potrzebują, aby każdy post stał się transakcją w jednym globalnym rejestrze.

Bitsocial nie jest federacją w sensie ActivityPub. Społeczność nie musi być kontem na jednym serwerze z jedną domeną, jednym administratorem i jedną bazą danych serwera.

Bitsocial także nie jest jedną aplikacją. Jest to współdzielona warstwa protokołu dla aplikacji, społeczności, węzłów, routerów, dostawców RPC, usług wykrywania, modułów antyspamowych i narzędzi moderacyjnych.

Nie chodzi o to, że każdy użytkownik musi to wszystko zrozumieć przed opublikowaniem. Chodzi o to, że produkt może sprawiać wrażenie normalnego, podczas gdy model własności pod nim jest inny.

## Gdzie iść dalej

- [Protokół Peer-to-Peer](./peer-to-peer-protocol.md) wyjaśnia przepływ techniczny.
- [Odkrywanie treści](./content-discovery.md) wyjaśnia wyszukiwanie w sieci i wybór aplikacji.
- [Niestandardowe wyzwania modułu Anti-Spam](./custom-challenges.md) wyjaśniają system wyzwań.
- [Tożsamość i własność społeczności](./identity-and-ownership.md) wyjaśnia kontrolę kluczem
  własność.
- [Zbuduj własnego klienta](/build-your-own-client/) wyjaśnia, w jaki sposób niezależne aplikacje mogą wykorzystywać
  ta sama sieć.
