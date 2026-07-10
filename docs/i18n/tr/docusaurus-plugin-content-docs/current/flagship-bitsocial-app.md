---
title: Twitter/X'i merkeziyetsizleştirmek
description: "Ana planın 3. Aşaması: metin öncelikli kamusal konuşma için odaklı, merkeziyetsiz bir Twitter/X alternatifi; altyapısı değiştirilebilir."
---

# Twitter/X'i merkeziyetsizleştirmek

3. Aşama, Twitter/X'e odaklı ve merkeziyetsiz bir alternatif oluşturma planıdır. Merkezinde metin öncelikli kamusal konuşma vardır: kısa gönderiler, yanıtlar, yeniden paylaşımlar, takipler, gerçek zamanlı tartışmalar ve topluluklar; platform katmanı ise açık hâle getirilir.

Twitter/X hâlâ gönderiler, metin ve fikir paylaşımıyla tanımlanıyor. 3. Aşama istemcisi bu temel deneyimde rekabet etmeli ve onu olağanüstü iyi hâle getirmelidir.

Bu sayfa sabitlenmiş bir sürüm tanımını değil, ürün yönünü açıklar. Kesin arayüz, varsayılan akış, reklam modeli, AI özellikleri ve RPC pazarı; protokol ve ilk uygulamalar olgunlaştıkça değişebilir.

## Neyi kanıtlaması gerektiği

İstemci, profil tabanlı bir sosyal ağın kullanıcı kimlikleri ve profilleri üzerinde kontrol kuran bir platforma dönüşmekten kaçınabileceğini kanıtlamalıdır:

- kullanıcılar kimliklere ve profillere sahip olabilir
- topluluklar ve profil düğümleri eşler arası kalabilir
- topluluklar Bitsocial istemcileri arasında ağ efektleri taşıyabilir
- RPC sağlayıcıları, kullanıcının kimliği veya profili üzerinde kontrol sahibi olmadan uygulamayı kullanışlı hâle getirebilir
- besleme algoritmaları platform yasası yerine isteğe bağlı hizmetler olabilir
- diğer istemciler hala aynı ağ için rekabet edebilir

Amaç, mümkün olan en güçlü kamusal konuşma istemcisini oluşturmak ve protokolün ne kadar genişleyebileceğini göstermektir.

## Amacı tanıdık, tasarımı değiştirilebilir

Varsayılan deneyim Twitter/X'in özüyle rekabet etmelidir: hızlı bir ana akış, metin gönderileri, takipler, yanıtlar, yeniden paylaşım yoluyla dağıtım, topluluklar, bildirimler, arama ve hemen çalışan sıralanmış bir For You görünümü.

Bitsocial Forge, ilk varsayılan RPC'yi ve yayın hizmetini çalıştırabilir. Bu varsayılan, sıralı bir yayın ve reklamlar içerebilir, böylece ana kullanıcılardan tüm yığını kendilerinin oluşturmasını istemek yerine uygulamanın ilk günde tamamlanmış hissetmesi sağlanır.

Fark, varsayılanın bir hapishaneye dönüşmemesidir. Kullanıcı RPC'leri, akışları, örnekleri, sıralama sistemlerini, reklamları ve keşif sağlayıcılarını değiştirebilmeli ya da sıralamayı tamamen kaldırabilmelidir. İstemci, her önemli hizmeti değiştirilebilir tutarken ilk açılışta net varsayılan tercihler sunabilir.

Bu, istemciyi geleneksel bir platformdan daha özelleştirilebilir kılar. Bir kullanıcı reklamlı varsayılan sıralanmış akışı koruyabilir. Bir başkası sıralamasız kronolojik akış kullanabilir. Bir diğeri gizlilik odaklı bir RPC, topluluğun işlettiği keşif hizmeti, ücretli ve reklamsız bir akış veya belirli bir alt kültüre yönelik niş bir algoritma seçebilir.

## İstemciler arası topluluklar

Topluluklar, tek bir uygulama içindeki izole gruplardan çok daha önemli olmalıdır.

X/Twitter'da topluluklar X'in içinde hapsolmuştur. Yararlı olabilirler ancak tek bir platformun, tek hesap sisteminin, tek öneri yığınının ve tek ürün yüzeyinin sınırlarını miras alırlar.

