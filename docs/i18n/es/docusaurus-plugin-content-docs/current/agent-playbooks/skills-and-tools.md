# Skills y herramientas

Las skills compartidas están en `.agents/skills/`. Edite estas fuentes y después ejecute `yarn ai-workflow:sync` para generar `.claude/skills/` para Claude Code. Codex y Cursor descubren `.agents/skills/` directamente; no restaure las raíces duplicadas `.codex/skills/` ni `.cursor/skills/`.

Los prompts de roles compartidos están en `.agents/roles/*.md`. Es un formato de origen propio de este repositorio, no una ruta nativa de descubrimiento de agentes. `scripts/ai-workflow-files.mjs` convierte estas fuentes en los archivos específicos de cada aplicación que se indican abajo; `yarn ai-workflow:sync` los escribe. Confirme los archivos generados junto con sus fuentes para que un checkout nuevo tenga la configuración nativa sin ejecutar antes un generador. Después de eliminar una fuente, elimine explícitamente sus salidas generadas obsoletas; el validador las señala en lugar de borrar archivos sin avisar.

## Rutas nativas de descubrimiento

Verificado con la documentación oficial el 2026-09-12:

| Aplicación  | Instrucciones del proyecto                                                                          | Skills que usa este repositorio           | Agentes personalizados que usa este repositorio |
| ----------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                         | `.agents/skills/<name>/SKILL.md`          | `.codex/agents/<name>.toml` generado            |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` sigue disponible para reglas condicionales específicas de Cursor | `.agents/skills/<name>/SKILL.md`          | `.cursor/agents/<name>.md` generado             |
| Claude Code | `CLAUDE.md` importa `@AGENTS.md`                                                                    | `.claude/skills/<name>/SKILL.md` generado | `.claude/agents/<name>.md` generado             |

Fuentes: [skills de Codex](https://learn.chatgpt.com/docs/build-skills), [subagentes de Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [reglas de Cursor](https://cursor.com/docs/rules), [skills de Cursor](https://cursor.com/docs/skills), [subagentes de Cursor](https://cursor.com/docs/subagents), [memoria de Claude](https://code.claude.com/docs/en/memory), [skills de Claude](https://code.claude.com/docs/en/skills), [subagentes de Claude](https://code.claude.com/docs/en/sub-agents).

No sustituya los directorios nativos de agentes por `.agents/roles` ni dé por hecho que Claude descubre `.agents/skills`. Claude puede leer igualmente un archivo de ahí al que se haga referencia como contexto normal del proyecto. Cursor también descubre `.claude/skills` por compatibilidad; las copias se mantienen sincronizadas, pero su guía publicada de skills no especifica si deduplica entre estas raíces. Revise el catálogo de skills de la aplicación instalada en lugar de prometer que no pueden aparecer entradas duplicadas.

Los directorios de IA usan finales de línea LF mediante `.gitattributes` para que el texto generado sea idéntico en todas las plataformas. Los recursos de apoyo de las skills se copian byte a byte.

## Skills

| Skill                                | Propósito                                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Crear commits locales autorizados y acotados                                                                      |
| `commit-format`, `issue-format`      | Sugerir formatos cuando se pida                                                                                   |
| `make-closed-issue`                  | Crear una issue, un commit acotado y un PR autorizados                                                            |
| `review-and-merge-pr`                | Clasificar el feedback de un PR; corregir/publicar/fusionar solo dentro del alcance solicitado                    |
| `fix-merge-conflicts`                | Resolver conflictos y verificar el resultado fusionado                                                            |
| `release`                            | Preparar el texto de la release y realizar los pasos de release autorizados                                       |
| `code-quality-review`                | Revisar diffs no triviales o una cuestión de calidad pedida explícitamente                                        |
| `retro`                              | Convertir errores demostrados en comprobaciones o pautas concretas que eviten que se repitan                      |
| `refactor-pass`, `deslop`            | Limpieza solicitada de cambios existentes                                                                         |
| `debug-agent`                        | Depuración basada en pruebas, con instrumentación cuando haga falta                                               |
| `you-might-not-need-an-effect`       | Revisión específica de efectos/memo                                                                               |
| `vercel-react-best-practices`        | Pautas de rendimiento de React aplicables; omitir las reglas de Next.js o solo de servidor para este cliente Vite |
| `translate`                          | Generar traducciones y aplicar después los mapas mediante un único escritor                                       |
| `playwright-cli`, `inspect-elements` | Verificación en el navegador y correspondencia entre el DOM y el código fuente                                    |
| `profile-browsing`                   | Profiling acotado del navegador y de React                                                                        |
| `test-apk`                           | Verificar un wrapper Android complementario proporcionado                                                         |
| `impeccable`, `improve-threejs`      | Diseño de interfaces acotado y revisión del renderizado con Three.js                                              |
| `implement-plan`                     | Ejecutar un plan con delegación opcional y limitada                                                               |
| `readme`                             | Mantener documentación del proyecto verificada                                                                    |
| `context7`                           | Obtener documentación de librerías adecuada a la versión                                                          |
| `find-skills`                        | Buscar skills adicionales cuando se pida explícitamente                                                           |

## Roles y modelos

Mantenga los roles personalizados para `browser-check`, `profiler`, `test-apk`, `translator` y `reviewer`. Use el rol integrado de worker/propósito general o de explorador del entorno para la implementación habitual y la exploración del código. El agente padre asigna los criterios de aceptación y la propiedad; un único responsable ejecuta las comprobaciones pesadas.

Los archivos de agentes de Codex incluyen `name`, `description` y `developer_instructions`. `.codex/config.toml` limita a cuatro los agentes hijos simultáneos mediante `max_concurrent_threads_per_session`. Los metadatos compartidos de los roles contienen el nombre, la descripción y un modo de sandbox opcional; deliberadamente no tienen campos de modelo.

No incluya campos de modelo ni de razonamiento en las skills y los agentes personalizados confirmados en el repositorio en ninguna de las tres aplicaciones. Así se respetan las elecciones al invocar, los valores predeterminados del usuario y la herencia del agente padre según la precedencia documentada de cada aplicación. Los alias de familia de Claude reducen el mantenimiento de versiones, pero siguen eligiendo una familia; un modelo de Cursor con versión requerirá actualizaciones futuras. Guarde esas elecciones en la configuración del usuario o de la sesión cuando haga falta. La herencia no garantiza que se elija automáticamente el mejor modelo actual. No invente un alias `latest` ni añada investigación del catálogo de modelos a tareas rutinarias. Consulte [selección en Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [selección en Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) y [selección en Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` corresponde al sandbox de Codex y a `readonly` de Cursor; en Claude, la lista de herramientas y las instrucciones del rol restringen su flujo de revisión, pero el acceso a Bash no es un sandbox a nivel del sistema operativo.

