# Beceriler ve Araçlar

Paylaşılan beceriler `.agents/skills/` içinde bulunur. Bu kaynakları düzenleyin, ardından Claude Code için `.claude/skills/` dizinini üretmek üzere `yarn ai-workflow:sync` komutunu çalıştırın. Codex ve Cursor `.agents/skills/` dizinini doğrudan keşfeder; yinelenen `.codex/skills/` veya `.cursor/skills/` köklerini geri getirmeyin.

Paylaşılan rol istemleri `.agents/roles/*.md` içinde bulunur. Bu, uygulamaların yerleşik olarak tanıdığı bir ajan keşif yolu değil, depoya özgü bir kaynak biçimidir. `scripts/ai-workflow-files.mjs` bu kaynakları aşağıdaki uygulamaya özgü dosyalara dönüştürür; `yarn ai-workflow:sync` bunları yazar. Yeni bir çalışma kopyasının önce bir üreteç çalıştırmaya gerek kalmadan yerleşik yapılandırmaya sahip olması için üretilen dosyaları kaynaklarıyla birlikte işleyin. Bir kaynağı kaldırdıktan sonra, ondan üretilmiş ve artık kullanılmayan çıktıları açıkça kaldırın; doğrulayıcı dosyaları sessizce silmek yerine bunları raporlar.

## Yerleşik keşif yolları

2026-09-12 tarihinde resmî belgelere göre doğrulandı:

