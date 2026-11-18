---
title: Spam Blocker
description: Risk puanlaması, OAuth doğrulamaları ve yapılandırılabilir kademe eşikleri sunan merkezi spam tespit hizmeti.
sidebar_position: 1
---

# Spam Blocker

Spam Blocker, gelen yayınları değerlendirip onlara risk puanı atayan merkezi bir spam tespit hizmetidir. İki paketten oluşur:

- **`@bitsocial/spam-blocker-server`** -- değerlendirme ve doğrulama API'lerini barındıran HTTP sunucusu.
- **`@bitsocial/spam-blocker-challenge`** -- toplulukların, yayınları değerlendirmeye göndermek için entegre ettiği hafif istemci paketi.

**Kaynak kodu:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Risk Puanlaması Nasıl Çalışır

`/evaluate` uç noktasına gönderilen her yayın sayısal bir risk puanı alır. Puan, birkaç sinyalin ağırlıklı birleşimidir:

| Sinyal         | Açıklama                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Hesap yaşı     | Yeni açılmış hesaplar daha yüksek risk puanı alır.                                                 |
| Karma          | Biriken topluluk karması riski azaltır.                                                            |
| Yazar itibarı  | Arka planda çalışan ağ indeksleyicisinin topladığı itibar verileri.                                |
| İçerik analizi | Metin düzeyindeki sezgisel kurallar (bağlantı yoğunluğu, bilinen spam kalıpları vb.).              |
| Hız            | Aynı yazardan art arda gelen hızlı gönderiler riski artırır.                                       |
| IP istihbaratı | Ülke düzeyinde konum ve tehdit listesi sorguları. Ham IP adresleri topluluklarla asla paylaşılmaz. |

## Kademe Eşikleri

Risk puanı, sonrasında ne olacağını belirleyen dört yapılandırılabilir kademeden birine denk gelir:

1. **Otomatik kabul** -- puan, yayının hiçbir doğrulama istenmeden onaylanacağı kadar düşüktür.
2. **OAuth yeterli** -- yazarın devam edebilmek için bir OAuth doğrulamasını tamamlaması gerekir.
3. **OAuth ve fazlası** -- OAuth tek başına yetmez; ek bir doğrulama (örneğin CAPTCHA) gerekir.
4. **Otomatik ret** -- puan fazla yüksektir; yayın doğrudan reddedilir.

Tüm eşik değerleri her topluluk için ayrı ayrı yapılandırılabilir.

## Doğrulama Akışı

Bir yayın, doğrulama gerektiren bir kademeye düştüğünde doğrulama akışı başlar:

1. Yazardan önce **OAuth** (GitHub, Google, Twitter ve desteklenen diğer sağlayıcılar) ile kimliğini doğrulaması istenir.
2. OAuth tek başına yetersiz kalıyorsa (3. kademe), Cloudflare Turnstile ile çalışan bir **CAPTCHA yedeği** gösterilir.
3. OAuth kimliği yalnızca doğrulama için kullanılır; toplulukla ya da diğer kullanıcılarla **asla paylaşılmaz**.

## API Uç Noktaları

### `POST /evaluate`

Bir yayını risk değerlendirmesine gönderir. Hesaplanan risk puanını ve gereken doğrulama kademesini döndürür.

### `POST /challenge/verify`

Tamamlanmış bir doğrulamanın sonucunu (OAuth jetonu, CAPTCHA çözümü ya da her ikisi) denetlenmek üzere gönderir.

### `GET /iframe/:sessionId`

Verilen oturuma uygun doğrulama arayüzünü görüntüleyen, gömülebilir bir HTML sayfası döndürür.

## Hız Sınırlama

Hız sınırları, yazarın hesap yaşına ve itibarına göre dinamik olarak uygulanır. Yeni ya da itibarı düşük yazarlar daha katı sınırlarla karşılaşırken, köklü yazarlar daha geniş eşiklerden yararlanır. Böylece spam selleri, güvenilir katılımcılar cezalandırılmadan önlenir.

## Arka Plan Ağ İndeksleyicisi

Sunucu, yazar itibar verilerini oluşturmak ve güncel tutmak için ağı sürekli tarayan bir arka plan indeksleyicisi çalıştırır. Bu veriler doğrudan risk puanlama hattını besler ve sistemin, topluluklar arasında tekrar tekrar iyi niyetle katılan kişileri tanımasını sağlar.

## Gizlilik

Spam Blocker gizlilik gözetilerek tasarlanmıştır:

- OAuth kimlikleri yalnızca doğrulamanın denetlenmesinde kullanılır ve topluluklara **asla açıklanmaz**.
- Hizmet operatörü, kötüye kullanımı tespit etmek için ham IP adreslerini saklar ve sınıflandırma için üçüncü taraf bir IP istihbarat sağlayıcısına gönderir.
- Topluluklar yalnızca ülke kodunu, IP riskini ve bağlantı türü tahminini alır; ham IP'yi asla almaz.

## Veritabanı

Sunucu; itibar verilerinin, oturum durumunun ve yapılandırmanın yerelde kalıcı olarak saklanması için **SQLite** (`better-sqlite3` üzerinden) kullanır.
