# Konfiguracja haków agenta

Jeśli Twój asystent kodowania AI obsługuje haki cyklu życia, skonfiguruj je dla tego repozytorium.

## Polecane haczyki

| Hak             | Polecenie                                  | Cel                                                                                                                                                                                                            |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Automatyczne formatowanie plików po edycjach AI                                                                                                                                                                |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Uruchom `corepack yarn install`, gdy zmieni się `package.json`                                                                                                                                                 |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Usuń nieaktualne referencje i usuń zintegrowane tymczasowe gałęzie zadań                                                                                                                                       |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Kompilacja z twardą bramką, sprawdzanie lint, sprawdzanie typu i formatu; przechowuj informacje o `yarn npm audit` i uruchamiaj `yarn knip` oddzielnie jako audyt doradczy, gdy zmienią się zależności/importy |

## Dlaczego

- Spójne formatowanie
- Plik blokujący pozostaje zsynchronizowany
- Wcześnie wykryte problemy z kompilacją/lintami/typami
- Widoczność bezpieczeństwa poprzez `yarn npm audit`
- Zależność/dryft importu można sprawdzić za pomocą `yarn knip` bez przekształcania go w hałaśliwy globalny hak zatrzymujący
- Jedna wspólna implementacja haka dla Kodeksu i Kursora
- Tymczasowe gałęzie zadań pozostają zgodne z przepływem pracy w repozytorium

## Przykładowe skrypty hooków

### Sformatuj hak

```bash
#!/bin/bash
# Automatyczne formatowanie plików JS/TS po edycjach AI
# Hook odbiera JSON przez stdin ze ścieżką_pliku

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Zweryfikuj Hooka

```bash
#!/bin/bash
# Uruchom kompilację, lint, kontrolę typu, sprawdzanie formatu i audyt bezpieczeństwa po zakończeniu działania agenta

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Domyślnie `scripts/agent-hooks/verify.sh` kończy działanie z wartością różną od zera, gdy wymagane sprawdzenie nie powiedzie się. Ustaw `AGENT_VERIFY_MODE=advisory` tylko wtedy, gdy celowo potrzebujesz sygnału ze złamanego drzewa bez blokowania haka. Trzymaj `yarn knip` z dala od twardej bramy, chyba że repozytorium wyraźnie zdecyduje o niepowodzeniu w przypadku doradczych problemów z importem/zależnościami.

### Haczyk do instalacji przędzy

```bash
#!/bin/bash
# Uruchom instalację przędzy corepack po zmianie pakietu.json
# Hook odbiera JSON przez stdin ze ścieżką_pliku

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

Skonfiguruj okablowanie haków zgodnie z dokumentacją narzędzia agenta (`hooks.json`, odpowiednik itp.).

W tym repozytorium `.codex/hooks/*.sh` i `.cursor/hooks/*.sh` powinny pozostać cienkimi opakowaniami, które delegują do współdzielonych implementacji w ramach `scripts/agent-hooks/`.
