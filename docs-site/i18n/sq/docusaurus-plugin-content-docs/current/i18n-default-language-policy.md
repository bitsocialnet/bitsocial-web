# i18n Politika e parazgjedhur e gjuhës

Vizitorët anonimë tani e zgjidhin gjuhën në këtë renditje:

1. Parametri i pyetjes `?lang=`
2. Zgjedhja e përzgjedhësit të gjuhës u ruajt nga `localStorage`
3. Parazgjedhja anonime e vetëdijshme për rajonin:
   - detyrojnë anglishten në rajonet e renditura në mënyrë eksplicite me anglisht të rëndë
   - përndryshe përdorni gjuhën e shfletuesit/pajisjes kur është një nga vendndodhjet tona të mbështetura
4. Kthehu te `en`

## Baza e burimit

- [Indeksi i aftësive angleze EF 2025](https://www.ef.edu/epi/) për aftësi të gjuhës angleze në nivel vendi
- [Regjistrimi i Singaporit 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) për Singaporin, ku anglishtja ishte gjuha e shtëpisë më e folur për 48.3% të banorëve të moshës 5+

## Rajonet e koduara në anglisht me parazgjedhje

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Rishikimi lokal

| Lokal | Rajonet e shqyrtuara      | Sinjali i fundit                                                                                                                 | Rezultati                                                                        |
| ----- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `ar`  | `AE`                      | Emiratet e Bashkuara Arabe EF EPI 2025: 487, E moderuar                                                                          | Gjuha e shfletuesit/pajisjes                                                     |
| `bn`  | `BD`, `IN`                | Bangladesh 506, E moderuar; India 484, E moderuar                                                                                | Gjuha e shfletuesit/pajisjes                                                     |
| `ca`  | `ES`                      | Spanja 540, E moderuar                                                                                                           | Gjuha e shfletuesit/pajisjes                                                     |
| `cs`  | `CZ`                      | Czechia 582, Lartë                                                                                                               | Anglisht në `CZ`                                                                 |
| `da`  | `DK`                      | Danimarkë 611, Shumë e lartë                                                                                                     | Anglisht në `DK`                                                                 |
| `de`  | `DE`, `AT`, `CH`          | Gjermani 615, Shumë e lartë; Austria 616, Shumë e lartë; Switzerland 564, Lartë                                                  | Anglisht në `DE`, `AT`, `CH`                                                     |
| `el`  | `GR`, `CY`                | Greece 592, High; Qipro 537, E moderuar                                                                                          | anglisht në `GR`; gjuha e shfletuesit/pajisjes në `CY`                           |
| `en`  | Vendet me shumicë angleze | Vendndodhja e shfletuesit/pajisjes tashmë raporton `en-*` në rastin e zakonshëm                                                  | Anglishtja mbetet e paracaktuar                                                  |
| `es`  | `ES`                      | Spanja 540, E moderuar                                                                                                           | Gjuha e shfletuesit/pajisjes                                                     |
| `fa`  | `IR`                      | Iran 492, E moderuar                                                                                                             | Gjuha e shfletuesit/pajisjes                                                     |
| `fi`  | `FI`                      | Finlandë 603, Shumë e lartë                                                                                                      | Anglisht në `FI`                                                                 |
| `fil` | `PH`                      | Filipine 569, Lartë                                                                                                              | Anglisht në `PH`                                                                 |
| `fr`  | `FR`, `BE`, `CH`          | France 539, E moderuar; Belgjika 608, Shumë e lartë; Switzerland 564, Lartë                                                      | Anglisht në `BE`, `CH`; gjuha e shfletuesit/pajisjes në `FR`                     |
| `he`  | `IL`                      | Izrael 524, E moderuar                                                                                                           | Gjuha e shfletuesit/pajisjes                                                     |
| `hi`  | `IN`                      | India 484, E moderuar                                                                                                            | Gjuha e shfletuesit/pajisjes                                                     |
| `hu`  | `HU`                      | Hungari 590, Lartë                                                                                                               | Anglisht në `HU`                                                                 |
| `id`  | `ID`                      | Indonezi 471, E moderuar                                                                                                         | Gjuha e shfletuesit/pajisjes                                                     |
| `it`  | `IT`, `CH`                | Itali 513, E moderuar; Switzerland 564, Lartë                                                                                    | anglisht në `CH`; gjuha e shfletuesit/pajisjes në `IT`                           |
| `ja`  | `JP`                      | Japoni 446, Shumë e ulët                                                                                                         | Gjuha e shfletuesit/pajisjes                                                     |
| `ko`  | `KR`                      | Korea e Jugut 522, E moderuar                                                                                                    | Gjuha e shfletuesit/pajisjes                                                     |
| `mr`  | `IN`                      | India 484, E moderuar                                                                                                            | Gjuha e shfletuesit/pajisjes                                                     |
| `nl`  | `NL`, `BE`                | Holandë 624, Shumë e lartë; Belgjikë 608, Shumë e lartë                                                                          | Anglisht në `NL`, `BE`                                                           |
| `no`  | `NO`                      | Norvegji 613, Shumë e lartë                                                                                                      | Anglisht në `NO`                                                                 |
| `pl`  | `PL`                      | Polonia 600, Shumë e lartë                                                                                                       | Anglisht në `PL`                                                                 |
| `pt`  | `PT`, `BR`                | Portugalia 612, Shumë e lartë; Brazil 482, E moderuar                                                                            | anglisht në `PT`; gjuha e shfletuesit/pajisjes në `BR`                           |
| `ro`  | `RO`, `MD`                | Rumania 605, Shumë e lartë; Moldavia 531, E moderuar                                                                             | anglisht në `RO`; gjuha e shfletuesit/pajisjes në `MD`                           |
| `ru`  | `RU`                      | Rusi 521, E moderuar                                                                                                             | Gjuha e shfletuesit/pajisjes                                                     |
| `sq`  | `AL`                      | Albania 532, E moderuar                                                                                                          | Gjuha e shfletuesit/pajisjes                                                     |
| `sv`  | `SE`, `FI`                | Suedi 609, Shumë e lartë; Finlandë 603, Shumë e lartë                                                                            | Anglisht në `SE`, `FI`                                                           |
| `te`  | `IN`                      | India 484, E moderuar                                                                                                            | Gjuha e shfletuesit/pajisjes                                                     |
| `th`  | `TH`                      | Tajlandë 402, Shumë e ulët                                                                                                       | Gjuha e shfletuesit/pajisjes                                                     |
| `tr`  | `TR`                      | Turkiye 488, E moderuar                                                                                                          | Gjuha e shfletuesit/pajisjes                                                     |
| `uk`  | `UA`                      | Ukraine 526, E moderuar                                                                                                          | Gjuha e shfletuesit/pajisjes                                                     |
| `ur`  | `PK`, `IN`                | Pakistan 493, E moderuar; India 484, E moderuar                                                                                  | Gjuha e shfletuesit/pajisjes                                                     |
| `vi`  | `VN`                      | Vietnam 500, E moderuar                                                                                                          | Gjuha e shfletuesit/pajisjes                                                     |
| `zh`  | `CN`, `HK`, `SG`          | Kinë 464, E moderuar; Hong Kong 538, E moderuar; Regjistrimi i Singaporit 2020: Anglishtja e folur më shpesh në shtëpi për 48.3% | Anglisht në `SG`; gjuha e shfletuesit/pajisjes në `CN`, `HK` dhe rajone të tjera |

Vetëm tejkalimet pozitive janë të koduara në logjikën e kohës së ekzekutimit. Të gjitha rajonet e tjera vazhdojnë të preferojnë gjuhën e shfletuesit/pajisjes kur ajo përputhet me një nga kodet lokale të mbështetura.
