---
title: Directoris
description: Com les aplicacions de Bitsocial permeten que les comunitats competeixin per un nom temàtic en lloc de reservar-lo per a qui el va reclamar primer.
---

# Directoris

A Reddit, un nom com `r/opensource` només pot pertànyer a una comunitat, i qui la controla se'l queda. Si els moderadors prenen decisions que no agraden als usuaris, l'única alternativa és crear `r/opensource2`. La comunitat nova comença amb zero subscriptors, tot i que a la majoria de persones subscrites a `r/opensource` els importava el codi obert, no aquell equip de moderació en concret.

Les aplicacions de Bitsocial ho eviten amb els **directoris**. Un directori és un nom temàtic, com ara `opensource`, pel qual competeixen les comunitats. La ruta curta d'aquest nom obre la comunitat que en cada moment ocupa el primer lloc, de manera que una comunitat millor pot quedar-se el nom sense demanar permís a ningú.

## Com funciona

1. **Un codi de directori és un nom temàtic.** Seedit fa servir rutes com `/s/funny`. 5chan fa servir camins típics dels taulers d'imatges, com `/g/`.
2. **Les comunitats competeixen com a candidates.** Cada directori té una llista de comunitats candidates, cadascuna amb la seva adreça exacta, com ara `funny-posting.bso`.
3. **La candidata més ben classificada guanya la ruta.** En obrir `/s/funny` es mostra la guanyadora actual.
4. **Perdre no esborra res.** Una comunitat que no és la guanyadora conserva la seva adreça, les seves publicacions i els seus subscriptors, i qualsevol la pot continuar obrint directament.

## El nom és una porta d'entrada, no una identitat

Un codi de directori és només una ruta de descobriment. Tot allò que perdura apunta a una comunitat exacta:

- Subscriure's des de `/s/funny` subscriu a l'adreça exacta de la guanyadora actual. El codi de directori en si mai no es desa com a subscripció.
- Els enllaços a publicacions sempre fan servir l'adreça exacta de la comunitat, de manera que un enllaç antic no pot començar a apuntar a una altra comunitat quan canvia la guanyadora.
- Quan canvia la guanyadora, Seedit deixa intactes les subscripcions existents i pregunta a cada subscriptor si vol passar a la nova guanyadora, mantenir-les totes dues o quedar-se amb la comunitat actual. El canvi automàtic és una opció que s'activa per a cada directori, i cada canvi automàtic mostra un avís amb l'opció de desfer-lo.

Per tant, una comunitat rival no pren les subscripcions de ningú. Guanya el nom: els visitants nous hi arriben i els subscriptors existents poden triar amb un sol clic. Qui preferia la comunitat anterior la conserva.

## Per què no noms per ordre d'arribada

- **Res d'acaparar noms.** Tenir un bon nom no és suficient. Una comunitat ha de continuar sent-ne la millor candidata.
- **Cap administrador no assigna noms.** Que un administrador repartís els noms tornaria a crear el veto central que Bitsocial s'ha construït per eliminar.
- **Els competidors conserven un camí cap al públic.** Una comunitat rival apunta al mateix nom en lloc de tornar a començar amb un de pitjor.
- **Els clients coincideixen en la guanyadora.** Seedit classifica les candidates de manera determinista, així que tots els clients que llegeixen la mateixa instantània finalitzada del directori mostren la mateixa guanyadora. Seedit no posa una altra candidata al seu lloc perquè la guanyadora sigui temporalment inaccessible des de la connexió d'un usuari.

## Com es trien avui les guanyadores

Les candidates es publiquen com a fitxers JSON al repositori [bitsocialnet/lists](https://github.com/bitsocialnet/lists), un fitxer per directori, i una comunitat s'uneix a un directori mitjançant una pull request al seu fitxer. És un pas provisional per arrencar. L'objectiu és que la votació substitueixi les pull requests com a manera de decidir les guanyadores.

- **Seedit** ordena les candidates d'un directori per puntuació, després pel moment en què es van afegir i després per adreça. Cada fitxer de directori porta un número de revisió, i qualsevol canvi en les candidates o en la guanyadora publica una revisió nova.
- **5chan** fa una votació per directori amb [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Els clients s'intercanvien paperetes signades per libp2p gossipsub i calculen ells mateixos el recompte, sense cap servidor que compti vots. Per votar cal tenir un 5chan Pass, un token intransferible, i cada titular té un vot. Votar per un tauler que encara no és a la llista el nomina. Ara per ara les votacions es fan a la xarxa de proves Base Sepolia i, fins que no en surtin, els recomptes es mostren però no reordenen la llista.

## Protocol o aplicació?

Els directoris no formen part de PKC, la capa peer-to-peer que emmagatzema i transporta les comunitats. Són una convenció que els clients apliquen per sobre d'aquesta capa, juntament amb les llistes predeterminades i la cerca; vegeu [Descobriment de continguts](./content-discovery.md). Un client pot llegir els mateixos fitxers de directori, publicar-ne de propis o prescindir del tot dels directoris, i els usuaris sempre poden obrir qualsevol comunitat per la seva adreça.
