# i18n Standardspråkpolicy

Anonyma besökare löser nu språket i denna ordning:

1. `?lang=` frågeparam
2. Sparat språkväljarval från `localStorage`
3. Regionmedveten anonym standard:
   - tvinga engelska i explicit listade engelsktunga regioner
   - Använd annars webbläsarens/enhetsspråket när det är en av våra språk som stöds
4. Gå tillbaka till `en`

## Källa Baslinje

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) för engelska kunskaper på landsnivå
- [Singapores folkräkning 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) för Singapore, där engelska var det mest talade hemspråket för 48,3 % av invånarna i åldern 5+

## Kodade engelska-standardregioner

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Lokal recension

| Plats | Regioner granskade          | Senaste signalen                                                                                           | Resultat                                                                 |
| ----- | --------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `ar`  | `AE`                        | UAE EF EPI 2025: 487, Måttlig                                                                              | Språk för webbläsare/enhet                                               |
| `bn`  | `BD`, `IN`                  | Bangladesh 506, Moderat; Indien 484, måttlig                                                               | Språk för webbläsare/enhet                                               |
| `ca`  | `ES`                        | Spanien 540, måttlig                                                                                       | Språk för webbläsare/enhet                                               |
| `cs`  | `CZ`                        | Tjeckien 582, Hög                                                                                          | Engelska på `CZ`                                                         |
| `da`  | `DK`                        | Danmark 611, Mycket hög                                                                                    | Engelska på `DK`                                                         |
| `de`  | `DE`, `AT`, `CH`            | Tyskland 615, Mycket hög; Österrike 616, Mycket hög; Schweiz 564, Hög                                      | Engelska på `DE`, `AT`, `CH`                                             |
| `el`  | `GR`, `CY`                  | Grekland 592, Hög; Cypern 537, måttlig                                                                     | engelska på `GR`; webbläsare/enhetsspråk i `CY`                          |
| `en`  | språk med engelsk majoritet | Webbläsar-/enhetslokalen rapporterar redan `en-*` i det vanliga fallet                                     | Engelska förblir standard                                                |
| `es`  | `ES`                        | Spanien 540, måttlig                                                                                       | Språk för webbläsare/enhet                                               |
| `fa`  | `IR`                        | Iran 492, Moderat                                                                                          | Språk för webbläsare/enhet                                               |
| `fi`  | `FI`                        | Finland 603, Mycket hög                                                                                    | Engelska på `FI`                                                         |
| `fil` | `PH`                        | Filippinerna 569, Hög                                                                                      | Engelska på `PH`                                                         |
| `fr`  | `FR`, `BE`, `CH`            | Frankrike 539, Moderat; Belgien 608, Mycket hög; Schweiz 564, Hög                                          | engelska på `BE`, `CH`; webbläsare/enhetsspråk i `FR`                    |
| `he`  | `IL`                        | Israel 524, Moderat                                                                                        | Språk för webbläsare/enhet                                               |
| `hi`  | `IN`                        | Indien 484, måttlig                                                                                        | Språk för webbläsare/enhet                                               |
| `hu`  | `HU`                        | Ungern 590, Hög                                                                                            | Engelska på `HU`                                                         |
| `id`  | `ID`                        | Indonesien 471, måttlig                                                                                    | Språk för webbläsare/enhet                                               |
| `it`  | `IT`, `CH`                  | Italien 513, Moderat; Schweiz 564, Hög                                                                     | engelska på `CH`; webbläsare/enhetsspråk i `IT`                          |
| `ja`  | `JP`                        | Japan 446, mycket låg                                                                                      | Språk för webbläsare/enhet                                               |
| `ko`  | `KR`                        | Sydkorea 522, Moderat                                                                                      | Språk för webbläsare/enhet                                               |
| `mr`  | `IN`                        | Indien 484, måttlig                                                                                        | Språk för webbläsare/enhet                                               |
| `nl`  | `NL`, `BE`                  | Nederländerna 624, Mycket hög; Belgien 608, Mycket hög                                                     | Engelska på `NL`, `BE`                                                   |
| `no`  | `NO`                        | Norge 613, Mycket hög                                                                                      | Engelska på `NO`                                                         |
| `pl`  | `PL`                        | Polen 600, mycket hög                                                                                      | Engelska på `PL`                                                         |
| `pt`  | `PT`, `BR`                  | Portugal 612, Mycket hög; Brasilien 482, måttlig                                                           | engelska på `PT`; webbläsare/enhetsspråk i `BR`                          |
| `ro`  | `RO`, `MD`                  | Rumänien 605, mycket hög; Moldavien 531, Moderat                                                           | engelska på `RO`; webbläsare/enhetsspråk i `MD`                          |
| `ru`  | `RU`                        | Ryssland 521, Moderat                                                                                      | Språk för webbläsare/enhet                                               |
| `sq`  | `AL`                        | Albanien 532, Moderat                                                                                      | Språk för webbläsare/enhet                                               |
| `sv`  | `SE`, `FI`                  | Sverige 609, Mycket hög; Finland 603, Mycket hög                                                           | Engelska på `SE`, `FI`                                                   |
| `te`  | `IN`                        | Indien 484, måttlig                                                                                        | Språk för webbläsare/enhet                                               |
| `th`  | `TH`                        | Thailand 402, mycket låg                                                                                   | Språk för webbläsare/enhet                                               |
| `tr`  | `TR`                        | Turkiye 488, Moderat                                                                                       | Språk för webbläsare/enhet                                               |
| `uk`  | `UA`                        | Ukraina 526, Moderat                                                                                       | Språk för webbläsare/enhet                                               |
| `ur`  | `PK`, `IN`                  | Pakistan 493, moderat; Indien 484, måttlig                                                                 | Språk för webbläsare/enhet                                               |
| `vi`  | `VN`                        | Vietnam 500, måttlig                                                                                       | Språk för webbläsare/enhet                                               |
| `zh`  | `CN`, `HK`, `SG`            | Kina 464, Moderat; Hong Kong 538, Moderat; Singapore Census 2020: Engelska som mest talas hemma för 48,3 % | engelska på `SG`; webbläsare/enhetsspråk i `CN`, `HK` och andra regioner |

Endast de positiva åsidosättningarna kodas i runtime-logik. Alla andra regioner fortsätter att föredra webbläsarens/enhetsspråket när det matchar en av de språkkoder som stöds.
