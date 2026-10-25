---
title: Seedit
description: Herkesin topluluk oluşturup sahip olabileceği, Bitsocial protokolü üzerine kurulu, sunucusuz, merkezi olmayan Reddit tarzı bir forum.
sidebar_position: 2
---

# Seedit

Seedit, Bitsocial protokolü üzerine kurulu, eski tarz Reddit'e sunucusuz, yöneticisiz ve tamamen merkezi olmayan bir alternatiftir. Kullanıcılara toplulukları üzerinde tam sahiplik sağlar; herkes bir topluluk oluşturabilir ve birden fazla topluluk, `/s/funny` gibi aynı kısa rota için rekabet edebilir.

## İndirilenler

| Platformu | Bağlantı                                                     |
| --------- | ------------------------------------------------------------ |
| Web       | [seedit.app](https://seedit.app)                             |
| Web (ENS) | Cesur tarayıcı veya IPFS Companion aracılığıyla `seedit.eth` |
| Masaüstü  | Mac, Windows ve Linux için kullanılabilir                    |
| Mobil     | Android için mevcut                                          |

## Topluluklar nasıl çalışır?

Seedit, içeriği alt dizinlere benzer topluluklar halinde düzenler. Her topluluk, yaratıcısına aittir ve merkezi yönetim olmadan çalışır. Birden fazla topluluk `/s/funny` gibi aynı [dizin](/directories/) rotası için rekabet edebilir; bu rota mevcut kazananı açar. Abonelikler ve gönderi bağlantıları her zaman tam olarak o topluluğu gösterir.

### Topluluk oluşturma

Yeni bir topluluk oluşturmanın iki yolu vardır:

1. **Masaüstü istemcisi** — Topluluğunuzu kurmak ve yapılandırmak için masaüstü uygulamasındaki yerleşik GUI'yi kullanın.
2. **bitsocial-cli** — Komut satırından topluluklar oluşturmak ve yönetmek için CLI aracını çalıştırın.

### Varsayılan topluluk listesi

Yeni hesaplar, [bitsocialnet/lists](https://github.com/bitsocialnet/lists) deposundaki `seedit-default-subscriptions.json` dosyasında tanımlanan ve belirli topluluklardan oluşan varsayılan bir listeye abone olur. Dizin adayları aynı depodaki `seedit-directories/seedit-<code>-directory.json` dosyalarında listelenir. Topluluğunuzu bu listelerden birine eklemek için topluluğunuzun ayrıntılarını içeren bir çekme isteği gönderin.

## Bağlantılar

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telgraf**: [t.me/seeditreact](https://t.me/seeditreact)
- **Lisans**: Yalnızca GPL-2.0
