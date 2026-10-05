# Sorpresas conocidas

Este archivo recopila los puntos de confusión propios de este repositorio que han provocado errores de agentes.

## Criterios de entrada

Añada una entrada solo si se cumple todo lo siguiente:

- Es específica de este repositorio (no un consejo genérico).
- Es probable que vuelva a afectar a agentes futuros.
- Tiene una mitigación concreta que se puede seguir.

Si tiene dudas, consulte con el desarrollador antes de añadir una entrada.

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

### Los dominios de producción de las apps en Vercel pueden volver a servir despliegues de Git master

- **Fecha:** 2026-04-28
- **Observado por:** Tommaso + Codex
- **Contexto:** Verificación de los espejos de las apps Seedit y 5chan en el directorio de apps de Bitsocial Web.
- **Qué resultó sorprendente:** Los proyectos `seedit` y `5chan` de Vercel tenían `gitProviderOptions.createDeployments = "enabled"`, así que los push a `master` en GitHub se promovían a los dominios de producción, aunque la política del repositorio espera que los espejos de producción sirvan únicamente artefactos de release.
- **Impacto:** Las insignias de espejo verificado del directorio de apps pueden volverse falsas, porque los dominios de producción sirven el commit de desarrollo más reciente en lugar del ZIP de release de GitHub cuyo hash de `index.html` está registrado en `about/src/lib/apps-data.ts`.
- **Mitigación:** Antes de añadir o actualizar los metadatos de verificación de un espejo, revise el proyecto de Vercel con `vercel api /v9/projects/<project-id>` y confirme que `gitProviderOptions.createDeployments = "disabled"`. Despliegue el contenido del ZIP de release con `vercel deploy --prebuilt --prod` y use `seedit-omega.vercel.app` o `5chan-omega.vercel.app` para los despliegues de desarrollo.
- **Estado:** confirmado

### Portless 0.11 reutiliza el estado antiguo del proxy salvo que el lanzador fuerce HTTPS

- **Fecha:** 2026-04-28
- **Observado por:** Tommaso + Codex
- **Contexto:** Migración del flujo normal de `yarn start` desde la antigua URL de proxy `http://bitsocial.localhost:1355` hacia `https://bitsocial.localhost`.
- **Qué resultó sorprendente:** Incluso con `portless@0.11.1` instalado, Portless reutilizaba el proxy HTTP existente en `~/.portless/proxy.port = 1355` e imprimía la URL antigua con `:1355`.
- **Impacto:** No basta con actualizar las versiones de los paquetes y la documentación; `yarn start` puede seguir anunciando y usando la URL antigua cuando el colaborador tiene un estado antiguo de Portless en ejecución.
- **Mitigación:** Mantenga los scripts de arranque de forma que inicien explícitamente el proxy HTTPS de Portless en el puerto `443` antes de registrar las rutas de las apps, para que el flujo en ejecución abandone el estado persistido en `1355` en vez de heredarlo.
- **Estado:** confirmado

### Portless cambia la URL local canónica de la app

- **Fecha:** 2026-03-18
- **Observado por:** Codex
- **Contexto:** Verificación en el navegador y flujos de humo
- **Qué resultó sorprendente:** La URL local predeterminada no es el puerto habitual de Vite. El repositorio espera `https://bitsocial.localhost` a través de Portless, así que consultar `localhost:3000` o `localhost:5173` puede dar con la app equivocada o con nada.
- **Impacto:** Las comprobaciones en el navegador pueden fallar o validar el destino equivocado incluso con el servidor de desarrollo funcionando correctamente.
- **Mitigación:** Use `https://bitsocial.localhost` en primer lugar. Sáltelo con `PORTLESS=0 corepack yarn start` solo cuando necesite expresamente un puerto directo de Vite.
- **Estado:** confirmado

### Los hooks de Commitizen bloquean los commits no interactivos

