# i18n-Standardsprachenrichtlinie

Anonyme Besucher lösen die Sprache jetzt in dieser Reihenfolge auf:

1. `?lang=` Abfrageparameter
2. Gespeicherte Sprachauswahl von `localStorage`
3. Regionsbezogener anonymer Standard:
   - Erzwingen Sie Englisch in explizit aufgeführten englischsprachigen Regionen
   - Andernfalls verwenden Sie die Browser-/Gerätesprache, wenn es sich um eine unserer unterstützten Gebietsschemata handelt
4. Fallen Sie auf `en` zurück

## Quellbasislinie

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) für Englischkenntnisse auf Länderebene
- [Volkszählung Singapur 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) für Singapur, wo Englisch für 48,3 % der Einwohner ab 5 Jahren die am häufigsten gesprochene Muttersprache war

## Kodierte englischsprachige Standardregionen

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Überprüfung des Gebietsschemas

| Gebietsschema | Regionen überprüft             | Neuestes Signal                                                                                                        | Ergebnis                                                                    |
| ------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `ar`          | `AE`                           | VAE EF EPI 2025: 487, Moderat                                                                                          | Browser-/Gerätesprache                                                      |
| `bn`          | `BD`, `IN`                     | Bangladesch 506, Moderat; Indien 484, Moderat                                                                          | Browser-/Gerätesprache                                                      |
| `ca`          | `ES`                           | Spanien 540, Moderat                                                                                                   | Browser-/Gerätesprache                                                      |
| `cs`          | `CZ`                           | Tschechien 582, Hoch                                                                                                   | Englisch in `CZ`                                                            |
| `da`          | `DK`                           | Dänemark 611, Sehr hoch                                                                                                | Englisch in `DK`                                                            |
| `de`          | `DE`, `AT`, `CH`               | Deutschland 615, Sehr hoch; Österreich 616, Sehr hoch; Schweiz 564, Hoch                                               | Englisch in `DE`, `AT`, `CH`                                                |
| `el`          | `GR`, `CY`                     | Griechenland 592, Hoch; Zypern 537, Moderat                                                                            | Englisch in `GR`; Browser-/Gerätesprache in `CY`                            |
| `en`          | Lokale mit englischer Mehrheit | Das Gebietsschema des Browsers/Geräts meldet bereits `en-*` im allgemeinen Fall                                        | Englisch bleibt Standard                                                    |
| `es`          | `ES`                           | Spanien 540, Moderat                                                                                                   | Browser-/Gerätesprache                                                      |
| `fa`          | `IR`                           | Iran 492, Moderat                                                                                                      | Browser-/Gerätesprache                                                      |
| `fi`          | `FI`                           | Finnland 603, Sehr hoch                                                                                                | Englisch in `FI`                                                            |
| `fil`         | `PH`                           | Philippinen 569, Hoch                                                                                                  | Englisch in `PH`                                                            |
| `fr`          | `FR`, `BE`, `CH`               | Frankreich 539, Moderat; Belgien 608, Sehr hoch; Schweiz 564, Hoch                                                     | Englisch in `BE`, `CH`; Browser-/Gerätesprache in `FR`                      |
| `he`          | `IL`                           | Israel 524, Moderat                                                                                                    | Browser-/Gerätesprache                                                      |
| `hi`          | `IN`                           | Indien 484, Moderat                                                                                                    | Browser-/Gerätesprache                                                      |
| `hu`          | `HU`                           | Ungarn 590, Hoch                                                                                                       | Englisch in `HU`                                                            |
| `id`          | `ID`                           | Indonesien 471, Moderat                                                                                                | Browser-/Gerätesprache                                                      |
| `it`          | `IT`, `CH`                     | Italien 513, Moderat; Schweiz 564, Hoch                                                                                | Englisch in `CH`; Browser-/Gerätesprache in `IT`                            |
| `ja`          | `JP`                           | Japan 446, Sehr niedrig                                                                                                | Browser-/Gerätesprache                                                      |
| `ko`          | `KR`                           | Südkorea 522, Moderat                                                                                                  | Browser-/Gerätesprache                                                      |
| `mr`          | `IN`                           | Indien 484, Moderat                                                                                                    | Browser-/Gerätesprache                                                      |
| `nl`          | `NL`, `BE`                     | Niederlande 624, Sehr hoch; Belgien 608, Sehr hoch                                                                     | Englisch in `NL`, `BE`                                                      |
| `no`          | `NO`                           | Norwegen 613, Sehr hoch                                                                                                | Englisch in `NO`                                                            |
| `pl`          | `PL`                           | Polen 600, Sehr hoch                                                                                                   | Englisch in `PL`                                                            |
| `pt`          | `PT`, `BR`                     | Portugal 612, Sehr hoch; Brasilien 482, Moderat                                                                        | Englisch in `PT`; Browser-/Gerätesprache in `BR`                            |
| `ro`          | `RO`, `MD`                     | Rumänien 605, Sehr hoch; Moldawien 531, Moderat                                                                        | Englisch in `RO`; Browser-/Gerätesprache in `MD`                            |
| `ru`          | `RU`                           | Russland 521, Moderat                                                                                                  | Browser-/Gerätesprache                                                      |
| `sq`          | `AL`                           | Albanien 532, Moderat                                                                                                  | Browser-/Gerätesprache                                                      |
| `sv`          | `SE`, `FI`                     | Schweden 609, Sehr hoch; Finnland 603, Sehr hoch                                                                       | Englisch in `SE`, `FI`                                                      |
| `te`          | `IN`                           | Indien 484, Moderat                                                                                                    | Browser-/Gerätesprache                                                      |
| `th`          | `TH`                           | Thailand 402, Sehr niedrig                                                                                             | Browser-/Gerätesprache                                                      |
| `tr`          | `TR`                           | Türkei 488, Moderat                                                                                                    | Browser-/Gerätesprache                                                      |
| `uk`          | `UA`                           | Ukraine 526, Moderat                                                                                                   | Browser-/Gerätesprache                                                      |
| `ur`          | `PK`, `IN`                     | Pakistan 493, Moderat; Indien 484, Moderat                                                                             | Browser-/Gerätesprache                                                      |
| `vi`          | `VN`                           | Vietnam 500, Moderat                                                                                                   | Browser-/Gerätesprache                                                      |
| `zh`          | `CN`, `HK`, `SG`               | China 464, Moderat; Hongkong 538, Moderat; Volkszählung Singapur 2020: 48,3 % sprechen zu Hause am häufigsten Englisch | Englisch in `SG`; Browser-/Gerätesprache in `CN`, `HK` und anderen Regionen |

Nur die positiven Overrides werden in der Laufzeitlogik codiert. Alle anderen Regionen bevorzugen weiterhin die Browser-/Gerätesprache, wenn sie einem der unterstützten Gebietsschemacodes entspricht.
