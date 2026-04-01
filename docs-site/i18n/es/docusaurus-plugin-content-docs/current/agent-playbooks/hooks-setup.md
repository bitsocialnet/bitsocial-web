# Configuración de enlaces de agentes

Si su asistente de codificación de IA admite enlaces de ciclo de vida, configúrelos para este repositorio.

## Ganchos recomendados

| Gancho          | Comando                                    | Propósito                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Formatear archivos automáticamente después de las ediciones de IA                                                                                                                                                                      |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Ejecute `corepack yarn install` cuando cambie `package.json`                                                                                                                                                                           |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Eliminar referencias obsoletas y eliminar ramas de tareas temporales integradas                                                                                                                                                        |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Comprobaciones de formato, pelusa, tipografía y compilación de puerta dura; mantenga `yarn npm audit` informativo y ejecute `yarn knip` por separado como una auditoría de asesoramiento cuando cambien las dependencias/importaciones |

## ¿Por qué?

- Formato consistente
- Lockfile permanece sincronizado
- Problemas de compilación/pelusa/tipo detectados tempranamente
- Visibilidad de seguridad a través de `yarn npm audit`
- La deriva de dependencia/importación se puede verificar con `yarn knip` sin convertirlo en un ruidoso gancho de parada global.
- Una implementación de enlace compartido para Codex y Cursor
- Las ramas de tareas temporales permanecen alineadas con el flujo de trabajo del árbol de trabajo del repositorio.

## Ejemplos de secuencias de comandos de gancho

### Gancho de formato

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

### Verificar gancho

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

De forma predeterminada, `scripts/agent-hooks/verify.sh` sale de un valor distinto de cero cuando falla una verificación requerida. Configure `AGENT_VERIFY_MODE=advisory` solo cuando intencionalmente necesite señal de un árbol roto sin bloquear el gancho. Mantenga `yarn knip` fuera de la puerta principal a menos que el repositorio decida explícitamente fallar en cuestiones de importación/dependencia de asesoramiento.

### Gancho de instalación de hilo

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

Configure el cableado del gancho de acuerdo con los documentos de la herramienta de su agente (`hooks.json`, equivalente, etc.).

En este repositorio, `.codex/hooks/*.sh` y `.cursor/hooks/*.sh` deben permanecer como contenedores delgados que delegan a las implementaciones compartidas en `scripts/agent-hooks/`.
