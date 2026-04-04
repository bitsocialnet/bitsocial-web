# Configurazione degli hook dell'agente

Se il tuo assistente di codifica AI supporta gli hook del ciclo di vita, configurali per questo repository.

## Hook consigliati

| Gancio          | Comando                                    | Scopo                                                                                                                                                                                                   |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Formatta automaticamente i file dopo le modifiche AI ​​                                                                                                                                                 |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Esegui `corepack yarn install` quando `package.json` cambia                                                                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Elimina i riferimenti obsoleti ed elimina i rami delle attività temporanee integrate                                                                                                                    |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Controlli di build, lint, typecheck e formato hard-gate; mantieni `yarn npm audit` informativo ed esegui `yarn knip` separatamente come controllo consultivo quando le dipendenze/importazioni cambiano |

## Perché

- Formattazione coerente
- Lockfile rimane sincronizzato
- Problemi di build/lint/tipo rilevati in anticipo
- Visibilità di sicurezza tramite `yarn npm audit`
- La deriva delle dipendenze/importazioni può essere controllata con `yarn knip` senza trasformarlo in un rumoroso hook di arresto globale
- Un'implementazione di hook condivisa sia per il Codex che per il cursore
- I rami delle attività temporanee rimangono allineati con il flusso di lavoro dell'albero di lavoro del repository

## Esempio di script di hook

### Formato Hook

```bash
#!/bin/bash
# Formatta automaticamente i file JS/TS dopo le modifiche AI
# Hook riceve JSON tramite stdin con file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Verifica Hook

```bash
#!/bin/bash
# Esegui build, lint, typecheck, controllo del formato e controllo di sicurezza al termine dell'agente

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Per impostazione predefinita, `scripts/agent-hooks/verify.sh` esce con un valore diverso da zero quando un controllo richiesto fallisce. Imposta `AGENT_VERIFY_MODE=advisory` solo quando hai intenzionalmente bisogno del segnale da un albero rotto senza bloccare il gancio. Tieni `yarn knip` fuori dal cancello a meno che il repository non decida esplicitamente di fallire su problemi di importazione/dipendenza di avvisi.

### Gancio per installazione filo

```bash
#!/bin/bash
# Esegui l'installazione del filato corepack quando package.json viene modificato
# Hook riceve JSON tramite stdin con file_path

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

Configura il cablaggio del hook in base ai documenti dello strumento agente (`hooks.json`, equivalente, ecc.).

In questo repository, `.codex/hooks/*.sh` e `.cursor/hooks/*.sh` dovrebbe rimanere un thin wrapper che delega alle implementazioni condivise in `scripts/agent-hooks/`.
