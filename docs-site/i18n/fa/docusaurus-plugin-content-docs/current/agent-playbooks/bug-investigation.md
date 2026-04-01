# گردش کار بررسی اشکال

هنگامی که یک اشکال در یک بلوک فایل/خط/کد خاص گزارش می شود از این استفاده کنید.

## مرحله اول اجباری

قبل از ویرایش، تاریخچه git را برای کد مربوطه بررسی کنید. مشارکت‌کنندگان قبلی ممکن است رفتاری را برای یک مورد لبه/راه‌حل معرفی کرده باشند.

## گردش کار

1. اسکن عناوین commit اخیر (فقط عناوین) برای فایل/منطقه:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. فقط تعهدات مرتبط با تفاوت های محدوده را بررسی کنید:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. بازتولید را ادامه دهید و پس از درک بافت تاریخ، اصلاح کنید.

## قانون عیب یابی

وقتی مسدود شد، وب را برای رفع/راهکارهای اخیر جستجو کنید.
