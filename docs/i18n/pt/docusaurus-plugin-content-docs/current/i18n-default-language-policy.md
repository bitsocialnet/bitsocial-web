# Política de idioma padrão i18n

Visitantes anônimos agora resolvem o idioma nesta ordem:

1. Parâmetro de consulta `?lang=`
2. Escolha do seletor de idioma salva em `localStorage`
3. Padrão anônimo com reconhecimento de região:
   - forçar o inglês em regiões com alto teor de inglês explicitamente listadas
   - caso contrário, use o idioma do navegador/dispositivo quando for uma de nossas localidades suportadas
4. Volte para `en`

## Linha de base de origem

- [Índice de Proficiência em Inglês EF 2025](https://www.ef.edu/epi/) para proficiência em inglês em nível de país
- [Censo de Singapura 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) para Singapura, onde o inglês era a língua materna mais falada por 48,3% dos residentes com mais de 5 anos

## Regiões codificadas em inglês

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Revisão de localidade

| Local | Regiões analisadas        | Último sinal                                                                                                               | Resultado                                                                      |
| ----- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `ar`  | `AE`                      | Emirados Árabes Unidos EF EPI 2025: 487, Moderado                                                                          | Idioma do navegador/dispositivo                                                |
| `bn`  | `BD`, `IN`                | Bangladesh 506, Moderado; Índia 484, Moderado                                                                              | Idioma do navegador/dispositivo                                                |
| `ca`  | `ES`                      | Espanha 540, Moderado                                                                                                      | Idioma do navegador/dispositivo                                                |
| `cs`  | `CZ`                      | República Tcheca 582, alta                                                                                                 | Inglês em `CZ`                                                                 |
| `da`  | `DK`                      | Dinamarca 611, Muito elevado                                                                                               | Inglês em `DK`                                                                 |
| `de`  | `DE`, `AT`, `CH`          | Alemanha 615, Muito alto; Áustria 616, Muito elevado; Suíça 564, Alto                                                      | Inglês em `DE`, `AT`, `CH`                                                     |
| `el`  | `GR`, `CY`                | Grécia 592, Alto; Chipre 537, Moderado                                                                                     | Inglês em `GR`; idioma do navegador/dispositivo em `CY`                        |
| `en`  | Locais de maioria inglesa | A localidade do navegador/dispositivo já relata `en-*` no caso comum                                                       | Inglês permanece padrão                                                        |
| `es`  | `ES`                      | Espanha 540, Moderado                                                                                                      | Idioma do navegador/dispositivo                                                |
| `fa`  | `IR`                      | Irã 492, Moderado                                                                                                          | Idioma do navegador/dispositivo                                                |
| `fi`  | `FI`                      | Finlândia 603, Muito elevado                                                                                               | Inglês em `FI`                                                                 |
| `fil` | `PH`                      | Filipinas 569, alta                                                                                                        | Inglês em `PH`                                                                 |
| `fr`  | `FR`, `BE`, `CH`          | França 539, Moderado; Bélgica 608, Muito elevado; Suíça 564, Alto                                                          | Inglês em `BE`, `CH`; idioma do navegador/dispositivo em `FR`                  |
| `he`  | `IL`                      | Israel 524, Moderado                                                                                                       | Idioma do navegador/dispositivo                                                |
| `hi`  | `IN`                      | Índia 484, Moderado                                                                                                        | Idioma do navegador/dispositivo                                                |
| `hu`  | `HU`                      | Hungria 590, alta                                                                                                          | Inglês em `HU`                                                                 |
| `id`  | `ID`                      | Indonésia 471, Moderado                                                                                                    | Idioma do navegador/dispositivo                                                |
| `it`  | `IT`, `CH`                | Itália 513, Moderado; Suíça 564, Alto                                                                                      | Inglês em `CH`; idioma do navegador/dispositivo em `IT`                        |
| `ja`  | `JP`                      | Japão 446, muito baixo                                                                                                     | Idioma do navegador/dispositivo                                                |
| `ko`  | `KR`                      | Coreia do Sul 522, Moderado                                                                                                | Idioma do navegador/dispositivo                                                |
| `mr`  | `IN`                      | Índia 484, Moderado                                                                                                        | Idioma do navegador/dispositivo                                                |
| `nl`  | `NL`, `BE`                | Países Baixos 624, Muito elevado; Bélgica 608, Muito elevado                                                               | Inglês em `NL`, `BE`                                                           |
| `no`  | `NO`                      | Noruega 613, Muito elevado                                                                                                 | Inglês em `NO`                                                                 |
| `pl`  | `PL`                      | Polónia 600, Muito elevado                                                                                                 | Inglês em `PL`                                                                 |
| `pt`  | `PT`, `BR`                | Portugal 612, Muito elevado; Brasil 482, Moderado                                                                          | Inglês em `PT`; idioma do navegador/dispositivo em `BR`                        |
| `ro`  | `RO`, `MD`                | Roménia 605, Muito elevado; Moldávia 531, Moderado                                                                         | Inglês em `RO`; idioma do navegador/dispositivo em `MD`                        |
| `ru`  | `RU`                      | Rússia 521, Moderado                                                                                                       | Idioma do navegador/dispositivo                                                |
| `sq`  | `AL`                      | Albânia 532, Moderado                                                                                                      | Idioma do navegador/dispositivo                                                |
| `sv`  | `SE`, `FI`                | Suécia 609, Muito elevado; Finlândia 603, Muito elevado                                                                    | Inglês em `SE`, `FI`                                                           |
| `te`  | `IN`                      | Índia 484, Moderado                                                                                                        | Idioma do navegador/dispositivo                                                |
| `th`  | `TH`                      | Tailândia 402, Muito baixo                                                                                                 | Idioma do navegador/dispositivo                                                |
| `tr`  | `TR`                      | Turkiye 488, Moderado                                                                                                      | Idioma do navegador/dispositivo                                                |
| `uk`  | `UA`                      | Ucrânia 526, Moderado                                                                                                      | Idioma do navegador/dispositivo                                                |
| `ur`  | `PK`, `IN`                | Paquistão 493, Moderado; Índia 484, Moderado                                                                               | Idioma do navegador/dispositivo                                                |
| `vi`  | `VN`                      | Vietnã 500, Moderado                                                                                                       | Idioma do navegador/dispositivo                                                |
| `zh`  | `CN`, `HK`, `SG`          | China 464, Moderado; Hong Kong 538, Moderado; Censo de Cingapura 2020: Inglês falado com mais frequência em casa por 48,3% | Inglês em `SG`; idioma do navegador/dispositivo em `CN`, `HK` e outras regiões |

Somente as substituições positivas são codificadas na lógica de tempo de execução. Todas as outras regiões continuam a preferir o idioma do navegador/dispositivo quando ele corresponde a um dos códigos de localidade suportados.
