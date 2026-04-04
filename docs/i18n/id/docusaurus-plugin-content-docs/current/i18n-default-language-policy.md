# i18n Kebijakan Bahasa Default

Pengunjung anonim sekarang menyelesaikan bahasa dalam urutan ini:

1. `?lang=` parameter kueri
2. Pilihan pemilih bahasa tersimpan dari `localStorage`
3. Default anonim yang sadar wilayah:
   - memaksakan bahasa Inggris di wilayah yang banyak berbahasa Inggris yang terdaftar secara eksplisit
   - jika tidak, gunakan bahasa browser/perangkat jika itu adalah salah satu bahasa lokal yang kami dukung
4. Kembali ke `en`

## Sumber Dasar

- [EF English Proficiency Index 2025](https://www.ef.edu/epi/) untuk kemahiran bahasa Inggris tingkat negara
- [Sensus Singapura 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) untuk Singapura, di mana bahasa Inggris adalah bahasa rumah yang paling sering digunakan oleh 48,3% penduduk berusia 5+ tahun

## Wilayah Default Bahasa Inggris yang Dikodekan

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Tinjauan Lokal

| Lokal | Wilayah ditinjau                                   | Sinyal terbaru                                                                                                                    | Hasil                                                                                 |
| ----- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `ar`  | `AE`                                               | UEA EF EPI 2025: 487, Sedang                                                                                                      | Bahasa browser/perangkat                                                              |
| `bn`  | `BD`, `IN`                                         | Bangladesh 506, Sedang; India 484, Sedang                                                                                         | Bahasa browser/perangkat                                                              |
| `ca`  | `ES`                                               | Spanyol 540, Sedang                                                                                                               | Bahasa browser/perangkat                                                              |
| `cs`  | `CZ`                                               | Ceko 582, Tinggi                                                                                                                  | Bahasa Inggris dalam `CZ`                                                             |
| `da`  | `DK`                                               | Denmark 611, Sangat tinggi                                                                                                        | Bahasa Inggris dalam `DK`                                                             |
| `de`  | `DE`, `AT`, `CH`                                   | Jerman 615, Sangat tinggi; Austria 616, Sangat tinggi; Swiss 564, Tinggi                                                          | Bahasa Inggris dalam `DE`, `AT`, `CH`                                                 |
| `el`  | `GR`, `CY`                                         | Yunani 592, Tinggi; Siprus 537, Sedang                                                                                            | Bahasa Inggris dalam `GR`; bahasa browser/perangkat dalam `CY`                        |
| `en`  | Lokal yang mayoritas penduduknya berbahasa Inggris | Lokal browser/perangkat sudah melaporkan `en-*` dalam kasus umum                                                                  | Bahasa Inggris tetap default                                                          |
| `es`  | `ES`                                               | Spanyol 540, Sedang                                                                                                               | Bahasa browser/perangkat                                                              |
| `fa`  | `IR`                                               | Iran 492, Sedang                                                                                                                  | Bahasa browser/perangkat                                                              |
| `fi`  | `FI`                                               | Finlandia 603, Sangat tinggi                                                                                                      | Bahasa Inggris dalam `FI`                                                             |
| `fil` | `PH`                                               | Filipina 569, Tinggi                                                                                                              | Bahasa Inggris dalam `PH`                                                             |
| `fr`  | `FR`, `BE`, `CH`                                   | Perancis 539, Sedang; Belgia 608, Sangat tinggi; Swiss 564, Tinggi                                                                | Bahasa Inggris dalam `BE`, `CH`; bahasa browser/perangkat dalam `FR`                  |
| `he`  | `IL`                                               | Israel 524, Sedang                                                                                                                | Bahasa browser/perangkat                                                              |
| `hi`  | `IN`                                               | India 484, Sedang                                                                                                                 | Bahasa browser/perangkat                                                              |
| `hu`  | `HU`                                               | Hongaria 590, Tinggi                                                                                                              | Bahasa Inggris dalam `HU`                                                             |
| `id`  | `ID`                                               | Indonesia 471, Sedang                                                                                                             | Bahasa browser/perangkat                                                              |
| `it`  | `IT`, `CH`                                         | Italia 513, Sedang; Swiss 564, Tinggi                                                                                             | Bahasa Inggris dalam `CH`; bahasa browser/perangkat dalam `IT`                        |
| `ja`  | `JP`                                               | Jepang 446, Sangat rendah                                                                                                         | Bahasa browser/perangkat                                                              |
| `ko`  | `KR`                                               | Korea Selatan 522, Sedang                                                                                                         | Bahasa browser/perangkat                                                              |
| `mr`  | `IN`                                               | India 484, Sedang                                                                                                                 | Bahasa browser/perangkat                                                              |
| `nl`  | `NL`, `BE`                                         | Belanda 624, Sangat tinggi; Belgia 608, Sangat tinggi                                                                             | Bahasa Inggris dalam `NL`, `BE`                                                       |
| `no`  | `NO`                                               | Norwegia 613, Sangat tinggi                                                                                                       | Bahasa Inggris dalam `NO`                                                             |
| `pl`  | `PL`                                               | Polandia 600, Sangat tinggi                                                                                                       | Bahasa Inggris dalam `PL`                                                             |
| `pt`  | `PT`, `BR`                                         | Portugal 612, Sangat tinggi; Brasil 482, Sedang                                                                                   | Bahasa Inggris dalam `PT`; bahasa browser/perangkat dalam `BR`                        |
| `ro`  | `RO`, `MD`                                         | Rumania 605, Sangat tinggi; Moldova 531, Sedang                                                                                   | Bahasa Inggris dalam `RO`; bahasa browser/perangkat dalam `MD`                        |
| `ru`  | `RU`                                               | Rusia 521, Sedang                                                                                                                 | Bahasa browser/perangkat                                                              |
| `sq`  | `AL`                                               | Albania 532, Sedang                                                                                                               | Bahasa browser/perangkat                                                              |
| `sv`  | `SE`, `FI`                                         | Swedia 609, Sangat tinggi; Finlandia 603, Sangat tinggi                                                                           | Bahasa Inggris dalam `SE`, `FI`                                                       |
| `te`  | `IN`                                               | India 484, Sedang                                                                                                                 | Bahasa browser/perangkat                                                              |
| `th`  | `TH`                                               | Thailand 402, Sangat rendah                                                                                                       | Bahasa browser/perangkat                                                              |
| `tr`  | `TR`                                               | Turkiye 488, Sedang                                                                                                               | Bahasa browser/perangkat                                                              |
| `uk`  | `UA`                                               | Ukraina 526, Sedang                                                                                                               | Bahasa browser/perangkat                                                              |
| `ur`  | `PK`, `IN`                                         | Pakistan 493, Sedang; India 484, Sedang                                                                                           | Bahasa browser/perangkat                                                              |
| `vi`  | `VN`                                               | Vietnam 500, Sedang                                                                                                               | Bahasa browser/perangkat                                                              |
| `zh`  | `CN`, `HK`, `SG`                                   | Tiongkok 464, Sedang; Hong Kong 538, Sedang; Sensus Singapura 2020: Bahasa Inggris paling sering digunakan di rumah sebesar 48,3% | Bahasa Inggris dalam `SG`; bahasa browser/perangkat di `CN`, `HK` dan wilayah lainnya |

Hanya penimpaan positif yang dikodekan dalam logika runtime. Semua wilayah lain tetap memilih bahasa browser/perangkat jika cocok dengan salah satu kode lokal yang didukung.
