---
title: Bitsocial ve Quorum
description: Quilibrium'un Discord tarzı Space'lere sahip uçtan uca şifreli grup mesajlaşma uygulaması Quorum'un Bitsocial'ın herkese açık eşler arası topluluklarıyla nasıl karşılaştırıldığı.
---

# Bitsocial ve Quorum

[Quorum](https://www.quorummessenger.com/), [Quilibrium](https://quilibrium.com/) ağının arkasındaki
şirket olan Quilibrium Inc.'in bir grup mesajlaşma uygulamasıdır.
Discord gibi düzenlenmiştir; Space'leri, kanalları, rolleri ve doğrudan mesajları vardır ve
mesajları uçtan uca şifrelenir. Bitsocial ile birlikte anılmasının nedeni, ikisinin de kendini eşler
arası ve sansüre dayanıklı, kendi kurallarını belirleyen gruplara sahip olarak tanımlamasıdır. Ancak
farklı hedeflere yönelirler: Quorum özel grup sohbetine, Bitsocial ise herkesin okuyabildiği
herkese açık topluluklara.

Quilibrium kendini bulut platformlarına merkeziyetsiz bir alternatif olarak tanımlar: verileri
şifreli bir hipergrafta tutan ve bu verilerin durumu üzerinde, Proof of Meaningful Work adını
verdiği bir uzlaşma mekanizmasıyla anlaşan düğümlerden oluşan bir ağ. Düğümler, ağın tokeni olan ve
kullanım ücretlerinin ödendiği QUIL'i kazanır.
[Quilibrium'un hikâyesine](https://docs.quilibrium.com/docs/discover/q-story/) göre Quorum, 2018'de
özel bir Discord alternatifi fikri olarak Howler adıyla başladı ve Quilibrium üzerinde yayına giren
ilk uygulama oldu. Cassie Heart'ın kurduğu Quilibrium Inc. protokolü geliştirir ve Quorum'u yönetilen
hizmetlerinden biri olarak sunar ([SSS](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Quorum nasıl çalışır

Aşağıdaki ayrıntılar, Ekim 2026 itibarıyla Quorum'un istemci kaynak kodundan alınmıştır: web ve
masaüstü uygulamaları için [quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) ve
[quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile).

- **Kimlikler.** Bir kullanıcının ana kimliği bir Ed448 anahtar kümesidir ve her cihaz kendi X448 ve
  Ed448 anahtarlarını alır. Tarayıcıda anahtarlar normalde bir geçiş anahtarıyla (passkey) korunur;
  mobil uygulama ise bunları bir kurtarma ifadesinden türetir. Adresler `Qm` ile başlayan karmalardır
  ve kullanıcılar Quilibrium'un ad hizmetinden bir kullanıcı adı gösterebilir.
- **Şifreleme.** Doğrudan mesajlar cihazlar arasında Double Ratchet kullanır. Bir Space, üyeleri
  arasında tek bir Triple Ratchet oturumunu paylaşır; üyeler mesajlarını o Space'e özgü anahtarlarla
  imzalar. Her Space şifrelidir. Quorum, mesaj aracılığı (message brokering) yönteminin gönderenlerle
  alıcıların ilişkilendirilmesini engellediğini söyler, ancak web ve masaüstü istemcisi bir cihazın
  tüm gelen kutularına, kullanıcının herkese açık kaydında listelenen gelen kutusu da dahil olmak
  üzere, hizmete gönderilen
  [tek bir istekle](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  abone olur; bu yüzden hizmet bunları kullanıcının adresiyle ilişkilendirebilir.
- **Katılma.** Space'lere davet bağlantılarıyla girilir. Tek kullanımlık bir bağlantı, katılmak için
  gereken anahtarları URL'nin içinde taşır; herkese açık bir bağlantı ise bunları Quorum hizmetinden
  alır ve herkese açık Space'ler aranabilir bir dizinde listelenebilir.
- **Aktarım.** Mesajlaşma için web, masaüstü ve mobil istemcilerin hepsi HTTPS ve bir WebSocket
  üzerinden tek bir hizmete bağlanır:
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Bu hizmet şifreli mesajları her üyenin gelen kutusuna aktarır ve istemci alındığını onaylayana kadar
  onları tutar. Ayrıca kullanıcı kayıtlarını, kullanıcıların kendi tercihiyle açtığı herkese açık
  profilleri, her Space'in şifreli manifestini (kanallar, roller, emojiler), davet materyallerini,
  herkese açık dizini ve isteğe bağlı şifreli ayar senkronizasyonunu saklar. Quilibrium'un düğüm
  yazılımında aynı yapıda bir gelen kutusu ve hub hizmeti vardır, ancak ne istemciler ne de Quilibrium'un belgeleri bu
  hizmetin ağla nasıl eşleştiğini söyler.
- **Geçmiş.** Her üyenin istemcisi Space'in kendi kopyasını yerel depolamada tutar ve her iki
  istemci de çevrimdışıyken gönderilen mesajları hizmetteki gelen kutularından alır. Daha eski geçmiş
  için web ve masaüstü istemcisi çevrimiçi bir üyeden senkronizasyon ister, mobil istemci ise
  hizmetin her Space için tuttuğu kalıcı bir günlüğü yeniden oynatır.
- **Moderasyon.** Roller silme, sabitleme, susturma ve `@everyone` bahsetmeleri yetkisi verir. Her
  üyenin istemcisi her moderasyon eyleminin imzasını kontrol eder ve eylemi yalnızca imzalayan doğru
  role sahipse uygular. Sahip bir üyeyi atabilir; bu, Space'in anahtarlarını yeniler, böylece atılan
  üye yeni mesajları okuyamaz. Bir Space imzalı mesajları zorunlu kılabilir ya da üyelerin imzasız,
  inkâr edilebilir mesajlar göndermesine izin verebilir. Herkese açık dizindeki listelemelerin bir
  inceleme durumu vardır ve kullanıcılar Space'leri, mobil uygulamadan ise tek tek mesajları da,
  Quorum hizmetine şikâyet edebilir.
- **Kod.** Web ve masaüstü istemcisi AGPL-3.0, mobil istemci ise GPL-3.0 lisanslıdır. Mobil
  istemcide ayrıca bir kripto cüzdanı, Farcaster entegrasyonu ve aşağıda anlatılan ücretli bir
  abonelik olan Apex bulunur.

## Nerede ayrışırlar

### Özel gruplar ve herkese açık topluluklar

Bir Quorum Space'i bir üye grubudur: onu yalnızca anahtarlarına sahip olanlar okuyabilir ve katılmak
için bir davet bağlantısı gerekir. Herkese açık bir bağlantı herkesi içeri alır, ama ancak
katıldıktan sonra. Bir Bitsocial topluluğunun üyeliği yoktur. Herkes onu herhangi bir uygulamadan,
katılmadan okuyabilir ve herkes, topluluğun sınamasına tabi olarak gönderi paylaşmayı deneyebilir.

### Bir grubu çevrimiçi tutan nedir

Bir Quorum Space'inin barındırıcı düğümü yoktur. Üyeler mesajlarını Quorum hizmeti üzerinden
gönderir; hizmet her üye için bir kopyayı o üyenin istemcisi alana kadar tutar ve diğerlerinin
konuşabilmesi için sahibin çevrimiçi olması gerekmez. Bir Bitsocial topluluğu, her gönderiyi kabul
eden ya da reddeden ve topluluğun en güncel durumunu yayımlayan sahibinin düğümünde yaşar.
Topluluk, eşler onu seed ettiği sürece okunabilir kalır, ama düğümü çevrimdışıyken yeni gönderi
kabul edemez. Bkz.
[Eşler Arası Protokol](/peer-to-peer-protocol/).

### Kuralları kim uygular

Quorum'da kurallar uçta (edge) uygulanır. Bir silmenin, sabitlemenin ya da susturmanın uygulanıp
uygulanmayacağına, imzalayanın rolüne bakarak her üyenin istemcisi karar verir; atma işlemi ise diğer
herkesi yeni anahtarlara taşıyarak çalışır. Bunun yanında hizmet operatörü şikâyetleri alır ve
herkese açık dizini inceler. Bitsocial'da kurallar topluluk düğümünde uygulanır: topluluğun
sınamasını geçemeyen bir gönderi asla kabul edilmez ve düğüm, moderatörlerinin kaldırma kararlarını
uygular. Bkz.
[Küresel Yasaklamalar Değil, Yerel Denetim](/local-moderation/).

### Spam denetimi

Quorum spamı esas olarak davetlerle dışarıda tutar. Tek kullanımlık bir bağlantı bir kişiyi,
herkese açık bir bağlantı ise ona sahip olan herkesi içeri alır ve sahip sonradan üye atıp
anahtarları yenileyebilir. İstemciler ayrıca bir üyenin ne kadar hızlı mesaj gönderebileceğini
sınırlar; web ve masaüstü istemcisi ise herhangi bir göndericiden 10 saniyede 10'u aşan Space
mesajlarını yok sayar. Bitsocial kimlikleri
ücretsiz anahtar çiftleridir; bu yüzden her topluluk bir gönderiyi kabul etmeden önce çalıştıracağı
captcha, ödeme, token bakiyesi veya izin listesi gibi bir sınama seçer. Bkz.
[Özel Spam Önleme Sınamaları](/custom-challenges/).

### İstemci ve ağ

Bir Quorum uygulaması, Quilibrium Inc.'in çalıştırdığı Quorum hizmetinin bir istemcisidir.
Uygulamalar kendileri eşler arası bir ağa katılmaz; bu yüzden bir Space'e erişmek o tek uç noktaya
bağlıdır. Bundan ayrı olarak Quilibrium kendi başına bir ağdır: Ekim 2026'da
[ağ gezgini](https://dashboard.quilibrium.com/) 99 parçada (shard) 114 erişilebilir eş ve 181
kanıtlayıcı (prover) gösteriyordu.

Bir Bitsocial web uygulaması sekmede bir libp2p düğümü çalıştırabilir, topluluk içeriğini eşlerden
alabilir ve gossipsub üzerinden yayımlayabilir. Eş keşfi yalnızca sağlayıcı adreslerini döndüren
HTTP yönlendiricileri üzerinden yapılır; herkes bir yönlendirici çalıştırabilir ve istemciler
yapılandırmalarını değiştirerek yönlendirici değiştirebilir. Bkz.
[Tarayıcıda Eşler Arası Ağ](/browser-p2p/).

### Ekonomi

Quilibrium'un merkezinde bir token vardır. QUIL düğümler tarafından madencilikle üretilir ve ağ
ücretlerini öder; sarılmış (wrapped) bir sürümü olan wQUIL ise Ethereum'da dolaşımdadır. Quorum'un
kendisi ücretsizdir ve ödeme ya da telefon numarası gerektirmez. İsteğe bağlı Apex aboneliği
[ayda 5 dolar](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8)
tutar; Ethereum üzerinde wQUIL, SNAP veya USDC ile ödenir ve Quilibrium Inc. ile abonenin seçtiği
dört Space arasında paylaştırılır. Bitsocial'ın protokolde bir ödeme katmanı yoktur; bir topluluk,
sınaması aracılığıyla ödeme veya token isteyebilir.

### Özel mesajlar

Quorum'un daha güçlü olduğu yer burasıdır. Doğrudan mesajlar ve Space mesajları ileri gizlilikle
uçtan uca şifrelenir ve mesaj içeriği Quorum hizmetine yalnızca şifreli metin olarak ulaşır; tek
istisna, bir üyenin mobil uygulamadan bir mesajı şikâyet etmesidir, bu durumda uygulama mesajın
içeriğini Quorum'un moderatörlerine gönderir.
Bitsocial herkese açık topluluklara odaklanır ve henüz yerleşik doğrudan mesajlaşması yoktur. Bir
Bitsocial gönderisi pubsub üzerinden iletilirken topluluk düğümünün anahtarına göre şifrelenir, ama
kabul edildikten sonra herkese açıktır.

## Projenin durumu

Ekim 2026'da Quorum deposu web uygulamasını beta olarak nitelendiriyordu ve Quorum web sitesi Google
Play ve App Store uygulamalarını hâlâ "yakında" olarak listeliyordu. İki istemci de birbirinden
ayrışıyor: mobil uygulamada cüzdan, Farcaster ve Apex özellikleri varken web ve masaüstü istemcisi
Wallet ve Farcaster sayfalarını "yakında" olarak gösteriyor ve ikisi Space geçmişini farklı
yollarla yakalıyor.

Quilibrium'un ana ağı (mainnet), bir duraklamanın ardından ağın yeniden çalışmaya başladığı 30 Eylül
2025'te 2.1 sürümüne ulaştı
([duyuru](https://x.com/QuilibriumInc/status/1973082817236984270)). 2026'da düğüm Rust ile yeniden
yazıldı; uzlaşma için kuantum sonrası imzalar ve eski düğümlerin konuşamadığı bir kablo protokolü
(wire protocol) getirildi. Belgelerin bazı bölümleri çalışan kodu değil tasarımı anlatır:
[mixnet yönlendirmesini](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/)
anlatırlar. Düğümler kendi aralarında trafiği gerçekten de soğan yönlendirmeli (onion-routed)
devreler üzerinden aktarır, ama 2.1.0.25 sürümlü düğümde mixnet hizmeti, mesajları karıştırmadan
kabul eden bir
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
olarak uygulanmıştır.

## Karşılaştırma

| Soru                        | Quorum                                                                                                   | Bitsocial                                                                                             |
| --------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategori                    | Quilibrium Inc.'in uçtan uca şifreli grup mesajlaşma uygulaması                                          | Eşler arası topluluk ağı                                                                              |
| Kimlik                      | Ed448 ana anahtar kümesi artı cihaz başına anahtarlar, geçiş anahtarı veya kurtarma ifadesiyle korunur   | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                             |
| Kim okuyabilir              | Bir Space'in anahtarlarına sahip üyeler                                                                  | Herkes, herhangi bir uygulamadan                                                                      |
| Mesajların bulunduğu yer    | Her üyenin cihazı; Quorum hizmeti teslim edilmemiş kopyaları ve mobil için Space başına bir günlük tutar | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                         |
| İstemcilerin bağlandığı yer | `api.quorummessenger.com` adresindeki Quorum hizmeti                                                     | HTTP yönlendiricileriyle bulunan, libp2p üzerinden eşler; bir tarayıcı sekmesinden de                 |
| Topluluklar                 | Kanalları, rolleri ve davet bağlantıları olan Space'ler                                                  | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                              |
| Spam denetimi               | Davet bağlantıları, anahtar yenilemeli atmalar, istemci tarafı hız sınırları                             | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                                        |
| Moderasyon                  | Her üyenin istemcisinin uyguladığı roller; üyeleri sahip atar; şikâyetler hizmet operatörüne gider       | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer          |
| Özel mesajlar               | Uçtan uca şifreli doğrudan mesajlar                                                                      | Herkese açık topluluklar; henüz yerleşik doğrudan mesajlaşma yok                                      |
| Ekonomi                     | QUIL ağ tokeni; isteğe bağlı aylık 5 dolarlık Apex aboneliği                                             | Protokolde yok; bir sınama ödeme veya token isteyebilir                                               |
| Ana ödünleşim               | Özel, şifreli gruplar, ama her istemci tek bir hizmete bağımlı                                           | Ücretsiz kimlikler ve tarayıcıdan erişim, ama özel mesajlaşma yok ve yalnızca en güncel durum tutulur |
