---
title: CLI
description: ממשק שורת פקודה להפעלת צומת Bitsocial, יצירת קהילות וניהול פעולות פרוטוקול.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
חבילה זו משתמשת כעת במוסכמות שמות מדור קודם שהורשתו מהתלות שלה במעלה הזרם. הפניות ל-"plebbit" בפקודות, בפלט ובתצורה יועברו ל-"bitsocial" במהדורה עתידית. הפונקציונליות אינה מושפעת.
:::

ה-`bitsocial-cli` הוא כלי שורת פקודה לאינטראקציה עם הקצה האחורי של פרוטוקול Bitsocial. זה מאפשר לך להפעיל דמון P2P מקומי, ליצור ולהגדיר קהילות ולפרסם תוכן - הכל מהמסוף.

הוא בנוי על גבי `plebbit-js` ומשמש את [5chan](/apps/5chan/) ו-[Seedit](/apps/seedit/) ליצירת קהילה וניהול צמתים.

## התקנה

קבצים בינאריים מובנים מראש זמינים עבור Windows, macOS ו-Linux. הורד את המהדורה האחרונה עבור הפלטפורמה שלך מ-GitHub:

**[הורד מ-GitHub מהדורות](https://github.com/bitsocialnet/bitsocial-cli/releases)**

לאחר ההורדה, הפוך את קובץ ההפעלה הבינארי (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## מפעיל את הדימון

השימוש הנפוץ ביותר ב-CLI הוא הפעלת צומת Bitsocial. הדמון מתחיל את שכבת הרשת P2P וחושף API מקומי שלקוחות יכולים להתחבר אליו.

```bash
bitsocial-cli daemon
```

בהפעלה הראשונה, הדמון מוציא קישורים ל-**WebUI**, ממשק גרפי מבוסס דפדפן לניהול הצומת, הקהילות וההגדרות שלך. זה שימושי אם אתה מעדיף GUI על פני פקודות מסוף.

## פקודות מפתח

| פקודה               | תיאור                                     |
| ------------------- | ----------------------------------------- |
| `daemon`            | הפעל את הצומת Bitsocial P2P               |
| `create subplebbit` | צור קהילה חדשה                            |
| `subplebbit edit`   | עדכון הגדרות הקהילה (כותרת, תיאור, כללים) |
| `subplebbit list`   | רשימת קהילות המתארחות בצומת זה            |
| `subplebbit start`  | התחל לשרת קהילה ספציפית                   |
| `subplebbit stop`   | הפסק לשרת קהילה ספציפית                   |

הפעל כל פקודה עם `--help` כדי לראות אפשרויות ודגלים זמינים:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## זרימת עבודה טיפוסית

זרימת הגדרה נפוצה לאירוח קהילה חדשה:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

הקהילה פעילה כעת ברשת Bitsocial ונגישה מכל לקוח תואם.

## קישורים

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
