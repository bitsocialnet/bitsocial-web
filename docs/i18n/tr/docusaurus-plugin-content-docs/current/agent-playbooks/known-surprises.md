# Bilinen Sürprizler

Bu dosya, ajan hatalarına yol açmış, depoya özgü kafa karışıklığı noktalarını izler.

## Kayıt Ölçütleri

Bir kaydı yalnızca aşağıdakilerin tamamı doğruysa ekleyin:

- Bu depoya özgüdür (genel geçer bir tavsiye değildir).
- Gelecekteki ajanlar için yeniden ortaya çıkması olasıdır.
- İzlenebilecek somut bir önlemi vardır.

Emin değilseniz, kayıt eklemeden önce geliştiriciye danışın.

## Kayıt Şablonu

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Kayıtlar

### Vercel uygulama üretim alan adları Git master dağıtımlarına geri kayabilir

- **Tarih:** 2026-04-28
- **Gözlemleyen:** Tommaso + Codex
- **Bağlam:** Bitsocial Web uygulama dizinindeki Seedit ve 5chan uygulama yansılarının doğrulanması.
- **Şaşırtıcı olan:** Vercel `seedit` ve `5chan` projelerinde `gitProviderOptions.createDeployments = "enabled"` ayarı vardı; bu yüzden GitHub `master` gönderimleri üretim alan adlarına yükseltiliyordu, oysa depo politikası üretim uygulama yansılarının yalnızca sürüm çıktılarını sunmasını bekliyor.
- **Etki:** Uygulama dizinindeki doğrulanmış yansı rozetleri yanlış hale gelebilir, çünkü üretim alan adları, `about/src/lib/apps-data.ts` içinde `index.html` özeti kayıtlı olan GitHub sürüm ZIP'i yerine en güncel geliştirme işlemesini sunar.
- **Önlem:** Yansı doğrulama meta verisi eklemeden veya yenilemeden önce Vercel projesini `vercel api /v9/projects/<project-id>` ile kontrol edin ve `gitProviderOptions.createDeployments = "disabled"` olduğunu doğrulayın. Sürüm ZIP içeriğini `vercel deploy --prebuilt --prod` ile dağıtın, geliştirme dağıtımları için ise `seedit-omega.vercel.app` veya `5chan-omega.vercel.app` kullanın.
- **Durum:** onaylandı

### Başlatıcı HTTPS'i zorlamadıkça Portless 0.11 eski proxy durumunu yeniden kullanır

- **Tarih:** 2026-04-28
- **Gözlemleyen:** Tommaso + Codex
- **Bağlam:** Normal `yarn start` akışının eski `http://bitsocial.localhost:1355` proxy URL'sinden şu yeni adrese yükseltilmesi: `https://bitsocial.localhost`.
- **Şaşırtıcı olan:** `portless@0.11.1` kurulu olmasına rağmen Portless, mevcut `~/.portless/proxy.port = 1355` HTTP proxy'sini yeniden kullandı ve eski `:1355` URL'sini yazdırdı.
- **Etki:** Paket sürümlerini ve belgeleri güncellemek yeterli değil; bir katkı sağlayanın makinesinde eski Portless durumu çalışıyorsa `yarn start` hâlâ eski URL'yi duyurup kullanabilir.
- **Önlem:** Başlatma betikleri, uygulama rotalarını kaydetmeden önce Portless HTTPS proxy'sini açıkça `443` portunda başlatmayı sürdürsün; böylece çalışma zamanı akışı, kalıcılaşmış `1355` durumunu devralmak yerine ondan uzaklaşır.
- **Durum:** onaylandı

### Portless, kanonik yerel uygulama URL'sini değiştirir

- **Tarih:** 2026-03-18
- **Gözlemleyen:** Codex
- **Bağlam:** Tarayıcı doğrulaması ve duman testi akışları
- **Şaşırtıcı olan:** Varsayılan yerel URL, alışıldık Vite portu değildir. Depo, Portless üzerinden `https://bitsocial.localhost` adresini bekler; bu nedenle `localhost:3000` veya `localhost:5173` adresini denemek yanlış uygulamaya ya da hiçbir şeye düşebilir.
- **Etki:** Geliştirme sunucusu sağlıklı olsa bile tarayıcı kontrolleri başarısız olabilir ya da yanlış hedefi doğrulayabilir.
- **Önlem:** Önce `https://bitsocial.localhost` adresini kullanın. Yalnızca doğrudan bir Vite portuna açıkça ihtiyaç duyduğunuzda `PORTLESS=0 corepack yarn start` ile bunu atlayın.
- **Durum:** onaylandı

