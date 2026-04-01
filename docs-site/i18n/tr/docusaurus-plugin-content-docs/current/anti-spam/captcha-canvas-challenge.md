---
title: Captcha Kanvas Yarışması
description: Yapılandırılabilir karakterlere, boyutlara ve renklere sahip bağımsız görüntü tabanlı captcha oluşturucu.
sidebar_position: 2
---

# Captcha Kanvas Yarışması

:::warning Legacy Naming
Bu paket ilk olarak `@plebbit` kapsamı altında yayımlandı. `@bitsocial/captcha-canvas-challenge` olarak yeniden adlandırıldı. Eski isme yapılan atıflar eski belgelerde veya kod tabanlarında görünmeye devam edebilir.
:::

Captcha Canvas Challenge, orijinal olarak `plebbit-js`'dan çıkarılan bağımsız bir görüntü captcha oluşturucusudur. Rastgele metni bir HTML tuvali üzerine işler ve toplulukların yazarlara spam mücadelesi olarak sunabileceği sonuçtaki görüntüyü döndürür.

**Kaynak kodu:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Gereksinimler

- **Node.js** >= 22
- **Yalnızca ESM** -- bu paket CommonJS yapılarını göndermez.
- **Çalışma zamanı eş bağımlılığı:** `@plebbit/plebbit-js` (`@pkc/pkc-js`'ya geçiş)

## Kurulum

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Yapılandırma Seçenekleri

| Seçenek      | Tür      | Varsayılan | Açıklama                                                        |
| ------------ | -------- | ---------- | --------------------------------------------------------------- |
| `characters` | `number` | `6`        | Captcha görüntüsünde oluşturulan rastgele karakterlerin sayısı. |
| `height`     | `number` | `100`      | Oluşturulan görüntünün piksel cinsinden yüksekliği.             |
| `width`      | `number` | `300`      | Oluşturulan görüntünün piksel cinsinden genişliği.              |
| `colors`     | `string` | `#32cf7e`  | Captcha metni için kullanılan ana renk.                         |

## Nasıl Çalışır?

1. Jeneratör, yapılandırılmış uzunluktaki rastgele bir dizeyi seçer.
2. Dizi, OCR'ye direnmek için görsel gürültü içeren bir tuval üzerine işlenir.
3. Ortaya çıkan görüntü (ve beklenen yanıt), çağıran uygulamanın sorgulamayı sunabilmesi ve daha sonra yanıtı doğrulayabilmesi için döndürülür.

Paket saf bir görüntü oluşturucu olduğundan ağ oluşturma veya oturum yönetimini tek başına gerçekleştirmez. Daha büyük bir sorgulama akışına entegre edilmesi amaçlanmaktadır (örneğin, [Spam Engelleyici](./spam-blocker.md) tarafından desteklenen sorgulama türlerinden biri olarak.
