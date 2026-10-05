---
title: Bitsocial i Farcaster
description: Com es compara Farcaster, amb comptes a la cadena, lloguer d'emmagatzematge i la xarxa de validadors Snapchain, amb les comunitats peer-to-peer de Bitsocial.
---

# Bitsocial i Farcaster

[Farcaster](https://docs.farcaster.xyz/) manté la identitat en una cadena de blocs i les dades
socials fora. Els comptes, les claus d'aplicació i els pagaments d'emmagatzematge viuen en
contractes d'OP Mainnet, una capa 2 d'Ethereum. Les publicacions, anomenades casts, juntament amb
els seguiments i les reaccions, són missatges signats que emmagatzema
[Snapchain](https://snapchain.farcaster.xyz/), una xarxa semblant a una cadena de blocs que el 2025
va substituir l'antiga xarxa de Hubs de Farcaster.

## Com funciona Farcaster

- **Comptes.** Un compte és un identificador numèric de Farcaster que pertany a una adreça
  d'Ethereum, la qual també pot establir una adreça de recuperació. Les aplicacions publiquen amb
  claus d'aplicació delegades registrades a la cadena; una clau d'aplicació no pot prendre el
  control del compte.
- **Lloguer d'emmagatzematge.** Cada compte lloga unitats d'emmagatzematge, actualment a 0,20 $ per
  unitat i any. Una unitat llogada des del juliol de 2025 admet 100 casts; per sobre d'això,
  s'eliminen els casts més antics. Els límits de freqüència augmenten amb l'emmagatzematge llogat.
- **Snapchain.** Els validadors ordenen els missatges en blocs amb un consens a l'estil de
  Tendermint, i cada node complet conserva les dades de tota la xarxa. Els nodes necessiten uns 16
  GB de RAM i 2 TB d'emmagatzematge, segons la
  [guia del node](https://snapchain.farcaster.xyz/getting-started).
- **Noms.** Els noms d'usuari per defecte, anomenats fnames, són gratuïts i els emet el servidor de
  noms propi de Farcaster, que
  [els pot revocar](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Els usuaris poden
  fer servir en el seu lloc un nom `.eth` registrat a Ethereum.
- **Canals.** Els canals temàtics són una funció experimental del client de Farcaster. Els casts
  d'un canal són dades del protocol, però les metadades, els seguiments i la moderació del canal
  [s'emmagatzemen al client](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lectura.** Les aplicacions llegeixen a través d'un node de Snapchain propi o d'un proveïdor
  gestionat, normalment Neynar.

## On es diferencien

### Cadenes de blocs i validadors

Farcaster depèn d'OP Mainnet per als comptes i els pagaments, i de Snapchain, una xarxa semblant a
una cadena de blocs, per ordenar totes les dades socials. El conjunt de validadors de Snapchain és
permissionat. El seu llibre blanc diu que la censura esdevé difícil amb uns deu validadors
distribuïts globalment; l'octubre de 2026 la seva
[llista de validadors](https://snapchain.farcaster.xyz/validators) era més petita, i la majoria de
claus pertanyien a Neynar, que va
[adquirir Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) el gener de 2026.
Bitsocial no té cadena, ni validadors, ni consens.

### Pagar per publicar

Cada compte de Farcaster paga lloguer d'emmagatzematge, i l'emmagatzematge limita quina part de
l'historial d'un compte conserva la xarxa. A Bitsocial, publicar no costa res a nivell de protocol;
cada comunitat decideix si demana un captcha, un pagament, un token o qualsevol altra cosa. Consulta
[Reptes antispam personalitzats](/custom-challenges/).

### Comunitats

Els canals de Farcaster són una funció del client: el client n'emmagatzema les metadades i n'aplica
la moderació, de manera que un cast bloquejat en un canal pot continuar sent vàlid a la xarxa i
visible en altres aplicacions. A Bitsocial, les comunitats són objectes del protocol amb el seu
propi parell de claus, i el node de la comunitat accepta o rebutja les publicacions.

### Mantenir la infraestructura

Un node de Farcaster conté tota la xarxa, de manera que el seu emmagatzematge creix amb tota
l'activitat; Farcaster preveu un creixement que s'acosta als discos més grans dels proveïdors de
núvol. Un node de comunitat de Bitsocial només conté les seves pròpies comunitats i funciona amb
maquinari de consum.

### Navegador

Una aplicació de Farcaster al navegador és un client HTTP d'un node o d'un proveïdor. Una aplicació
web de Bitsocial pot executar un node peer-to-peer dins la pestanya. Consulta
[Peer-to-peer al navegador](/browser-p2p/).

## Comparació

| Pregunta                  | Farcaster                                                                                            | Bitsocial                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Categoria                 | Identitat a la cadena amb dades socials ordenades per validadors                                     | Xarxa de comunitats peer-to-peer                                                                                 |
| Identitat                 | Identificador de Farcaster que pertany a una adreça d'Ethereum, amb claus d'aplicació delegades      | Parells de claus Ed25519 per a usuaris i comunitats                                                              |
| On viuen les publicacions | Snapchain, replicada a cada node complet, dins dels límits d'emmagatzematge pagats                   | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders                         |
| Qui ho manté en línia     | Validadors de Snapchain i operadors de nodes                                                         | Node del propietari de la comunitat més seeders auxiliars                                                        |
| Comunitats                | Canals experimentals gestionats pel client de Farcaster                                              | Objectes de primera classe el node dels quals accepta o rebutja publicacions                                     |
| Control de l'spam         | Lloguer d'emmagatzematge i límits de freqüència, més etiquetes d'spam a nivell d'aplicació           | El repte de cada comunitat abans d'acceptar una publicació                                                       |
| Moderació                 | Amfitrions de canal al client, filtres de les aplicacions, risc de censura a nivell de validadors    | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren                                  |
| Noms                      | Fnames gratuïts que Farcaster pot revocar, o noms `.eth`                                             | Noms `.bso` i `.eth` que es resolen en claus                                                                     |
| Navegador                 | Client HTTP d'un node o d'un proveïdor                                                               | Node peer-to-peer dins d'una pestanya normal del navegador                                                       |
| Contrapartida principal   | Un únic conjunt de dades global coherent, però amb lloguer, cadenes i un conjunt de validadors petit | Sense comissions ni cadenes, però sense conjunt de dades global i el contingut antic no està garantit per sempre |
