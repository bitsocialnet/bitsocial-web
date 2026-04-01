# ایجنٹ ہکس سیٹ اپ

اگر آپ کا AI کوڈنگ اسسٹنٹ لائف سائیکل ہکس کو سپورٹ کرتا ہے تو اسے اس ریپو کے لیے ترتیب دیں۔

## تجویز کردہ ہکس

| ہک              | کمانڈ                                      | مقصد                                                                                                                                                                      |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI ترمیم کے بعد فائلوں کو آٹو فارمیٹ کریں                                                                                                                                 |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json` تبدیل ہونے پر `corepack yarn install` چلائیں                                                                                                               |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | باسی ریف کو کاٹیں اور مربوط عارضی ٹاسک برانچز کو حذف کریں                                                                                                                 |
| `stop`          | `scripts/agent-hooks/verify.sh`            | ہارڈ گیٹ کی تعمیر، لنٹ، ٹائپ چیک، اور فارمیٹ چیک؛ `yarn npm audit` کو معلوماتی رکھیں اور `yarn knip` کو الگ سے ایڈوائزری آڈٹ کے طور پر چلائیں جب انحصار/درآمدات تبدیل ہوں |

## کیوں

- مستقل فارمیٹنگ
- لاک فائل مطابقت پذیری میں رہتی ہے
- Build/lint/type کے مسائل جلد پکڑے گئے
- `yarn npm audit`
- انحصار/درآمد بڑھے کے ذریعے `yarn knip` کو عالمی سطح پر روکے بغیر چیک کیا جا سکتا ہے hook
- کوڈیکس اور کرسر دونوں کے لیے ایک مشترکہ ہک کا نفاذ
- عارضی ٹاسک برانچز ریپو کے ورک ٹری ورک فلو کے ساتھ منسلک رہتی ہیں

## Example Hook Scripts

### Format Hook

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

### Verify Hook

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

بطور ڈیفالٹ، `scripts/agent-hooks/verify.sh` غیر ضروری چیک سے باہر ہونے پر۔ `AGENT_VERIFY_MODE=advisory` صرف اس وقت سیٹ کریں جب آپ کو ہک کو بلاک کیے بغیر کسی ٹوٹے ہوئے درخت سے جان بوجھ کر سگنل کی ضرورت ہو۔ `yarn knip` کو سخت دروازے سے باہر رکھیں جب تک کہ ریپو واضح طور پر ایڈوائزری امپورٹ/انحصار کے مسائل پر ناکام ہونے کا فیصلہ نہ کرے۔

### یارن انسٹال ہک

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

اپنے ایجنٹ ٹول دستاویزات (`hooks.json`، مساوی، وغیرہ) کے مطابق ہک کی وائرنگ کو ترتیب دیں۔

اس ریپو میں، `.codex/hooks/*.sh` اور `.cursor/hooks/*.sh` کو مشترکہ طور پر لاگو کرنے کے عمل کے تحت رہنا چاہیے۔ `scripts/agent-hooks/`۔
