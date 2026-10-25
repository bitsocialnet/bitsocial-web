---
title: İçerik Keşfi
description: Bitsocial, akran keşfini uygulama düzeyindeki iyileştirmeden nasıl ayırıyor?
---

# İçerik Keşfi

Bitsocial, protokole tek bir küresel yayın, arama dizini veya sıralama algoritması koymaz. İçerik keşfini iki katmana ayırır:

1. **Ağ araması** şu anda bilinen bir topluluğa hizmet veren eşleri bulur.
2. **Uygulama seçimi** bir ürünün ilk önce hangi toplulukların, panoların, listelerin veya gönderilerin gösterileceğini belirler.

Bu, birçok keşif deneyiminin rekabet edebilmesi için alan bırakırken protokolü küçük tutar.

## Ağ araması

Her topluluğun genel anahtarından türetilmiş sabit bir adresi vardır. Bir istemci bu adresi zaten bildiğinde, kendisini sağlayıcı olarak ilan eden eşleri bulmak için hafif HTTP yönlendiricilerini sorgular.

Yönlendiriciler yalnızca sağlayıcı eş adreslerini döndürür. Gönderileri, meta verileri, kullanıcı listelerini veya insanların okuyabileceği topluluk dizinini saklamazlar. İstemci eş adreslerini aldıktan sonra bu eşlere bağlanır ve en son topluluk meta verilerini ve içerik işaretçilerini getirir, ardından gerçek gönderi verilerini karma yoluyla getirir.

Bu, protokol sorusunun yanıtını verir: "Bu topluluk için en son durumu nereden alabilirim?"

## Uygulama seçimi

Ayrı ürün sorusu şudur: "Kullanıcı ilk olarak hangi toplulukları görmelidir?"

Bitsocial, ağda tek bir yanıt oluşturmak yerine bunu uygulamalara, listelere ve kullanıcılara bırakıyor. Örnekler şunları içerir:

- kullanıcının zaten takip ettiği toplulukları gösteren bir istemci
- Reddit tarzı bir uygulama için seçilmiş bir varsayılan liste
- toplulukların `/g/` veya `/s/funny` gibi bir konu adı için rekabet ettiği dizinler
- Belirli bir uygulama tarafından tutulan dizinleri arayın veya sıralayın
- kullanıcılar tarafından paylaşılan doğrudan bağlantılar

Uygulamalar, bu seçimleri protokol yasasına dönüştürmeden farklı şeyleri indeksleyebilir, sıralayabilir, filtreleyebilir veya vurgulayabilir. Bir uygulamanın keşif yüzeyi kullanışlı değilse başka bir uygulama, aynı temel topluluklar üzerinde farklı bir uygulama oluşturabilir.

## Mevcut uygulamalar

5chan ve Seedit'in ikisi de [dizinleri](./directories.md) kullanır: bunlar, toplulukların uğruna rekabet ettiği `/g/` veya `/s/funny` gibi kısa rotalardır. Adaylar bugün herkese açık bir depoda listeleniyor ve 5chan, kazananları belirlemek için oylama yarışmalarını test ediyor.

Seedit ayrıca yeni hesapları, belirli topluluklardan oluşan varsayılan bir listeye abone eder. Topluluklar yine de bu listelerin dışında oluşturulabilir ve paylaşılabilir.

Her iki durumda da, uygulama düzeyindeki liste kullanıcıların açacak bir şey bulmasına yardımcı olur ve protokol düzeyindeki arama daha sonra seçilen topluluğu eşlere çözer.

## Bu bölünme neden önemli?

Tek bir merkezi olmayan ağın hala iyi bir keşfe ihtiyacı vardır, ancak keşif katmanının değiştirilmesi gerekir. Bitsocial'ın temel protokolü adreslenebilirlik, eş arama, yayınlama ve spam önleme konularına odaklanır. Küratörlük, uygulamaların ağ çapında bir geçiş gerektirmeden dizinler, varsayılan listeler, yayınlar, arama, oylama ve denetleme politikalarıyla denemeler yapabileceği bu katmanın üzerinde bulunur.
