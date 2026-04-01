---
title: EVM Sözleşme Çağrısı Mücadelesi
description: EVM akıllı sözleşmesini çağırarak zincir üzerindeki koşulları doğrulayan anti-spam mücadelesi.
sidebar_position: 4
---

# EVM Sözleşme Çağrısı Mücadelesi

:::warning Legacy Naming
Bu paket ilk olarak `@plebbit` kapsamı altında yayımlandı. `@bitsocial/evm-contract-challenge` olarak yeniden adlandırıldı. Eski isme yapılan atıflar eski belgelerde veya kod tabanlarında görünmeye devam edebilir.
:::

EVM Sözleşme Çağrısı Mücadelesi, bir yayına izin vermeden önce zincir üzerindeki koşulları doğrulayan bir anti-spam mekanizmasıdır. Orijinal olarak `plebbit-js`'dan bağımsız bir paket olarak çıkarılan bu özellik, topluluk sahiplerinin gönderi yayınlamak için yazarların akıllı sözleşmeyle tanımlanmış kriterleri (örneğin, minimum token bakiyesine sahip olmak) karşılamasını talep etmesine olanak tanıyor.

**Kaynak kodu:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Gereksinimler

- **Node.js** >= 22
- **Yalnızca ESM** -- bu paket CommonJS yapılarını göndermez.
- **Çalışma zamanı eş bağımlılığı:** `@plebbit/plebbit-js` (`@pkc/pkc-js`'ya geçiş)

## Kurulum

```bash
npm install @bitsocial/evm-contract-challenge
```

## Yapılandırma Seçenekleri

| Option        | Tür      | Açıklama                                                                                |
| ------------- | -------- | --------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Sorgulanacak zincir (ör. `eth`, `matic`, `avax`).                                       |
| `address`     | `string` | Aranacak akıllı sözleşme adresi.                                                        |
| `abi`         | `string` | Çağrılan işlevin ABI parçası.                                                           |
| `condition`   | `string` | Sözleşme getiri değerine göre değerlendirilen bir karşılaştırma ifadesi (ör. `> 1000`). |
| `error`       | `string` | Koşulu karşılamayan yazarlara gösterilen hata mesajı.                                   |

## Örnek

Gönderileri belirli bir ERC-20 tokeninden 1.000'den fazla tutan yazarlarla sınırlamak isteyen bir topluluk sahibi, bu mücadeleyi şu şekilde yapılandırabilir:

- `chainTicker`: `"eth"`
- `address`: token sözleşme adresi
- `abi`: `balanceOf(address)` için ABI
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Bir yazar yayınlamayı denediğinde, sorgulama yazarın adresiyle `balanceOf`'yu çağırır ve döndürülen değerin koşulu karşılayıp karşılamadığını kontrol eder. Eğer öyleyse yayın devam eder; aksi takdirde yapılandırılmış hata mesajı döndürülür.

## Ne Zaman Kullanılmalı?

EVM Sözleşme Çağrı Yarışması aşağıdakiler için idealdir:

- **Belirteç sahipleriyle gönderimi kısıtlayan **belirteçli topluluklar\*\*.
- Belirli bir NFT'ye sahip olmanın gerekli olduğu **NFT geçitli erişim**.
- Katılımın yönetim tokeni sahipleriyle sınırlı olduğu **DAO yönetişim alanları**.

Zincir içi kimliğe dayanmayan topluluklar için bunun yerine [Spam Engelleyici](./spam-blocker.md) veya [Kupon Yarışması](./voucher-challenge.md) seçeneğini düşünün.
