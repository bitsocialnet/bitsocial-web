---
title: CLI
description: Interfaz de línea de comandos para ejecutar un nodo Bitsocial, crear comunidades y gestionar operaciones de protocolo.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Este paquete actualmente utiliza convenciones de nomenclatura heredadas de su dependencia ascendente. Las referencias a "plebbit" en comandos, resultados y configuración se migrarán a "bitsocial" en una versión futura. La funcionalidad no se ve afectada.
:::

`bitsocial-cli` es una herramienta de línea de comandos para interactuar con el backend del protocolo Bitsocial. Le permite ejecutar un demonio P2P local, crear y configurar comunidades y publicar contenido, todo desde la terminal.

Está construido sobre `plebbit-js` y lo utilizan [5chan](/apps/5chan/) y [Seeditar](/apps/seedit/) para la creación de comunidades y la gestión de nodos.

## Instalación

Los archivos binarios prediseñados están disponibles para Windows, macOS y Linux. Descargue la última versión para su plataforma desde GitHub:

**[Descargar desde versiones de GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Después de la descarga, haga el binario ejecutable (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Ejecutando el demonio

El uso más común de la CLI es ejecutar un nodo Bitsocial. El demonio inicia la capa de red P2P y expone una API local a la que los clientes pueden conectarse.

```bash
bitsocial-cli daemon
```

En el primer lanzamiento, el demonio genera enlaces a **WebUI**, una interfaz gráfica basada en navegador para administrar su nodo, comunidades y configuraciones. Esto es útil si prefiere una GUI a los comandos de terminal.

## Comandos clave

| Comando             | Descripción                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| `daemon`            | Iniciar el nodo P2P de Bitsocial                                          |
| `create subplebbit` | Crear una nueva comunidad                                                 |
| `subplebbit edit`   | Actualizar la configuración de la comunidad (título, descripción, reglas) |
| `subplebbit list`   | Listar comunidades alojadas en este nodo                                  |
| `subplebbit start`  | Comience a servir a una comunidad específica                              |
| `subplebbit stop`   | Dejar de servir a una comunidad específica                                |

Ejecute cualquier comando con `--help` para ver las opciones e indicadores disponibles:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Flujo de trabajo típico

Un flujo de configuración común para albergar una nueva comunidad:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

La comunidad ahora está activa en la red Bitsocial y es accesible desde cualquier cliente compatible.

## Enlaces

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