- **Fecha:** 2026-03-18
- **Observado por:** Codex
- **Contexto:** Flujos de commit dirigidos por agentes
- **Qué resultó sorprendente:** `git commit` invoca Commitizen a través de Husky y espera entrada interactiva por TTY, lo que deja colgadas las shells no interactivas de los agentes.
- **Impacto:** Los agentes pueden quedarse bloqueados indefinidamente durante lo que debería ser un commit normal.
- **Mitigación:** Use `git commit --no-verify -m "message"` para los commits creados por agentes. Las personas pueden seguir usando `corepack yarn commit` o `corepack yarn exec cz`.
- **Estado:** confirmado

### Corepack es imprescindible para no acabar en Yarn classic

- **Fecha:** 2026-03-19
- **Observado por:** Codex
- **Contexto:** Migración del gestor de paquetes a Yarn 4
- **Qué resultó sorprendente:** La máquina todavía tiene una instalación global de Yarn classic en el `PATH`, así que ejecutar `yarn` a secas puede resolver a la v1 en lugar de a la versión fijada de Yarn 4.
- **Impacto:** Se puede saltar accidentalmente el anclaje del gestor de paquetes del repositorio y obtener un comportamiento de instalación o un lockfile distintos.
- **Mitigación:** Use `corepack yarn ...` en los comandos de shell, o ejecute antes `corepack enable` para que `yarn` a secas resuelva a la versión fijada de Yarn 4.
- **Estado:** confirmado

### Los nombres fijos de app de Portless colisionan entre worktrees de Bitsocial Web

- **Fecha:** 2026-03-30
- **Observado por:** Codex
- **Contexto:** Ejecutar `yarn start` en un worktree de Bitsocial Web mientras otro worktree ya servía a través de Portless
- **Qué resultó sorprendente:** Usar el nombre literal de app `bitsocial` en todos los worktrees hace que colisione la propia ruta, aunque los puertos de respaldo sean distintos, así que el segundo proceso falla porque `bitsocial.localhost` ya está registrado.
- **Impacto:** Ramas paralelas de Bitsocial Web pueden bloquearse entre sí, justo lo contrario de lo que Portless debería permitir.
- **Mitigación:** Mantenga el arranque de Portless dentro de `scripts/start-dev.mjs`, que ahora usa una ruta `*.bitsocial.localhost` acotada a la rama fuera del caso canónico y recurre a una ruta por rama cuando el nombre `bitsocial.localhost` a secas ya está ocupado.
- **Estado:** confirmado

### La vista previa de la documentación fijaba el puerto 3001 en el código

- **Fecha:** 2026-03-30
- **Observado por:** Codex
- **Contexto:** Ejecutar `yarn start` junto a otros repositorios y agentes locales
- **Qué resultó sorprendente:** El comando de desarrollo raíz ejecutaba el workspace de documentación con `docusaurus start --port 3001`, así que toda la sesión de desarrollo fallaba cuando otro proceso ya ocupaba el `3001`, aunque la app principal ya usara Portless.
- **Impacto:** `yarn start` podía matar el proceso web justo después de arrancarlo, interrumpiendo trabajo local ajeno por una colisión de puerto de la documentación.
- **Mitigación:** Mantenga el arranque de la documentación dentro de `yarn start:docs`, que ahora usa Portless junto con `scripts/start-docs.mjs` para respetar un puerto libre inyectado o pasar al siguiente puerto disponible cuando se ejecuta directamente.
- **Estado:** confirmado

### El hostname de Portless para la documentación estaba fijado en el código

- **Fecha:** 2026-04-03
- **Observado por:** Codex
- **Contexto:** Ejecutar `yarn start` en un worktree secundario de Bitsocial Web mientras otro worktree ya servía la documentación a través de Portless
- **Qué resultó sorprendente:** `start:docs` seguía registrando el hostname literal `docs.bitsocial.localhost`, así que `yarn start` podía fallar aunque la app about ya supiera evitar las colisiones de rutas de Portless para su propio hostname.
- **Impacto:** Los worktrees paralelos no podían usar el comando de desarrollo raíz de forma fiable, porque el proceso de documentación salía primero y `concurrently` mataba después el resto de la sesión.
- **Mitigación:** Mantenga el arranque de la documentación dentro de `scripts/start-docs.mjs`, que ahora deriva el mismo hostname de Portless acotado a la rama que la app about e inyecta esa URL pública compartida como destino del proxy de desarrollo de `/docs`.
- **Estado:** confirmado