| Uygulama    | Proje talimatları                                                                                     | Bu deponun kullandığı beceriler           | Bu deponun kullandığı özel ajanlar   |
| ----------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------ |
| Codex       | `AGENTS.md`                                                                                           | `.agents/skills/<name>/SKILL.md`          | Üretilen `.codex/agents/<name>.toml` |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` Cursor'a özgü koşullu kurallar için kullanılabilir olmayı sürdürür | `.agents/skills/<name>/SKILL.md`          | Üretilen `.cursor/agents/<name>.md`  |
| Claude Code | `CLAUDE.md`, `@AGENTS.md` dosyasını içe aktarır                                                       | Üretilen `.claude/skills/<name>/SKILL.md` | Üretilen `.claude/agents/<name>.md`  |

Kaynaklar: [Codex becerileri](https://learn.chatgpt.com/docs/build-skills), [Codex alt ajanları](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor kuralları](https://cursor.com/docs/rules), [Cursor becerileri](https://cursor.com/docs/skills), [Cursor alt ajanları](https://cursor.com/docs/subagents), [Claude belleği](https://code.claude.com/docs/en/memory), [Claude becerileri](https://code.claude.com/docs/en/skills), [Claude alt ajanları](https://code.claude.com/docs/en/sub-agents).

Yerleşik ajan dizinlerinin yerine `.agents/roles` kullanmayın ve Claude'un `.agents/skills` dizinini keşfettiğini varsaymayın. Claude orada başvurulan bir dosyayı yine de sıradan proje bağlamı olarak okuyabilir. Cursor uyumluluk için `.claude/skills` dizinini de keşfeder; kopyalar eşitlenmiş kalır, ancak Cursor'ın yayımlanmış beceri kılavuzu bu kökler arasında yinelenen girdilerin nasıl ayıklandığını belirtmez. Yinelenen girdilerin görünmeyeceğini vaat etmek yerine kurulu uygulamanın beceri kataloğunu kontrol edin.

Yapay zekâ dizinleri, üretilen metin platformlar arasında aynı kalsın diye `.gitattributes` aracılığıyla LF satır sonları kullanır. Becerilere ait destekleyici varlıklar bayt bayt kopyalanır.

## Beceriler

| Beceri                               | Amaç                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Yetkilendirilmiş, kapsamı belirli yerel işlemeler oluşturur                                                   |
| `commit-format`, `issue-format`      | İstendiğinde biçim önerileri sunar                                                                            |
| `make-closed-issue`                  | Yetkilendirilmiş bir sorun kaydı, kapsamı belirli bir işleme ve PR oluşturur                                  |
| `review-and-merge-pr`                | PR geri bildirimlerini önceliklendirir; yalnızca istenen kapsam içinde düzeltir/yayımlar/birleştirir          |
| `fix-merge-conflicts`                | Çakışmaları çözer ve birleştirilmiş sonucu doğrular                                                           |
| `release`                            | Sürüm metnini hazırlar ve yetkilendirilmiş sürüm adımlarını uygular                                           |
| `code-quality-review`                | Önemsiz olmayan diff'leri veya açıkça istenen bir kalite endişesini inceler                                   |
| `retro`                              | Kanıtlanmış hataları, tekrarlanmalarını önleyen odaklı kontrollere veya yönergelere dönüştürür                |
| `refactor-pass`, `deslop`            | Mevcut değişikliklerde istenen temizlik                                                                       |
| `debug-agent`                        | Kanıta dayalı hata ayıklama; gerektiğinde enstrümantasyonla                                                   |
| `you-might-not-need-an-effect`       | Odaklı efekt/memo incelemesi                                                                                  |
| `vercel-react-best-practices`        | Uygulanabilir React performans rehberliği; bu Vite istemcisi için Next.js/yalnızca sunucu kurallarını atlayın |
| `translate`                          | Çeviriler üretir, ardından haritaları tek bir yazıcı üzerinden uygular                                        |
| `playwright-cli`, `inspect-elements` | Tarayıcı doğrulaması ve DOM'dan kaynağa eşleme                                                                |
| `profile-browsing`                   | Kapsamı belirli tarayıcı ve React profillemesi                                                                |
| `test-apk`                           | Sağlanan eşlikçi Android sarmalayıcısını doğrular                                                             |
| `impeccable`, `improve-threejs`      | Kapsamı belirli arayüz tasarımı ve Three.js render incelemesi                                                 |
| `implement-plan`                     | İsteğe bağlı, sınırlı yetki devriyle bir planı uygular                                                        |
| `readme`                             | Doğrulanmış proje belgelerinin bakımını yapar                                                                 |
| `context7`                           | Sürüme uygun kütüphane belgelerini getirir                                                                    |
| `find-skills`                        | Açıkça istendiğinde ek beceriler bulur                                                                        |

## Roller ve modeller

`browser-check`, `profiler`, `test-apk`, `translator` ve `reviewer` için özel rolleri koruyun. Sıradan uygulama geliştirme ve kod keşfi işleri için çalıştırma ortamının yerleşik worker/general-purpose veya explorer rolünü kullanın. Kabul ölçütlerini ve sahipliği üst ajan belirler; ağır kontrolleri tek bir sahip çalıştırır.

Codex ajan dosyaları `name`, `description` ve `developer_instructions` alanlarını içerir. `.codex/config.toml`, `max_concurrent_threads_per_session` ile eşzamanlı alt ajan sayısını dörtle sınırlar. Paylaşılan rol meta verisi adı, açıklamayı ve isteğe bağlı korumalı alan modunu içerir; bilerek hiçbir model alanı içermez.

Üç uygulamanın hiçbirinde model ve akıl yürütme alanlarını depoya işlenmiş becerilere ve özel ajanlara eklemeyin. Bu, her uygulamanın belgelenmiş öncelik sırasına göre çalışma zamanındaki çağrı tercihlerine, kullanıcı varsayılanlarına ve üst ajandan devralmaya olanak tanır. Claude aile takma adları sürüm bakımını azaltır ama yine de bir aile seçer; sürümlü bir Cursor modeli ise ileride güncelleme gerektirir. Gerektiğinde bu tür seçimleri kullanıcı/oturum ayarlarında tutun. Devralma, mevcut en iyi modelin otomatik olarak seçileceğini vaat etmez. Bir `latest` takma adı uydurmayın veya rutin görevlere model kataloğu araştırması eklemeyin. Bkz. [Codex seçimi](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Claude seçimi](https://code.claude.com/docs/en/sub-agents#choose-a-model) ve [Cursor seçimi](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only`, Codex'in korumalı alanına ve Cursor'ın `readonly` ayarına eşlenir; Claude'un araç listesi ve rol talimatları onun inceleme iş akışını kısıtlar, ancak Bash erişimi işletim sistemi düzeyinde bir korumalı alan değildir.

Paylaşılan beceri frontmatter'ı, uygun olduğu yerlerde kullanıcı tarafından çağrılan iş akışları için `disable-model-invocation: true` kullanır. Codex'teki karşılığı olan ayar `agents/openai.yaml` içinde `policy.allow_implicit_invocation: false` olarak bulunur; doğrulayıcı ikisini de zorunlu tutar. Çağrı meta verisi açık yetkilendirme kurallarını tamamlar; bir inceleme isteği, yalnızca bir beceri yayımlama adımları içerdiği için asla yayımlamaya yetki vermez.

