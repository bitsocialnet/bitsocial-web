# i18n Política lingüística per defecte

Els visitants anònims ara resolen l'idioma en aquest ordre:

1. `?lang=` paràmetre de consulta
2. Selector d'idioma desat des de `localStorage`
3. Anònim predeterminat per a la regió:
   - forçar l'anglès a les regions d'anglès explícitament enumerades
   - en cas contrari, utilitzeu l'idioma del navegador/dispositiu quan sigui un dels nostres locals admesos
4. Torna a `en`

## Font de referència

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) per al domini de l'anglès a nivell de país
- [Singapore Census 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) per a Singapur, on l'anglès era la llengua familiar més parlada per al 48,3% dels residents de més de 5 anys

## Regions per defecte codificades en anglès

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Revisió de la configuració regional

| Localització | Regions revisades         | Últim senyal                                                                                                                 | Resultat                                                                      |
| ------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ar`         | `AE`                      | Emirats Àrabs Units EF EPI 2025: 487, Moderat                                                                                | Idioma del navegador/dispositiu                                               |
| `bn`         | `BD`, `IN`                | Bangla Desh 506, Moderat; Índia 484, Moderat                                                                                 | Idioma del navegador/dispositiu                                               |
| `ca`         | `ES`                      | Espanya 540, Moderat                                                                                                         | Idioma del navegador/dispositiu                                               |
| `cs`         | `CZ`                      | Txeca 582, Alt                                                                                                               | Anglès a `CZ`                                                                 |
| `da`         | `DK`                      | Dinamarca 611, Molt alt                                                                                                      | Anglès a `DK`                                                                 |
| `de`         | `DE`, `AT`, `CH`          | Alemanya 615, Molt alt; Àustria 616, Molt alt; Suïssa 564, Alta                                                              | Anglès a `DE`, `AT`, `CH`                                                     |
| `el`         | `GR`, `CY`                | Grècia 592, Alt; Xipre 537, Moderat                                                                                          | Anglès en `GR`; Idioma del navegador/dispositiu en `CY`                       |
| `en`         | Locals de majoria anglesa | La configuració regional del navegador/dispositiu ja informa `en-*` en el cas habitual                                       | L'anglès continua sent per defecte                                            |
| `es`         | `ES`                      | Espanya 540, Moderat                                                                                                         | Idioma del navegador/dispositiu                                               |
| `fa`         | `IR`                      | Iran 492, Moderat                                                                                                            | Idioma del navegador/dispositiu                                               |
| `fi`         | `FI`                      | Finlàndia 603, Molt alt                                                                                                      | Anglès a `FI`                                                                 |
| `fil`        | `PH`                      | Filipines 569, alt                                                                                                           | Anglès a `PH`                                                                 |
| `fr`         | `FR`, `BE`, `CH`          | França 539, Moderat; Bèlgica 608, Molt alt; Suïssa 564, Alta                                                                 | Anglès en `BE`, `CH`; Idioma del navegador/dispositiu en `FR`                 |
| `he`         | `IL`                      | Israel 524, Moderat                                                                                                          | Idioma del navegador/dispositiu                                               |
| `hi`         | `IN`                      | Índia 484, Moderat                                                                                                           | Idioma del navegador/dispositiu                                               |
| `hu`         | `HU`                      | Hongria 590, Alt                                                                                                             | Anglès a `HU`                                                                 |
| `id`         | `ID`                      | Indonèsia 471, Moderat                                                                                                       | Idioma del navegador/dispositiu                                               |
| `it`         | `IT`, `CH`                | Itàlia 513, Moderat; Suïssa 564, Alta                                                                                        | Anglès en `CH`; Idioma del navegador/dispositiu en `IT`                       |
| `ja`         | `JP`                      | Japó 446, molt baix                                                                                                          | Idioma del navegador/dispositiu                                               |
| `ko`         | `KR`                      | Corea del Sud 522, Moderat                                                                                                   | Idioma del navegador/dispositiu                                               |
| `mr`         | `IN`                      | Índia 484, Moderat                                                                                                           | Idioma del navegador/dispositiu                                               |
| `nl`         | `NL`, `BE`                | Països Baixos 624, Molt alt; Bèlgica 608, Molt alt                                                                           | Anglès a `NL`, `BE`                                                           |
| `no`         | `NO`                      | Noruega 613, molt alt                                                                                                        | Anglès a `NO`                                                                 |
| `pl`         | `PL`                      | Polònia 600, Molt alt                                                                                                        | Anglès a `PL`                                                                 |
| `pt`         | `PT`, `BR`                | Portugal 612, Molt alt; Brasil 482, Moderat                                                                                  | Anglès en `PT`; Idioma del navegador/dispositiu en `BR`                       |
| `ro`         | `RO`, `MD`                | Romania 605, Molt alt; Moldàvia 531, Moderat                                                                                 | Anglès en `RO`; Idioma del navegador/dispositiu en `MD`                       |
| `ru`         | `RU`                      | Rússia 521, Moderat                                                                                                          | Idioma del navegador/dispositiu                                               |
| `sq`         | `AL`                      | Albània 532, Moderat                                                                                                         | Idioma del navegador/dispositiu                                               |
| `sv`         | `SE`, `FI`                | Suècia 609, Molt alt; Finlàndia 603, Molt alt                                                                                | Anglès a `SE`, `FI`                                                           |
| `te`         | `IN`                      | Índia 484, Moderat                                                                                                           | Idioma del navegador/dispositiu                                               |
| `th`         | `TH`                      | Tailàndia 402, molt baix                                                                                                     | Idioma del navegador/dispositiu                                               |
| `tr`         | `TR`                      | Turkiye 488, Moderat                                                                                                         | Idioma del navegador/dispositiu                                               |
| `uk`         | `UA`                      | Ucraïna 526, Moderat                                                                                                         | Idioma del navegador/dispositiu                                               |
| `ur`         | `PK`, `IN`                | Pakistan 493, Moderat; Índia 484, Moderat                                                                                    | Idioma del navegador/dispositiu                                               |
| `vi`         | `VN`                      | Vietnam 500, Moderat                                                                                                         | Idioma del navegador/dispositiu                                               |
| `zh`         | `CN`, `HK`, `SG`          | Xina 464, Moderat; Hong Kong 538, Moderat; Cens de Singapur 2020: anglès que es parla amb més freqüència a casa per un 48,3% | Anglès en `SG`; Idioma del navegador/dispositiu a `CN`, `HK` i altres regions |

Només les substitucions positives es codifiquen a la lògica d'execució. Totes les altres regions continuen preferint l'idioma del navegador/dispositiu quan coincideix amb un dels codis locals admesos.
