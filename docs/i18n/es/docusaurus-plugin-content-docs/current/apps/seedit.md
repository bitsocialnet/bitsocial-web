---
title: Seedit
description: Un foro descentralizado y sin servidor estilo Reddit construido sobre el protocolo Bitsocial donde cualquiera puede crear y poseer comunidades.
sidebar_position: 2
---

# Seedit

Seedit es una alternativa sin servidor, sin administrador y totalmente descentralizada al antiguo Reddit, construida sobre el protocolo Bitsocial. Les brinda a los usuarios propiedad total sobre sus comunidades: cualquiera puede crear una y varias comunidades pueden competir por la misma ruta corta, como `/s/funny`.

## Descargas

| Plataforma | Enlace                                                     |
| ---------- | ---------------------------------------------------------- |
| Web        | [seedit.app](https://seedit.app)                           |
| Web (ENS)  | `seedit.eth` a través del navegador Brave o IPFS Companion |
| Escritorio | Disponible para Mac, Windows y Linux                       |
| Móvil      | Disponible para Android                                    |

## Cómo funcionan las comunidades

Seedit organiza el contenido en comunidades similares a los subreddits. Cada comunidad es propiedad de su creador y opera sin administración centralizada. Varias comunidades pueden competir por la misma ruta de [directorio](/directories/), como `/s/funny`, que abre la ganadora actual. Las suscripciones y los enlaces a publicaciones siempre apuntan a la comunidad exacta.

### Creando una comunidad

Hay dos formas de crear una nueva comunidad:

1. **Cliente de escritorio**: utilice la GUI integrada en la aplicación de escritorio para instalar y configurar su comunidad.
2. **bitsocial-cli**: ejecuta la herramienta CLI para crear y administrar comunidades desde la línea de comandos.

### Lista de comunidades predeterminada

Las cuentas nuevas se suscriben a una lista predeterminada de direcciones exactas de comunidades, definida en `seedit-default-subscriptions.json` en el repositorio [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Las comunidades candidatas de los directorios figuran en los archivos `seedit-directories/seedit-<code>-directory.json` del mismo repositorio. Para agregar su comunidad a cualquiera de las dos listas, envíe un pull request con los detalles de su comunidad.

## Enlaces

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegrama**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licencia**: solo GPL-2.0
