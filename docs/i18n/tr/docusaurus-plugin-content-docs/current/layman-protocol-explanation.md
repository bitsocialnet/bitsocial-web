---
title: Bitsocial protokolünün tam bir meslekten olmayan açıklaması
description: Bitsocial toplulukları, akran arama, yayınlama, anti-spam zorlukları, moderasyon ve uygulamalar hakkında sade bir İngilizce kılavuzu.
---

# Bitsocial protokolünün tam bir meslekten olmayan açıklaması

Bu sayfada, eşler arası ağ iletişimi, şifreleme anahtarları, IPFS veya pubsub'u zaten anladığınızı varsaymadan Bitsocial açıklanmaktadır.

Bazı ayrıntılar bilerek basitleştirilmiştir. Daha teknik versiyon için [Eşler Arası Protokolü](./peer-to-peer-protocol.md) sayfasını okuyun.

## Kısa versiyon

Bitsocial, toplulukların bir şirket veritabanı yerine anahtarlara ait olduğu sosyal uygulamalara yönelik bir protokoldür.

Bitsocial topluluğunun bir adresi vardır. Uygulamalar, topluluğa hizmet veren eşleri bulmak, bu eşlerden en son gönderileri almak ve eşler arası mesaj kanalı aracılığıyla yeni gönderiler yayınlamak için bu adresi kullanır. Bir gönderi kabul edilmeden önce topluluk, captcha, davet kodu, ödeme, jeton kontrolü, yapay zeka denetim kontrolü, izin verilenler listesi veya kodlanabilecek diğer herhangi bir kural gibi bir anti-spam sorgulamasını talep edebilir.

Temel fikir budur:

1. Bir topluluk özel bir anahtarla kontrol edilir.
2. Açık anahtar topluluğa sabit bir adres verir.
3. Akranlar okuyucuların topluluğu bulmasına ve getirmesine yardımcı olur.
4. Bir topluluk düğümü yeni gönderileri kabul eder veya reddeder.
5. Anti-spam politikası tek bir küresel platforma değil, her topluluğa aittir.

## Hash'ler neden önemlidir?

Karma, veriler için kısa bir parmak izidir.

İki kişi tamamen aynı dosyaya hash işlemi uygularsa aynı parmak izini alırlar. Dosya değişirse parmak izi de değişir. Bu, bir şirketin size dosyanın ne olduğunu söylemesine güvenmeden verileri bulmak ve kontrol etmek için karmaları kullanışlı hale getirir.

Eşler arası sistemler bu fikri sürekli kullanır. Bir web sitesinden "photo.png adlı dosya"yı istemek yerine, bir eş, ağdan belirli bir parmak izine sahip verileri isteyebilir. Başka bir eş yanlış veri döndürürse karma kontrolü başarısız olur.

Bitsocial, gönderi verileri ve diğer topluluk durumu parçaları için karmaları ve içerik tanımlayıcılarını kullanır. Önemli olan nokta basit: Veriler yalnızca şirketin onu barındırdığı yere göre değil, ne olduğuna göre de ele alınabilir.

## Genel anahtarlar neden önemlidir?

Genel anahtar ve özel anahtar eşleşen bir çifttir.

Özel anahtar gizlidir. Kontrolü sağlayan şeydir. Ortak anahtarın paylaşılması güvenlidir. Herkesin bir mesajın, güncellemenin veya denetleme eyleminin gerçekten eşleşen özel anahtardan gelip gelmediğini kontrol etmesine olanak tanır.

Bitsocial normal platform hesaplarından bu şekilde kaçınıyor. Bir şirketin kimlik vermesine gerek yoktur. Bir veritabanı satırının sahibi tanımlamasına gerek yoktur. Anahtar çifti otoritedir.

Açıkça söylemek gerekirse:

- özel anahtar, sahibinin kontrol koludur
- genel anahtar genel kimlik veya adrestir
- imzalar bir eylemin sahibinden geldiğini kanıtlıyor

## Bitsosyal topluluk nedir?

Bitsocial topluluğu yalnızca tek bir uygulamadaki sayfadan ibaret değildir.

Kendi anahtar çifti vardır. Genel anahtar topluluğa sabit bir ağ adresi verir. Özel anahtar, meta veriler, kurallar, moderatör listesi, sorgulama yapılandırması ve kabul edilen en son içeriğe yönelik işaretçiler gibi topluluğun durumuna ilişkin güncellemeleri kontrol eder.

