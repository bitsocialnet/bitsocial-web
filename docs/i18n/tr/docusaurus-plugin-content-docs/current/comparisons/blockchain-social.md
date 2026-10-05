---
title: Bitsocial ve Blok Zinciri Tabanlı Sosyal Ağlar
description: Lens, DeSo ve Steem'in sosyal verileri veya kuralları nasıl bir blok zincirine koyduğu ve Bitsocial'ın neden blok zinciri kullanmadığı.
---

# Bitsocial ve Blok Zinciri Tabanlı Sosyal Ağlar

Lens, DeSo ve Steem sosyal etkinliği bir blok zincirine koyar. Hesaplar, takipler, gönderiler ya da
bunları çevreleyen kurallar, doğrulayıcıların sıraladığı ve depoladığı işlemlere dönüşür. Bitsocial
hiçbir blok zinciri kullanmaz: sosyal medyanın her gönderi için küresel bir sıralamaya ihtiyacı yoktur,
bu yüzden Bitsocial uzlaşıyı, gas'ı ve stake'i atlar. Bu gerekçe için bkz.
[Eşler Arası Protokol](/peer-to-peer-protocol/).

## Ortak noktaları

- **Her yazma işleminin bedelini biri öder.** Lens, uygulamaların sponsor olabileceği gas ücreti alır;
  DeSo her eylemden bir ücret alır; Steem ise eylemleri stake edilmiş token'lara göre paylaştırır.
- **Zincir herkes için tek bir spam politikası belirler.** Ücretler, stake ve hesap maliyetleri her
  topluluğun kendi seçimine bırakılmak yerine ağın tamamında geçerlidir.
- **Zincir üstündeki kayıtlar kalıcıdır.** Uygulamalar içeriği gizleyebilir, ama zincirden
  kaldıramaz.
- **Tarayıcılar API istemcisidir.** Web uygulamaları işlemleri imzalar ve verileri başka birinin
  işlettiği bir düğüm, dizinleyici veya API üzerinden okur.

## Lens

