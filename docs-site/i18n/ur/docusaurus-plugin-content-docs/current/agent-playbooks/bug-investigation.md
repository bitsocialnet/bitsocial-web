# بگ انویسٹی گیشن ورک فلو

اس کا استعمال اس وقت کریں جب کسی مخصوص فائل/لائن/کوڈ بلاک میں بگ کی اطلاع دی جائے۔

## لازمی پہلا قدم

ترمیم کرنے سے پہلے، متعلقہ کوڈ کے لیے گٹ ہسٹری چیک کریں۔ پچھلے شراکت داروں نے ایج کیس/ ورک آراؤنڈ کے لیے رویہ متعارف کرایا ہو گا۔

## ورک فلو

1. فائل/ایریا کے لیے حالیہ کمٹ ٹائٹلز (صرف ٹائٹلز) اسکین کریں:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. دائرہ کار کے فرق کے ساتھ صرف متعلقہ کمٹ کا معائنہ کریں:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. ری پروڈکشن کے ساتھ جاری رکھیں اور تاریخ کے سیاق و سباق کو سمجھنے کے بعد درست کریں۔

## خرابیوں کا سراغ لگانے کا اصول

مسدود ہونے پر، حالیہ اصلاحات/ کام کے حل کے لیے ویب پر تلاش کریں۔