Bu, bir topluluğun bir arayüzden daha uzun süre yaşayabileceği anlamına gelir. Bir uygulama bunu bir pano olarak gösterebilir. Başka bir uygulama bunu bir forum olarak gösterebilir. Gelecekteki bir uygulama bunu profil tabanlı bir akışta gösterebilir. Uygulama değişebilir ancak topluluk adresi hâlâ aynı sahip olunan topluluğa işaret ediyor.

## Okuma nasıl çalışır?

Bir kullanıcı bir Bitsocial topluluğunu açtığında uygulama, sayfa için merkezi bir veritabanı istemez.

Akış buna daha yakın:

1. Uygulama, topluluk adresini zaten biliyor veya bunu bir listeden, bağlantıdan, arama yüzeyinden veya
   insan tarafından okunabilen ad.
2. Uygulama, hafif yönlendiricilere şu anda hangi eşlerin bu topluluk adresini sağladığını soruyor.
3. Yönlendiriciler yalnızca eş adreslerini döndürür. Gönderileri, kuralları, profilleri veya topluluğu döndürmezler
   meta veriler.
4. Uygulama akranlara bağlanır ve en son topluluk durumunu getirir.
5. Bu durum, içerik yayınlamak için işaretçiler içerir.
6. Uygulama, gönderi içeriğini eşlerden alır ve normal bir sosyal arayüzde işler.

Yönlendirici yalnızca bir arama yardımcısıdır. "Bu kimin elinde?" diye sormaya daha yakın. "lütfen bana web sitesinin tamamını yayınlayın" diye sormak yerine.

Bu bölünme hakkında daha fazla ayrıntı için [İçerik Keşfi](./content-discovery.md) adresini okuyun.

## Gönderim nasıl çalışır?

Açık eşler arası ağlar spam gönderilebileceği için yayınlamak okumaktan farklıdır.

Bitsocial, yayınlamayı bir meydan okuma-cevap akışı aracılığıyla gerçekleştirir:

1. Kullanıcı bir gönderi veya yanıt yazar.
2. Uygulama, topluluğun eşler arası mesaj konusuna katılıyor.
3. Uygulama, topluluk düğümünden bir meydan okuma ister.
4. Topluluk düğümü meydan okumayı geri gönderir.
5. Kullanıcı veya uygulama mücadeleyi tamamlar.
6. Uygulama, gönderiyi ve meydan okuma yanıtını gönderir.
7. Topluluk düğümü yanıtı ve gönderiyi kontrol eder.
8. Başarılı olursa topluluk düğümü, gönderiyi topluluğun bir sonraki güncellemesine kabul eder.
9. Diğer okuyucular güncellenmiş topluluk durumunu eşlerden alır.

Bu zorluk, gönderinin kabul edilen topluluk devletinin bir parçası haline gelmesinden önce gerçekleşir. Spam'in önce kabul edilip sonra gizlendiği sistemlerden önemli farkı budur.

## Spam karşıtı zorluklar neden önemlidir?

Çoğu sosyal platform, anti-spam'i platform politikasına dönüştürüyor. Neyin geçerli bir hesap, geçerli bir gönderi, geçerli erişim veya geçerli kullanıcı olarak sayılacağına bir şirket karar verir.

Bitsocial bunları ayırıyor. Protokol, topluluklara bir gönderiyi kabul etmeden önce bir meydan okuma talep etmeleri için bir yol sunuyor ancak her topluluğu aynı meydan okumayı kullanmaya zorlamaz.

Bir topluluk captcha kullanabilir. Bir başkası davet kodlarını kullanabilir. Bir diğeri SMS kontrolü, ödeme, NFT, jeton bakiyesi, yapay zeka denetleme puanı, itibar kanıtı, topluluğa özel izin verilenler listesi veya özel bir kural gerektirebilir.

Spam değiştiği için bu esneklik önemlidir. Protokol düzeyindeki bir spam kuralı eski hale gelir. Topluluk düzeyindeki bir zorluk, tüm ağı taşımadan gelişebilir.

Odaklanmış açıklama için [Özel Spam Karşıtı Mücadeleleri](./custom-challenges.md) bölümünü okuyun.

## Moderasyon nasıl çalışır?

Bitsocial moderasyondan bağımsız değildir. Bu, küresel bir süper yöneticinin olmadığı bir denetimdir.

Bir topluluğun sahipleri ve moderatörleri olabilir. Moderatör adresleri topluluk durumunun bir parçasıdır. Moderatör bir eylem gerçekleştirdiğinde bu eylem imzalanabilir. Topluluk düğümü ve istemciler imzayı moderatör listesine göre kontrol edebilir.