El frontmatter compartido de las skills usa `disable-model-invocation: true` para los flujos que invoca el usuario, cuando corresponde. El ajuste equivalente de Codex está en `agents/openai.yaml` como `policy.allow_implicit_invocation: false`; el validador exige ambos. Los metadatos de invocación complementan las reglas de autorización explícita; una petición de revisión nunca autoriza una publicación por el mero hecho de que una skill incluya pasos de publicación.

## Comprobaciones y descubrimiento

- `yarn ai-workflow:sync` regenera las salidas de compatibilidad usando `js-yaml` y `smol-toml` instalados.
- `yarn ai-workflow:check` analiza fuentes, frontmatter y configuraciones, y comprueba las salidas generadas, los metadatos de invocación, la ubicación de los campos de modelo y el cableado del hook que solo formatea. No resuelve los identificadores de modelo contra el catálogo de un proveedor.
- `yarn ai-workflow:test` ejecuta fixtures aislados de Node para las cargas útiles de los hooks y para la generación y validación del flujo de trabajo.
- Después de actualizar una aplicación de agentes, verifique en esa aplicación que descubre las skills y los roles. Las comprobaciones de sintaxis y de paridad no sustituyen una comprobación del cargador. Recargue la aplicación si una sesión existente conserva un catálogo antiguo.
- Los hooks requieren la confianza en el proyecto y la revisión de hooks del entorno; no eluda la confianza para que una comprobación pase. Consulte [hooks-setup.md](hooks-setup.md).

## Mantener instrucciones útiles

Siga la [guía de OpenAI sobre skills y prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (revisada el 2026-09-12): mantenga descripciones precisas, cargue los detalles solo cuando sean relevantes y respete el alcance solicitado por el usuario. Las skills compartidas sirven a modelos distintos; conserve las invariantes propias del proyecto y deje margen para las decisiones rutinarias de implementación.

Mantenga en `SKILL.md` el propósito de una skill, sus límites de decisión y sus restricciones esenciales. Enlace los comandos o ejemplos extensos específicos de un modo como referencias opcionales. Ponga las condiciones de activación al principio de descripciones breves; una palabra clave coincidente no debería ampliar la tarea por sí sola. Conserve los metadatos de invocación existentes salvo que se esté cambiando su comportamiento de forma intencionada.

Tras un cambio importante en las instrucciones, pruebe algunas peticiones representativas, pequeñas y grandes. Compruebe qué skills y referencias se seleccionaron, si las acciones se mantuvieron dentro del alcance, si la verificación se ajustó al cambio y si el trabajo autorizado se completó. Las pruebas de esquemas y fixtures demuestran que las herramientas funcionan correctamente, no la calidad de las decisiones del agente.

## Herramientas y propiedad del navegador

Prefiera el catálogo existente de skills y herramientas y las CLI instaladas en el proyecto. Use `gh` para GitHub, `playwright-cli` para la verificación en el navegador y documentación oficial o específica de la versión cuando importe el comportamiento de una librería. Evite instalar skills duplicadas o descargar un paquete sin versión fijada solo para ejecutar un formateador que ya existe.

La sobrecarga de MCP depende del entorno: la carga diferida de herramientas puede evitar cargar todos los esquemas de antemano. Mantenga solo integraciones relevantes en lugar de considerar obsoleto MCP en sí. Las CLI que ya se usan siguen siendo útiles para la reproducibilidad y el control de recursos.

Todas las sesiones del navegador usan `./scripts/pw-session.sh`, que impone un único navegador activo en toda la máquina. Por defecto, use una sesión nueva y aislada. El acceso al navegador personal actual requiere autorización explícita; reutilice esa autorización en los pasos siguientes. Elija navegadores y viewports según el comportamiento afectado, ejecute los motores seleccionados uno tras otro, cierre en la limpieza exactamente la sesión con nombre y no use nunca `close-all`/`kill-all`. Consulte la skill `playwright-cli` y [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
