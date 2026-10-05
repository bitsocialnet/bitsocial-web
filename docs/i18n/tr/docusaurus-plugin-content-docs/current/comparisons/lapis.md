---
title: Bitsocial ve Lapis Net
description: Görüntüleyiciye özgü güven puanları ve Bitcoin destekli görünürlük sunan, Kotlin ile yazılmış eşler arası sosyal protokol Lapis Net'in Bitsocial ile nasıl karşılaştırıldığı.
---

# Bitsocial ve Lapis Net

[Lapis Net](https://net.lapisproject.dev/), JVM için Kotlin ile yazılmış eşler arası bir sosyal ağ
protokolüdür. Bitsocial'ınkine yakın temellere bağımsız olarak ulaşmıştır: anahtar çifti tabanlı
kimlikler, IPFS tarzı içerik depolama ve libp2p gossipsub. İkisi, spam filtrelemeyi ve küratörlüğü
nereye koydukları konusunda ayrışır. Lapis her görüntüleyiciye kişisel bir güven grafı verir ve
Bitcoin ile Lightning ödemelerinin görünürlüğü artırmasına izin verir; Bitsocial ise neyin
yayımlanabileceğine her topluluğun karar vermesine izin verir.

Lapis çalışan bir prototiptir. [Deposuna](https://github.com/lapisproject-dev/Lapis-Net) göre Ekim
2026'da henüz herkese açık bir ağı yoktu ve iki düğümü birbirine bağlamak elle yapılan bir adımdı.

## Lapis nasıl çalışır

- **Kimlikler.** Her kimlik, Bitcoin anahtarlarıyla uyumlu bir secp256k1 anahtar çiftidir ve libp2p
  eş kimliği için ona bağlanmış bir Ed25519 anahtarı vardır.
- **Depolama ve yayılım.** İçerik, libp2p üzerinde çalışan bir IPFS uygulaması (DHT ve Bitswap) olan
  Nabu ile depolanır ve libp2p gossipsub ile yayılır.
- **Puanlama.** Küratörlük konusunda tarafsız kalan bir çekirdeğin üzerinde dört isteğe bağlı puan
  bulunur:
  - Veritas, her görüntüleyicinin kendi güven grafından hesaplanan bir güven ağı
  - Virtus, zamanla değeri azalan zincir üstü veya Lightning ödeme kanıtlarıyla desteklenen görünürlük
  - Karma, Veritas ile ağırlıklandırılan ücretsiz beğeniler
  - Madli, düğümlerin birbirlerinin davranışı hakkında tuttuğu bir itibar puanı
- **Mesajlaşma.** Uçtan uca şifreli doğrudan mesajlar, bire bir sesli aramalar ve e-postaya benzer
  eşzamansız bir mesaj sistemi projenin parçasıdır.
- **İstemciler.** Her kullanıcı bir JVM düğümü çalıştırır. Referans istemci, bu yerel düğümün sunduğu
  bir web arayüzüdür.

## Nerede ayrışırlar

### Spamı kim filtreler

Lapis görüntüleyici düzeyinde filtreler. İçerik yayılır, ardından neyin öne çıkacağına her
görüntüleyicinin güven grafı ve kullandığı uygulamanın ödeme kuralları karar verir. Bitsocial topluluk
düzeyinde filtreler: bir gönderinin, topluluk düğümü onu kabul etmeden önce topluluğun sınamasını
geçmesi gerekir; böylece reddedilen spam asla topluluğun parçası hâline gelmez. Bkz.
[Özel Spam Önleme Sınamaları](/custom-challenges/).

### Güç kimde

Lapis'te her görüntüleyici kime güveneceğine karar verir ve ücretli görünürlüğün her uygulamada nasıl
işleyeceğine o uygulamanın operatörü karar verir. Bitsocial'da bir topluluk sahibi yalnızca o
topluluğun kurallarını belirler ve uygulamalar neyi göstereceklerini seçer. İkisinde de protokol
düzeyinde bir yönetici yoktur.

### Ekonomi

Lapis, Bitcoin ve Lightning ödeme kanıtlarını görünürlük puanına yerleştirir. Bitsocial'ın protokolde
bir ödeme katmanı yoktur; bir topluluk, sınaması aracılığıyla ödeme veya token isteyebilir.

### Tarayıcı

Bitsocial uygulamaları sıradan bir tarayıcı sekmesinin içinde eşler arası bir düğüm çalıştırabilir.
Bkz. [Tarayıcıda Eşler Arası Ağ](/browser-p2p/). Lapis'in tarayıcı arayüzü, kullanıcının JVM düğümünün
sunduğu yerel bir sayfadır.

### Kapsam

Lapis doğrudan mesajları, sesli aramaları ve postayı bir arada sunar. Bitsocial herkese açık
topluluklara odaklanır ve henüz yerleşik doğrudan mesajlaşması yoktur.

## Karşılaştırma

| Soru                       | Lapis Net                                                                                       | Bitsocial                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kategori                   | Eşler arası sosyal protokol (prototip)                                                          | Eşler arası topluluk ağı                                                                     |
| Kimlik                     | Bağlı bir Ed25519 eş kimliğine sahip secp256k1 anahtar çifti                                    | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                    |
| Gönderilerin bulunduğu yer | Katılımcı düğümlerde Nabu (libp2p üzerinde IPFS) depolaması                                     | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                |
| Topluluklar                | Topluluk nesnesi yok; küratörlük görüntüleyici ve uygulama başına yapılır                       | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                     |
| Spam denetimi              | Görüntüleyici güven grafı, ücretli görünürlük, ilk mesajlar için Lightning depozitoları         | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                               |
| Moderasyon                 | Her görüntüleyicinin güven grafı; uygulama operatörleri ücretli görünürlük kurallarını belirler | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer |
| Ekonomi                    | Puanlamada Bitcoin ve Lightning ödeme kanıtları                                                 | Protokolde yok; bir sınama ödeme veya token isteyebilir                                      |
| Tarayıcı                   | Bir JVM düğümünün sunduğu yerel web arayüzü                                                     | Sıradan bir tarayıcı sekmesinde çalışan eşler arası düğüm                                    |
| Ağ                         | Herkese açık ağı olmayan prototip                                                               | [5chan](/apps/5chan/) ve [Seedit](/apps/seedit/) gibi uygulamalara sahip canlı ağ            |
| Ana ödünleşim              | Zengin yerleşik itibar ve mesajlaşma, ama henüz herkese açık ağ yok                             | Tarayıcılarda çalışan daha küçük bir çekirdek, ama yerleşik itibar veya DM yok               |

## Birlikte çalışabilirler mi?

Bitsocial sınamaları keyfi kodlardır, bu yüzden Lapis tarzı bir güven puanı da bir sınamaya
dönüşebilir. Yerleşik `whitelist` sınaması, izin verilen adreslerin listelerini URL'lerden zaten
okuyabilir. Bir Veritas grafının güvendiği Bitsocial adreslerini yayımlayan bir hizmet, bu yazarların
bir toplulukta CAPTCHA'yı atlamasını sağlayabilir. Bunun için bir Lapis kimliğini bir Bitsocial
adresine bağlamanın bir yolu gerekir ve bugün buna benzer bir şey yoktur.