### Commitizen kancaları etkileşimsiz işlemeleri engeller

- **Tarih:** 2026-03-18
- **Gözlemleyen:** Codex
- **Bağlam:** Ajan güdümlü işleme iş akışları
- **Şaşırtıcı olan:** `git commit`, Husky üzerinden Commitizen'i tetikler ve etkileşimli TTY girdisi bekler; bu da etkileşimsiz ajan kabuklarını askıda bırakır.
- **Etki:** Ajanlar, sıradan bir işleme olması gereken adımda süresiz olarak takılabilir.
- **Önlem:** Ajanın oluşturduğu işlemeler için `git commit --no-verify -m "message"` kullanın. İnsanlar `corepack yarn commit` veya `corepack yarn exec cz` kullanmayı sürdürebilir.
- **Durum:** onaylandı

### Yarn classic'ten kaçınmak için Corepack gerekir

- **Tarih:** 2026-03-19
- **Gözlemleyen:** Codex
- **Bağlam:** Paket yöneticisinin Yarn 4'e geçirilmesi
- **Şaşırtıcı olan:** Makinede `PATH` üzerinde hâlâ global bir Yarn classic kurulumu var; bu yüzden düz `yarn` komutu, sabitlenmiş Yarn 4 sürümü yerine v1'e çözümlenebiliyor.
- **Etki:** Geliştiriciler deponun paket yöneticisi sabitlemesini yanlışlıkla atlayıp farklı bir kurulum davranışı veya farklı bir kilit dosyası çıktısı elde edebilir.
- **Önlem:** Kabuk komutları için `corepack yarn ...` kullanın veya önce `corepack enable` çalıştırın ki düz `yarn` sabitlenmiş Yarn 4 sürümüne çözümlensin.
- **Durum:** onaylandı

### Sabit Portless uygulama adları Bitsocial Web worktree'leri arasında çakışır

- **Tarih:** 2026-03-30
- **Gözlemleyen:** Codex
- **Bağlam:** Başka bir worktree zaten Portless üzerinden hizmet verirken bir Bitsocial Web worktree'sinde `yarn start` çalıştırmak
- **Şaşırtıcı olan:** Her worktree'de birebir `bitsocial` Portless uygulama adını kullanmak, arkadaki portlar farklı olsa bile rotanın kendisini çakıştırır; ikinci süreç, `bitsocial.localhost` zaten kayıtlı olduğu için başarısız olur.
- **Etki:** Portless'in amacı paralel dalların güvenle bir arada var olabilmesi olsa da, paralel Bitsocial Web dalları birbirini engelleyebilir.
- **Önlem:** Portless başlatmayı `scripts/start-dev.mjs` arkasında tutun; bu betik artık kanonik durumun dışında dal kapsamlı bir `*.bitsocial.localhost` rotası kullanıyor ve çıplak `bitsocial.localhost` adı zaten doluysa dal kapsamlı bir rotaya geri düşüyor.
- **Durum:** onaylandı

### Belge önizlemesi eskiden 3001 portunu sabit kodluyordu

- **Tarih:** 2026-03-30
- **Gözlemleyen:** Codex
- **Bağlam:** `yarn start` komutunu diğer yerel depolar ve ajanlarla birlikte çalıştırmak
- **Şaşırtıcı olan:** Kök geliştirme komutu, belge çalışma alanını `docusaurus start --port 3001` ile çalıştırıyordu; bu yüzden ana uygulama zaten Portless kullanmasına rağmen, başka bir süreç `3001` portunu tuttuğunda tüm geliştirme oturumu başarısız oluyordu.
- **Etki:** `yarn start`, web sürecini açılır açılmaz sonlandırabiliyor ve bir belge portu çakışması yüzünden ilgisiz yerel çalışmaları kesintiye uğratabiliyordu.
- **Önlem:** Belge başlatmayı `yarn start:docs` arkasında tutun; bu komut artık Portless ile birlikte `scripts/start-docs.mjs` kullanarak kendisine verilen boş portu dikkate alıyor, doğrudan çalıştırıldığında ise bir sonraki uygun porta geri düşüyor.
- **Durum:** onaylandı

