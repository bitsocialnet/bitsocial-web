---
title: Bitsocial i Secure Scuttlebutt
description: Com es comparen Secure Scuttlebutt (SSB) i la seva aplicació Manyverse amb Bitsocial, des dels feeds de només addició i la replicació segons el graf de seguiment fins a les comunitats, el control de l'spam i la sincronització sense connexió.
---

# Bitsocial i Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) és un protocol social peer-to-peer creat per
Dominic Tarr el 2014. [Manyverse](https://www.manyver.se/) n'és l'aplicació més coneguda, per a
Android, iOS i escriptori; [Patchwork](https://github.com/ssbc/patchwork) va ser el principal client
d'escriptori fins que es va arxivar. Dels sistemes comparats en aquesta documentació, SSB és el més
proper a Bitsocial en esperit: sense servidors al camí de les dades, sense cadena de blocs, sense
ordre global i amb claus Ed25519 com a identitat. Tots dos van prendre decisions oposades sobre què
emmagatzema cada igual i on s'atura l'spam.

## Com funciona Scuttlebutt

- **Feeds.** Cada identitat és un parell de claus Ed25519, escrit com a `@<public key>.ed25519`. Tot
  el que publica un usuari va al seu propi feed, un registre de només addició en què cada missatge
  signat porta un número de seqüència i el hash del missatge anterior. Un cop publicat, un missatge
  no es pot modificar, segons la
  [guia del protocol](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replicació.** Els iguals copien feeds sencers, no publicacions individuals, i el graf de
  seguiment decideix quins feeds conserva un igual. Patchwork, per exemple, mostrava els feeds
  situats fins a dos salts de distància i replicava els situats fins a tres salts. Amb els arbres de
  difusió epidèmica (EBT), els iguals comparen el número de seqüència més recent que tenen de cada
  feed i envien només el que falta.
- **Connexions.** Els iguals s'autentiquen mitjançant secret handshake i xifren el trànsit amb box
  stream. El handshake està vinculat a un identificador de xarxa, de manera que els iguals d'una
  xarxa SSB separada amb un identificador diferent no es poden connectar a la xarxa principal.
- **Trobar iguals.** Els iguals s'anuncien a la xarxa local mitjançant difusió UDP i se sincronitzen
  per LAN; Manyverse també se sincronitza per Bluetooth. A través d'internet, els usuaris depenen
  dels **pubs**, iguals sempre en línia que et tornen el seguiment després que bescanviïs un codi
  d'invitació i que llavors emmagatzemen i serveixen el teu feed, i dels **rooms**, que no
  emmagatzemen feeds però tunelitzen les connexions entre els seus membres.
- **Blobs i missatges privats.** Les imatges i altres fitxers són blobs adreçats per contingut que
  s'obtenen dels iguals, amb un límit de mida per defecte de 5 MB a les implementacions actuals. Els
  missatges privats es xifren per a un màxim de set destinataris i es publiquen com a text xifrat al
  feed de l'autor.

## On es diferencien

### Què emmagatzema un igual

Un igual d'SSB conserva una còpia completa de cada feed dins del seu abast de replicació, des del
primer missatge de cada feed, i serveix aquests feeds als altres. Això és el que permet que SSB
funcioni sense connexió, però l'emmagatzematge creix amb cada missatge dins de l'abast, i una
instal·lació nova ha de baixar aquests feeds abans de mostrar gaire cosa. Un client de Bitsocial
obté l'estat més recent de les comunitats que obre del node de la comunitat i dels iguals que en fan
de seeders, i la xarxa només conserva aquest estat més recent. Consulta
[Protocol peer-to-peer](/peer-to-peer-protocol/).

### Esborrat i dispositius

Com que un feed és una cadena de hashes, SSB no té esborrat a escala de tota la xarxa: un igual pot
eliminar missatges de la seva pròpia base de dades, però no els pot retirar de les còpies d'altres
iguals. Publicar amb la mateixa clau des de dos dispositius, o des d'una còpia de seguretat
restaurada, bifurca el feed, de manera que la solució habitual és una identitat per dispositiu. PZP,
el protocol successor de l'equip de Manyverse, inclou l'esborrat, diversos dispositius per compte i
feeds tolerants a les bifurcacions entre els seus canvis principals respecte d'SSB
([article de llançament](https://www.manyver.se/blog/2024-07-03/)). Un node de comunitat de
Bitsocial publica una nova versió de l'estat de la comunitat a cada actualització, de manera que el
contingut que retiren els seus moderadors desapareix de l'estat més recent.

### De qui pots tenir notícies

L'abast de replicació d'SSB fa alhora de filtre d'spam. El feed d'un desconegut només t'arriba si
algú dins dels teus salts el segueix, i bloquejar un feed fa que el teu node deixi de replicar-lo.
L'spam queda fora, però també els nouvinguts, fins que algú els segueix. Bitsocial permet que
qualsevol publiqui en una comunitat, i el node de la comunitat decideix mitjançant el seu repte si
s'accepta una publicació. Consulta [Reptes antispam personalitzats](/custom-challenges/).

### Comunitats

SSB no té cap objecte de comunitat. Els canals i les etiquetes (hashtags) són marques en
publicacions individuals, les respostes d'un fil viuen als feeds de qui les ha escrit, i quina part
d'un fil veus depèn de quins d'aquests feeds tingui el teu node. Els rooms poden tenir moderadors i
llistes de membres, però aquests controlen qui es pot connectar a través del room, no què es
publica. Una comunitat de Bitsocial és un objecte de primera classe amb el seu propi parell de
claus, les seves normes, els seus moderadors i el seu repte.

### Infraestructura

Tots dos mantenen els servidors fora del camí de les dades, i tots dos es recolzen en auxiliars. Els
pubs són el més semblant que té SSB a un servei allotjat: emmagatzemen i serveixen els feeds de
tothom a qui segueixen. Els rooms s'assemblen més als encaminadors HTTP de Bitsocial perquè cap dels
dos emmagatzema contingut, però un room retransmet la connexió entre els seus membres, mentre que un
encaminador només retorna adreces de proveïdors i no intervé en la transferència. Com un igual
d'SSB, un node de comunitat de Bitsocial funciona amb maquinari de consum, i ha d'estar en línia per
acceptar publicacions noves.

### Sense connexió i xarxes locals

Aquí SSB és més fort. Dos iguals d'SSB a la mateixa xarxa Wi-Fi, o per Bluetooth a Manyverse, es
poden sincronitzar sense connexió a internet, i tot el que ja s'ha replicat continua sent llegible
sense connexió. L'objectiu principal declarat de Manyverse és fer que les xarxes socials siguin
independents de la connectivitat a internet. Bitsocial necessita una connexió a internet per trobar
iguals i per publicar.

### Navegador

Les principals aplicacions d'SSB inclouen un node SSB complet: Manyverse n'integra un a les seves
aplicacions mòbils i d'escriptori. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo)
executava SSB dins d'un navegador amb replicació parcial i connexions a través de rooms, i es va
arxivar el 2022. Les aplicacions de Bitsocial executen un node peer-to-peer dins d'una pestanya
normal del navegador. Consulta [Peer-to-peer al navegador](/browser-p2p/).

### Missatges privats

SSB té missatges privats xifrats integrats. Bitsocial se centra en les comunitats públiques i encara
no té missatges directes nadius.

## Estat del projecte

André Staltz, que va crear Manyverse, es va apartar d'SSB, de Manyverse i del successor que tenien
previst l'abril de 2024 ([la seva darrera actualització](https://www.manyver.se/blog/2024-04-05/)).
El juliol de 2024, Jacob Karlsson va llançar aquest successor amb el nom de [PZP](https://pzp.wiki/)
i va escriure que no faria més feina a Manyverse i que no sabia de ningú més que tingués previst
fer-ne. L'octubre de 2026, els repositoris de PZP a [Codeberg](https://codeberg.org/pzp) no tenien
cap actualització posterior al desembre de 2024. El repositori de Patchwork està arxivat amb la
v3.18.1 com a darrera versió, i l'equip de Planetary, una aplicació d'SSB per a iOS, es va passar a
Nostr amb la seva aplicació Nos el 2023. La xarxa SSB continua funcionant gràcies als iguals i als
pubs que la gent manté en línia, però les seves aplicacions principals ja no es desenvolupen.

## Comparació

| Pregunta                  | Secure Scuttlebutt                                                                                                                 | Bitsocial                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Categoria                 | Protocol de gossip peer-to-peer                                                                                                    | Xarxa de comunitats peer-to-peer                                                                               |
| Identitat                 | Un parell de claus Ed25519 per dispositiu                                                                                          | Parells de claus Ed25519 per a usuaris i comunitats                                                            |
| On viuen les publicacions | El feed de només addició de l'autor, copiat per cada igual que el replica                                                          | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders                       |
| Què conserva un igual     | L'historial complet de cada feed dins del seu abast de seguiment                                                                   | L'estat més recent de les comunitats que llegeix o de les quals fa de seeder                                   |
| Comunitats                | Cap objecte de comunitat; els canals i les etiquetes marquen publicacions                                                          | Objectes de primera classe el node dels quals accepta o rebutja publicacions                                   |
| Control de l'spam         | Abast de replicació segons el graf de seguiment, i bloquejos                                                                       | El repte de cada comunitat abans d'acceptar una publicació                                                     |
| Moderació                 | Els seguiments i bloquejos de cada usuari                                                                                          | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren                                |
| Servidors auxiliars       | Els pubs emmagatzemen i serveixen feeds; els rooms tunelitzen connexions                                                           | Els encaminadors HTTP retornen iguals proveïdors i no emmagatzemen contingut                                   |
| Sense connexió            | Sincronització per LAN i Bluetooth sense internet                                                                                  | Necessita una connexió a internet                                                                              |
| Navegador                 | Les aplicacions inclouen un node SSB complet                                                                                       | Node peer-to-peer dins d'una pestanya normal del navegador                                                     |
| Xarxa                     | En funcionament, però les seves aplicacions principals ja no es desenvolupen                                                       | Xarxa activa amb aplicacions com [5chan](/apps/5chan/) i [Seedit](/apps/seedit/)                               |
| Contrapartida principal   | Funciona sense connexió i no necessita allotjament, però els feeds creixen sense límit i els desconeguts continuen sent invisibles | Publicació oberta i compatibilitat amb navegadors, però necessita internet i només conserva l'estat més recent |
