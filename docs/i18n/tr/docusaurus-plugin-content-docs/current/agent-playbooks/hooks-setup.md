# Ajan kancaları

Depoya işlenmiş yaşam döngüsü kancaları yalnızca başarıyla düzenlenmiş JavaScript/TypeScript dosyalarını kurulu oxfmt aracılığıyla biçimlendirir. Ortak mantık `scripts/agent-hooks/format.mjs` içinde bulunur; her uygulamanın yerleşik sarmalayıcısı işi bu dosyaya devreder.

| Uygulama | Yerleşik yapılandırma | Olay |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude bağımsız bir `.claude/hooks.json` dosyasını okumaz. Proje güvenini ve kancaların etkin olup olmadığını yine her uygulama kendisi denetler; güveni atlatmak yerine uygulamanın mevcut ayarlarını inceleyin. `.codex/config.toml` bir kanca komutu kayıt defteri değil, depo yapılandırmasıdır.

Biçimlendirici olayı/yükü, düzenlemenin başarılı olup olmadığını, dosya uzantısını ve sembolik bağlantılar dâhil dosyanın depo içinde kalıp kalmadığını doğrular. Bağımlılıklar eksikse veya girdi ilgisizse hiçbir iş yapılmaz. Komutlar, Corepack ağ erişimi devre dışı bırakılmış bir argüman dizisi kullanır; kancalar bağımlılık kurmaz, derleme/inceleme çalıştırmaz ve Git'te değişiklik yapmaz.

Kontrolleri [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) belgesine göre açıkça çalıştırın. İş akışını değiştirdikten sonra `yarn ai-workflow:sync`, `yarn ai-workflow:check` ve `yarn ai-workflow:test` komutlarını çalıştırın. Fixture'lar geçici dosyalar ve sahte biçimlendirici çağrıları kullanır; her uygulamanın kendi yapılandırmasını yüklediğini kanıtlamaz. Yükseltmelerden sonra uygulamayı yeniden yükleyin ve uygulama kataloğunu inceleyin.

Impeccable tasarım becerisi ve çalıştırılabilir yardımcıları, `.agents/skills/impeccable` altında istendiğinde kullanılabilir olmayı sürdürür. Becerinin eski Codex kancası var olmayan bir dizine işaret ediyordu; tasarım iş akışı artık her zaman açık bir tasarım kancası olmadan, beceri seçildiğinde çalışır. Beceri, proje kancalarını bir tasarım işinin yan adımı olarak yeniden yapılandırmamalıdır.
