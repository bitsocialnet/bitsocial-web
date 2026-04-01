# Výchozí jazykové zásady i18n

Anonymní návštěvníci nyní rozlišují jazyk v tomto pořadí:

1. `?lang=` parametr dotazu
2. Uložená volba volby jazyka ze `localStorage`
3. Výchozí anonymní nastavení s ohledem na region:
   - vynutit angličtinu v výslovně uvedených regionech s vysokou angličtinou
   - jinak použijte jazyk prohlížeče/zařízení, pokud je jedním z našich podporovaných lokalit
4. Vraťte se k `en`

## Výchozí základní linie

- [EF index angličtiny 2025](https://www.ef.edu/epi/) pro znalost angličtiny na úrovni země
- [Singapurské sčítání lidu 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) pro Singapur, kde angličtina byla nejčastěji používaným domácím jazykem pro 48,3 % obyvatel ve věku 5+

## Encoded English-Default Regions

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, ZX7ZQZPLACEXH `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, ZXERQPLACEHOLDERXQ15Z16ZQ,XQ `SG`

## Kontrola národního prostředí

| Locale | Revidované regiony           | Nejnovější signál                                                                                                      | Výsledek                                                                      |
| ------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ar`   | `AE`                         | UAE EF EPI 2025: 487, střední                                                                                          | Jazyk prohlížeče/zařízení                                                     |
| `bn`   | `BD`, `IN`                   | Bangladéš 506, střední; Indie 484, střední                                                                             | Jazyk prohlížeče/zařízení                                                     |
| `ca`   | `ES`                         | Španělsko 540, střední                                                                                                 | Jazyk prohlížeče/zařízení                                                     |
| `cs`   | `CZ`                         | Česko 582, Vysoká                                                                                                      | Angličtina v `CZ`                                                             |
| `da`   | `DK`                         | Dánsko 611, Velmi vysoká                                                                                               | Angličtina v `DK`                                                             |
| `de`   | `DE`, `AT`, `CH`             | Německo 615, Velmi vysoká; Rakousko 616, Velmi vysoká; Švýcarsko 564, Vysoká                                           | Angličtina v `DE`, `AT`, `CH`                                                 |
| `el`   | `GR`, `CY`                   | Řecko 592, vys.; Kypr 537, střední                                                                                     | angličtina v `GR`; jazyk prohlížeče/zařízení v `CY`                           |
| `en`   | Jazyky s většinou angličtiny | Národní prostředí prohlížeče/zařízení již hlásí `en-*` v běžném případě                                                | Angličtina zůstává výchozí                                                    |
| `es`   | `ES`                         | Španělsko 540, střední                                                                                                 | Jazyk prohlížeče/zařízení                                                     |
| `fa`   | `IR`                         | Írán 492, střední                                                                                                      | Jazyk prohlížeče/zařízení                                                     |
| `fi`   | `FI`                         | Finsko 603, Velmi vysoká                                                                                               | Angličtina v `FI`                                                             |
| `fil`  | `PH`                         | Filipíny 569, vysoká                                                                                                   | Angličtina v `PH`                                                             |
| `fr`   | `FR`, `BE`, `CH`             | Francie 539, střední; Belgie 608, Velmi vysoká; Švýcarsko 564, Vysoká                                                  | angličtina v `BE`, `CH`; jazyk prohlížeče/zařízení v `FR`                     |
| `he`   | `IL`                         | Izrael 524, střední                                                                                                    | Jazyk prohlížeče/zařízení                                                     |
| `hi`   | `IN`                         | Indie 484, střední                                                                                                     | Jazyk prohlížeče/zařízení                                                     |
| `hu`   | `HU`                         | Maďarsko 590, Vysoká                                                                                                   | Angličtina v `HU`                                                             |
| `id`   | `ID`                         | Indonésie 471, střední                                                                                                 | Jazyk prohlížeče/zařízení                                                     |
| `it`   | `IT`, `CH`                   | Itálie 513, střední; Švýcarsko 564, Vysoká                                                                             | angličtina v `CH`; jazyk prohlížeče/zařízení v `IT`                           |
| `ja`   | `JP`                         | Japonsko 446, Velmi nízká                                                                                              | Jazyk prohlížeče/zařízení                                                     |
| `ko`   | `KR`                         | Jižní Korea 522, střední                                                                                               | Jazyk prohlížeče/zařízení                                                     |
| `mr`   | `IN`                         | Indie 484, střední                                                                                                     | Jazyk prohlížeče/zařízení                                                     |
| `nl`   | `NL`, `BE`                   | Nizozemsko 624, Velmi vysoká; Belgie 608, Velmi vysoká                                                                 | Angličtina v `NL`, `BE`                                                       |
| `no`   | `NO`                         | Norsko 613, Velmi vysoká                                                                                               | Angličtina v `NO`                                                             |
| `pl`   | `PL`                         | Polsko 600, Velmi vysoká                                                                                               | Angličtina v `PL`                                                             |
| `pt`   | `PT`, `BR`                   | Portugalsko 612, Velmi vysoká; Brazílie 482, střední                                                                   | angličtina v `PT`; jazyk prohlížeče/zařízení v `BR`                           |
| `ro`   | `RO`, `MD`                   | Rumunsko 605, Velmi vysoká; Moldavsko 531, Střední                                                                     | angličtina v `RO`; jazyk prohlížeče/zařízení v `MD`                           |
| `ru`   | `RU`                         | Rusko 521, střední                                                                                                     | Jazyk prohlížeče/zařízení                                                     |
| `sq`   | `AL`                         | Albánie 532, střední                                                                                                   | Jazyk prohlížeče/zařízení                                                     |
| `sv`   | `SE`, `FI`                   | Švédsko 609, Velmi vysoká; Finsko 603, Velmi vysoká                                                                    | Angličtina v `SE`, `FI`                                                       |
| `te`   | `IN`                         | Indie 484, střední                                                                                                     | Jazyk prohlížeče/zařízení                                                     |
| `th`   | `TH`                         | Thajsko 402, Velmi nízká                                                                                               | Jazyk prohlížeče/zařízení                                                     |
| `tr`   | `TR`                         | Turkiye 488, střední                                                                                                   | Jazyk prohlížeče/zařízení                                                     |
| `uk`   | `UA`                         | Ukrajina 526, střední                                                                                                  | Jazyk prohlížeče/zařízení                                                     |
| `ur`   | `PK`, `IN`                   | Pákistán 493, střední; Indie 484, střední                                                                              | Jazyk prohlížeče/zařízení                                                     |
| `vi`   | `VN`                         | Vietnam 500, střední                                                                                                   | Jazyk prohlížeče/zařízení                                                     |
| `zh`   | `CN`, `HK`, `SG`             | Čína 464, střední; Hong Kong 538, střední; Singapurské sčítání lidu 2020: Doma se nejčastěji mluví anglicky pro 48,3 % | angličtina v `SG`; jazyk prohlížeče/zařízení v `CN`, `HK` a dalších regionech |

V runtime logice jsou zakódována pouze pozitivní přepisy. Všechny ostatní oblasti nadále preferují jazyk prohlížeče/zařízení, pokud odpovídá jednomu z podporovaných kódů národního prostředí.
