---
title: Bitsocial ve Urbit
description: Ethereum tabanlı Urbit ID'leri ve Tlon Messenger'da barındırıcının çalıştırdığı gruplarıyla kişisel sunuculardan oluşan bir ağ olan Urbit'in Bitsocial'ın eşler arası topluluklarıyla nasıl karşılaştırıldığı.
---

# Bitsocial ve Urbit

[Urbit](https://urbit.org/) kişisel sunuculardan oluşan bir ağdır. Her kullanıcının gemi (ship) adı
verilen, sürekli açık bir bilgisayarı vardır; bu bilgisayar Urbit'in kendi dilleriyle (Nock ve Hoon)
yazılmış kendi işletim sistemini (Arvo) çalıştırır ve bir Urbit ID ile tanımlanır. Başlıca sosyal
uygulaması [Tlon Messenger](https://tlon.io/) olup Urbit'i geliştirmek için 2013'te kurulan Tlon
şirketi tarafından yapılmıştır.

Urbit tüm bilişim yığınının yerini almayı amaçlar; bu yüzden Bitsocial'dan çok daha geniş kapsamlı
bir projedir. Yine de sosyal katmanı Bitsocial'ınkine yakın bir model kullanır: bir topluluk
sahibinin düğümünde yaşar ve içeri neyin gireceğine o düğüm karar verir. İkisi, kimin sunucu
çalıştırması gerektiği ve spamın nasıl dışarıda tutulduğu konusunda ayrışır.

## Urbit nasıl çalışır

- **Urbit ID'leri.** Her geminin bir Urbit ID'si vardır: `~sampel-palnet` gibi telaffuz edilebilir
  bir ad olarak gösterilen bir sayı. Katman 1 ID'leri, sahipliği ve ağ iletişiminde kullanılan açık
  anahtarları Ethereum'daki Azimuth sözleşmelerinde kayıtlı olan NFT'lerdir. Ücretleri düşürmek için
  2021'de eklenen katman 2 ID'leri bir "naif rollup" kullanır: işlemleri Ethereum'a toplu hâlde
  gönderilir, ama sahiplikleri Azimuth sözleşmesinde saklanmaz ve her gemi bunu yerel olarak
  hesaplar. [Urbit ID belgelerine](https://docs.urbit.org/urbit-id/what-is-urbit-id) ve
  [Get on Urbit](https://docs.urbit.org/get-on-urbit) kılavuzuna göre Tlon, herkesin ücretsiz
  kullanabileceği bir roller çalıştırır.
- **Sabit bir hiyerarşi.** Adres alanında 256 galaksi, 65.536 yıldız ve günlük kullanım için
  yaklaşık 4 milyar gezegen bulunur. Galaksiler yıldızları, yıldızlar da gezegenleri çıkarır; her
  gezegen de kendi cihazları için uydular çıkarabilir. Kuyruklu yıldızlar, bir geminin kendisi için
  ürettiği ve blok zincirine hiç dokunmayan ücretsiz ID'lerdir. Galaksi sahipleri, Azimuth
  sözleşmelerine yapılacak yükseltmeleri oylayan ve Urbit Foundation'ın yönetim kurulunu seçen
  Galactic Senate'i oluşturur.
- **Ağ.** Gemiler şifreli paketleri eşler arası olarak birbirleriyle alıp verir. Temmuz 2026'dan bu
  yana ağ protokolü [Directed Messaging](https://urbit.org/blog/directed-messaging) olup eski Ames
  protokolünün içerik merkezli bir yeniden yazımıdır. Eş keşfini galaksiler üstlenir:
  [Directed Messaging makalesine](https://urbitsystems.tech/article/v03-i01/directed-messaging) göre
  her galaksi altındaki gemilerin nerede olduğunu takip eder ve iki gemi birbirine doğrudan
  ulaşabilene kadar ya da bir güvenlik duvarı buna engel olduğu sürece paketleri onlara aktarır.
- **Gruplar.** Tlon Messenger'da bir grup, onu kuranın gemisinde barındırılır.
  [Tlon SSS sayfasına](https://tlon.io/posts/faq) göre üyeler mesajlarını barındırıcıya gönderir,
  barındırıcı bunları her üyenin gemisine dağıtır ve her üyenin gemisi kendi kopyasını tutar.
  Rolleri, kanalları ve gruba kabulü barındırıcı denetler. Bir grup herkese açık, özel veya gizli
  olabilir ve
  [tek tek gemileri ya da ID kademelerinin tamamını yasaklayabilir](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanallar sohbetler, not defterleri ya da görsel ve bağlantı koleksiyonlarıdır.
- **Barındırma.** Tlon'a kaydolan yeni bir kullanıcı, Tlon'un çalıştırdığı ve anahtarlarını Tlon'un
  emanette tuttuğu bir gemi alır. Kullanıcı gemiyi ve onun ana anahtarını (master ticket) dışa
  aktarıp başka bir yerde çalıştırabilir: bir [Native Planet](https://www.nativeplanet.io/)
  cihazında ya da Linux, macOS veya Windows üzerinde Vere çalışma zamanıyla. Gemiler henüz büyük
  dosyaları doğrudan depolayamadığı için Tlon Messenger görselleri ve diğer medyayı S3 uyumlu bulut
  depolamasına koyar.

## Nerede ayrışırlar

### Kimin sunucu çalıştırması gerekir

Urbit'te her katılımcı bir sunucudur. Tlon'un uygulamaları kullanıcının kendi gemisinin ön
yüzleridir ve bir grubu okumak bile o gemi üzerinden geçer. Kendi gemisini çalıştırmayanlar bir gemi
kiralar; bu da bir barındırma sağlayıcısını yeniden işin içine sokar: Tlon, barındırdığı
kullanıcıların anahtarlarını tutar ve bakım için sınırlı erişimini korur, ancak kullanıcılar
gemilerinin tamamıyla birlikte ayrılabilir.

Bitsocial'da yalnızca topluluk sahiplerinin sürekli açık bir düğüme ihtiyacı vardır. Okuyanlar ve
gönderi paylaşanlar bir tarayıcı sekmesinin içinde eşler arası bir düğüm çalıştırabilir ve
hesapları, uygulamanın sakladığı bir anahtar çiftidir. Bkz.
[Tarayıcıda Eşler Arası Ağ](/browser-p2p/). Biri barındırılan bir düğüm kullandığında bile
Bitsocial'ın tasarımı, kimliğin emanetini devretmeden çevrimiçi kalma işini devredebilmesini
amaçlar. Bkz. [Kimlik ve Topluluk Sahipliği](/identity-and-ownership/).

### Topluluğun barındırıcısı

İkisinin birbirine en çok yaklaştığı yer burasıdır. Bir Tlon grubu da bir Bitsocial topluluğu da
sahibinin düğümünde yaşar. Kimin gönderi paylaşabileceğine barındırıcı karar verir, moderasyonu
uygular ve sonucu dağıtır; iki protokol de barındırıcının üstüne bir moderatör koymaz. İkisinde de
barındırıcının çevrimiçi olması gerekir. Tlon'un SSS sayfası, barındırıcı çevrimdışı olursa "grup da
onlarla birlikte çöker" der; bir Bitsocial topluluğu da düğümü çevrimdışıyken yeni gönderi kabul
edemez.

İçeriği farklı biçimlerde depolarlar. Her üyenin gemisi grubun geçmişinin bir kopyasını tutar;
böylece barındırıcı kapalıyken üyeler daha önce aldıklarını okumaya devam edebilir. Bir Bitsocial
okuyucusu topluluğun en güncel durumunu topluluğun düğümünden ya da onu seed eden eşlerden alır;
böylece çevrimdışı bir topluluk, eşlerde bulunduğu sürece okunabilir kalır, ama ağ yalnızca en
güncel durumu tutar.

Bir Tlon grubunun ayrıca bir üye listesi vardır ve barındırıcısı grubu yalnızca davetle
katılınabilir hâle getirebilir. Bir Bitsocial topluluğunun üyeliği yoktur: herkes onu okuyabilir ve
herkes, topluluğun sınamasına tabi olarak gönderi paylaşmayı deneyebilir.

### Spam ve kimlik

Urbit spamla kimliği kıt hâle getirerek mücadele eder. Gezegen arzı sabittir ve her gezegeni bir
yıldız çıkarır. Ücretsiz kuyruklu yıldızlar bu kıtlığı aşar; bu yüzden kıtlığın geçerli kalmasını
isteyen gruplar onları geri çevirir: Urbit belgeleri bazı grupların kuyruklu yıldızları reddettiğini
belirtir ve bir Tlon grubu tek bir ayarla kuyruklu yıldız kademesinin tamamını yasaklayabilir.
Kuyruklu yıldızlar dışarıda bırakıldıktan sonra, yasaklanan bir kullanıcının geri dönebilmesi için
bir yıldız sahibinden başka bir gezegen alması gerekir. İtibar da hiyerarşiyi izleyebilir: Azimuth,
galaksilerin ve yıldızların ID'leri işaretlemesine izin veren bir Censures sözleşmesi içerir. Kıtlık
adres alanına yerleşik olduğu için kuyruklu yıldızları geri çeviren her grupta aynı şekilde işler.

Bitsocial kimlikleri ücretsiz anahtar çiftleridir. Her topluluk bir gönderiyi kabul etmeden önce
captcha, ödeme, token bakiyesi veya izin listesi gibi kendi sınamasını seçer; diğer topluluklar
farklı bir seçim yapabilir. Bkz. [Özel Spam Önleme Sınamaları](/custom-challenges/).

### Blok zinciri ve yönetişim

Urbit'in kimlik katmanı Ethereum'a bağlıdır. Azimuth sözleşmeleri katman 1 sahipliğini ve ağ
anahtarlarını kaydeder, katman 2 işlemleri Ethereum'a toplu hâlde gönderilir ve Galactic Senate,
Azimuth'u yöneten sözleşmeyi yükseltebilir. Aynı 256 galaksi eş keşfini ve paket aktarımını da
üstlenir; böylece sabit bir kimlik kümesi hem yönetişimi hem de ağın yönlendirmesinin bir kısmını
taşır.

Bitsocial kimlikleri kayıt gerektirmeyen anahtar çiftleridir. `.bso` ve `.eth` adları, bu
anahtarlara çözümlenen isteğe bağlı takma adlardır. Eş keşfi yalnızca sağlayıcı adreslerini döndüren
HTTP yönlendiricileri üzerinden yapılır; herkes bir yönlendirici çalıştırabilir ve istemciler
yapılandırmalarını değiştirerek yönlendirici değiştirebilir.

### Kapsam

Urbit genel amaçlı bir bilgisayardır. Bir gemi bir Git uzak deposu, kişisel bir bilgi tabanı ya da
yapay zekâ ajanları barındırabilir; Tlon Messenger de pek çok programdan yalnızca biridir. Urbit
için geliştirme yapmak çoğunlukla Arvo için Hoon uygulamaları yazmak demektir. Bitsocial ise
[5chan](/apps/5chan/) ve [Seedit](/apps/seedit/) gibi uygulamaları olan, herkese açık topluluklar
için bir protokoldür. Mevcut yığının (libp2p, IPFS ve tarayıcı) yerini almak yerine onun üzerinde
çalışır ve istemcileri sıradan web araçlarıyla geliştirilir. Bkz.
[Kendi istemcinizi geliştirin](/build-your-own-client/).

### Özel mesajlar

Urbit'in daha güçlü olduğu yer burasıdır. Doğrudan mesajlar bir gemiden diğerine doğrudan gider,
gemiler arasındaki tüm trafik şifrelenir ve gruplar özel veya gizli olabilir. Tlon, mesajların
aktarım sırasında şifrelendiğini ama gemide şifrelenmeden saklandığını belirtir. Bitsocial herkese
açık topluluklara odaklanır ve henüz yerleşik doğrudan mesajlaşması yoktur.

## Projenin durumu

Urbit çalkantılı bir dönemden geçti.
[CoinDesk'in haberine](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project)
göre Ağustos 2024'te çekirdek geliştirmeyi yönlendiren kâr amacı gütmeyen kuruluş Urbit Foundation
icra direktörünü kovdu; kurucu Curtis Yarvin resmî bir unvan olmadan stratejiye liderlik etmek için
geri döndü, birkaç çekirdek geliştirici ayrıldı ve Foundation'ın parası ancak birkaç ay yetecek
durumdaydı. Yarvin, Azimuth'un mevcut bir Ethereum katman 2 ağına (büyük olasılıkla Base'e)
taşınmasını ve gezegenlere dönüştürülebilen, birbirinin yerine geçebilir (fungible) "vize" tokenleri
çıkarılmasını önerdi. Ekim 2026 itibarıyla Urbit'in
[ID belgeleri](https://docs.urbit.org/urbit-id/what-is-urbit-id) hâlâ Azimuth'u naif rollup'ıyla
birlikte Ethereum üzerinde tarif ediyor. Ekim 2025'te Galactic Senate, Foundation'ın yönetim
kurulunu değiştirdi ve yeni kurul yeni bir icra direktörü atadı
([duyuru](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Geliştirme sürüyor. Directed Messaging, 14 Temmuz 2026'da 408k sürümüyle yayına girdi. Haziran
2026'da Tlon Messenger
[bekleme listesi olmadan herkese açık kayıtları başlattı](https://urbit.org/blog/this-month-in-urbit-june-2026)
ve Tlon artık kendini insanlarla yapay zekâ ajanlarının birlikte çalıştığı bir yer olarak tanıtıyor.

## Karşılaştırma

| Soru                       | Urbit                                                                                                                  | Bitsocial                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategori                   | Kişisel sunucu ağı ve işletim sistemi                                                                                  | Eşler arası topluluk ağı                                                                              |
| Kimlik                     | Urbit ID'leri: Ethereum'da ya da onun katman 2 rollup'ında yaklaşık 4 milyar gezegen, artı ücretsiz kuyruklu yıldızlar | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                             |
| Kim sunucu çalıştırır      | Her kullanıcı, kendi gemisinde ya da barındırılan bir gemide                                                           | Topluluk sahipleri; okuyanlar ve gönderi paylaşanlar bir tarayıcı sekmesi kullanabilir                |
| Gönderilerin bulunduğu yer | Grup barındırıcısının gemisi ve her üyenin gemisindeki bir kopya                                                       | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                         |
| Topluluklar                | Kurucusunun gemisinde barındırılan, üye listeli gruplar                                                                | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                              |
| Spam denetimi              | Yıldızların çıkardığı kıt ID'ler; gruplar gemileri ya da kademelerin tamamını yasaklar                                 | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                                        |
| Moderasyon                 | Grup barındırıcısının rolleri ve yasakları                                                                             | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer          |
| Eş keşfi                   | Galaksiler altlarındaki gemileri takip eder ve onlar için aktarım yapar                                                | HTTP yönlendiricileri sağlayıcı eşleri döndürür ve içerik depolamaz                                   |
| Yönetişim                  | 256 galaksiden oluşan Galactic Senate, Azimuth yükseltmelerini oylar                                                   | Kimlikler veya topluluklar üzerinde protokol düzeyinde bir otorite yok                                |
| Özel mesajlar              | Şifreli doğrudan mesajlar ve yalnızca davetle katılınan gruplar                                                        | Herkese açık topluluklar; henüz yerleşik doğrudan mesajlaşma yok                                      |
| Ana ödünleşim              | Özel gruplarıyla eksiksiz bir kişisel bilgisayar, ama her kullanıcının sürekli açık bir gemiye ihtiyacı var            | Ücretsiz kimlikler ve tarayıcıdan erişim, ama özel mesajlaşma yok ve yalnızca en güncel durum tutulur |
