# Uzun Süreli Temsilci İş Akışı

Bir görevin birden fazla oturumu, aktarımı veya ortaya çıkan aracıları kapsaması muhtemel olduğunda bu başucu kitabını kullanın.

## Hedefler

- Her yeni oturuma bağlamı yeniden kazanmanın hızlı bir yolunu verin
- Tek seferde büyük bir değişiklik yapmak yerine çalışmayı aşamalı olarak sürdürün
- Daha fazla kod eklemeden önce bozuk bir yerel taban çizgisini yakalayın
- Bir sonraki oturumun güvenebileceği dayanıklı eserler bırakın

## Devlet Nerede Tutulmalı

- İnsanlar, inceleme botları veya birden fazla araç zinciri aynı görev durumuna ihtiyaç duyduğunda `docs/agent-runs/<slug>/` kullanın.
- `.codex/runs/<slug>/` gibi bir araç yerel dizinini yalnızca görev durumu kasıtlı olarak bir iş istasyonuna veya bir araç zincirine yerel olduğunda kullanın.
- Başka bir katılımcının veya aracının daha sonra ihtiyaç duyması halinde, çok oturumlu paylaşılan durumu özel bir karalama dosyasında gizlemeyin.

## Gerekli Dosyalar

Uzun süren görevin başlangıcında bu dosyaları oluşturun:

- `feature-list.json`
- `progress.md`

`docs/agent-playbooks/templates/feature-list.template.json` ve `docs/agent-playbooks/templates/progress.template.md` içindeki şablonları kullanın.

Özellik listesi için JSON'u tercih edin, böylece aracılar belgenin tamamını yeniden yazmaya gerek kalmadan az sayıda alanı güncelleyebilir.

## Oturum Başlatma Kontrol Listesi

1. `pwd`'yu çalıştırın.
2. `progress.md`'yu okuyun.
3. `feature-list.json`'yu okuyun.
4. `git log --oneline -20`'yu çalıştırın.
5. `./scripts/agent-init.sh --smoke`'yu çalıştırın.
6. Hala `pending`, `in_progress` veya `blocked` olan tam olarak en yüksek öncelikli öğeyi seçin.

Duman adımı başarısız olursa yeni bir özellik dilimini uygulamadan önce bozuk taban çizgisini düzeltin.

## Oturum Kuralları

- Aynı anda tek bir özellik veya görev dilimi üzerinde çalışın.
- Özellik listesini makine tarafından okunabilir ve sabit tutun. İlgisiz öğeleri yeniden yazmak yerine durumu, notları, dosyaları ve doğrulama alanlarını güncelleyin.
- Bir öğeyi yalnızca o öğede listelenen komutu veya kullanıcı akışını çalıştırdıktan sonra doğrulanmış olarak işaretleyin.
- Oluşturulan aracıları genel görev durumu sahipliği için değil, sınırlı dilimler için kullanın.
- Bir alt temsilci bir öğeye sahip olduğunda, ona tam öğe kimliğini, kabul kriterlerini ve dokunabileceği dosyaları verin.

## Oturum Sonu Kontrol Listesi

1. `progress.md`'ya kısa bir ilerleme girişi ekleyin.
2. `feature-list.json`'da dokunulan öğeyi güncelleyin.
3. Doğrulama için çalıştırılan komutların tamamını kaydedin.
4. Engelleyicileri, takipleri ve devam ettirilecek bir sonraki en iyi öğeyi yakalayın.

## Önerilen İlerleme Giriş Şekli

Aşağıdaki gibi kısa bir yapı kullanın:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
