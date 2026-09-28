---
title: Tarayıcıda Eşler Arası Ağ
description: Bir Bitsocial web uygulamasının tarayıcı sekmesinde nasıl gerçek bir libp2p düğümü çalıştırdığı, hangi taşıma katmanlarını kullandığı ve sekmeden yayın yapmayı mümkün kılan 2026 tarihli yukarı akış düzeltmesi.
---

# Tarayıcıda Eşler Arası Ağ

Bir Bitsocial web uygulamasının, birilerinin sunucusuna bağlı bir istemci olması gerekmez. Sayfa,
tarayıcı sekmesinin içinde bir [Helia](https://helia.io/) düğümü çalıştırabilir, masaüstü ve CLI
düğümleriyle aynı eşler arası ağa katılabilir, topluluk içeriğini eşlerden getirebilir ve pubsub
üzerinden yayın yapabilir.

Bu sayfa bunun gerçekte ne anlama geldiğini, hangi taşıma katmanlarının kullanıldığını, hâlâ nelerin
yapılamadığını ve sekmeden yayın yapmanın neden ancak 2026'da çalışmaya başladığını anlatır.

Ağ tasarımının bütününü görmek için bkz. [Eşler Arası Protokol](/peer-to-peer-protocol/).

## Sekmede ne çalışır

Tarayıcı P2P etkinken sayfa gerçek bir libp2p düğümü barındırır:

- diğer eşlere güvenli WebSockets üzerinden bağlanır
- topluluk içeriğini bir IPFS ağ geçidinden değil, doğrudan bu eşlerden getirir ve doğrular
- gossipsub'a katılır, dolayısıyla bir gönderi yayınlamak için barındırılan bir pubsub sağlayıcısı gerekmez
- diğer bütün Bitsocial uygulamalarıyla aynı protokol istemci yığınını (`pkc-js`) kullanır

Bunun pratik sonucu şudur: bir web okuyucusuyla topluluk arasında hiçbir ağ geçidi operatörü durmaz.
Bütün tarayıcı kullanıcıları için bir topluluğu aynı anda devre dışı bırakmaya zorlanabilecek tek bir
HTTPS uç noktası yoktur.

## Tarayıcı düğümleri nasıl bağlanır

`pkc-js`, eşlere **güvenli WebSockets** üzerinden bağlanır. WebRTC ve WebTransport bağlantı denemeleri
bir bağlantı geçidi (connection gater) aracılığıyla varsayılan olarak reddedilir, çünkü tarayıcıda bu
yollar uzun süren ve sık başarısız olan bağlantı kurma adımları getirir — STUN/ICE müzakeresi,
certhash rotasyonu — ve sayfa yüklemelerini yavaşlatır; buna karşılık WebSocket doğrudan ve güvenilir
bir taşıma sağlar. Özellikle WebRTC veya WebTransport isteyen çağıranlar bu geçidi
`libp2pJsClientsOptions[].libp2pOptions.connectionGater` üzerinden geçersiz kılabilir.

Bunun pratik sonucu, bir tarayıcı eşinin WSS uç noktası sunan düğümlere bağlanmasıdır; yani o
düğümlerin bir alan adına ve CA imzalı bir sertifikaya ihtiyacı vardır. Böyle bir uç noktası olmayan,
ev bağlantıları arkasındaki eşlere sekmeden doğrudan bağlanmak yerine dolaylı olarak ulaşılır.

## Tarayıcıdan yayın yapmak neden ancak 2026'da çalışmaya başladı

Tarayıcıda eşler arası ağ yeni bir fikir değil. 2026'da değişen şey, bir tarayıcı düğümünün
_gönderilerinin_ artık ağın geri kalanına ulaşmasıdır.

libp2p pubsub belirtimi, bir mesajın `seqno` değerinin doğrusal biçimde artan 64 bitlik big-endian bir
tam sayı olmasını şart koşar. `js-libp2p-gossipsub` bunun yerine 8 rastgele bayt üretiyordu;
go-libp2p-pubsub ve rust-libp2p ise bir sayaç kullanıyordu. Kubo 0.40+ sürümü `BasicSeqnoValidator`
doğrulayıcısını varsayılan olarak etkinleştirir ve bu doğrulayıcı, seqno değeri o eşten görülmüş en
yüksek değerden büyük olmayan her mesajı reddeder.

Sonuç olarak, bir JavaScript düğümünün — tarayıcı düğümleri dahil — yayınladığı mesajların çoğu Kubo
eşleri tarafından sessizce atılıyordu. Bir yeniden üretim testinde 30 mesajdan yalnızca 2 ila 8'inin
ulaştığı ölçüldü.

Sorun [js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) kaydında
teşhis edildi ve Mayıs 2026'da **`@libp2p/gossipsub` 15.0.21** sürümünde düzeltildi. Bu düzeltme
gelene kadar bir tarayıcı düğümü bağlanıp okuyabiliyor, ancak gönderileri Go eşlerine giderken
çoğunlukla kayboluyordu. `pkc-js`, bu düzeltmenin ardından gelen `@libp2p/gossipsub` 16.0.4 sürümünü
içerir.

## Bir tarayıcı düğümünün hâlâ yapamadıkları

Bir tarayıcı düğümü gerçek bir eştir, sunucu değil. Masaüstü ya da sürekli açık bir düğümden farklı
sınırları vardır:

- genellikle genel internetten gelen rastgele bağlantıları kabul edemez
- yalnızca sekme açıkken çalışır, dolayısıyla bir topluluğun verileri için uzun ömürlü bir barındırıcı değildir
- bir libp2p DHT'sine katılamaz; keşfin HTTP yönlendiricileri üzerinden yapılmasının nedeni budur
- ölçekli tohumlama için uygun değildir

Tam topluluk barındırma işi hâlâ en iyi biçimde bir masaüstü uygulaması, `bitsocial-cli` veya sürekli
açık başka bir düğüm tarafından yürütülür. Tarayıcı P2P, ağ geçidi olmadan kimlerin _okuyup gönderi
paylaşabileceğini_ değiştirir; çevrimiçi kalan eşlere duyulan ihtiyacı ortadan kaldırmaz.

## HTTP yönlendiricileri ağ geçidi değildir

Tarayıcı istemcileri, bir topluluğun adresini şu anda hangi eşlerin sağladığını öğrenmek için yine de
[HTTP yönlendiricilerini](/peer-to-peer-protocol/#public-key-based-addressing) sorgular. Bu, "tarayıcıda
saf eşler arası ağ" ifadesinin dürüst dipnotudur ve bu konuda net olmakta fayda var:

- bir yönlendirici, bir içerik adresi için yalnızca eş adreslerini saklar
- topluluğun içeriğini saklamaz, sunmaz, hatta bilmez
- istemciler birden fazla yönlendiriciyi paralel sorgular ve sonuçları birleştirir
- herkes bir tane çalıştırabilir; yönlendirici değiştirmek, veri taşımayı gerektirmeyen bir yapılandırma değişikliğidir

Keşif tamamlandıktan sonra içerik aktarımı ve pubsub trafiği eşler arasında akar. Ortadan kaybolan bir
yönlendirici size bir arama yolu kaybettirir, verinizi değil. Bir IPFS ağ geçidi ise bunun tersine,
içerik yolunun tam ortasında yer alır.

## Bugün bu nerede çalışıyor

- [5chan](/apps/5chan/), [5chan.app](https://5chan.app) adresindeki web uygulamasında varsayılan
  olarak saf tarayıcı P2P çalıştırır.

## Ağ geçidi yedeği

Ağ geçidi destekli erişim, doğrudan katılamayan tarayıcılar veya ağlar için bir uyumluluk yolu olarak
varlığını sürdürüyor. Bkz. [Ağ geçidi yedeği](/peer-to-peer-protocol/#gateway-fallback). Hedeflenen
mimaride önce tarayıcı P2P gelir; ağ geçitleri ise varsayılan darboğaz değil, isteğe bağlı bir yedektir.
