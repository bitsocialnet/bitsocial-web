# Ajan Kancaları Kurulumu

Yapay zeka kodlama yardımcınız yaşam döngüsü kancalarını destekliyorsa bunları bu depo için yapılandırın.

## Önerilen Kancalar

| Kanca           | Komut                                      | Amaç                                                                                                                                                                                                                                        |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI düzenlemelerinden sonra dosyaları otomatik olarak biçimlendirin                                                                                                                                                                          |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json` değiştiğinde `corepack yarn install`'yu çalıştırın                                                                                                                                                                           |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Eski referansları budayın ve entegre geçici görev dallarını silin                                                                                                                                                                           |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Sabit kapı oluşturma, tüy bırakmama, yazım denetimi ve format kontrolleri; `yarn npm audit`'yu bilgi amaçlı tutun ve bağımlılıklar/içe aktarmalar değiştiğinde `yarn knip`'yu tavsiye niteliğinde bir denetim olarak ayrı olarak çalıştırın |

## Neden

- Tutarlı biçimlendirme
- Kilit dosyası senkronize kalır
- Oluşturma/tüy bırakma/yazma sorunları erken yakalandı
- `yarn npm audit` aracılığıyla güvenlik görünürlüğü
- Bağımlılık/içe aktarma sapması `yarn knip` ile onu gürültülü bir küresel durdurma kancasına dönüştürmeden kontrol edilebilir
- Hem Codex hem de İmleç için tek bir paylaşılan kanca uygulaması
- Geçici görev dalları deponun iş ağacı iş akışıyla uyumlu kalır

## Örnek Kanca Komut Dosyaları

### Kancayı Biçimlendir

```bash
#!/bin/bash
# Auto-format JS/TS files after AI edits
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Kancayı Doğrula

```bash
#!/bin/bash
# Run build, lint, typecheck, format check, and security audit when agent finishes

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Varsayılan olarak `scripts/agent-hooks/verify.sh`, gerekli bir denetim başarısız olduğunda sıfırdan farklı olarak çıkar. `AGENT_VERIFY_MODE=advisory`'yu yalnızca kancayı engellemeden kırık bir ağaçtan kasıtlı olarak sinyal almanız gerektiğinde ayarlayın. Repo, tavsiye amaçlı içe aktarma/bağımlılık konularında açıkça başarısız olmaya karar vermedikçe, `yarn knip`'yu sabit kapının dışında tutun.

### İplik Takma Kancası

```bash
#!/bin/bash
# Run corepack yarn install when package.json is changed
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

Kanca kablolamasını aracı aracınızın belgelerine (`hooks.json`, eşdeğeri vb.) göre yapılandırın.

Bu depoda, `.codex/hooks/*.sh` ve `.cursor/hooks/*.sh`, `scripts/agent-hooks/` altındaki paylaşılan uygulamalara yetki veren ince sarmalayıcılar olarak kalmalıdır.
