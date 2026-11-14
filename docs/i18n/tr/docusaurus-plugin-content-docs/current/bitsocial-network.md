---
title: Bitsocial Chain
description: Ana planın, Bitsocial uygulamaları için önerilen Ethereum L2 appchain ekonomi katmanını kapsayan 3. aşaması.
---

# Bitsocial Chain

Bitsocial Chain, Bitsocial uygulamaları için önerilen Ethereum L2 appchain ekonomi katmanıdır.
Zincire özel güncel site [chain.bitsocial.net](https://chain.bitsocial.net) adresindedir.

Eşler arası sosyal katman; toplulukların, kimliklerin ve içeriğin merkezî bir platform
veritabanının dışına çıkmasını sağlar. Bitsocial Chain ise bu uygulamaların finansal olarak
kurutulmasını zorlaştıran ortak adlandırma, para kazanma ve ödeme ilkellerini eklemeyi amaçlar.

## Neyi güçlendirmesi amaçlanıyor

- `.bso` gibi merkeziyetsiz Bitsocial alan adları
- ödüller ve bahşiş verme
- kalıcı para kazanma rayları
- uygulamalar arasında paylaşılan likidite
- bankaların ya da platformların kesip atmasının daha zor olduğu finansal yapılar
- tek bir şirketin tüm yığına sahip olmasına bağlı olmayan ağ etkileri

Amaç, token mekaniklerini öne çıkarmak değildir. Amaç; işe yarar sosyal uygulamaları daha kalıcı,
daha finanse edilebilir ve merkezî ödeme veya adlandırma sağlayıcılarına daha az bağımlı hâle
getirmektir.

## Mevcut kavram kanıtı

İlk Bitsocial Chain kavram kanıtı, yerel `.bso` adlarına odaklanır. Sosyal içeriği zincire koymadan
bir ad kaydının Ethereum L1 geçmişinden türetilebileceğini gösterir:

- kullanıcılar kaydetme, güncelleme, aktarma ve iptal etme niyetlerini sıradan Ethereum L1
  işlemleriyle iletir
- türetme düğümünü herkes çalıştırabilir ve aynı `.bso` kayıt durumunu yeniden oluşturabilir
- bir çözümleyici, `.bso` adını istemcilerin eşler arası protokolde zaten kullandığı Bitsocial açık
  anahtarına eşler
- gönderiler, oylar, moderasyon, akışlar ve topluluk içeriği zincir dışında ve eşler arası kalır

Bu kavram kanıtı, üretime hazır bir Stage 2 lansmanı değildir. Henüz bir kanıt sistemi, itiraz
oyunu, denetlenmiş kod, canlı dağıtım, nihai fiyatlandırma veya nihai yönetişim modeli yoktur.
Uzun vadeli duruşu varsayılan olarak şeffaf ve tasarım gereği gizlilikle uyumludur: çekirdek zincir
herkese açıktır; buna karşılık ileride gelecek bahşiş, ödeme, ödül ve likidite özellikleri sosyal
kimlik ile cüzdan geçmişi arasında kalıcı bağlar kurmaya zorlamamalıdır.

## Neden önemli

Toplulukları ve kimlikleri merkeziyetsizleştirmek gereklidir; ancak tüm sosyal medyayı
merkeziyetsizleştirmek için tek başına yeterli değildir.

Sosyal uygulamalar hâlâ birkaç merkezî ekonomik raya bağımlıysa, baskı altına alınmaları, platform
dışına itilmeleri veya finansal olarak kurutulmaları kolay kalır. Bitsocial Chain, bu ikinci
bağımlılık katmanına önerilen yanıttır.

## Uygulamalarla ilişkisi

Bitsocial Chain, Bitsocial uygulamalarının yerini almak yerine onların altında yer almalıdır.

Kullanıcıya yansıyan sonuç şöyle olmalıdır:

- topluluklar eşler arası kalır
- uygulamalar birbirinden farklılaşmış kalır
- kullanıcılar pratik adlandırma ve para kazanma özelliklerine kavuşur
- içerik üreticileri ve topluluklar farklı istemciler üzerinden destek alabilir
- değer, merkezî bir platform sahibini yeniden yaratmadan ekosistem içinde hareket edebilir

## Neden Twitter/X alternatifinden sonra geliyor

Mevcut ana plan, Bitsocial Chain'i Twitter/X alternatifinin arkasına koyuyor, çünkü o uygulamanın zincire ihtiyacı yok. Profiller emanetsiz (non-custodial) RPC üzerinden profil düğümleri olarak çalışır ve `.bso` adları Ethereum ana ağında geçici bir kayıt defterinde ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) başlayıp daha sonra zincire taşınabilir.

Bitsocial Chain, daha erken bir lansman için merkeziyetsizlikten ödün vermemeli. Ethereum'un kendisinin ötesinde hiçbir güven varsayımı eklememeli: yükseltme anahtarı yok, güvenlik konseyi yok ve onu sansürleyebilecek ya da durdurabilecek bir operatör yok. Bunun için öne çıkan tasarım olan yerel rollup (native rollup), henüz takvime bağlanmamış bir Ethereum yükseltmesine bağlı. Zincir bu çıtayı karşılayabilene kadar Twitter/X alternatifi, zincirin hizmet edeceği kullanıcı tabanını büyütür.

## Tasarım ilkeleri

Bitsocial Chain hâlâ piyasaya çıkmış bir ürün değil, önerilen bir altyapı olduğu için planın
disiplinli kalması gerekir:

- Önce uygulamalar ve topluluklar. Ağ katmanı, gerçek sosyal ürünleri güçlendirmelidir.
- Önce pratik özellikler. Adları, ödülleri, bahşişi ve ödemeleri anlatmak, soyut bir finansal
  mimariyi anlatmaktan daha kolaydır.
- Şişirilmiş beklenti yerine gerçek katkı. Ekonomik ilkeller; katılımı, üretmeyi ve topluluk
  desteğini ödüllendirmelidir.
- Kürasyona izin vardır. Uygulamalar; sıralamaları, varsayılanları ve keşfi kalıcı toplulukları
  öne çıkaracak şekilde biçimlendirebilir.
- Kesin mekanikler hâlâ açıktır. Bu sayfa Bitsocial Chain'in rolünü açıklar; nihai ekonomi
  hakkında kilitlenmiş bir vaat vermez.
