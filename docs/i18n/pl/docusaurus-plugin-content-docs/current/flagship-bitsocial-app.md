---
title: Flagowa aplikacja Bitsocial
description: "Proponowany klient Bitsocial oparty na profilach: domyślnie podobny do X/Twitter, ale z wymiennymi RPC, kanałami, algorytmami, reklamami i społecznościami."
---

# Flagowa aplikacja Bitsocial

Flagowa aplikacja Bitsocial jest proponowanym pierwszym klientem sieciowym opartym na profilach. Najprostsze porównanie to: domyślnie podobny do X/Twitter, ale z otwartą warstwą platformy.

Dodałoby profile, obserwacje, odpowiedzi, kanały, społeczności, powiadomienia i publiczne rozmowy w czasie rzeczywistym, zachowując przy tym możliwość wymiany podstawowych usług. 5chan udowadnia, że ​​anonimowe społeczności mogą działać. Seedit zmierza w stronę ciągłej dyskusji. Flagowa aplikacja wprowadziłaby te efekty sieciowe do głównego nurtu mediów społecznościowych, nie czyniąc wykresu właścicielem jednej firmy.

Ta strona opisuje kierunek rozwoju produktu, a nie specyfikację wersji zablokowanej. Dokładny interfejs, domyślny kanał, model reklamy, funkcje AI i rynek RPC mogą się zmieniać w miarę dojrzewania protokołu i wczesnych aplikacji.

## Co ma udowodnić

Aplikacja powinna udowadniać, że sieć społecznościowa oparta na profilach może uniknąć stania się platformą opiekuńczą:

- użytkownicy mogą posiadać tożsamości i profile
- społeczności i węzły profili mogą pozostać w trybie peer-to-peer
- społeczności mogą przenosić efekty sieciowe pomiędzy klientami Bitsocial
- Dostawcy RPC mogą sprawić, że aplikacja będzie wygodna, bez przejmowania kontroli
- Algorytmy kanałów mogą być usługami opcjonalnymi, a nie przepisami dotyczącymi platformy
- inni klienci mogą nadal konkurować o tę samą sieć

Nie chodzi o to, aby stworzyć jedynego klienta Bitsocial. Chodzi o to, aby stworzyć pierwszego szerokiego klienta, który pokaże, jak daleko może rozciągać się protokół.

## Domyślnie znajomy, z założenia wymienny

Domyślne środowisko powinno być konkurencyjne w stosunku do popularnych aplikacji do rozmów publicznych: szybki kanał główny, obserwowanie, odpowiedzi, dystrybucja w stylu repost, społeczności, powiadomienia, wyszukiwanie i widok rankingu Dla Ciebie, który działa natychmiast.

Bitsocial Forge może uruchomić pierwszą domyślną usługę RPC i kanał. To ustawienie domyślne może obejmować kanał rankingowy i reklamy, dzięki czemu aplikacja będzie kompletna już pierwszego dnia, zamiast prosić głównych użytkowników o samodzielne złożenie całego stosu.

Różnica polega na tym, że domyślny nie powinien stać się więzieniem. Użytkownik powinien mieć możliwość zmiany wywołań RPC, kanałów informacyjnych, instancji, systemów rankingowych, reklam i dostawców usług wykrywania lub całkowitego usunięcia rankingu. Aplikację można ocenić przy pierwszym uruchomieniu, zachowując przy tym możliwość wymiany wszystkich głównych usług.

Dzięki temu aplikacja jest bardziej konfigurowalna niż konwencjonalna platforma. Jeden użytkownik może zachować domyślny kanał rankingowy z reklamami. Inny może użyć kanału chronologicznego bez rankingu. Inny może wybrać RPC zorientowany na prywatność, prowadzoną przez społeczność usługę wyszukiwania, płatny kanał wolny od reklam lub niszowy algorytm stworzony dla określonej subkultury.

## Społeczności międzyklienckie

Społeczności powinny być znacznie ważniejsze niż izolowane grupy w jednej aplikacji.

