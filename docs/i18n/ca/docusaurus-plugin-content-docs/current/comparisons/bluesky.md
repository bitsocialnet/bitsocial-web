---
title: Bitsocial i Bluesky
description: Com es comparen Bluesky i l'AT Protocol, amb servidors de dades personals, relés i AppViews, amb les comunitats peer-to-peer de Bitsocial.
---

# Bitsocial i Bluesky

[Bluesky](https://bsky.app/) és una aplicació de microblogging construïda sobre
l'[AT Protocol](https://atproto.com/), que va dissenyar Bluesky Social PBC. El protocol divideix una
xarxa social en serveis separats: els servidors de dades personals allotgen els comptes, els relés
els agreguen en un sol flux i les AppViews indexen aquest flux per generar les cronologies i els
fils que veu la gent. La seva documentació descriu les dades dels comptes com a emmagatzemades en
servidors amfitrions, «a diferència d'un model peer-to-peer»
([visió general](https://atproto.com/guides/overview)).

## Com funciona l'AT Protocol

- **Repositoris en servidors.** Cada publicació, m'agrada o seguiment és un registre del repositori
  signat de l'autor, allotjat en un servidor de dades personals (PDS). Bluesky gestiona els
  servidors per defecte, i qualsevol persona pot allotjar el seu.
- **Relés.** Els relés se subscriuen a cada PDS i retransmeten els canvis en un sol flux, el
  firehose. Des d'una actualització del protocol el 2025 ja no arxiven tots els repositoris, cosa
  que els ha fet molt més barats de mantenir
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** Una AppView indexa tot el firehose i serveix cronologies, fils de respostes
  complets, recomptes i cerca. És la part de la xarxa que consumeix més recursos.
- **Identitat.** Un compte és un DID: normalment `did:plc`, registrat en un directori global únic, o
  `did:web`, lligat a un domini. El document DID recull l'identificador (handle) del compte, la clau
  de signatura i el servidor actual. El PDS té la clau de signatura; `did:plc` també permet als
  usuaris tenir claus de rotació per poder marxar sense l'ajuda de l'antic amfitrió
  ([guia d'identitat](https://atproto.com/guides/identity)).
- **Identificadors.** Els identificadors són noms DNS, com ara `alice.bsky.social` o un domini que
  l'usuari posseeix, verificats amb el DID.
- **Moderació.** L'allotjament i l'abast són capes separades. Qualsevol pot executar un etiquetador
  i els usuaris en poden combinar diversos
  ([guia de moderació](https://atproto.com/guides/moderation)), però l'aplicació de Bluesky sempre
  aplica la moderació pròpia de Bluesky. Els autors poden limitar qui pot respondre les seves
  publicacions i amagar respostes.

## On es diferencien

### Servidors o iguals

Les dades de Bluesky viuen en servidors: un PDS allotja cada compte, els relés transporten el
firehose i les AppViews serveixen el que mostren els clients. Un navegador és un client HTTP
d'aquests serveis, mai un igual. A Bitsocial, el contingut el serveixen el node de la comunitat i
els iguals que la llegeixen, i una aplicació web pot executar el seu propi node peer-to-peer.
Consulta [Peer-to-peer al navegador](/browser-p2p/).

### Una visió global o comunitats

L'AT Protocol està dissenyat per a una única visió global: una AppView veu totes les respostes, de
manera que els fils i la cerca són complets. Bitsocial no té cap índex global; cada comunitat
publica el seu propi estat, i les aplicacions hi construeixen el descobriment al damunt. Consulta
[Descobriment de continguts](/content-discovery/).

Avui Bluesky no té cap objecte de comunitat per a les publicacions públiques. El juny de 2026
[va anunciar comunitats natives](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k) en què,
en alguns nivells de privadesa, publicar requereix aprovació; l'octubre de 2026 encara no s'havien
llançat. A Bitsocial, les comunitats són l'objecte central, i el node d'una comunitat accepta o
rebutja les publicacions.

### Control de l'spam

Bluesky combat l'spam amb límits de freqüència als seus servidors, límits als nous amfitrions al
relé, detecció automàtica, revisió humana i etiquetes, i els autors poden restringir les respostes.
No hi ha cap filtre a nivell de comunitat que decideixi què ha de superar una publicació abans de
ser acceptada. A Bitsocial, cada comunitat tria el seu propi repte. Consulta
[Reptes antispam personalitzats](/custom-challenges/).

### Qui té les claus

Els comptes dels servidors propis de Bluesky inicien sessió amb una contrasenya, i aquests servidors
en custodien les claus de signatura ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Segons
un enginyer de protocol de Bluesky,
[la majoria de comptes no tenen claus de rotació controlades de manera independent](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Una identitat de Bitsocial és un parell de claus que genera i conserva l'aplicació de l'usuari.

### Mantenir la infraestructura

Un servidor personal és barat: el [PDS de referència](https://github.com/bluesky-social/pds)
recomana 1 GB de RAM per a un màxim de 20 usuaris. Una AppView independent de tota la xarxa és un
projecte gran; una construïda el 2025
[costava uns 200 dòlars al mes](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), sobretot pels 16 TB
d'emmagatzematge. Bitsocial no té cap índex global per replicar, i un node de comunitat funciona amb
maquinari de consum.

## Comparació

| Pregunta                  | Bluesky (AT Protocol)                                                                    | Bitsocial                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Categoria                 | Servidors federats amb un índex global                                                   | Xarxa de comunitats peer-to-peer                                                         |
| Identitat                 | DID, amb claus de signatura que normalment té el servidor                                | Parells de claus Ed25519 per a usuaris i comunitats                                      |
| On viuen les publicacions | El repositori de l'autor en un servidor de dades personals                               | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders |
| Qui ho manté en línia     | Amfitrions de PDS, relés i AppViews, gestionats per defecte per Bluesky                  | Node del propietari de la comunitat més seeders auxiliars                                |
| Comunitats                | Encara cap per a publicacions públiques (anunciades el 2026)                             | Objectes de primera classe el node dels quals accepta o rebutja publicacions             |
| Control de l'spam         | Límits de freqüència als servidors, detecció automàtica, etiquetes, control de respostes | El repte de cada comunitat abans d'acceptar una publicació                               |
| Moderació                 | Etiquetadors combinables; l'aplicació de Bluesky sempre aplica la moderació de Bluesky   | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren          |
| Noms                      | Identificadors DNS verificats amb el DID                                                 | Noms `.bso` i `.eth` que es resolen en claus                                             |
| Navegador                 | Client HTTP d'un PDS i d'una AppView                                                     | Node peer-to-peer dins d'una pestanya normal del navegador                               |
| Contrapartida principal   | Fils i cerca globals complets, però l'agregació requereix servidors potents              | Cap índex global pesant, però tampoc cap visió completa de tota la xarxa                 |
