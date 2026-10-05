# Trabajo de agentes de larga duración

Use un estado de tarea persistente cuando el trabajo deba reanudarse o traspasarse, o cuando una sola ejecución dure lo suficiente como para que la compactación del contexto pierda el hilo del trabajo pendiente. Las tareas pequeñas no necesitan un tablero ni un archivo de progreso. Para el trabajo compartido, mantenga un `feature-list.json` y un `progress.md` concisos en un `docs/agent-runs/<slug>/` específico de la tarea, usando las plantillas existentes cuando sean útiles.

Registre el resultado solicitado, la rama/worktree actual, la propiedad de los archivos, los cambios completados, las comprobaciones con sus resultados, los procesos/sesiones propios y el siguiente paso pendiente. No guarde credenciales ni volcados arbitrarios de código fuente. Marque una funcionalidad como completada solo cuando se hayan verificado sus criterios de aceptación.

Al reanudar, revise el estado de Git, el progreso más reciente y el código fuente relevante antes de editar. Reutilice los recursos propios compatibles; inicie un servidor de desarrollo solo cuando la siguiente comprobación lo necesite. Elija las comprobaciones según su impacto usando [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), en lugar de repetir una pasada completa sin cambios.

Mantenga el trabajo delegado relacionado acotado y sin solapamientos. Un solo agente se encarga de las comprobaciones pesadas y de las sesiones del navegador. Actualice el estado persistente cuando una parte completada, un bloqueo o un traspaso cambie lo que necesita saber la siguiente persona que contribuya; no registre mecánicamente cada comando.
