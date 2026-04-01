---
title: Tepki Kancaları
description: Bitsocial protokolünde merkezi olmayan sosyal uygulamalar oluşturmak için React hooks kütüphanesi.
sidebar_position: 1
---

# Tepki Kancaları

:::warning Legacy Naming
Bu paket şu anda yukarı akış çatalından devralınan eski adlandırma kurallarını kullanıyor. Kodda, API'lerde ve yapılandırmada "plebbit"e yapılan atıflar gelecekteki bir sürümde "bitsocial"a taşınacaktır. İşlevsellik etkilenmez.
:::

`bitsocial-react-hooks` paketi, Bitsocial protokolüyle etkileşime geçmek için tanıdık bir React kanca API'si sağlar. Beslemeleri, yorumları ve yazar profillerini getirmeyi, hesapları yönetmeyi, içerik yayınlamayı ve topluluklara abone olmayı yönetir; üstelik bunların tümünü merkezi bir sunucuya güvenmeden gerçekleştirir.

Bu kitaplık, [5 kanal](/apps/5chan/) ve diğer Bitsocial istemci uygulamaları tarafından kullanılan birincil arayüzdür.

:::note
`bitsocial-react-hooks`, yapay zeka destekli geliştirme için tutulan `plebbit/plebbit-react-hooks`'nun geçici bir çatalıdır. Npm'de yayınlanmak yerine doğrudan GitHub'dan tüketilir.
:::

## Kurulum

Paket henüz npm'de olmadığından, onu doğrudan GitHub'dan yükleyin ve belirli bir taahhüt karmasına sabitleyin:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

`<commit-hash>`'yu hedeflemek istediğiniz taahhütle değiştirin.

## API'ye Genel Bakış

Kancalar işlevsel kategoriler halinde düzenlenmiştir. Below is a summary of the most commonly used hooks in each category. İmzaların, parametrelerin ve dönüş türlerinin tamamı için [GitHub'da tam API referansı](https://github.com/bitsocialnet/bitsocial-react-hooks).)'na bakın.

### Hesaplar

Yerel kullanıcı hesaplarını, kimliğini ve ayarlarını yönetin.

- `useAccount(accountName?)` -- etkin (veya adlandırılmış) hesap nesnesini döndürür
- `useAccounts()` -- yerel olarak saklanan tüm hesapları döndürür
- `useAccountComments(options?)` -- etkin hesap tarafından yayınlanan yorumları döndürür

### Yorumlar

Bireysel yorumları ve konuları alın ve bunlarla etkileşimde bulunun.

- `useComment(commentCid?)` -- CID'sine göre tek bir yorumu getirir
- `useComments(commentCids?)` -- birden fazla yorumu toplu olarak getirir
- `useEditedComment(comment?)` -- bir yorumun en son düzenlenmiş sürümünü döndürür

### Topluluklar

Topluluk meta verilerini ve ayarlarını alın.

- `useSubplebbit(subplebbitAddress?)` -- bir topluluğu adrese göre getirir
- `useSubplebbits(subplebbitAddresses?)` -- birden fazla topluluğu getirir
- `useSubplebbitStats(subplebbitAddress?)` -- abone ve gönderi sayılarını döndürür

### Yazarlar

Yazar profillerine ve meta verilere bakın.

- `useAuthor(authorAddress?)` - bir yazar profili getirir
- `useAuthorComments(options?)` - belirli bir yazarın yorumlarını döndürür
- `useResolvedAuthorAddress(authorAddress?)` - insanlar tarafından okunabilen bir adresi (örn. ENS) protokol adresine çözümler

### Yayınlar

İçerik akışlarına abone olun ve sayfalara ayırın.

- `useFeed(options?)` -- bir veya daha fazla topluluktan gelen gönderilerin sayfalandırılmış özet akışını döndürür
- `useBufferedFeeds(feedOptions?)` - daha hızlı oluşturma için birden fazla beslemeyi önceden ara belleğe alır
- `useAuthorFeed(authorAddress?)` - belirli bir yazarın gönderilerinin özet akışını döndürür

### Eylemler

İçeriği yayınlayın ve yazma işlemlerini gerçekleştirin.

- `usePublishComment(options?)` -- yeni bir yorum veya yanıt yayınlayın
- `usePublishVote(options?)` - olumlu veya olumsuz oy verin
- `useSubscribe(options?)` -- bir topluluğa abone olun veya topluluğa aboneliğinizi iptal edin

### Eyaletler ve RPC

Bağlantı durumunu izleyin ve uzak bir Bitsocial arka plan programıyla etkileşime geçin.

- `useClientsStates(options?)` -- IPFS/pubsub istemcilerinin bağlantı durumunu döndürür
- `usePlebbitRpcSettings()` -- geçerli RPC arka plan programı yapılandırmasını döndürür

## Gelişim

Hooks kitaplığı üzerinde yerel olarak çalışmak için:

**Önkoşullar:** Node.js, Corepack etkin, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Test ve derleme komutları için README deposuna bakın.

## Bağlantılar

- **GitHub:** [bitsocialnet/bitsocial-tepki-kancaları](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Lisans:** Yalnızca GPL-2.0
