---
title: Bitsocial i les xarxes socials sobre cadena de blocs
description: Com Lens, DeSo i Steem posen les dades socials o les seves normes en una cadena de blocs, i per què Bitsocial no en fa servir cap.
---

# Bitsocial i les xarxes socials sobre cadena de blocs

Lens, DeSo i Steem posen l'activitat social en una cadena de blocs. Els comptes, els seguiments, les
publicacions o les normes que els envolten es converteixen en transaccions que els validadors
ordenen i emmagatzemen. Bitsocial no fa servir cap cadena de blocs: les xarxes socials no necessiten
un ordre global per a cada publicació, així que Bitsocial s'estalvia el consens, el gas i l'staking.
Consulta [Protocol peer-to-peer](/peer-to-peer-protocol/) per veure'n el raonament.

## Què tenen en comú

- **Algú paga cada escriptura.** Lens cobra gas, que les aplicacions poden patrocinar; DeSo cobra
  una comissió per cada acció; Steem raciona les accions segons els tokens en staking.
- **La cadena fixa una sola política antispam per a tothom.** Les comissions, l'stake i el cost dels
  comptes s'apliquen a tota la xarxa en lloc de triar-los cada comunitat.
- **Els registres a la cadena són permanents.** Les aplicacions poden amagar contingut, però no el
  poden eliminar de la cadena.
- **Els navegadors són clients d'API.** Les aplicacions web signen transaccions i llegeixen a través
  d'un node, un indexador o una API que gestiona algú altre.

## Lens

[Lens](https://lens.xyz/) funciona sobre Lens Chain, una capa 2 d'Ethereum construïda amb el ZK
Stack de ZKsync que fa servir Avail per a la disponibilitat de dades. Mask Network
[administra Lens des del gener de 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **A la cadena:** els comptes són contractes intel·ligents, els noms d'usuari són NFT dins d'espais
  de noms, i els grafs, els grups, els feeds i les seves normes també són contractes.
- **Fora de la cadena:** el text i el contingut multimèdia d'una publicació viuen en un fitxer JSON
  en un URI, normalment a Grove, el servei d'emmagatzematge de Lens que funciona per davant d'IPFS.
  Les reaccions i els marcadors els guarda la Lens API, i les aplicacions llegeixen a través
  d'aquesta API.
- **Spam i filtres:** les transaccions necessiten gas en GHO, que les aplicacions poden patrocinar
  amb límits de freqüència. Les normes dels feeds i dels grups poden exigir tenir tokens o fer
  pagaments.
- **Funcionament de la cadena:** [L2BEAT](https://l2beat.com/scaling/projects/lens) classifica Lens
  Chain com un validium de nivell Stage 0 amb un operador centralitzat que pot negar-se a incloure
  transaccions.

## DeSo

[DeSo](https://docs.deso.org/) és una cadena de blocs de capa 1 creada per a aplicacions socials. El
juliol de 2024 va passar de la prova de treball a la prova de participació.

- **A la cadena:** els perfils, les publicacions, els m'agrada, els seguiments i els missatges
  directes són transaccions que emmagatzema cada node complet. Les imatges i els vídeos s'allotgen
  fora de la cadena; el node de referència fa servir Google Cloud Storage i Cloudflare Stream.
- **Spam:** cada acció paga una comissió en DESO. Els usuaris nous solen rebre DESO inicial d'un
  node després de verificar el telèfon.
- **Moderació:** cada node decideix què mostra amb llistes negres o grises, però
  [el contingut es queda a la cadena](https://docs.deso.org/deso-blockchain/content-moderation).
- **Comunitats:** la documentació no descriu cap primitiva de comunitat o de fòrum; una «comunitat»
  és un feed que cura una aplicació.
- **Executar un node:** els validadors necessiten com a mínim 32 GB de RAM i 200 GB de disc, segons
  la [guia de validadors](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) és una cadena de blocs social que recompensa autors i curadors amb
tokens, i [Steemit](https://steemit.com/) n'és la principal aplicació de blogs. Hive es va separar
de Steem el 2020; segons el [llibre blanc de Hive](https://hive.io/whitepaper.pdf), la bifurcació va
arribar després de la venda de Steemit Inc. a Justin Sun.

- **A la cadena:** publicacions de text, comentaris, vots i el seu historial d'edicions, ordenats
  per 21 testimonis (witnesses) elegits que produeixen un bloc cada tres segons. Les imatges
  s'allotgen fora de la cadena.
- **Spam:** les accions consumeixen Resource Credits, que augmenten amb els STEEM en staking. Crear
  un compte costa STEEM; Steemit el paga per als usuaris que verifiquen una adreça de correu
  electrònic i un número de telèfon.
- **Comunitats:** són
  [operacions personalitzades que interpreta un indexador](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  fora del consens. Els moderadors poden silenciar publicacions, cosa que les amaga a les
  aplicacions però les deixa a la cadena.
- **Recompenses:** la inflació finança les recompenses, i els vots ponderats per stake decideixen
  com es reparteixen, de manera que els grans tenidors determinen què rep atenció.

## Comparació

| Pregunta                      | Lens                                                                                         | DeSo                                                                          | Steem                                                                                     | Bitsocial                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Cadena                        | Capa 2 d'Ethereum (validium amb ZK Stack)                                                    | Capa 1 pròpia, prova de participació                                          | Cadena pròpia, prova de participació delegada                                             | Cap                                                                                                 |
| Contingut de les publicacions | JSON fora de la cadena, normalment a Grove                                                   | Text a la cadena; multimèdia fora                                             | Text a la cadena; imatges fora                                                            | Al node del propietari de la comunitat i als iguals que la llegeixen i en fan de seeders            |
| Identitat                     | Compte de contracte intel·ligent; noms d'usuari NFT                                          | Parell de claus amb un perfil a la cadena                                     | Compte de la cadena amb nom i claus per nivells                                           | Parells de claus Ed25519 per a usuaris i comunitats                                                 |
| Comunitats                    | Grups i feeds com a contractes amb normes                                                    | Cap primitiva de comunitat                                                    | Comunitats interpretades per un indexador fora del consens                                | Objectes de primera classe el node dels quals accepta o rebutja publicacions                        |
| Control de l'spam             | Gas (sovint patrocinat), normes de tokens o de pagament                                      | Comissió per cada acció; fons inicials després de verificar el telèfon        | Resource Credits segons l'stake; creació de comptes de pagament                           | El repte de cada comunitat abans d'acceptar una publicació                                          |
| Moderació                     | Administradors de grup, normes a la cadena, ocultació a nivell d'API                         | Cada node filtra què mostra                                                   | Silenciaments de comunitat, vots negatius ponderats per stake, filtres de les aplicacions | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren                     |
| Funcionament                  | Operador de la cadena més la Lens API i Grove                                                | Validadors amb com a mínim 32 GB de RAM                                       | Testimonis elegits més nodes d'API i d'indexació                                          | Un node de comunitat amb maquinari de consum, més seeders auxiliars                                 |
| Contrapartida principal       | Normes programables a la cadena, però el contingut i la lectura depenen dels serveis de Lens | Fons de dades obert, però cada acció costa una comissió i es queda per sempre | Recompenses integrades, però l'stake determina la visibilitat i la governança             | Sense comissions ni stake, però sense ordre global i el contingut antic no està garantit per sempre |
