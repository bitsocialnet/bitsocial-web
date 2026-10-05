---
title: Bitsocial y las redes sociales sobre blockchain
description: Cómo Lens, DeSo y Steem ponen datos o reglas sociales en una blockchain, y por qué Bitsocial no usa ninguna.
---

# Bitsocial y las redes sociales sobre blockchain

Lens, DeSo y Steem ponen cada una la actividad social en una blockchain. Las cuentas, los
seguimientos, las publicaciones o las reglas que los rodean se convierten en transacciones que los
validadores ordenan y almacenan. Bitsocial no usa ninguna blockchain: las redes sociales no
necesitan un orden global para cada publicación, así que Bitsocial prescinde del consenso, el gas y
el staking. Consulta [Protocolo peer-to-peer](/peer-to-peer-protocol/) para ver el razonamiento.

## Qué tienen en común

- **Alguien paga por cada escritura.** Lens cobra gas, que las aplicaciones pueden patrocinar; DeSo
  cobra una comisión por cada acción; Steem raciona las acciones según los tokens en stake.
- **La cadena fija una única política antispam para todos.** Las comisiones, el stake y el coste de
  las cuentas se aplican a toda la red, en lugar de que cada comunidad los elija.
- **Los registros on-chain son permanentes.** Las aplicaciones pueden ocultar contenido, pero no
  pueden eliminarlo de la cadena.
- **Los navegadores son clientes de API.** Las aplicaciones web firman transacciones y leen a través
  de un nodo, un indexador o una API que opera otra persona.

## Lens

[Lens](https://lens.xyz/) funciona sobre Lens Chain, una capa 2 de Ethereum construida con el ZK
Stack de ZKsync que usa Avail para la disponibilidad de datos. Mask Network
[administra Lens desde enero de 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **En la cadena:** las cuentas son contratos inteligentes, los nombres de usuario son NFT dentro de
  espacios de nombres, y los grafos, los grupos, los feeds y sus reglas también son contratos.
- **Fuera de la cadena:** el texto y los archivos multimedia de una publicación están en un archivo
  JSON en una URI, normalmente en Grove, el servicio de almacenamiento de Lens situado delante de
  IPFS. Las reacciones y los marcadores los guarda la Lens API, y las aplicaciones leen a través de
  esa API.
- **Spam y barreras:** las transacciones necesitan gas en GHO, que las aplicaciones pueden
  patrocinar con límites de frecuencia. Las reglas de feeds y grupos pueden exigir la tenencia de
  tokens o pagos.
- **Operación de la cadena:** [L2BEAT](https://l2beat.com/scaling/projects/lens) califica Lens Chain
  como un validium en Stage 0 con un operador centralizado que puede negarse a incluir
  transacciones.

## DeSo

[DeSo](https://docs.deso.org/) es una blockchain de capa 1 creada para aplicaciones sociales. Pasó
de prueba de trabajo a prueba de participación en julio de 2024.

- **En la cadena:** perfiles, publicaciones, «me gusta», seguimientos y mensajes directos son todos
  transacciones que almacena cada nodo completo. Las imágenes y los vídeos se alojan off-chain; el
  nodo de referencia usa Google Cloud Storage y Cloudflare Stream.
- **Spam:** cada acción paga una comisión en DESO. Los nuevos usuarios suelen recibir DESO inicial
  de un nodo tras verificar su teléfono.
- **Moderación:** cada nodo decide qué muestra mediante listas negras o listas grises, pero
  [el contenido permanece on-chain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Comunidades:** la documentación no describe ninguna primitiva de comunidad o foro; una
  «comunidad» es un feed que cura una aplicación.
- **Operar un nodo:** los validadores necesitan al menos 32 GB de RAM y 200 GB de disco, según la
  [guía de validadores](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) es una blockchain social que paga a autores y curadores en tokens, con
[Steemit](https://steemit.com/) como su principal aplicación de blogs. Hive se separó de Steem en
2020; según el [libro blanco de Hive](https://hive.io/whitepaper.pdf), la bifurcación siguió a la
venta de Steemit Inc. a Justin Sun.

- **En la cadena:** publicaciones de texto, comentarios, votos y su historial de ediciones,
  ordenados por 21 witnesses elegidos que producen un bloque cada tres segundos. Las imágenes se
  alojan off-chain.
- **Spam:** las acciones consumen Resource Credits, que crecen con el STEEM en stake. Crear una
  cuenta cuesta STEEM; Steemit lo paga por los usuarios que verifican una dirección de correo
  electrónico y un número de teléfono.
- **Comunidades:** son
  [operaciones personalizadas que interpreta un indexador](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  fuera del consenso. Los moderadores pueden silenciar publicaciones, lo que las oculta en las
  aplicaciones pero las deja on-chain.
- **Recompensas:** la inflación financia las recompensas, y los votos ponderados por stake deciden
  cómo se reparten, de modo que los grandes tenedores determinan qué recibe atención.

## Comparación

| Pregunta                       | Lens                                                                                         | DeSo                                                                                     | Steem                                                                                              | Bitsocial                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Cadena                         | Capa 2 de Ethereum (validium con ZK Stack)                                                   | Capa 1 propia, prueba de participación                                                   | Cadena propia, prueba de participación delegada                                                    | Ninguna                                                                                                 |
| Contenido de las publicaciones | JSON off-chain, normalmente en Grove                                                         | Texto on-chain; multimedia off-chain                                                     | Texto on-chain; imágenes off-chain                                                                 | En el nodo del propietario de la comunidad y en los pares que la leen y la siembran                     |
| Identidad                      | Cuenta de contrato inteligente; nombres de usuario como NFT                                  | Par de claves con un perfil on-chain                                                     | Cuenta con nombre en la cadena, con claves por niveles                                             | Pares de claves Ed25519 para usuarios y comunidades                                                     |
| Comunidades                    | Grupos y feeds como contratos con reglas                                                     | Sin primitiva de comunidad                                                               | Comunidades interpretadas por un indexador, fuera del consenso                                     | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                                       |
| Control del spam               | Gas (a menudo patrocinado), reglas de tokens o de pago                                       | Comisión por cada acción; fondos iniciales tras verificar el teléfono                    | Resource Credits según el stake; creación de cuentas de pago                                       | El desafío de cada comunidad antes de aceptar una publicación                                           |
| Moderación                     | Administradores de grupos, reglas on-chain, ocultación a nivel de API                        | Cada nodo filtra lo que muestra                                                          | Silenciamientos de la comunidad, votos negativos ponderados por stake, filtros de las aplicaciones | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                             |
| Operación                      | Operador de la cadena más la Lens API y Grove                                                | Validadores con al menos 32 GB de RAM                                                    | Witnesses elegidos más nodos de API e indexadores                                                  | Un nodo de comunidad en hardware de consumo, más seeders auxiliares                                     |
| Contrapartida principal        | Reglas on-chain programables, pero el contenido y las lecturas dependen de servicios de Lens | Un fondo de datos abierto, pero cada acción cuesta una comisión y permanece para siempre | Recompensas integradas, pero el stake determina la visibilidad y la gobernanza                     | Sin comisiones ni stake, pero sin orden global, y el contenido antiguo no está garantizado para siempre |
