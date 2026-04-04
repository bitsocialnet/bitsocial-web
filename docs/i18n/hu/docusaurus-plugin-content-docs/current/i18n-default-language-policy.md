# Az i18n alapértelmezett nyelvi szabályzata

A névtelen látogatók most a következő sorrendben oldják meg a nyelvet:

1. `?lang=` lekérdezési paraméter
2. Mentett nyelvválasztó választás a `localStorage` címről
3. Régiótudatos névtelen alapértelmezés:
   - kényszeríteni az angol nyelvet a kifejezetten felsorolt ​​angol nyelvű régiókban
   - egyébként használja a böngésző/eszköz nyelvét, ha az egyik támogatott területünk
4. Vissza a `en` címre

## Forrás Alapállapot

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) az országos szintű angol nyelvtudáshoz
- [Singapore Census 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) Szingapúr esetében, ahol az 5 év felettiek 48,3%-a az angol volt a leggyakrabban beszélt otthoni nyelv

## Kódolt angol-alapértelmezett régiók

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Területi áttekintés

| Nyelv | Áttekintett régiók        | Legújabb jel                                                                                                                  | Eredmény                                                               |
| ----- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `ar`  | `AE`                      | UAE EF EPI 2025: 487, Mérsékelt                                                                                               | A böngésző/eszköz nyelve                                               |
| `bn`  | `BD`, `IN`                | Banglades 506, közepes; India 484, közepes                                                                                    | A böngésző/eszköz nyelve                                               |
| `ca`  | `ES`                      | Spanyolország 540, Mérsékelt                                                                                                  | A böngésző/eszköz nyelve                                               |
| `cs`  | `CZ`                      | Csehország 582, magas                                                                                                         | angolul `CZ`                                                           |
| `da`  | `DK`                      | Dánia 611, Nagyon magas                                                                                                       | angolul `DK`                                                           |
| `de`  | `DE`, `AT`, `CH`          | Németország 615, Nagyon magas; Ausztria 616, Nagyon magas; Svájc 564, High                                                    | angol nyelven `DE`, `AT`, `CH`                                         |
| `el`  | `GR`, `CY`                | Görögország 592, Magas; Ciprus 537, Mérsékelt                                                                                 | angol nyelven `GR`; böngésző/eszköz nyelve `CY`                        |
| `en`  | Angol többségű helyszínek | A böngésző/eszköz területi beállítása általános esetben már a `en-*` jelentést jelzi                                          | Az angol továbbra is az alapértelmezett                                |
| `es`  | `ES`                      | Spanyolország 540, Mérsékelt                                                                                                  | A böngésző/eszköz nyelve                                               |
| `fa`  | `IR`                      | Irán 492, Mérsékelt                                                                                                           | A böngésző/eszköz nyelve                                               |
| `fi`  | `FI`                      | Finnország 603, nagyon magas                                                                                                  | angolul `FI`                                                           |
| `fil` | `PH`                      | Fülöp 569, High                                                                                                               | angolul `PH`                                                           |
| `fr`  | `FR`, `BE`, `CH`          | Franciaország 539, Mérsékelt; Belgium 608, Nagyon magas; Svájc 564, High                                                      | angol nyelven `BE`, `CH`; böngésző/eszköz nyelve `FR`                  |
| `he`  | `IL`                      | Izrael 524, Mérsékelt                                                                                                         | A böngésző/eszköz nyelve                                               |
| `hi`  | `IN`                      | India 484, közepes                                                                                                            | A böngésző/eszköz nyelve                                               |
| `hu`  | `HU`                      | Magyarország 590, Magas                                                                                                       | angolul `HU`                                                           |
| `id`  | `ID`                      | Indonézia 471, Mérsékelt                                                                                                      | A böngésző/eszköz nyelve                                               |
| `it`  | `IT`, `CH`                | Olaszország 513, Mérsékelt; Svájc 564, High                                                                                   | angol nyelven `CH`; böngésző/eszköz nyelve `IT`                        |
| `ja`  | `JP`                      | Japán 446, Nagyon alacsony                                                                                                    | A böngésző/eszköz nyelve                                               |
| `ko`  | `KR`                      | Dél-Korea 522, közepes                                                                                                        | A böngésző/eszköz nyelve                                               |
| `mr`  | `IN`                      | India 484, közepes                                                                                                            | A böngésző/eszköz nyelve                                               |
| `nl`  | `NL`, `BE`                | Hollandia 624, Nagyon magas; Belgium 608, Nagyon magas                                                                        | angolul `NL`, `BE`                                                     |
| `no`  | `NO`                      | Norvégia 613, Nagyon magas                                                                                                    | angolul `NO`                                                           |
| `pl`  | `PL`                      | Lengyelország 600, nagyon magas                                                                                               | angolul `PL`                                                           |
| `pt`  | `PT`, `BR`                | Portugália 612, Nagyon magas; Brazília 482, közepes                                                                           | angol nyelven `PT`; böngésző/eszköz nyelve `BR`                        |
| `ro`  | `RO`, `MD`                | Románia 605, Nagyon magas; Moldova 531, Mérsékelt                                                                             | angol nyelven `RO`; böngésző/eszköz nyelve `MD`                        |
| `ru`  | `RU`                      | Oroszország 521, Mérsékelt                                                                                                    | A böngésző/eszköz nyelve                                               |
| `sq`  | `AL`                      | Albánia 532, Mérsékelt                                                                                                        | A böngésző/eszköz nyelve                                               |
| `sv`  | `SE`, `FI`                | Svédország 609, Nagyon magas; Finnország 603, nagyon magas                                                                    | angolul `SE`, `FI`                                                     |
| `te`  | `IN`                      | India 484, közepes                                                                                                            | A böngésző/eszköz nyelve                                               |
| `th`  | `TH`                      | Thaiföld 402, Nagyon alacsony                                                                                                 | A böngésző/eszköz nyelve                                               |
| `tr`  | `TR`                      | Turkiye 488, Mérsékelt                                                                                                        | A böngésző/eszköz nyelve                                               |
| `uk`  | `UA`                      | Ukrajna 526, Mérsékelt                                                                                                        | A böngésző/eszköz nyelve                                               |
| `ur`  | `PK`, `IN`                | Pakisztán 493, Mérsékelt; India 484, közepes                                                                                  | A böngésző/eszköz nyelve                                               |
| `vi`  | `VN`                      | Vietnam 500, közepes                                                                                                          | A böngésző/eszköz nyelve                                               |
| `zh`  | `CN`, `HK`, `SG`          | Kína 464, Mérsékelt; Hong Kong 538, közepes; Szingapúri népszámlálás 2020: 48,3%-uk beszél otthonában a leggyakrabban angolul | angol nyelven `SG`; böngésző/eszköz nyelve `CN`, `HK` és más régiókban |

Csak a pozitív felülírások vannak kódolva a futásidejű logikában. Az összes többi régió továbbra is a böngésző/eszköz nyelvét részesíti előnyben, ha az megfelel valamelyik támogatott nyelvi kódnak.
