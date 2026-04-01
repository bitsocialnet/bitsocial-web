---
title: CLI
description: Bitsocial düğümünü çalıştırmak, topluluklar oluşturmak ve protokol işlemlerini yönetmek için komut satırı arayüzü.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Bu paket şu anda yukarı akış bağımlılığından devralınan eski adlandırma kurallarını kullanıyor. Komutlarda, çıktılarda ve konfigürasyonda "plebbit"e yapılan atıflar gelecekteki bir sürümde "bitsocial"a taşınacaktır. İşlevsellik etkilenmez.
:::

`bitsocial-cli`, Bitsocial protokolü arka ucuyla etkileşime geçmek için kullanılan bir komut satırı aracıdır. Terminalden yerel bir P2P arka plan programı çalıştırmanıza, topluluklar oluşturup yapılandırmanıza ve içerik yayınlamanıza olanak tanır.

`plebbit-js` üzerine inşa edilmiştir ve topluluk oluşturma ve düğüm yönetimi için [5 kanal](/apps/5chan/) ve [Tohum düzenle](/apps/seedit/) tarafından kullanılır.

## Kurulum

Windows, macOS ve Linux için önceden oluşturulmuş ikili dosyalar mevcuttur. Platformunuz için en son sürümü GitHub'dan indirin:

**[GitHub sürümlerinden İndirin](https://github.com/bitsocialnet/bitsocial-cli/releases)**

İndirdikten sonra ikili dosyayı yürütülebilir hale getirin (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Daemon'u Çalıştırmak

CLI'nin en yaygın kullanımı Bitsosyal düğümü çalıştırmaktır. Arka plan programı, P2P ağ katmanını başlatır ve istemcilerin bağlanabileceği yerel bir API'yi ortaya çıkarır.

```bash
bitsocial-cli daemon
```

İlk başlatıldığında arka plan programı, düğümünüzü, topluluklarınızı ve ayarlarınızı yönetmek için tarayıcı tabanlı bir grafik arayüz olan **WebUI**'ya bağlantılar çıkarır. Terminal komutları yerine GUI'yi tercih ediyorsanız bu kullanışlıdır.

## Tuş Komutları

| Komut               | Açıklama                                                     |
| ------------------- | ------------------------------------------------------------ |
| `daemon`            | Bitsocial P2P düğümünü başlatın                              |
| `create subplebbit` | Yeni bir topluluk oluşturun                                  |
| `subplebbit edit`   | Topluluk ayarlarını güncelleyin (başlık, açıklama, kurallar) |
| `subplebbit list`   | Bu düğümde barındırılan toplulukları listeleyin              |
| `subplebbit start`  | Belirli bir topluluğa hizmet vermeye başlayın                |
| `subplebbit stop`   | Belirli bir topluluğa hizmet vermeyi durdurma                |

Kullanılabilir seçenekleri ve bayrakları görmek için `--help` ile herhangi bir komutu çalıştırın:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Tipik İş Akışı

Yeni bir topluluğa ev sahipliği yapmak için ortak bir kurulum akışı:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

Topluluk artık Bitsocial ağında yayında ve uyumlu herhangi bir istemciden erişilebilir.

## Bağlantılar

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
