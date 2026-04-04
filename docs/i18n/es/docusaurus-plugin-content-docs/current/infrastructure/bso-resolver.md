---
title: BSO Resolver
description: Resuelva nombres de dominio .bso en claves públicas utilizando registros TXT de ENS, con almacenamiento en caché integrado y soporte multiplataforma.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver traduce los nombres de dominio `.bso` a sus claves públicas correspondientes leyendo los registros TXT de Bitsocial almacenados en ENS. Proporciona un cliente viem compartido, almacenamiento en caché persistente y funciona tanto en entornos Node.js como de navegador.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licencia**: solo GPL-2.0

## Instalación

```bash
npm install @bitsocial/bso-resolver
```

## Creando un solucionador

Cree una instancia del solucionador pasando un objeto de configuración al constructor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parámetro  | Requerido | Descripción                                                |
| ---------- | --------- | ---------------------------------------------------------- |
| `key`      | Sí        | Identificador de la instancia de resolución.               |
| `provider` | Sí        | Configuración de transporte (ver más abajo).               |
| `dataPath` | No        | Directorio para el archivo de caché SQLite (solo Node.js). |

### Opciones de proveedor

El parámetro `provider` acepta tres formatos:

- **`"viem"`**: utiliza el transporte público predeterminado proporcionado por viem.
- **URL HTTP(S)**: se conecta a través de un punto final JSON-RPC (por ejemplo, `https://mainnet.infura.io/v3/YOUR_KEY`).
- **URL de WebSocket**: se conecta a través de un punto final RPC de WebSocket (por ejemplo, `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Métodos

### `resolve({ name, abortSignal? })`

Busca un nombre `.bso` y devuelve la clave pública asociada. Se puede pasar un `AbortSignal` opcional para cancelar solicitudes de larga duración.

### `canResolve({ name })`

Devuelve un valor booleano que indica si el solucionador puede manejar el nombre de pila. Úselo para verificar el soporte antes de intentar una resolución completa.

### `destroy()`

Derriba el solucionador, cierra las conexiones de la base de datos y libera recursos. Llame a esto cuando el solucionador ya no sea necesario.

## Almacenamiento en caché

Los nombres resueltos se almacenan en caché automáticamente para reducir las búsquedas de red redundantes. El backend de almacenamiento en caché se elige según el entorno de ejecución:

| Medio ambiente | Servidor         | Notas                                                                 |
| -------------- | ---------------- | --------------------------------------------------------------------- |
| Nodo.js        | SQLite           | Almacenado en `dataPath`. Utiliza el modo WAL para acceso simultáneo. |
| Navegador      | DB indexado      | Utiliza transacciones nativas de IndexedDB.                           |
| Reserva        | En memoria `Map` | Se utiliza cuando ni SQLite ni IndexedDB están disponibles.           |

Todas las entradas de caché tienen un **TTL de una hora** y se eliminan automáticamente después de su vencimiento.

## Integración con pkc-js

El solucionador se puede conectar directamente a pkc-js a través de la opción `nameResolvers`, lo que permite una resolución transparente de nombres `.bso` durante las búsquedas de claves:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## concurrencia

El solucionador está diseñado para ser seguro en uso simultáneo:

- Un único cliente viem compartido evita conexiones redundantes.
- SQLite opera en modo WAL (Write-Ahead Logging), lo que permite lecturas simultáneas sin bloqueo.
- El almacenamiento en caché del navegador se basa en transacciones nativas de IndexedDB para su aislamiento.

## Puntos de entrada a la plataforma

El paquete incluye puntos de entrada separados para Node.js y compilaciones de navegador. Los paquetes que admiten el campo `exports` en `package.json` seleccionarán automáticamente el correcto.
