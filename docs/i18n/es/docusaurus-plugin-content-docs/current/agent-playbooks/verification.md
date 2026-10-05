# Verificación

Elija las comprobaciones según el comportamiento modificado y la incertidumbre que quede. Reutilice las pruebas satisfactorias obtenidas para el mismo estado final; vuelva a ejecutarlas tras ediciones relevantes o fallos. Los requisitos explícitos de CI, de la release o del usuario siguen aplicándose.

| Cambio                                                          | Comprobaciones adecuadas                                                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Solo prosa/comentarios/formato                                  | Diff, referencias, generadores relevantes; sin build de la aplicación                                                            |
| Fuentes/configuración del flujo de trabajo de IA                | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; regenerar los índices para LLM si cambió el contexto |
| Helper o script aislado                                         | Invocación/fixtures específicos y comprobaciones de sintaxis o de tipos/lint del código afectado                                 |
| Cambio en runtime compartido, dependencias, build o integración | Comprobaciones específicas de lo afectado más las comprobaciones de build/tipos/lint pertinentes que se indican abajo            |
| Solo CSS/tema/layout                                            | Rutas/viewports/temas afectados en los navegadores elegidos; build si cambiaron imports, assets o el procesamiento de CSS        |
| Estado/efectos/rendimiento de React                             | Comportamiento afectado y pautas de React aplicables; Doctor cuando sus diagnósticos resuelvan una duda concreta                 |

## Comprobaciones del proyecto

- `yarn build:verify` selecciona el workspace afectado. Si el alcance es conocido, use `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` o `yarn docs:build:verify`.
- `yarn build` ejecuta intencionadamente el build de producción completo del sitio about y de la documentación, incluidos todos los idiomas de la documentación. Úselo para validar una release completa o para cambios que justifiquen ese alcance.
- `yarn lint`, `yarn typecheck` y `yarn format:check` cubren los controles existentes del repositorio; para una edición acotada de un script, use primero sus comprobaciones específicas de sintaxis, fixtures y formato.
- Los cambios en el manifiesto o el lockfile requieren `corepack yarn install`, `yarn deps:check-pinned` y `yarn deps:check-hardened`. `yarn knip` es orientativo para dependencias e imports.
- Las comprobaciones de traducción de la documentación están en [translations.md](translations.md); no ejecute el escritor masivo de traducciones para un cambio acotado de la documentación.

## Pruebas en el navegador y responsabilidad

Use Chrome para cambios pequeños y aislados en el navegador. Añada Firefox y WebKit para CSS, layout o diseño adaptable compartidos, APIs sensibles al navegador, interacciones amplias, releases o criterios explícitos entre navegadores. Incluya los layouts móviles y el comportamiento táctil afectados. Cambiar el tamaño del viewport no equivale a emular el tacto. Elija rutas y contenidos reales a partir del código fuente en lugar de suponer que los ejemplos están disponibles.

Use `playwright-cli` a través de `./scripts/pw-session.sh`. Solo hay un navegador activo en toda la máquina; los motores seleccionados se ejecutan uno tras otro y cada sesión propia se cierra exactamente, incluso tras un fallo. Reutilice una sesión autorizada que pertenezca a quien le invoca sin cerrarla. No use nunca una limpieza global de navegadores ni detenga un servidor cuyo propietario no esté claro. El trabajo solo de documentación no necesita navegador ni servidor.

En el trabajo de rendimiento, compare el mismo flujo con un viewport, contenido, ajustes de red/CPU, modo de build y sobrecarga de medición equivalentes. Distinga las observaciones de las causas sospechadas. Use la skill de profiling cuando esas mediciones respondan a la petición real.

## Pruebas finales

Un solo agente se encarga de la verificación pesada. Revise las cargas de trabajo activas y serialice las instalaciones, los builds o suites completas, Doctor, el trabajo con Android/Electron y el profiling del navegador. Informe de los comandos y sus resultados y de las limitaciones concretas; la falta de datos o un motor omitido no cuentan como resultado satisfactorio. Los fixtures de herramientas verifican formatos y mecánica, no el descubrimiento de extremo a extremo en la aplicación ni la calidad de las decisiones del modelo.

## Comprobaciones automáticas de React

`yarn agent:verify` ejecuta los builds seleccionados seguidos de `yarn doctor:check` y `yarn perf:check`. `perf:check` incluye la autoprueba de compatibilidad del recolector y de regresión deliberada, así que ni la CI ni la ruta de verificación de agentes necesitan una pasada aparte de `perf:test`. Instale una vez las herramientas de navegador fijadas con `yarn perf:install` (`--with-deps` en la CI de Linux). Use filtros de objetivo/escenario para repeticiones específicas después de la pasada completa pertinente. Los presupuestos de los escenarios están explícitos en `scripts/react-perf/config.mjs`; conserve las pruebas y corrija una regresión antes de plantearse un cambio justificado de la línea base. Los builds de producción normales omiten Bippy; los comandos separados `build:profile:*` aportan la instrumentación oficial de profiling de React.

El escenario `apps-search` del sitio about espera, tras cada carácter, a que el valor de la URL y del campo de entrada se aplique antes de teclear el siguiente. Su resultado satisfactorio cubre esa secuencia de consultas aplicadas, no la capacidad de respuesta al teclear rápido. Use una reproducción aparte con entrada rápida cuando evalúe la pérdida de caracteres o la capacidad de respuesta de la entrada.
