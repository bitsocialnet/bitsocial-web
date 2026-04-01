# התקנת Agent Hooks

אם עוזר קידוד הבינה המלאכותית שלך תומך בווים של מחזור חיים, הגדר אותם עבור ריפו זה.

## הוקס מומלצים

| הוק             | פקודה                                      | מטרה                                                                                                                                                  |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | פורמט אוטומטי של קבצים לאחר עריכות בינה מלאכותית                                                                                                      |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | הפעל את `corepack yarn install` כאשר `package.json` משתנה                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | גזום מסמכים מיושנים ומחק ענפי משימות זמניות משולבות                                                                                                   |
| `stop`          | `scripts/agent-hooks/verify.sh`            | בדיקות בנייה, מוך, בדיקת סוג ופורמט של שער קשיח; שמור על מידע על `yarn npm audit` והפעל את `yarn knip` בנפרד כביקורת מייעצת כאשר התלות/ייבוא ​​משתנים |

## למה

- עיצוב עקבי
- Lockfile נשאר מסונכרן
- בעיות מבנה/מוך/סוג נתפסו מוקדם
- נראות אבטחה באמצעות `yarn npm audit`
- ניתן לבדוק סחיפה של תלות/ייבוא עם `yarn knip` מבלי להפוך אותו להוק עצירה גלובלי רועש
- מימוש אחד של הוק משותף עבור Codex ו-Cursor
- ענפי משימות זמניים נשארים מיושרים עם זרימת העבודה של עץ העבודה של ה-repo

## סקריפטים של Hook לדוגמה

### פורמט הוק

```bash
#!/bin/bash
# Auto-format JS/TS files after AI edits
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### אמת את הוק

```bash
#!/bin/bash
# Run build, lint, typecheck, format check, and security audit when agent finishes

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

כברירת מחדל, `scripts/agent-hooks/verify.sh` יוצא ללא אפס כאשר בדיקה נדרשת נכשלת. הגדר את `AGENT_VERIFY_MODE=advisory` רק כאשר אתה צריך בכוונה אות מעץ שבור מבלי לחסום את הקרס. השאר את `yarn knip` מחוץ לשער הקשה, אלא אם כן ה-repo מחליט במפורש להיכשל בנושאי ייבוא/תלות מייעצים.

### וו התקנת חוט

```bash
#!/bin/bash
# Run corepack yarn install when package.json is changed
# Hook receives JSON via stdin with file_path

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

הגדר את חיווט הוו בהתאם למסמכי כלי הסוכן שלך (`hooks.json`, שווה ערך וכו').

ב-repo זה, `.codex/hooks/*.sh` ו-`.cursor/hooks/*.sh` צריכות להישאר כעטיפות דקיקות המאצילות להטמעות המשותפות תחת `scripts/agent-hooks/`.
