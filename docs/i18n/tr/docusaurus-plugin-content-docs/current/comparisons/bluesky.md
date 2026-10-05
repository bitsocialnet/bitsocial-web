---
title: Bitsocial ve Bluesky
description: Kişisel veri sunucuları, röleleri ve AppView'larıyla Bluesky ve AT Protocol'ün Bitsocial'ın eşler arası topluluklarıyla nasıl karşılaştırıldığı.
---

# Bitsocial ve Bluesky

[Bluesky](https://bsky.app/), Bluesky Social PBC'nin tasarladığı [AT Protocol](https://atproto.com/)
üzerine kurulu bir mikroblog uygulamasıdır. Protokol, bir sosyal ağı ayrı hizmetlere böler: kişisel
veri sunucuları hesapları barındırır, röleler bunları tek bir akışta toplar ve AppView'lar bu akışı
dizinleyerek insanların gördüğü zaman akışlarına ve ileti dizilerine dönüştürür. Belgeleri, hesap
verilerinin "eşler arası bir modelin aksine" barındırıcı sunucularda depolandığını belirtir
([genel bakış](https://atproto.com/guides/overview)).

## AT Protocol nasıl çalışır

- **Sunuculardaki depolar.** Her gönderi, beğeni veya takip, yazarın kişisel veri sunucusunda (PDS)
  barındırılan imzalı deposundaki bir kayıttır. Varsayılan sunucuları Bluesky işletir ve herkes kendi
  sunucusunu barındırabilir.
- **Röleler.** Röleler her PDS'ye abone olur ve değişiklikleri firehose adı verilen tek bir akış
  olarak yeniden yayınlar. 2025'teki bir protokol güncellemesinden bu yana her depoyu arşivlemiyorlar;
  bu da onları çalıştırmayı çok daha ucuz hâle getirdi
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView'lar.** Bir AppView firehose'un tamamını dizinler ve zaman akışlarını, eksiksiz yanıt
  dizilerini, sayaçları ve aramayı sunar. Ağın en çok kaynak tüketen parçasıdır.
- **Kimlik.** Bir hesap bir DID'dir: genellikle tek bir küresel dizine kayıtlı `did:plc` ya da bir alan
  adına bağlı `did:web`. DID belgesi hesabın kullanıcı adını, imzalama anahtarını ve mevcut sunucusunu
  listeler. İmzalama anahtarını PDS tutar; `did:plc` ayrıca kullanıcıların rotasyon anahtarları
  tutmasına izin verir, böylece eski barındırıcının yardımı olmadan taşınabilirler
  ([kimlik kılavuzu](https://atproto.com/guides/identity)).
- **Kullanıcı adları.** Kullanıcı adları, `alice.bsky.social` ya da kullanıcının sahip olduğu bir alan
  adı gibi DNS adlarıdır ve DID'e göre doğrulanır.
- **Moderasyon.** Barındırma ile görünürlük ayrı katmanlardır. Herkes bir etiketleyici çalıştırabilir
  ve kullanıcılar etiketleyicileri üst üste kullanabilir
  ([moderasyon kılavuzu](https://atproto.com/guides/moderation)), ama Bluesky uygulaması her zaman
  Bluesky'nin kendi moderasyonunu uygular. Yazarlar gönderilerine kimlerin yanıt verebileceğini
  sınırlayabilir ve yanıtları gizleyebilir.

## Nerede ayrışırlar

### Sunucular mı, eşler mi

Bluesky'nin verileri sunucularda bulunur: her hesabı bir PDS barındırır, röleler firehose'u taşır ve
istemcilerin gösterdiklerini AppView'lar sunar. Tarayıcı bu hizmetlerin bir HTTP istemcisidir, asla
bir eş değildir. Bitsocial'da içeriği topluluğun düğümü ve onu okuyan eşler sunar; bir web uygulaması
da kendi eşler arası düğümünü çalıştırabilir. Bkz. [Tarayıcıda Eşler Arası Ağ](/browser-p2p/).

### Küresel görünüm mü, topluluklar mı

AT Protocol tek bir küresel görünüm için tasarlanmıştır: bir AppView her yanıtı görür, bu yüzden
ileti dizileri ve arama eksiksizdir. Bitsocial'ın küresel bir dizini yoktur; her topluluk kendi
durumunu yayımlar ve uygulamalar keşfi bunun üzerine kurar. Bkz. [İçerik Keşfi](/content-discovery/).

Bluesky'nin bugün herkese açık gönderiler için bir topluluk nesnesi yoktur. Haziran 2026'da, bazı
gizlilik düzeylerinde gönderi paylaşımının onaya bağlı olduğu
[yerleşik toplulukları duyurdu](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k); Ekim 2026
itibarıyla bunlar henüz kullanıma sunulmamıştı. Bitsocial'da topluluklar temel nesnedir ve gönderileri
topluluğun düğümü kabul eder veya reddeder.

### Spam denetimi

Bluesky spamla sunucularındaki hız sınırları, rölede yeni barındırıcılara getirilen sınırlar, otomatik
tespit, insan incelemesi ve etiketlerle mücadele eder; yazarlar da yanıtları kısıtlayabilir. Bir
gönderinin kabul edilmeden önce neyi geçmesi gerektiğine karar veren topluluk düzeyinde bir kapı
yoktur. Bitsocial'da her topluluk kendi sınamasını seçer. Bkz.
[Özel Spam Önleme Sınamaları](/custom-challenges/).

### Anahtarları kim tutar

Bluesky'nin kendi sunucularındaki hesaplar parolayla giriş yapar ve bu sunucular hesapların imzalama
anahtarlarını emanet olarak tutar ([Kleppmann ve ark.](https://arxiv.org/abs/2402.03239)). Bir Bluesky
protokol mühendisine göre
[hesapların çoğunun bağımsız olarak denetlenen rotasyon anahtarları yoktur](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Bitsocial kimliği, kullanıcının uygulamasının ürettiği ve tuttuğu bir anahtar çiftidir.

### Altyapıyı çalıştırmak

Kişisel bir sunucu ucuzdur: [referans PDS](https://github.com/bluesky-social/pds) 20 kullanıcıya kadar
1 GB RAM önerir. Ağın tamamını kapsayan bağımsız bir AppView büyük bir projedir; 2025'te kurulan bir
tanesinin [aylık maliyeti yaklaşık 200 dolardı](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w) ve bunun
büyük kısmı 16 TB depolama içindi. Bitsocial'ın çoğaltılacak küresel bir dizini yoktur ve bir topluluk
düğümü tüketici donanımında çalışır.

## Karşılaştırma

| Soru                       | Bluesky (AT Protocol)                                                                                   | Bitsocial                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kategori                   | Küresel dizine sahip federe sunucular                                                                   | Eşler arası topluluk ağı                                                                     |
| Kimlik                     | İmzalama anahtarlarını genellikle sunucunun tuttuğu DID                                                 | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                    |
| Gönderilerin bulunduğu yer | Yazarın kişisel veri sunucusundaki deposu                                                               | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                |
| Çevrimiçi tutan            | Varsayılan olarak Bluesky'nin işlettiği PDS barındırıcıları, röleler ve AppView'lar                     | Topluluk sahibinin düğümü ve yardımcı seeder'lar                                             |
| Topluluklar                | Herkese açık gönderiler için henüz yok (2026'da duyuruldu)                                              | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                     |
| Spam denetimi              | Sunucu hız sınırları, otomatik tespit, etiketler, yanıt denetimleri                                     | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                               |
| Moderasyon                 | Üst üste kullanılabilen etiketleyiciler; Bluesky uygulaması her zaman Bluesky'nin moderasyonunu uygular | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer |
| Adlar                      | DID'e göre doğrulanan DNS kullanıcı adları                                                              | Anahtarlara çözümlenen `.bso` ve `.eth` adları                                               |
| Tarayıcı                   | Bir PDS'nin ve bir AppView'un HTTP istemcisi                                                            | Sıradan bir tarayıcı sekmesinde çalışan eşler arası düğüm                                    |
| Ana ödünleşim              | Eksiksiz küresel ileti dizileri ve arama, ama toplama işi ağır sunucular gerektirir                     | Ağır bir küresel dizin yok, ama ağ çapında eksiksiz bir görünüm de yok                       |