### Belgelerin sabit Portless ana bilgisayar adı koda gömülüydü

- **Tarih:** 2026-04-03
- **Gözlemleyen:** Codex
- **Bağlam:** Başka bir worktree zaten Portless üzerinden belgeleri sunarken ikincil bir Bitsocial Web worktree'sinde `yarn start` çalıştırmak
- **Şaşırtıcı olan:** `start:docs` hâlâ birebir `docs.bitsocial.localhost` ana bilgisayar adını kaydediyordu; bu yüzden about uygulaması kendi ana bilgisayar adı için Portless rota çakışmalarından nasıl kaçınacağını bilmesine rağmen `yarn start` başarısız olabiliyordu.
- **Etki:** Paralel worktree'ler kök geliştirme komutunu güvenilir biçimde kullanamıyordu, çünkü önce belge süreci çıkıyor, ardından `concurrently` oturumun geri kalanını sonlandırıyordu.
- **Önlem:** Belge başlatmayı `scripts/start-docs.mjs` arkasında tutun; bu betik artık about uygulamasıyla aynı dal kapsamlı Portless ana bilgisayar adını türetiyor ve bu ortak genel URL'yi `/docs` geliştirme proxy hedefine aktarıyor.
- **Durum:** onaylandı

### Worktree kabukları deponun sabitlenmiş Node sürümünü kaçırabilir

- **Tarih:** 2026-04-03
- **Gözlemleyen:** Codex
- **Bağlam:** `.claude/worktrees/*` gibi Git worktree'lerinde veya kardeş worktree çalışma kopyalarında `yarn start` çalıştırmak
- **Şaşırtıcı olan:** Depo `.nvmrc` içinde `22.12.0` sürümünü sabitlemesine rağmen bazı worktree kabukları `node` ve `yarn node` komutlarını Homebrew Node `25.2.1` sürümüne çözümlüyordu; bu yüzden `yarn start`, geliştirme başlatıcılarını sessizce yanlış çalışma zamanında çalıştırabiliyordu.
- **Etki:** Geliştirme sunucusunun davranışı ana çalışma kopyası ile worktree'ler arasında sapabilir; bu da hataların yeniden üretilmesini zorlaştırır ve deponun beklediği Node 22 araç zincirini ihlal eder.
- **Önlem:** Geliştirme başlatıcılarını `scripts/start-dev.mjs` ve `scripts/start-docs.mjs` arkasında tutun; bunlar artık mevcut kabuk yanlış sürümdeyse kendilerini `.nvmrc` Node ikili dosyasıyla yeniden çalıştırıyor. Kabuk kurulumu yine de `nvm use` tercih etmelidir.
- **Durum:** onaylandı

### `docs-site/` artıkları, yeniden düzenlemeden sonra eksik belge kaynağını gizleyebilir

- **Tarih:** 2026-04-01
- **Gözlemleyen:** Codex
- **Bağlam:** Docusaurus projesi `docs-site/` konumundan `docs/` konumuna taşındıktan sonraki, birleştirme sonrası monorepo temizliği
- **Şaşırtıcı olan:** Takip edilen depo `docs/` konumuna geçtikten sonra bile eski `docs-site/` klasörü, `i18n/` gibi bayatlamış ama önemli dosyalarla birlikte diskte kalabiliyor. Bu, yeniden düzenlemenin yerelde iki kez yapılmış gibi görünmesine yol açar ve takip edilen belge çevirilerinin aslında `docs/` içine taşınmadığı gerçeğini gizleyebilir.
- **Etki:** Ajanlar eski klasörü “çöp” sayıp silebilir ve belge çevirilerinin tek yerel kopyasını kazara kaybedebilir ya da hâlâ ölü `docs-site/` yolunu gösteren betikleri düzenlemeyi sürdürebilir.
- **Önlem:** `docs/` konumunu tek kanonik belge projesi olarak görün. Yereldeki `docs-site/` artıklarını silmeden önce `docs/i18n/` gibi takip edilen kaynakları geri yükleyin, betikleri ve kancaları `docs-site` yoluna artık atıfta bulunmayacak şekilde güncelleyin.
- **Durum:** onaylandı

