---
title: 5chan
description: Bitsocial protokolü üzerine kurulu, herkesin pano oluşturup sahip olabildiği sunucusuz ve merkeziyetsiz bir imageboard.
sidebar_position: 1
---

# 5chan

5chan, Bitsocial protokolü üzerinde çalışan sunucusuz, yöneticisiz ve tamamen merkeziyetsiz bir imageboard'dur. Alışıldık imageboard dizin yapısını korurken merkeziyetsiz sahipliği devreye sokar: herkes bir pano oluşturabilir ve birden fazla pano, bir oylama mekanizması aracılığıyla aynı dizin yuvası için rekabet edebilir.

## İndirmeler

| Platform | Bağlantı                                  |
| -------- | ----------------------------------------- |
| Web      | [5chan.app](https://5chan.app)            |
| Masaüstü | Mac, Windows ve Linux için kullanılabilir |
| Mobil    | Android için kullanılabilir               |

## Panolar nasıl çalışır

5chan, içeriği klasik bir dizin düzeni kullanarak panolar hâlinde düzenler (örneğin `/b/`, `/g/`). Her panonun merkezi bir yöneticinin denetiminde olduğu geleneksel imageboard'ların aksine 5chan, herhangi bir kullanıcının kendi panosunu oluşturmasına ve ona tümüyle sahip olmasına izin verir. Birden fazla pano aynı dizin yuvasını hedeflediğinde, o konum için rekabet ederler; bkz. [Dizinler](/directories/).

### Pano oluşturma

Yeni bir pano oluşturmak için `bitsocial-cli` aracını eşler arası bir düğüm olarak çalıştırmanız gerekir. Böylece panonuz, herhangi bir merkezi sunucuya bağlı kalmadan merkeziyetsiz biçimde barındırılır.

### Dizin atamaları

Her dizinin aday panoları [bitsocialnet/lists](https://github.com/bitsocialnet/lists) deposundaki bir `5chan-directories/5chan-<code>-directory.json` dosyasında listelenir ve bir pano, bu dosyaya gönderilen bir çekme isteğiyle dizine katılır. 5chan ayrıca [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting) ile her dizin için bir oylama yarışması yürütür: her 5chan Pass sahibinin bir oyu vardır ve listede olmayan bir panoya oy vermek onu aday gösterir. Yarışmalar şu anda Base Sepolia test ağında çalışıyor; burada sonuçlar gösterilir ancak listenin sırasını değiştirmez.

## İç yapı

5chan, ağ etkileşimlerinde arka planda ortak Bitsocial protokol istemci katmanını kullanır.
5chan.app adresindeki web uygulaması varsayılan olarak tarayıcıda bir Helia düğümü çalıştırır; böylece
sıradan bir sekme ağa eş olarak katılır: panoları diğer eşlerden yükler ve pubsub üzerinden yayın
yapar, içerik yolunda merkezi bir IPFS ağ geçidi bulunmaz. Bunun neleri gerektirdiğini ve bir tarayıcı
düğümünün hâlâ neleri yapamadığını görmek için [Tarayıcıda Eşler Arası Ağ](/browser-p2p/) sayfasına
bakın.

## Bağlantılar

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisans**: GPL-2.0-only
