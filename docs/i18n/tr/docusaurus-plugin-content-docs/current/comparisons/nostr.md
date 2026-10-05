---
title: Bitsocial ve Nostr
description: Nostr'un röle tabanlı modelinin, veri yolundan kimliğe, gruplardan spam denetimine ve moderasyona kadar Bitsocial'ın eşler arası topluluklarıyla nasıl karşılaştırıldığı.
---

# Bitsocial ve Nostr

Nostr, federe veya blok zinciri kategorilerine tam oturmaz. Kullanıcılara hesapları örnekler vermez;
zincir, uzlaşı, gas veya küresel sıralama da yoktur. Nostr'u tanımlamanın daha iyi yolu **röle
tabanlı sosyal medya** demektir: kullanıcılar anahtar çiftleri tutar, olayları imzalar ve bunları,
olayları depolayıp sunan sıradan sunucular olan rölelere yayımlar
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Nostr'un kendi
[README](https://github.com/nostr-protocol/nostr) dosyası, eşler arası tekniklere dayanmadığını
söyler.

Bu, Nostr'u önemli bir noktada federe veya blok zinciri sistemlerinden çok Bitsocial'a yaklaştırır:
kimlik kriptografik ve taşınabilirdir. Farklar veri katmanında ve kapı bekçiliğini kimin yaptığındadır.

## Nostr nasıl çalışır

- **Olaylar ve röleler.** Her gönderi, profil veya tepki imzalı bir JSON olayıdır. İstemciler olayları
  WebSockets üzerinden rölelere yayımlar ve filtrelerle abone olur; röleler olayları depolar ve geri
  sunar. Röleler birbirleriyle konuşmaz.
- **Çoğaltma.** Kullanıcılar genellikle birkaç röleye yayımlar. 2023'te 712 röle üzerinde yapılan bir
  çalışma, ortalama bir gönderinin bunların 34,6'sında bulunduğunu tespit etti
  ([Wei ve Tyson](https://arxiv.org/abs/2402.05709)).
- **Birinin gönderilerini bulmak.** Kullanıcılar yazdıkları ve okudukları rölelerin bir listesini
  yayımlar ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)) ve istemciler bir
  kullanıcının gönderilerini o kullanıcının yazma rölelerinden alır.
- **Kimlik.** Her kullanıcı, Schnorr imzalarıyla imzalayan bir secp256k1 anahtarıdır. Belirtimler
  anahtar rotasyonu veya kurtarma tanımlamaz; bu yüzden kaybedilen anahtar, kaybedilen hesap demektir.
  İsteğe bağlı `name@domain` tanımlayıcıları
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) o alan adının web sunucusundaki
  bir dosyaya göre doğrulanır.
- **Gruplar.** Önerilen topluluk mekanizması röle tabanlı gruplardır
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): bir röle bir grubu barındırır,
  bir gönderiyi kabul etmeden önce grubun üyelik ve gönderi kurallarını uygular ve grubun meta
  verilerini imzalar. Daha eski moderatör onaylı topluluklar
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) artık NIP-29 lehine
  önerilmeyen olarak işaretlenmiştir.
- **Spam denetimi.** Her röle kendi geçiş koşulunu seçer: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), kimlik doğrulama ve izin
  listeleri ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), ödeme veya hız
  sınırları. İstemciler buna sessize alma listeleri ve güven puanları ekler.
- **Medya.** Görseller ve videolar ayrı HTTP dosya sunucularına yüklenir.

## Nerede ayrışırlar

### Gönderileri kim depolar ve sunar

Nostr'da röleler depolama ve dağıtım katmanıdır: her gönderiyi bir sunucunun çevrimiçi tutması
gerekir. Bitsocial'da HTTP yönlendiricileri yalnızca istemcilerin eş bulmasına yardım eder.
Gönderileri, profilleri, topluluk meta verilerini veya moderasyon durumunu saklamazlar; istemciler
içeriği topluluğun düğümünden ve onu seed eden eşlerden alır. Bkz.
[Eşler Arası Protokol](/peer-to-peer-protocol/).

