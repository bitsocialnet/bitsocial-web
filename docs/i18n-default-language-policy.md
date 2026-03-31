# i18n Default Language Policy

Anonymous visitors now resolve language in this order:

1. `?lang=` query param
2. Saved language selector choice from `localStorage`
3. Region-aware anonymous default:
   - force English in explicitly listed English-heavy regions
   - otherwise use the browser/device language when it is one of our supported locales
4. Fall back to `en`

## Source Baseline

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) for country-level English proficiency
- [Singapore Census 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) for Singapore, where English was the most frequently spoken home language for 48.3% of residents aged 5+

## Encoded English-Default Regions

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Locale Review

| Locale | Regions reviewed         | Latest signal                                                                                                         | Result                                                                   |
| ------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `ar`   | `AE`                     | UAE EF EPI 2025: 487, Moderate                                                                                        | Browser/device language                                                  |
| `bn`   | `BD`, `IN`               | Bangladesh 506, Moderate; India 484, Moderate                                                                         | Browser/device language                                                  |
| `ca`   | `ES`                     | Spain 540, Moderate                                                                                                   | Browser/device language                                                  |
| `cs`   | `CZ`                     | Czechia 582, High                                                                                                     | English in `CZ`                                                          |
| `da`   | `DK`                     | Denmark 611, Very high                                                                                                | English in `DK`                                                          |
| `de`   | `DE`, `AT`, `CH`         | Germany 615, Very high; Austria 616, Very high; Switzerland 564, High                                                 | English in `DE`, `AT`, `CH`                                              |
| `el`   | `GR`, `CY`               | Greece 592, High; Cyprus 537, Moderate                                                                                | English in `GR`; browser/device language in `CY`                         |
| `en`   | English-majority locales | Browser/device locale already reports `en-*` in the common case                                                       | English remains default                                                  |
| `es`   | `ES`                     | Spain 540, Moderate                                                                                                   | Browser/device language                                                  |
| `fa`   | `IR`                     | Iran 492, Moderate                                                                                                    | Browser/device language                                                  |
| `fi`   | `FI`                     | Finland 603, Very high                                                                                                | English in `FI`                                                          |
| `fil`  | `PH`                     | Philippines 569, High                                                                                                 | English in `PH`                                                          |
| `fr`   | `FR`, `BE`, `CH`         | France 539, Moderate; Belgium 608, Very high; Switzerland 564, High                                                   | English in `BE`, `CH`; browser/device language in `FR`                   |
| `he`   | `IL`                     | Israel 524, Moderate                                                                                                  | Browser/device language                                                  |
| `hi`   | `IN`                     | India 484, Moderate                                                                                                   | Browser/device language                                                  |
| `hu`   | `HU`                     | Hungary 590, High                                                                                                     | English in `HU`                                                          |
| `id`   | `ID`                     | Indonesia 471, Moderate                                                                                               | Browser/device language                                                  |
| `it`   | `IT`, `CH`               | Italy 513, Moderate; Switzerland 564, High                                                                            | English in `CH`; browser/device language in `IT`                         |
| `ja`   | `JP`                     | Japan 446, Very low                                                                                                   | Browser/device language                                                  |
| `ko`   | `KR`                     | South Korea 522, Moderate                                                                                             | Browser/device language                                                  |
| `mr`   | `IN`                     | India 484, Moderate                                                                                                   | Browser/device language                                                  |
| `nl`   | `NL`, `BE`               | Netherlands 624, Very high; Belgium 608, Very high                                                                    | English in `NL`, `BE`                                                    |
| `no`   | `NO`                     | Norway 613, Very high                                                                                                 | English in `NO`                                                          |
| `pl`   | `PL`                     | Poland 600, Very high                                                                                                 | English in `PL`                                                          |
| `pt`   | `PT`, `BR`               | Portugal 612, Very high; Brazil 482, Moderate                                                                         | English in `PT`; browser/device language in `BR`                         |
| `ro`   | `RO`, `MD`               | Romania 605, Very high; Moldova 531, Moderate                                                                         | English in `RO`; browser/device language in `MD`                         |
| `ru`   | `RU`                     | Russia 521, Moderate                                                                                                  | Browser/device language                                                  |
| `sq`   | `AL`                     | Albania 532, Moderate                                                                                                 | Browser/device language                                                  |
| `sv`   | `SE`, `FI`               | Sweden 609, Very high; Finland 603, Very high                                                                         | English in `SE`, `FI`                                                    |
| `te`   | `IN`                     | India 484, Moderate                                                                                                   | Browser/device language                                                  |
| `th`   | `TH`                     | Thailand 402, Very low                                                                                                | Browser/device language                                                  |
| `tr`   | `TR`                     | Turkiye 488, Moderate                                                                                                 | Browser/device language                                                  |
| `uk`   | `UA`                     | Ukraine 526, Moderate                                                                                                 | Browser/device language                                                  |
| `ur`   | `PK`, `IN`               | Pakistan 493, Moderate; India 484, Moderate                                                                           | Browser/device language                                                  |
| `vi`   | `VN`                     | Vietnam 500, Moderate                                                                                                 | Browser/device language                                                  |
| `zh`   | `CN`, `HK`, `SG`         | China 464, Moderate; Hong Kong 538, Moderate; Singapore Census 2020: English most frequently spoken at home for 48.3% | English in `SG`; browser/device language in `CN`, `HK` and other regions |

Only the positive overrides are encoded in runtime logic. All other regions continue to prefer the browser/device language when it matches one of the supported locale codes.
