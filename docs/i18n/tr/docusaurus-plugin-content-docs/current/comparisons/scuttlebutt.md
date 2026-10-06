---
title: Bitsocial ve Secure Scuttlebutt
description: Secure Scuttlebutt'ın (SSB) ve Manyverse uygulamasının, yalnızca eklemeli akışlardan takip grafına dayalı çoğaltmaya, topluluklardan spam denetimine ve çevrimdışı eşitlemeye kadar Bitsocial ile nasıl karşılaştırıldığı.
---

# Bitsocial ve Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB), Dominic Tarr'ın 2014'te oluşturduğu eşler arası
bir sosyal protokoldür. [Manyverse](https://www.manyver.se/) onun en bilinen uygulamasıdır ve
Android, iOS ile masaüstü için sunulur; [Patchwork](https://github.com/ssbc/patchwork) ise
arşivlenmeden önce başlıca masaüstü istemcisiydi. Bu belgelerde karşılaştırılan sistemler arasında
ruh olarak Bitsocial'a en yakın olanı SSB'dir: veri yolunda sunucu yok, blok zinciri yok, küresel
sıralama yok ve kimlik için Ed25519 anahtarları var. İkisi, her eşin neyi depoladığı ve spamın
nerede durdurulduğu konusunda zıt seçimler yaptı.

## Scuttlebutt nasıl çalışır

- **Akışlar.** Her kimlik, `@<public key>.ed25519` biçiminde yazılan bir Ed25519 anahtar çiftidir.
  Bir kullanıcının yayımladığı her şey kendi akışına girer; akış, her imzalı mesajın bir sıra
  numarası ve önceki mesajın karmasını taşıdığı, yalnızca eklemeli (append-only) bir günlüktür.
  [Protokol kılavuzuna](https://ssbc.github.io/scuttlebutt-protocol-guide/) göre bir mesaj
  gönderildikten sonra değiştirilemez.
- **Çoğaltma.** Eşler tek tek gönderileri değil, akışların tamamını kopyalar ve bir eşin hangi
  akışları tutacağına takip grafı karar verir. Örneğin Patchwork en fazla iki atlama uzaklıktaki
  akışları gösteriyor, en fazla üç atlama uzaklıktaki akışları çoğaltıyordu. Eşler, epidemic
  broadcast trees (EBT) ile her akış için ellerindeki en son sıra numarasını karşılaştırır ve
  yalnızca eksik olanı gönderir.
- **Bağlantılar.** Eşler secret handshake (gizli el sıkışma) ile kimlik doğrular ve trafiği box
  stream ile şifreler. El sıkışma bir ağ tanımlayıcısına bağlıdır; bu yüzden farklı bir
  tanımlayıcıya sahip ayrı bir SSB ağındaki eşler ana ağa bağlanamaz.
- **Eş bulma.** Eşler yerel ağda UDP yayını ile kendilerini duyurur ve LAN üzerinden eşitlenir;
  Manyverse ayrıca Bluetooth üzerinden de eşitlenir. İnternet genelinde kullanıcılar **pubs** ve
  **rooms** adı verilen düğümlere dayanır: pubs, bir davet kodunu kullandıktan sonra sizi geri takip
  eden, ardından akışınızı depolayıp sunan, her zaman çevrimiçi eşlerdir; rooms ise hiçbir akış
  depolamaz ama üyeleri arasındaki bağlantıları tüneller.
- **Blob'lar ve özel mesajlar.** Görseller ve diğer dosyalar, eşlerden alınan içerik adresli
  blob'lardır; mevcut gerçeklemelerde varsayılan boyut sınırı 5 MB'tır. Özel mesajlar en fazla yedi
  alıcı için şifrelenir ve yazarın akışında şifreli metin olarak yayımlanır.

## Nerede ayrışırlar

### Bir eş neyi depolar

Bir SSB eşi, çoğaltma kapsamındaki her akışın, o akışın ilk mesajından başlayarak tam bir kopyasını
tutar ve bu akışları başkalarına sunar. SSB'nin çevrimdışı çalışabilmesini sağlayan budur; ancak
depolama, kapsamdaki her mesajla birlikte büyür ve yeni bir kurulum, ekranda pek bir şey göstermeden
önce bu akışları indirmek zorundadır. Bir Bitsocial istemcisi, açtığı toplulukların en güncel
durumunu topluluğun düğümünden ve onu seed eden eşlerden alır; ağ da yalnızca bu en güncel durumu
tutar. Bkz. [Eşler Arası Protokol](/peer-to-peer-protocol/).

### Silme ve cihazlar

Akış bir karma zinciri olduğundan SSB'de ağ çapında silme yoktur: bir eş mesajları kendi
veritabanından kaldırabilir ama diğer eşlerin kopyalarından geri çekemez. Aynı anahtarla iki
cihazdan ya da geri yüklenmiş bir yedekten gönderi paylaşmak akışı çatallar; bu yüzden olağan çözüm
cihaz başına bir kimliktir. Manyverse ekibinin halef protokolü PZP, SSB'ye göre başlıca
değişiklikleri arasında silmeyi, hesap başına birden fazla cihazı ve çatallanmaya dayanıklı akışları
sayar ([duyuru yazısı](https://www.manyver.se/blog/2024-07-03/)). Bir Bitsocial topluluk düğümü her
güncellemede topluluğun durumunun yeni bir sürümünü yayımlar; böylece topluluğun moderatörlerinin
kaldırdığı içerik en güncel durumdan düşer.

### Kimden haber alabilirsiniz

SSB'nin çoğaltma kapsamı aynı zamanda spam filtresi işlevi görür. Bir yabancının akışı size ancak
atlama mesafenizdeki biri onu takip ediyorsa ulaşır; bir akışı engellemek de düğümünüzün onu
çoğaltmasını durdurur. Spam dışarıda kalır, ama biri onları takip edene kadar yeni gelenler de
dışarıda kalır. Bitsocial herkesin bir topluluğa yayımlamasına izin verir ve bir gönderinin kabul
edilip edilmeyeceğine topluluğun düğümü kendi sınamasıyla karar verir. Bkz.
[Özel Spam Önleme Sınamaları](/custom-challenges/).

### Topluluklar

SSB'de topluluk nesnesi yoktur. Kanallar ve hashtag'ler tek tek gönderiler üzerindeki etiketlerdir;
bir ileti dizisindeki yanıtlar onları yazanların akışlarında durur ve bir ileti dizisinin ne
kadarını gördüğünüz, bu akışlardan hangilerinin düğümünüzde bulunduğuna bağlıdır. Rooms
moderatörlere ve üye listelerine sahip olabilir, ama bunlar neyin yayımlandığını değil, room
üzerinden kimin bağlanabileceğini denetler. Bir Bitsocial topluluğu ise kendi anahtar çifti,
kuralları, moderatörleri ve sınaması olan birinci sınıf bir nesnedir.

### Altyapı

İkisi de sunucuları veri yolunun dışında tutar ve ikisi de yardımcılara dayanır. Pubs, SSB'de
barındırılan bir hizmete en yakın şeydir: takip ettikleri herkesin akışlarını depolar ve sunarlar.
Rooms ise Bitsocial'ın HTTP yönlendiricilerine daha yakındır, çünkü ikisi de içerik depolamaz; ancak
bir room üyeleri arasındaki bağlantıyı aktarırken, bir yönlendirici yalnızca sağlayıcı adreslerini
döndürür ve aktarımda hiçbir rol oynamaz. Bir SSB eşi gibi bir Bitsocial topluluk düğümü de tüketici
donanımında çalışır ve yeni gönderileri kabul edebilmek için çevrimiçi olması gerekir.

### Çevrimdışı ve yerel ağlar

SSB'nin daha güçlü olduğu yer burasıdır. Aynı Wi-Fi ağındaki ya da Manyverse'te Bluetooth üzerinden
bağlanan iki SSB eşi internet bağlantısı olmadan eşitlenebilir ve daha önce çoğaltılmış her şey
çevrimdışıyken de okunabilir kalır. Manyverse'ün belirtilen birincil hedefi, sosyal ağları internet
bağlantısından bağımsız hâle getirmektir. Bitsocial'ın eş bulmak ve yayımlamak için internet
bağlantısına ihtiyacı vardır.

### Tarayıcı

Başlıca SSB uygulamaları tam bir SSB düğümüyle gelir: Manyverse mobil ve masaüstü uygulamalarında
bir düğüm barındırır. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo), SSB'yi kısmi
çoğaltma ve rooms üzerinden bağlantılarla bir tarayıcının içinde çalıştırıyordu ve 2022'de
arşivlendi. Bitsocial uygulamaları sıradan bir tarayıcı sekmesinde eşler arası bir düğüm çalıştırır.
Bkz. [Tarayıcıda Eşler Arası Ağ](/browser-p2p/).

### Özel mesajlar

SSB'de şifreli özel mesajlar yerleşik olarak bulunur. Bitsocial herkese açık topluluklara odaklanır
ve henüz yerleşik doğrudan mesajlaşması yoktur.

## Projenin durumu

Manyverse'ü geliştiren André Staltz, Nisan 2024'te SSB'den, Manyverse'ten ve bunların planlanan
halefinden ayrıldı ([son güncellemesi](https://www.manyver.se/blog/2024-04-05/)). Temmuz 2024'te
Jacob Karlsson bu halefi [PZP](https://pzp.wiki/) adıyla başlattı ve Manyverse üzerinde artık
çalışmayacağını, bunu planlayan başka birini de bilmediğini yazdı. Ekim 2026 itibarıyla
[Codeberg](https://codeberg.org/pzp) üzerindeki PZP depolarında Aralık 2024'ten sonra hiçbir
güncelleme yoktu. Patchwork'ün deposu, son sürümü v3.18.1 olarak arşivlenmiştir; iOS için bir SSB
uygulaması olan Planetary'nin arkasındaki ekip ise 2023'te Nos uygulamasıyla Nostr'a geçti. SSB ağı,
insanların çevrimiçi tuttuğu eşler ve pubs üzerinde hâlâ çalışıyor, ancak başlıca uygulamaları artık
geliştirilmiyor.

## Karşılaştırma

| Soru                       | Secure Scuttlebutt                                                                                       | Bitsocial                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Kategori                   | Eşler arası gossip protokolü                                                                             | Eşler arası topluluk ağı                                                                       |
| Kimlik                     | Cihaz başına bir Ed25519 anahtar çifti                                                                   | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                      |
| Gönderilerin bulunduğu yer | Yazarın yalnızca eklemeli akışı; onu çoğaltan her eş tarafından kopyalanır                               | Topluluk sahibinin düğümü ve topluluğu okuyup seed eden eşler                                  |
| Bir eşin tuttuğu           | Takip kapsamındaki her akışın tüm geçmişi                                                                | Okuduğu veya seed ettiği toplulukların en güncel durumu                                        |
| Topluluklar                | Topluluk nesnesi yok; kanallar ve hashtag'ler gönderileri etiketler                                      | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                       |
| Spam denetimi              | Takip grafına dayalı çoğaltma kapsamı ve engellemeler                                                    | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                                 |
| Moderasyon                 | Her kullanıcının takipleri ve engellemeleri                                                              | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer   |
| Yardımcı sunucular         | Pubs akışları depolar ve sunar; rooms bağlantıları tüneller                                              | HTTP yönlendiricileri sağlayıcı eşleri döndürür ve içerik depolamaz                            |
| Çevrimdışı                 | İnternet olmadan LAN ve Bluetooth üzerinden eşitleme                                                     | İnternet bağlantısı gerektirir                                                                 |
| Tarayıcı                   | Uygulamalar tam bir SSB düğümü barındırır                                                                | Sıradan bir tarayıcı sekmesinde çalışan eşler arası düğüm                                      |
| Ağ                         | Çalışıyor, ama başlıca uygulamaları artık geliştirilmiyor                                                | [5chan](/apps/5chan/) ve [Seedit](/apps/seedit/) gibi uygulamalara sahip canlı ağ              |
| Ana ödünleşim              | Çevrimdışı çalışır ve barındırma gerektirmez, ama akışlar sonsuza dek büyür ve yabancılar görünmez kalır | Açık yayımlama ve tarayıcı desteği, ama internet gerektirir ve yalnızca en güncel durumu tutar |
