---
title: Descobriment de continguts
description: Com separa Bitsocial el descobriment entre iguals de la curació a nivell d'aplicació.
---

# Descobriment de continguts

Bitsocial no inclou un feed global, índex de cerca o algorisme de classificació al protocol. Separa el descobriment de contingut en dues capes:

1. **La cerca de xarxa** troba els companys que actualment serveixen una comunitat coneguda.
2. **La curació d'aplicacions** decideix quines comunitats, taulers, llistes o publicacions es mostra primer un producte.

Això manté el protocol petit i deixa espai per a moltes experiències de descobriment per competir.

## Cerca de xarxa

Cada comunitat té una adreça estable derivada de la seva clau pública. Quan un client ja coneix aquesta adreça, consulta els encaminadors HTTP lleugers per trobar companys que s'anunciïn com a proveïdors.

Els encaminadors només retornen adreces d'iguals del proveïdor. No emmagatzemen publicacions, metadades, llistes d'usuaris ni un directori de comunitats llegible pels humans. Després que el client rebi adreces d'iguals, es connecta a aquests iguals i obté les últimes metadades de la comunitat més els punters de contingut, i després obté les dades de publicació reals mitjançant hash.

Això respon a la pregunta del protocol: "On puc obtenir l'estat més recent per a aquesta comunitat?"

## Curació d'aplicacions

La pregunta separada del producte és: "Quines comunitats hauria de veure primer un usuari?"

Bitsocial deixa això a les aplicacions, les llistes i els usuaris en lloc de fer una resposta a la xarxa. Alguns exemples inclouen:

- un client que mostra les comunitats que l'usuari ja segueix
- una llista per defecte seleccionada per a una aplicació d'estil Reddit
- ranures de directoris per a una aplicació d'estil imageboard
- índexs de cerca o classificació mantinguts per una aplicació específica
- enllaços directes compartits pels usuaris

Les aplicacions poden indexar, classificar, filtrar o destacar coses diferents sense convertir aquestes opcions en llei de protocol. Si la superfície de descobriment d'una aplicació no és útil, una altra aplicació pot crear-ne una de diferent a les mateixes comunitats subjacents.

## Aplicacions actuals

Actualment, 5chan utilitza camins de directoris coneguts com ara `/b/` o `/g/`. Les assignacions de directoris es gestionen avui a través d'una llista pública, i s'espera que les futures versions admetin la creació de taulers dins de l'aplicació i la votació de les franges de directoris.

Seedit utilitza llistes de comunitats predeterminades per a la seva portada. Les comunitats encara es poden crear i compartir fora d'aquesta llista predeterminada.

En ambdós casos, la llista a nivell d'aplicació ajuda els usuaris a trobar alguna cosa per obrir i la cerca a nivell de protocol resol la comunitat escollida als companys.

## Per què importa aquesta divisió

Una única xarxa descentralitzada encara necessita un bon descobriment, però la capa de descobriment hauria de ser reemplaçable. El protocol bàsic de Bitsocial se centra en l'adreçabilitat, la cerca entre iguals, la publicació i l'anti-spam. La curació viu per sobre d'aquesta capa, on les aplicacions poden experimentar amb directoris, llistes predeterminades, fonts, polítiques de cerca, votació i moderació sense requerir una migració a tota la xarxa.
