---
title: Gönderiler Nerede Yaşar ve Ne Kadar Kalır
description: Bitsocial gönderilerinin neden imzalandığını ve içeriğe göre adreslendiğini, ancak her düğümde sonsuza kadar saklanmadığını; onları kimin çevrimiçi tuttuğunu ve arşivcilerin eski içeriği nasıl okunabilir tuttuğunu açıklar.
---

# Gönderiler Nerede Yaşar ve Ne Kadar Kalır

Bitsocial her gönderiyi bir blok zincirinde veya şirket veritabanında saklamaz. Her topluluğun kendi
 düğümü gönderilerini tutar, okuyucular ve tohumlayıcılar bunların sunulmasına yardımcı olur; kalıcı
 bir kayıt isteyen herkes de bir tane tutabilir. Gönderileri sonsuza dek tutmak **zorunlu değil,
 isteğe bağlıdır**: protokol, hiçbir katılımcıyı tüm ağın geçmişini saklamaya zorlamaz.

Bu sayfa bunun uygulamada ne anlama geldiğini açıklar; çünkü “sonsuza dek saklanmıyor” ifadesini
“ortadan kayboluyor” ya da “bana güven” diye yanlış anlamak kolaydır.

## Özgünlük ve erişilebilirlik ayrı sorulardır

Bir gönderi hakkında iki farklı soru vardır:

1. **Gerçek mi?** Bu gönderiyi bu yazar mı yazdı ve topluluk kabul etti mi?
2. **Hâlâ çevrimiçi mi?** Bugün biri onu getirebilir mi?

Bitsocial ilk soruyu güvenle değil, kriptografiyle yanıtlar. Her gönderi yazarının anahtar çiftiyle
imzalanır ve bir topluluk onu kabul ettiğinde gönderi, tam baytlarının karması olan bir içerik
 tanımlayıcısı (CID) altında saklanır. Gönderiyi alan herkes imzayı ve karmayı kendisi doğrulayabilir.
 Bir düğüm, yönlendirici, ağ geçidi veya arşiv; denetim başarısız olmadan gönderi metnini değiştiremez
 ya da başkası adına sahte gönderi oluşturamaz.

İkinci soru ise kimin bir kopya tuttuğuyla ilgilidir ve garanti edilmeyen tek kısım budur.

## Gönderileri kim çevrimiçi tutar

- **Topluluğun düğümü.** İşletmecinin düğümü gönderileri kabul eder ve topluluk sakladığı sürece kendi
  veritabanında tutar. Topluluk çalıştığı müddetçe her zaman var olan tek kopya budur. Bkz.
  [Eşler Arası Protokol](/peer-to-peer-protocol/).
- **Okuyucular.** 5chan masaüstü uygulaması gibi uygulamalar, çalıştıkları sırada yükledikleri
  toplulukları tohumlar; böylece popüler topluluklar, popüler torrentler gibi, birçok eş tarafından
  sunulur. Tarayıcı sekmesi açıkken içeriği önbelleğe alıp doğrulayabilir, ancak uzun ömürlü bir
  barındırıcı değildir.
- **Tohumlayıcılar.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder), herkesin
  bir VPS veya yedek bir makineden sürekli açık kapasite sağlamasına olanak verir. Toplulukların en
  yeni sayfalarını ve gönderi güncellemelerini sabitler; bu sayede ev yönlendiricilerinin arkasında
  barındırılan topluluklar tarayıcılardan da yüklenebilir.
- **Arşivciler.** Herkes toplulukları tarayıp gördüğü her şeyi saklayabilir. Arşivler, protokolde özel
  bir rol değil, ağın üzerinde kurulmuş sıradan hizmetlerdir.

## Topluluklar kendi saklama süresini seçer

Bir topluluğun eski gönderileri ne kadar süre tuttuğu, protokol kuralı değil işletmecisinin kararıdır.
Bazı topluluklar yıllarca geçmiş ister. Diğerleri unutmak için tasarlanmıştır: 5chan panoları, iletilerin
panodan düştüğü, arşive taşındığı ve belirlenen bir sürenin ardından (varsayılan olarak 48 saat) pano
 düğümünden silindiği bir imge panosu gibi çalışır. Bir topluluk arşivi tamamen atlayabilir de.