### Kapı bekçiliğini kim yapar

Nostr'da yazma kapıları röle işletmecilerine aittir. NIP-29 grupları dışında, bir rölenin reddettiği
bir anahtar aynı olayı onu kabul eden herhangi bir röleye yayımlayabilir ve okuyucuların ne gördüğü,
istemcilerinin hangi rölelerden okuduğuna bağlıdır. Bir NIP-29 grubu Bitsocial topluluğuna daha
yakındır: gönderileri grubun barındırıcı rölesi kabul eder veya reddeder. Yine de grup rollerinin
neler yapabileceğini röle belirler ve başka bir röle devralmayı kabul etmedikçe grubun geçmişi o
röleye bağlı kalır.

Bitsocial'da topluluk, kendi anahtar çiftine sahip kriptografik bir nesnedir. Topluluğun düğümü,
sahibinin seçtiği sınama hangisiyse onu çalıştırır ve kabul edilen durumu eşler arası ağa yayımlar.
Bkz. [Özel Spam Önleme Sınamaları](/custom-challenges/).

### Altyapıyı çalıştırmak

Bir röle, alan adı ve WebSocket uç noktası olan bir sunucudur; popüler röleler sundukları içeriğin
depolama ve bant genişliği maliyetini taşır. 2023 çalışması, ücretsiz rölelerin yaklaşık %95'inin
maliyetlerini bağışlarla karşılayamayacağını tahmin etti. Bir Bitsocial topluluk düğümü tüketici
donanımında çalışır ve bir topluluğu okuyan eşler onun paylaşılmasına yardım edebilir.

### Tarayıcı

Bir Nostr web istemcisi doğrudan rölelere WebSocket bağlantıları açar, bu yüzden bir uygulama
sunucusuna gerek yoktur. Bir Bitsocial web uygulaması sekmede eşler arası bir düğüm çalıştırır ve
içeriği eşlerden alır. Bkz. [Tarayıcıda Eşler Arası Ağ](/browser-p2p/).

### Eski içerik

Nostr gönderileri röleler arasında geniş ölçüde çoğaltılır; bu da eski gönderilerin ayakta kalmasına
yardım eder. Bitsocial topluluğun en güncel durumunu tutar ve eski içeriği sonsuza dek garanti etmez.

## Karşılaştırma

| Soru                       | Nostr                                                                                         | Bitsocial                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kategori                   | Röle tabanlı protokol                                                                         | Eşler arası topluluk ağı                                                                     |
| Kimlik                     | secp256k1 kullanıcı anahtarı; belirtimlerde rotasyon yok                                      | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                    |
| Gönderilerin bulunduğu yer | Yazarın seçtiği, çoğu zaman çok sayıda röle                                                   | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                |
| Çevrimiçi tutan            | Röle işletmecileri                                                                            | Topluluk sahibinin düğümü ve yardımcı seeder'lar                                             |
| Topluluklar                | Rölede barındırılan gruplar (NIP-29)                                                          | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                     |
| Spam denetimi              | Her rölenin politikası: proof-of-work, kimlik doğrulama, ödeme, izin listeleri, hız sınırları | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                               |
| Moderasyon                 | Röle politikaları, istemci sessize alma listeleri, etiketler ve şikâyetler                    | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer |
| Adlar                      | HTTPS üzerinden doğrulanan isteğe bağlı `name@domain` tanımlayıcıları                         | Anahtarlara çözümlenen `.bso` ve `.eth` adları                                               |
| Tarayıcı                   | Rölelerin WebSocket istemcisi                                                                 | Sıradan bir tarayıcı sekmesinde çalışan eşler arası düğüm                                    |
| Ana ödünleşim              | Taşınabilir kimlik ve geniş çoğaltma, ama röleye bağımlı erişilebilirlik ve politika          | Röleye daha az bağımlılık, ama eski içerik sonsuza dek garanti değil                         |
