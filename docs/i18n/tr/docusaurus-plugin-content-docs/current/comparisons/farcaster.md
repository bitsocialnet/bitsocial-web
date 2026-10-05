---
title: Bitsocial ve Farcaster
description: Zincir üstü hesapları, depolama kirası ve Snapchain doğrulayıcı ağıyla Farcaster'ın Bitsocial'ın eşler arası topluluklarıyla nasıl karşılaştırıldığı.
---

# Bitsocial ve Farcaster

[Farcaster](https://docs.farcaster.xyz/) kimliği bir blok zincirinde, sosyal verileri ise zincir
dışında tutar. Hesaplar, uygulama anahtarları ve depolama ödemeleri, bir Ethereum katman 2 ağı olan
OP Mainnet'teki sözleşmelerde bulunur. Cast adı verilen gönderiler, takipler ve tepkilerle birlikte,
Farcaster'ın önceki Hub ağının yerini 2025'te alan blok zinciri benzeri bir ağ olan
[Snapchain](https://snapchain.farcaster.xyz/) tarafından depolanan imzalı mesajlardır.

## Farcaster nasıl çalışır

- **Hesaplar.** Bir hesap, bir Ethereum adresine ait sayısal bir Farcaster kimliğidir; bu adres bir
  kurtarma adresi de belirleyebilir. Uygulamalar zincir üstünde kaydedilmiş, yetkisi devredilmiş
  uygulama anahtarlarıyla gönderi paylaşır; bir uygulama anahtarı hesabı ele geçiremez.
- **Depolama kirası.** Her hesap depolama birimleri kiralar; birim başına yıllık ücret şu anda 0,20
  dolardır. Temmuz 2025'ten bu yana kiralanan bir birim 100 cast tutar; bunun ötesinde en eski cast'ler
  budanır. Hız sınırları kiralanan depolamayla orantılı olarak artar.
- **Snapchain.** Doğrulayıcılar mesajları Tendermint tarzı uzlaşıyla bloklar hâlinde sıralar ve her
  tam düğüm ağın tüm verilerini tutar.
  [Düğüm kılavuzuna](https://snapchain.farcaster.xyz/getting-started) göre düğümler yaklaşık 16 GB RAM
  ve 2 TB depolama gerektirir.
- **Adlar.** fname adı verilen varsayılan kullanıcı adları ücretsizdir ve Farcaster'ın kendi ad
  sunucusu tarafından verilir; bu sunucu
  [onları iptal edebilir](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames).
  Kullanıcılar bunun yerine Ethereum'da kayıtlı bir `.eth` adı kullanabilir.
- **Kanallar.** Konu kanalları, Farcaster istemcisinin deneysel bir özelliğidir. Bir kanaldaki
  cast'ler protokol verisidir, ama kanal meta verileri, takipleri ve moderasyonu
  [istemcide saklanır](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Okuma.** Uygulamalar verileri kendi çalıştırdıkları bir Snapchain düğümü ya da genellikle Neynar
  olan yönetilen bir sağlayıcı üzerinden okur.

## Nerede ayrışırlar

### Blok zincirleri ve doğrulayıcılar

Farcaster hesaplar ve ödemeler için OP Mainnet'e, tüm sosyal verilerin sıralanması için de blok
zinciri benzeri bir ağ olan Snapchain'e bağlıdır. Snapchain'in doğrulayıcı kümesi izne tabidir. Teknik
incelemesi, dünyaya dağılmış yaklaşık on doğrulayıcıyla sansürün zorlaşacağını söyler; Ekim 2026'da
[doğrulayıcı listesi](https://snapchain.farcaster.xyz/validators) bundan küçüktü ve anahtarların çoğu,
Ocak 2026'da [Farcaster'ı satın alan](https://neynar.com/blog/neynar-is-acquiring-farcaster) Neynar'a
aitti. Bitsocial'ın zinciri, doğrulayıcıları veya uzlaşısı yoktur.

### Gönderi paylaşmak için ödeme yapmak

Her Farcaster hesabı depolama kirası öder ve depolama, ağın bir hesabın geçmişinin ne kadarını
tutacağını sınırlar. Bitsocial'da gönderi paylaşmak protokol düzeyinde hiçbir şeye mal olmaz; her
topluluk bir captcha, ödeme, token veya başka bir şey isteyip istemeyeceğine kendisi karar verir.
Bkz. [Özel Spam Önleme Sınamaları](/custom-challenges/).

### Topluluklar

Farcaster kanalları bir istemci özelliğidir: kanalların meta verilerini istemci saklar ve kanal
moderasyonunu istemci uygular; bu yüzden bir kanalda engellenen bir cast ağda geçerli kalabilir ve
başka uygulamalarda görünebilir. Bitsocial'da topluluklar kendi anahtar çiftine sahip protokol
nesneleridir ve gönderileri topluluğun düğümü kabul eder veya reddeder.

### Altyapıyı çalıştırmak

Bir Farcaster düğümü ağın tamamını tutar; bu yüzden depolaması tüm etkinlikle birlikte büyür.
Farcaster, depolama ihtiyacının en büyük bulut disklerine yaklaşacak şekilde büyüyeceğini öngörür. Bir
Bitsocial topluluk düğümü yalnızca kendi topluluklarını tutar ve tüketici donanımında çalışır.

### Tarayıcı

Bir Farcaster tarayıcı uygulaması, bir düğümün veya sağlayıcının HTTP istemcisidir. Bir Bitsocial web
uygulaması sekmenin içinde eşler arası bir düğüm çalıştırabilir. Bkz.
[Tarayıcıda Eşler Arası Ağ](/browser-p2p/).

## Karşılaştırma

| Soru                       | Farcaster                                                                                | Bitsocial                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kategori                   | Zincir üstü kimlik ve doğrulayıcıların sıraladığı sosyal veriler                         | Eşler arası topluluk ağı                                                                     |
| Kimlik                     | Bir Ethereum adresine ait Farcaster kimliği ve yetkisi devredilmiş uygulama anahtarları  | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                    |
| Gönderilerin bulunduğu yer | Ücretli depolama sınırları içinde, her tam düğümde çoğaltılan Snapchain                  | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                |
| Çevrimiçi tutan            | Snapchain doğrulayıcıları ve düğüm işletmecileri                                         | Topluluk sahibinin düğümü ve yardımcı seeder'lar                                             |
| Topluluklar                | Farcaster istemcisinin yönettiği deneysel kanallar                                       | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                     |
| Spam denetimi              | Depolama kirası ve hız sınırları, ayrıca uygulama düzeyinde spam etiketleri              | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                               |
| Moderasyon                 | İstemcideki kanal yöneticileri, uygulama filtreleri, doğrulayıcı düzeyinde sansür riski  | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer |
| Adlar                      | Farcaster'ın iptal edebildiği ücretsiz fname'ler veya `.eth` adları                      | Anahtarlara çözümlenen `.bso` ve `.eth` adları                                               |
| Tarayıcı                   | Bir düğümün veya sağlayıcının HTTP istemcisi                                             | Sıradan bir tarayıcı sekmesinde çalışan eşler arası düğüm                                    |
| Ana ödünleşim              | Tutarlı tek bir küresel veri kümesi, ama kira, zincirler ve küçük bir doğrulayıcı kümesi | Ücret veya zincir yok, ama küresel veri kümesi yok ve eski içerik sonsuza dek garanti değil  |
