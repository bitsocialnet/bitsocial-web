# i18n Varsayılan Dil Politikası

Anonim ziyaretçiler artık dili şu sırayla çözüyor:

1. `?lang=` sorgu parametresi
2. `localStorage`'dan kayıtlı dil seçici seçimi
3. Bölgeye duyarlı anonim varsayılan:
   - Açıkça listelenmiş İngilizce ağırlıklı bölgelerde İngilizceyi zorlamak
   - aksi takdirde desteklenen yerel ayarlarımızdan biri olduğunda tarayıcı/cihaz dilini kullanın
4. `en`'ya geri dönün

## Kaynak Temeli

- [EF İngilizce Yeterlilik Endeksi 2025](Ülke düzeyinde İngilizce yeterliliği için https://www.ef.edu/epi/)
- [Singapur Nüfus Sayımı 2020](Singapur için https://www.singstat.gov.sg/modules/infographics/census-2020); burada 5+ yaş sakinlerinin %48,3'ü için İngilizce en sık konuşulan ev diliydi.

## Kodlanmış İngilizce-Varsayılan Bölgeler

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Yerel Ayar İncelemesi

| Yerel | İncelenen bölgeler                 | En son sinyal                                                                                             | Sonuç                                                                 |
| ----- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `ar`  | `AE`                               | BAE EF EPI 2025: 487, Orta                                                                                | Tarayıcı/cihaz dili                                                   |
| `bn`  | `BD`, `IN`                         | Bangladeş 506, Orta; Hindistan 484, Orta                                                                  | Tarayıcı/cihaz dili                                                   |
| `ca`  | `ES`                               | İspanya 540, Orta                                                                                         | Tarayıcı/cihaz dili                                                   |
| `cs`  | `CZ`                               | Çekya 582, Yüksek                                                                                         | `CZ` dilinde İngilizce                                                |
| `da`  | `DK`                               | Danimarka 611, Çok yüksek                                                                                 | `DK` dilinde İngilizce                                                |
| `de`  | `DE`, `AT`, `CH`                   | Almanya 615, Çok yüksek; Avusturya 616, Çok yüksek; İsviçre 564, Yüksek                                   | `DE`, `AT`, `CH` dillerinde İngilizce                                 |
| `el`  | `GR`, `CY`                         | Yunanistan 592, Yüksek; Kıbrıs 537, Orta                                                                  | `GR` dilinde İngilizce; `CY`'da tarayıcı/cihaz dili                   |
| `en`  | İngilizce çoğunluklu yerel ayarlar | Tarayıcı/cihaz yerel ayarı zaten genel durumda `en-*` raporunu veriyor                                    | İngilizce varsayılan olarak kalır                                     |
| `es`  | `ES`                               | İspanya 540, Orta                                                                                         | Tarayıcı/cihaz dili                                                   |
| `fa`  | `IR`                               | İran 492, Orta                                                                                            | Tarayıcı/cihaz dili                                                   |
| `fi`  | `FI`                               | Finlandiya 603, Çok yüksek                                                                                | `FI` dilinde İngilizce                                                |
| `fil` | `PH`                               | Filipinler 569, Yüksek                                                                                    | `PH` dilinde İngilizce                                                |
| `fr`  | `FR`, `BE`, `CH`                   | Fransa 539, Orta; Belçika 608, Çok yüksek; İsviçre 564, Yüksek                                            | `BE`, `CH` dillerinde İngilizce; `FR`'da tarayıcı/cihaz dili          |
| `he`  | `IL`                               | İsrail 524, Orta                                                                                          | Tarayıcı/cihaz dili                                                   |
| `hi`  | `IN`                               | Hindistan 484, Orta                                                                                       | Tarayıcı/cihaz dili                                                   |
| `hu`  | `HU`                               | Macaristan 590, Yüksek                                                                                    | `HU` dilinde İngilizce                                                |
| `id`  | `ID`                               | Endonezya 471, Orta                                                                                       | Tarayıcı/cihaz dili                                                   |
| `it`  | `IT`, `CH`                         | İtalya 513, Orta; İsviçre 564, Yüksek                                                                     | `CH` dilinde İngilizce; `IT`'da tarayıcı/cihaz dili                   |
| `ja`  | `JP`                               | Japonya 446, Çok düşük                                                                                    | Tarayıcı/cihaz dili                                                   |
| `ko`  | `KR`                               | Güney Kore 522, Orta                                                                                      | Tarayıcı/cihaz dili                                                   |
| `mr`  | `IN`                               | Hindistan 484, Orta                                                                                       | Tarayıcı/cihaz dili                                                   |
| `nl`  | `NL`, `BE`                         | Hollanda 624, Çok yüksek; Belçika 608, Çok yüksek                                                         | `NL`, `BE` dilinde İngilizce                                          |
| `no`  | `NO`                               | Norveç 613, Çok yüksek                                                                                    | `NO` dilinde İngilizce                                                |
| `pl`  | `PL`                               | Polonya 600, Çok yüksek                                                                                   | `PL` dilinde İngilizce                                                |
| `pt`  | `PT`, `BR`                         | Portekiz 612, Çok yüksek; Brezilya 482, Orta                                                              | `PT` dilinde İngilizce; `BR`'da tarayıcı/cihaz dili                   |
| `ro`  | `RO`, `MD`                         | Romanya 605, Çok yüksek; Moldova 531, Orta                                                                | `RO` dilinde İngilizce; `MD`'da tarayıcı/cihaz dili                   |
| `ru`  | `RU`                               | Rusya 521, Orta                                                                                           | Tarayıcı/cihaz dili                                                   |
| `sq`  | `AL`                               | Arnavutluk 532, Orta                                                                                      | Tarayıcı/cihaz dili                                                   |
| `sv`  | `SE`, `FI`                         | İsveç 609, Çok yüksek; Finlandiya 603, Çok yüksek                                                         | `SE`, `FI` dilinde İngilizce                                          |
| `te`  | `IN`                               | Hindistan 484, Orta                                                                                       | Tarayıcı/cihaz dili                                                   |
| `th`  | `TH`                               | Tayland 402, Çok düşük                                                                                    | Tarayıcı/cihaz dili                                                   |
| `tr`  | `TR`                               | Türkiye 488, Orta                                                                                         | Tarayıcı/cihaz dili                                                   |
| `uk`  | `UA`                               | Ukrayna 526, Orta                                                                                         | Tarayıcı/cihaz dili                                                   |
| `ur`  | `PK`, `IN`                         | Pakistan 493, Orta; Hindistan 484, Orta                                                                   | Tarayıcı/cihaz dili                                                   |
| `vi`  | `VN`                               | Vietnam 500, Orta                                                                                         | Tarayıcı/cihaz dili                                                   |
| `zh`  | `CN`, `HK`, `SG`                   | Çin 464, Orta; Hong Kong 538, Orta; Singapur Nüfus Sayımı 2020: %48,3 ile evde en sık konuşulan İngilizce | `SG`'da İngilizce; `CN`, `HK` ve diğer bölgelerde tarayıcı/cihaz dili |

Çalışma zamanı mantığında yalnızca pozitif geçersiz kılmalar kodlanır. Diğer tüm bölgeler, desteklenen yerel ayar kodlarından biriyle eşleştiğinde tarayıcı/cihaz dilini tercih etmeye devam eder.
