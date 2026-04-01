# Az i18n alapértelmezett nyelvi szabályzata

A névtelen látogatók most a következő sorrendben oldják meg a nyelvet:

1. `?lang=` lekérdezési param
2. Mentett nyelvválasztó választás a `localStorage`-tól
3. Régiótudatos névtelen alapértelmezés:
   - kényszeríteni az angol nyelvet a kifejezetten felsorolt angol nyelvű régiókban
   - egyébként használja a böngésző/eszköz nyelvét, ha az egyik támogatott területünk
4. Térjen vissza a következőre: `en`

## Forrás Alapállapot

- [EF angol nyelvismereti index 2025](https://www.ef.edu/epi/) országszintű angol nyelvtudáshoz
- [Szingapúri népszámlálás, 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) for Singapore, where English was the most frequently spoken home language for 48.3% of residents aged 5+

## Kódolt angol-alapértelmezett régiók

A `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `PT`, `RO`OL ZXQHELYETARTÓ17ZXQ

## Területi áttekintés

| Nyelv | Felülvizsgált régiók     | Legújabb jel                                                                                                             | Eredmény                                                                  |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `ar`  | `AE`                     | UAE EF EPI 2025: 487, Mérsékelt                                                                                          | Böngésző/eszköz nyelve                                                    |
| `bn`  | `BD`, `IN`               | Banglades 506, közepes; India 484, Mérsékelt                                                                             | Böngésző/eszköz nyelve                                                    |
| `ca`  | `ES`                     | Spanyolország 540, közepes                                                                                               | Böngésző/eszköz nyelve                                                    |
| `cs`  | `CZ`                     | Csehország 582, Magas                                                                                                    | angol nyelven: `CZ`                                                       |
| `da`  | `DK`                     | Dánia 611, Nagyon magas                                                                                                  | angol nyelven: `DK`                                                       |
| `de`  | `DE`, `AT`, `CH`         | Németország 615, Nagyon magas; Ausztria 616, Nagyon magas; Svájc 564, High                                               | angol nyelven: `DE`, `AT`, `CH`                                           |
| `el`  | `GR`, `CY`               | Görögország 592, Magas; Ciprus 537, közepes                                                                              | angol nyelven: `GR`; böngésző/eszköz nyelve `CY`                          |
| `en`  | Angol többségű területek | A böngésző/eszköz területi beállításai már a következőt jelzik: `en-*` a gyakori esetben                                 | Az angol továbbra is alapértelmezett                                      |
| `es`  | `ES`                     | Spanyolország 540, közepes                                                                                               | Böngésző/eszköz nyelve                                                    |
| `fa`  | `IR`                     | Irán 492, Mérsékelt                                                                                                      | Böngésző/eszköz nyelve                                                    |
| `fi`  | `FI`                     | Finnország 603, Nagyon magas                                                                                             | angol nyelven: `FI`                                                       |
| `fil` | `PH`                     | Fülöp-szigetek 569, High                                                                                                 | angol nyelven: `PH`                                                       |
| `fr`  | `FR`, `BE`, `CH`         | Franciaország 539, Mérsékelt; Belgium 608, Nagyon magas; Svájc 564, High                                                 | angol nyelven: `BE`, `CH`; böngésző/eszköz nyelve a `FR`                  |
| `he`  | `IL`                     | Izrael 524, Mérsékelt                                                                                                    | Böngésző/eszköz nyelve                                                    |
| `hi`  | `IN`                     | India 484, Mérsékelt                                                                                                     | Böngésző/eszköz nyelve                                                    |
| `hu`  | `HU`                     | Magyarország 590, Magas                                                                                                  | angol nyelven: `HU`                                                       |
| `id`  | `ID`                     | Indonézia 471, Mérsékelt                                                                                                 | Böngésző/eszköz nyelve                                                    |
| `it`  | `IT`, `CH`               | Olaszország 513, Mérsékelt; Svájc 564, High                                                                              | angol nyelven: `CH`; böngésző/eszköz nyelve `IT`                          |
| `ja`  | `JP`                     | Japán 446, Nagyon alacsony                                                                                               | Böngésző/eszköz nyelve                                                    |
| `ko`  | `KR`                     | Dél-Korea 522, közepes                                                                                                   | Böngésző/eszköz nyelve                                                    |
| `mr`  | `IN`                     | India 484, Mérsékelt                                                                                                     | Böngésző/eszköz nyelve                                                    |
| `nl`  | `NL`, `BE`               | Hollandia 624, Nagyon magas; Belgium 608, Nagyon magas                                                                   | angol nyelven: `NL`, `BE`                                                 |
| `no`  | `NO`                     | Norvégia 613, Nagyon magas                                                                                               | angol nyelven: `NO`                                                       |
| `pl`  | `PL`                     | Lengyelország 600, Nagyon magas                                                                                          | angol nyelven: `PL`                                                       |
| `pt`  | `PT`, `BR`               | Portugália 612, Nagyon magas; Brazília 482, Mérsékelt                                                                    | angol nyelven: `PT`; böngésző/eszköz nyelve `BR`                          |
| `ro`  | `RO`, `MD`               | Románia 605, Nagyon magas; Moldova 531, Mérsékelt                                                                        | angol nyelven: `RO`; böngésző/eszköz nyelve `MD`                          |
| `ru`  | `RU`                     | Oroszország 521, Mérsékelt                                                                                               | Böngésző/eszköz nyelve                                                    |
| `sq`  | `AL`                     | Albánia 532, Mérsékelt                                                                                                   | Böngésző/eszköz nyelve                                                    |
| `sv`  | `SE`, `FI`               | Svédország 609, Nagyon magas; Finnország 603, Nagyon magas                                                               | angol nyelven: `SE`, `FI`                                                 |
| `te`  | `IN`                     | India 484, Mérsékelt                                                                                                     | Böngésző/eszköz nyelve                                                    |
| `th`  | `TH`                     | Thaiföld 402, Nagyon alacsony                                                                                            | Böngésző/eszköz nyelve                                                    |
| `tr`  | `TR`                     | Turkiye 488, Mérsékelt                                                                                                   | Böngésző/eszköz nyelve                                                    |
| `uk`  | `UA`                     | Ukrajna 526, Mérsékelt                                                                                                   | Böngésző/eszköz nyelve                                                    |
| `ur`  | `PK`, `IN`               | Pakisztán 493, Mérsékelt; India 484, Mérsékelt                                                                           | Böngésző/eszköz nyelve                                                    |
| `vi`  | `VN`                     | Vietnam 500, közepes                                                                                                     | Böngésző/eszköz nyelve                                                    |
| `zh`  | `CN`, `HK`, `SG`         | Kína 464, Mérsékelt; Hong Kong 538, közepes; Szingapúri népszámlálás 2020: az otthon leggyakrabban beszélt angolul 48,3% | angol nyelven: `SG`; böngésző/eszköz nyelve a `CN`, `HK` és más régiókban |

Csak a pozitív felülírások vannak kódolva a futásidejű logikában. Az összes többi régió továbbra is a böngésző/eszköz nyelvét részesíti előnyben, ha az megfelel valamelyik támogatott nyelvi kódnak.
