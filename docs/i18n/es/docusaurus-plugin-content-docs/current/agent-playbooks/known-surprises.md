# Sorpresas conocidas

Este archivo rastrea los puntos de confusión específicos del repositorio que causaron errores del agente.

## Criterios de entrada

Agregue una entrada solo si todas son verdaderas:

- Es específico de este repositorio (no es un consejo genérico).
- Es probable que se repita para futuros agentes.
- Tiene una mitigación concreta que se puede seguir.

Si no está seguro, consulte al desarrollador antes de agregar una entrada.

## Plantilla de entrada

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entradas

### Portless cambia la URL canónica de la aplicación local

- **Fecha:** 2026-03-18
- **Observado por:** Códice
- **Contexto:** Verificación del navegador y flujos de humo.
- **Lo sorprendente:** La URL local predeterminada no es el puerto habitual de Vite. El repositorio espera `https://bitsocial.localhost` a través de Portless, por lo que al verificar `localhost:3000` o `localhost:5173` se puede encontrar la aplicación incorrecta o no encontrar nada en absoluto.
- **Impacto:** Las comprobaciones del navegador pueden fallar o validar el destino incorrecto incluso cuando el servidor de desarrollo está en buen estado.
- **Mitigación:** Utilice `https://bitsocial.localhost` primero. Solo omítalo con `PORTLESS=0 corepack yarn start` cuando necesites explícitamente un puerto Vite directo.
- **Estado:** confirmado

### Los ganchos de confirmación bloquean las confirmaciones no interactivas

- **Fecha:** 2026-03-18
- **Observado por:** Códice
- **Contexto:** Flujos de trabajo de confirmación impulsados por agentes
- **Lo sorprendente:** `git commit` activa Commitizen a través de Husky y espera la entrada TTY interactiva, lo que bloquea los shells de agentes no interactivos.
- **Impacto:** Los agentes pueden detenerse indefinidamente durante lo que debería ser una confirmación normal.
- **Mitigación:** Utilice `git commit --no-verify -m "message"` para confirmaciones creadas por el agente. Los humanos todavía pueden usar `corepack yarn commit` o `corepack yarn exec cz`.
- **Estado:** confirmado

### Se requiere Corepack para evitar Yarn classic

- **Fecha:** 2026-03-19
- **Observado por:** Códice
- **Contexto:** Migración del administrador de paquetes a Yarn 4
- **Lo sorprendente:** La máquina todavía tiene una instalación global de Yarn clásica en `PATH`, por lo que ejecutar `yarn` simple puede resolverse en v1 en lugar de la versión anclada de Yarn 4.
- **Impacto:** Los desarrolladores pueden omitir accidentalmente la fijación del administrador de paquetes del repositorio y obtener un comportamiento de instalación diferente o una salida del archivo de bloqueo.
- **Mitigación:** Utilice `corepack yarn ...` para comandos de shell o ejecute `corepack enable` primero para que `yarn` se resuelva en la versión anclada de Yarn 4.
- **Estado:** confirmado

### Se corrigieron los nombres de las aplicaciones Portless que chocan entre los árboles de trabajo web de Bitsocial

- **Fecha:** 2026-03-30
- **Observado por:** Códice
- **Contexto:** Iniciando `yarn start` en un árbol de trabajo web de Bitsocial mientras otro árbol de trabajo ya estaba sirviendo a través de Portless
- **Lo sorprendente:** El uso literal del nombre de la aplicación sin puerto `bitsocial` en cada árbol de trabajo hace que la ruta en sí colisione, incluso cuando los puertos de respaldo son diferentes, por lo que el segundo proceso falla porque `bitsocial.localhost` ya está registrado.
- **Impacto:** Las ramas web paralelas de Bitsocial pueden bloquearse entre sí, aunque Portless está diseñado para permitirles coexistir de forma segura.
- **Mitigación:** Mantenga el inicio sin puerto detrás de `scripts/start-dev.mjs`, que ahora utiliza una ruta `*.bitsocial.localhost` con ámbito de rama fuera del caso canónico y recurre a una ruta con ámbito de rama cuando el nombre básico `bitsocial.localhost` ya está ocupado.
- **Estado:** confirmado

### Vista previa de documentos utilizada para codificar el puerto 3001

- **Fecha:** 2026-03-30
- **Observado por:** Códice
- **Contexto:** Ejecutando `yarn start` junto con otros repositorios y agentes locales
- **Lo sorprendente:** El comando root dev ejecutó el espacio de trabajo de documentos con `docusaurus start --port 3001`, por lo que toda la sesión de desarrollo fallaba cada vez que otro proceso ya poseía `3001`, a pesar de que la aplicación principal ya usaba Portless.
- **Impacto:** `yarn start` podría finalizar el proceso web inmediatamente después de su inicio, interrumpiendo el trabajo local no relacionado debido a una colisión de puerto de documentos.
- **Mitigación:** Mantenga el inicio de documentos detrás de `yarn start:docs`, que ahora usa Portless más `scripts/start-docs.mjs` para respetar un puerto libre inyectado o recurrir al siguiente puerto disponible cuando se ejecuta directamente.
- **Estado:** confirmado

