---
title: EVM Contract Call Challenge
description: אתגר אנטי ספאם המאמת את תנאי השרשרת על ידי קריאה לחוזה חכם של EVM.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning מתן שמות מדור קודם
חבילה זו פורסמה במקור תחת היקף `@plebbit`. שמו שונה ל-`@bitsocial/evm-contract-challenge`. הפניות לשם הישן עדיין עשויות להופיע בתיעוד ישן יותר או בבסיסי קוד.
:::

EVM Contract Call Challenge הוא מנגנון אנטי ספאם המאמת את תנאי השרשרת לפני שמתיר פרסום. במקור מופק מ-`plebbit-js` כחבילה עצמאית, הוא מאפשר לבעלי קהילה לדרוש מחברים לעמוד בקריטריונים המוגדרים בחוזה חכם - למשל, להחזיק ביתרה מינימלית סמלית - כדי לפרסם.

**קוד מקור:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## דרישות

- **Node.js** >= 22
- **ESM בלבד** -- חבילה זו אינה שולחת רכיבי בנייה של CommonJS.
- **תלות עמיתים בזמן ריצה:** `@plebbit/plebbit-js` (העברה ל-`@pkc/pkc-js`)

## התקנה

```bash
npm install @bitsocial/evm-contract-challenge
```

## אפשרויות תצורה

| אפשרות        | הקלד     | תיאור                                                       |
| ------------- | -------- | ----------------------------------------------------------- |
| `chainTicker` | `string` | השרשרת לשאילתה (לדוגמה, `eth`, `matic`, `avax`).            |
| `address`     | `string` | כתובת החוזה החכמה להתקשרות.                                 |
| `abi`         | `string` | מקטע ה-ABI עבור הפונקציה הנקראת.                            |
| `condition`   | `string` | ביטוי השוואה המוערך מול ערך החזרת החוזה (לדוגמה, `> 1000`). |
| `error`       | `string` | הודעת השגיאה המוצגת למחברים שאינם עומדים בתנאי.             |

## דוגמה

בעל קהילה שרוצה להגביל את הפרסום למחברים המחזיקים ביותר מ-1,000 אסימון ERC-20 מסוים יגדיר את האתגר עם:

- `chainTicker`: `"eth"`
- `address`: כתובת החוזה האסימון
- `abi`: ה-ABI עבור `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

כאשר מחבר מנסה לפרסם, האתגר קורא ל-`balanceOf` עם כתובת המחבר ובודק אם הערך המוחזר עומד בתנאי. אם כן, הפרסום ממשיך; אחרת, הודעת השגיאה שהוגדרה מוחזרת.

## מתי להשתמש בו

אתגר שיחת חוזה EVM הוא אידיאלי עבור:

- **קהילות עם אסימונים** שמגבילות פרסום לבעלי אסימונים.
- **גישה עם NFT-gate** שבה נדרשת בעלות על NFT ספציפי.
- **מרחבי ממשל של DAO** שבהם ההשתתפות מוגבלת לבעלי אסימון ממשל.

עבור קהילות שאינן מסתמכות על זהות בשרשרת, שקול במקום זאת [Spam Blocker](./spam-blocker.md) או [Voucher Challenge](./voucher-challenge.md).
