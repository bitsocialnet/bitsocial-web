# Hooks de agentes

Los hooks de ciclo de vida confirmados en el repositorio solo formatean, con el oxfmt instalado, los archivos JavaScript/TypeScript editados correctamente. La lógica compartida está en `scripts/agent-hooks/format.mjs`; cada wrapper nativo delega en él.

| Aplicación | Configuración nativa | Evento |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude no lee un `.claude/hooks.json` independiente. Cada aplicación sigue controlando la confianza en el proyecto y si los hooks están activados; revise su configuración actual en lugar de eludir la confianza. `.codex/config.toml` es configuración del repositorio, no un registro de comandos de hooks.

El formateador valida el evento y la carga útil, que la edición haya tenido éxito, la extensión del archivo y que el archivo esté dentro del repositorio, incluidos los enlaces simbólicos. Si faltan dependencias o la entrada no es relevante, no hace nada. Los comandos usan un array de argumentos con el acceso a la red de Corepack desactivado; los hooks no instalan dependencias, no ejecutan builds ni revisiones y no modifican Git.

Ejecute las comprobaciones explícitamente según [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Ejecute `yarn ai-workflow:sync`, `yarn ai-workflow:check` y `yarn ai-workflow:test` después de cambiar el flujo de trabajo. Los fixtures usan archivos desechables e invocaciones simuladas del formateador; no demuestran que cada aplicación haya cargado su configuración. Tras las actualizaciones, recargue la aplicación y revise su catálogo.

La skill de diseño Impeccable y sus helpers ejecutables siguen disponibles bajo demanda en `.agents/skills/impeccable`. Su antiguo hook de Codex apuntaba a un directorio inexistente; ahora el flujo de diseño se ejecuta cuando se selecciona su skill, sin ningún hook de diseño siempre activo. La skill no debe reconfigurar los hooks del proyecto como paso secundario de un trabajo de diseño.
