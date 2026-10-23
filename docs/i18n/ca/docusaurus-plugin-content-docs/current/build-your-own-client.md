---
title: Creeu el vostre propi client Bitsocial
description: Guia per a qui vulgui publicar clients Bitsocial independents, des de taulers d'imatges i fòrums fins a aplicacions socials de nínxol.
---

# Creeu el vostre propi client Bitsocial

Bitsocial no guanya tenint una aplicació oficial per a cada cas d'ús. Guanya quan molts clients poden
compartir el mateix protocol mentre competeixen en interfície, cultura, descoberta, valors per
defecte i model de negoci.

5chan i Seedit són primeres proves del concepte, no un sostre. Qui construeix ha de poder publicar un
tauler d'imatges nou, un fòrum, un client de perfils, una aplicació social pensada primer per a
mòbil, una eina per a una comunitat de nínxol o fins i tot un client centralitzat que faci servir
Bitsocial per sota, sense demanar permís al propietari de cap plataforma.

## Què poden canviar els constructors

Un client de Bitsocial pot competir en decisions de producte sense bifurcar tota la xarxa:

- la interfície i el llenguatge visual
- el flux d'incorporació
- els valors per defecte de la comunitat
- les superfícies de moderació
- el model de descoberta
- l'experiència multimèdia
- les restriccions de mòbil, escriptori o amplada de banda baixa
- la monetització i el model de negoci

La capa comuna és el protocol. La capa de producte està oberta a la competència.

## La manera més ràpida d'aprendre

Comenceu per les aplicacions que ja existeixen:

- Proveu [5chan](https://5chan.app) per a comunitats anònimes de taulers d'imatges.
- Proveu [Seedit](https://seedit.app) per a discussions a l'estil de Reddit.
- Llegiu la documentació dels [hooks de React de Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) per a la
  integració al costat del client.
- Llegiu la documentació de la [CLI de Bitsocial](/developer-tools/cli/) per a operacions de nodes i
  de comunitats.

Si voleu avançar de pressa, contribuïu primer a una aplicació existent. Si la interfície, la cultura
o el model de comunitat que voleu no hi encaixen, construïu un client a part.

## Trieu una primera versió acotada

La millor primera versió no és una aplicació social universal. És un client amb un públic clar i una
raó de pes per existir.

Alguns bons punts de partida:

- un client de tauler d'imatges més net per a una cultura concreta
- un client de fòrum pensat primer per a mòbil
- una aplicació d'una sola comunitat amb valors per defecte estrictes
- un client per a comunitats de creadors
- un client de descoberta només de lectura
- una consola de moderació o d'operadors
- un client optimitzat per a una llengua, una regió o una classe de dispositius

Els clients petits són útils perquè Bitsocial els deixa créixer dins la mateixa xarxa en lloc
d'atrapar-ne els usuaris en una base de dades privada.

## Camins d'implementació

Hi ha tres camins pràctics:

1. Bifurcar un client existent quan la vostra idea s'assembla a 5chan o Seedit.
2. Construir un client de React nou amb els [hooks de React de Bitsocial](https://hooks.bitsocial.net/).
3. Construir la vostra pròpia integració damunt de les API dels nodes i de la infraestructura de RPC
   pública.

El RPC públic hauria de fer el tercer camí molt més pràctic. Un usuari pot començar amb un proveïdor
de RPC allotjat i no custodial, i més endavant passar a l'autoallotjament o a un proveïdor de la
competència.

## Principi de disseny

Construïu el client que hauria d'existir per a la vostra comunitat i deixeu després que els clients
compatibles competeixin en públic.
