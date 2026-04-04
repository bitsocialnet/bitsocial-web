# Politica lingvistică implicită i18n

Vizitatorii anonimi rezolvă acum limba în această ordine:

1. `?lang=` param. interogare
2. Alegerea selectorului de limbă salvată de la `localStorage`
3. Valoare implicită anonimă cu cunoștință de regiune:
   - forțați limba engleză în regiunile enumerate explicit în limba engleză
   - în caz contrar, utilizați limba browserului/dispozitivului atunci când este una dintre locațiile noastre acceptate
4. Reveniți la `en`

## Sursa de referință

- [Indicele de cunoaștere a limbii engleze EF 2025](https://www.ef.edu/epi/) for country-level English proficiency
- [Recensământul din Singapore 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) pentru Singapore, unde engleza a fost limba cea mai frecvent vorbită acasă pentru 48,3% dintre rezidenții cu vârsta de peste 5 ani

## Cod în engleză-regiuni implicite

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Revizuire locală

| Locale | Regiunile revizuite            | Cel mai recent semnal                                                                                                         | Rezultat                                                                   |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `ar`   | `AE`                           | UAE EF EPI 2025: 487, Moderat                                                                                                 | Limba browser/dispozitiv                                                   |
| `bn`   | `BD`, `IN`                     | Bangladesh 506, moderat; India 484, Moderat                                                                                   | Limba browser/dispozitiv                                                   |
| `ca`   | `ES`                           | Spania 540, Moderat                                                                                                           | Limba browser/dispozitiv                                                   |
| `cs`   | `CZ`                           | Cehia 582, Mare                                                                                                               | Engleză în `CZ`                                                            |
| `da`   | `DK`                           | Danemarca 611, Foarte mare                                                                                                    | Engleză în `DK`                                                            |
| `de`   | `DE`, `AT`, `CH`               | Germania 615, Foarte mare; Austria 616, Foarte mare; Elveția 564, Înalt                                                       | Engleză în `DE`, `AT`, `CH`                                                |
| `el`   | `GR`, `CY`                     | Grecia 592, Înalt; Cipru 537, Moderat                                                                                         | engleză în `GR`; limba browserului/dispozitivului în `CY`                  |
| `en`   | localuri cu majoritate engleză | Localizarea browserului/dispozitivului raportează deja `en-*` în cazul obișnuit                                               | Engleza rămâne implicită                                                   |
| `es`   | `ES`                           | Spania 540, Moderat                                                                                                           | Limba browser/dispozitiv                                                   |
| `fa`   | `IR`                           | Iran 492, Moderat                                                                                                             | Limba browser/dispozitiv                                                   |
| `fi`   | `FI`                           | Finlanda 603, Foarte mare                                                                                                     | Engleză în `FI`                                                            |
| `fil`  | `PH`                           | Filipine 569, mare                                                                                                            | Engleză în `PH`                                                            |
| `fr`   | `FR`, `BE`, `CH`               | Franta 539, Moderat; Belgia 608, Foarte mare; Elveția 564, Înalt                                                              | engleză în `BE`, `CH`; limba browser/dispozitiv în `FR`                    |
| `he`   | `IL`                           | Israel 524, Moderat                                                                                                           | Limba browser/dispozitiv                                                   |
| `hi`   | `IN`                           | India 484, Moderat                                                                                                            | Limba browser/dispozitiv                                                   |
| `hu`   | `HU`                           | Ungaria 590, Mare                                                                                                             | Engleză în `HU`                                                            |
| `id`   | `ID`                           | Indonezia 471, Moderat                                                                                                        | Limba browser/dispozitiv                                                   |
| `it`   | `IT`, `CH`                     | Italia 513, Moderat; Elveția 564, Înalt                                                                                       | engleză în `CH`; limba browser/dispozitiv în `IT`                          |
| `ja`   | `JP`                           | Japonia 446, Foarte scăzut                                                                                                    | Limba browser/dispozitiv                                                   |
| `ko`   | `KR`                           | Coreea de Sud 522, Moderat                                                                                                    | Limba browser/dispozitiv                                                   |
| `mr`   | `IN`                           | India 484, Moderat                                                                                                            | Limba browser/dispozitiv                                                   |
| `nl`   | `NL`, `BE`                     | Olanda 624, Foarte mare; Belgia 608, Foarte mare                                                                              | Engleză în `NL`, `BE`                                                      |
| `no`   | `NO`                           | Norvegia 613, Foarte mare                                                                                                     | Engleză în `NO`                                                            |
| `pl`   | `PL`                           | Polonia 600, Foarte mare                                                                                                      | Engleză în `PL`                                                            |
| `pt`   | `PT`, `BR`                     | Portugalia 612, Foarte mare; Brazilia 482, Moderat                                                                            | engleză în `PT`; limba browser/dispozitiv în `BR`                          |
| `ro`   | `RO`, `MD`                     | Romania 605, Foarte mare; Moldova 531, Moderat                                                                                | engleză în `RO`; limba browser/dispozitiv în `MD`                          |
| `ru`   | `RU`                           | Rusia 521, Moderat                                                                                                            | Limba browser/dispozitiv                                                   |
| `sq`   | `AL`                           | Albania 532, Moderat                                                                                                          | Limba browser/dispozitiv                                                   |
| `sv`   | `SE`, `FI`                     | Suedia 609, Foarte mare; Finlanda 603, Foarte mare                                                                            | Engleză în `SE`, `FI`                                                      |
| `te`   | `IN`                           | India 484, Moderat                                                                                                            | Limba browser/dispozitiv                                                   |
| `th`   | `TH`                           | Thailanda 402, Foarte scăzut                                                                                                  | Limba browser/dispozitiv                                                   |
| `tr`   | `TR`                           | Turkiye 488, Moderat                                                                                                          | Limba browser/dispozitiv                                                   |
| `uk`   | `UA`                           | Ucraina 526, Moderat                                                                                                          | Limba browser/dispozitiv                                                   |
| `ur`   | `PK`, `IN`                     | Pakistan 493, moderat; India 484, Moderat                                                                                     | Limba browser/dispozitiv                                                   |
| `vi`   | `VN`                           | Vietnam 500, moderat                                                                                                          | Limba browser/dispozitiv                                                   |
| `zh`   | `CN`, `HK`, `SG`               | China 464, Moderat; Hong Kong 538, moderată; Recensământul din Singapore 2020: engleza cel mai des vorbită acasă pentru 48,3% | engleză în `SG`; Limba browser/dispozitiv în `CN`, `HK` și în alte regiuni |

Numai suprascrierile pozitive sunt codificate în logica de rulare. Toate celelalte regiuni continuă să prefere limba browserului/dispozitivului atunci când aceasta se potrivește cu unul dintre codurile locale acceptate.
