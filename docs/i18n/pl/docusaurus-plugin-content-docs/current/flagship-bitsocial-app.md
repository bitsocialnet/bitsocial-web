---
title: Zdecentralizować Twitter/X
description: "Faza 3 planu głównego: wyspecjalizowana, zdecentralizowana alternatywa dla Twitter/X do publicznych rozmów opartych przede wszystkim na tekście, z wymienną infrastrukturą."
---

# Zdecentralizować Twitter/X

Faza 3 zakłada zbudowanie wyspecjalizowanej, zdecentralizowanej alternatywy dla Twitter/X. Jej centrum stanowi publiczna rozmowa oparta przede wszystkim na tekście: krótkie posty, odpowiedzi, reposty, obserwowanie, dyskusje w czasie rzeczywistym i społeczności, przy otwartej warstwie platformy.

Twitter/X nadal definiują posty, tekst i dzielenie się pomysłami. Klient fazy 3 powinien konkurować właśnie tym podstawowym doświadczeniem i sprawić, by działało wyjątkowo dobrze.

Ta strona opisuje kierunek produktu, a nie zamkniętą specyfikację wydania. Dokładny interfejs, domyślny kanał, model reklam, funkcje AI i rynek RPC mogą się zmieniać wraz z dojrzewaniem protokołu i pierwszych aplikacji.

## Co ma udowodnić

Klient powinien dowieść, że sieć społecznościowa oparta na profilach może uniknąć stania się platformą, która przejmuje kontrolę nad tożsamościami i profilami użytkowników:

- użytkownicy mogą posiadać tożsamości i profile
- społeczności i węzły profili mogą pozostać w trybie peer-to-peer
- społeczności mogą przenosić efekty sieciowe pomiędzy klientami Bitsocial
- Dostawcy RPC mogą sprawić, że aplikacja będzie wygodna, bez przejmowania kontroli nad tożsamością ani profilem użytkownika
- Algorytmy kanałów mogą być usługami opcjonalnymi, a nie przepisami dotyczącymi platformy
- inni klienci mogą nadal konkurować o tę samą sieć

Chodzi o zbudowanie możliwie najlepszego klienta do publicznej rozmowy i pokazanie, jak daleko może sięgnąć protokół.

## Znajomy cel, wymienna konstrukcja

Domyślne doświadczenie powinno konkurować z tym, co najważniejsze w Twitter/X: szybkim kanałem głównym, postami tekstowymi, obserwowaniem, odpowiedziami, dystrybucją przez reposty, społecznościami, powiadomieniami, wyszukiwaniem i gotowym od razu rankingowym widokiem For You.

Bitsocial Forge może uruchomić pierwszą domyślną usługę RPC i kanał. To ustawienie domyślne może obejmować kanał rankingowy i reklamy, dzięki czemu aplikacja będzie kompletna już pierwszego dnia, zamiast prosić głównych użytkowników o samodzielne złożenie całego stosu.

Różnica polega na tym, że ustawienia domyślne nie powinny stać się więzieniem. Użytkownik powinien móc zmieniać RPC, kanały, instancje, systemy rankingu, reklamy i dostawców odkrywania treści albo całkowicie wyłączyć ranking. Klient może mieć wyraźne ustawienia początkowe, zachowując wymienność każdej ważnej usługi.

Dzięki temu klient jest bardziej konfigurowalny niż tradycyjna platforma. Jeden użytkownik może pozostać przy domyślnym rankingowym kanale z reklamami. Inny może używać chronologicznego kanału bez rankingu. Jeszcze inny może wybrać RPC nastawione na prywatność, społecznościową usługę odkrywania, płatny kanał bez reklam albo niszowy algorytm dla określonej subkultury.

## Społeczności międzyklienckie

Społeczności powinny być znacznie ważniejsze niż izolowane grupy w jednej aplikacji.

