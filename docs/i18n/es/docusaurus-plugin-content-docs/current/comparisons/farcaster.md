---
title: Bitsocial y Farcaster
description: Cómo se compara Farcaster, con cuentas on-chain, alquiler de almacenamiento y la red de validadores Snapchain, con las comunidades peer-to-peer de Bitsocial.
---

# Bitsocial y Farcaster

[Farcaster](https://docs.farcaster.xyz/) mantiene la identidad en una blockchain y los datos
sociales fuera de ella. Las cuentas, las claves de aplicación y los pagos de almacenamiento viven en
contratos en OP Mainnet, una capa 2 de Ethereum. Las publicaciones, llamadas casts, junto con los
seguimientos y las reacciones, son mensajes firmados que almacena
[Snapchain](https://snapchain.farcaster.xyz/), una red similar a una blockchain que en 2025
sustituyó a la anterior red de Hubs de Farcaster.

## Cómo funciona Farcaster

- **Cuentas.** Una cuenta es un Farcaster ID numérico que pertenece a una dirección de Ethereum, la
  cual también puede designar una dirección de recuperación. Las aplicaciones publican con claves de
  aplicación delegadas registradas on-chain; una clave de aplicación no puede apoderarse de la
  cuenta.
- **Alquiler de almacenamiento.** Cada cuenta alquila unidades de almacenamiento, actualmente a 0,20
  dólares por unidad al año. Una unidad alquilada desde julio de 2025 admite 100 casts; por encima
  de esa cifra, se eliminan los casts más antiguos. Los límites de frecuencia escalan con el
  almacenamiento alquilado.
- **Snapchain.** Los validadores ordenan los mensajes en bloques con un consenso al estilo de
  Tendermint, y cada nodo completo guarda los datos de toda la red. Los nodos necesitan unos 16 GB
  de RAM y 2 TB de almacenamiento, según la
  [guía del nodo](https://snapchain.farcaster.xyz/getting-started).
- **Nombres.** Los nombres de usuario predeterminados, llamados fnames, son gratuitos y los emite el
  propio servidor de nombres de Farcaster, que
  [puede revocarlos](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Los usuarios
  pueden usar en su lugar un nombre `.eth` registrado en Ethereum.
- **Canales.** Los canales temáticos son una función experimental del cliente de Farcaster. Los
  casts de un canal son datos del protocolo, pero los metadatos, los seguimientos y la moderación de
  los canales
  [se almacenan en el cliente](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lectura.** Las aplicaciones leen a través de un nodo de Snapchain propio o de un proveedor
  gestionado, normalmente Neynar.

## En qué se diferencian

### Blockchains y validadores

Farcaster depende de OP Mainnet para las cuentas y los pagos, y de Snapchain, una red similar a una
blockchain, para ordenar todos los datos sociales. El conjunto de validadores de Snapchain es de
acceso restringido. Su libro blanco dice que la censura se vuelve difícil con unos diez validadores
distribuidos por todo el mundo; en octubre de 2026 su
[lista de validadores](https://snapchain.farcaster.xyz/validators) era menor, y la mayoría de las
claves pertenecían a Neynar, que
[adquirió Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) en enero de 2026.
Bitsocial no tiene cadena, validadores ni consenso.

### Pagar por publicar

Cada cuenta de Farcaster paga alquiler de almacenamiento, y el almacenamiento limita cuánto del
historial de una cuenta conserva la red. En Bitsocial, publicar no cuesta nada a nivel de protocolo;
cada comunidad decide si exige un captcha, un pago, un token u otra cosa. Consulta
[Desafíos antispam personalizados](/custom-challenges/).

### Comunidades

Los canales de Farcaster son una función del cliente: el cliente almacena sus metadatos y aplica la
moderación de los canales, de modo que un cast bloqueado en un canal puede seguir siendo válido en
la red y visible en otras aplicaciones. En Bitsocial, las comunidades son objetos del protocolo con
su propio par de claves, y el nodo de la comunidad acepta o rechaza las publicaciones.

### Operar la infraestructura

Un nodo de Farcaster guarda toda la red, así que su almacenamiento crece con toda la actividad;
Farcaster prevé un crecimiento que se acerca a los discos más grandes de la nube. Un nodo de
comunidad de Bitsocial guarda solo sus propias comunidades y funciona en hardware de consumo.

### Navegador

Una aplicación de Farcaster para navegador es un cliente HTTP de un nodo o proveedor. Una aplicación
web de Bitsocial puede ejecutar un nodo peer-to-peer dentro de la pestaña. Consulta
[Peer-to-peer en el navegador](/browser-p2p/).

## Comparación

| Pregunta                      | Farcaster                                                                                                 | Bitsocial                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Categoría                     | Identidad on-chain con datos sociales ordenados por validadores                                           | Red de comunidades peer-to-peer                                                                                          |
| Identidad                     | Farcaster ID propiedad de una dirección de Ethereum, con claves de aplicación delegadas                   | Pares de claves Ed25519 para usuarios y comunidades                                                                      |
| Dónde viven las publicaciones | Snapchain, replicado en cada nodo completo, dentro de los límites de almacenamiento pagado                | El nodo del propietario de la comunidad y los pares que la leen y la siembran                                            |
| Quién lo mantiene disponible  | Validadores de Snapchain y operadores de nodos                                                            | El nodo del propietario de la comunidad más seeders auxiliares                                                           |
| Comunidades                   | Canales experimentales gestionados por el cliente de Farcaster                                            | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                                                        |
| Control del spam              | Alquiler de almacenamiento y límites de frecuencia, más etiquetas de spam a nivel de aplicación           | El desafío de cada comunidad antes de aceptar una publicación                                                            |
| Moderación                    | Anfitriones de canal en el cliente, filtros de las aplicaciones, riesgo de censura a nivel de validadores | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                                              |
| Nombres                       | fnames gratuitos que Farcaster puede revocar, o nombres `.eth`                                            | Nombres `.bso` y `.eth` que se resuelven en claves                                                                       |
| Navegador                     | Cliente HTTP de un nodo o proveedor                                                                       | Nodo peer-to-peer dentro de una pestaña normal del navegador                                                             |
| Contrapartida principal       | Un conjunto de datos global coherente, pero alquiler, cadenas y un conjunto reducido de validadores       | Sin comisiones ni cadenas, pero sin un conjunto de datos global, y el contenido antiguo no está garantizado para siempre |
