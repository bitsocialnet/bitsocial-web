---
title: Kendi Bitsocial istemcinizi geliştirin
description: Imageboard'lardan forumlara ve niş sosyal uygulamalara kadar bağımsız Bitsocial istemcileri yayınlamak isteyen geliştiriciler için rehber.
---

# Kendi Bitsocial istemcinizi geliştirin

Bitsocial, her kullanım senaryosu için tek bir resmî uygulama sunarak kazanmaz. Birçok istemcinin aynı
protokolü paylaşırken arayüz, kültür, keşif, varsayılanlar ve iş modeli üzerinden rekabet
edebilmesiyle kazanır.

5chan ve Seedit erken dönem kanıtlarıdır, bir tavan değil. Bir geliştirici; yeni bir imageboard, bir
forum, bir profil istemcisi, mobil öncelikli bir sosyal uygulama, niş bir topluluk aracı ya da arka
planda Bitsocial kullanan merkezi bir istemci yayınlamak için hiçbir platform sahibinden izin almak
zorunda kalmamalıdır.

## Geliştiricilerin değiştirebileceği şeyler

Bir Bitsocial istemcisi, ağın tamamını çatallamadan ürün kararları üzerinden rekabet edebilir:

- arayüz ve görsel dil
- katılım akışı
- topluluk varsayılanları
- moderasyon yüzeyleri
- keşif modeli
- medya deneyimi
- mobil, masaüstü veya düşük bant genişliği kısıtları
- para kazanma ve iş modeli

Ortak katman protokoldür. Ürün katmanı rekabete açıktır.

## Öğrenmenin en hızlı yolu

Halihazırda var olan uygulamalarla başlayın:

- Anonim imageboard toplulukları için [5chan](https://5chan.app) uygulamasını deneyin.
- Reddit tarzı tartışma için [Seedit](https://seedit.app) uygulamasını deneyin.
- İstemci tarafı entegrasyon için [Bitsocial React hooks](https://hooks.bitsocial.net/docs/quickstart/) belgelerini okuyun.
- Düğüm ve topluluk işlemleri için [Bitsocial CLI](/developer-tools/cli/) belgelerini okuyun.

Hızlı ilerlemek istiyorsanız önce mevcut bir uygulamaya katkıda bulunun. İstediğiniz arayüz, kültür
veya topluluk modeli oraya uymuyorsa ayrı bir istemci geliştirin.

## Dar kapsamlı bir ilk sürüm seçin

En iyi ilk sürüm, evrensel bir sosyal uygulama değildir. Net bir hedef kitlesi ve var olmak için
güçlü tek bir gerekçesi olan bir istemcidir.

İyi başlangıç noktaları şunlardır:

- belirli bir kültüre yönelik daha derli toplu bir imageboard istemcisi
- mobil öncelikli bir forum istemcisi
- katı varsayılanlara sahip, tek topluluğa odaklı bir uygulama
- bir içerik üreticisi topluluğu istemcisi
- yalnızca okumaya yönelik bir keşif istemcisi
- bir moderasyon veya operatör konsolu
- belirli bir dile, bölgeye ya da cihaz sınıfına göre optimize edilmiş bir istemci

Küçük istemciler değerlidir, çünkü Bitsocial onların kullanıcılarını özel bir veritabanına hapsetmek
yerine aynı ağın içinde büyümelerine olanak tanır.

## Uygulama yolları

Pratikte üç yol vardır:

1. Fikriniz 5chan veya Seedit'e yakınsa mevcut bir istemciyi çatallayın.
2. [Bitsocial React hooks](https://hooks.bitsocial.net/) ile yeni bir React istemcisi geliştirin.
3. Düğüm API'lerinin ve genel RPC altyapısının üzerine kendi entegrasyonunuzu kurun.

Genel RPC, üçüncü yolu çok daha uygulanabilir hâle getirmeli. Bir kullanıcı, barındırılan ve
emanetsiz bir RPC sağlayıcısıyla başlayıp daha sonra kendi barındırmasına ya da rakip bir sağlayıcıya
geçebilir.

## Tasarım ilkesi

Topluluğunuz için var olması gereken istemciyi geliştirin, sonra uyumlu istemcilerin herkesin
gözü önünde rekabet etmesine izin verin.
