---
title: Desafío de lienzo Captcha
description: Generador de captcha independiente basado en imágenes con caracteres, dimensiones y colores configurables.
sidebar_position: 2
---

# Desafío de lienzo Captcha

:::warning Legacy Naming
Este paquete se publicó originalmente bajo el alcance `@plebbit`. Se le ha cambiado el nombre a `@bitsocial/captcha-canvas-challenge`. Es posible que aún aparezcan referencias al nombre anterior en documentación o bases de código más antiguas.
:::

Captcha Canvas Challenge es un generador de captcha de imágenes independiente extraído originalmente de `plebbit-js`. Representa texto aleatorio en un lienzo HTML y devuelve la imagen resultante, que las comunidades pueden presentar a los autores como un desafío de spam.

**Código fuente:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Requisitos

- **Nodo.js** >= 22
- **Solo ESM**: este paquete no incluye compilaciones de CommonJS.
- **Dependencia del par en tiempo de ejecución:** `@plebbit/plebbit-js` (migrando a `@pkc/pkc-js`)

## Instalación

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opciones de configuración

| Opción       | Tipo     | Predeterminado | Descripción                                                         |
| ------------ | -------- | -------------- | ------------------------------------------------------------------- |
| `characters` | `number` | `6`            | Número de caracteres aleatorios representados en la imagen captcha. |
| `height`     | `number` | `100`          | Alto de la imagen generada en píxeles.                              |
| `width`      | `number` | `300`          | Ancho de la imagen generada en píxeles.                             |
| `colors`     | `string` | `#32cf7e`      | Color principal utilizado para el texto captcha.                    |

## Cómo funciona

1. El generador elige una cadena aleatoria de la longitud configurada.
2. La cadena se representa sobre un lienzo con ruido visual para resistir el OCR.
3. La imagen resultante (y la respuesta esperada) se devuelven para que la aplicación que llama pueda presentar el desafío y luego verificar la respuesta.

Debido a que el paquete es un generador de imágenes puro, no maneja la red ni la administración de sesiones por sí solo. Está pensado para integrarse en un flujo de desafíos más amplio, por ejemplo, como uno de los tipos de desafíos admitidos por [Bloqueador de spam](./spam-blocker.md).