### Documentos fijos El nombre de host sin puerto estaba codificado

- **Fecha:** 2026-04-03
- **Observado por:** Códice
- **Contexto:** Ejecutar `yarn start` en un árbol de trabajo web secundario de Bitsocial mientras otro árbol de trabajo ya estaba entregando documentos a través de Portless.
- **Lo sorprendente:** `start:docs` aún registraba el nombre de host literal `docs.bitsocial.localhost`, por lo que `yarn start` podría fallar a pesar de que la aplicación about ya sabía cómo evitar colisiones de rutas sin puerto para su propio nombre de host.
- **Impacto:** Los árboles de trabajo paralelos no podían usar de manera confiable el comando root dev porque el proceso de documentos salió primero y `concurrently` luego cerró el resto de la sesión.
- **Mitigación:** Mantener el inicio de documentos detrás de `scripts/start-docs.mjs`, que ahora deriva el mismo nombre de host Portless con alcance de rama que la aplicación acerca de e inyecta esa URL pública compartida en el destino del proxy de desarrollo `/docs`.
- **Estado:** confirmado

### Los shells de Worktree pueden perder la versión de Nodo anclada del repositorio

- **Fecha:** 2026-04-03
- **Observado por:** Códice
- **Contexto:** Ejecutar `yarn start` en árboles de trabajo de Git como `.claude/worktrees/*` o checkouts de árboles de trabajo hermanos
- **Lo que fue sorprendente:** Algunos shells de árbol de trabajo resolvieron `node` y `yarn node` en el nodo Homebrew `25.2.1` a pesar de que el repositorio fija `22.12.0` en `.nvmrc`, por lo que `yarn start` podría ejecutar silenciosamente los lanzadores de desarrollo en el tiempo de ejecución incorrecto.
- **Impacto:** El comportamiento del servidor de desarrollo puede variar entre el proceso de pago principal y los árboles de trabajo, lo que dificulta la reproducción de errores y viola la cadena de herramientas esperada del Nodo 22 del repositorio.
- **Mitigación:** Mantenga los lanzadores de desarrollo detrás de `scripts/start-dev.mjs` y `scripts/start-docs.mjs`, que ahora se vuelven a ejecutar en el binario del nodo `.nvmrc` cuando el shell actual tiene la versión incorrecta. La configuración de Shell aún debería preferir `nvm use`.
- **Estado:** confirmado

### Los restos de `docs-site/` pueden ocultar la fuente de documentos que faltan después de la refactorización

- **Fecha:** 2026-04-01
- **Observado por:** Códice
- **Contexto:** Limpieza de monorepo posterior a la fusión después de mover el proyecto Docusaurus de `docs-site/` a `docs/`
- **Lo sorprendente:** La antigua carpeta `docs-site/` puede permanecer en el disco con archivos obsoletos pero importantes como `i18n/`, incluso después de que el repositorio rastreado se haya movido a `docs/`. Eso hace que la refactorización parezca duplicada localmente y puede ocultar el hecho de que las traducciones de los documentos rastreados en realidad no se movieron a `docs/`.
- **Impacto:** Los agentes pueden eliminar la carpeta antigua como “basura” y perder accidentalmente la única copia local de las traducciones de documentos, o seguir editando scripts que aún apuntan a la ruta inactiva `docs-site/`.
- **Mitigación:** Trate a `docs/` como el único proyecto de documentos canónicos. Antes de eliminar cualquier resto local de `docs-site/`, restaure la fuente rastreada como `docs/i18n/` y actualice los scripts y enlaces para dejar de hacer referencia a `docs-site`.
- **Estado:** confirmado

### La vista previa de documentos multilocal puede aumentar la RAM durante la verificación

- **Fecha:** 2026-04-01
- **Observado por:** Códice
- **Contexto:** Corrección de documentos i18n, enrutamiento local y comportamiento de Pagefind con `yarn start:docs` plus Playwright
- **Lo que fue sorprendente:** El modo de vista previa de documentos predeterminado ahora realiza una compilación completa de documentos multilocales más la indexación de Pagefind antes de publicarlos, y mantener vivo ese proceso junto con múltiples sesiones de Playwright o Chrome puede consumir mucha más RAM que un bucle de desarrollo normal de Vite o Docusaurus de una sola configuración regional.
- **Impacto:** La máquina puede sufrir limitaciones de memoria, las sesiones del navegador pueden fallar y las ejecuciones interrumpidas pueden dejar servidores de documentos obsoletos o navegadores sin cabeza que siguen consumiendo memoria.
- **Mitigación:** Para trabajos de documentos que no necesitan ruta local o verificación de Pagefind, prefiera `DOCS_START_MODE=live yarn start:docs`. Utilice la vista previa multilocal predeterminada solo cuando necesite validar rutas traducidas o Pagefind. Mantenga una única sesión de Playwright, cierre las sesiones antiguas del navegador antes de abrir otras nuevas y detenga el servidor de documentos después de la verificación si ya no lo necesita.
- **Estado:** confirmado