### Çok dilli belge önizlemesi doğrulama sırasında RAM kullanımını fırlatabilir

- **Tarih:** 2026-04-01
- **Gözlemleyen:** Codex
- **Bağlam:** Belge i18n'i, yerel ayar yönlendirmesi ve Pagefind davranışını `yarn start:docs` ve Playwright ile düzeltmek
- **Şaşırtıcı olan:** Varsayılan belge önizleme modu artık hizmet vermeye başlamadan önce tam bir çok dilli belge derlemesi ve Pagefind indekslemesi yapıyor; bu süreci birden fazla Playwright veya Chrome oturumuyla birlikte açık tutmak, normal bir Vite ya da tek dilli Docusaurus geliştirme döngüsünden çok daha fazla RAM tüketebiliyor.
- **Etki:** Makinenin belleği yetersiz kalabilir, tarayıcı oturumları çökebilir ve yarıda kesilen çalışmalar, geride bellek tüketmeyi sürdüren bayat belge sunucuları veya başsız tarayıcılar bırakabilir.
- **Önlem:** Yerel ayar rotası veya Pagefind doğrulaması gerektirmeyen belge çalışmalarında `DOCS_START_MODE=live yarn start:docs` tercih edin. Varsayılan çok dilli önizlemeyi yalnızca çevrilmiş rotaları veya Pagefind'i doğrulamanız gerektiğinde kullanın. Tek bir Playwright oturumuyla çalışın, yenilerini açmadan önce eski tarayıcı oturumlarını kapatın ve doğrulamadan sonra ihtiyacınız kalmadıysa belge sunucusunu durdurun.
- **Durum:** onaylandı

### `translate-docs.py` belge yerel ayarlarını yarı çevrilmiş ya da bozuk bağlantı hedefleriyle bırakabilir

- **Tarih:** 2026-04-06
- **Gözlemleyen:** Codex
- **Bağlam:** `yarn start:docs` İngilizce detay sayfaları sunduktan veya yerel ayar çıktısını derleyemedikten sonra yerelleştirilmiş belge rotalarını ve içeriğini düzeltmek
- **Şaşırtıcı olan:** Belge çeviri hattında depoya özgü iki arıza biçimi aynı anda vardı: `tr(...)` çağrıları betiğin ayrıştıramadığı biçimleri kullandığında `scripts/translate-docs.py` yalnızca `DocsHome` mesajlarının küçük bir alt kümesini çıkarıyordu ve `docs/i18n/**` altındaki çevrilmiş markdown, bağlantı hedeflerinin içinde makine çevirisi slug'lar veya `ZXQPLACEHOLDER` artıkları barındırabiliyordu.
- **Etki:** Yerelleştirilmiş ana sayfalar sessizce İngilizceye geri düşebilir, yerelleştirilmiş detay sayfaları çevrilmemiş görünebilir ve kaynak belgeler geçerli olsa bile tam `yarn docs:build` bozuk yerel ayar bağlantıları yüzünden başarısız olabilir.
- **Önlem:** Belge çevirilerini değiştirdikten veya yerel ayar dosyalarını yeniden ürettikten sonra her zaman depo kökünden `yarn docs:build` çalıştırın, `docs/i18n/**` altındaki markdown'ı `ZXQPLACEHOLDER` için tarayın ve çevrilmiş bağlantıların çevrilmiş URL yolları yerine hâlâ `/apps/5chan/` gibi kanonik belge slug'larını gösterdiğini doğrulayın. `DocsHome` metni değiştiyse, `scripts/translate-docs.py` betiğinin tüm `docs.home.*` mesajlarını çıkarmayı sürdürdüğünü teyit edin.
- **Durum:** onaylandı

### About sitesinin JS'siz kontrolleri bağımsız bir SSR önizlemesini değil, Portless rotasını kullanmalıdır