Aynı protokol ikisini de destekler; çünkü saklama, her düğümün ödemesi gereken bir maliyet değil, her
 topluluğun belirlediği bir ilkedir.

## Neden her şey sonsuza dek saklanmasın?

Her düğümün her gönderiyi sonsuza dek tutmasını gerektiren bir ağın bunun bedelini bir şekilde ödemesi
 gerekir:

- **Blok zincirleri**, her tam düğümün tüm geçmişi saklamasını gerektirir; bu yüzden düğüm gereksinimleri
  tüm etkinlikle birlikte büyür ve gönderi paylaşmak genellikle ücretlidir.
- **Ücretli depolama**, Farcaster'ın depolama kirasında olduğu gibi, kullanıcıların geçmişlerini tutmak
  için ödeme yapmasına yol açar ve ödedikleri sınırı aşan en eski gönderileri budar. Bkz.
  [Bitsocial ve Farcaster](/comparisons/farcaster/).
- **Merkezî sunucular** her şeyi tutar, ancak yalnızca bir şirket istediği ve o şirketin kuralları
  geçerli olduğu sürece.

Sosyal medyanın küresel bir deftere ihtiyacı yoktur. A gönderisinin B gönderisinden bir milisaniye önce
 kabul edilmesi önemli değildir ve eski gönderilerin çoğu nadiren okunur. Bitsocial her topluluk
 düğümünün yalnızca kendi topluluklarını tutmasına izin verir; bu da barındırmayı bir dizüstü bilgisayar,
 Raspberry Pi veya küçük bir VPS için yeterince ucuz kılar. Bkz.
 [Neden blok zinciri değil?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Bu seçimin bedeli

Kimse bir gönderinin kopyasını tutmazsa, gönderi erişilemez hâle gelebilir. Gönderinin CID'si hiç
 değişmez, ancak CID yalnızca bir adrestir: içerik, en az bir düğüm onu sunduğu sürece getirilebilir
 kalır. Bir topluluğun düğümü temelli çevrimdışı olur ve hiçbir okuyucu, tohumlayıcı veya arşiv onun
 gönderilerini tutmazsa, bu gönderiler kaybolur.

Bu, küresel bir defteri zorunlu kılmamanın dürüst maliyetidir. Aynı zamanda her büyük platformun zaten
 taşıdığı maliyettir: hesaplar, sunucular veya şirketler ortadan kalktığında eski gönderiler de onlardan
 kaybolur. Fark şudur ki Bitsocial'da bir şeyi saklamak kimsenin iznini gerektirmez.

## Önemli olanı saklamak

- **Topluluk düğümünü kendiniz çalıştırın.** Düğümü çalışır durumda tutan topluluk işletmecisi,
  topluluğun ayarları izin verdiği sürece topluluğun geçmişini de tutar.
- **Tohumlayın.** Bir masaüstü uygulamasını açık bırakmak veya `bitsocial-seeder` çalıştırmak,
  toplulukları başkaları için erişilebilir tutar.
- **Arşivleyin.** Bağımsız arşivler, bir topluluk eski iletileri bıraktıktan sonra da bunların okunabilir
  ve aranabilir kalmasını sağlar. [5archive.org](https://5archive.org) 5chan panolarını,
  [seeditarchive.org](https://seeditarchive.org) ise Seedit topluluklarını arşivler. İkisi de açık
  kaynaklıdır; dolayısıyla herkes bir yansı veya rakip bir arşiv çalıştırabilir.

Arşivlenmiş her gönderi hâlâ imzalı olduğundan, bir arşiv birinin söylediğini gizlice yeniden yazamaz:
 okuyucu, arşivlenmiş bir gönderinin imzasını canlı bir gönderide yaptığı gibi doğrulayabilir.
