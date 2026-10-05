---
title: Bitsocial ve Reticulum
description: LoRa ve diğer düşük bant genişlikli bağlantılar için geliştirilmiş kriptografik ağ yığını Reticulum'un Bitsocial ile nasıl karşılaştırıldığı ve Bitsocial'ın onun üzerinde çalışıp çalışamayacağı.
---

# Bitsocial ve Reticulum

[Reticulum](https://reticulum.network/), elde hangi taşıyıcı ortam varsa onun üzerinde ağ kurmak
için geliştirilmiş, kriptografi tabanlı bir ağ yığınıdır: LoRa telsizleri, paket radyo, seri
bağlantılar, Wi-Fi, Ethernet, TCP, UDP veya I2P. Bitsocial'ın yanında anılmasının nedeni, ikisinin
de aradaki şirketi ortadan kaldırmasıdır. Bunu farklı katmanlarda yaparlar; bu yüzden birbirlerinin
rakibi değil, tamamlayıcısıdırlar.

## Farklı katmanlar

Reticulum ağ katmanının yerini alır. Uygulamalara IP adresleri, DNS, sertifika yetkilileri veya
hesaplar olmadan şifreli ve yönlendirilebilir uç noktalar sunar; 500 baytlık bir MTU ile saniyede 5
bit kadar yavaş bağlantılarda bile çalışmayı sürdürecek şekilde tasarlanmıştır. Gönderileri,
toplulukları veya moderasyonu tanımlamaz; bunları üzerine inşa edilen uygulamalar ekler.

Bitsocial bir sosyal protokoldür. Bir tarayıcı sekmesi de dâhil olmak üzere sıradan internet
bağlantıları üzerinden IPFS/libp2p yığınında çalışır; toplulukları, yayınları ve topluluk başına
spam önleme sınamalarını tanımlar. Bkz. [Eşler Arası Protokol](/peer-to-peer-protocol/) ve
[Tarayıcıda Eşler Arası Ağ](/browser-p2p/).

Bitsocial'ın yığınında Reticulum, Bitsocial protokolünün bulunduğu yerde değil, kabaca libp2p'nin
bulunduğu yerde konumlanırdı.

## Reticulum nasıl çalışır

- **Kimlikler.** Bir Reticulum kimliği 512 bitlik bir anahtar kümesidir: şifreleme için bir X25519
  anahtarı ve imzalar için bir Ed25519 anahtarı.
- **Hedefler.** Uygulamalar, 16 bayta kısaltılmış bir SHA-256 karmasıyla adreslenen hedefler
  oluşturur. Paketler kaynak adresi taşımaz.
- **Duyurular.** Bir hedef, bir duyuru göndererek erişilebilir hâle gelir. Transport düğümleri
  duyuruyu iletir ve geri dönüş yolundaki bir sonraki atlamayı hatırlar; böylece hiçbir düğümün ağın
  tamamının haritasına ihtiyacı olmaz.
- **Şifreleme.** Trafik varsayılan olarak geçici anahtarlar ve ileri gizlilik ile şifrelenir.
- **LXMF.** [LXMF](https://github.com/markqvist/LXMF) mesajlaşma katmanı imzalı mesajlar, doğrudan
  teslim ve çevrimdışı alıcılar için yayılım düğümleri üzerinden depola-ve-ilet teslimi ekler.

Bu şekilde geliştirilmiş uygulamalar arasında mesajlaşma için
[Sideband](https://github.com/markqvist/Sideband) ve mesajlaşma ile barındırılan sayfalar için
[Nomad Network](https://github.com/markqvist/NomadNet) bulunur. Reticulum kılavuzu bir
[program listesi](https://reticulum.network/manual/software.html) tutar.

## Karşılaştırma

| Soru               | Reticulum                                                                                                             | Bitsocial                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Nedir              | Ağ yığını                                                                                                             | Eşler arası sosyal protokol ve uygulamalar                                                                            |
| Ne için tasarlandı | Yavaş radyo bağlantılarına kadar her taşıyıcı ortam                                                                   | Tarayıcı sekmeleri dâhil internet bağlantıları                                                                        |
| Kimlik             | X25519 ve Ed25519 anahtar kümesi                                                                                      | Kullanıcılar ve topluluklar için Ed25519 anahtar çiftleri                                                             |
| Adresler           | Bir kimliğin ve uygulama adının karması                                                                               | Bir topluluğun açık anahtarının karması                                                                               |
| Eş bulma           | Transport düğümlerinin yaydığı duyurular                                                                              | HTTP yönlendiricileri sağlayıcı eşleri döndürür                                                                       |
| Sosyal özellikler  | Nomad Network gibi uygulamalar tarafından eklenir                                                                     | Protokolde topluluklar, gönderiler, yanıtlar ve moderasyon                                                            |
| Spam denetimi      | Ağ arabirimi başına duyuru hız sınırları; bir alıcının veya düğümün zorunlu tutabileceği LXMF proof-of-work damgaları | Bir gönderi kabul edilmeden önce her topluluğun kendi sınaması                                                        |
| Çevrimdışı teslim  | LXMF yayılım düğümleri mesajları depolayıp iletir                                                                     | Eşler bir topluluğun en güncel durumunu sunmayı sürdürür; yayımlamak için topluluk düğümünün çevrimiçi olması gerekir |

## Bitsocial, Reticulum üzerinde çalışabilir mi?

Bugün için hayır. Bitsocial'ın bir Reticulum taşıma katmanı yoktur ve veri modeli internet bant
genişliğini varsayar: bir istemci topluluk meta verilerini ve gönderi içeriğini eşlerden alır ve
pubsub mesajları alışverişi yapar; bu da 500 baytlık paketler ve saniyede bit ya da kilobit ile
ölçülen veri hızı etrafında kurulmuş bağlantılara pek uymaz.

Gerçekçi yol daha dardır: ağdan kopukken yerel bir mesh ağı üzerinden çalışan, ardından internet
erişimi olan bir eşe veya ağ geçidine ulaşılabildiğinde daha geniş Bitsocial ağıyla eşitlenen bir
istemci. Bu, protokolde bir değişiklik değil, yeni bir istemci ve köprü olurdu; ayrıca mevcut yol
haritasında yer almıyor.

## Geliştiriciler için

Reticulum, [Reticulum Lisansı](https://reticulum.network/manual/license.html) altında yayımlanır:
MIT tarzı koşullar ve buna ek iki kısıtlama. Yazılım, insanlara zarar vermek üzere tasarlanmış
sistemlerde ya da yapay zekâ veya makine öğrenimi eğitim veri kümeleri oluşturmada kullanılamaz.
Reticulum kodunu bir Bitsocial uygulamasına dâhil etmeden önce lisansı okuyun.

Referans uygulama [Python ile yazılmıştır](https://github.com/markqvist/Reticulum). Reticulum'un
bakımcıları, Reticulum ve LXMF'nin resmî olmayan birkaç portunun makine tarafından üretildiği ve
geçersiz saydıkları lisans iddiaları taşıdığı konusunda uyarıyor; bu nedenle referans uygulamayı
veya kılavuzda listelenen programları tercih edin.
