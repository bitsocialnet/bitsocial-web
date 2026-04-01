# זרימת עבודה של חקירת באגים

השתמש בזה כאשר מדווח על באג בקובץ/שורה/גוש קוד ספציפי.

## שלב ראשון חובה

לפני עריכה, בדוק את היסטוריית git עבור הקוד הרלוונטי. ייתכן שתורמים קודמים הציגו התנהגות למקרה קצה/עקיפה.

## זרימת עבודה

1. סרוק כותרות התחייבות אחרונות (כותרות בלבד) עבור הקובץ/אזור:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. בדוק רק התחייבויות רלוונטיות עם הבדלים בהיקף:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. המשך בשעתוק ותקן לאחר הבנת ההקשר ההיסטוריה.

## כלל פתרון בעיות

כאשר חסום, חפש באינטרנט אחר תיקונים/דרכים לעקיפת הבעיה.
