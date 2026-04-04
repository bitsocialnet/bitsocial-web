---
title: Bir imageboard istemcisi oluşturun
description: Bitsocial'da yeni görsel pano deneyimleri sunmak isteyen inşaatçılar için 1. Aşama katkı kılavuzu.
sidebar_position: 1
---

# Bir imageboard istemcisi oluşturun

Aşama 1, tüm kategoriyi kapsayan tek bir resmi uygulamayla ilgili değildir. 5chan ilk kanıt noktasıdır, ancak asıl amaç geniş bir görüntü tahtası ekosistemidir: farklı görsel dillere, denetim varsayılanlarına, dizin modellerine ve hedef topluluklara sahip birden fazla Bitsocial istemcisi.

## Aşama 1'in neye ihtiyacı var?

- Genel katılım için tanıdık 4chan tarzı istemciler
- Farklı kültürlere ve yönetim kurulu paketlerine sahip Altchan'dan ilham alan müşteriler
- Mobil öncelikli veya düşük bant genişliğine sahip istemciler
- Güçlü varsayılan varsayılanlara sahip tek topluluklu veya niş müşteriler
- Birlikte gelen ilk uygulamaya kıyasla daha iyi denetim, medya, katılım veya keşif akışları

## Yardım etmenin en hızlı yolu

Teslimata giden en kısa yolu istiyorsanız, önce doğrudan 5chan'a katkıda bulunun:

- [5chan.app](https://5chan.app)) adresindeki canlı uygulamayı keşfedin
- Kaynağı [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)) adresinde inceleyin
- [t.me/fivechandev](https://t.me/fivechandev)) adresindeki inşaatçı sohbetine katılın

## Kendi müşterinizi oluşturun

5chan istediğiniz topluluk veya arayüzle eşleşmiyorsa bunun yerine ayrı bir istemci oluşturun. Uyumlu Bitsocial istemcileri, aynı ürün kararlarını paylaşmadan aynı ağı paylaşabilir.

1. Protokole yönelik araçları öğrenin:
   - [Bitsosyal React kancaları](../react-hooks/)
   - [Bitsosyal CLI](../cli/)
2. Gerçekte ne tür bir görüntü panosu oluşturacağınıza karar verin.
Önce pano yapısını, kimlik varsayımlarını, denetleme modelini, keşif akışını ve görsel dili seçin.
3. Projeye uygun uygulama yolunu seçin.
Tanıdık bir görüntü panosu tabanıyla hızlı hareket etmek istiyorsanız 5chan'ı çatallayın. Kullanıcı arayüzünün veya etkileşim modelinin kökten farklı olması gerekiyorsa yeni bir başlangıç ​​yapın.
4. Dar bir ilk versiyon gönderin.
Gerçek bir topluluğa iyi hizmet eden bir müşteri, herkesi memnun edecek belirsiz bir klondan daha değerlidir.
5. Sonucu yayınlayın ve toplulukların bunu test etmesine izin verin.
Bitsocial, dışarıdaki inşaatçıların tek bir resmi uygulamanın her şeyi yapmasını beklemek yerine, ürün kalitesi konusunda rekabet eden sabit fikirli müşteriler göndermesiyle gelişir.

## Tasarım prensibi

Bitsocial, tek bir mutlu müşteriye sahip olmakla kazanmaz. Birçok müşteri bir arada bulunabildiğinde, çatallaşabildiğinde, uzmanlaşabildiğinde ve ilk uygulamanın asla sağlayamayacağı ihtiyaçları karşılayabildiğinde kazanır.
