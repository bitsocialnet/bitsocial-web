---
title: Bitsocial ve Mirage
description: Kendi Cosmos SDK blok zinciri üzerinde çalışan Reddit tarzı bir forum olan Mirage'ın Bitsocial ve onun Reddit tarzı uygulaması Seedit ile nasıl karşılaştırıldığı.
---

# Bitsocial ve Mirage

[Mirage](https://mirage.foundation/), toplulukları, ağaç yapılı gönderileri ve oylarıyla Reddit
tarzı bir tartışma ağıdır. Bir şirket veritabanı yerine kendi blok zinciri üzerinde, CometBFT
uzlaşısı kullanan bir Cosmos SDK zincirinde çalışır. Bitsocial'ın en yakın ürünü, Bitsocial ağı
üzerinde çalışan Reddit tarzı bir uygulama olan [Seedit](/apps/seedit/)'tir; bu yüzden karşılaştırma
büyük ölçüde her birinin toplulukları nasıl barındırdığı, sahiplendiği ve modere ettiğiyle ilgilidir.

## Mirage nasıl çalışır

- **Düğümler.** Bir Mirage düğümü; bir doğrulayıcı, bir PostgreSQL veritabanı, bir dizinleyici, bir
  HTTP API ve web ön yüzünü barındıran tek bir Docker konteyneridir. Her düğüm aynı zamanda bir
  doğrulayıcıdır.
  [Kurulum kılavuzuna](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md)
  göre bir düğüm çalıştırmak, amd64 üzerinde bir Ubuntu sunucusu ve operatörün hesabında 10.000.000
  MIRAGE token gerektirir.
- **Gönderi paylaşma.** Tarayıcı her eylemi kullanıcının secp256k1 anahtarıyla imzalar; ücretsiz
  kullanıcılar ayrıca küçük bir proof-of-work hesaplar. Düğüm eylemi bir zincir işlemine sarar ve
  ücreti öder.
- **Okuma.** Her düğümün dizinleyicisi zincir verilerini kendi veritabanına kopyalar ve akışları bir
  HTTP API üzerinden sunar. Düğümler yaklaşık bir haftalık bloğu tutar; bu yüzden uzun vadeli gönderi
  geçmişi her düğümün veritabanında yaşar ve yeni bir düğüm, eşitleme noktasından önceki geçmiş
  olmadan başlar.
- **Hesaplar.** Bir hesap, 12 kelimelik bir kurtarma ifadesinden türetilen bir anahtardır ve aynı
  ifade her düğümde çalışır. Kullanıcı adları zincire kaydedilir ve ağ genelinde benzersizdir.
- **Topluluklar.** Geçerli her ad zaten bir topluluktur ve kimse ona sahip değildir. En fazla on
  kullanıcıdan oluşan ücretli küratör ekiplerinin her biri bir topluluğun moderasyonlu bir görünümünü
  sürdürür; okuyucular bir ekibin görünümünü, düğümün varsayılanını veya sansürsüz bir görünümü seçer.
  Bkz. [Mirage SSS](https://mirage.talk/faq).
- **Token.** MIRAGE token abonelikleri öder, yazarları ve düğümleri ödüllendirir ve doğrulayıcılara
  yönetişim ağırlığı verir. Aboneler proof-of-work'ü atlar ve daha yüksek sınırlar alır.

## Nerede ayrışırlar

### Bir topluluğun sahibi kim

Seedit'te bir topluluğu kuran kişi topluluğun anahtar çiftini tutar, düğümünü çalıştırır veya bu işi
devreder ve topluluğu modere eder. Mirage'da hiç kimse bir topluluğa sahip değildir: rakip küratör
ekipleri aynı adın moderasyonlu görünümlerini sunar ve varsayılan görünüm, en çok ücretli abonenin
seçtiği ekiptir.

### Spam denetimi

Mirage tüm ağa tek bir kural uygular: ücretsiz kullanıcılar, zorluğu gelen hacme göre ayarlanan
proof-of-work ile öder; aboneler bunu atlar. Bitsocial'da her topluluk captcha'lardan izin
listelerine ve ödemelere kadar kendi sınamasını seçer. Bkz.
[Özel Spam Önleme Sınamaları](/custom-challenges/).

### Altyapı

Mirage bir blok zinciri gerektirir. Doğrulayıcılar her eylem üzerinde uzlaşıya varır ve her düğüm tam
bir sunucu yığını çalıştırıp büyük bir token stake'i tutmak zorundadır. Bitsocial'ın zinciri yoktur:
bir topluluk düğümü masaüstü uygulamasından veya `bitsocial-cli` üzerinden tüketici donanımında
çalışır ve okuyucular içeriğin paylaşılmasına yardım edebilir.

### Ağ çapında denetim

Mirage'ın doğrulayıcı stake'iyle ağırlıklandırılmış zincir üstü bir yönetişimi vardır. Bu yönetişim
zorluğu, fiyatları ve token ihracını değiştirebilir, token basabilir veya yakabilir ve silme
kararlarını referans dizinleyicinin herhangi bir gönderiye uyguladığı yöneticiler atayabilir. Zincir
kodu ayrıca yönetişimin
[hesap silmesine](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
ve
[herhangi bir adresten token göndermesine](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656)
izin verir. Ekim 2026'da zincirin bloklarını dört doğrulayıcı üretiyordu ve dördünü de projenin kendi
operasyon kılavuzları yönetiyordu.

Bitsocial'ın protokol düzeyinde bir yöneticisi yoktur. Topluluk sahipleri kendi topluluklarını modere
eder ve uygulamalar neyi göstereceklerini seçer. Bkz.
[Küresel Yasaklamalar Değil, Yerel Denetim](/local-moderation/).

### Tarayıcı

Mirage'ın web istemcisi bir düğümün HTTP istemcisidir: tarayıcı eylemleri imzalar ama eşler arası bir
ağa katılmaz. Bitsocial uygulamaları tarayıcı sekmesinin içinde eşler arası bir düğüm çalıştırabilir.
Bkz. [Tarayıcıda Eşler Arası Ağ](/browser-p2p/).

## Karşılaştırma

| Soru                       | Mirage                                                                                                              | Bitsocial                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Kategori                   | Kendi blok zinciri üzerinde forum (Cosmos SDK)                                                                      | Eşler arası topluluk ağı                                                                      |
| Kimlik                     | 12 kelimelik bir kurtarma ifadesinden türetilen secp256k1 anahtarı ve zincir üstü kullanıcı adı                     | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                     |
| Gönderilerin bulunduğu yer | Zincir işlemleri, ardından her düğümün PostgreSQL veritabanı                                                        | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                 |
| Çevrimiçi tutan            | Her biri 10.000.000 MIRAGE tutan doğrulayıcı düğümler                                                               | Topluluk sahibinin düğümü ve yardımcı seeder'lar                                              |
| Topluluklar                | Rakip ücretli küratör ekiplerine sahip, sahipsiz adlar                                                              | Bir anahtar çiftine ait; gönderileri sahibinin düğümü kabul eder veya reddeder                |
| Spam denetimi              | Ağ çapında proof-of-work; aboneler bunu atlar                                                                       | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                                |
| Moderasyon                 | Küratör ekibi görünümleri, kişisel filtreler, yönetişimin atadığı yöneticiler                                       | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer  |
| Ekonomi                    | Abonelikler, ödüller ve doğrulayıcı stake'i için MIRAGE token                                                       | Protokolde yok; bir sınama ödeme veya token isteyebilir                                       |
| Tarayıcı                   | Bir düğümün HTTP istemcisi                                                                                          | Sıradan bir tarayıcı sekmesinde çalışan eşler arası düğüm                                     |
| Ana ödünleşim              | Paylaşılan tek, sıralı bir durum ve kolay kayıt, ama küçük bir doğrulayıcı kümesi ve ağ çapında yönetişim yetkileri | Zincir veya stake gerekmez, ama küresel sıralama yok ve eski içerik sonsuza dek garanti değil |
