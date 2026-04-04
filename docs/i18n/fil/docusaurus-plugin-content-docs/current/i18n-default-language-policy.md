# i18n Default na Patakaran sa Wika

Niresolba na ngayon ng mga hindi kilalang bisita ang wika sa ganitong pagkakasunud-sunod:

1. `?lang=` query param
2. Naka-save na pagpili ng tagapili ng wika mula sa `localStorage`
3. Anonymous na default na alam sa rehiyon:
   - pilitin ang Ingles sa tahasang nakalistang mga rehiyong mabigat sa Ingles
   - kung hindi, gamitin ang wika ng browser/device kapag isa ito sa aming mga sinusuportahang lokal
4. Bumalik sa `en`

## Pinagmulan Baseline

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) para sa antas ng bansa sa English proficiency
- [Singapore Census 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) para sa Singapore, kung saan English ang pinakamadalas na ginagamit na home language para sa 48.3% ng mga residenteng may edad 5+

## Naka-encode na English-Default na Rehiyon

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Pagsusuri sa Lokal

| Lokal | Sinuri ang mga rehiyon         | Pinakabagong signal                                                                                                                    | Resulta                                                                      |
| ----- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `ar`  | `AE`                           | UAE EF EPI 2025: 487, Katamtaman                                                                                                       | Wika ng browser/device                                                       |
| `bn`  | `BD`, `IN`                     | Bangladesh 506, Katamtaman; India 484, Katamtaman                                                                                      | Wika ng browser/device                                                       |
| `ca`  | `ES`                           | Spain 540, Katamtaman                                                                                                                  | Wika ng browser/device                                                       |
| `cs`  | `CZ`                           | Czechia 582, Mataas                                                                                                                    | Ingles sa `CZ`                                                               |
| `da`  | `DK`                           | Denmark 611, Napakataas                                                                                                                | Ingles sa `DK`                                                               |
| `de`  | `DE`, `AT`, `CH`               | Germany 615, Napakataas; Austria 616, Napakataas; Switzerland 564, Mataas                                                              | English sa `DE`, `AT`, `CH`                                                  |
| `el`  | `GR`, `CY`                     | Greece 592, Mataas; Cyprus 537, Katamtaman                                                                                             | Ingles sa `GR`; wika ng browser/device sa `CY`                               |
| `en`  | Mga lokal na mayorya ng Ingles | Ang lokal na browser/device ay nag-uulat na ng `en-*` sa karaniwang kaso                                                               | Nananatiling default ang English                                             |
| `es`  | `ES`                           | Spain 540, Katamtaman                                                                                                                  | Wika ng browser/device                                                       |
| `fa`  | `IR`                           | Iran 492, Katamtaman                                                                                                                   | Wika ng browser/device                                                       |
| `fi`  | `FI`                           | Finland 603, Napakataas                                                                                                                | Ingles sa `FI`                                                               |
| `fil` | `PH`                           | Pilipinas 569, Mataas                                                                                                                  | Ingles sa `PH`                                                               |
| `fr`  | `FR`, `BE`, `CH`               | France 539, Katamtaman; Belgium 608, Napakataas; Switzerland 564, Mataas                                                               | Ingles sa `BE`, `CH`; wika ng browser/device sa `FR`                         |
| `he`  | `IL`                           | Israel 524, Katamtaman                                                                                                                 | Wika ng browser/device                                                       |
| `hi`  | `IN`                           | India 484, Katamtaman                                                                                                                  | Wika ng browser/device                                                       |
| `hu`  | `HU`                           | Hungary 590, Mataas                                                                                                                    | Ingles sa `HU`                                                               |
| `id`  | `ID`                           | Indonesia 471, Katamtaman                                                                                                              | Wika ng browser/device                                                       |
| `it`  | `IT`, `CH`                     | Italy 513, Katamtaman; Switzerland 564, Mataas                                                                                         | Ingles sa `CH`; wika ng browser/device sa `IT`                               |
| `ja`  | `JP`                           | Japan 446, Napakababa                                                                                                                  | Wika ng browser/device                                                       |
| `ko`  | `KR`                           | South Korea 522, Katamtaman                                                                                                            | Wika ng browser/device                                                       |
| `mr`  | `IN`                           | India 484, Katamtaman                                                                                                                  | Wika ng browser/device                                                       |
| `nl`  | `NL`, `BE`                     | Netherlands 624, Napakataas; Belgium 608, Napakataas                                                                                   | English sa `NL`, `BE`                                                        |
| `no`  | `NO`                           | Norway 613, Napakataas                                                                                                                 | Ingles sa `NO`                                                               |
| `pl`  | `PL`                           | Poland 600, Napakataas                                                                                                                 | Ingles sa `PL`                                                               |
| `pt`  | `PT`, `BR`                     | Portugal 612, Napakataas; Brazil 482, Katamtaman                                                                                       | Ingles sa `PT`; wika ng browser/device sa `BR`                               |
| `ro`  | `RO`, `MD`                     | Romania 605, Napakataas; Moldova 531, Katamtaman                                                                                       | Ingles sa `RO`; wika ng browser/device sa `MD`                               |
| `ru`  | `RU`                           | Russia 521, Katamtaman                                                                                                                 | Wika ng browser/device                                                       |
| `sq`  | `AL`                           | Albania 532, Katamtaman                                                                                                                | Wika ng browser/device                                                       |
| `sv`  | `SE`, `FI`                     | Sweden 609, Napakataas; Finland 603, Napakataas                                                                                        | English sa `SE`, `FI`                                                        |
| `te`  | `IN`                           | India 484, Katamtaman                                                                                                                  | Wika ng browser/device                                                       |
| `th`  | `TH`                           | Thailand 402, Napakababa                                                                                                               | Wika ng browser/device                                                       |
| `tr`  | `TR`                           | Turkiye 488, Katamtaman                                                                                                                | Wika ng browser/device                                                       |
| `uk`  | `UA`                           | Ukraine 526, Katamtaman                                                                                                                | Wika ng browser/device                                                       |
| `ur`  | `PK`, `IN`                     | Pakistan 493, Katamtaman; India 484, Katamtaman                                                                                        | Wika ng browser/device                                                       |
| `vi`  | `VN`                           | Vietnam 500, Katamtaman                                                                                                                | Wika ng browser/device                                                       |
| `zh`  | `CN`, `HK`, `SG`               | China 464, Katamtaman; Hong Kong 538, Katamtaman; Singapore Census 2020: English ang pinakamadalas na ginagamit sa bahay para sa 48.3% | Ingles sa `SG`; wika ng browser/device sa `CN`, `HK` at iba pang mga rehiyon |

Ang mga positibong override lang ang naka-encode sa runtime logic. Patuloy na pinipili ng lahat ng iba pang rehiyon ang wika ng browser/device kapag tumugma ito sa isa sa mga sinusuportahang locale code.
