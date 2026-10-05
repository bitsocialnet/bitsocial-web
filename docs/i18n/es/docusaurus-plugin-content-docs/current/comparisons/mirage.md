---
title: Bitsocial y Mirage
description: Cómo se compara Mirage, un foro al estilo de Reddit sobre su propia blockchain de Cosmos SDK, con Bitsocial y su aplicación al estilo de Reddit, Seedit.
---

# Bitsocial y Mirage

[Mirage](https://mirage.foundation/) es una red de debate al estilo de Reddit con comunidades,
publicaciones con hilos y votos. En lugar de la base de datos de una empresa, funciona sobre su
propia blockchain, una cadena de Cosmos SDK con consenso CometBFT. El producto de Bitsocial más
parecido es [Seedit](/apps/seedit/), una aplicación al estilo de Reddit en la red Bitsocial, así que
la comparación trata sobre todo de cómo cada uno aloja, posee y modera las comunidades.

## Cómo funciona Mirage

- **Nodos.** Un nodo de Mirage es un único contenedor Docker que incluye un validador, una base de
  datos PostgreSQL, un indexador, una API HTTP y el frontend web. Cada nodo es también un validador.
  Para operar uno hacen falta un servidor Ubuntu en amd64 y 10.000.000 tokens MIRAGE en la cuenta
  del operador, según la
  [guía de despliegue](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publicación.** El navegador firma cada acción con la clave secp256k1 del usuario, y los usuarios
  gratuitos calculan además una pequeña prueba de trabajo. El nodo envuelve la acción en una
  transacción de la cadena y paga la comisión.
- **Lectura.** El indexador de cada nodo copia los datos de la cadena en su propia base de datos y
  sirve los feeds a través de una API HTTP. Los nodos conservan alrededor de una semana de bloques,
  así que el historial de publicaciones a largo plazo vive en la base de datos de cada nodo, y un
  nodo nuevo arranca sin el historial anterior a su punto de sincronización.
- **Cuentas.** Una cuenta es una clave derivada de una frase semilla de 12 palabras, y la misma
  semilla funciona en cualquier nodo. Los nombres de usuario se registran en la cadena y son únicos
  en toda la red.
- **Comunidades.** Todo nombre válido ya es una comunidad, y nadie es su dueño. Equipos de curadores
  de pago, de hasta diez usuarios, mantienen cada uno una vista moderada de una comunidad; los
  lectores eligen la vista de un equipo, la vista predeterminada del nodo o una vista sin censura.
  Consulta las [preguntas frecuentes de Mirage](https://mirage.talk/faq).
- **Token.** El token MIRAGE paga suscripciones, recompensa a autores y nodos y da a los validadores
  peso en la gobernanza. Los suscriptores se saltan la prueba de trabajo y obtienen límites más
  altos.

## En qué se diferencian

### Quién es dueño de una comunidad

En Seedit, el creador de una comunidad tiene su par de claves, ejecuta o delega su nodo y la modera.
En Mirage, nadie es dueño de una comunidad: equipos de curadores rivales ofrecen vistas moderadas
del mismo nombre, y la vista predeterminada es la del equipo elegido por más suscriptores de pago.

### Control del spam

Mirage aplica una única regla a toda la red: los usuarios gratuitos pagan con prueba de trabajo,
cuya dificultad se ajusta al volumen entrante, y los suscriptores se la saltan. En Bitsocial, cada
comunidad elige su propio desafío, desde captchas hasta listas de permitidos o pagos. Consulta
[Desafíos antispam personalizados](/custom-challenges/).

### Infraestructura

Mirage necesita una blockchain. Los validadores alcanzan consenso sobre cada acción, y cada nodo
ejecuta una pila de servidor completa y debe tener un gran stake de tokens. Bitsocial no tiene
cadena: un nodo de comunidad funciona en hardware de consumo desde la aplicación de escritorio o
`bitsocial-cli`, y los lectores pueden ayudar a compartir el contenido.

### Control sobre toda la red

Mirage tiene una gobernanza on-chain ponderada por el stake de los validadores. Puede cambiar la
dificultad, los precios y la emisión de tokens, acuñar o quemar tokens y nombrar administradores
cuyas eliminaciones aplica el indexador de referencia a cualquier publicación. El código de la
cadena también permite a la gobernanza
[eliminar cuentas](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
y
[enviar tokens desde cualquier dirección](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
En octubre de 2026, cuatro validadores producían los bloques de la cadena, y los runbooks del propio
proyecto gestionaban los cuatro.

Bitsocial no tiene un administrador a nivel de protocolo. Los propietarios de las comunidades
moderan sus propias comunidades y las aplicaciones eligen qué muestran. Consulta
[Moderación local, no prohibiciones globales](/local-moderation/).

### Navegador

El cliente web de Mirage es un cliente HTTP de un nodo: el navegador firma acciones, pero no se une
a ninguna red peer-to-peer. Las aplicaciones de Bitsocial pueden ejecutar un nodo peer-to-peer
dentro de la pestaña del navegador. Consulta [Peer-to-peer en el navegador](/browser-p2p/).

## Comparación

| Pregunta                      | Mirage                                                                                                                                     | Bitsocial                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Categoría                     | Foro sobre su propia blockchain (Cosmos SDK)                                                                                               | Red de comunidades peer-to-peer                                                                                  |
| Identidad                     | Clave secp256k1 a partir de una semilla de 12 palabras, con un nombre de usuario on-chain                                                  | Pares de claves Ed25519 para usuarios y comunidades                                                              |
| Dónde viven las publicaciones | Transacciones de la cadena y, después, la base de datos PostgreSQL de cada nodo                                                            | El nodo del propietario de la comunidad y los pares que la leen y la siembran                                    |
| Quién lo mantiene disponible  | Nodos validadores, cada uno con 10.000.000 MIRAGE                                                                                          | El nodo del propietario de la comunidad más seeders auxiliares                                                   |
| Comunidades                   | Nombres sin dueño con equipos de curadores de pago que compiten entre sí                                                                   | Pertenecen a un par de claves; el nodo del propietario acepta o rechaza publicaciones                            |
| Control del spam              | Prueba de trabajo para toda la red; los suscriptores se la saltan                                                                          | El desafío de cada comunidad antes de aceptar una publicación                                                    |
| Moderación                    | Vistas de los equipos de curadores, filtros personales, administradores nombrados por la gobernanza                                        | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                                      |
| Economía                      | Token MIRAGE para suscripciones, recompensas y stake de los validadores                                                                    | Nada en el protocolo; un desafío puede exigir un pago o un token                                                 |
| Navegador                     | Cliente HTTP de un nodo                                                                                                                    | Nodo peer-to-peer dentro de una pestaña normal del navegador                                                     |
| Contrapartida principal       | Un estado compartido y ordenado y un registro sencillo, pero un conjunto reducido de validadores y poderes de gobernanza sobre toda la red | No hace falta cadena ni stake, pero no hay orden global, y el contenido antiguo no está garantizado para siempre |
