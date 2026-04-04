---
title: Spam Blocker
description: Risk puanlaması, OAuth sorgulamaları ve yapılandırılabilir katman eşikleri ile merkezi spam algılama hizmeti.
sidebar_position: 1
---

# Spam Blocker

:::warning Eski Adlandırma
Bu paket ilk olarak `@plebbit` kapsamı altında yayımlandı. `@bitsocial/spam-blocker-server` ve `@bitsocial/spam-blocker-challenge` olarak yeniden adlandırıldı. Eski adlara yapılan atıflar hâlâ eski belgelerde veya kod tabanlarında görünebilir.
:::

Spam Engelleyici, gelen yayınları değerlendiren ve risk puanları atayan merkezi bir spam algılama hizmetidir. İki paketten oluşur:

- **`@bitsocial/spam-blocker-server`** -- değerlendirme ve sorgulama API'lerini barındıran HTTP sunucusu.
- **`@bitsocial/spam-blocker-challenge`** -- toplulukların yayınları değerlendirmeye göndermek üzere entegre ettiği hafif bir istemci paketi.

**Kaynak kodu:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Risk Puanlaması Nasıl Çalışır?

`/evaluate` uç noktasına gönderilen her yayın sayısal bir risk puanı alır. Skor, çeşitli sinyallerin ağırlıklı bir kombinasyonudur:

| Sinyal         | Açıklama                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hesap yaşı     | Daha yeni hesaplar daha yüksek risk puanları alır.                                                                                               |
| Karma          | Birikmiş topluluk karması riski azaltır.                                                                                                         |
| Yazar itibarı  | Arka plandaki ağ indeksleyici tarafından toplanan itibar verileri.                                                                               |
| İçerik analizi | Metin düzeyinde buluşsal yöntemler (bağlantı yoğunluğu, bilinen spam kalıpları vb.).                                                             |
| Hız            | Aynı yazarın hızlı ve art arda gönderileri riski artırır.                                                                                        |
| IP istihbaratı | Ülke düzeyinde coğrafi konum ve tehdit akışı aramaları. Yalnızca ülke kodları saklanır; ham IP adresleri hiçbir zaman topluluklarla paylaşılmaz. |

## Katman Eşikleri

Risk puanı, daha sonra ne olacağını belirleyen dört yapılandırılabilir katmandan biriyle eşleşir:

1. **Otomatik kabul** -- Puan, yayının herhangi bir zorlukla karşılaşılmadan onaylanmasına yetecek kadar düşüktür.
2. **OAuth yeterli** -- yazarın devam etmek için bir OAuth doğrulamasını tamamlaması gerekir.
3. **OAuth-plus-more** -- OAuth tek başına yeterli değildir; ek doğrulama (ör. CAPTCHA) gereklidir.
4. **Otomatik reddetme** -- puan çok yüksek; yayın doğrudan reddedilir.

Tüm eşik değerleri topluluğa göre yapılandırılabilir.

## Mücadele Akışı

Bir yayın doğrulama gerektiren bir aşamaya düştüğünde sorgulama akışı başlar:

1. Yazardan önce **OAuth** (GitHub, Google, Twitter ve diğer desteklenen sağlayıcılar) aracılığıyla kimlik doğrulaması yapması istenir.
2. Tek başına OAuth yetersizse (3. aşama), Cloudflare Turnstile tarafından desteklenen bir **CAPTCHA geri dönüşü** sunulur.
3. OAuth kimliği yalnızca doğrulama amacıyla kullanılır; toplulukla veya diğer kullanıcılarla **asla paylaşılmaz**.

## API Uç Noktaları

### `POST /evaluate`

Risk değerlendirmesi için bir yayın gönderin. Hesaplanan risk puanını ve gerekli zorluk katmanını döndürür.

### `POST /challenge/verify`

Tamamlanan sorgulamanın sonucunu (OAuth jetonu, CAPTCHA çözümü veya her ikisi) doğrulama için gönderin.

### `GET /iframe/:sessionId`

Belirli bir oturum için uygun sınama kullanıcı arayüzünü oluşturan katıştırılabilir bir HTML sayfası döndürür.

## Hız Sınırlaması

Oran sınırları, yazarın yaşı ve itibarına göre dinamik olarak uygulanır. Daha yeni veya daha az itibara sahip yazarlar daha katı sınırlarla karşı karşıya kalırken, köklü yazarlar daha cömert eşiklerden yararlanır. Bu, güvenilen katılımcıları cezalandırmadan spam taşmasını önler.

## Arka Plan Ağ Dizini Oluşturucu

Sunucu, yazar itibar verilerini oluşturmak ve sürdürmek için ağı sürekli olarak tarayan bir arka plan dizin oluşturucuyu çalıştırır. Bu veriler doğrudan risk puanlama hattını besleyerek sistemin topluluklar genelinde tekrarlanan iyi niyetli katılımcıları tanımasına olanak tanır.

## Mahremiyet

Spam Engelleyici gizlilik göz önünde bulundurularak tasarlanmıştır:

- OAuth kimlikleri yalnızca sorgulamanın doğrulanması için kullanılır ve topluluklara **asla açıklanmaz**.
- IP adresleri **yalnızca ülke kodlarına** çözümlenir; ham IP'ler saklanmaz veya paylaşılmaz.

## Veritabanı

Sunucu, itibar verilerinin, oturum durumunun ve yapılandırmanın yerel kalıcılığı için **SQLite** (`better-sqlite3` aracılığıyla) kullanır.
