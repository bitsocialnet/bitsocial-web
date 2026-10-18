---
title: Gdzie znajdują się posty i jak długo pozostają dostępne
description: Dlaczego posty Bitsocial są podpisane i adresowane treścią, ale nie są przechowywane wiecznie przez każdy węzeł, kto utrzymuje je online i jak archiwa zachowują czytelność starych treści.
---

# Gdzie znajdują się posty i jak długo pozostają dostępne

Bitsocial nie przechowuje każdego posta na blockchainie ani w bazie danych firmy. Własny węzeł każdej
społeczności przechowuje jej posty, czytelnicy i seederzy pomagają je udostępniać, a każdy, kto chce
mieć trwały zapis, może go zachować. Przechowywanie postów na zawsze jest **opcjonalne, nieobowiązkowe**:
protokół nie zmusza każdego uczestnika do przechowywania całej historii sieci.

Ta strona wyjaśnia, co to oznacza w praktyce, bo „nie jest przechowywane na zawsze” łatwo błędnie
odczytać jako „znika” albo „zaufaj mi”.

## Autentyczność i dostępność to osobne pytania

W przypadku posta pojawiają się dwa różne pytania:

1. **Czy jest prawdziwy?** Czy napisał go ten autor i czy ta społeczność go zaakceptowała?
2. **Czy nadal jest online?** Czy ktoś może go dziś pobrać?

Bitsocial odpowiada na pierwsze pytanie kryptografią, a nie zaufaniem. Każdy post jest podpisany parą
kluczy autora, a gdy społeczność go zaakceptuje, post jest przechowywany pod identyfikatorem treści
(CID): hashem jego dokładnych bajtów. Każdy, kto pobierze post, może sam sprawdzić podpis i hash. Węzeł,
router, brama ani archiwum nie mogą zmienić tekstu posta ani sfałszować posta w imieniu kogoś innego,
nie powodując niepowodzenia kontroli.

Drugie pytanie dotyczy tego, kto przechowuje kopię, i tylko ta część nie jest gwarantowana.

## Kto utrzymuje posty online

- **Węzeł społeczności.** Węzeł właściciela przyjmuje posty i przechowuje je w swojej bazie danych tak
  długo, jak przechowuje je społeczność. To jedyna kopia, która zawsze istnieje, gdy społeczność działa.
  Zobacz [Protokół peer-to-peer](/peer-to-peer-protocol/).
- **Czytelnicy.** Aplikacje desktopowe, takie jak aplikacja 5chan Electron, seedują załadowane
  społeczności podczas działania, więc popularne społeczności jest udostępnianych przez wiele peerów,
  tak jak popularne torrenty. Karta przeglądarki może buforować i weryfikować treść, gdy jest otwarta,
  ale nie jest długotrwałym hostem.
- **Seederzy.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) pozwala każdemu
  wnieść stale dostępną moc z VPS-a lub zapasowej maszyny. Przypina najnowsze strony i aktualizacje
  postów społeczności, dzięki czemu społeczności za domowymi routerami są dostępne w przeglądarkach.
- **Archiwiści.** Każdy może przeszukiwać społeczności i zachować wszystko, co zobaczy. Archiwa to
  zwykłe usługi zbudowane na sieci, a nie szczególna rola w protokole.

## Społeczności same wybierają retencję

To, jak długo społeczność przechowuje stare posty, jest decyzją jej właściciela, a nie regułą
protokołu. Niektóre społeczności chcą mieć lata historii. Inne mają zapominać: tablice 5chan działają
jak imageboard, gdzie wątki spadają z tablicy, trafiają do archiwum, a po określonym czasie są usuwane
z węzła tablicy (domyślnie po 48 godzinach). Społeczność może też całkowicie pominąć archiwum.

Ten sam protokół obsługuje oba przypadki, bo retencja jest polityką ustalaną przez każdą społeczność,
a nie kosztem, który musi ponosić każdy węzeł.

## Dlaczego nie przechowywać wszystkiego na zawsze?

Sieć, która wymaga od każdego węzła przechowywania każdego posta na zawsze, musi jakoś za to zapłacić:

- **Blockchainy** każą każdemu pełnemu węzłowi przechowywać całą historię, więc wymagania wobec węzłów
  rosną wraz z całą aktywnością, a publikowanie zwykle wiąże się z opłatą.
- **Płatne przechowywanie**, jak czynsz za przestrzeń w Farcaster, zmusza użytkowników do płacenia za
  zachowanie historii i usuwa najstarsze posty wykraczające poza opłacony zakres. Zobacz
  [Bitsocial i Farcaster](/comparisons/farcaster/).
- **Centralne serwery** przechowują wszystko, ale tylko tak długo, jak chce tego jedna firma, i według
  jej zasad.

Media społecznościowe nie potrzebują globalnej księgi. Nie ma znaczenia, czy post A został zaakceptowany
milisekundę przed postem B, a większość starych postów jest rzadko czytana. Bitsocial pozwala każdemu
węzłowi społeczności przechowywać tylko własne społeczności, dzięki czemu hosting jest dość tani dla
laptopa, Raspberry Pi albo małego VPS-a. Zobacz [Dlaczego nie blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Kompromis

Jeśli nikt nie zachowa kopii posta, może on stać się niedostępny. CID posta nigdy się nie zmienia, ale
CID jest tylko adresem: treść można pobrać tylko wtedy, gdy przynajmniej jeden węzeł ją udostępnia.
Jeśli węzeł społeczności na stałe przestanie działać, a żaden czytelnik, seeder ani archiwum nie
zachowali jej postów, te posty przepadają.

To uczciwy koszt niewymagania globalnej księgi. To także koszt, który ponoszą już wszystkie duże
platformy: stare posty znikają z nich, gdy znikają konta, serwery albo firmy. Różnica polega na tym, że
w Bitsocial zachowanie czegoś nie wymaga niczyjej zgody.

## Zachowaj to, co ważne

- **Uruchom samodzielnie węzeł społeczności.** Właściciel społeczności, który utrzymuje węzeł w ruchu,
  zachowuje jej historię tak długo, jak długo zachowują ją ustawienia społeczności.
- **Seeduj.** Pozostawienie otwartej aplikacji desktopowej lub uruchomienie `bitsocial-seeder` utrzymuje
  społeczności dostępne dla innych.
- **Archiwizuj.** Niezależne archiwa utrzymują stare wątki jako czytelne i możliwe do wyszukania, gdy
  społeczność je usunie. [5archive.org](https://5archive.org) archiwizuje tablice 5chan, a
  [seeditarchive.org](https://seeditarchive.org) archiwizuje społeczności Seedit. Oba projekty są
  otwartoźródłowe, więc każdy może uruchomić mirror lub konkurencyjne archiwum.

Ponieważ każdy zarchiwizowany post wciąż jest podpisany, archiwum nie może po cichu zmienić tego, co
ktoś powiedział: czytelnik może zweryfikować podpis zarchiwizowanego posta tak samo jak posta na żywo.
