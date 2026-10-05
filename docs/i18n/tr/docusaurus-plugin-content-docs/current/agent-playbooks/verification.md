# Doğrulama

Kontrolleri değişen davranışa ve geriye kalan belirsizliğe göre seçin. Aynı nihai durum için elde edilmiş başarılı kanıtları yeniden kullanın; ilgili düzenlemelerden veya başarısızlıklardan sonra kontrolleri yeniden çalıştırın. Açıkça belirtilmiş CI/sürüm/kullanıcı gereksinimleri yine de geçerlidir.

| Değişiklik                                                                  | Uygun kontroller                                                                                                               |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Yalnızca düzyazı/yorumlar/biçimlendirme                                     | Diff, başvurular, ilgili üreteçler; uygulama derlemesi gerekmez                                                                |
| Yapay zekâ iş akışı kaynakları/yapılandırması                               | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; bağlam değiştiyse LLM dizinlerini yeniden üretin   |
| Yalıtılmış yardımcı veya betik                                              | Etkilenen koda yönelik odaklı çağrı/fixture'lar ve sözdizimi ya da tip/lint kontrolleri                                        |
| Paylaşılan çalışma zamanı, bağımlılık, derleme veya entegrasyon değişikliği | Etkilenen alana odaklı kontroller ve aşağıdaki ilgili derleme/tip/lint kontrolleri                                             |
| Yalnızca CSS/tema/yerleşim                                                  | Seçilen tarayıcılarda etkilenen rotalar/görüntü alanları/temalar; içe aktarmalar, varlıklar veya CSS işleme değiştiyse derleme |
| React durumu/efektleri/performansı                                          | Etkilenen davranış ve geçerli React rehberliği; tanılama somut bir endişeyi netleştirecekse Doctor                             |

## Proje kontrolleri

- `yarn build:verify` etkilenen çalışma alanını seçer. Kapsam biliniyorsa `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` veya `yarn docs:build:verify` kullanın.
- `yarn build` bilinçli olarak, tüm belge yerel ayarları dâhil olmak üzere about/belge üretim derlemesinin tamamını çalıştırır. Bunu sürüm genelinde doğrulama için ya da bu kapsamı gerektiren değişikliklerde kullanın.
- `yarn lint`, `yarn typecheck` ve `yarn format:check` deponun mevcut kapılarını kapsar; dar kapsamlı bir betik düzenlemesinde önce o betiğe odaklı sözdizimi/fixture/biçim kontrollerini kullanın.
- Manifest/kilit dosyası değişiklikleri `corepack yarn install`, `yarn deps:check-pinned` ve `yarn deps:check-hardened` gerektirir. `yarn knip`, bağımlılıklar/içe aktarmalar için tavsiye niteliğindedir.
- Belge çevirisi kontrolleri [translations.md](translations.md) içinde yer alır; odaklı bir belge değişikliği için toplu çeviri yazıcısını çalıştırmayın.

## Tarayıcı kanıtı ve sahiplik

Küçük, yalıtılmış tarayıcı değişiklikleri için Chrome kullanın. Paylaşılan CSS/yerleşim/duyarlılık değişikliklerinde, tarayıcıya bağlı API'lerde, geniş kapsamlı etkileşimlerde, sürümlerde veya açıkça belirtilmiş tarayıcılar arası ölçütlerde Firefox ve WebKit'i de ekleyin. Etkilenen mobil yerleşimleri/dokunma davranışını da dâhil edin. Görüntü alanını yeniden boyutlandırmak tek başına dokunma öykünmesi değildir. Örneklerin mevcut olduğunu varsaymak yerine gerçek rotaları ve içeriği kaynaktan seçin.

`playwright-cli` aracını `./scripts/pw-session.sh` üzerinden kullanın. Makine genelinde aynı anda tek bir tarayıcı etkindir; seçilen motorlar sırayla çalışır ve sahip olunan her oturum, başarısızlık durumunda bile tam adıyla kapatılır. Yetkilendirilmiş, çağırana ait bir oturumu kapatmadan yeniden kullanın. Asla genel tarayıcı temizliği yapmayın ve sahipliği belirsiz bir sunucuyu durdurmayın. Yalnızca belgelerle ilgili işler için tarayıcıya/sunucuya gerek yoktur.

Performans çalışmalarında aynı akışı eşdeğer görüntü alanı, içerik, ağ/CPU ayarları, derleme modu ve ölçüm yüküyle karşılaştırın. Gözlemleri şüphelenilen nedenlerden ayırın. Bu ölçümler asıl isteği yanıtlıyorsa profilleme becerisini kullanın.

## Nihai kanıt

Ağır doğrulamanın sahibi tek bir ajandır. Etkin iş yüklerini inceleyin; kurulumları, derlemeleri/tam test paketlerini, Doctor'ı, Android/Electron işlerini ve tarayıcı profillemesini sırayla çalıştırın. Komutları/sonuçları ve belirli sınırlamaları raporlayın; eksik veri veya atlanan bir motor başarılı sonuç sayılmaz. Araç fixture'ları biçimleri ve mekaniği doğrular; uçtan uca uygulama keşfini veya modelin karar kalitesini doğrulamaz.

## Otomatik React kontrolleri

`yarn agent:verify`, seçilen derlemeleri ve ardından `yarn doctor:check` ile `yarn perf:check` komutlarını çalıştırır. `perf:check` toplayıcı uyumluluğunu ve kasıtlı gerileme öz testini içerir; bu yüzden ne CI ne de ajan doğrulama yolu ayrı bir `perf:test` geçişine ihtiyaç duyar. Sabitlenmiş tarayıcı araçlarını bir kez `yarn perf:install` ile kurun (Linux CI'da `--with-deps`). İlgili tam geçişten sonraki odaklı yeniden çalıştırmalar için hedef/senaryo filtrelerini kullanın. Senaryo bütçeleri `scripts/react-perf/config.mjs` içinde açıkça tanımlıdır; gerekçeli bir taban çizgisi değişikliğini düşünmeden önce kanıtları koruyun ve gerilemeyi düzeltin. Sıradan üretim derlemeleri Bippy'yi içermez; resmî React profilleme enstrümantasyonunu ayrı `build:profile:*` komutları sağlar.

About sitesinin `apps-search` senaryosu, her karakterden sonra URL ve girdi alanındaki değerin uygulanmasını bekler, ardından sonraki karakteri yazar. Başarılı sonucu bu uygulanmış sorgu dizisini kapsar, hızlı yazma sırasındaki tepkiselliği kapsamaz. Karakter kaybını veya girdi tepkiselliğini değerlendirirken ayrı bir hızlı girdi yeniden üretimi kullanın.