### Las shells de los worktrees pueden no usar la versión de Node fijada por el repositorio

- **Fecha:** 2026-04-03
- **Observado por:** Codex
- **Contexto:** Ejecutar `yarn start` en worktrees de Git como `.claude/worktrees/*` o en checkouts de worktrees hermanos
- **Qué resultó sorprendente:** Algunas shells de worktree resolvían `node` y `yarn node` al Node `25.2.1` de Homebrew aunque el repositorio fija la versión `22.12.0` en `.nvmrc`, así que `yarn start` podía ejecutar los lanzadores de desarrollo bajo el runtime equivocado sin avisar.
- **Impacto:** El comportamiento del servidor de desarrollo puede divergir entre el checkout principal y los worktrees, lo que dificulta reproducir errores e incumple la cadena de herramientas Node 22 que el repositorio espera.
- **Mitigación:** Mantenga los lanzadores de desarrollo dentro de `scripts/start-dev.mjs` y `scripts/start-docs.mjs`, que ahora se re-ejecutan con el binario de Node indicado en `.nvmrc` cuando la shell actual está en otra versión. La configuración de la shell debería seguir prefiriendo `nvm use`.
- **Estado:** confirmado

### Los restos de `docs-site/` pueden ocultar la falta de fuentes de documentación tras la refactorización

- **Fecha:** 2026-04-01
- **Observado por:** Codex
- **Contexto:** Limpieza del monorepo tras el merge que movió el proyecto de Docusaurus de `docs-site/` a `docs/`
- **Qué resultó sorprendente:** La carpeta antigua `docs-site/` puede seguir en disco con archivos obsoletos pero importantes, como `i18n/`, incluso después de que el repositorio versionado pasara a `docs/`. Eso hace que la refactorización parezca duplicada en local y puede ocultar que las traducciones de documentación versionadas nunca se movieron realmente a `docs/`.
- **Impacto:** Un agente puede borrar la carpeta antigua por considerarla “basura” y perder sin querer la única copia local de las traducciones de la documentación, o seguir editando scripts que aún apuntan a la ruta muerta `docs-site/`.
- **Mitigación:** Trate `docs/` como el único proyecto de documentación canónico. Antes de borrar cualquier resto local de `docs-site/`, restaure las fuentes versionadas como `docs/i18n/` y actualice scripts y hooks para que dejen de referenciar `docs-site`.
- **Estado:** confirmado

### La vista previa multiidioma de la documentación puede disparar el consumo de RAM durante la verificación

- **Fecha:** 2026-04-01
- **Observado por:** Codex
- **Contexto:** Corrección de la i18n de la documentación, el enrutado por idioma y el comportamiento de Pagefind con `yarn start:docs` más Playwright
- **Qué resultó sorprendente:** El modo predeterminado de vista previa de la documentación ahora hace una compilación multiidioma completa más la indexación de Pagefind antes de servir, y mantener ese proceso vivo junto a varias sesiones de Playwright o Chrome puede consumir mucha más RAM que un bucle normal de desarrollo de Vite o de Docusaurus en un solo idioma.
- **Impacto:** La máquina puede quedarse sin memoria, las sesiones de navegador pueden caerse y las ejecuciones interrumpidas pueden dejar atrás servidores de documentación o navegadores headless obsoletos que siguen consumiendo memoria.
- **Mitigación:** Para trabajo de documentación que no necesite verificar rutas por idioma ni Pagefind, prefiera `DOCS_START_MODE=live yarn start:docs`. Use la vista previa multiidioma predeterminada solo cuando necesite validar rutas traducidas o Pagefind. Mantenga una única sesión de Playwright, cierre las sesiones de navegador antiguas antes de abrir nuevas y detenga el servidor de documentación tras la verificación si ya no lo necesita.
- **Estado:** confirmado

### `translate-docs.py` puede dejar idiomas a medio traducir o con destinos de enlace rotos