- **Tarih:** 2026-04-12
- **Gözlemleyen:** Codex
- **Bağlam:** Bir dal worktree'sinden `about/` sitesinin JS'siz desteğinin doğrulanması
- **Şaşırtıcı olan:** Bağımsız bir SSR önizlemesi sağlıklı görünürken, asıl dal kapsamlı Portless rotası hâlâ yanlış uygulama kabuğunu veya eski bir süreci sunuyor olabilir. Bu depoda gerçek yerel sözleşme, geçici bir önizleme sunucusu değil, `yarn start` komutundan gelen Portless ana bilgisayar adıdır.
- **Etki:** Ajanlar JS'siz desteğin çalıştığını yanlışlıkla iddia edebilir veya yalnızca `*.bitsocial.localhost` üzerinde ortaya çıkan gerilemeleri gözden kaçırabilir.
- **Önlem:** `about/` için tarayıcı doğrulamasında her zaman gerçek yerel sunucuyu `yarn start` veya `yarn start:about` ile başlatın ve önce dal kapsamlı Portless URL'sini test edin. Bir Portless ana bilgisayar adı bayat görünüyorsa, yeniden test etmeden önce eski süreci inceleyip durdurun.
- **Durum:** onaylandı

### `chain/`, `yarn build:verify` ve `yarn doctor` için görünmezdi

