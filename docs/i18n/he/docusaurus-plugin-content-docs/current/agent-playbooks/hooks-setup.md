# Hooks של סוכנים

ה-hooks של מחזור החיים שנמצאים במאגר רק מפרמטים, באמצעות oxfmt המותקן, קובצי JavaScript/TypeScript שנערכו בהצלחה. הלוגיקה המשותפת נמצאת ב-`scripts/agent-hooks/format.mjs`; כל עטיפה נייטיבית מאצילה אליה.

| אפליקציה | תצורה נייטיבית | אירוע |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude אינו קורא קובץ `.claude/hooks.json` עצמאי. כל אפליקציה עדיין שולטת באמון בפרויקט ובשאלה אם hooks מופעלים; בדוק את ההגדרות הנוכחיות שלה במקום לעקוף את מנגנון האמון. `.codex/config.toml` הוא תצורת מאגר, לא מרשם של פקודות hook.

המפרמט מאמת את האירוע והמטען, את הצלחת העריכה, את סיומת הקובץ ואת היותו של הקובץ בתוך המאגר, כולל קישורים סימבוליים. כשתלויות חסרות או שהקלט אינו רלוונטי, לא מתבצעת שום עבודה. הפקודות משתמשות במערך ארגומנטים כשגישת הרשת של Corepack מושבתת; ה-hooks אינם מתקינים תלויות, אינם מריצים בניות או ביקורות ואינם משנים את Git.

הרץ בדיקות במפורש בהתאם ל-[verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). הרץ את `yarn ai-workflow:sync`, את `yarn ai-workflow:check` ואת `yarn ai-workflow:test` אחרי שינוי בזרימת העבודה. ה-fixtures משתמשים בקבצים חד-פעמיים ובהפעלות מדומות של המפרמט; הם אינם מוכיחים שכל אפליקציה טענה את התצורה שלה. אחרי שדרוגים, טען מחדש את האפליקציה ובדוק את הקטלוג שלה.

ה-skill לעיצוב Impeccable וכלי העזר הניתנים להרצה שלו נשארים זמינים לפי דרישה תחת `.agents/skills/impeccable`. ה-hook הקודם שלו ב-Codex הצביע על תיקייה חסרה; זרימת העבודה של העיצוב רצה כעת כשה-skill שלה נבחר, בלי hook עיצוב שפועל תמיד. אסור ל-skill לשנות את תצורת ה-hooks של הפרויקט כצעד אגבי בעבודת העיצוב.