Bu, denetime yerel bir kapsam kazandırır:

- bir topluluk sahibi bu topluluğu kontrol eder
- moderatörler topluluğun tanıdığı anahtarlar aracılığıyla hareket eder
- uygulamalar neyi indeksleyeceğini, sıralayacağını, gizleyeceğini veya vurgulayacağını hâlâ seçebilir
- hiçbir protokol düzeyindeki şirket hesabı her kimliği silemez veya her topluluğa el koyamaz

Pratikte bu, bir topluluğun kendi kurallarını tüm ağ için yasaya dönüştürmeden spam'i kaldırabileceği veya kendi alanı içinde kuralları uygulayabileceği anlamına gelir.

Politika görünümü için [Küresel Yasaklamalar Değil, Yerel Denetim](./local-moderation.md) adresini okuyun.

## Hangi uygulamalar eklenir?

Protokol, ürünün tamamının nasıl görünmesi gerektiğine karar vermez.

Bir uygulama, protokole insan deneyimini ekler:

- varsayılan topluluk listeleri
- arama ve keşif
- beslemeler ve sıralama
- düzen ve gönderme arayüzü
- medya kullanımı
- denetleme araçları
- mobil, masaüstü veya tarayıcı paketlemesi
- iş modeli ve varsayılanlar

Bitsocial'ın farklı uygulama stillerini destekleyebilmesinin nedeni budur. 5chan bir görüntü panosu gibi hissedebilir. Seedit forum tarzı bir tartışma gibi hissedilebilir. Diğer istemciler, altındaki uyumlu Bitsocial topluluklarını kullanmaya devam ederken farklı keşif yüzeyleri, sıralama sistemleri, denetleme görünümleri veya topluluk varsayılanları oluşturabilir.

Protokol, sahipliği ve yayınlamayı taşınabilir tutar. Uygulamalar ürün kalitesi konusunda rekabet eder.

## Genel RPC'nin eklediği özellikler

Eşler arası bir topluluk düğümünü doğrudan çalıştırmak güçlüdür, ancak herkes her zaman açık olan bir makineyi yönetmek istemez.

Public RPC, Bitsocial'ı daha kullanışlı hale getirebilecek hizmet katmanıdır. Genel bir RPC sağlayıcısı, kullanıcıların toplulukları bir telefondan veya hafif istemciden yönetmelerine yardımcı olabilirken, uzun vadeli sahiplik modeli yine de kullanıcıların başka bir yere taşınmasına, kendi kendine barındırmasına veya rakip bir sağlayıcıyı seçmesine izin vermelidir.

Ayrım önemlidir:

- RPC çalışma süresi ve rahatlık konusunda yardımcı olabilir
- RPC kalıcı velayet haline gelmemeli
- sahip ilişkisi tek bir sağlayıcının veritabanına değil, anahtarlara bağlı kalmalıdır

## Bitsocial ne değildir?

Bitsocial bir blockchain sosyal ağı değildir. Sosyal medyanın her gönderinin tek bir küresel defterde işlem haline gelmesine ihtiyacı yok.

Bitsocial, ActivityPub anlamında bir federasyon değildir. Bir topluluğun, tek bir etki alanına, tek yöneticiye ve tek sunucu veritabanına sahip tek bir sunucuda hesap olması gerekmez.

Bitsocial da tek bir uygulama değil. Uygulamalar, topluluklar, düğümler, yönlendiriciler, RPC sağlayıcıları, keşif hizmetleri, istenmeyen posta önleme modülleri ve denetleme araçları için paylaşılan bir protokol katmanıdır.

Mesele şu ki, her kullanıcının paylaşım yapmadan önce tüm bunları anlaması gerekmiyor. Buradaki önemli nokta, altındaki sahiplik modeli farklıyken ürünün normal hissettirebilmesidir.

## Bundan sonra nereye gitmeli

- [Eşler Arası Protokolü](./peer-to-peer-protocol.md) teknik akışı açıklıyor.
- [İçerik Keşfi](./content-discovery.md), ağ arama ile uygulama iyileştirmeyi açıklıyor.
- [Özel Anti-Spam Mücadeleleri](./custom-challenges.md) sorgulama sistemini açıklıyor.
- [Kimlik ve Topluluk Sahipliği](./identity-and-ownership.md) anahtar kontrollü olduğunu açıklıyor
  mülkiyet.
- [Kendi müşterinizi birleştirme](/build-your-own-client/), bağımsız uygulamaların nasıl geliştirilebileceğini açıklıyor
  aynı ağ.
