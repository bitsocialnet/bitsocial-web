---
title: Dizinler
description: Bitsocial uygulamalarının, bir konu adını ilk sahiplenene bırakmak yerine toplulukların o ad için rekabet etmesine nasıl izin verdiği.
---

# Dizinler

Reddit'te `r/opensource` gibi bir ad yalnızca tek bir topluluğa ait olabilir ve topluluğu kim kontrol ediyorsa ad onda kalır. Moderatörler kullanıcıların beğenmediği kararlar alırsa tek seçenek `r/opensource2` açmaktır. `r/opensource` topluluğuna abone olanların çoğu o moderasyon ekibini değil açık kaynağı önemsemiş olsa da yeni topluluk sıfır aboneyle başlar.

Bitsocial uygulamaları bu sorunu **dizinlerle** önler. Dizin, toplulukların uğruna rekabet ettiği `opensource` gibi bir konu adıdır. Bu adın kısa rotası o anda ilk sırada yer alan topluluğu açar; böylece daha iyi bir topluluk kimseden izin almadan adı devralabilir.

## Nasıl çalışır

1. **Dizin kodu bir konu adıdır.** Seedit `/s/funny` gibi rotalar kullanır. 5chan ise `/g/` gibi imageboard yolları kullanır.
2. **Topluluklar aday olarak yarışır.** Her dizinin, her biri `funny-posting.bso` gibi kendi tam adresine sahip aday topluluklardan oluşan bir listesi vardır.
3. **En üst sıradaki aday rotayı kazanır.** `/s/funny` açıldığında mevcut kazanan gösterilir.
4. **Kaybetmek hiçbir şeyi silmez.** Kazanan olmayan bir topluluk adresini, gönderilerini ve abonelerini korur; herkes onu hâlâ doğrudan açabilir.

## Ad bir ön kapıdır, kimlik değil

Dizin kodu yalnızca bir keşif rotasıdır. Kalıcı olan her şey belirli bir topluluğu işaret eder:

- `/s/funny` üzerinden abone olmak, mevcut kazananın tam adresine abone olmak demektir. Dizin kodunun kendisi hiçbir zaman abonelik olarak saklanmaz.
- Gönderi bağlantıları her zaman topluluğun tam adresini kullanır; bu nedenle eski bir bağlantı, kazanan değiştikten sonra başka bir topluluğu göstermeye başlayamaz.
- Kazanan değiştiğinde Seedit mevcut aboneliklere dokunmaz ve her aboneye yeni kazanana geçmek mi, ikisini birden tutmak mı yoksa mevcut topluluğu korumak mı istediğini sorar. Otomatik geçiş, her dizin için ayrı ayrı açılan isteğe bağlı bir ayardır ve otomatik bir geçiş, geri alma seçeneği sunan bir bildirim gösterir.

Dolayısıyla rakip bir topluluk kimsenin aboneliklerini almaz. Kazandığı şey addır: yeni ziyaretçiler ona ulaşır, mevcut aboneler ise tek tıklamayla seçim yapabilir. Eski topluluğu tercih edenler onunla devam eder.

## Neden ilk gelenin aldığı adlar değil

- **Ad işgali yok.** İyi bir ada sahip olmak yetmez. Bir topluluğun o ad için en iyi aday olmayı sürdürmesi gerekir.
- **Adları hiçbir yönetici atamaz.** Adların bir yönetici tarafından dağıtılması, Bitsocial'ın ortadan kaldırmak için tasarlandığı merkezi veto yetkisini yeniden yaratırdı.
- **Rakipler kitleye ulaşma yolunu korur.** Rakip bir topluluk daha kötü bir adla sıfırdan başlamak yerine aynı adı hedefler.
- **İstemciler kazanan konusunda hemfikirdir.** Seedit adayları deterministik olarak sıralar; böylece aynı kesinleşmiş dizin anlık görüntüsünü okuyan her istemci aynı kazananı gösterir. Kazanan tek bir kullanıcının bağlantısında geçici olarak erişilemiyor diye Seedit onun yerine başka bir adayı göstermez.

## Kazananlar bugün nasıl belirleniyor

Adaylar [bitsocialnet/lists](https://github.com/bitsocialnet/lists) deposunda, her dizin için bir dosya olacak şekilde JSON dosyaları olarak yayımlanır ve bir topluluk, ilgili dosyaya gönderilen bir çekme isteğiyle dizine katılır. Bu bir başlangıç adımıdır. Amaç, kazananları belirleme yolu olarak çekme isteklerinin yerini oylamanın almasıdır.

- **Seedit** bir dizinin adaylarını önce puana, ardından eklendikleri zamana, son olarak da adrese göre sıralar. Her dizin dosyasında bir revizyon numarası bulunur ve adaylarında ya da kazananında yapılan her değişiklik yeni bir revizyon yayımlar.
- **5chan**, [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting) ile her dizin için bir oylama yarışması yürütür. İstemciler imzalı oy pusulalarını libp2p gossipsub üzerinden paylaşır ve sonucu kendileri hesaplar; oyları sayan bir sunucu yoktur. Oy vermek için devredilemeyen bir token olan 5chan Pass gerekir ve her Pass sahibinin bir oyu vardır. Henüz listede olmayan bir panoya oy vermek onu aday gösterir. Yarışmalar şu anda Base Sepolia test ağında çalışıyor ve test ağından çıkana kadar sonuçlar gösterilir ancak listenin sırasını değiştirmez.

## Protokol mü, uygulama mı?

Dizinler, toplulukları depolayan ve taşıyan eşler arası katman olan PKC'nin bir parçası değildir. Bunlar, istemcilerin bu katmanın üzerinde, varsayılan listeler ve aramayla birlikte uyguladığı bir kuraldır; bkz. [İçerik Keşfi](./content-discovery.md). Bir istemci aynı dizin dosyalarını okuyabilir, kendi dosyalarını yayımlayabilir ya da dizinleri tamamen atlayabilir; kullanıcılar da herhangi bir topluluğu adresiyle açmaya devam edebilir.
