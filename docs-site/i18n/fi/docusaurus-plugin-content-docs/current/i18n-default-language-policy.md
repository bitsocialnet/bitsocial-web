# i18n-oletuskielikäytäntö

Anonyymit vierailijat ratkaisevat nyt kielen tässä järjestyksessä:

1. `?lang=` kyselyparam
2. Tallennettu kielenvalitsin `localStorage`
3. Aluetietoinen anonyymi oletus:
   - pakottaa englantia eksplisiittisesti luetelluilla englantilaisilla alueilla
   - muuten käytä selaimen/laitteen kieltä, kun se on yksi tuetuista kielistämme
4. Palaa takaisin kohtaan `en`

## Lähteen perusta

- [EF Englanti Proficiency Index 2025](https://www.ef.edu/epi/) maatason englannin taitotasolle
- [Singaporen väestönlaskenta 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) Singaporelle, jossa englanti oli useimmin puhuttu kotikieli 48,3 %:lle yli 5-vuotiaista asukkaista

## Koodatut englanninkieliset oletusalueet

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `FI`, `GR`, ZXQPLACEQOLDER7, ZXQPLACEQOLDER7 `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `PT`, ZXQPLACEHOLDER15QACEZQOL, `SG`

## Locale Review

| Alue  | Tarkistetut alueet               | Viimeisin signaali                                                                                                            | Tulos                                                                         |
| ----- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ar`  | `AE`                             | UAE EF EPI 2025: 487, kohtalainen                                                                                             | Selaimen/laitteen kieli                                                       |
| `bn`  | `BD`, `IN`                       | Bangladesh 506, kohtalainen; Intia 484, kohtalainen                                                                           | Selaimen/laitteen kieli                                                       |
| `ca`  | `ES`                             | Espanja 540, kohtalainen                                                                                                      | Selaimen/laitteen kieli                                                       |
| `cs`  | `CZ`                             | Tšekki 582, korkea                                                                                                            | Englanti kielellä `CZ`                                                        |
| `da`  | `DK`                             | Tanska 611, Erittäin korkea                                                                                                   | Englanti kielellä `DK`                                                        |
| `de`  | `DE`, `AT`, `CH`                 | Saksa 615, erittäin korkea; Itävalta 616, erittäin korkea; Sveitsi 564, korkea                                                | englanti kielillä `DE`, `AT`, `CH`                                            |
| `el`  | `GR`, `CY`                       | Kreikka 592, korkea; Kypros 537, kohtalainen                                                                                  | Englanti kielellä `GR`; selaimen/laitteen kieli `CY`                          |
| `en`  | Enemmistökieliset englantilaiset | Selain/laite maa-asetus ilmoittaa jo `en-*` yleisessä tapauksessa                                                             | Englanti pysyy oletuksena                                                     |
| `es`  | `ES`                             | Espanja 540, kohtalainen                                                                                                      | Selaimen/laitteen kieli                                                       |
| `fa`  | `IR`                             | Iran 492, kohtalainen                                                                                                         | Selaimen/laitteen kieli                                                       |
| `fi`  | `FI`                             | Suomi 603, Erittäin korkea                                                                                                    | Englanti kielellä `FI`                                                        |
| `fil` | `PH`                             | Filippiinit 569, High                                                                                                         | Englanti kielellä `PH`                                                        |
| `fr`  | `FR`, `BE`, `CH`                 | Ranska 539, kohtalainen; Belgia 608, erittäin korkea; Sveitsi 564, korkea                                                     | englanti kielillä `BE`, `CH`; selaimen/laitteen kieli `FR`                    |
| `he`  | `IL`                             | Israel 524, kohtalainen                                                                                                       | Selaimen/laitteen kieli                                                       |
| `hi`  | `IN`                             | Intia 484, kohtalainen                                                                                                        | Selaimen/laitteen kieli                                                       |
| `hu`  | `HU`                             | Unkari 590, korkea                                                                                                            | Englanti kielellä `HU`                                                        |
| `id`  | `ID`                             | Indonesia 471, kohtalainen                                                                                                    | Selaimen/laitteen kieli                                                       |
| `it`  | `IT`, `CH`                       | Italia 513, kohtalainen; Sveitsi 564, High                                                                                    | Englanti kielellä `CH`; selaimen/laitteen kieli `IT`                          |
| `ja`  | `JP`                             | Japani 446, Erittäin alhainen                                                                                                 | Selaimen/laitteen kieli                                                       |
| `ko`  | `KR`                             | Etelä-Korea 522, kohtalainen                                                                                                  | Selaimen/laitteen kieli                                                       |
| `mr`  | `IN`                             | Intia 484, kohtalainen                                                                                                        | Selaimen/laitteen kieli                                                       |
| `nl`  | `NL`, `BE`                       | Alankomaat 624, Erittäin korkea; Belgia 608, Erittäin korkea                                                                  | englanti kielellä `NL`, `BE`                                                  |
| `no`  | `NO`                             | Norja 613, Erittäin korkea                                                                                                    | Englanti kielellä `NO`                                                        |
| `pl`  | `PL`                             | Puola 600, Erittäin korkea                                                                                                    | Englanti kielellä `PL`                                                        |
| `pt`  | `PT`, `BR`                       | Portugali 612, Erittäin korkea; Brasilia 482, kohtalainen                                                                     | Englanti kielellä `PT`; selaimen/laitteen kieli `BR`                          |
| `ro`  | `RO`, `MD`                       | Romania 605, erittäin korkea; Moldova 531, kohtalainen                                                                        | Englanti kielellä `RO`; selaimen/laitteen kieli `MD`                          |
| `ru`  | `RU`                             | Venäjä 521, kohtalainen                                                                                                       | Selaimen/laitteen kieli                                                       |
| `sq`  | `AL`                             | Albania 532, kohtalainen                                                                                                      | Selaimen/laitteen kieli                                                       |
| `sv`  | `SE`, `FI`                       | Ruotsi 609, erittäin korkea; Suomi 603, Erittäin korkea                                                                       | englanti kielellä `SE`, `FI`                                                  |
| `te`  | `IN`                             | Intia 484, kohtalainen                                                                                                        | Selaimen/laitteen kieli                                                       |
| `th`  | `TH`                             | Thaimaa 402, Erittäin alhainen                                                                                                | Selaimen/laitteen kieli                                                       |
| `tr`  | `TR`                             | Turkiye 488, kohtalainen                                                                                                      | Selaimen/laitteen kieli                                                       |
| `uk`  | `UA`                             | Ukraina 526, kohtalainen                                                                                                      | Selaimen/laitteen kieli                                                       |
| `ur`  | `PK`, `IN`                       | Pakistan 493, kohtalainen; Intia 484, kohtalainen                                                                             | Selaimen/laitteen kieli                                                       |
| `vi`  | `VN`                             | Vietnam 500, kohtalainen                                                                                                      | Selaimen/laitteen kieli                                                       |
| `zh`  | `CN`, `HK`, `SG`                 | Kiina 464, kohtalainen; Hong Kong 538, kohtalainen; Singaporen väestönlaskenta 2020: Englantia puhui eniten kotona 48,3 %:lla | Englanti kielellä `SG`; selaimen/laitteen kieli `CN`, `HK` ja muilla alueilla |

Vain positiiviset ohitukset on koodattu ajonaikaiseen logiikkaan. Kaikki muut alueet suosivat edelleen selaimen/laitteen kieltä, kun se vastaa jotakin tuetuista aluekoodeista.
