---
title: Bitsocial y Quorum
description: Cómo se compara Quorum, la aplicación de mensajería grupal cifrada de extremo a extremo de Quilibrium con Spaces al estilo de Discord, con las comunidades públicas peer-to-peer de Bitsocial.
---

# Bitsocial y Quorum

[Quorum](https://www.quorummessenger.com/) es una aplicación de mensajería grupal de Quilibrium Inc.,
la empresa detrás de la red [Quilibrium](https://quilibrium.com/). Está organizada como Discord,
con Spaces, canales, roles y mensajes directos, y sus mensajes están cifrados de extremo a extremo.
Aparece junto a Bitsocial porque ambos se describen como peer-to-peer y resistentes a la censura,
con grupos que fijan sus propias reglas. Persiguen objetivos distintos: Quorum, el chat de grupo
privado; Bitsocial, las comunidades públicas que cualquiera puede leer.

Quilibrium se describe como una alternativa descentralizada a las plataformas en la nube: una red de
nodos que guardan los datos en un hipergrafo cifrado y se ponen de acuerdo sobre su estado mediante
un consenso al que llama Proof of Meaningful Work. Los nodos ganan QUIL, el token de la red, con el
que se pagan las tarifas de uso. Quorum nació en 2018 como Howler, una idea para una alternativa
privada a Discord, y se convirtió en la primera aplicación en entrar en funcionamiento sobre
Quilibrium, según la [historia de Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/).
Quilibrium Inc., fundada por Cassie Heart, desarrolla el protocolo y ofrece Quorum como uno de sus
servicios gestionados ([preguntas frecuentes](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Cómo funciona Quorum

Los detalles siguientes proceden del código fuente de los clientes de Quorum,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) para las aplicaciones web y de
escritorio y [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), a fecha de octubre
de 2026.

- **Identidades.** La identidad maestra de un usuario es un conjunto de claves Ed448, y cada
  dispositivo recibe sus propias claves X448 y Ed448. En el navegador, las claves normalmente están
  protegidas por una llave de acceso (passkey); la aplicación móvil las deriva de una frase de
  recuperación. Las direcciones son hashes que empiezan por `Qm`, y los usuarios pueden mostrar un
  nombre de usuario del servicio de nombres de Quilibrium.
- **Cifrado.** Los mensajes directos usan el Double Ratchet entre dispositivos. Un Space comparte
  una única sesión de Triple Ratchet entre sus miembros, que firman sus mensajes con claves
  específicas de ese Space. Todos los Spaces están cifrados. Quorum afirma que su intermediación
  de mensajes impide vincular a remitentes y destinatarios, pero el cliente web y de escritorio se
  suscribe a todas las bandejas de entrada de un dispositivo, incluida la que figura en el registro
  público del usuario, en
  [una sola petición](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  al servicio, que por tanto puede vincularlas con la dirección del usuario.
- **Unirse.** A los Spaces se entra con enlaces de invitación. Un enlace de un solo uso lleva en la
  URL las claves para unirse; un enlace público las obtiene del servicio de Quorum, y los Spaces
  públicos pueden figurar en un directorio con buscador.
- **Transporte.** Para la mensajería, los clientes web, de escritorio y móvil se conectan todos por
  HTTPS y un WebSocket a un único servicio,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Este servicio retransmite los mensajes cifrados a la bandeja de entrada de cada miembro y los
  retiene hasta que el cliente confirma su recepción. También almacena los registros de usuarios, los
  perfiles públicos de activación voluntaria, el manifiesto cifrado de cada Space (canales, roles,
  emoji), el
  material de invitación, el directorio público y una sincronización opcional y cifrada de los
  ajustes. El software de nodo de Quilibrium tiene un servicio de bandeja de entrada y hub con la
  misma estructura, pero ni los clientes ni la documentación de Quilibrium dicen cómo se corresponde
  este servicio con la red.
- **Historial.** El cliente de cada miembro guarda su propia copia del Space en el almacenamiento
  local, y ambos clientes recogen de sus bandejas de entrada en el servicio los mensajes enviados
  mientras estaban desconectados. Para el historial más antiguo, el cliente web y de escritorio pide
  a un miembro conectado que lo sincronice, mientras que el cliente móvil reproduce un registro
  persistente que el servicio mantiene para cada Space.
- **Moderación.** Los roles conceden permisos para borrar, fijar, silenciar y hacer menciones
  `@everyone`. El cliente de cada miembro comprueba la firma de cada acción de moderación y solo la
  aplica si el firmante tiene el rol adecuado. El propietario puede expulsar a un miembro, lo que
  rota las claves del Space para que el miembro expulsado no pueda leer los mensajes nuevos. Un
  Space puede exigir mensajes firmados o dejar que los miembros publiquen mensajes sin firmar, cuya
  autoría se puede negar. Los listados del directorio público tienen un estado de revisión, y los
  usuarios pueden denunciar Spaces, y desde la aplicación móvil mensajes individuales, al servicio
  de Quorum.
- **Código.** El cliente web y de escritorio tiene licencia AGPL-3.0, y el cliente móvil, GPL-3.0.
  El cliente móvil incluye además un monedero de criptomonedas, integración con Farcaster y Apex,
  una suscripción de pago que se describe más abajo.

## En qué se diferencian

### Grupos privados y comunidades públicas

Un Space de Quorum es un grupo de miembros: solo quienes tienen sus claves pueden leerlo, y para
unirse hace falta un enlace de invitación. Un enlace público deja entrar a cualquiera, pero solo
después de unirse. Una comunidad de Bitsocial no tiene membresía. Cualquiera puede leerla, desde
cualquier aplicación, sin unirse, y cualquiera puede intentar publicar, sujeto al desafío de la
comunidad.

### Qué mantiene un grupo en línea

Un Space de Quorum no tiene nodo anfitrión. Los miembros envían los mensajes a través del servicio
de Quorum, que guarda una copia para cada miembro hasta que su cliente la recoge, y el propietario
no necesita estar conectado para que los demás conversen. Una comunidad de Bitsocial vive en el
nodo de su propietario, que acepta o rechaza cada publicación y publica el estado más reciente de la
comunidad. La comunidad
sigue siendo legible mientras haya pares que la siembren, pero no puede aceptar publicaciones nuevas
mientras su nodo está desconectado. Consulta [Protocolo peer-to-peer](/peer-to-peer-protocol/).

### Quién hace cumplir las reglas

En Quorum, las reglas se hacen cumplir en los extremos. El cliente de cada miembro decide si aplica
un borrado, una fijación o un silenciamiento según el rol del firmante, y una expulsión funciona
trasladando a todos los demás a claves nuevas. Paralelamente, el operador del servicio recibe las
denuncias y revisa el directorio público. En Bitsocial, las reglas se hacen cumplir en el nodo de
la comunidad: una publicación que no supera el desafío de la comunidad nunca se acepta, y el nodo
aplica las eliminaciones de sus moderadores. Consulta [Moderación local, no prohibiciones globales](/local-moderation/).

### Control del spam

Quorum mantiene fuera el spam sobre todo mediante invitaciones. Un enlace de un solo uso admite a
una persona, un enlace público admite a cualquiera que lo tenga, y el propietario puede expulsar y
cambiar las claves después. Los clientes también limitan la rapidez con la que un miembro puede
enviar, y el cliente web y de escritorio descarta los mensajes de los Spaces de cualquier remitente
por encima de 10 en 10 segundos. Las identidades de Bitsocial son pares de claves gratuitos, así
que cada comunidad elige un desafío que se ejecuta antes de aceptar una publicación, como un
captcha, un pago, un saldo de tokens o una lista de permitidos. Consulta [Desafíos antispam personalizados](/custom-challenges/).

### El cliente y la red

Una aplicación de Quorum es un cliente del servicio de Quorum, que gestiona Quilibrium Inc. Las
aplicaciones no se unen por sí mismas a una red peer-to-peer, así que llegar a un Space depende de
ese único punto de acceso. Aparte de eso, Quilibrium es una red propia: en octubre de 2026, su
[explorador](https://dashboard.quilibrium.com/) mostraba 114 pares accesibles y 181 provers
repartidos en 99 shards.

Una aplicación web de Bitsocial puede ejecutar un nodo libp2p en la pestaña, obtener de los pares el
contenido de las comunidades y publicar mediante gossipsub. El descubrimiento de pares pasa por
enrutadores HTTP que solo devuelven direcciones de proveedores; cualquiera puede ejecutar uno, y los
clientes pueden cambiar de enrutador modificando su configuración. Consulta
[Peer-to-peer en el navegador](/browser-p2p/).

### Economía

Quilibrium tiene un token en su núcleo. Los nodos minan QUIL, con el que se pagan las tarifas de la
red, y una versión envuelta (wrapped), wQUIL, circula en Ethereum. Quorum en sí es gratuito y no
exige ningún pago ni número de teléfono. Su suscripción opcional Apex cuesta
[5 dólares al mes](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
se paga en wQUIL, SNAP o USDC en Ethereum y se reparte entre Quilibrium Inc. y cuatro Spaces que
elige el suscriptor. Bitsocial no tiene una capa de pagos en el protocolo; una comunidad puede
exigir un pago o un token mediante su desafío.

### Mensajes privados

Aquí Quorum es más fuerte. Los mensajes directos y los mensajes de los Spaces están cifrados de
extremo a extremo con secreto hacia adelante, y el contenido de los mensajes solo llega al servicio
de Quorum como texto cifrado, salvo cuando un miembro denuncia un mensaje desde la aplicación móvil,
que envía su contenido a los moderadores de Quorum. Bitsocial se centra en las comunidades públicas
y todavía no tiene mensajes directos nativos. Una publicación de Bitsocial va cifrada con la clave
del nodo de la comunidad mientras viaja por pubsub, pero una vez aceptada es pública.

## Estado del proyecto

En octubre de 2026, el repositorio de Quorum calificaba la aplicación web de beta, y el sitio web de
Quorum seguía presentando las aplicaciones de Google Play y App Store como próximamente disponibles.
Los dos clientes también divergen: la aplicación móvil tiene las funciones de monedero, Farcaster y
Apex, mientras que el cliente web y de escritorio muestra sus páginas Wallet y Farcaster como
próximamente disponibles, y ambos se ponen al día con el historial de los Spaces de forma distinta.

La mainnet de Quilibrium alcanzó la versión 2.1 el 30 de septiembre de 2025, cuando la red se
reanudó tras una parada ([anuncio](https://x.com/QuilibriumInc/status/1973082817236984270)). En 2026
el nodo se reescribió en Rust, con firmas poscuánticas para el consenso y un protocolo de
comunicación que los nodos más antiguos no entienden. Partes de la documentación describen el diseño
y no el código en ejecución: describen el
[enrutamiento por mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/).
Los nodos sí retransmiten tráfico entre ellos mediante circuitos con enrutamiento onion, pero en el
nodo 2.1.0.25 el servicio de mixnet es un
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
que acepta mensajes sin mezclarlos.

## Comparación

| Pregunta                       | Quorum                                                                                                                        | Bitsocial                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Categoría                      | Aplicación de mensajería grupal cifrada de extremo a extremo de Quilibrium Inc.                                               | Red de comunidades peer-to-peer                                                                                          |
| Identidad                      | Conjunto de claves maestro Ed448 más claves por dispositivo, protegidas por una llave de acceso o una frase de recuperación   | Pares de claves Ed25519 para usuarios y comunidades                                                                      |
| Quién puede leer               | Los miembros que tienen las claves de un Space                                                                                | Cualquiera, desde cualquier aplicación                                                                                   |
| Dónde viven los mensajes       | El dispositivo de cada miembro; el servicio de Quorum guarda las copias no entregadas y, para el móvil, un registro por Space | El nodo del propietario de la comunidad y los pares que la leen y la siembran                                            |
| A qué se conectan los clientes | Al servicio de Quorum en `api.quorummessenger.com`                                                                            | A pares mediante libp2p, encontrados a través de enrutadores HTTP, incluso desde una pestaña del navegador               |
| Comunidades                    | Spaces con canales, roles y enlaces de invitación                                                                             | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                                                        |
| Control del spam               | Enlaces de invitación, expulsiones con cambio de claves, límites de frecuencia en el cliente                                  | El desafío de cada comunidad antes de aceptar una publicación                                                            |
| Moderación                     | Roles que aplica el cliente de cada miembro; el propietario expulsa; las denuncias van al operador del servicio               | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                                              |
| Mensajes privados              | Mensajes directos cifrados de extremo a extremo                                                                               | Comunidades públicas; todavía sin mensajes directos nativos                                                              |
| Economía                       | Token de red QUIL; suscripción Apex opcional de 5 dólares al mes                                                              | Ninguna en el protocolo; un desafío puede exigir un pago o un token                                                      |
| Contrapartida principal        | Grupos privados y cifrados, pero todos los clientes dependen de un único servicio                                             | Identidades gratuitas y acceso desde el navegador, pero sin mensajería privada y solo se conserva el estado más reciente |
