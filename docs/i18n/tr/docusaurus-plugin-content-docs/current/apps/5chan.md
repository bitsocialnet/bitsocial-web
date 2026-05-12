---
title: 5chan
description: Herkesin pano oluşturabileceği ve sahip olabileceği, Bitsocial protokolü üzerine kurulu, sunucusuz, merkezi olmayan bir görüntü panosu.
sidebar_position: 1
---

:::warning[Eski adlandırma]
Bu projenin kod temeli hâlâ Bitsocial'ın yeniden markalanmasından önceki eski "halk" adını kullanıyor. Paket adları, API referansları ve bazı dahili terminoloji gelecekteki bir sürümde güncellenecektir. Burada açıklanan işlevsellik günceldir; yalnızca adlandırma güncel değildir.
:::

# 5chan

5chan, Bitsocial protokolü üzerinde çalışan, sunucusuz, yöneticisiz ve tamamen merkezi olmayan bir görüntü panosudur. Merkezi olmayan sahiplik sunarken tanıdık görüntü panosu dizin yapısını takip ediyor; herkes bir pano oluşturabilir ve birden fazla pano, bir oylama mekanizması aracılığıyla aynı dizin yuvası için rekabet edebilir.

## İndirilenler

| Platformu | Bağlantı                                  |
| --------- | ----------------------------------------- |
| Web       | [5chan.app](https://5chan.app)            |
| Masaüstü  | Mac, Windows ve Linux için kullanılabilir |
| Mobil     | Android için mevcut                       |

## Kurullar nasıl çalışır?

5chan, klasik bir dizin düzenini (örneğin, `/b/`, `/g/`) kullanarak içeriği panolar halinde düzenler. Merkezi bir yöneticinin her panoyu kontrol ettiği geleneksel görüntü panolarından farklı olarak 5chan, herhangi bir kullanıcının kendi panosunu oluşturmasına ve tamamen sahip olmasına olanak tanır. Birden fazla kurul aynı dizin yuvasını hedeflediğinde oylama yoluyla o konum için yarışırlar.

### Bir pano oluşturmak

Yeni bir pano oluşturmak için `bitsocial-cli`'yu eşler arası düğüm olarak çalıştırmanız gerekir. Bu, panonuzun herhangi bir merkezi sunucuya bağlı kalmadan merkezi olmayan bir şekilde barındırılmasını sağlar.

### Dizin atamaları

Dizin yuvası atamaları (hangi panonun hangi yolda göründüğü) şu anda `5chan-directories.json` dosyasına GitHub çekme istekleri aracılığıyla yönetilmektedir. Bu geçici bir süreçtir; gelecekteki sürümler, uygulama içi pano oluşturmayı ve dizin atamalarını otomatik olarak gerçekleştirmek için pubsub tabanlı oylamayı destekleyecektir.

## İç kısımlar

Temel olarak 5chan, ağ etkileşimleri için paylaşılan Bitsocial protokolü istemci katmanını kullanıyor. 5chan.app'teki web uygulaması, Gelişmiş Ayarlar'dan tarayıcı P2P etkinleştirildiğinde tarayıcıda bir Helia düğümü çalıştırabilir, böylece okuyucular merkezi bir IPFS ağ geçidi olmadan eşlerden yükleme yapabilir. Eşler arası protokol notlarındaki tarayıcı P2P bölümüne bakın.

## Bağlantılar

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telgraf**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisans**: Yalnızca GPL-2.0