Na X/Twitterze społeczności są zamknięte w X. Mogą być przydatne, ale dziedziczą ograniczenia jednej platformy, jednego systemu kont, jednego stosu rekomendacji i jednej powierzchni produktu.

Społeczność Bitsocial może być tworzona, hostowana, odkrywana i używana przez różne klienty. Oznacza to, że klient fazy 3 może pokazywać społeczności i posty z szerszej sieci Bitsocial, a nie tylko od użytkowników, którzy zaczęli w nim korzystać z sieci. W jednej społeczności może jednocześnie pojawiać się aktywność z klienta imageboardu, klienta dyskusyjnego w stylu Reddita, niszowego forum, aplikacji mobilnej i klienta fazy 3.

Na tym polega podstawowa zaleta efektu sieciowego: jeden klient może czuć się znajomy głównym użytkownikom, a jednocześnie czerpać korzyści z wielu klientów, węzłów społeczności, dostawców RPC i niezależnych usług.

## Opcjonalne algorytmy podawania

Klient fazy 3 nie powinien narzucać wszystkim jednego globalnego systemu rankingu.

Algorytmy kanałów powinny być opcjonalne i wybierane przez użytkownika. Użytkownik może wybrać algorytm z rynku, zmienić dostawcę, skorzystać z algorytmu firmy, skorzystać z algorytmu prowadzonego przez anonimowego operatora, skorzystać z algorytmu stworzonego przez społeczność, uruchomić algorytm osobisty lub w ogóle nie używać algorytmu.

Publiczni dostawcy usług RPC są naturalnym miejscem konkurencji tych usług. Mogą indeksować, oceniać i polecać treści, ale nie powinni kontrolować tożsamości ani profilu użytkownika.

Usługi te mogą konkurować także kształtem samej aplikacji. Jeden RPC może udostępniać rankingowy kanał z reklamami. Inny może zapewnić nierankingowy, chronologiczny kanał. Inny może specjalizować się w prywatności, tłumaczeniu, moderacji, odkrywaniu społeczności lub niszowym wykresie społecznościowym.

Jeśli ekonomia się sprawdzi, usługi kanałów wspieranych przez RPC mogłyby dodać funkcje sztucznej inteligencji podobne do tych, które platformy głównego nurtu próbują umieszczać w swoich kanałach: automatyczne tłumaczenia, podsumowania, odpowiedzi wspomagane przez boty, odpowiedzi w wyszukiwaniu, pomoc w moderacji lub kontekst w stylu notatek społeczności.

Funkcje te powinny dotyczyć wyboru usług, a nie wymagań protokołu. Domyślny serwer RPC może konkurować, oferując bogatszy kanał, ale użytkownicy i konkurujący klienci powinni nadal mieć możliwość wyboru prostszych, prywatnych, chronologicznych, pozbawionych reklam lub dostosowanych do społeczności alternatyw.

## RPC bez przejmowania kontroli

Każdy użytkownik powinien mieć możliwość uczestniczenia jako pełny węzeł peer-to-peer za pośrednictwem RPC bez przekazywania dostawcy RPC własności swojej tożsamości lub profilu.

Ścieżka hostowana ma znaczenie, ponieważ większość użytkowników nie zacznie od uruchomienia serwera. Ścieżka wyjścia ma równie duże znaczenie: użytkownik powinien mieć możliwość przejścia do własnego węzła profilu na sprzęcie o niskiej specyfikacji, w tym Raspberry Pi, kiedy tylko chce.

Na tym polega różnica między wygodą a przekazaniem kontroli.

## Publiczna rozmowa wzmocniona przez Bitsocial Chain

Bitsocial Chain może wprowadzić trwałe nazewnictwo, płatności, napiwki, nagrody i inne mechanizmy finansowe bezpośrednio do publicznej rozmowy.

Klient fazy 3 pozostaje skoncentrowany na postach, tekście, dzieleniu się pomysłami i dyskusjach w czasie rzeczywistym, a jednocześnie współdzieli społeczności i efekty sieciowe z innymi klientami Bitsocial.
