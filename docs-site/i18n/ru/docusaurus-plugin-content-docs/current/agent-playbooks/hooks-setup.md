# Настройка агентских перехватчиков

Если ваш помощник по кодированию ИИ поддерживает перехватчики жизненного цикла, настройте их для этого репозитория.

## Рекомендуемые крючки

| Крючок          | Команда                                    | Цель                                                                                                                                                                                                  |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Автоматическое форматирование файлов после редактирования AI                                                                                                                                          |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Запускать `corepack yarn install` при изменении `package.json`                                                                                                                                        |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Сократите устаревшие ссылки и удалите интегрированные временные ветки задач                                                                                                                           |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Жесткая сборка, анализ, проверка типов и форматов; сохраняйте `yarn npm audit` информационным и запускайте `yarn knip` отдельно в качестве консультативного аудита при изменении зависимостей/импорта |

## Почему

- Согласованное форматирование
- Файл блокировки остается синхронизированным
- Проблемы сборки/сборки/типирования обнаружены на ранней стадии
- Видимость безопасности через `yarn npm audit`
- Смещение зависимости/импорта можно проверить с помощью `yarn knip`, не превращая его в шумный глобальный стоп-хук.
- Одна общая реализация перехватчика для Codex и Cursor.
- Ветки временных задач остаются согласованными с рабочим процессом рабочего дерева репозитория.

## Примеры скриптов-перехватчиков

### Крючок формата

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

### Проверить крючок

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

По умолчанию `scripts/agent-hooks/verify.sh` завершает работу с ненулевым значением, если требуемая проверка не удалась. Устанавливайте `AGENT_VERIFY_MODE=advisory` только в том случае, если вам намеренно нужен сигнал от сломанного дерева без блокировки перехватчика. Держите `yarn knip` вне жестких ворот, если только репозиторий явно не решит потерпеть неудачу из-за проблем с рекомендательным импортом/зависимостями.

### Крючок для установки пряжи

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

Настройте подключение крюка в соответствии с документацией вашего инструмента агента (`hooks.json`, эквивалент и т. д.).

В этом репозитории `.codex/hooks/*.sh` и `.cursor/hooks/*.sh` должны оставаться тонкими оболочками, которые делегируют общие реализации под `scripts/agent-hooks/`.
