# Politique de langue par défaut du i18n

Les visiteurs anonymes résolvent désormais la langue dans cet ordre :

1. Paramètre de requête `?lang=`
2. Choix de sélecteur de langue enregistré à partir de `localStorage`
3. Valeur par défaut anonyme tenant compte de la région :
   - forcer l'anglais dans les régions à forte teneur en anglais explicitement répertoriées
   - sinon, utilisez la langue du navigateur/de l'appareil lorsqu'il s'agit de l'une de nos langues prises en charge
4. Revenez à `en`

## Source de référence

- [Indice de compétence en anglais EF 2025](https://www.ef.edu/epi/) pour la maîtrise de l'anglais au niveau national
- [Recensement de Singapour 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) pour Singapour, où l'anglais était la langue la plus parlée à la maison par 48,3% des résidents âgés de 5 ans et plus

## Régions codées en anglais par défaut

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Examen des paramètres régionaux

| Paramètres régionaux | Régions examinées           | Dernier signal                                                                                                                               | Résultat                                                                                 |
| -------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `ar`                 | `AE`                        | EAU EF EPI 2025 : 487, modéré                                                                                                                | Langue du navigateur/appareil                                                            |
| `bn`                 | `BD`, `IN`                  | Bangladesh 506, modéré ; Inde 484, modéré                                                                                                    | Langue du navigateur/appareil                                                            |
| `ca`                 | `ES`                        | Espagne 540, modéré                                                                                                                          | Langue du navigateur/appareil                                                            |
| `cs`                 | `CZ`                        | Tchéquie 582, Haut                                                                                                                           | Anglais dans `CZ`                                                                        |
| `da`                 | `DK`                        | Danemark 611, très élevé                                                                                                                     | Anglais dans `DK`                                                                        |
| `de`                 | `DE`, `AT`, `CH`            | Allemagne 615, très élevé ; Autriche 616, très élevé ; Suisse 564, haut                                                                      | Anglais dans `DE`, `AT`, `CH`                                                            |
| `el`                 | `GR`, `CY`                  | Grèce 592, élevé ; Chypre 537, Modéré                                                                                                        | Anglais en `GR` ; langue du navigateur/de l'appareil dans `CY`                           |
| `en`                 | Régions à majorité anglaise | Les paramètres régionaux du navigateur/appareil signalent déjà `en-*` dans le cas courant                                                    | L'anglais reste par défaut                                                               |
| `es`                 | `ES`                        | Espagne 540, modéré                                                                                                                          | Langue du navigateur/appareil                                                            |
| `fa`                 | `IR`                        | Iran 492, modéré                                                                                                                             | Langue du navigateur/appareil                                                            |
| `fi`                 | `FI`                        | Finlande 603, très élevé                                                                                                                     | Anglais dans `FI`                                                                        |
| `fil`                | `PH`                        | Philippines 569, élevé                                                                                                                       | Anglais dans `PH`                                                                        |
| `fr`                 | `FR`, `BE`, `CH`            | France 539, modéré ; Belgique 608, Très élevé ; Suisse 564, haut                                                                             | Anglais dans `BE`, `CH` ; langue du navigateur/de l'appareil dans `FR`                   |
| `he`                 | `IL`                        | Israël 524, Modéré                                                                                                                           | Langue du navigateur/appareil                                                            |
| `hi`                 | `IN`                        | Inde 484, modéré                                                                                                                             | Langue du navigateur/appareil                                                            |
| `hu`                 | `HU`                        | Hongrie 590, haut                                                                                                                            | Anglais dans `HU`                                                                        |
| `id`                 | `ID`                        | Indonésie 471, modéré                                                                                                                        | Langue du navigateur/appareil                                                            |
| `it`                 | `IT`, `CH`                  | Italie 513, modéré ; Suisse 564, haut                                                                                                        | Anglais en `CH` ; langue du navigateur/de l'appareil dans `IT`                           |
| `ja`                 | `JP`                        | Japon 446, très faible                                                                                                                       | Langue du navigateur/appareil                                                            |
| `ko`                 | `KR`                        | Corée du Sud 522, modéré                                                                                                                     | Langue du navigateur/appareil                                                            |
| `mr`                 | `IN`                        | Inde 484, modéré                                                                                                                             | Langue du navigateur/appareil                                                            |
| `nl`                 | `NL`, `BE`                  | Pays-Bas 624, très élevé ; Belgique 608, Très élevé                                                                                          | Anglais dans `NL`, `BE`                                                                  |
| `no`                 | `NO`                        | Norvège 613, très élevé                                                                                                                      | Anglais dans `NO`                                                                        |
| `pl`                 | `PL`                        | Pologne 600, Très élevé                                                                                                                      | Anglais dans `PL`                                                                        |
| `pt`                 | `PT`, `BR`                  | Portugal 612, très élevé ; Brésil 482, modéré                                                                                                | Anglais en `PT` ; langue du navigateur/de l'appareil dans `BR`                           |
| `ro`                 | `RO`, `MD`                  | Roumanie 605, très élevé ; Moldavie 531, Modéré                                                                                              | Anglais en `RO` ; langue du navigateur/de l'appareil dans `MD`                           |
| `ru`                 | `RU`                        | Russie 521, modéré                                                                                                                           | Langue du navigateur/appareil                                                            |
| `sq`                 | `AL`                        | Albanie 532, Modéré                                                                                                                          | Langue du navigateur/appareil                                                            |
| `sv`                 | `SE`, `FI`                  | Suède 609, très élevé ; Finlande 603, très élevé                                                                                             | Anglais dans `SE`, `FI`                                                                  |
| `te`                 | `IN`                        | Inde 484, modéré                                                                                                                             | Langue du navigateur/appareil                                                            |
| `th`                 | `TH`                        | Thaïlande 402, très faible                                                                                                                   | Langue du navigateur/appareil                                                            |
| `tr`                 | `TR`                        | Turquie 488, Modéré                                                                                                                          | Langue du navigateur/appareil                                                            |
| `uk`                 | `UA`                        | Ukraine 526, modéré                                                                                                                          | Langue du navigateur/appareil                                                            |
| `ur`                 | `PK`, `IN`                  | Pakistan 493, modéré ; Inde 484, modéré                                                                                                      | Langue du navigateur/appareil                                                            |
| `vi`                 | `VN`                        | Vietnam 500, modéré                                                                                                                          | Langue du navigateur/appareil                                                            |
| `zh`                 | `CN`, `HK`, `SG`            | Chine 464, modérée ; Hong Kong 538, modéré ; Recensement de Singapour 2020 : l'anglais est le plus fréquemment parlé à la maison pour 48,3 % | Anglais en `SG` ; langue du navigateur/de l'appareil dans `CN`, `HK` et d'autres régions |

Seuls les remplacements positifs sont codés dans la logique d'exécution. Toutes les autres régions continuent de préférer la langue du navigateur/appareil lorsqu'elle correspond à l'un des codes régionaux pris en charge.