Bir Bitsocial topluluğu farklı istemciler üzerinden oluşturulabilir, barındırılabilir, keşfedilebilir ve kullanılabilir. Böylece 3. Aşama istemcisi yalnızca kendi içinde başlayan kullanıcıların değil, daha geniş Bitsocial ağındaki toplulukları ve gönderileri gösterebilir. Bir toplulukta aynı anda bir imageboard istemcisinden, Reddit tarzı tartışma istemcisinden, niş forum istemcisinden, mobil uygulamadan ve 3. Aşama istemcisinden etkinlik bulunabilir.

Temel ağ etkisi avantajı budur: Bir istemci, birçok istemciden, topluluk düğümünden, RPC sağlayıcısından ve bağımsız hizmetlerden değer alırken, ana kullanıcılara tanıdık gelebilir.

## İsteğe bağlı besleme algoritmaları

3. Aşama istemcisi herkese tek bir küresel sıralama sistemi dayatmamalıdır.

Akış algoritmaları isteğe bağlı olmalı ve yalnızca kullanıcı seçtiğinde etkinleştirilmelidir. Bir kullanıcı bir pazaryerinden bir algoritma seçebilir, sağlayıcıları değiştirebilir, bir şirketteki algoritmayı kullanabilir, anonim bir operatör tarafından çalıştırılan bir algoritmayı kullanabilir, bir topluluk tarafından oluşturulan bir algoritmayı kullanabilir, kişisel bir algoritma çalıştırabilir veya hiçbir algoritma kullanmayabilir.

Kamu RPC sağlayıcıları bu hizmetlerin rekabet edebileceği doğal bir yerdir. İçeriği dizine ekleyebilir, sıralayabilir ve önerebilirler ancak kullanıcının kimliğini veya profilini kontrol etmemelidirler.

Bu hizmetler aynı zamanda uygulamanın şekli konusunda da rekabet edebilir. Bir RPC, reklamların yer aldığı sıralı bir yayın sağlayabilir. Bir diğeri sıralanmamış bir kronolojik bilgi sağlayabilir. Bir diğeri gizlilik, çeviri, denetleme, topluluk keşfi veya niş bir sosyal grafik konusunda uzmanlaşabilir.

Ekonomi işe yararsa, RPC destekli yayın hizmetleri, ana akım platformların yayınlarına koymaya çalıştığına benzer yapay zeka özellikleri ekleyebilir: otomatik çeviriler, özetler, bot destekli yanıtlar, arama yanıtları, denetleme yardımı veya topluluk notu stili bağlamı.

Bu özellikler protokol gereklilikleri değil, hizmet seçimleri olmalıdır. Varsayılan bir RPC, daha zengin bir yayın sunarak rekabet edebilir, ancak kullanıcılar ve rakip istemciler yine de daha basit, özel, kronolojik, reklamsız veya topluluğa özgü alternatifleri seçebilmelidir.

## Kullanıcı kontrolünü devralmayan RPC

Her kullanıcı, RPC sağlayıcısına kendi kimliğinin veya profilinin sahipliğini vermeden, RPC aracılığıyla tam eşler arası düğüm olarak katılabilmelidir.

Barındırılan yol önemlidir çünkü çoğu kullanıcı bir sunucu çalıştırarak başlamayacaktır. Çıkış yolu da aynı derecede önemlidir: Bir kullanıcı, Raspberry Pi de dahil olmak üzere düşük özellikli donanımda, istediği zaman kendi profil düğümüne geçebilmelidir.

Kolaylık ile kontrolü devretmek arasındaki fark budur.

## Bitsocial Chain ile güçlendirilen kamusal konuşma

Bitsocial Chain kalıcı adlandırmayı, ödemeleri, bahşişleri, ödülleri ve diğer finansal olanakları doğrudan kamusal konuşmaya taşıyabilir.

3. Aşama istemcisi gönderilere, metne, fikir paylaşımına ve gerçek zamanlı tartışmalara odaklanmayı sürdürürken diğer Bitsocial istemcileriyle toplulukları ve ağ etkilerini paylaşır.