## Kontroller ve keşif

- `yarn ai-workflow:sync`, kurulu `js-yaml` ve `smol-toml` paketlerini kullanarak uyumluluk çıktılarını yeniden üretir.
- `yarn ai-workflow:check` kaynakları/frontmatter'ı/yapılandırmaları ayrıştırır; üretilen çıktıları, çağrı meta verisini, model alanlarının yerleşimini ve yalnızca biçimlendirme yapan kanca bağlantısını kontrol eder. Model tanımlayıcılarını bir sağlayıcı kataloğuna göre çözümlemez.
- `yarn ai-workflow:test`, kanca yükleri ve iş akışı üretimi/doğrulaması için yalıtılmış Node fixture'larını çalıştırır.
- Bir ajan uygulamasını yükselttikten sonra beceri/rol keşfini o uygulamada doğrulayın. Sözdizimi/denklik kontrolleri bir yükleyici kontrolünün yerini tutmaz. Mevcut bir oturum eski kataloğu tutuyorsa uygulamayı yeniden yükleyin.
- Kancalar, çalıştırma ortamının proje güvenini ve kanca incelemesini gerektirir; bir kontrolü geçirmek için güveni atlatmayın. Bkz. [hooks-setup.md](hooks-setup.md).

## Yararlı talimatları sürdürmek

[OpenAI'ın beceriler ve istemler rehberini](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (2026-09-12'de incelendi) izleyin: açıklamaları kesin tutun, ayrıntıları yalnızca ilgili olduklarında yükleyin ve kullanıcının istediği kapsamı koruyun. Paylaşılan beceriler farklı modellere hizmet eder; rutin uygulama seçimlerine izin verirken projeye özgü değişmezleri koruyun.

Bir becerinin amacını, karar sınırlarını ve temel kısıtlarını `SKILL.md` içinde tutun. Kapsamlı, moda özgü komutları veya örnekleri isteğe bağlı başvurular olarak bağlayın. Kısa açıklamalarda tetikleme koşullarını başa koyun; eşleşen bir anahtar sözcük tek başına görevi genişletmemelidir. Davranışı bilinçli olarak değiştirilmedikçe mevcut çağrı meta verisini koruyun.

Kapsamlı bir talimat değişikliğinden sonra birkaç temsili küçük ve büyük isteği deneyin. Hangi becerilerin/başvuruların seçildiğini, eylemlerin kapsam içinde kalıp kalmadığını, doğrulamanın değişiklikle örtüşüp örtüşmediğini ve yetkilendirilmiş işin tamamlanıp tamamlanmadığını kontrol edin. Şema ve fixture testleri araçların doğruluğunu ortaya koyar, ajanın karar kalitesini değil.

## Araçlar ve tarayıcı sahipliği

Mevcut beceri/araç kataloğunu ve kurulu proje CLI'larını tercih edin. GitHub için `gh`, tarayıcı doğrulaması için `playwright-cli`, kütüphane davranışı önemli olduğunda da resmî/sürüme özgü belgeleri kullanın. Yinelenen beceriler kurmaktan veya yalnızca mevcut bir biçimlendiriciyi çalıştırmak için sabitlenmemiş bir paket indirmekten kaçının.

MCP yükü çalıştırma ortamına bağlıdır: ertelenmiş araç yükleme, her şemanın baştan yüklenmesini önleyebilir. MCP'yi başlı başına modası geçmiş saymak yerine entegrasyonları ilgili olanlarla sınırlı tutun. Mevcut CLI tercihleri yeniden üretilebilirlik ve kaynak denetimi açısından yararlı olmayı sürdürür.

Tüm tarayıcı oturumları, makine genelinde tek bir etkin tarayıcıyı zorunlu kılan `./scripts/pw-session.sh` betiğini kullanır. Varsayılan olarak yeni ve yalıtılmış bir oturum açın. Kullanıcının mevcut kişisel tarayıcısına erişim açık yetkilendirme gerektirir; bu yetkilendirmeyi sonraki adımlarda yeniden kullanın. Tarayıcıları/görüntü alanlarını etkilenen davranışa göre seçin, seçilen motorları sırayla çalıştırın, temizlik sırasında tam adıyla belirtilen oturumu kapatın ve asla `close-all`/`kill-all` kullanmayın. Bkz. `playwright-cli` becerisi ve [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
