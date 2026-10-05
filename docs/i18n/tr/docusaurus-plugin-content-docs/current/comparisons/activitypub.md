---
title: Bitsocial ve ActivityPub
description: Mikroblog için Mastodon ve Reddit tarzı topluluklar için Lemmy ile Fediverse'ün Bitsocial'ın eşler arası topluluklarıyla nasıl karşılaştırıldığı.
---

# Bitsocial ve ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/), Fediverse'ün arkasındaki W3C standardıdır.
Kullanıcılar hesaplarını barındıran ve örnek adı verilen bir sunucu seçer; sunucular gönderileri
birbirleriyle paylaşır. [Mastodon](https://joinmastodon.org/) Fediverse'ün en bilinen mikroblog
yazılımıdır; [Lemmy](https://join-lemmy.org/) ise konu topluluklarından oluşan Reddit tarzı bir
bağlantı toplayıcı ve forumdur; bu da onu [Seedit](/apps/seedit/) gibi Bitsocial uygulamalarının
Fediverse'teki en yakın karşılığı yapar.

## ActivityPub nasıl çalışır

- **Gelen ve giden kutuları.** Her hesabın bir gelen kutusu ve bir giden kutusu vardır. Sunucular
  etkinlikleri diğer sunuculardaki gelen kutularına teslim eder ve her alıcı sunucu, kendi
  kullanıcılarının takip ettiklerinin kendi kopyasını saklar.
- **Sunucuya ait kimlik.** Hesap ve gönderi kimlikleri, kaynak sunucunun alan adındaki HTTPS
  adresleridir. Bir Mastodon kullanıcı adı `@user@domain` biçimindedir ve WebFinger ile çözümlenir;
  federasyon mesajlarını kullanıcı adına sunucu imzalar.
- **İstemciler.** Uygulamalar ve tarayıcılar yalnızca kullanıcının kendi sunucusuyla, o sunucunun
  API'si üzerinden konuşur.
- **Lemmy toplulukları.** Bir topluluk, tek bir örnekte barındırılan bir grup aktörüdür. Kullanıcılar
  gönderileri topluluğa gönderir, topluluk da bunları takipçilerine yeniden yayınlar; ortak forum
  standardına ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md))
  göre bir topluluk gönderileri önce doğrulayabilir ve bu doğrulama moderatörlerin elle onayına kadar
  gidebilir.
- **Moderasyon.** Moderasyon her sunucuya yereldir. Yöneticiler hesapları askıya alabilir, sunucuları
  tamamen engelleyebilir ya da yalnızca bir izin listesindeki sunucularla federe olabilir; Lemmy'de
  ayrıca her topluluk için moderatörler vardır.
- **Spam denetimi.** ActivityPub hiçbir spam önleme mekanizması tanımlamaz. Mastodon ve Lemmy kayıtları
  onay, davet, başvuru soruları, captcha ve e-posta doğrulamasıyla sınırlar; ardından hız sınırlarına,
  şikâyetlere ve moderasyona güvenir.

## Nerede ayrışırlar

### Kimlik bir alan adına aittir

Bir Fediverse hesabı, sunucusunun alan adına aittir. Mastodon takipçileri yeni bir hesaba
yönlendirebilir, ama [gönderiler taşınmaz](https://docs.joinmastodon.org/user/moving/), taşıma eski
sunucudan başlatılmak zorundadır ve 30 günlük bir bekleme süresi vardır. Bitsocial'da profiller ve
topluluklar anahtar çiftleridir; bu yüzden barındırıcı ya da uygulama değiştirmek kimliği değiştirmez.
Bkz. [Kimlik ve Topluluk Sahipliği](/identity-and-ownership/).

### Bir topluluk nerede yaşar

Bir Lemmy topluluğu yapısal olarak bir Bitsocial topluluğuna yakındır: gönderiler topluluğa gider ve
topluluk bunları yeniden yayınlamadan önce denetleyebilir. Fark, topluluğun nerede yaşadığıdır. Bir
Lemmy topluluğu yalnızca kurucusunun ana örneğinde oluşturulabilir, örnek yöneticisinin topluluk
üzerinde [tam denetimi](https://join-lemmy.org/docs/users/05-censorship-resistance.html) vardır ve
topluluğu başka bir örneğe taşımanın belgelenmiş bir yolu yoktur. Bir Bitsocial topluluğu kendi
anahtar çiftidir: sahibi düğümünü her yerde çalıştırabilir ve üstünde hiçbir sunucu yöneticisi
bulunmaz.

### Spam denetimi

Fediverse sunucuları spamı çoğunlukla kayıt aşamasında durdurur ve sonrasında moderasyon yapar. Bir
Bitsocial topluluğu, kabul etmeden önce her gönderide bir sınama çalıştırır ve her topluluk kendi
sınamasını seçer: captcha, izin listesi, ödeme veya başka herhangi bir kod. Bkz.
[Özel Spam Önleme Sınamaları](/custom-challenges/).

### Altyapıyı çalıştırmak

Bir örnek çalıştırmak, alan adı, TLS ve e-posta ile sürekli açık bir sunucu demektir. Mastodon ayrıca
PostgreSQL, Redis ve arka plan işçileri gerektirir; Lemmy daha hafiftir, kendi verdiği rakama göre
yaklaşık 150 MB RAM kullanır. Her örnek, kullanıcılarının takip ettiği uzak içeriğin kopyalarını
saklar. Bir Bitsocial topluluk düğümü alan adı veya sertifika gerektirmez ve masaüstü uygulamasından
ya da `bitsocial-cli` üzerinden çalışır.

### Sunucuların karşılığında sundukları

Fediverse sunucuları geçmişin tamamını tutar ve güvenilir biçimde sunar; Mastodon'un da yıllar içinde
olgunlaşmış moderasyon araçları vardır. Bitsocial eski içeriği sonsuza dek garanti etmez ve moderasyon
araçları her uygulamanın içinde yer alır.

## Karşılaştırma

| Soru                       | ActivityPub (Mastodon, Lemmy)                                                       | Bitsocial                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kategori                   | Federe sunucular                                                                    | Eşler arası topluluk ağı                                                                     |
| Kimlik                     | Bir sunucunun alan adında, sunucunun imzaladığı hesap                               | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                    |
| Gönderilerin bulunduğu yer | Kaynak sunucu ve onu takip eden her sunucudaki kopyalar                             | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                |
| Çevrimiçi tutan            | Örnek yöneticileri                                                                  | Topluluk sahibinin düğümü ve yardımcı seeder'lar                                             |
| Topluluklar                | Tek bir örnekte barındırılan Lemmy toplulukları                                     | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                     |
| Spam denetimi              | Kayıt kapıları, hız sınırları, şikâyetler ve moderasyon                             | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                               |
| Moderasyon                 | Her sunucuya yerel olan sunucu yöneticileri ve topluluk moderatörleri               | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer |
| Adlar                      | `@user@domain` ve `!community@domain` kullanıcı adları                              | Anahtarlara çözümlenen `.bso` ve `.eth` adları                                               |
| Tarayıcı                   | Kullanıcının kendi sunucusunun istemcisi                                            | Sıradan bir tarayıcı sekmesinde çalışan eşler arası düğüm                                    |
| Ana ödünleşim              | Güvenilir geçmiş ve olgun moderasyon, ama kimlik ve topluluklar bir sunucuya aittir | Sunucu veya alan adı gerekmez, ama eski içerik sonsuza dek garanti değil                     |
