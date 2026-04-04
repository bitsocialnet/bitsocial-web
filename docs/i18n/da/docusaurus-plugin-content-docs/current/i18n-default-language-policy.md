# i18n standardsprogpolitik

Anonyme besøgende løser nu sproget i denne rækkefølge:

1. `?lang=` forespørgselsparam
2. Gemt sprogvalg fra `localStorage`
3. Regionsbevidst anonym standard:
   - tvinge engelsk i eksplicit anførte engelsktunge regioner
   - ellers brug browseren/enhedens sprog, når det er en af ​​vores understøttede lokaliteter
4. Fald tilbage til `en`

## Kilde Baseline

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) for engelskkundskaber på landeniveau
- [Singapore Census 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) for Singapore, hvor engelsk var det hyppigst talte hjemmesprog for 48,3 % af beboerne i alderen 5+

## Kodede engelsk-standardregioner

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Lokale anmeldelse

| Lokalitet | Regioner gennemgået             | Seneste signal                                                                                             | Resultat                                                             |
| --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `ar`      | `AE`                            | UAE EF EPI 2025: 487, Moderat                                                                              | Browser/enhedssprog                                                  |
| `bn`      | `BD`, `IN`                      | Bangladesh 506, Moderat; Indien 484, Moderat                                                               | Browser/enhedssprog                                                  |
| `ca`      | `ES`                            | Spanien 540, Moderat                                                                                       | Browser/enhedssprog                                                  |
| `cs`      | `CZ`                            | Tjekkiet 582, Høj                                                                                          | engelsk på `CZ`                                                      |
| `da`      | `DK`                            | Danmark 611, Meget høj                                                                                     | engelsk på `DK`                                                      |
| `de`      | `DE`, `AT`, `CH`                | Tyskland 615, Meget høj; Østrig 616, Meget høj; Schweiz 564, Høj                                           | engelsk på `DE`, `AT`, `CH`                                          |
| `el`      | `GR`, `CY`                      | Grækenland 592, Høj; Cypern 537, Moderat                                                                   | engelsk på `GR`; browser/enhedssprog i `CY`                          |
| `en`      | lokaliteter med engelsk flertal | Browser-/enhedslokalitet rapporterer allerede `en-*` i almindelige tilfælde                                | Engelsk forbliver standard                                           |
| `es`      | `ES`                            | Spanien 540, Moderat                                                                                       | Browser/enhedssprog                                                  |
| `fa`      | `IR`                            | Iran 492, Moderat                                                                                          | Browser/enhedssprog                                                  |
| `fi`      | `FI`                            | Finland 603, Meget høj                                                                                     | engelsk på `FI`                                                      |
| `fil`     | `PH`                            | Philippines 569, High                                                                                      | engelsk på `PH`                                                      |
| `fr`      | `FR`, `BE`, `CH`                | Frankrig 539, Moderat; Belgien 608, Meget høj; Schweiz 564, Høj                                            | engelsk på `BE`, `CH`; browser-/enhedssprog i `FR`                   |
| `he`      | `IL`                            | Israel 524, Moderat                                                                                        | Browser/enhedssprog                                                  |
| `hi`      | `IN`                            | Indien 484, Moderat                                                                                        | Browser/enhedssprog                                                  |
| `hu`      | `HU`                            | Ungarn 590, Høj                                                                                            | engelsk på `HU`                                                      |
| `id`      | `ID`                            | Indonesien 471, Moderat                                                                                    | Browser/enhedssprog                                                  |
| `it`      | `IT`, `CH`                      | Italien 513, Moderat; Schweiz 564, Høj                                                                     | engelsk på `CH`; browser/enhedssprog i `IT`                          |
| `ja`      | `JP`                            | Japan 446, meget lav                                                                                       | Browser/enhedssprog                                                  |
| `ko`      | `KR`                            | Sydkorea 522, Moderat                                                                                      | Browser/enhedssprog                                                  |
| `mr`      | `IN`                            | Indien 484, Moderat                                                                                        | Browser/enhedssprog                                                  |
| `nl`      | `NL`, `BE`                      | Holland 624, Meget høj; Belgien 608, meget høj                                                             | engelsk på `NL`, `BE`                                                |
| `no`      | `NO`                            | Norge 613, Meget høj                                                                                       | engelsk på `NO`                                                      |
| `pl`      | `PL`                            | Polen 600, Meget høj                                                                                       | engelsk på `PL`                                                      |
| `pt`      | `PT`, `BR`                      | Portugal 612, Meget høj; Brasilien 482, Moderat                                                            | engelsk på `PT`; browser/enhedssprog i `BR`                          |
| `ro`      | `RO`, `MD`                      | Rumænien 605, Meget høj; Moldova 531, Moderat                                                              | engelsk på `RO`; browser/enhedssprog i `MD`                          |
| `ru`      | `RU`                            | Rusland 521, Moderat                                                                                       | Browser/enhedssprog                                                  |
| `sq`      | `AL`                            | Albanien 532, Moderat                                                                                      | Browser/enhedssprog                                                  |
| `sv`      | `SE`, `FI`                      | Sverige 609, Meget høj; Finland 603, Meget høj                                                             | engelsk på `SE`, `FI`                                                |
| `te`      | `IN`                            | Indien 484, Moderat                                                                                        | Browser/enhedssprog                                                  |
| `th`      | `TH`                            | Thailand 402, Meget lav                                                                                    | Browser/enhedssprog                                                  |
| `tr`      | `TR`                            | Turkiye 488, Moderat                                                                                       | Browser/enhedssprog                                                  |
| `uk`      | `UA`                            | Ukraine 526, Moderat                                                                                       | Browser/enhedssprog                                                  |
| `ur`      | `PK`, `IN`                      | Pakistan 493, Moderat; Indien 484, Moderat                                                                 | Browser/enhedssprog                                                  |
| `vi`      | `VN`                            | Vietnam 500, Moderat                                                                                       | Browser/enhedssprog                                                  |
| `zh`      | `CN`, `HK`, `SG`                | Kina 464, Moderat; Hong Kong 538, Moderat; Singapore Census 2020: Engelsk talt oftest i hjemmet for 48,3 % | engelsk på `SG`; browser-/enhedssprog i `CN`, `HK` og andre regioner |

Kun de positive tilsidesættelser er kodet i runtime-logik. Alle andre regioner foretrækker fortsat browser-/enhedssproget, når det matcher en af ​​de understøttede lokalkoder.
