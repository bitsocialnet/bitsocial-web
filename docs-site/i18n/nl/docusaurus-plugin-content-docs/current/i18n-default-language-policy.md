# i18n Standaardtaalbeleid

Anonieme bezoekers lossen de taal nu in deze volgorde op:

1. `?lang=` query param
2. Opgeslagen taalkiezerkeuze uit `localStorage`
3. Regiobewuste anonieme standaard:
   - forceer Engels in expliciet vermeld Engels-zwaar regio's
   - gebruik anders de browser-/apparaattaal als dit een van onze ondersteunde landinstellingen is
4. Ga terug naar `en`

## Bronbasislijn

- [EF Engelse taalvaardigheidsindex 2025](https://www.ef.edu/epi/) voor Engelse taalvaardigheid op landniveau
- [Volkstelling Singapore 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) voor Singapore, waar Engels de meest gesproken thuistaal was voor 48,3% van de inwoners van 5 jaar en ouder

## Gecodeerde Engels-standaardregio's

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Locale Review

| Locale | Regions reviewed                             | Latest signal                                                                                             | Result                                                                |
| ------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `ar`   | `AE`                                         | UAE EF EPI 2025: 487, Moderate                                                                            | Browser/device language                                               |
| `bn`   | `BD`, `IN`                                   | Bangladesh 506, Moderate; India 484, Moderate                                                             | Browser/device language                                               |
| `ca`   | `ES`                                         | Spain 540, Moderate                                                                                       | Browser/device language                                               |
| `cs`   | `CZ`                                         | Czechia 582, High                                                                                         | English in `CZ`                                                       |
| `da`   | `DK`                                         | Denmark 611, Very high                                                                                    | English in `DK`                                                       |
| `de`   | `DE`, `AT`, `CH`                             | Germany 615, Very high; Austria 616, Very high; Switzerland 564, High                                     | English in `DE`, `AT`, `CH`                                           |
| `el`   | `GR`, `CY`                                   | Greece 592, High; Cyprus 537, Moderate                                                                    | English in `GR`; browser/device taal in `CY`                          |
| `en`   | Landinstellingen met een Engelse meerderheid | Landinstelling van browser/apparaat rapporteert al `en-*` in het algemene geval                           | Engels blijft standaard                                               |
| `es`   | `ES`                                         | Spain 540, Moderate                                                                                       | Browser/device language                                               |
| `fa`   | `IR`                                         | Iran 492, Matig                                                                                           | Browser-/apparaattaal                                                 |
| `fi`   | `FI`                                         | Finland 603, Zeer hoog                                                                                    | Engels in `FI`                                                        |
| `fil`  | `PH`                                         | Filippijnen 569, Hoog                                                                                     | Engels in `PH`                                                        |
| `fr`   | `FR`, `BE`, `CH`                             | Frankrijk 539, Matig; België 608, Zeer hoog; Zwitserland 564, Hoog                                        | Engels in `BE`, `CH`; browser-/apparaattaal in `FR`                   |
| `he`   | `IL`                                         | Israël 524, Matig                                                                                         | Browser-/apparaattaal                                                 |
| `hi`   | `IN`                                         | Indië 484, Matig                                                                                          | Browser-/apparaattaal                                                 |
| `hu`   | `HU`                                         | Hongarije 590, Hoog                                                                                       | Engels in `HU`                                                        |
| `id`   | `ID`                                         | Indonesië 471, Matig                                                                                      | Browser-/apparaattaal                                                 |
| `it`   | `IT`, `CH`                                   | Italië 513, Matig; Zwitserland 564, Hoog                                                                  | Engels in `CH`; browser-/apparaattaal in `IT`                         |
| `ja`   | `JP`                                         | Japan 446, Zeer laag                                                                                      | Browser-/apparaattaal                                                 |
| `ko`   | `KR`                                         | Zuid-Korea 522, Matig                                                                                     | Browser-/apparaattaal                                                 |
| `mr`   | `IN`                                         | Indië 484, Matig                                                                                          | Browser-/apparaattaal                                                 |
| `nl`   | `NL`, `BE`                                   | Nederland 624, Zeer hoog; België 608, Zeer hoog                                                           | Engels in `NL`, `BE`                                                  |
| `no`   | `NO`                                         | Noorwegen 613, Zeer hoog                                                                                  | Engels in `NO`                                                        |
| `pl`   | `PL`                                         | Polen 600, Zeer hoog                                                                                      | Engels in `PL`                                                        |
| `pt`   | `PT`, `BR`                                   | Portugal 612, Zeer hoog; Brazilië 482, Matig                                                              | Engels in `PT`; browser-/apparaattaal in `BR`                         |
| `ro`   | `RO`, `MD`                                   | Roemenië 605, Zeer hoog; Moldavië 531, Matig                                                              | Engels in `RO`; browser-/apparaattaal in `MD`                         |
| `ru`   | `RU`                                         | Rusland 521, Matig                                                                                        | Browser-/apparaattaal                                                 |
| `sq`   | `AL`                                         | Albanië 532, Matig                                                                                        | Browser-/apparaattaal                                                 |
| `sv`   | `SE`, `FI`                                   | Zweden 609, Zeer hoog; Finland 603, Zeer hoog                                                             | Engels in `SE`, `FI`                                                  |
| `te`   | `IN`                                         | Indië 484, Matig                                                                                          | Browser-/apparaattaal                                                 |
| `th`   | `TH`                                         | Thailand 402, Zeer laag                                                                                   | Browser-/apparaattaal                                                 |
| `tr`   | `TR`                                         | Turkiye 488, Matig                                                                                        | Browser-/apparaattaal                                                 |
| `uk`   | `UA`                                         | Oekraïne 526, Matig                                                                                       | Browser-/apparaattaal                                                 |
| `ur`   | `PK`, `IN`                                   | Pakistan 493, Matig; Indië 484, Matig                                                                     | Browser-/apparaattaal                                                 |
| `vi`   | `VN`                                         | Vietnam 500, Matig                                                                                        | Browser-/apparaattaal                                                 |
| `zh`   | `CN`, `HK`, `SG`                             | China 464, matig; Hongkong 538, matig; Singapore Census 2020: Engels thuis het meest gesproken voor 48,3% | Engels in `SG`; browser-/apparaattaal in `CN`, `HK` en andere regio's |

Alleen de positieve overschrijvingen worden gecodeerd in runtime-logica. Alle andere regio's blijven de voorkeur geven aan de browser-/apparaattaal als deze overeenkomt met een van de ondersteunde landcodes.
