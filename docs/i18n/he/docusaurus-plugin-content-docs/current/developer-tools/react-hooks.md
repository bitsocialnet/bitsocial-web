---
title: React Hooks
description: ספריית React Hooks לבניית יישומים חברתיים מבוזרים בפרוטוקול Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning מתן שמות מדור קודם
חבילה זו משתמשת כעת במוסכמות שמות מדור קודם שעברו בירושה מהמזלג שלה במעלה הזרם. הפניות ל-"plebbit" בקוד, בממשקי API ובתצורה יועברו ל-"bitsocial" במהדורה עתידית. הפונקציונליות אינה מושפעת.
:::

חבילת `bitsocial-react-hooks` מספקת API מוכר של React hooks לאינטראקציה עם פרוטוקול Bitsocial. הוא מטפל בהבאת עדכונים, הערות ופרופילי מחבר, ניהול חשבונות, פרסום תוכן והרשמה לקהילות - כל זאת מבלי להסתמך על שרת מרכזי.

ספריה זו היא הממשק העיקרי המשמש את [5chan](/apps/5chan/) ויישומי לקוח Bitsocial אחרים.

:::note
`bitsocial-react-hooks` הוא מזלג זמני של `plebbit/plebbit-react-hooks` המתוחזק לפיתוח בעזרת AI. הוא נצרך ישירות מ-GitHub במקום מפורסם ב-npm.
:::

## התקנה

מכיוון שהחבילה עדיין לא נמצאת ב-npm, התקן אותה ישירות מ-GitHub, הצמד ל-commit hash ספציפי:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

החלף את `<commit-hash>` ב-commit שאליו ברצונך למקד.

## סקירה כללית של API

הווים מאורגנים בקטגוריות פונקציונליות. להלן סיכום של הווים הנפוצים ביותר בכל קטגוריה. עבור חתימות מלאות, פרמטרים וסוגי החזרה, ראה [הפניה מלאה ל-API ב-GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### חשבונות

נהל חשבונות משתמש מקומיים, זהות והגדרות.

- `useAccount(accountName?)` -- returns the active (or named) account object
- `useAccounts()` -- מחזירה את כל החשבונות המאוחסנים מקומית
- `useAccountComments(options?)` -- מחזיר הערות שפורסמו על ידי החשבון הפעיל

### הערות

אחזר וקיים אינטראקציה עם הערות ושרשורים בודדים.

- `useComment(commentCid?)` -- מביא הערה בודדת לפי ה-CID שלו
- `useComments(commentCids?)` -- מביא הערות מרובות באצווה
- `useEditedComment(comment?)` -- מחזירה את הגרסה הערוכה האחרונה של הערה

### קהילות

אחזר מטא נתונים והגדרות של הקהילה.

- `useSubplebbit(subplebbitAddress?)` -- מביא קהילה לפי כתובת
- `useSubplebbits(subplebbitAddresses?)` -- מביא מספר קהילות
- `useSubplebbitStats(subplebbitAddress?)` -- מחזירה ספירת מנויים ופוסטים

### מחברים

חפש פרופילים ומטא נתונים של מחברים.

- `useAuthor(authorAddress?)` -- מביא פרופיל מחבר
- `useAuthorComments(options?)` -- מחזיר הערות של מחבר ספציפי
- `useResolvedAuthorAddress(authorAddress?)` -- פותר כתובת קריאת אדם (למשל, ENS) לכתובת הפרוטוקול שלה

### הזנות

הירשם להזנות תוכן ועיפ אותן.

- `useFeed(options?)` -- מחזירה עדכון מעומד של פוסטים מקהילה אחת או יותר
- `useBufferedFeeds(feedOptions?)` -- מאחס מראש הזנות מרובות לעיבוד מהיר יותר
- `useAuthorFeed(authorAddress?)` -- מחזירה עדכון של פוסטים של מחבר ספציפי

### פעולות

פרסום תוכן וביצוע פעולות כתיבה.

- `usePublishComment(options?)` -- פרסם תגובה או תשובה חדשה
- `usePublishVote(options?)` -- cast an upvote or downvote
- `useSubscribe(options?)` -- הירשם או בטל את הרישום לקהילה

### מדינות ו-RPC

עקוב אחר מצב החיבור וקיים אינטראקציה עם דמון Bitsocial מרוחק.

- `useClientsStates(options?)` -- מחזירה את מצב החיבור של לקוחות IPFS/pubsub
- `usePlebbitRpcSettings()` -- מחזיר את תצורת הדמון הנוכחית של RPC

## פיתוח

כדי לעבוד על ספריית הוקס באופן מקומי:

**דרישות מוקדמות:** Node.js, Corepack מאופשר, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

עיין במאגר README עבור פקודות בדיקה ובנייה.

## קישורים

- **GitHub:** [הפניה מלאה ל-API ב-GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **רישיון:** GPL-2.0 בלבד
