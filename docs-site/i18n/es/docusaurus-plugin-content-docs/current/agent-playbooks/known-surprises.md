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
- **Lo sorprendente:** La URL local predeterminada no es el puerto habitual de Vite. El repositorio espera `http://bitsocial.localhost:1355` a través de Portless, por lo que al verificar `localhost:3000` o `localhost:5173` se puede encontrar la aplicación incorrecta o no encontrar nada en absoluto.
- **Impacto:** Las comprobaciones del navegador pueden fallar o validar el destino incorrecto incluso cuando el servidor de desarrollo está en buen estado.
- **Mitigación:** Utilice `http://bitsocial.localhost:1355` primero. Solo omítalo con `PORTLESS=0 corepack yarn start` cuando necesites explícitamente un puerto Vite directo.
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
- **Mitigación:** Mantenga el inicio sin puerto detrás de `scripts/start-dev.mjs`, que ahora utiliza una ruta `*.bitsocial.localhost:1355` con ámbito de rama fuera del caso canónico y recurre a una ruta con ámbito de rama cuando el nombre básico `bitsocial.localhost` ya está ocupado.
- **Estado:** confirmado

### Vista previa de documentos utilizada para codificar el puerto 3001

- **Fecha:** 2026-03-30
- **Observado por:** Códice
- **Contexto:** Ejecutando `yarn start` junto con otros repositorios y agentes locales
- **Lo sorprendente:** El comando root dev ejecutó el espacio de trabajo de documentos con `docusaurus start --port 3001`, por lo que toda la sesión de desarrollo fallaba cada vez que otro proceso ya poseía `3001`, a pesar de que la aplicación principal ya usaba Portless.
- **Impacto:** `yarn start` podría finalizar el proceso web inmediatamente después de su inicio, interrumpiendo el trabajo local no relacionado debido a una colisión de puerto de documentos.
- **Mitigación:** Mantenga el inicio de documentos detrás de `yarn start:docs`, que ahora usa Portless más `scripts/start-docs.mjs` para respetar un puerto libre inyectado o recurrir al siguiente puerto disponible cuando se ejecuta directamente.
- **Estado:** confirmado
