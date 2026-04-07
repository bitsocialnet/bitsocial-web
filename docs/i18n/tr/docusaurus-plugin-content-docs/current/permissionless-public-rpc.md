---
title: İzinsiz Genel RPC
description: Yalıtılmış kullanıcılara, kapsamlı izinlere ve topluluk sahipliğine sahip genel bir Bitsocial RPC hizmeti için önerilen tasarım.
---

# İzinsiz Genel RPC

Orijinal halka açık RPC teklifi, eski plebbit terminolojisiyle yazılmış bir GitHub sorunu olarak varlığını sürdürdü. Bu sayfa, bu fikri Bitsocial dilinde yeniden yazıyor ve onu uygulama ayrıntılarından oluşan bir duvar yerine ürün düzeyinde bir teklif olarak çerçeveliyor.

## Sade dil hedefi

[Bitsocial Forge](https://bitsocialforge.com), operatörü bu toplulukların koruyucusu haline getirmeden, birçok kullanıcının kendi Bitsocial topluluklarını uzaktan yönetmesine olanak tanıyan halka açık bir RPC hizmeti çalıştırabilir.

Hizmet, üç kısıtlamayı korurken mobil ve hafif istemcileri pratik hale getirmelidir:

1. Kullanıcılar varsayılan olarak birbirlerinden izole kalırlar.
2. İzinler açık ve ayrıntılı kalır.
3. Geçerli RPC isteği ve yanıt şekliyle uyumluluk, kullanıma sunma sırasında korunabilir.

## Hangi sorunu çözüyor

Günümüzde en basit RPC modeli genellikle ya hep ya hiç modelidir: bir kimlik doğrulama anahtarı, bir yetki alanı, tam erişim. Bu, tek bir operatör için işe yarar ancak halka açık çok kullanıcılı bir hizmet için işe yaramaz.

İzinsiz bir genel RPC'nin daha güçlü bir modele ihtiyacı vardır:

- bir hizmet birçok kullanıcıyı barındırabilir
- her kullanıcının kendi topluluğu ve sınırları vardır
- operatör tanımlı politikalar kötüye kullanımı önleyebilir
- kullanıcı daha sonra yine de uzaklaşabilir veya kendi kendine barındırabilir

## Çekirdek modeli

### Kullanıcılar

Her kullanıcıya bir kimlik doğrulama bilgisi ve bir izin paketi verilir.

### Topluluklar

Hizmet aracılığıyla oluşturulan topluluklar bir sahip kaydına atanır. Yönetim yöntemlerinin kapsamının doğru kullanıcıya belirlenebilmesi için sahiplik açıkça izlenir.

### İzinler

İzinler yetenek tabanlıdır. Sunucu, "RPC'yi kullanabilir" için bir boole değeri yerine şunları kontrol edebilir:

- bir kullanıcının kaç topluluk oluşturabileceği
- hangi yönetim yöntemleri mevcuttur
- hangi yayınlama işlemlerine izin veriliyor
- hangi oran sınırları uygulanır
- hangi yönetici yüzeyleri görünür?

### Yönetici yüzeyi

Genel RPC'nin kendisi, kullanıcıya yönelik RPC davranışına odaklanmalıdır. Kullanıcı oluşturma, sahiplik aktarımı ve denetim incelemesi gibi yönetim görevleri, ayrı bir operatör API'sine ve kontrol paneline aittir.

## Uyumluluk duruşu

Kullanıcıya yönelik belgelerde **topluluk** ve **profil** gibi Bitsocial terimleri kullanılmalıdır.

Kablo düzeyinde, ilk kullanıma sunma, uyumluluk açısından yararlı olduğu durumlarda mevcut JSON-RPC aktarımını ve yük taşıma şeklini hâlâ koruyabilir. Başka bir deyişle: geçiş dönemi bazı eski yöntem adlarını korusa veya perde arkasında talep şekilleri olsa bile, dokümanların artık eski plebbit dokümanları gibi konuşmasına gerek yok.

## Önerilen izin paketi

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Tam yöntem adları açıklayıcıdır. Önemli olan politikanın şeklidir: bireysel yetenekler tek bir süper kullanıcı token'ında bir araya gelmek yerine bağımsız olarak kontrol edilir.

## Bağlantı akışı

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

İzin farkındalığı isteğe bağlı kalmalıdır. Bildirimi yok sayan bir istemci, sunucudaki standart yetkilendirme hatalarını işleyerek yine de doğru davranabilir.

## Mülkiyet yaptırımı

Hizmet bir topluluk oluşturduğunda, sahipliği otomatik olarak arayan kullanıcıya atamalıdır. Oradan:

- topluluk başlatma, durdurma, düzenleme ve silme işlemleri sahip kapsamındadır
- liste ve abonelik yanıtları varsayılan olarak arayanın kendi topluluklarına göre belirlenir
- daha geniş görünürlük, varsayılan değil, açık bir yönetici iznidir

Bir uç durum çok önemlidir: Bir kullanıcı **sahip olmadığı** bir topluluğa abone olursa, sunucu yalnızca herhangi bir dış gözlemcinin görmesi gereken genel durumu açığa çıkarmalıdır. Yalnızca sahibin yapılandırması veya dahili çalışma zamanı verileri hiçbir zaman bir abonelik API'si aracılığıyla sızmamalıdır.

## Önerilen operatör yüzeyi

Yönetici API'si sıkıcı ve açıklayıcı kalabilir:

- kullanıcıları listele
- bir kullanıcıyı incele
- kullanıcı oluşturma veya güncelleme
- kullanıcıları sil
- topluluk sahipliğini aktarma
- denetim günlüklerini inceleyin

Bu operatör API'sinin kimlik doğrulaması, son kullanıcı RPC kimlik doğrulamasından tamamen ayrı olmalıdır.

## Kullanıma sunma aşamaları

### Aşama 1

- genel RPC proje yapısını oluşturmak
- kullanıcı kayıtları ve sahiplik takibi ekleme
- Geçerli RPC sunucusunu çatallayın veya genişletin

### Aşama 2

- izin paketlerini uygulama
- bunları RPC yöntemi katmanında uygulayın
- bağlantıda izin meta verilerini döndür

### Aşama 3

- operatör API'sini ekleyin
- denetim günlüğü ekle
- yönetici kimlik doğrulaması ekle

### Aşama 4

- yönetici kontrol panelini gönderin
- kötüye kullanım kontrollerini test edin
- hız sınırlamasını ve depolama kotalarını sıkılaştırın

## Açık sorular

### Kimlik doğrulama spam'i

Kimlik doğrulama oluşturma ucuzsa, kamu hizmetlerinin kimlik bilgilerini vermeden önce bir sorgulama katmanına ihtiyacı olabilir. Olası yollardan biri, topluluk meydan okuma modelinin kendisini yeniden kullanmaktır, böylece kimlik bilgilerinin verilmesi, ağın geri kalanıyla aynı kötüye kullanım karşıtı felsefeyi miras alır.

### Eski adlandırma

Bazı erken uygulamalar, uyumluluk amacıyla eski yöntem adlarını dahili olarak göstermeye devam edebilir. Bu, Bitsocial dokümanlarının kalıcı halka açık sözlüğü olarak değil, bir geçiş detayı olarak ele alınmalıdır.

## Özet

Bu teklif aslında tek bir şeyle ilgili: kamuya açık RPC altyapısını gözetim altına almadan kullanışlı hale getirmek. İyi bir halka açık Bitsocial RPC, arka kapıdan mülkiyeti geri alan yeni bir merkezi platform gibi değil, toplulukları yönetmek için isteğe bağlı bir yardım gibi görünmelidir.
