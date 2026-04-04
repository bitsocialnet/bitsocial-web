# מיומנויות וכלים

השתמש בספר המשחק הזה בעת הגדרה/התאמת מיומנויות וכלים חיצוניים.

## מיומנויות מומלצות

### Context7 (מסמכי ספרייה)

למסמכים עדכניים על ספריות.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### המחזאי CLI

השתמש ב-`playwright-cli` לאוטומציה של דפדפן (ניווט, אינטראקציה, צילומי מסך, בדיקות, חילוץ).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

מיקומי התקנת מיומנות:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### שיטות עבודה מומלצות של Vercel React

להנחיית ביצועים מעמיקה יותר של React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### מצא כישורים

גלה/התקן מיומנויות מהמערכת האקולוגית הפתוחה.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## נימוק מדיניות MCP

הימנע מ- GitHub MCP ושרתי MCP של דפדפן עבור פרויקט זה מכיוון שהם מוסיפים תקורה משמעותית של כלי-סכימת/הקשר.

- פעולות GitHub: השתמש ב-`gh` CLI.
- פעולות דפדפן: השתמש ב-`playwright-cli`.
