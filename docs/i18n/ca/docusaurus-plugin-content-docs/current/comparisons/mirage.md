---
title: Bitsocial i Mirage
description: Com es compara Mirage, un fòrum a l'estil de Reddit sobre la seva pròpia cadena de blocs Cosmos SDK, amb Bitsocial i la seva aplicació a l'estil de Reddit, Seedit.
---

# Bitsocial i Mirage

[Mirage](https://mirage.foundation/) és una xarxa de debat a l'estil de Reddit, amb comunitats,
publicacions en fils i vots. En lloc de la base de dades d'una empresa, funciona sobre la seva
pròpia cadena de blocs, una cadena Cosmos SDK amb consens CometBFT. El producte de Bitsocial més
proper és [Seedit](/apps/seedit/), una aplicació a l'estil de Reddit a la xarxa Bitsocial, de manera
que la comparació tracta sobretot de com cadascun allotja, posseeix i modera les comunitats.

## Com funciona Mirage

- **Nodes.** Un node de Mirage és un sol contenidor Docker que inclou un validador, una base de
  dades PostgreSQL, un indexador, una API HTTP i el frontal web. Cada node també és un validador.
  Per executar-ne un cal un servidor Ubuntu amd64 i 10.000.000 de tokens MIRAGE al compte de
  l'operador, segons la
  [guia de desplegament](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publicar.** El navegador signa cada acció amb la clau secp256k1 de l'usuari, i els usuaris
  gratuïts també calculen una petita prova de treball. El node embolcalla l'acció en una transacció
  de la cadena i en paga la comissió.
- **Llegir.** L'indexador de cada node copia les dades de la cadena a la seva pròpia base de dades i
  serveix els feeds per una API HTTP. Els nodes conserven aproximadament una setmana de blocs, de
  manera que l'historial de publicacions a llarg termini viu a la base de dades de cada node, i un
  node nou comença sense l'historial anterior al seu punt de sincronització.
- **Comptes.** Un compte és una clau derivada d'una frase llavor de 12 paraules, i la mateixa llavor
  funciona a qualsevol node. Els noms d'usuari es registren a la cadena i són únics a tota la xarxa.
- **Comunitats.** Qualsevol nom vàlid ja és una comunitat, i ningú no n'és el propietari. Equips de
  curadors de pagament, de fins a deu usuaris cadascun, mantenen una vista moderada d'una comunitat;
  els lectors trien la vista d'un equip, la vista per defecte del node o una vista sense censura.
  Consulta les [preguntes freqüents de Mirage](https://mirage.talk/faq).
- **Token.** El token MIRAGE paga les subscripcions, recompensa autors i nodes i dona pes en la
  governança als validadors. Els subscriptors se salten la prova de treball i tenen límits més alts.

## On es diferencien

### Qui és el propietari d'una comunitat

A Seedit, qui crea una comunitat en té el parell de claus, n'executa el node o en delega l'execució,
i la modera. A Mirage, ningú no és propietari d'una comunitat: equips de curadors que competeixen
entre ells ofereixen vistes moderades del mateix nom, i la vista per defecte és l'equip triat per
més subscriptors de pagament.

### Control de l'spam

Mirage aplica una sola norma a tota la xarxa: els usuaris gratuïts paguen amb una prova de treball
la dificultat de la qual s'ajusta al volum entrant, i els subscriptors se la salten. A Bitsocial,
cada comunitat tria el seu propi repte, des de captchas fins a llistes blanques o pagaments.
Consulta [Reptes antispam personalitzats](/custom-challenges/).

### Infraestructura

Mirage necessita una cadena de blocs. Els validadors arriben a un consens sobre cada acció, i cada
node executa una pila de servidor completa i ha de tenir un gran stake de tokens. Bitsocial no té
cadena: un node de comunitat funciona amb maquinari de consum des de l'aplicació d'escriptori o amb
`bitsocial-cli`, i els lectors poden ajudar a compartir el contingut.

### Control de tota la xarxa

Mirage té una governança a la cadena ponderada per l'stake dels validadors. Pot canviar la
dificultat, els preus i l'emissió de tokens, encunyar o cremar tokens, i nomenar administradors les
eliminacions dels quals l'indexador de referència aplica a qualsevol publicació. El codi de la
cadena també permet a la governança
[eliminar comptes](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
i
[enviar tokens des de qualsevol adreça](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
L'octubre de 2026, quatre validadors produïen els blocs de la cadena, i els runbooks del mateix
projecte gestionaven tots quatre.

Bitsocial no té cap administrador a nivell de protocol. Els propietaris de cada comunitat la moderen
i les aplicacions trien què mostren. Consulta
[Moderació local, no prohibicions globals](/local-moderation/).

### Navegador

El client web de Mirage és un client HTTP d'un node: el navegador signa les accions però no s'uneix
a cap xarxa peer-to-peer. Les aplicacions de Bitsocial poden executar un node peer-to-peer dins la
pestanya del navegador. Consulta [Peer-to-peer al navegador](/browser-p2p/).

## Comparació

| Pregunta                  | Mirage                                                                                                                                | Bitsocial                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Categoria                 | Fòrum sobre la seva pròpia cadena de blocs (Cosmos SDK)                                                                               | Xarxa de comunitats peer-to-peer                                                                     |
| Identitat                 | Clau secp256k1 a partir d'una llavor de 12 paraules, amb un nom d'usuari a la cadena                                                  | Parells de claus Ed25519 per a usuaris i comunitats                                                  |
| On viuen les publicacions | Transaccions de la cadena i, després, la base de dades PostgreSQL de cada node                                                        | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders             |
| Qui ho manté en línia     | Nodes validadors, cadascun amb 10.000.000 de MIRAGE                                                                                   | Node del propietari de la comunitat més seeders auxiliars                                            |
| Comunitats                | Noms sense propietari amb equips de curadors de pagament que competeixen                                                              | Propietat d'un parell de claus; el node del propietari accepta o rebutja publicacions                |
| Control de l'spam         | Prova de treball per a tota la xarxa; els subscriptors se la salten                                                                   | El repte de cada comunitat abans d'acceptar una publicació                                           |
| Moderació                 | Vistes dels equips de curadors, filtres personals, administradors nomenats per la governança                                          | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren                      |
| Economia                  | Token MIRAGE per a subscripcions, recompenses i stake dels validadors                                                                 | Cap al protocol; un repte pot exigir un pagament o un token                                          |
| Navegador                 | Client HTTP d'un node                                                                                                                 | Node peer-to-peer dins d'una pestanya normal del navegador                                           |
| Contrapartida principal   | Un únic estat compartit i ordenat i un registre fàcil, però un conjunt de validadors petit i poders de governança sobre tota la xarxa | No cal cap cadena ni stake, però sense ordre global i el contingut antic no està garantit per sempre |
