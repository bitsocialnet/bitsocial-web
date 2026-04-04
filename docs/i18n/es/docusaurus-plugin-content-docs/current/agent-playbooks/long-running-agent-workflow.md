# Flujo de trabajo del agente de larga duración

Utilice este manual cuando sea probable que una tarea abarque varias sesiones, traspasos o agentes generados.

## Metas

- Ofrezca a cada nueva sesión una forma rápida de recuperar el contexto
- Mantenga el trabajo incremental en lugar de realizar un gran cambio de una sola vez
- Detecte una línea de base local rota antes de agregar más código
- Deje artefactos duraderos en los que pueda confiar la próxima sesión

## Dónde mantener el estado

- Utilice `docs/agent-runs/<slug>/` cuando los humanos, los robots de revisión o varias cadenas de herramientas necesiten el mismo estado de tarea.
- Utilice un directorio local de herramientas como `.codex/runs/<slug>/` solo cuando el estado de la tarea sea intencionalmente local para una estación de trabajo o una cadena de herramientas.
- No oculte el estado compartido de sesiones múltiples en un archivo temporal privado si otro colaborador o agente lo necesitará más adelante.

## Archivos requeridos

Cree estos archivos al comienzo de la tarea de larga duración:

- `feature-list.json`
- `progress.md`

Utilice las plantillas en `docs/agent-playbooks/templates/feature-list.template.json` y `docs/agent-playbooks/templates/progress.template.md`.

Prefiera JSON para la lista de funciones para que los agentes puedan actualizar una pequeña cantidad de campos sin tener que volver a escribir todo el documento.

## Lista de verificación de inicio de sesión

1. Ejecute `pwd`.
2. Lea `progress.md`.
3. Lea `feature-list.json`.
4. Ejecute `git log --oneline -20`.
5. Ejecute `./scripts/agent-init.sh --smoke`.
6. Elija exactamente un elemento de mayor prioridad que siga siendo `pending`, `in_progress` o `blocked`.

Si el paso de humo falla, arregle la línea de base rota antes de implementar una nueva sección de funciones.

## Reglas de sesión

- Trabaje en una característica o segmento de tarea a la vez.
- Mantenga la lista de funciones estable y legible por máquina. Actualice el estado, las notas, los archivos y los campos de verificación en lugar de reescribir elementos no relacionados.
- Solo marque un elemento como verificado después de ejecutar el comando o flujo de usuario enumerado en ese elemento.
- Utilice agentes generados para sectores limitados, no para la propiedad general del estado de la tarea.
- Cuando un agente secundario posee un elemento, proporciónele la identificación exacta del elemento, los criterios de aceptación y los archivos que puede tocar.

## Lista de verificación para finalizar la sesión

1. Agregue una breve entrada de progreso a `progress.md`.
2. Actualice el elemento tocado en `feature-list.json`.
3. Registre los comandos exactos ejecutados para su verificación.
4. Capture bloqueadores, seguimientos y el siguiente mejor elemento para reanudar.

## Forma de entrada de progreso recomendada

Utilice una estructura corta como:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
