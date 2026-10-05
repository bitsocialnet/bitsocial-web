---
title: Bitsocial i Nostr
description: Com es compara el model basat en relés de Nostr amb les comunitats peer-to-peer de Bitsocial, del camí de les dades i la identitat als grups, el control de l'spam i la moderació.
---

# Bitsocial i Nostr

Nostr no encaixa clarament ni en el grup dels sistemes federats ni en el dels sistemes de cadena de
blocs. Les instàncies no emeten comptes als usuaris, i no hi ha cadena, ni consens, ni gas, ni ordre
global. Nostr es descriu millor com a **xarxa social basada en relés**: els usuaris tenen parells de
claus, signen esdeveniments i els publiquen en relés, que són servidors normals que els emmagatzemen
i els serveixen ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). El mateix
[README](https://github.com/nostr-protocol/nostr) de Nostr diu que no es basa en tècniques
peer-to-peer.

Això situa Nostr més a prop de Bitsocial que els sistemes federats o de cadena de blocs en un
aspecte important: la identitat és criptogràfica i portable. Les diferències són la capa de dades i
qui fa de porter.

## Com funciona Nostr

- **Esdeveniments i relés.** Cada publicació, perfil o reacció és un esdeveniment JSON signat. Els
  clients publiquen esdeveniments als relés per WebSockets i s'hi subscriuen amb filtres; els relés
  emmagatzemen els esdeveniments i els tornen a servir. Els relés no es comuniquen entre ells.
- **Replicació.** Els usuaris solen publicar en diversos relés. Un estudi de 712 relés fet el 2023
  va trobar que la publicació mitjana era en 34,6 d'aquests relés
  ([Wei i Tyson](https://arxiv.org/abs/2402.05709)).
- **Trobar les publicacions d'algú.** Els usuaris publiquen una llista dels relés on escriuen i d'on
  llegeixen ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), i els clients
  obtenen les publicacions d'un usuari dels seus relés d'escriptura.
- **Identitat.** Cada usuari és una clau secp256k1 que signa amb signatures Schnorr. Les
  especificacions no defineixen cap rotació ni recuperació de claus, de manera que perdre la clau és
  perdre el compte. Els identificadors opcionals `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) es comproven amb un fitxer al
  servidor web del domini corresponent.
- **Grups.** El mecanisme recomanat per a comunitats són els grups basats en relés
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): un relé allotja un grup,
  n'aplica les normes de pertinença i de publicació abans d'acceptar una publicació i en signa les
  metadades. Les antigues comunitats aprovades per moderadors
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) ara estan marcades com a no
  recomanades en favor de NIP-29.
- **Control de l'spam.** Cada relé tria el seu filtre d'entrada: prova de treball
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autenticació i llistes
  blanques ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), pagament o límits
  de freqüència. Els clients hi afegeixen llistes de silenciament i puntuacions de confiança.
- **Multimèdia.** Les imatges i els vídeos es pugen a servidors de fitxers HTTP separats.

## On es diferencien

### Qui emmagatzema i serveix les publicacions

A Nostr, els relés són la capa d'emmagatzematge i de lliurament: un servidor ha de mantenir en línia
cada publicació. A Bitsocial, els encaminadors HTTP només ajuden els clients a trobar iguals. No
emmagatzemen publicacions, perfils, metadades de comunitat ni estat de moderació; els clients
obtenen el contingut del node de la comunitat i dels iguals que en fan de seeders. Consulta
[Protocol peer-to-peer](/peer-to-peer-protocol/).

### Qui fa de porter

A Nostr, els filtres d'escriptura són cosa dels operadors dels relés. Fora dels grups NIP-29, una
clau rebutjada per un relé pot publicar el mateix esdeveniment a qualsevol relé que l'accepti, i el
que veuen els lectors depèn dels relés que llegeix el seu client. Un grup NIP-29 s'assembla més a
una comunitat de Bitsocial: el relé que l'allotja accepta o rebutja les publicacions. Tot i així, el
relé continua definint què poden fer els rols del grup, i l'historial del grup continua lligat a
aquell relé tret que un altre relé accepti fer-se'n càrrec.

A Bitsocial, una comunitat és un objecte criptogràfic amb el seu propi parell de claus. El node de
la comunitat executa el repte que triï el propietari i publica l'estat acceptat a la xarxa
peer-to-peer. Consulta [Reptes antispam personalitzats](/custom-challenges/).

### Mantenir la infraestructura

Un relé és un servidor amb un domini i un punt final WebSocket, i els relés populars assumeixen el
cost d'emmagatzematge i d'amplada de banda del que serveixen. L'estudi de 2023 estimava que prop del
95 % dels relés gratuïts no podien cobrir els costos amb donacions. Un node de comunitat de
Bitsocial funciona amb maquinari de consum, i els iguals que llegeixen una comunitat poden ajudar a
compartir-la.

### Navegador

Un client web de Nostr obre connexions WebSocket directament amb els relés, de manera que no cal cap
servidor d'aplicació. Una aplicació web de Bitsocial executa un node peer-to-peer dins la pestanya i
obté el contingut dels iguals. Consulta [Peer-to-peer al navegador](/browser-p2p/).

### Contingut antic

Les publicacions de Nostr estan àmpliament replicades entre relés, cosa que ajuda que les
publicacions antigues sobrevisquin. Bitsocial conserva l'estat més recent de la comunitat i no
garanteix el contingut antic per sempre.

## Comparació

| Pregunta                  | Nostr                                                                                                      | Bitsocial                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Categoria                 | Protocol basat en relés                                                                                    | Xarxa de comunitats peer-to-peer                                                         |
| Identitat                 | Clau d'usuari secp256k1, sense rotació a les especificacions                                               | Parells de claus Ed25519 per a usuaris i comunitats                                      |
| On viuen les publicacions | Relés triats per l'autor, sovint molts                                                                     | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders |
| Qui ho manté en línia     | Operadors de relés                                                                                         | Node del propietari de la comunitat més seeders auxiliars                                |
| Comunitats                | Grups allotjats en relés (NIP-29)                                                                          | Objectes de primera classe el node dels quals accepta o rebutja publicacions             |
| Control de l'spam         | La política de cada relé: prova de treball, autenticació, pagament, llistes blanques, límits de freqüència | El repte de cada comunitat abans d'acceptar una publicació                               |
| Moderació                 | Polítiques dels relés, llistes de silenciament dels clients, etiquetes i denúncies                         | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren          |
| Noms                      | Identificadors opcionals `name@domain` comprovats per HTTPS                                                | Noms `.bso` i `.eth` que es resolen en claus                                             |
| Navegador                 | Client WebSocket dels relés                                                                                | Node peer-to-peer dins d'una pestanya normal del navegador                               |
| Contrapartida principal   | Identitat portable i àmplia replicació, però disponibilitat i política dependents dels relés               | Menys dependència dels relés, però el contingut antic no està garantit per sempre        |
