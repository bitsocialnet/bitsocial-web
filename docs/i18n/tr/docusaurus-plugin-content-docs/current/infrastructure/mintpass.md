---
title: Mintpass
description: Bitsocial topluluklarının kullanıcıları doğrulamasına ve sybil saldırılarını azaltmasına yardımcı olan NFT tabanlı kimlik doğrulama sistemi.
sidebar_position: 2
---

# Mintpass

Mintpass is an NFT-based authentication system for Bitsocial communities. Users mint a non-transferable verification NFT after completing a challenge (such as SMS OTP), and communities can check NFT ownership to guard against sybil attacks like fake votes, ban evasion, and spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Lisans**: MİT

## Nasıl Çalışır?

Doğrulama akışının dört adımı vardır:

1. **İstek** -- Kullanıcı, işlemi başlatmak için `mintpass.org/request` adresini ziyaret eder.
2. **Meydan Okuma** -- Kullanıcı, SMS ile tek seferlik şifre doğrulama işlemini tamamlar.
3. **Nane** -- Başarılı doğrulamanın ardından kullanıcının cüzdanına devredilemez bir NFT basılır.
4. **Doğrula** -- Topluluklar, kullanıcının doğrulandığını onaylamak için NFT sahipliğini sorgular.

NFT devredilemediği için doğrulamayı tamamlayan cüzdana bağlı kalır ve kullanıcıların doğrulanmış durumlarını satmalarını veya ticaret yapmalarını engeller.

## Proje Yapısı

Depo üç ana alana ayrılmıştır:

| Dizin        | Amaç                                                 |
| ------------ | ---------------------------------------------------- |
| `contracts/` | Doğrulama NFT'si için sağlamlık akıllı sözleşmeleri. |
| `challenge/` | Bitsocial mücadele sistemi için entegrasyon katmanı. |
| `web/`       | Para basımı akışı için Next.js ve React ön ucu.      |

## Gizlilik ve Veri İşleme

Mintpass minimum veri yaklaşımını benimser:

- **Operasyonel veriler** (OTP kodları, oturum belirteçleri) Redis'te kısa TTL'lerle depolanır ve süreleri otomatik olarak dolar.
- **Mint ilişkisi** (doğrulanmış bir kimlik ile cüzdan arasındaki bağlantı) tek kalıcı kayıttır.

Doğrulama penceresi kapandıktan sonra hiçbir telefon numarası veya kişisel bilgi saklanmaz.

## İsteğe Bağlı Güvenlik Katmanları

Topluluk operatörleri, tehdit modellerine bağlı olarak ek korumaları etkinleştirebilir:

- **IP itibar kontrolleri** -- Gelen istekleri, bilinen kötüye kullanım veritabanlarına göre puanlayın.
- **Telefon risk değerlendirmesi** -- Sorgulama yapmadan önce tek kullanımlık veya VoIP numaralarını işaretleyin.
- **Coğrafi engelleme** -- Doğrulamayı belirli bölgelerle sınırlandırın.
- **IP başına bekleme süreleri** -- Aynı adresten tekrarlanan doğrulama girişimlerinin hız sınırı.

## Teknoloji Yığını

| Katman      | Teknoloji                                           |
| ----------- | --------------------------------------------------- |
| Sözleşmeler | Hardhat ve Foundry ile birlikte kullanılan Solidity |
| Ön Uç       | Sonraki.js + Tepki                                  |
| Ağ          | Taban (Ethereum L2)                                 |

Üsse konuşlandırmak, Ethereum'un güvenlik garantilerini devralırken gas maliyetlerini düşük tutar.

## Yol Haritası

Planlanan iyileştirmeler şunları içerir:

- **Darbeye kadar ödeme seçeneği** -- Toplulukların basım için küçük bir ücret talep etmesine izin vererek ekonomik bir mali engel oluşturur.
- **Ek doğrulama sinyalleri** -- SMS'in ötesinde diğer kimlik sinyallerini de kapsayacak şekilde genişletin.
- **Genişletilmiş yönetici araçları** -- Topluluk operatörleri için daha zengin kontrol panelleri ve kontroller.
