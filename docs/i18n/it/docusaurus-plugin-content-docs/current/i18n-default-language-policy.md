# Politica sulla lingua predefinita di i18n

I visitatori anonimi ora risolvono la lingua in questo ordine:

1. `?lang=` parametro query
2. Scelta del selettore della lingua salvata da `localStorage`
3. Predefinito anonimo regionale:
   - forza l'inglese nelle regioni a prevalenza inglese elencate esplicitamente
   - altrimenti utilizza il lingua del browser/dispositivo quando è una delle impostazioni locali supportate
4. Ricadi su `en`

## Base di riferimento

- [Indice di conoscenza dell'inglese EF 2025](https://www.ef.edu/epi/) per la competenza in inglese a livello di paese
- [Censimento di Singapore 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) per Singapore, dove l'inglese era la lingua parlata più frequentemente dal 48,3% dei residenti di età pari o superiore a 5 anni

## Regioni con codifica inglese predefinita

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Revisione locale

| Località | Regioni recensite            | Ultimo segnale                                                                                                                    | Risultato                                                                     |
| -------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ar`     | `AE`                         | EF EPI 2025 degli Emirati Arabi Uniti: 487, moderato                                                                              | Lingua del browser/dispositivo                                                |
| `bn`     | `BD`, `IN`                   | Bangladesh 506, moderato; India 484, Moderato                                                                                     | Lingua del browser/dispositivo                                                |
| `ca`     | `ES`                         | Spagna 540, Moderato                                                                                                              | Lingua del browser/dispositivo                                                |
| `cs`     | `CZ`                         | Repubblica Ceca 582, Alto                                                                                                         | Inglese in `CZ`                                                               |
| `da`     | `DK`                         | Danimarca 611, Molto alto                                                                                                         | Inglese in `DK`                                                               |
| `de`     | `DE`, `AT`, `CH`             | Germania 615, Molto alto; Austria 616, Molto alto; Svizzera 564, Alto                                                             | Inglese in `DE`, `AT`, `CH`                                                   |
| `el`     | `GR`, `CY`                   | Grecia 592, Alto; Cipro 537, Moderato                                                                                             | Inglese in `GR`; lingua del browser/dispositivo in `CY`                       |
| `en`     | Locali a maggioranza inglese | La locale del browser/dispositivo riporta già `en-*` nel caso comune                                                              | L'inglese rimane quello predefinito                                           |
| `es`     | `ES`                         | Spagna 540, Moderato                                                                                                              | Lingua del browser/dispositivo                                                |
| `fa`     | `IR`                         | Iran 492, Moderato                                                                                                                | Lingua del browser/dispositivo                                                |
| `fi`     | `FI`                         | Finlandia 603, Molto alto                                                                                                         | Inglese in `FI`                                                               |
| `fil`    | `PH`                         | Filippine 569, Alto                                                                                                               | Inglese in `PH`                                                               |
| `fr`     | `FR`, `BE`, `CH`             | Francia 539, Moderato; Belgio 608, Molto alto; Svizzera 564, Alto                                                                 | Inglese in `BE`, `CH`; lingua del browser/dispositivo in `FR`                 |
| `he`     | `IL`                         | Israele 524, Moderato                                                                                                             | Lingua del browser/dispositivo                                                |
| `hi`     | `IN`                         | India 484, Moderato                                                                                                               | Lingua del browser/dispositivo                                                |
| `hu`     | `HU`                         | Ungheria 590, Alto                                                                                                                | Inglese in `HU`                                                               |
| `id`     | `ID`                         | Indonesia 471, Moderato                                                                                                           | Lingua del browser/dispositivo                                                |
| `it`     | `IT`, `CH`                   | Italia 513, Moderato; Svizzera 564, Alto                                                                                          | Inglese in `CH`; lingua del browser/dispositivo in `IT`                       |
| `ja`     | `JP`                         | Giappone 446, Molto basso                                                                                                         | Lingua del browser/dispositivo                                                |
| `ko`     | `KR`                         | Corea del Sud 522, Moderato                                                                                                       | Lingua del browser/dispositivo                                                |
| `mr`     | `IN`                         | India 484, Moderato                                                                                                               | Lingua del browser/dispositivo                                                |
| `nl`     | `NL`, `BE`                   | Paesi Bassi 624, Molto alto; Belgio 608, Molto alto                                                                               | Inglese in `NL`, `BE`                                                         |
| `no`     | `NO`                         | Norvegia 613, Molto alto                                                                                                          | Inglese in `NO`                                                               |
| `pl`     | `PL`                         | Polonia 600, Molto alto                                                                                                           | Inglese in `PL`                                                               |
| `pt`     | `PT`, `BR`                   | Portogallo 612, Molto alto; Brasile 482, Moderato                                                                                 | Inglese in `PT`; lingua del browser/dispositivo in `BR`                       |
| `ro`     | `RO`, `MD`                   | Romania 605, Molto alto; Moldavia 531, Moderato                                                                                   | Inglese in `RO`; lingua del browser/dispositivo in `MD`                       |
| `ru`     | `RU`                         | Russia 521, Moderato                                                                                                              | Lingua del browser/dispositivo                                                |
| `sq`     | `AL`                         | Albania 532, Moderato                                                                                                             | Lingua del browser/dispositivo                                                |
| `sv`     | `SE`, `FI`                   | Svezia 609, Molto alto; Finlandia 603, Molto alto                                                                                 | Inglese in `SE`, `FI`                                                         |
| `te`     | `IN`                         | India 484, Moderato                                                                                                               | Lingua del browser/dispositivo                                                |
| `th`     | `TH`                         | Tailandia 402, Molto basso                                                                                                        | Lingua del browser/dispositivo                                                |
| `tr`     | `TR`                         | Turkiye 488, Moderato                                                                                                             | Lingua del browser/dispositivo                                                |
| `uk`     | `UA`                         | Ucraina 526, Moderato                                                                                                             | Lingua del browser/dispositivo                                                |
| `ur`     | `PK`, `IN`                   | Pakistan 493, moderato; India 484, Moderato                                                                                       | Lingua del browser/dispositivo                                                |
| `vi`     | `VN`                         | Vietnam 500, Moderato                                                                                                             | Lingua del browser/dispositivo                                                |
| `zh`     | `CN`, `HK`, `SG`             | Cina 464, Moderato; Hong Kong 538, moderato; Censimento di Singapore 2020: inglese parlato più frequentemente a casa per il 48,3% | Inglese in `SG`; lingua del browser/dispositivo in `CN`, `HK` e altre regioni |

Solo gli override positivi sono codificati nella logica di runtime. Tutte le altre regioni continuano a preferire la lingua del browser/dispositivo quando corrisponde a uno dei codici locali supportati.
