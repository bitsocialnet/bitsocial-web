# i18n Standard språkpolicy

Anonyme besøkende løser nå språk i denne rekkefølgen:

1. `?lang=` spørringsparam
2. Lagret språkvelgervalg fra `localStorage`
3. Regionbevisst anonym standard:
   - tvinge engelsk i eksplisitt oppførte engelsktunge regioner
   - ellers bruk nettleseren/enhetsspråket når det er en av våre støttede lokaliteter
4. Gå tilbake til `en`

## Kilde Baseline

- [EF engelskkunnskapsindeks 2025](https://www.ef.edu/epi/) for engelskkunnskaper på landsnivå
- [Singapore folketelling 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) for Singapore, der engelsk var det mest talte hjemmespråket for 48,3 % av innbyggerne i alderen 5+

## Kodede engelsk-standardregioner

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, ZXQPLACEHOLDER7ZXZPLXQ, ZXQPLACEHOLDER7ZXZPLXQ, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, ZX7PLACEHOLDER, ZX7PLACEHOLDER, ZX6ZXXQ

## Lokale gjennomgang

| Lokale | Regioner vurdert           | Siste signal                                                                                                   | Resultat                                                               |
| ------ | -------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `ar`   | `AE`                       | UAE EF EPI 2025: 487, Moderat                                                                                  | Språk for nettleser/enhet                                              |
| `bn`   | `BD`, `IN`                 | Bangladesh 506, moderat; India 484, Moderat                                                                    | Språk for nettleser/enhet                                              |
| `ca`   | `ES`                       | Spania 540, Moderat                                                                                            | Språk for nettleser/enhet                                              |
| `cs`   | `CZ`                       | Tsjekkia 582, Høy                                                                                              | Engelsk på `CZ`                                                        |
| `da`   | `DK`                       | Danmark 611, Meget høy                                                                                         | Engelsk på `DK`                                                        |
| `de`   | `DE`, `AT`, `CH`           | Tyskland 615, Meget høy; Østerrike 616, Svært høy; Sveits 564, Høy                                             | Engelsk på `DE`, `AT`, `CH`                                            |
| `el`   | `GR`, `CY`                 | Hellas 592, Høy; Kypros 537, moderat                                                                           | engelsk på `GR`; nettleser-/enhetsspråk i `CY`                         |
| `en`   | Språk med engelsk flertall | Nettleser-/enhetslokale rapporterer allerede `en-*` i vanlig tilfelle                                          | Engelsk forblir standard                                               |
| `es`   | `ES`                       | Spania 540, Moderat                                                                                            | Språk for nettleser/enhet                                              |
| `fa`   | `IR`                       | Iran 492, moderat                                                                                              | Språk for nettleser/enhet                                              |
| `fi`   | `FI`                       | Finland 603, Meget høy                                                                                         | Engelsk på `FI`                                                        |
| `fil`  | `PH`                       | Filippinene 569, Høy                                                                                           | Engelsk på `PH`                                                        |
| `fr`   | `FR`, `BE`, `CH`           | Frankrike 539, Moderat; Belgia 608, Svært høy; Sveits 564, Høy                                                 | Engelsk i `BE`, `CH`; nettleser-/enhetsspråk i `FR`                    |
| `he`   | `IL`                       | Israel 524, Moderat                                                                                            | Språk for nettleser/enhet                                              |
| `hi`   | `IN`                       | India 484, Moderat                                                                                             | Språk for nettleser/enhet                                              |
| `hu`   | `HU`                       | Ungarn 590, Høy                                                                                                | Engelsk på `HU`                                                        |
| `id`   | `ID`                       | Indonesia 471, Moderat                                                                                         | Språk for nettleser/enhet                                              |
| `it`   | `IT`, `CH`                 | Italia 513, Moderat; Sveits 564, Høy                                                                           | engelsk på `CH`; nettleser-/enhetsspråk i `IT`                         |
| `ja`   | `JP`                       | Japan 446, Svært lav                                                                                           | Språk for nettleser/enhet                                              |
| `ko`   | `KR`                       | Sør-Korea 522, moderat                                                                                         | Språk for nettleser/enhet                                              |
| `mr`   | `IN`                       | India 484, Moderat                                                                                             | Språk for nettleser/enhet                                              |
| `nl`   | `NL`, `BE`                 | Nederland 624, Svært høy; Belgia 608, Svært høy                                                                | Engelsk på `NL`, `BE`                                                  |
| `no`   | `NO`                       | Norge 613, Meget høy                                                                                           | Engelsk på `NO`                                                        |
| `pl`   | `PL`                       | Polen 600, Svært høy                                                                                           | Engelsk på `PL`                                                        |
| `pt`   | `PT`, `BR`                 | Portugal 612, Svært høy; Brasil 482, Moderat                                                                   | engelsk på `PT`; nettleser-/enhetsspråk i `BR`                         |
| `ro`   | `RO`, `MD`                 | Romania 605, veldig høy; Moldova 531, Moderat                                                                  | engelsk på `RO`; nettleser-/enhetsspråk i `MD`                         |
| `ru`   | `RU`                       | Russland 521, Moderat                                                                                          | Språk for nettleser/enhet                                              |
| `sq`   | `AL`                       | Albania 532, Moderat                                                                                           | Språk for nettleser/enhet                                              |
| `sv`   | `SE`, `FI`                 | Sverige 609, Meget høy; Finland 603, Meget høy                                                                 | Engelsk på `SE`, `FI`                                                  |
| `te`   | `IN`                       | India 484, Moderat                                                                                             | Språk for nettleser/enhet                                              |
| `th`   | `TH`                       | Thailand 402, Svært lav                                                                                        | Språk for nettleser/enhet                                              |
| `tr`   | `TR`                       | Turkiye 488, Moderat                                                                                           | Språk for nettleser/enhet                                              |
| `uk`   | `UA`                       | Ukraina 526, Moderat                                                                                           | Språk for nettleser/enhet                                              |
| `ur`   | `PK`, `IN`                 | Pakistan 493, moderat; India 484, Moderat                                                                      | Språk for nettleser/enhet                                              |
| `vi`   | `VN`                       | Vietnam 500, moderat                                                                                           | Språk for nettleser/enhet                                              |
| `zh`   | `CN`, `HK`, `SG`           | Kina 464, Moderat; Hong Kong 538, Moderat; Singapore Census 2020: Engelsk som snakkes oftest hjemme for 48,3 % | engelsk på `SG`; nettleser-/enhetsspråk i `CN`, `HK` og andre regioner |

Bare de positive overstyringene er kodet i kjøretidslogikk. Alle andre regioner fortsetter å foretrekke nettleser-/enhetsspråket når det samsvarer med en av de støttede lokalkodene.
