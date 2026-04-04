---
title: Spam Blocker
description: Servei centralitzat de detecció de correu brossa amb puntuació de risc, desafiaments OAuth i llindars de nivell configurables.
sidebar_position: 1
---

# Spam Blocker

:::warning Noms heretats
Aquest paquet es va publicar originalment sota l'àmbit `@plebbit`. S'ha canviat de nom a `@bitsocial/spam-blocker-server` i `@bitsocial/spam-blocker-challenge`. Les referències als noms antics encara poden aparèixer a la documentació o bases de codi més antigues.
:::

Spam Blocker és un servei centralitzat de detecció de correu brossa que avalua les publicacions entrants i assigna puntuacions de risc. Consta de dos paquets:

- **`@bitsocial/spam-blocker-server`**: el servidor HTTP que allotja les API d'avaluació i desafiament.
- **`@bitsocial/spam-blocker-challenge`**: un paquet de client lleuger que les comunitats integren per enviar publicacions per a l'avaluació.

**Codi font:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Com funciona la puntuació de risc

Cada publicació enviada al punt final `/evaluate` rep una puntuació de risc numèrica. La puntuació és una combinació ponderada de diversos senyals:

| Senyal               | Descripció                                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edat del compte      | Els comptes més nous reben puntuacions de risc més altes.                                                                                                             |
| Karma                | El karma de la comunitat acumulat redueix el risc.                                                                                                                    |
| Reputació de l'autor | Dades de reputació recopilades per l'indexador de xarxa de fons.                                                                                                      |
| Anàlisi de contingut | Heurístiques a nivell de text (densitat d'enllaços, patrons de correu brossa coneguts, etc.).                                                                         |
| Velocitat            | Les publicacions successives ràpides del mateix autor augmenten el risc.                                                                                              |
| Intel·ligència IP    | Geolocalització a nivell de país i cerques d'amenaces. Només s'emmagatzemen els codis de país; les adreces IP sense processar mai es comparteixen amb les comunitats. |

## Llindars de nivell

La puntuació de risc s'assigna a un dels quatre nivells configurables que determinen què passa a continuació:

1. **Acceptació automàtica**: la puntuació és prou baixa perquè la publicació s'aprovi sense cap desafiament.
2. **OAuth-suficient**: l'autor ha de completar una verificació d'OAuth per continuar.
3. **OAuth-plus-more** -- OAuth per si sol no és suficient; cal una verificació addicional (p. ex., CAPTCHA).
4. **Rebuig automàtic**: la puntuació és massa alta; la publicació és rebutjada rotundament.

Tots els valors de llindar es poden configurar per comunitat.

## Flux de desafiaments

Quan una publicació entra en un nivell que requereix verificació, comença el flux de reptes:

1. Primer se li demana a l'autor que s'autentiqui mitjançant **OAuth** (GitHub, Google, Twitter i altres proveïdors compatibles).
2. Si només OAuth és insuficient (nivell 3), es presenta un **CAPTCHA alternativa** alimentat per Cloudflare Turnstile.
3. La identitat d'OAuth s'utilitza únicament per a la verificació; **mai es comparteix** amb la comunitat o amb altres usuaris.

## Punts finals de l'API

### `POST /evaluate`

Envieu una publicació per a l'avaluació de riscos. Retorna la puntuació de risc calculada i el nivell de desafiament requerit.

### `POST /challenge/verify`

Envieu el resultat d'un repte completat (token OAuth, solució CAPTCHA o tots dos) per a la verificació.

### `GET /iframe/:sessionId`

Retorna una pàgina HTML incrustable que representa la interfície d'usuari de desafiament adequada per a la sessió determinada.

## Limitació de tarifes

Els límits de tarifes s'apliquen de manera dinàmica en funció de l'edat i la reputació de l'autor. Els autors més nous o de menor reputació s'enfronten a límits més estrictes, mentre que els autors establerts gaudeixen de llindars més generosos. Això evita les inundacions de correu brossa sense penalitzar els participants de confiança.

## Indexador de xarxa de fons

El servidor executa un indexador en segon pla que rastreja contínuament la xarxa per crear i mantenir les dades de reputació de l'autor. Aquestes dades s'alimenten directament a la canalització de puntuació de risc, cosa que permet al sistema reconèixer els participants de bona fe repetits a través de les comunitats.

## Privadesa

El bloquejador de correu brossa està dissenyat tenint en compte la privadesa:

- Les identitats d'OAuth només s'utilitzen per a la verificació de desafiaments i **mai es divulguen** a les comunitats.
- Les adreces IP es resolen en **només codis de país**; Les IP en brut no s'emmagatzemen ni es comparteixen.

## Base de dades

El servidor utilitza **SQLite** (mitjançant `better-sqlite3`) per a la persistència local de les dades de reputació, l'estat de la sessió i la configuració.