Na X/Twitterze społeczności są zamknięte w X. Mogą być przydatne, ale dziedziczą ograniczenia jednej platformy, jednego systemu kont, jednego stosu rekomendacji i jednej powierzchni produktu.

Społeczność Bitsocial można tworzyć, hostować, odkrywać i używać za pośrednictwem różnych klientów. Oznacza to, że flagowa aplikacja może wyświetlać społeczności i posty z szerszej sieci Bitsocial, nie tylko od użytkowników, którzy rozpoczęli pracę w flagowej aplikacji. Społeczność może jednocześnie prowadzić aktywność za pomocą klienta tablicy graficznej, klienta dyskusyjnego w stylu Reddit, klienta forum niszowego, aplikacji mobilnej i aplikacji flagowej.

Na tym polega podstawowa zaleta efektu sieciowego: jeden klient może czuć się znajomy głównym użytkownikom, a jednocześnie czerpać korzyści z wielu klientów, węzłów społeczności, dostawców RPC i niezależnych usług.

## Opcjonalne algorytmy podawania

Flagowa aplikacja nie powinna narzucać wszystkim jednego globalnego systemu rankingowego.

Algorytmy kanałów powinny być włączone. Użytkownik może wybrać algorytm z rynku, zmienić dostawcę, skorzystać z algorytmu firmy, skorzystać z algorytmu prowadzonego przez anonimowego operatora, skorzystać z algorytmu stworzonego przez społeczność, uruchomić algorytm osobisty lub w ogóle nie używać algorytmu.

Publiczni dostawcy usług RPC są naturalnym miejscem konkurencji tych usług. Mogą indeksować, oceniać i polecać treści, ale nie powinni być właścicielami użytkownika ani profilu.

Usługi te mogą konkurować także kształtem samej aplikacji. Jeden RPC może udostępniać rankingowy kanał z reklamami. Inny może zapewnić nierankingowy, chronologiczny kanał. Inny może specjalizować się w prywatności, tłumaczeniu, moderacji, odkrywaniu społeczności lub niszowym wykresie społecznościowym.

Jeśli ekonomia się sprawdzi, usługi kanałów wspieranych przez RPC mogłyby dodać funkcje sztucznej inteligencji podobne do tych, które platformy głównego nurtu próbują umieszczać w swoich kanałach: automatyczne tłumaczenia, podsumowania, odpowiedzi wspomagane przez boty, odpowiedzi w wyszukiwaniu, pomoc w moderacji lub kontekst w stylu notatek społeczności.

Funkcje te powinny dotyczyć wyboru usług, a nie wymagań protokołu. Domyślny serwer RPC może konkurować, oferując bogatszy kanał, ale użytkownicy i konkurujący klienci powinni nadal mieć możliwość wyboru prostszych, prywatnych, chronologicznych, pozbawionych reklam lub dostosowanych do społeczności alternatyw.

## Nieizolacyjny RPC

Każdy użytkownik powinien mieć możliwość uczestniczenia jako pełny węzeł peer-to-peer za pośrednictwem RPC bez przekazywania dostawcy RPC własności swojej tożsamości lub profilu.

Ścieżka hostowana ma znaczenie, ponieważ większość użytkowników nie zacznie od uruchomienia serwera. Ścieżka wyjścia ma równie duże znaczenie: użytkownik powinien mieć możliwość przejścia do własnego węzła profilu na sprzęcie o niskiej specyfikacji, w tym Raspberry Pi, kiedy tylko chce.

Na tym polega różnica między wygodą a opieką.

## Dlaczego może stać się aplikacją do wszystkiego

Jeśli Bitsocial Network zapewni aplikacjom trwałe nazewnictwo, płatności, napiwki, nagrody i inne zabezpieczenia finansowe, flagowa aplikacja może stać się czymś więcej niż tylko klientem kanałów.

Ważnym ograniczeniem jest to, że aplikacja nie powinna stać się nowym właścicielem sieci. Może to być duży klient, a może nawet najpopularniejszy klient, pozostawiając jednocześnie miejsce dla konkurencyjnych aplikacji, konkurencyjnych wywołań RPC, konkurencyjnych algorytmów kanałów i hostowanych samodzielnie węzłów profili.
