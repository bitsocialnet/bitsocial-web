# Política de idioma predeterminado de i18n

Los visitantes anónimos ahora resuelven el idioma en este orden:

1. Parámetro de consulta `?lang=`
2. Elección del selector de idioma guardado de `localStorage`
3. Valor predeterminado anónimo que tiene en cuenta la región:
   - forzar el inglés en regiones con mucho inglés enumeradas explícitamente
   - De lo contrario, use el idioma del navegador/dispositivo cuando sea una de nuestras configuraciones regionales admitidas.
4. Regresar a `en`

## Línea base de origen

- [Índice de dominio del inglés EF 2025](https://www.ef.edu/epi/) para dominio del inglés a nivel nacional
- [Censo de Singapur 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) para Singapur, donde el inglés era el idioma materno más hablado por el 48,3% de los residentes mayores de 5 años

## Regiones predeterminadas en inglés codificadas

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Revisión de configuración regional

| Ubicación | Regiones revisadas         | Última señal                                                                                                           | Resultado                                                                       |
| --------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `ar`      | `AE`                       | EAU EF EPI 2025: 487, moderado                                                                                         | Idioma del navegador/dispositivo                                                |
| `bn`      | `BD`, `IN`                 | Bangladesh 506, moderado; India 484, Moderado                                                                          | Idioma del navegador/dispositivo                                                |
| `ca`      | `ES`                       | España 540, Moderado                                                                                                   | Idioma del navegador/dispositivo                                                |
| `cs`      | `CZ`                       | Chequia 582, Alto                                                                                                      | Inglés en `CZ`                                                                  |
| `da`      | `DK`                       | Dinamarca 611, Muy alta                                                                                                | Inglés en `DK`                                                                  |
| `de`      | `DE`, `AT`, `CH`           | Alemania 615, muy alta; Austria 616, muy alta; Suiza 564, Alta                                                         | Inglés en `DE`, `AT`, `CH`                                                      |
| `el`      | `GR`, `CY`                 | Grecia 592, alta; Chipre 537, moderado                                                                                 | Inglés en `GR`; idioma del navegador/dispositivo en `CY`                        |
| `en`      | Locales de mayoría inglesa | La configuración regional del navegador/dispositivo ya informa `en-*` en el caso común                                 | El inglés sigue siendo el predeterminado                                        |
| `es`      | `ES`                       | España 540, Moderado                                                                                                   | Idioma del navegador/dispositivo                                                |
| `fa`      | `IR`                       | Irán 492, moderado                                                                                                     | Idioma del navegador/dispositivo                                                |
| `fi`      | `FI`                       | Finlandia 603, Muy alta                                                                                                | Inglés en `FI`                                                                  |
| `fil`     | `PH`                       | Filipinas 569, Alto                                                                                                    | Inglés en `PH`                                                                  |
| `fr`      | `FR`, `BE`, `CH`           | Francia 539, moderado; Bélgica 608, muy alta; Suiza 564, Alta                                                          | Inglés en `BE`, `CH`; idioma del navegador/dispositivo en `FR`                  |
| `he`      | `IL`                       | Israel 524, moderado                                                                                                   | Idioma del navegador/dispositivo                                                |
| `hi`      | `IN`                       | India 484, Moderado                                                                                                    | Idioma del navegador/dispositivo                                                |
| `hu`      | `HU`                       | Hungría 590, Alto                                                                                                      | Inglés en `HU`                                                                  |
| `id`      | `ID`                       | Indonesia 471, Moderado                                                                                                | Idioma del navegador/dispositivo                                                |
| `it`      | `IT`, `CH`                 | Italia 513, moderado; Suiza 564, Alta                                                                                  | Inglés en `CH`; idioma del navegador/dispositivo en `IT`                        |
| `ja`      | `JP`                       | Japón 446, muy bajo                                                                                                    | Idioma del navegador/dispositivo                                                |
| `ko`      | `KR`                       | Corea del Sur 522, Moderado                                                                                            | Idioma del navegador/dispositivo                                                |
| `mr`      | `IN`                       | India 484, Moderado                                                                                                    | Idioma del navegador/dispositivo                                                |
| `nl`      | `NL`, `BE`                 | Países Bajos 624, muy alto; Bélgica 608, Muy alto                                                                      | Inglés en `NL`, `BE`                                                            |
| `no`      | `NO`                       | Noruega 613, Muy alta                                                                                                  | Inglés en `NO`                                                                  |
| `pl`      | `PL`                       | Polonia 600, Muy alto                                                                                                  | Inglés en `PL`                                                                  |
| `pt`      | `PT`, `BR`                 | Portugal 612, muy alta; Brasil 482, Moderado                                                                           | Inglés en `PT`; idioma del navegador/dispositivo en `BR`                        |
| `ro`      | `RO`, `MD`                 | Rumania 605, muy alta; Moldavia 531, Moderado                                                                          | Inglés en `RO`; idioma del navegador/dispositivo en `MD`                        |
| `ru`      | `RU`                       | Rusia 521, Moderado                                                                                                    | Idioma del navegador/dispositivo                                                |
| `sq`      | `AL`                       | Albania 532, Moderado                                                                                                  | Idioma del navegador/dispositivo                                                |
| `sv`      | `SE`, `FI`                 | Suecia 609, muy alta; Finlandia 603, Muy alta                                                                          | Inglés en `SE`, `FI`                                                            |
| `te`      | `IN`                       | India 484, Moderado                                                                                                    | Idioma del navegador/dispositivo                                                |
| `th`      | `TH`                       | Tailandia 402, Muy bajo                                                                                                | Idioma del navegador/dispositivo                                                |
| `tr`      | `TR`                       | Turkiye 488, Moderado                                                                                                  | Idioma del navegador/dispositivo                                                |
| `uk`      | `UA`                       | Ucrania 526, Moderado                                                                                                  | Idioma del navegador/dispositivo                                                |
| `ur`      | `PK`, `IN`                 | Pakistán 493, moderado; India 484, Moderado                                                                            | Idioma del navegador/dispositivo                                                |
| `vi`      | `VN`                       | Vietnam 500, moderado                                                                                                  | Idioma del navegador/dispositivo                                                |
| `zh`      | `CN`, `HK`, `SG`           | China 464, moderada; Hong Kong 538, moderado; Censo de Singapur 2020: el inglés es el más hablado en casa por un 48,3% | Inglés en `SG`; idioma del navegador/dispositivo en `CN`, `HK` y otras regiones |

Sólo las anulaciones positivas se codifican en la lógica de tiempo de ejecución. Todas las demás regiones siguen prefiriendo el idioma del navegador/dispositivo cuando coincide con uno de los códigos locales admitidos.