[Lens](https://lens.xyz/), ZKsync'in ZK Stack'iyle kurulmuş ve veri erişilebilirliği için Avail
kullanan bir Ethereum katman 2 ağı olan Lens Chain üzerinde çalışır. Mask Network
[Ocak 2026'dan bu yana Lens'in yürütücülüğünü üstleniyor](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Zincir üstünde:** hesaplar akıllı sözleşmelerdir, kullanıcı adları ad alanları içindeki
  NFT'lerdir; graflar, gruplar, akışlar ve bunların kuralları da sözleşmedir.
- **Zincir dışında:** bir gönderinin metni ve medyası bir URI'deki JSON dosyasında bulunur; bu dosya
  genellikle Lens'in IPFS'in önünde duran depolama hizmeti Grove'dadır. Tepkileri ve yer imlerini Lens
  API tutar ve uygulamalar verileri bu API üzerinden okur.
- **Spam ve kapılar:** işlemler GHO cinsinden gas gerektirir; uygulamalar bunu hız sınırlarıyla
  sponsorlayabilir. Akış ve grup kuralları token sahipliği veya ödeme şart koşabilir.
- **Zincirin işletimi:** [L2BEAT](https://l2beat.com/scaling/projects/lens), Lens Chain'i işlemleri
  dâhil etmeyi reddedebilen merkezî bir operatöre sahip Stage 0 bir validium olarak derecelendirir.

## DeSo

[DeSo](https://docs.deso.org/), sosyal uygulamalar için kurulmuş bir katman 1 blok zinciridir. Temmuz
2024'te proof-of-work'ten proof-of-stake'e geçti.

- **Zincir üstünde:** profiller, gönderiler, beğeniler, takipler ve doğrudan mesajların tümü, her tam
  düğümün depoladığı işlemlerdir. Görseller ve videolar zincir dışında barındırılır; referans düğüm
  Google Cloud Storage ve Cloudflare Stream kullanır.
- **Spam:** her eylem DESO cinsinden bir ücret öder. Yeni kullanıcılar genellikle telefon
  doğrulamasından sonra bir düğümden başlangıç DESO'su alır.
- **Moderasyon:** her düğüm neyi göstereceğine kara listeye veya gri listeye alarak karar verir, ama
  [içerik zincirde kalır](https://docs.deso.org/deso-blockchain/content-moderation).
- **Topluluklar:** belgeler hiçbir topluluk veya forum ilkeli tanımlamaz; bir "topluluk", bir
  uygulamanın derlediği bir akıştır.
- **Düğüm çalıştırmak:** [doğrulayıcı kılavuzuna](https://docs.deso.org/deso-validators/run-a-validator)
  göre doğrulayıcılar en az 32 GB RAM ve 200 GB disk gerektirir.

## Steem

[Steem](https://steem.com/), yazarlara ve küratörlere token ile ödeme yapan bir sosyal blok
zinciridir; ana blog uygulaması [Steemit](https://steemit.com/)'tir. Hive 2020'de Steem'den ayrıldı;
[Hive'ın teknik incelemesine](https://hive.io/whitepaper.pdf) göre bu çatallanma, Steemit Inc.'in
Justin Sun'a satılmasının ardından geldi.

- **Zincir üstünde:** metin gönderileri, yorumlar, oylar ve bunların düzenleme geçmişi; bunları her
  üç saniyede bir blok üreten 21 seçilmiş tanık sıralar. Görseller zincir dışında barındırılır.
- **Spam:** eylemler, stake edilmiş STEEM ile artan Resource Credits tüketir. Hesap oluşturmak STEEM'e
  mal olur; Steemit, e-posta adresini ve telefon numarasını doğrulayan kullanıcılar için bu bedeli
  öder.
- **Topluluklar:** topluluklar, uzlaşının dışında
  [bir dizinleyicinin yorumladığı özel işlemlerdir](https://github.com/steemit/hivemind/blob/master/docs/communities.md).
  Moderatörler gönderileri sessize alabilir; bu, gönderileri uygulamalarda gizler ama zincirde bırakır.
- **Ödüller:** ödülleri enflasyon finanse eder ve nasıl paylaştırılacaklarına stake ağırlıklı oylar
  karar verir; bu yüzden büyük token sahipleri neyin ilgi kazanacağını şekillendirir.

## Karşılaştırma

| Soru            | Lens                                                                               | DeSo                                                                  | Steem                                                                      | Bitsocial                                                                                    |
| --------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Zincir          | Ethereum katman 2 (ZK Stack validium)                                              | Kendi katman 1 zinciri, proof-of-stake                                | Kendi zinciri, delege edilmiş proof-of-stake                               | Yok                                                                                          |
| Gönderi içeriği | Zincir dışı JSON, genellikle Grove'da                                              | Zincir üstünde metin; medya zincir dışında                            | Zincir üstünde metin; görseller zincir dışında                             | Topluluk sahibinin düğümünde ve topluluğu okuyup seed eden eşlerde                           |
| Kimlik          | Akıllı sözleşme hesabı; kullanıcı adı NFT'leri                                     | Zincir üstü profile sahip anahtar çifti                               | Kademeli anahtarlara sahip adlandırılmış zincir hesabı                     | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                    |
| Topluluklar     | Kurallara sahip sözleşmeler olarak gruplar ve akışlar                              | Topluluk ilkeli yok                                                   | Uzlaşı dışında, dizinleyicinin yorumladığı topluluklar                     | Gönderileri kendi düğümü kabul eden veya reddeden birinci sınıf nesneler                     |
| Spam denetimi   | Gas (çoğu zaman sponsorlu), token veya ödeme kuralları                             | Her eylemde ücret; telefon doğrulamasından sonra başlangıç fonu       | Stake'ten gelen Resource Credits; ücretli hesap oluşturma                  | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                               |
| Moderasyon      | Grup yöneticileri, zincir üstü kurallar, API düzeyinde gizleme                     | Her düğüm neyi göstereceğini filtreler                                | Topluluk sessize almaları, stake ağırlıklı eksi oylar, uygulama filtreleri | Topluluk sahipleri kendi topluluklarını modere eder; uygulamalar neyi göstereceklerini seçer |
| Çalıştırma      | Zincir operatörü, ayrıca Lens API ve Grove                                         | En az 32 GB RAM'e sahip doğrulayıcılar                                | Seçilmiş tanıklar, ayrıca API ve dizinleyici düğümleri                     | Tüketici donanımında bir topluluk düğümü, ayrıca yardımcı seeder'lar                         |
| Ana ödünleşim   | Programlanabilir zincir üstü kurallar, ama içerik ve okuma Lens hizmetlerine bağlı | Açık veri havuzu, ama her eylemin bir ücreti var ve sonsuza dek kalır | Yerleşik ödüller, ama görünürlüğü ve yönetişimi stake şekillendirir        | Ücret veya stake yok, ama küresel sıralama yok ve eski içerik sonsuza dek garanti değil      |