- **Fecha:** 2026-04-06
- **Observado por:** Codex
- **Contexto:** Corrección de las rutas y el contenido localizados de la documentación después de que `yarn start:docs` sirviera páginas de detalle en inglés o no lograra compilar la salida por idioma
- **Qué resultó sorprendente:** La cadena de traducción de la documentación tenía dos modos de fallo propios del repositorio a la vez: `scripts/translate-docs.py` extraía solo un pequeño subconjunto de los mensajes de `DocsHome` cuando las llamadas `tr(...)` usaban formas que no sabía analizar, y el markdown traducido bajo `docs/i18n/**` podía contener slugs traducidos automáticamente o restos de `ZXQPLACEHOLDER` dentro de los destinos de los enlaces.
- **Impacto:** Las páginas de inicio localizadas pueden caer silenciosamente al inglés, las páginas de detalle localizadas pueden aparecer sin traducir, y un `yarn docs:build` completo puede fallar por enlaces rotos por idioma aunque la documentación de origen sea válida.
- **Mitigación:** Después de cambiar traducciones de documentación o de regenerar los archivos por idioma, ejecute siempre `yarn docs:build` desde la raíz del repositorio, revise el markdown de `docs/i18n/**` en busca de `ZXQPLACEHOLDER` y compruebe que los enlaces traducidos siguen apuntando a slugs canónicos como `/apps/5chan/` en lugar de a rutas de URL traducidas. Si cambió el texto de `DocsHome`, confirme que `scripts/translate-docs.py` sigue extrayendo todos los mensajes `docs.home.*`.
- **Estado:** confirmado

### Las comprobaciones sin JS del sitio about deben usar la ruta de Portless, no una vista previa SSR independiente

- **Fecha:** 2026-04-12
- **Observado por:** Codex
- **Contexto:** Verificación del soporte sin JS del sitio `about/` desde el worktree de una rama
- **Qué resultó sorprendente:** Una vista previa SSR independiente puede parecer sana mientras la ruta real de Portless acotada a la rama sigue sirviendo el shell equivocado de la app o un proceso más antiguo. En este repositorio, el contrato local real es el hostname de Portless que da `yarn start`, no un servidor de vista previa improvisado.
- **Impacto:** Un agente puede afirmar erróneamente que el soporte sin JS funciona, o pasar por alto regresiones que solo se manifiestan en `*.bitsocial.localhost`.
- **Mitigación:** Para verificar `about/` en el navegador, arranque siempre el servidor local real con `yarn start` o `yarn start:about` y pruebe primero la URL de Portless acotada a la rama. Si un hostname de Portless parece obsoleto, inspecte y detenga el proceso antiguo antes de repetir la prueba.
- **Estado:** confirmado

### `chain/` era invisible para `yarn build:verify` y `yarn doctor`

- **Fecha:** 2026-07-05
- **Observado por:** Codex
- **Contexto:** Verificación de un diff que solo tocaba chain/ después de añadir al monorepo el workspace `chain/` (app Vite independiente para `chain.bitsocial.net`).
- **Qué resultó sorprendente:** `scripts/verify-build.mjs` solo reconocía los prefijos de ruta `about/`, `docs/` y `stats/`, así que un diff que solo tocaba chain/ imprimía "No targeted build checks matched the current diff" y no ejecutaba ninguna compilación, aunque `build:chain` ya existiera en el `package.json` raíz. Aparte, `yarn doctor` estaba fijado a `react-doctor about -y`, de modo que los cambios de React bajo `chain/src` no recibían ninguna cobertura de React Doctor.
- **Impacto:** Los agentes que verificaban cambios en chain tenían que saber que debían llamar directamente a `yarn build:chain` en lugar de fiarse de `yarn build:verify`, y los problemas de React en `chain/src` (efectos, hooks, código muerto) pasaban desapercibidos para `yarn doctor`.
- **Mitigación:** `scripts/verify-build.mjs` ya tiene una rama para `chain/` que refleja la de `about/`, y `doctor` y `doctor:verbose` ejecutan ahora `react-doctor --project about,chain -y` en una sola invocación. `doctor:score` sigue limitado a `about` porque `--score` no imprime nada, sin avisar, cuando se combina con `--project` para más de un proyecto; use `yarn react-doctor --project about,chain --verbose -y` (o `--json`) si necesita una puntuación de chain.
- **Estado:** confirmado