- **Tarih:** 2026-07-05
- **Gözlemleyen:** Codex
- **Bağlam:** `chain/` çalışma alanı (`chain.bitsocial.net` için bağımsız Vite uygulaması) monorepoya eklendikten sonra yalnızca chain/ içeren bir diff'in doğrulanması.
- **Şaşırtıcı olan:** `scripts/verify-build.mjs` yalnızca `about/`, `docs/` ve `stats/` yol öneklerini tanıyordu; bu yüzden kök `package.json` içinde `build:chain` zaten bulunmasına rağmen, yalnızca chain/ içeren bir diff "No targeted build checks matched the current diff" yazıp hiç derleme çalıştırmıyordu. Ayrıca `yarn doctor`, `react-doctor about -y` olarak koda gömülüydü; dolayısıyla `chain/src` altındaki React değişiklikleri hiç React Doctor kapsamına girmiyordu.
- **Etki:** Chain değişikliklerini doğrulayan ajanların, `yarn build:verify` komutuna güvenmek yerine doğrudan `yarn build:chain` çağırmayı bilmesi gerekiyordu ve `chain/src` içindeki React sorunları (efektler, hook'lar, ölü kod) `yarn doctor` tarafından fark edilmiyordu.
- **Önlem:** `scripts/verify-build.mjs` artık `about/` dalını yansıtan bir `chain/` dalı içeriyor; `doctor` ve `doctor:verbose` ise artık tek bir çağrıda `react-doctor --project about,chain -y` çalıştırıyor. `doctor:score` yalnızca `about` ile sınırlı kalıyor, çünkü `--score` birden fazla proje için `--project` ile birleştirildiğinde sessizce hiçbir şey yazdırmıyor; bir chain skoru gerekiyorsa `yarn react-doctor --project about,chain --verbose -y` (veya `--json`) kullanın.
- **Durum:** onaylandı

### Tarayıcı P2P güvenli WebSockets üzerinde çalışır; pkc-js varsayılan olarak WebRTC ve WebTransport'u reddeder

- **Tarih:** 2026-08-02
- **Gözlemleyen:** Claude
- **Bağlam:** Bitsocial tarayıcı P2P'sinin nasıl çalıştığına dair açılış sayfası ve belge metni yazmak
- **Şaşırtıcı olan:** `@pkcprotocol/pkc-js`, tarayıcıda WebRTC ve WebTransport bağlantı denemelerini reddeden varsayılan bir bağlantı süzgeciyle geliyor — `dist/browser/helia/dial-transport-filter.js` dosyası `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]` değerini dışa aktarıyor. Kaynak kodundaki yorum gerekçeyi veriyor: tarayıcıda bu taşıma katmanları, yüklemeyi yavaşlatan uzun ve sık sık başarısız olan bağlantı kurma yolları (STUN/ICE, certhash rotasyonu) ekliyor, WebSocket ise doğrudan ve güvenilir. Blogun P2P durum panelindeki her canlı eş "Secure WebSocket" gösteriyor. Süzgeç `node_modules` içinde yaşadığından depoda buna dair hiçbir ipucu yok.
- **Etki:** Teknik olarak makul ama yanlış bir herkese açık metin yazmak çok kolay — örneğin Bitsocial tarayıcı P2P'sini mümkün kılan şeyin, WebTransport'un Mart 2026'da tarayıcı Baseline'ına ulaşması olduğunu söylemek gibi. Bu iddia, geliştirici fark etmeden önce açılış sayfasına, karşılaştırma tablosuna ve iki belge sayfasına kadar girdi. Herkese açık sayfalardaki yanlış mimari iddialar, tam da sitenin hedeflediği geliştirici kitlesi tarafından denetlenir.
- **Önlem:** Bitsocial'ın hangi taşıma katmanlarını kullandığını asla libp2p'nin veya tarayıcı platformunun ilkesel olarak neyi desteklediğinden çıkarsamayın. Güncel ret listesi için `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` dosyasına bakın, `about/src/` altında bir `connectionGater` geçersiz kılması bulunmadığını doğrulayın ve herkese açık herhangi bir iddiada bulunmadan önce blogun "P2P status" panelindeki canlı taşıma etiketlerini okuyun. Tarayıcıdan yayımlamanın önünü asıl açan üst kaynak değişikliği, `@libp2p/gossipsub` 15.0.21 sürümündeki gossipsub monotonik seqno düzeltmesiydi (Mayıs 2026); pkc-js şu anda 16.0.4 ile geliyor.
- **Durum:** onaylandı

### Çevrilmemiş bir belge sayfasındaki göreli `./page.md` bağlantıları her yerelleştirilmiş derlemeyi bozar

- **Tarih:** 2026-08-02
- **Gözlemleyen:** Claude
- **Bağlam:** Mevcut belgelere `./peer-to-peer-protocol.md` ve `./apps/5chan.md` ile bağlanan, yalnızca İngilizce yeni bir `docs/browser-p2p.md` sayfası eklemek
- **Şaşırtıcı olan:** `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` altındaki her yerel ayar, belge ağacını yansıtır. Bu yansılarda bulunmayan yeni bir sayfa, İngilizce yedeği sayesinde yine de her yerel ayarda görüntülenir, ancak göreli markdown bağlantıları artık çözümlenmez — Docusaurus `/ar/browser-p2p/peer-to-peer-protocol.md/` üretir ve derlemeyi "Docusaurus found broken links!" hatasıyla düşürür. En önemlisi, `yarn build:verify` ve `yarn docs:build:verify` yalnızca `en` derler ve sorunsuz geçer; sorunu ancak tam bir `yarn docs:build` ortaya çıkarır ve bu da alfabetik olarak ilk yerel ayarda (`ar`) durur.
- **Etki:** Bir belge değişikliği tüm hızlı yerel kontrollerden geçip yine de üretimdeki çok dilli derlemeyi bozabilir. Ayrıca hata, yazarın hiç dokunmadığı bir yerel ayar yolunu adlandırdığı için değişiklikle ilgisizmiş gibi görünür.
- **Önlem:** `docs/i18n/**` içine yansıtılmayan her belge sayfasında, göreli `.md` bağlantıları yerine köke göreli bağlantılar (`/peer-to-peer-protocol/`, `/apps/5chan/`) kullanın; Docusaurus bunların başına yerel ayarı kendiliğinden ekler. Mevcut örnek `docs/build-your-own-client.md` dosyasıdır. Bir belge sayfası ekleyen ya da böyle bir sayfaya bağlantı veren her değişikliği teslim etmeden önce, yalnızca `build:verify` değil tam bir `yarn docs:build` çalıştırın.
- **Durum:** onaylandı

### Eşzamanlı `update-translations.js` çalıştırmaları anahtarları sessizce kaybeder

- **Tarih:** 2026-08-02
- **Gözlemleyen:** Claude
- **Bağlam:** `translate` becerisi aracılığıyla 26 çevrilmiş i18next anahtarının 36 yerel ayarın tamamına uygulanması
- **Şaşırtıcı olan:** Her çağrı 36 yerel ayar dosyasının tamamı üzerinde bir oku-değiştir-yaz döngüsü olduğundan, aynı anda çalışan iki çağrı birbirinin üzerine yazıyor ve bir anahtar hiçbir hata vermeden kayboluyor. `translate` becerisi ise aynı anda 4 alt ajana kadar üretmeyi açıkça söylüyor ve bunların her biri betiği çağıracaktı.
- **Etki:** Sessizce başarısız oluyor: anahtarlar rastgele yerel ayarlardan kayboluyor ve diff yine de makul görünüyor.
- **Önlem:** Çevirmen alt ajanların yerel ayar dosyalarını eşzamanlı olarak yazmasına asla izin vermeyin — yalnızca sözlük JSON dosyaları üretsinler, ardından her anahtarı üst ajandan sırayla uygulayın. Uyguladıktan sonra, her anahtarın İngilizce dışındaki 35 yerel ayarın tamamında bulunduğunu ve hiçbir değerin İngilizce kaynakla bayt bayt aynı olmadığını programatik olarak doğrulayın.
- **Durum:** onaylandı
- **Güncelleme (2026-08-10):** Betik eskiden ayrıca hedefini `path.join(process.cwd(), "public", "translations")` olarak çözümlüyordu; bu yüzden belgelenen depo kökü komutu "Translations directory not found" hatasıyla başarısız oluyor ve komutun `about/` dizininden çalıştırılması gerekiyordu. Betik artık çalışma alanını geçerli dizinden veya kendi konumundan çözümlüyor ve her yerden çalışıyor. Yukarıdaki eşzamanlılık tuzağı değişmedi.

### Geliştirme ortamındaki açıklama ekleme kontrolleri, otomasyonla yapılan tıklamaları yakalayabilir

- **Bağlam:** About ve chain sitelerinin sağ alt köşesinde, geliştirme ortamında Agentation araç çubuğunun da göründüğü yerde sabit kontroller bulunuyor.
- **Önlem:** `scripts/pw-session.sh open`, sayfayı yeniden yüklemeden önce `window.__NO_DEV_TOOLBAR__ = true` değerini kaydeder. Agentation başlatıcısı `__VISUAL_TESTING__` ve `__PROFILING__` bayraklarını da dikkate alır; kaynak inceleme bundan bağımsız olarak kullanılabilir kalır. Doğrudan tarayıcı otomasyonu, uygulamayı yüklemeden önce aynı bayrağı ayarlamalıdır.

### `skills add`, Codex ve Cursor kopyalarını gitignore ile yok sayılan `.agents/` dizinine kurar

- **Tarih:** 2026-08-18
- **Gözlemleyen:** Tommaso + Claude
- **Bağlam:** `improve-threejs` becerisinin `millionco/react-doctor` deposundan `skills` CLI'ı (`vercel-labs/skills`) ile kurulması.
- **Şaşırtıcı olan:** `npx skills add <repo> --skill <name> --agent codex` ve `--agent cursor` komutlarının ikisi de `.codex/skills/` veya `.cursor/skills/` yerine `.agents/skills/<name>/` dizinine yazıyor. `AGENTS.md` depo düzeyinde bir `.agents/` dizinini yasaklıyor ve `.gitignore:29` bu dizini yok sayıyor; bu yüzden iki kopya da sessizce takip dışı kalıyor. Beklenen `.claude/skills/` dizinine yalnızca `--agent claude-code` yazıyor. Ayrıca belgelenen virgülle ayrılmış biçim (`--agent claude-code,codex,cursor`), her ad tek başına geçerli olsa da "Invalid agents" hatasıyla başarısız oluyor ve hiçbir şey kurmuyor.
- **Etki:** Kurulum başarılı olduğunu bildirirken üç araç zinciri kopyasından ikisi hiçbir zaman işlenmeyecek bir yere düşüyor; bu yüzden yeni bir klonlamadan sonra Codex ve Cursor'da beceri sessizce eksik kalıyor. Virgüllü biçim de başarılı gibi görünen ama hiçbir şey yapmayan bir kurulum üretebiliyor.
- **Güncel önlem:** Depo artık `.agents/skills` dizinini kanonik kaynağı olarak takip ediyor ve Claude kopyalarını `yarn ai-workflow:sync` ile üretiyor. Eski `.agents` yasağı ve yok sayma kuralı kaldırıldı. Yeni becerileri birbirinden bağımsız üç köke kopyalamayın; bir beceri ekledikten sonra üretilen kopyaların denkliğini ve uygulama kataloğunu kontrol edin.
- **Durum:** onaylandı
