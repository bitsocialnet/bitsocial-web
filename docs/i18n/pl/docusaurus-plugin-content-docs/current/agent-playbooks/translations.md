# Tłumaczenia

Serwis about używa plików JSON i18next w `about/public/translations/{lang}/default.json`. Źródłowe tłumaczenia Docusaurus znajdują się osobno w `docs/i18n/`.

## Klucze serwisu about

Używaj `.agents/skills/translate/SKILL.md`. Ustalaj bieżące lokalizacje na podstawie zawartości dysku i zachowuj symbole zastępcze, znaczniki, terminy techniczne oraz nazwy marek. Przy większych zleceniach agenty potomne mogą generować niezależne mapy, ale jeden agent nadrzędny wykonuje szeregowo każdy zapis do lokalizacji; narzędzie aktualizujące nie ma blokady zapisu.

Używaj unikalnej ścieżki mapy należącej do zadania. Podgląd uzyskasz przez `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, a następnie zastosuj zmiany z tymi samymi argumentami i `--write`. Po zapisie zweryfikuj pokrycie/wartości i usuń wyłącznie tymczasowe mapy należące do tego zadania.

Do zleconych usunięć używaj `--delete`. Przed autoryzowanym `--audit --write` przejrzyj wyniki `--audit --dry`; dynamiczne klucze tłumaczeń wymagają ręcznego przeglądu kodu źródłowego. Kopiuj tekst angielski do każdej lokalizacji tylko w przypadku terminu technicznego, nazwy marki lub symbolu zastępczego.

## Strony Docusaurus

`scripts/translate-docs.py` to narzędzie do masowego zapisu wszystkich stron/lokalizacji, bez filtra dla pojedynczych plików; nie używaj go do wąskiej edycji tłumaczenia. `scripts/check-docs-translations.py` to weryfikator tylko do odczytu, obsługujący `--locales` i `--paths`.

Utrzymuj bloki kodu, linki, kod inline, adresy kontraktów, nagłówki, tabele i admonicje zgodne z angielskim źródłem. Usuwaj błędy zgłaszane przez weryfikator; ostrzeżenia `frontmatter-untranslated` dla nazw marek są spodziewane. Postępuj zgodnie z `docs/AGENTS.md` i buduj z katalogu głównego, gdy zmieniasz motyw dokumentacji lub zachowanie i18n, aby statyczny wynik i Pagefind pozostały spójne.

## Opcjonalny przegląd semantyczny

Dla wybranych kluczy i18next używaj `scripts/jev/translation-README.md`. Dla stron dokumentacji najpierw uruchom `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Wymaga to jawnego wyboru lokalizacji/stron, uruchamia weryfikator strukturalny i raportuje przegląd semantyczny jako niezweryfikowany, dopóki nie zostanie włączone wnioskowanie na żywo. Dodawaj `--live` tylko z autoryzacją dostawcy i budżetem przypisanymi do zadania; wspólna prywatna konfiguracja maszyny dostarcza dane uwierzytelniające i przypięty model. Zmienne środowiskowe i `--model` mogą nadpisać tę konfigurację. Polecenie nigdy nie edytuje tłumaczeń.

Adapter stron zachowuje kontekst całej strony i ogranicza każdą stronę do 24 KB, a każdy przebieg do 30 par. Dla większych stron przygotuj jawnie dopasowane pary akapitów źródła i tłumaczenia dla `translations.mjs --pairs`; nie paruj akapitów automatycznie według indeksu. Wyniki semantyczne mają charakter doradczy: przejrzyj zgłoszone problemy i niepewności oraz zachowaj deterministyczne kontrole kodu, linków i adresów.
