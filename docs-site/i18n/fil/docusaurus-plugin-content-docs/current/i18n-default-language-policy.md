# i18n Default na Patakaran sa Wika

Niresolba na ngayon ng mga hindi kilalang bisita ang wika sa ganitong pagkakasunud-sunod:

1. `?lang=` query param
2. Naka-save na pagpili ng tagapili ng wika mula sa `localStorage`
3. Anonymous na default na alam sa rehiyon:
   - force English in explicitly listed English-heavy regions
   - kung hindi, gamitin ang wika ng browser/device kapag isa ito sa aming mga sinusuportahang lokal
4. Bumalik sa `en`

## Pinagmulan Baseline

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) para sa country-level na English proficiency
- [Sensus ng Singapore 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) para sa Singapore, kung saan ang English ang pinakamadalas na ginagamit na home language para sa 48.3% ng mga residenteng may edad na 5+

## Naka-encode na English-Default na Rehiyon

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `FI`, ZX7ZPLACEHOLDER `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, ZXQPLACEHOLDERX15QPLACEHOLDERX15ZXQ,Q `SG`

## Pagsusuri sa Lokal

| Lokal | Mga nasuri na rehiyon         | Pinakabagong signal                                                                                                                    | Resulta                                                                       |
| ----- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ar`  | `AE`                          | UAE EF EPI 2025: 487, Katamtaman                                                                                                       | Wika ng browser/device                                                        |
| `bn`  | `BD`, `IN`                    | Bangladesh 506, Katamtaman; India 484, Katamtaman                                                                                      | Wika ng browser/device                                                        |
| `ca`  | `ES`                          | Spain 540, Katamtaman                                                                                                                  | Wika ng browser/device                                                        |
| `cs`  | `CZ`                          | Czechia 582, Mataas                                                                                                                    | English sa `CZ`                                                               |
| `da`  | `DK`                          | Denmark 611, Napakataas                                                                                                                | English sa `DK`                                                               |
| `de`  | `DE`, `AT`, `CH`              | Germany 615, Napakataas; Austria 616, Napakataas; Switzerland 564, Mataas                                                              | English sa `DE`, `AT`, `CH`                                                   |
| `el`  | `GR`, `CY`                    | Greece 592, Mataas; Cyprus 537, Katamtaman                                                                                             | English sa `GR`; wika ng browser/device sa `CY`                               |
| `en`  | Mga lokal na mayoryang Ingles | Ang lokal na browser/device ay nag-uulat na ng `en-*` sa karaniwang kaso                                                               | Nananatiling default ang Ingles                                               |
| `es`  | `ES`                          | Spain 540, Katamtaman                                                                                                                  | Wika ng browser/device                                                        |
| `fa`  | `IR`                          | Iran 492, Katamtaman                                                                                                                   | Wika ng browser/device                                                        |
| `fi`  | `FI`                          | Finland 603, Very high                                                                                                                 | English sa `FI`                                                               |
| `fil` | `PH`                          | Pilipinas 569, Mataas                                                                                                                  | English sa `PH`                                                               |
| `fr`  | `FR`, `BE`, `CH`              | France 539, Katamtaman; Belgium 608, Napakataas; Switzerland 564, Mataas                                                               | English sa `BE`, `CH`; wika ng browser/device sa `FR`                         |
| `he`  | `IL`                          | Israel 524, Katamtaman                                                                                                                 | Wika ng browser/device                                                        |
| `hi`  | `IN`                          | India 484, Katamtaman                                                                                                                  | Wika ng browser/device                                                        |
| `hu`  | `HU`                          | Hungary 590, Mataas                                                                                                                    | English sa `HU`                                                               |
| `id`  | `ID`                          | Indonesia 471, Katamtaman                                                                                                              | Wika ng browser/device                                                        |
| `it`  | `IT`, `CH`                    | Italy 513, Katamtaman; Switzerland 564, Mataas                                                                                         | English sa `CH`; wika ng browser/device sa `IT`                               |
| `ja`  | `JP`                          | Japan 446, Napakababa                                                                                                                  | Wika ng browser/device                                                        |
| `ko`  | `KR`                          | South Korea 522, Katamtaman                                                                                                            | Wika ng browser/device                                                        |
| `mr`  | `IN`                          | India 484, Katamtaman                                                                                                                  | Wika ng browser/device                                                        |
| `nl`  | `NL`, `BE`                    | Netherlands 624, Napakataas; Belgium 608, Napakataas                                                                                   | English sa `NL`, `BE`                                                         |
| `no`  | `NO`                          | Norway 613, Napakataas                                                                                                                 | English sa `NO`                                                               |
| `pl`  | `PL`                          | Poland 600, Napakataas                                                                                                                 | English sa `PL`                                                               |
| `pt`  | `PT`, `BR`                    | Portugal 612, Napakataas; Brazil 482, Katamtaman                                                                                       | English sa `PT`; wika ng browser/device sa `BR`                               |
| `ro`  | `RO`, `MD`                    | Romania 605, Napakataas; Moldova 531, Katamtaman                                                                                       | English sa `RO`; wika ng browser/device sa `MD`                               |
| `ru`  | `RU`                          | Russia 521, Katamtaman                                                                                                                 | Wika ng browser/device                                                        |
| `sq`  | `AL`                          | Albania 532, Katamtaman                                                                                                                | Wika ng browser/device                                                        |
| `sv`  | `SE`, `FI`                    | Sweden 609, Napakataas; Finland 603, Napakataas                                                                                        | English sa `SE`, `FI`                                                         |
| `te`  | `IN`                          | India 484, Katamtaman                                                                                                                  | Wika ng browser/device                                                        |
| `th`  | `TH`                          | Thailand 402, Napakababa                                                                                                               | Wika ng browser/device                                                        |
| `tr`  | `TR`                          | Turkiye 488, Katamtaman                                                                                                                | Wika ng browser/device                                                        |
| `uk`  | `UA`                          | Ukraine 526, Katamtaman                                                                                                                | Wika ng browser/device                                                        |
| `ur`  | `PK`, `IN`                    | Pakistan 493, Katamtaman; India 484, Katamtaman                                                                                        | Wika ng browser/device                                                        |
| `vi`  | `VN`                          | Vietnam 500, Katamtaman                                                                                                                | Wika ng browser/device                                                        |
| `zh`  | `CN`, `HK`, `SG`              | China 464, Katamtaman; Hong Kong 538, Katamtaman; Singapore Census 2020: English ang pinakamadalas na ginagamit sa bahay para sa 48.3% | English sa `SG`; wika ng browser/device sa `CN`, `HK` at iba pang mga rehiyon |

Ang mga positibong override lang ang naka-encode sa runtime logic. Patuloy na pinipili ng lahat ng iba pang rehiyon ang wika ng browser/device kapag tumugma ito sa isa sa mga sinusuportahang locale code.
