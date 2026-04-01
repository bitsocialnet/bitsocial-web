---
title: בוטים של טלגרם
description: בוטים להזנה שעוקבים אחר רשימות קהילת Bitsocial ומעבירים פוסטים לערוצי טלגרם.
sidebar_position: 3
---

# בוטים של טלגרם

הבוטים של Bitsocial Telegram עוקבים אחר רשימות קהילת הלקוחות ברשת Bitsocial ומעבירים אוטומטית פוסטים חדשים לערוצי Telegram. כל הודעה שהועברה כוללת כפתורים מוטבעים המקשרים חזרה לפוסט המקורי ב-5chan וב-Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## בוטים זמינים

| בוט                 | סטטוס  | תיאור                                                |
| ------------------- | ------ | ---------------------------------------------------- |
| **פיד 5chan**       | פעיל   | עוקב אחר כל ספריות 5chan ומעביר פוסטים חדשים לטלגרם. |
| **עדכון של Seedit** | מתוכנן | יספק את אותה פונקציונליות עבור קהילות Seedit.        |

## הגדרה

### דרישות מוקדמות

- Node.js
- חוט
- אסימון בוט של Telegram (צור אחד באמצעות [BotFather](https://t.me/BotFather))

### התקנה

שכבו את המאגר והתקינו תלות:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### תצורה

צור קובץ `.env` בשורש הפרויקט עם אסימון הבוט שלך:

```env
BOT_TOKEN=your_telegram_bot_token
```

### ריצה

הפעל את הבוט לאחר הגדרת הסביבה שלך:

```bash
yarn start
```

## פורמט פוסט

כאשר הבוט מעביר פוסט לטלגרם, הוא כולל שני כפתורים מוטבעים:

- **הצג ב-5chan** -- פותח את הפוסט בלקוח האינטרנט של 5chan.
- **הצג ב-Seedit** -- פותח את הפוסט בלקוח האינטרנט של Seedit.

זה מאפשר למנויי טלגרם לקפוץ ישירות לשרשור הדיון המלא בכל לקוח שהם מעדיפים.
