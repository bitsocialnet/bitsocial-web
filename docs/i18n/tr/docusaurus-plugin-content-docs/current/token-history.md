---
title: BSO Token Geçmişi
description: BSO tokeninin 2021'deki Avalanche kökeninden bugünkü değiştirilemez ve yöneticisiz Ethereum sözleşmesine uzanan eksiksiz nesil geçmişi.
---

# BSO Token Geçmişi

BSO bir köken (provenance) coin'idir. Bitsocial'ın arkasındaki protokol açıktır; token ve zincir ise
tasarım gereği isteğe bağlıdır: herkes kodu çatallayabilir, kendi istemcisini çalıştırabilir ya da
bunun üzerine kendi ekonomisini kurabilir. Çatallanarak elinizden alınamayacak olan şey kökendir. BSO
ilk günden bu yana resmî Bitsocial tokenidir ve o günden sonraki her geçiş zincir üzerinde
doğrulanabilir.

Bu sayfa, tokenin her neslini sırayla ve tam sözleşme adresleriyle birlikte listeler; böylece herkes
kaydı bağımsız olarak inceleyebilir.

## 1. Nesil: köken, Avalanche, 2021

- **Zincir**: Avalanche
- **Yıl**: 2021
- **Adres**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Gezgin**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

BSO burada başladı. Arz, üç airdrop ve likidite madenciliği ödülleriyle dağıtıldı; ön satış yapılmadı ve
topluluğun önüne geçen bir ekip payı ayrılmadı. Sözleşme, o dönemin standart uygulaması olan yükseltilebilir bir proxy'ydi
ve ekibin tokenin ilk döneminde düzeltmeler yayınlamasına imkân tanıdı.

## 2. Nesil: Ethereum'a geçiş, 2024

- **Zincir**: Ethereum
- **Yıl**: 2024
- **Adres**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Gezgin**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

İkinci nesil, BSO'yu Avalanche'tan, Bitsocial Chain yol haritasının geri kalanının üzerine kurulduğu
Ethereum'a taşıdı. Birinci nesil gibi bu sözleşme de hâlâ yükseltilebilir bir proxy'ydi; nihai ve
kalıcı sözleşme hazırlanırken bir nesil daha bu şekilde korundu.

## 3. Nesil: tamamen değiştirilemez, 2025

- **Zincir**: Ethereum
- **Yıl**: 2025
- **Adres**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Gezgin**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Üçüncü nesil, güncel ve nihai BSO sözleşmesidir. Tamamen değiştirilemez ve yöneticisizdir:

- mint fonksiyonu yok, dolayısıyla arz şişirilemez
- sahip adresi yok, dolayısıyla kimse sözleşme davranışını tek taraflı değiştiremez
- duraklatma fonksiyonu yok, dolayısıyla transferler dondurulamaz
- proxy deseni yok, dolayısıyla mantığın kendisi sonradan değiştirilemez

İlk iki neslin yöneldiği son durum budur: elde tutulacak hiçbir yönetici anahtarı kalmamış bir token.

## Geçişler nasıl işledi

Birinci nesilden ikinci nesle ve ikinci nesilden üçüncü nesle yapılan geçişlerin ikisi de pasif 1:1
airdrop'tu. Sahiplerin talep göndermesi, mesaj imzalaması ya da herhangi bir işlem yapması
gerekmedi. Eski sözleşmedeki bakiyeler doğrudan okundu ve yeni sözleşmeye 1:1 yansıtıldı; böylece
her sahibin pozisyonu geçiş boyunca birebir korundu.

Hem eski hem de yeni sözleşmeler herkese açık ve zincir üzerinde kaldığı için bu sürecin her adımı
bağımsız olarak doğrulanabilir. Herkes, birinci veya ikinci nesle ait geçmiş sahip anlık
görüntülerini güncel üçüncü nesil bakiyeleriyle karşılaştırabilir ve geçişin iddia edileni yaptığını
teyit edebilir. Bu geçmişin hiçbir parçası Bitsocial'ın sözüne güvenmeyi gerektirmez.

## Her şeyi doğrulayın

Bunların hiçbirini olduğu gibi kabul etmeyin. Kaydı doğrudan kontrol edin:

- [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9) üzerinde 1. Nesil
- [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f) üzerinde 2. Nesil
- [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A) üzerinde 3. Nesil
- güncel zincir sitesi: [chain.bitsocial.net](https://chain.bitsocial.net)

Bir adres burada listelenenlerle eşleşmiyorsa, o resmî BSO tokeni değildir.
