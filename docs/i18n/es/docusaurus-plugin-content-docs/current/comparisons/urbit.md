---
title: Bitsocial y Urbit
description: Cómo se compara Urbit, una red de servidores personales con Urbit IDs basados en Ethereum y grupos gestionados por su anfitrión en Tlon Messenger, con las comunidades peer-to-peer de Bitsocial.
---

# Bitsocial y Urbit

[Urbit](https://urbit.org/) es una red de servidores personales. Cada usuario tiene un ordenador
siempre encendido, llamado nave (ship), que ejecuta el sistema operativo propio de Urbit (Arvo),
escrito en sus propios lenguajes (Nock y Hoon), y que se identifica mediante un Urbit ID. Su
principal aplicación social es [Tlon Messenger](https://tlon.io/), creada por Tlon, la empresa
fundada en 2013 para desarrollar Urbit.

Urbit aspira a reemplazar toda la pila informática, así que es un proyecto mucho más amplio que
Bitsocial. Su capa social, sin embargo, usa un modelo cercano al de Bitsocial: una comunidad vive en
el nodo de su propietario, y ese nodo decide qué entra. Ambos se diferencian en quién tiene que
ejecutar un servidor y en cómo se mantiene fuera el spam.

## Cómo funciona Urbit

- **Urbit IDs.** Cada nave tiene un Urbit ID: un número que se muestra como un nombre pronunciable,
  por ejemplo `~sampel-palnet`. Los ID de capa 1 (Layer 1) son NFT cuya titularidad y cuyas claves
  públicas de red se registran en los contratos de Azimuth en Ethereum. Los ID de capa 2 (Layer 2),
  añadidos en 2021 para reducir las comisiones, usan un «naive rollup»: sus transacciones se
  publican en Ethereum por lotes, pero su titularidad no se guarda en el contrato de Azimuth, y cada
  nave la calcula localmente. Tlon opera un roller de uso público y gratuito, según la
  [documentación de Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) y
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Una jerarquía fija.** El espacio de direcciones tiene 256 galaxias, 65.536 estrellas y unos
  4.000 millones de planetas para el uso cotidiano. Las galaxias emiten estrellas, las estrellas
  emiten planetas, y cada planeta puede emitir lunas para sus propios dispositivos. Los cometas son
  ID gratuitos que una nave genera para sí misma y que nunca tocan la blockchain. Los propietarios
  de galaxias forman el Galactic Senate, que vota las actualizaciones de los contratos de Azimuth y
  elige la junta directiva de la Urbit Foundation.
- **Red.** Las naves intercambian paquetes cifrados de forma peer-to-peer. Desde julio de 2026, el
  protocolo de red es [Directed Messaging](https://urbit.org/blog/directed-messaging), una
  reescritura centrada en el contenido del antiguo protocolo Ames. Las galaxias se encargan del
  descubrimiento de pares: cada una lleva la cuenta de dónde están las naves que tiene por debajo y
  les retransmite paquetes hasta que las dos naves pueden comunicarse directamente, o durante todo
  el tiempo en que un cortafuegos lo impida, según el
  [artículo sobre Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grupos.** En Tlon Messenger, un grupo está alojado en la nave de su creador. Los miembros envían
  mensajes al anfitrión, que los distribuye a la nave de cada miembro, y la nave de cada miembro
  guarda su propia copia, según las [preguntas frecuentes de Tlon](https://tlon.io/posts/faq). El
  anfitrión controla los roles, los canales y la admisión. Un grupo puede ser público, privado o
  secreto, y puede
  [vetar naves concretas o rangos enteros de ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Los canales son chats, cuadernos o colecciones de imágenes y enlaces.
- **Alojamiento.** Al registrarse en Tlon, un usuario nuevo recibe una nave que gestiona Tlon, con
  claves que Tlon custodia. Un usuario puede exportar la nave y su master ticket y ejecutarla en
  otro lugar: en un dispositivo de [Native Planet](https://www.nativeplanet.io/) o con el runtime
  Vere en Linux, macOS o Windows. Las naves todavía no pueden almacenar archivos grandes
  directamente, así que Tlon Messenger guarda las imágenes y otros contenidos multimedia en un
  almacenamiento en la nube compatible con S3.

## En qué se diferencian

### Quién tiene que ejecutar un servidor

En Urbit, cada participante es un servidor. Las aplicaciones de Tlon son interfaces para la propia
nave del usuario, e incluso leer un grupo pasa por ella. Quienes no ejecutan una nave propia
alquilan una, lo que vuelve a meter en escena a un proveedor de alojamiento: Tlon guarda las claves
de los usuarios alojados y conserva un acceso limitado para tareas de mantenimiento, aunque los
usuarios pueden marcharse con toda su nave.

En Bitsocial, solo los propietarios de comunidades necesitan un nodo siempre encendido. Quienes leen
y publican pueden ejecutar un nodo peer-to-peer dentro de una pestaña del navegador, y su cuenta es
un par de claves que guarda la aplicación. Consulta [Peer-to-peer en el navegador](/browser-p2p/).
Cuando alguien sí usa un nodo alojado, el diseño de Bitsocial busca que pueda delegar la
disponibilidad sin ceder la custodia de la identidad. Consulta
[Identidad y propiedad de las comunidades](/identity-and-ownership/).

### El anfitrión de la comunidad

Aquí es donde ambos se parecen más. Un grupo de Tlon y una comunidad de Bitsocial viven en el nodo
de su propietario. El anfitrión decide quién puede publicar, aplica la moderación y distribuye el
resultado, y ninguno de los dos protocolos pone a un moderador por encima del anfitrión. En ambos,
el anfitrión tiene que estar en línea. Las preguntas frecuentes de Tlon dicen que, si el anfitrión
se desconecta, «el grupo cae con él», y una comunidad de Bitsocial no puede aceptar publicaciones
nuevas mientras su nodo está desconectado.

Almacenan el contenido de forma distinta. La nave de cada miembro guarda una copia del historial del
grupo, así que los miembros pueden seguir leyendo lo que ya recibieron mientras el anfitrión está
caído. Un lector de Bitsocial obtiene el estado más reciente de la comunidad del nodo de la
comunidad o de pares que la siembran, de modo que una comunidad desconectada sigue siendo legible
mientras haya pares que la tengan, pero la red conserva solo el estado más reciente.

Un grupo de Tlon también tiene una lista de miembros, y su anfitrión puede hacer que solo se entre
por invitación. Una comunidad de Bitsocial no tiene membresía: cualquiera puede leerla y cualquiera
puede intentar publicar, sujeto a su desafío.

### Spam e identidad

Urbit combate el spam haciendo que la identidad sea escasa. La oferta de planetas es fija y cada uno
lo emite una estrella. Los cometas gratuitos esquivan esa escasez, así que los grupos que quieren
que se mantenga los rechazan: la documentación de Urbit señala que algunos grupos rechazan los
cometas, y un grupo de Tlon puede vetar todo el rango de los cometas con un solo ajuste. Una vez
excluidos los cometas, un usuario vetado necesita otro planeta del propietario de una estrella para
volver. La reputación también puede seguir la jerarquía: Azimuth incluye un contrato Censures que
permite a galaxias y estrellas señalar ID. Como la escasez está integrada en el espacio de
direcciones, funciona igual en todos los grupos que rechazan los cometas.

Las identidades de Bitsocial son pares de claves gratuitos. Cada comunidad elige su propio desafío
antes de aceptar una publicación, como un captcha, un pago, un saldo de tokens o una lista de
permitidos, y otras comunidades pueden elegir de otra manera. Consulta
[Desafíos antispam personalizados](/custom-challenges/).

### Blockchain y gobernanza

La capa de identidad de Urbit depende de Ethereum. Los contratos de Azimuth registran la titularidad
y las claves de red de capa 1, las transacciones de capa 2 se publican en Ethereum por lotes, y el
Galactic Senate puede actualizar el contrato que gobierna Azimuth. Esas mismas 256 galaxias también
se encargan del descubrimiento de pares y de la retransmisión, de modo que un conjunto fijo de
identidades sostiene tanto la gobernanza como parte del enrutamiento de la red.

Las identidades de Bitsocial son pares de claves que no necesitan registro. Los nombres `.bso` y
`.eth` son alias opcionales que se resuelven en ellas. El descubrimiento de pares pasa por
enrutadores HTTP que solo devuelven direcciones de proveedores; cualquiera puede ejecutar uno, y los
clientes pueden cambiar de enrutador modificando su configuración.

### Alcance

Urbit es un ordenador de propósito general. Una nave puede alojar un remoto de Git, una base de
conocimiento personal o agentes de IA, y Tlon Messenger es un programa entre muchos. Desarrollar
para Urbit consiste sobre todo en escribir aplicaciones en Hoon para Arvo. Bitsocial es un protocolo
para comunidades públicas, con aplicaciones como [5chan](/apps/5chan/) y [Seedit](/apps/seedit/).
Funciona sobre la pila existente (libp2p, IPFS y el navegador) en lugar de reemplazarla, y sus
clientes se construyen con herramientas web corrientes. Consulta
[Construye tu propio cliente](/build-your-own-client/).

### Mensajes privados

Aquí Urbit es más fuerte. Los mensajes directos van de una nave directamente a otra, todo el tráfico
entre naves está cifrado, y los grupos pueden ser privados o secretos. Tlon advierte que los
mensajes se cifran en tránsito, pero se almacenan sin cifrar en la nave. Bitsocial se centra en las
comunidades públicas y todavía no tiene mensajes directos nativos.

## Estado del proyecto

Urbit ha atravesado una etapa convulsa. En agosto de 2024, la Urbit Foundation, la organización sin
ánimo de lucro que dirige el desarrollo del núcleo, despidió a su director ejecutivo; el fundador
Curtis Yarvin volvió para dirigir la estrategia sin un cargo formal, varios desarrolladores del
núcleo se marcharon y el margen financiero de la Foundation se medía en meses,
[según informó CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin propuso trasladar Azimuth a una capa 2 de Ethereum ya existente, probablemente Base, y emitir
tokens fungibles de «visa» convertibles en planetas. A fecha de octubre de 2026, la
[documentación de ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) de Urbit sigue describiendo
Azimuth en Ethereum con su naive rollup. En octubre de 2025, el Galactic Senate sustituyó a la junta
de la Foundation, y la nueva junta nombró a un nuevo director ejecutivo
([anuncio](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

El desarrollo continúa. Directed Messaging entró en funcionamiento con la versión 408k el 14 de
julio de 2026. En junio de 2026, Tlon Messenger
[abrió el registro público sin lista de espera](https://urbit.org/blog/this-month-in-urbit-june-2026),
y Tlon se presenta ahora como un lugar donde personas y agentes de IA trabajan juntos.

## Comparación

| Pregunta                      | Urbit                                                                                                     | Bitsocial                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Categoría                     | Red de servidores personales y sistema operativo                                                          | Red de comunidades peer-to-peer                                                                                          |
| Identidad                     | Urbit IDs: unos 4.000 millones de planetas en Ethereum o en su rollup de capa 2, más cometas gratuitos    | Pares de claves Ed25519 para usuarios y comunidades                                                                      |
| Quién ejecuta un servidor     | Cada usuario, en su propia nave o en una alojada                                                          | Los propietarios de comunidades; quienes leen y publican pueden usar una pestaña del navegador                           |
| Dónde viven las publicaciones | La nave del anfitrión del grupo y una copia en la nave de cada miembro                                    | El nodo del propietario de la comunidad y los pares que la leen y la siembran                                            |
| Comunidades                   | Grupos alojados en la nave de su creador, con listas de miembros                                          | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                                                        |
| Control del spam              | ID escasos emitidos por estrellas; los grupos vetan naves o rangos enteros                                | El desafío de cada comunidad antes de aceptar una publicación                                                            |
| Moderación                    | Los roles y vetos del anfitrión del grupo                                                                 | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                                              |
| Descubrimiento de pares       | Las galaxias siguen la pista de las naves que tienen por debajo y retransmiten para ellas                 | Los enrutadores HTTP devuelven pares proveedores y no almacenan contenido                                                |
| Gobernanza                    | El Galactic Senate de 256 galaxias vota las actualizaciones de Azimuth                                    | Ninguna autoridad a nivel de protocolo sobre identidades ni comunidades                                                  |
| Mensajes privados             | Mensajes directos cifrados y grupos solo por invitación                                                   | Comunidades públicas; todavía sin mensajes directos nativos                                                              |
| Contrapartida principal       | Un ordenador personal completo con grupos privados, pero cada usuario necesita una nave siempre encendida | Identidades gratuitas y acceso desde el navegador, pero sin mensajería privada y solo se conserva el estado más reciente |
