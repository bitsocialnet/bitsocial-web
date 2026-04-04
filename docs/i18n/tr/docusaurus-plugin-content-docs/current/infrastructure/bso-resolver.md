---
title: BSO Resolver
description: Yerleşik önbelleğe alma ve platformlar arası destek ile ENS TXT kayıtlarını kullanarak .bso alan adlarını genel anahtarlara çözümleyin.
sidebar_position: 1
---

# BSO Resolver

BSO Çözümleyicisi, ENS'de depolanan Bitsocial TXT kayıtlarını okuyarak `.bso` alan adlarını ilgili genel anahtarlara çevirir. Paylaşılan bir viem istemcisi, kalıcı önbellekleme sağlar ve hem Node.js hem de tarayıcı ortamlarında çalışır.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Lisans**: Yalnızca GPL-2.0

## Kurulum

```bash
npm install @bitsocial/bso-resolver
```

## Çözümleyici Oluşturma

Yapıcıya bir yapılandırma nesnesi ileterek çözümleyiciyi başlatın:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parametre  | Gerekli | Açıklama                                           |
| ---------- | ------- | -------------------------------------------------- |
| `key`      | Evet    | Çözümleyici örneğinin tanımlayıcısı.               |
| `provider` | Evet    | Taşıma yapılandırması (aşağıya bakın).             |
| `dataPath` | No      | SQLite önbellek dosyası dizini (yalnızca Node.js). |

### Sağlayıcı Seçenekleri

`provider` parametresi üç biçimi kabul eder:

- **`"viem"`** -- Viem tarafından sağlanan varsayılan toplu taşımayı kullanır.
- **HTTP(S) URL'si** -- Bir JSON-RPC uç noktası (ör. `https://mainnet.infura.io/v3/YOUR_KEY`) aracılığıyla bağlanır.
- **WebSocket URL** -- Bir WebSocket RPC uç noktası (ör. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`) aracılığıyla bağlanır.

## Yöntemler

### `resolve({ name, abortSignal? })`

Bir `.bso` adını arar ve ilişkili genel anahtarı döndürür. Uzun süredir devam eden istekleri iptal etmek için isteğe bağlı bir `AbortSignal` iletilebilir.

### `canResolve({ name })`

Çözümleyicinin verilen adı işleyip işleyemediğini gösteren bir boole değeri döndürür. Tam çözümlemeyi denemeden önce desteği kontrol etmek için bunu kullanın.

### `destroy()`

Çözümleyiciyi yıkar, veritabanı bağlantılarını kapatır ve kaynakları serbest bırakır. Çözümleyiciye artık ihtiyaç duyulmadığında bunu arayın.

## Önbelleğe alma

Gereksiz ağ aramalarını azaltmak için çözümlenen adlar otomatik olarak önbelleğe alınır. Önbelleğe alma arka ucu, çalışma zamanı ortamına göre seçilir:

| Çevre      | Arka uç          | Notlar                                                              |
| ---------- | ---------------- | ------------------------------------------------------------------- |
| Node.js    | SQLite           | `dataPath`'da depolanır. Eşzamanlı erişim için WAL modunu kullanır. |
| Tarayıcı   | İndekslenmişDB   | Yerel IndexedDB işlemlerini kullanır.                               |
| Geri dönüş | Bellek içi `Map` | SQLite veya IndexedDB mevcut olmadığında kullanılır.                |

Tüm önbellek girişlerinin **bir saatlik TTL**'si vardır ve süre dolduktan sonra otomatik olarak çıkarılır.

## pkc-js ile entegrasyon

Çözümleyici, `nameResolvers` seçeneği aracılığıyla doğrudan pkc-js'ye takılabilir ve anahtar aramalar sırasında şeffaf `.bso` ad çözümlemesini etkinleştirir:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Eşzamanlılık

Çözümleyici eşzamanlı kullanımda güvenli olacak şekilde tasarlanmıştır:

- Tek bir paylaşılan viem istemcisi, gereksiz bağlantılardan kaçınır.
- SQLite, WAL (Ön Yazma Günlüğü) modunda çalışır ve engelleme olmadan eşzamanlı okumalara izin verir.
- Tarayıcı önbelleğe alma, izolasyon için yerel IndexedDB işlemlerine dayanır.

## Platform Giriş Noktaları

Paket, Node.js ve tarayıcı yapıları için ayrı giriş noktaları sunar. `package.json`'daki `exports` alanını destekleyen paketleyiciler otomatik olarak doğru olanı seçecektir.
