# Agent Hooks Setup

اگر دستیار کدنویسی هوش مصنوعی شما از قلاب‌های چرخه حیات پشتیبانی می‌کند، آن‌ها را برای این مخزن پیکربندی کنید.

## قلاب های توصیه شده

| قلاب            | فرمان                                      | هدف                                                                                                                                                                                |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | فرمت خودکار فایل ها پس از ویرایش های هوش مصنوعی                                                                                                                                    |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | اجرای `corepack yarn install` زمانی که `package.json` تغییر می کند                                                                                                                 |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | موارد قدیمی را هرس کنید و شاخه های وظیفه موقت یکپارچه را حذف کنید                                                                                                                  |
| `stop`          | `scripts/agent-hooks/verify.sh`            | ساخت هارد گیت، پرز، تایپ چک و بررسی فرمت. `yarn npm audit` را اطلاعاتی نگه دارید و `yarn knip` را به صورت جداگانه به عنوان ممیزی مشاوره در هنگام تغییر وابستگی ها/واردات اجرا کنید |

## چرا

- قالب بندی ثابت
- Lockfile همگام می ماند
- مشکلات ساخت/پرز/نوع زودهنگام کشف شد
- قابلیت مشاهده امنیتی از طریق `yarn npm audit`
- دریفت وابستگی/واردات را می توان با `yarn knip` بدون تبدیل آن به یک قلاب توقف سراسری پر سر و صدا بررسی کرد.
- اجرای یک قلاب مشترک برای Codex و Cursor
- شاخه های وظیفه موقت با گردش کار درخت کاری مخزن هماهنگ می مانند

## نمونه اسکریپت های هوک

### قالب بندی قلاب

```bash
#!/bin/bash
# فرمت خودکار فایل های JS/TS پس از ویرایش های AI
# هوک JSON را از طریق stdin با file_path دریافت می کند

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### هوک را تأیید کنید

```bash
#!/bin/bash
# هنگامی که Agent تمام شد، build، lint، typecheck، چک فرمت و ممیزی امنیتی را اجرا کنید

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

به طور پیش‌فرض، `scripts/agent-hooks/verify.sh` زمانی که چک مورد نیاز ناموفق بود، غیر صفر خارج می‌شود. تنها زمانی `AGENT_VERIFY_MODE=advisory` را تنظیم کنید که عمداً به سیگنال درخت شکسته نیاز داشته باشید بدون اینکه قلاب را مسدود کنید. `yarn knip` را خارج از گیت سخت نگه دارید، مگر اینکه مخزن صراحتاً تصمیم به شکست در مسائل مربوط به واردات/وابستگی مشاوره ای داشته باشد.

### قلاب نصب نخ

```bash
#!/bin/bash
# هنگامی که package.json تغییر کرد، corepack yarn install را اجرا کنید
# هوک JSON را از طریق stdin با file_path دریافت می کند

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

سیم کشی قلاب را با توجه به اسناد ابزار عامل خود (`hooks.json`، معادل و غیره) پیکربندی کنید.

در این مخزن، `.codex/hooks/*.sh` و `.cursor/hooks/*.sh` باید به عنوان بسته‌بندی نازک باقی بمانند که به پیاده‌سازی‌های مشترک زیر `scripts/agent-hooks/` واگذار می‌شوند.
