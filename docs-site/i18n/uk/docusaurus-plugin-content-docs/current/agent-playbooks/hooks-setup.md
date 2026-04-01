# Налаштування хуків агента

Якщо ваш помічник кодування ШІ підтримує перехоплення життєвого циклу, налаштуйте їх для цього репо.

## Рекомендовані гачки

| Гачок           | Команда                                    | Призначення                                                                                                                                                                        |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Автоматичне форматування файлів після редагування AI                                                                                                                               |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Запустіть `corepack yarn install`, коли `package.json` зміниться                                                                                                                   |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Видалити застарілі посилання та видалити інтегровані тимчасові гілки завдань                                                                                                       |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate build, lint, typecheck і перевірки формату; зберігати `yarn npm audit` інформаційним і запускати `yarn knip` окремо як дорадчий аудит, коли залежності/імпорт змінюються |

## чому

- Послідовне форматування
- Lockfile залишається синхронізованим
- Проблеми збірки/ворсу/типу виявлені рано
- Видимість безпеки через `yarn npm audit`
- Зміщення залежностей/імпорту можна перевірити за допомогою `yarn knip`, не перетворюючи його на галасливий глобальний стоп-хук
- Одна спільна реалізація гака для Codex і Cursor
- Тимчасові гілки завдань залишаються узгодженими з робочим процесом робочого дерева репо

## Приклади сценаріїв підключення

### Гачок формату

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

### Перевірте хук

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

За замовчуванням `scripts/agent-hooks/verify.sh` виходить ненульовим, якщо необхідна перевірка не вдається. Встановлюйте `AGENT_VERIFY_MODE=advisory` лише тоді, коли вам навмисно потрібен сигнал від зламаного дерева без блокування гака. Тримайте `yarn knip` подалі від жорстких воріт, якщо репо явно не вирішить відмовити через рекомендаційні проблеми імпорту/залежностей.

### Гачок для встановлення пряжі

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

Налаштуйте проводку підключення відповідно до документів інструменту агента (`hooks.json`, еквівалент тощо).

У цьому репозиторії `.codex/hooks/*.sh` і `.cursor/hooks/*.sh` повинні залишатися тонкими оболонками, які делегують спільні реалізації під `scripts/agent-hooks/`.
