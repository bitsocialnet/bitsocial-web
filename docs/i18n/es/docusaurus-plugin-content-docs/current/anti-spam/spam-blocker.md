---
title: Spam Blocker
description: Servicio centralizado de detección de spam con puntuación de riesgos, desafíos de OAuth y umbrales de niveles configurables.
sidebar_position: 1
---

# Spam Blocker

:::warning Nomenclatura heredada
Este paquete se publicó originalmente bajo el alcance `@plebbit`. Se le ha cambiado el nombre a `@bitsocial/spam-blocker-server` y `@bitsocial/spam-blocker-challenge`. Es posible que aún aparezcan referencias a los nombres antiguos en documentación o bases de código más antiguas.
:::

Spam Blocker es un servicio centralizado de detección de spam que evalúa las publicaciones entrantes y asigna puntuaciones de riesgo. Consta de dos paquetes:

- **`@bitsocial/spam-blocker-server`**: el servidor HTTP que aloja las API de evaluación y desafío.
- **`@bitsocial/spam-blocker-challenge`**: un paquete de cliente liviano que las comunidades integran para enviar publicaciones para su evaluación.

**Código fuente:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Cómo funciona la puntuación de riesgo

Cada publicación enviada al punto final `/evaluate` recibe una puntuación de riesgo numérica. La puntuación es una combinación ponderada de varias señales:

| Señal                                 | Descripción                                                                                                                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Antigüedad de la cuenta               | Las cuentas más nuevas reciben puntuaciones de riesgo más altas.                                                                                                                   |
| Karma                                 | El karma comunitario acumulado reduce el riesgo.                                                                                                                                   |
| Reputación del autor                  | Datos de reputación recopilados por el indexador de red en segundo plano.                                                                                                          |
| Análisis de contenido                 | Heurística a nivel de texto (densidad de enlaces, patrones de spam conocidos, etc.).                                                                                               |
| Velocidad                             | Las publicaciones sucesivas y rápidas del mismo autor aumentan el riesgo.                                                                                                          |
| Inteligencia de propiedad intelectual | Geolocalización a nivel de país y búsquedas de fuentes de amenazas. Solo se almacenan los códigos de país; las direcciones IP sin procesar nunca se comparten con las comunidades. |

## Umbrales de nivel

La puntuación de riesgo se asigna a uno de los cuatro niveles configurables que determinan lo que sucede a continuación:

1. **Aceptar automáticamente**: la puntuación es lo suficientemente baja como para que la publicación se apruebe sin ningún desafío.
2. **Suficiente con OAuth**: el autor debe completar una verificación de OAuth para continuar.
3. **OAuth-plus-more** -- OAuth por sí solo no es suficiente; Se requiere verificación adicional (por ejemplo, CAPTCHA).
4. **Rechazo automático**: la puntuación es demasiado alta; la publicación es rechazada de plano.

Todos los valores de umbral son configurables por comunidad.

## Flujo de desafío

Cuando una publicación cae en un nivel que requiere verificación, comienza el flujo del desafío:

1. Primero se le solicita al autor que se autentique a través de **OAuth** (GitHub, Google, Twitter y otros proveedores compatibles).
2. Si OAuth por sí solo no es suficiente (nivel 3), se presenta un **CAPTCHA alternativo** impulsado por Cloudflare Turnstile.
3. La identidad OAuth se utiliza únicamente para verificación; **nunca se comparte** con la comunidad ni con otros usuarios.

## Puntos finales API

### `POST /evaluate`

Presentar una publicación para evaluación de riesgos. Devuelve la puntuación de riesgo calculada y el nivel de desafío requerido.

### `POST /challenge/verify`

Envíe el resultado de un desafío completado (token OAuth, solución CAPTCHA o ambos) para su verificación.

### `GET /iframe/:sessionId`

Devuelve una página HTML incrustable que representa la interfaz de usuario de desafío adecuada para la sesión determinada.

## Limitación de tasa

Los límites de tarifas se aplican dinámicamente según la edad y la reputación del autor. Los autores más nuevos o de menor reputación enfrentan límites más estrictos, mientras que los autores establecidos disfrutan de umbrales más generosos. Esto evita inundaciones de spam sin penalizar a los participantes de confianza.

## Indexador de red en segundo plano

El servidor ejecuta un indexador en segundo plano que rastrea continuamente la red para crear y mantener datos de reputación de los autores. Estos datos ingresan directamente al proceso de calificación de riesgos, lo que permite que el sistema reconozca a los participantes repetidos de buena fe en todas las comunidades.

## Privacidad

Spam Blocker está diseñado teniendo en cuenta la privacidad:

- Las identidades de OAuth se utilizan únicamente para la verificación de desafíos y **nunca se divulgan** a las comunidades.
- Las direcciones IP se resuelven en **códigos de país únicamente**; Las IP sin procesar no se almacenan ni se comparten.

## Base de datos

El servidor utiliza **SQLite** (a través de `better-sqlite3`) para la persistencia local de los datos de reputación, el estado de la sesión y la configuración.
