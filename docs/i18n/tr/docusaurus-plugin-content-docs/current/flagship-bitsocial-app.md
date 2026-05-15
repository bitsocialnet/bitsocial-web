---
title: Amiral Gemisi Bitsocial Uygulaması
description: "Önerilen profil tabanlı Bitsocial istemcisi: Varsayılan olarak X/Twitter'a benzer, ancak değiştirilebilir RPC'ler, yayınlar, algoritmalar, reklamlar ve topluluklar içerir."
---

# Amiral Gemisi Bitsocial Uygulaması

Amiral gemisi Bitsocial uygulaması, ağ için önerilen ilk profil tabanlı istemcidir. En basit karşılaştırma şudur: varsayılan olarak X/Twitter gibi tanıdık, ancak platform katmanı kırılmış durumda.

Temel hizmetleri değiştirilebilir tutarken profiller, takipler, yanıtlar, yayınlar, topluluklar, bildirimler ve gerçek zamanlı halka açık konuşmalar ekleyecektir. 5chan, anonim toplulukların çalışabileceğini kanıtlıyor. Seedit kalıcı tartışmaya doğru ilerliyor. Amiral gemisi uygulaması, bir şirketi grafiğin sahibi yapmadan bu ağ etkilerini ana akım sosyal beslemeye taşıyacak.

Bu sayfada kilitli sürüm spesifikasyonu değil, ürün yönü açıklanmaktadır. Protokol ve ilk uygulamalar olgunlaştıkça tam arayüz, varsayılan yayın, reklam modeli, yapay zeka özellikleri ve RPC pazarı değişebilir.

## Neyi kanıtlaması gerektiği

Uygulama, profil tabanlı bir sosyal ağın saklama platformu olmaktan kaçınabileceğini kanıtlamalıdır:

- kullanıcılar kimliklere ve profillere sahip olabilir
- topluluklar ve profil düğümleri eşler arası kalabilir
- topluluklar Bitsocial istemcileri arasında ağ efektleri taşıyabilir
- RPC sağlayıcıları uygulamayı gözetim altına almadan kullanışlı hale getirebilir
- besleme algoritmaları platform yasası yerine isteğe bağlı hizmetler olabilir
- diğer istemciler hala aynı ağ için rekabet edebilir

Önemli olan tek Bitsocial müşterisi olmak değil. Önemli olan, protokolün ne kadar genişleyebileceğini gösteren ilk geniş istemciyi oluşturmaktır.

## Varsayılan olarak tanıdık, tasarım gereği değiştirilebilir

Varsayılan deneyim, ana akım genel konuşma uygulamalarıyla rekabet edebilecek düzeyde olmalıdır: hızlı ana sayfa akışı, takipler, yanıtlar, yeniden yayınlama tarzı dağıtım, topluluklar, bildirimler, arama ve anında çalışan, sıralanmış Sizin İçin görünümü.

Bitsocial Forge, ilk varsayılan RPC'yi ve yayın hizmetini çalıştırabilir. Bu varsayılan, sıralı bir yayın ve reklamlar içerebilir, böylece ana kullanıcılardan tüm yığını kendilerinin oluşturmasını istemek yerine uygulamanın ilk günde tamamlanmış hissetmesi sağlanır.

Aradaki fark, temerrüdün hapishaneye dönüşmemesidir. Kullanıcının RPC'leri, yayınları, örnekleri, sıralama sistemlerini, reklamları ve keşif sağlayıcılarını değiştirebilmesi veya sıralamayı tamamen kaldırabilmesi gerekir. Uygulama, her büyük hizmetin değiştirilebilir olmasını sağlarken, ilk açılışta değerlendirilebilir.

Bu, uygulamayı geleneksel bir platforma göre daha özelleştirilebilir hale getirir. Bir kullanıcı, reklamların yer aldığı varsayılan sıralı feed'i koruyabilir. Bir diğeri sıralaması olmayan kronolojik bir yayın kullanabilir. Bir diğeri gizlilik odaklı bir RPC'yi, topluluk tarafından işletilen bir keşif hizmetini, ücretli, reklamsız bir akışı veya belirli bir alt kültür için oluşturulmuş bir niş algoritmayı seçebilir.

## Müşteriler arası topluluklar

Topluluklar, tek bir uygulama içindeki izole gruplardan çok daha önemli olmalıdır.

