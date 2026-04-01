# i18n Domyślna polityka językowa

Anonimowi odwiedzający rozwiązują teraz język w następującej kolejności:

1. Parametr zapytania `?lang=`
2. Zapisano wybór selektora języka z `localStorage`
3. Domyślne anonimowe ustawienie domyślne uwzględniające region:
   - wymuszać angielski w wyraźnie wymienionych regionach, w których jest dużo języka angielskiego
   - w przeciwnym razie użyj języka przeglądarki/urządzenia, jeśli jest to jedna z obsługiwanych przez nas lokalizacji
4. Wróć do `en`

## Źródłowa linia bazowa

- [Indeks znajomości języka angielskiego EF 2025](https://www.ef.edu/epi/) dla znajomości języka angielskiego na poziomie krajowym
- [Spis Powszechny Singapuru 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) dla Singapuru, gdzie angielski był najczęściej używanym językiem w domu dla 48,3% mieszkańców w wieku 5+

## Zakodowane regiony domyślne w języku angielskim

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Przegląd lokalny

| Lokalizacja | Recenzowane regiony                 | Najnowszy sygnał                                                                                                                  | Wynik                                                                           |
| ----------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `ar`        | `AE`                                | ZEA EF EPI 2025: 487, Umiarkowany                                                                                                 | Język przeglądarki/urządzenia                                                   |
| `bn`        | `BD`, `IN`                          | Bangladesz 506, umiarkowany; Indie 484, umiarkowane                                                                               | Język przeglądarki/urządzenia                                                   |
| `ca`        | `ES`                                | Hiszpania 540, Umiarkowany                                                                                                        | Język przeglądarki/urządzenia                                                   |
| `cs`        | `CZ`                                | Czechy 582, Wysokie                                                                                                               | Angielski w `CZ`                                                                |
| `da`        | `DK`                                | Dania 611, Bardzo wysoki                                                                                                          | Angielski w `DK`                                                                |
| `de`        | `DE`, `AT`, `CH`                    | Niemcy 615, Bardzo wysoki; Austria 616, Bardzo wysoka; Szwajcaria 564, Wysoki                                                     | Angielski w `DE`, `AT`, `CH`                                                    |
| `el`        | `GR`, `CY`                          | Grecja 592, Wysoki; Cypr 537, Umiarkowany                                                                                         | Angielski w `GR`; język przeglądarki/urządzenia w `CY`                          |
| `en`        | Lokalizacje z większością angielską | Ustawienia regionalne przeglądarki/urządzenia już zgłaszają `en-*` w typowym przypadku                                            | Angielski pozostaje domyślny                                                    |
| `es`        | `ES`                                | Hiszpania 540, Umiarkowany                                                                                                        | Język przeglądarki/urządzenia                                                   |
| `fa`        | `IR`                                | Iran 492, umiarkowany                                                                                                             | Język przeglądarki/urządzenia                                                   |
| `fi`        | `FI`                                | Finlandia 603, Bardzo wysoka                                                                                                      | Angielski w `FI`                                                                |
| `fil`       | `PH`                                | Filipiny 569, Wysokie                                                                                                             | Angielski w `PH`                                                                |
| `fr`        | `FR`, `BE`, `CH`                    | Francja 539, Umiarkowany; Belgia 608, Bardzo wysoka; Szwajcaria 564, Wysoki                                                       | Angielski w `BE`, `CH`; język przeglądarki/urządzenia w `FR`                    |
| `he`        | `IL`                                | Izrael 524, Umiarkowany                                                                                                           | Język przeglądarki/urządzenia                                                   |
| `hi`        | `IN`                                | Indie 484, umiarkowane                                                                                                            | Język przeglądarki/urządzenia                                                   |
| `hu`        | `HU`                                | Węgry 590, Wysokie                                                                                                                | Angielski w `HU`                                                                |
| `id`        | `ID`                                | Indonezja 471, Umiarkowany                                                                                                        | Język przeglądarki/urządzenia                                                   |
| `it`        | `IT`, `CH`                          | Włochy 513, Umiarkowany; Szwajcaria 564, Wysoki                                                                                   | Angielski w `CH`; język przeglądarki/urządzenia w `IT`                          |
| `ja`        | `JP`                                | Japonia 446, bardzo niski                                                                                                         | Język przeglądarki/urządzenia                                                   |
| `ko`        | `KR`                                | Korea Południowa 522, Umiarkowany                                                                                                 | Język przeglądarki/urządzenia                                                   |
| `mr`        | `IN`                                | Indie 484, umiarkowane                                                                                                            | Język przeglądarki/urządzenia                                                   |
| `nl`        | `NL`, `BE`                          | Holandia 624, Bardzo wysoka; Belgia 608, Bardzo wysoka                                                                            | Angielski w `NL`, `BE`                                                          |
| `no`        | `NO`                                | Norwegia 613, Bardzo wysoka                                                                                                       | Angielski w `NO`                                                                |
| `pl`        | `PL`                                | Polska 600, Bardzo wysoka                                                                                                         | Angielski w `PL`                                                                |
| `pt`        | `PT`, `BR`                          | Portugalia 612, Bardzo wysoka; Brazylia 482, Umiarkowany                                                                          | Angielski w `PT`; język przeglądarki/urządzenia w `BR`                          |
| `ro`        | `RO`, `MD`                          | Rumunia 605, Bardzo wysoki; Mołdawia 531, Umiarkowany                                                                             | Angielski w `RO`; język przeglądarki/urządzenia w `MD`                          |
| `ru`        | `RU`                                | Rosja 521, Umiarkowany                                                                                                            | Język przeglądarki/urządzenia                                                   |
| `sq`        | `AL`                                | Albania 532, Umiarkowany                                                                                                          | Język przeglądarki/urządzenia                                                   |
| `sv`        | `SE`, `FI`                          | Szwecja 609, Bardzo wysoka; Finlandia 603, Bardzo wysoka                                                                          | Angielski w `SE`, `FI`                                                          |
| `te`        | `IN`                                | Indie 484, umiarkowane                                                                                                            | Język przeglądarki/urządzenia                                                   |
| `th`        | `TH`                                | Tajlandia 402, Bardzo niski                                                                                                       | Język przeglądarki/urządzenia                                                   |
| `tr`        | `TR`                                | Turkiye 488, Umiarkowany                                                                                                          | Język przeglądarki/urządzenia                                                   |
| `uk`        | `UA`                                | Ukraina 526, Umiarkowany                                                                                                          | Język przeglądarki/urządzenia                                                   |
| `ur`        | `PK`, `IN`                          | Pakistan 493, umiarkowany; Indie 484, umiarkowane                                                                                 | Język przeglądarki/urządzenia                                                   |
| `vi`        | `VN`                                | Wietnam 500, Umiarkowany                                                                                                          | Język przeglądarki/urządzenia                                                   |
| `zh`        | `CN`, `HK`, `SG`                    | Chiny 464, umiarkowane; Hongkong 538, umiarkowany; Spis ludności Singapuru 2020: Angielski najczęściej używany w domu przez 48,3% | Angielski w `SG`; język przeglądarki/urządzenia w `CN`, `HK` i innych regionach |

Tylko pozytywne przesłonięcia są kodowane w logice wykonawczej. Wszystkie pozostałe regiony nadal preferują język przeglądarki/urządzenia, jeśli jest on zgodny z jednym z obsługiwanych kodów regionalnych.