### El P2P en el navegador funciona sobre WebSockets seguros; pkc-js deniega WebRTC y WebTransport por defecto

- **Fecha:** 2026-08-02
- **Observado por:** Claude
- **Contexto:** Redacción del texto de la landing page y de la documentación sobre cómo funciona el P2P de Bitsocial en el navegador
- **Qué resultó sorprendente:** `@pkcprotocol/pkc-js` incluye un connection gater predeterminado que rechaza las conexiones WebRTC y WebTransport en el navegador: `dist/browser/helia/dial-transport-filter.js` exporta `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. El comentario de su código fuente explica el motivo: en el navegador, esos transportes añaden rutas de establecimiento de conexión largas y que fallan a menudo (STUN/ICE, rotación de certhash) que ralentizan la carga, mientras que WebSocket es directo y fiable. Todos los peers activos del panel de estado P2P del blog muestran "Secure WebSocket". El gater vive en `node_modules`, así que nada en el repositorio lo insinúa.
- **Impacto:** Es facilísimo escribir texto público técnicamente verosímil pero falso; por ejemplo, atribuir a WebTransport, que alcanzó el Baseline de los navegadores en marzo de 2026, el mérito de hacer posible el P2P de Bitsocial en el navegador. Esa afirmación llegó a la landing page, a la tabla comparativa y a dos páginas de documentación antes de que el desarrollador la detectara. Las afirmaciones erróneas sobre la arquitectura en páginas públicas las comprueba exactamente el público de desarrolladores al que apunta el sitio.
- **Mitigación:** Nunca deduzca qué transportes usa Bitsocial a partir de lo que libp2p o la plataforma del navegador admiten en teoría. Consulte `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` para ver la lista de denegación vigente, confirme que no existe ninguna sobrescritura de `connectionGater` bajo `about/src/` y lea las etiquetas de transporte en vivo del panel "P2P status" del blog antes de hacer cualquier afirmación pública. El cambio upstream que realmente desbloqueó la publicación desde el navegador fue la corrección del seqno monótono de gossipsub en `@libp2p/gossipsub` 15.0.21 (mayo de 2026); pkc-js incluye actualmente la 16.0.4.
- **Estado:** confirmado

### Los enlaces relativos `./page.md` desde una página de documentación sin traducir rompen todas las compilaciones localizadas

- **Fecha:** 2026-08-02
- **Observado por:** Claude
- **Contexto:** Adición de una página nueva solo en inglés, `docs/browser-p2p.md`, que enlazaba con documentación existente mediante `./peer-to-peer-protocol.md` y `./apps/5chan.md`
- **Qué resultó sorprendente:** Cada idioma bajo `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` replica el árbol de la documentación. Una página nueva que falte en esas réplicas se sigue renderizando en todos los idiomas gracias al respaldo en inglés, pero sus enlaces markdown relativos dejan de resolverse: Docusaurus genera `/ar/browser-p2p/peer-to-peer-protocol.md/` y hace fallar la compilación con "Docusaurus found broken links!". Lo decisivo es que `yarn build:verify` y `yarn docs:build:verify` solo compilan `en` y pasan sin problemas; únicamente un `yarn docs:build` completo lo saca a la luz, y se aborta en el primer idioma por orden alfabético (`ar`).
- **Impacto:** Un cambio de documentación puede superar todas las comprobaciones locales rápidas y aun así romper la compilación multiidioma de producción. Además, el fallo parece ajeno al cambio, porque el error nombra una ruta de idioma que quien lo hizo nunca tocó.
- **Mitigación:** En cualquier página de documentación que no esté replicada en `docs/i18n/**`, use enlaces relativos a la raíz (`/peer-to-peer-protocol/`, `/apps/5chan/`) en lugar de enlaces relativos a archivos `.md`; Docusaurus les añade el prefijo de idioma automáticamente. `docs/build-your-own-client.md` es el ejemplo existente. Ejecute un `yarn docs:build` completo, no solo `build:verify`, antes de entregar cualquier cambio que añada o enlace una página de documentación.
- **Estado:** confirmado

### Las ejecuciones simultáneas de `update-translations.js` pierden claves sin avisar

- **Fecha:** 2026-08-02
- **Observado por:** Claude
- **Contexto:** Aplicación de 26 claves i18next traducidas a los 36 idiomas mediante la skill `translate`
- **Qué resultó sorprendente:** Cada invocación es una lectura-modificación-escritura sobre los 36 archivos de idioma, así que dos invocaciones simultáneas se pisan entre sí y una clave desaparece sin ningún error. La skill `translate` indica explícitamente que se lancen hasta 4 subagentes en paralelo, y cada uno llamaría al script.
- **Impacto:** Falla en silencio: hay claves que desaparecen de idiomas arbitrarios y el diff sigue pareciendo plausible.
- **Mitigación:** No deje nunca que los subagentes traductores escriban archivos de idioma de forma simultánea: haga que solo emitan archivos JSON de diccionario y aplique después cada clave en serie desde el agente padre. Tras aplicarlas, verifique por programa que cada clave existe en los 35 idiomas distintos del inglés y que ningún valor es idéntico byte a byte al original en inglés.
- **Estado:** confirmado
- **Actualización (2026-08-10):** Antes, el script también resolvía su destino como `path.join(process.cwd(), "public", "translations")`, por lo que el comando documentado desde la raíz del repositorio fallaba con "Translations directory not found" y había que ejecutarlo desde `about/`. Ahora resuelve el workspace a partir del directorio actual o de su propia ubicación, y funciona desde cualquier sitio. La trampa de concurrencia descrita arriba no ha cambiado.

### Los controles de anotación de desarrollo pueden interceptar clics automatizados

- **Contexto:** Los sitios about y chain tienen controles fijos en la esquina inferior derecha, donde en desarrollo también aparece la barra de herramientas de Agentation.
- **Mitigación:** `scripts/pw-session.sh open` registra `window.__NO_DEV_TOOLBAR__ = true` antes de recargar la página. El inicializador de Agentation también respeta `__VISUAL_TESTING__` y `__PROFILING__`; la inspección del código fuente sigue disponible de forma independiente. La automatización directa del navegador debe establecer el mismo indicador antes de cargar la aplicación.

### `skills add` instala las copias de Codex y Cursor en el directorio `.agents/`, ignorado por git

- **Fecha:** 2026-08-18
- **Observado por:** Tommaso + Claude
- **Contexto:** Instalación de la skill `improve-threejs` desde `millionco/react-doctor` con la CLI `skills` (`vercel-labs/skills`).
- **Qué resultó sorprendente:** `npx skills add <repo> --skill <name> --agent codex` y `--agent cursor` escriben ambos en `.agents/skills/<name>/`, no en `.codex/skills/` ni en `.cursor/skills/`. `AGENTS.md` prohíbe un directorio `.agents/` a nivel de repositorio y `.gitignore:29` lo ignora, así que ambas copias quedan fuera del control de versiones sin avisar. Solo `--agent claude-code` escribe en el `.claude/skills/` esperado. Por otro lado, la forma documentada separada por comas (`--agent claude-code,codex,cursor`) falla con "Invalid agents" y no instala nada, aunque cada nombre sea válido por separado.
- **Impacto:** La instalación informa de éxito mientras dos de las tres copias de las herramientas acaban en un lugar que nunca se confirmará, de modo que Codex y Cursor se quedan sin la skill tras un clon nuevo sin que nadie lo note. La forma con comas también puede producir una instalación vacía que parece un éxito.
- **Mitigación actual:** El repositorio ahora versiona `.agents/skills` como fuente canónica y genera las copias para Claude con `yarn ai-workflow:sync`. Se han eliminado la antigua prohibición de `.agents` y la regla que lo ignoraba. No copie skills nuevas en tres raíces independientes; después de añadir una skill, compruebe la paridad de lo generado y el catálogo de la aplicación.
- **Estado:** confirmado