X/Twitter'da topluluklar X'in içinde hapsolmuştur. Yararlı olabilirler ancak tek bir platformun, tek hesap sisteminin, tek öneri yığınının ve tek ürün yüzeyinin sınırlarını miras alırlar.

Bir Bitsocial topluluğu farklı istemciler aracılığıyla oluşturulabilir, barındırılabilir, keşfedilebilir ve kullanılabilir. Bu, amiral gemisi uygulamasının yalnızca amiral gemisi uygulamasında başlayan kullanıcılardan değil, daha geniş Bitsocial ağındaki toplulukları ve gönderileri gösterebileceği anlamına geliyor. Bir topluluk, aynı anda bir görüntü panosu istemcisinden, Reddit tarzı bir tartışma istemcisinden, bir niş forum istemcisinden, bir mobil uygulamadan ve amiral gemisi uygulamasından etkinliğe sahip olabilir.

Temel ağ etkisi avantajı budur: Bir istemci, birçok istemciden, topluluk düğümünden, RPC sağlayıcısından ve bağımsız hizmetlerden değer alırken, ana kullanıcılara tanıdık gelebilir.

## İsteğe bağlı besleme algoritmaları

Amiral gemisi uygulaması herkese tek bir küresel sıralama sistemi dayatmamalı.

Feed algoritmaları etkinleştirilmelidir. Bir kullanıcı bir pazaryerinden bir algoritma seçebilir, sağlayıcıları değiştirebilir, bir şirketteki algoritmayı kullanabilir, anonim bir operatör tarafından çalıştırılan bir algoritmayı kullanabilir, bir topluluk tarafından oluşturulan bir algoritmayı kullanabilir, kişisel bir algoritma çalıştırabilir veya hiçbir algoritma kullanmayabilir.

Kamu RPC sağlayıcıları bu hizmetlerin rekabet edebileceği doğal bir yerdir. İçeriği dizine ekleyebilir, sıralayabilir ve önerebilirler ancak kullanıcının veya profilin sahibi olmamalıdırlar.

Bu hizmetler aynı zamanda uygulamanın şekli konusunda da rekabet edebilir. Bir RPC, reklamların yer aldığı sıralı bir yayın sağlayabilir. Bir diğeri sıralanmamış bir kronolojik bilgi sağlayabilir. Bir diğeri gizlilik, çeviri, denetleme, topluluk keşfi veya niş bir sosyal grafik konusunda uzmanlaşabilir.

Ekonomi işe yararsa, RPC destekli yayın hizmetleri, ana akım platformların yayınlarına koymaya çalıştığına benzer yapay zeka özellikleri ekleyebilir: otomatik çeviriler, özetler, bot destekli yanıtlar, arama yanıtları, denetleme yardımı veya topluluk notu stili bağlamı.

Bu özellikler protokol gereklilikleri değil, hizmet seçimleri olmalıdır. Varsayılan bir RPC, daha zengin bir yayın sunarak rekabet edebilir, ancak kullanıcılar ve rakip müşteriler yine de daha basit, özel, kronolojik, reklamsız veya topluluğa özgü alternatifleri seçebilmelidir.

## Gözaltına alınmayan RPC

Her kullanıcı, RPC sağlayıcısına kendi kimliğinin veya profilinin sahipliğini vermeden, RPC aracılığıyla tam eşler arası düğüm olarak katılabilmelidir.

Barındırılan yol önemlidir çünkü çoğu kullanıcı bir sunucu çalıştırarak başlamayacaktır. Çıkış yolu da aynı derecede önemlidir: Bir kullanıcı, Raspberry Pi de dahil olmak üzere düşük özellikli donanımda, istediği zaman kendi profil düğümüne geçebilmelidir.

Kolaylık ve velayet arasındaki fark budur.

## Neden her şeyi kapsayan bir uygulama haline gelebilir?

Bitsocial Network, uygulamalara kalıcı isimlendirme, ödemeler, bahşişler, ödüller ve diğer finansal kolaylıklar sağlarsa, amiral gemisi uygulaması bir yayın istemcisinden çok daha fazlası haline gelebilir.

Önemli kısıtlama, uygulamanın ağın yeni sahibi olmamasıdır. Büyük bir istemci, hatta belki de en popüler istemci olabilir, ancak yine de rakip uygulamalara, rakip RPC'lere, rakip feed algoritmalarına ve kendi kendine barındırılan profil düğümlerine yer bırakır.
