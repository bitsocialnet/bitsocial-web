---
title: Creeu un client de tauler d'imatges
description: Guia de contribucions de la fase 1 per als constructors que volen enviar noves experiències de taulers d'imatges a Bitsocial.
sidebar_position: 1
---

# Creeu un client de tauler d'imatges

La fase 1 no tracta d'una aplicació oficial que cobreixi tota la categoria. 5chan és el primer punt de prova, però l'objectiu real és un ampli ecosistema de taulers d'imatges: diversos clients Bitsocial amb diferents llenguatges visuals, valors per defecte de moderació, models de directoris i comunitats objectiu.

## Què necessita la Fase 1

- Clients coneguts d'estil 4chan per a la incorporació generalitzada
- Clients inspirats en Altchan amb diferents cultures i paquets de taulers
- Clients mòbils primer o amb ample de banda baix
- Clients d'una sola comunitat o nínxol amb forts valors per defecte opinió
- Millors fluxos de moderació, mitjans, incorporació o descobriment que els que s'envia la primera aplicació

## La forma més ràpida d'ajudar

Si voleu el camí més curt cap a l'enviament, primer contribuïu directament a 5chan:

- Exploreu l'aplicació en directe a [5can.app](https://5chan.app)
- Reviseu la font a [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Uneix-te al xat del constructor a [t.me/fivechandev](https://t.me/fivechandev)

## Construeix el teu propi client

Si 5chan no coincideix amb la comunitat o la interfície que voleu, creeu un client separat. Els clients compatibles de Bitsocial poden compartir la mateixa xarxa sense compartir les mateixes decisions de producte.

1. Conegueu les eines de protocol:
   - [Ganxos Bitsocial React](../react-hooks/)
   - [CLI de bitsocial](../cli/)
2. Decidiu quin tipus de tauler d'imatge esteu construint realment.
Trieu primer l'estructura del tauler, els supòsits d'identitat, el model de moderació, el flux de descobriment i el llenguatge visual.
3. Trieu la ruta d'implementació que s'adapti al projecte.
Fork 5chan si voleu moureu ràpidament amb una base de tauler d'imatges coneguda. Comenceu de nou si la interfície d'usuari o el model d'interacció han de ser radicalment diferents.
4. Envieu una primera versió estreta.
Un client que serveix bé a una comunitat real és més valuós que un clon vague destinat a satisfer tothom.
5. Publiqueu el resultat i deixeu que les comunitats el provi.
Bitsocial millora quan els constructors externs envien clients amb opinions que competeixen per la qualitat del producte en lloc d'esperar que una aplicació oficial ho faci tot.

## Principi de disseny

Bitsocial no guanya tenint un client beneït. Guanya quan molts clients poden conviure, bifurcar, especialitzar-se i atendre les necessitats que la primera aplicació no ho farà mai.
