# إعداد خطافات الوكيل

إذا كان مساعد ترميز الذكاء الاصطناعي الخاص بك يدعم خطافات دورة الحياة، فقم بتكوينها لهذا الريبو.

## الخطافات الموصى بها

| هوك             | الأمر                                      | الغرض                                                                                                                                                                               |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | تنسيق تلقائي للملفات بعد تعديلات الذكاء الاصطناعي                                                                                                                                   |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | قم بتشغيل `corepack yarn install` عندما يتغير `package.json`                                                                                                                        |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | تقليم المراجع التي لا معنى لها وحذف فروع المهام المؤقتة المتكاملة                                                                                                                   |
| `stop`          | `scripts/agent-hooks/verify.sh`            | بناء البوابة الصلبة، والوبر، والتحقق من الكتابة، والتحقق من التنسيق؛ احتفظ بمعلومات `yarn npm audit` وقم بتشغيل `yarn knip` بشكل منفصل كمراجعة استشارية عند تغيير التبعيات/الواردات |

## لماذا

- التنسيق المتسق
- يبقى Lockfile متزامنا
- تم اكتشاف مشكلات البناء/الوبر/النوع مبكرًا
- الرؤية الأمنية عبر `yarn npm audit`
- يمكن التحقق من انحراف التبعية/الاستيراد باستخدام `yarn knip` دون تحويله إلى خطاف توقف عالمي صاخب
- تطبيق ربط مشترك واحد لكل من Codex وCursor
- تظل فروع المهام المؤقتة متوافقة مع سير عمل شجرة عمل الريبو

## مثال على البرامج النصية هوك

### تنسيق هوك

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

### التحقق من هوك

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

بشكل افتراضي، يخرج `scripts/agent-hooks/verify.sh` من الصفر عند فشل التحقق المطلوب. قم بتعيين `AGENT_VERIFY_MODE=advisory` فقط عندما تحتاج عمدًا إلى إشارة من شجرة مكسورة دون حجب الخطاف. احتفظ بـ `yarn knip` بعيدًا عن البوابة الصعبة ما لم يقرر الريبو صراحةً الفشل في مشكلات الاستيراد/التبعية الاستشارية.

### خطاف تثبيت الغزل

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

قم بتكوين أسلاك الخطاف وفقًا لمستندات أداة الوكيل الخاصة بك (`hooks.json`، ما يعادلها، وما إلى ذلك).

في هذا الريبو، يجب أن يظل `.codex/hooks/*.sh` و`.cursor/hooks/*.sh` كمغلفات رفيعة تفوض التطبيقات المشتركة ضمن `scripts/agent-hooks/`.
