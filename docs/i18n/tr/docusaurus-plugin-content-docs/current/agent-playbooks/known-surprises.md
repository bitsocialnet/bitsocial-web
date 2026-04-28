# Bilinen Sürprizler

Bu dosya, aracı hatalarına neden olan depoya özgü karışıklık noktalarını izler.

## Giriş Kriterleri

Yalnızca tümü doğruysa bir giriş ekleyin:

- Bu depoya özeldir (genel tavsiye değildir).
- Gelecekteki ajanlar için tekrarlanması muhtemeldir.
- Takip edilebilecek somut bir hafifletme vardır.

Emin değilseniz, bir giriş eklemeden önce geliştiriciye sorun.

## Giriş Şablonu

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

## Girişler

### Portless, standart yerel uygulama URL'sini değiştirir

- **Tarih:** 2026-03-18
- **Gözleyen:** Kodeks
- **Bağlam:** Tarayıcı doğrulaması ve duman akışları
- **Şaşırtıcı olan şey:** Varsayılan yerel URL, olağan Vite bağlantı noktası değil. Depo, Portless aracılığıyla `https://bitsocial.localhost`'yu bekliyor, bu nedenle `localhost:3000` veya `localhost:5173`'yu kontrol etmek yanlış uygulamaya rastlayabilir veya hiçbir şey yapmayabilir.
- **Etki:** Geliştirici sunucusu sağlıklı olsa bile tarayıcı kontrolleri başarısız olabilir veya yanlış hedefi doğrulayabilir.
- **Azaltma:** Önce `https://bitsocial.localhost` kullanın. Doğrudan bir Vite bağlantı noktasına açıkça ihtiyaç duyduğunuzda bunu yalnızca `PORTLESS=0 corepack yarn start` ile atlayın.
- **Durum:** onaylandı

### Taahhüt kancaları etkileşimli olmayan taahhütleri engeller

- **Tarih:** 2026-03-18
- **Gözleyen:** Kodeks
- **Bağlam:** Aracı odaklı işleme iş akışları
- **Şaşırtıcı olan şey:** `git commit`, Husky aracılığıyla Commitizen'i tetikler ve etkileşimli olmayan aracı kabuklarını kapatan etkileşimli TTY girişini bekler.
- **Etki:** Aracılar normal bir taahhüt sırasında süresiz olarak oyalanabilir.
- **Azaltma:** Aracı tarafından oluşturulan taahhütler için `git commit --no-verify -m "message"` kullanın. İnsanlar hala `corepack yarn commit` veya `corepack yarn exec cz` kullanabilir.
- **Durum:** onaylandı

### Yarn classic'ten kaçınmak için Corepack gereklidir

- **Tarih:** 2026-03-19
- **Gözleyen:** Kodeks
- **Bağlam:** Paket yöneticisinin Yarn 4'e geçişi
- **Şaşırtıcı olan şey:** Makinede hâlâ `PATH` üzerinde genel bir Yarn classic kurulumu bulunuyor, bu nedenle `yarn`'nun düz çalıştırılması, sabitlenmiş Yarn 4 sürümü yerine v1'e çözülebilir.
- **Etki:** Geliştiriciler yanlışlıkla deponun paket yöneticisi sabitlemesini atlayabilir ve farklı yükleme davranışı veya kilit dosyası çıktısı alabilir.
- **Azaltma:** Kabuk komutları için `corepack yarn ...` kullanın veya önce `corepack enable` komutunu çalıştırın, böylece düz `yarn` sabitlenmiş Yarn 4 sürümüne çözümlenir.
- **Durum:** onaylandı

### Portless uygulama adlarının Bitsocial Web çalışma ağaçlarında çakışması düzeltildi

- **Tarih:** 2026-03-30
- **Gözleyen:** Kodeks
- **Bağlam:** Başka bir çalışma ağacı zaten Portless üzerinden hizmet veriyorken `yarn start`'yu bir Bitsocial Web çalışma ağacında başlatmak
- **Şaşırtıcı olan şey:** Her çalışma ağacında gerçek Portless uygulama adının `bitsocial` kullanılması, destek bağlantı noktaları farklı olsa bile rotanın kendisinin çakışmasına neden olur ve `bitsocial.localhost` zaten kayıtlı olduğundan ikinci işlem başarısız olur.
- **Etki:** Portless'ın güvenli bir şekilde bir arada var olmalarına izin vermesi amaçlanmış olsa da Paralel Bitsosyal Web şubeleri birbirlerini engelleyebilir.
- **Azaltma:** Artık standart durumun dışında dal kapsamlı bir `*.bitsocial.localhost` rotası kullanan ve çıplak `bitsocial.localhost` adı zaten kullanıldığında dal kapsamlı bir rotaya geri dönen Portless başlatmayı `scripts/start-dev.mjs`'nun arkasında tutun.
- **Durum:** onaylandı

### Bağlantı noktası 3001'i sabit kodlamak için kullanılan Dokümanlar önizlemesi

- **Tarih:** 2026-03-30
- **Gözleyen:** Kodeks
- **Bağlam:** `yarn start`'yu diğer yerel depolar ve aracılarla birlikte çalıştırma
- **Şaşırtıcı olan şey:** Root dev komutu, docs çalışma alanını `docusaurus start --port 3001` ile çalıştırdı; bu nedenle, ana uygulama zaten Portless'ı kullanıyor olsa bile başka bir işlem zaten `3001`'ya sahip olduğunda tüm geliştirme oturumu başarısız oldu.
- **Etki:** `yarn start`, web işlemini başlatıldıktan hemen sonra sonlandırabilir ve dokümanlar-port çarpışması nedeniyle alakasız yerel işleri kesintiye uğratabilir.
- **Azaltma:** Dokümanların başlatılmasını artık Portless artı `scripts/start-docs.mjs` kullanan `yarn start:docs`'nun arkasında tutun; bu, eklenen boş bağlantı noktasını onurlandırmak veya doğrudan çalıştırıldığında bir sonraki kullanılabilir bağlantı noktasına geri dönmek için.
- **Durum:** onaylandı
