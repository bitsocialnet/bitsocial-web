---
title: Bitsocial i Quorum
description: Com es compara Quorum, l'aplicació de missatgeria de grup de Quilibrium amb xifratge d'extrem a extrem i Spaces a l'estil de Discord, amb les comunitats públiques peer-to-peer de Bitsocial.
---

# Bitsocial i Quorum

[Quorum](https://www.quorummessenger.com/) és una aplicació de missatgeria de grup creada per
Quilibrium Inc. sobre la seva xarxa [Quilibrium](https://quilibrium.com/). S'organitza com Discord,
amb Spaces, canals, rols i missatges directes, i els seus missatges estan xifrats d'extrem a extrem.
Apareix al costat de Bitsocial perquè tots dos es descriuen com a peer-to-peer i resistents a la
censura, amb grups que fixen les seves pròpies regles. Persegueixen objectius diferents: Quorum, el
xat de grup privat; Bitsocial, les comunitats públiques que qualsevol pot llegir.

Quilibrium es descriu com una alternativa descentralitzada a les plataformes al núvol: una xarxa de
nodes que guarden les dades en un hipergraf xifrat i es posen d'acord sobre el seu estat mitjançant
un consens que anomena Proof of Meaningful Work. Els nodes guanyen QUIL, el token de la xarxa, amb
què es paguen les tarifes d'ús. Quorum va néixer el 2018 com a Howler, una idea per a una
alternativa privada a Discord, i es va convertir en la primera aplicació a entrar en funcionament
sobre Quilibrium, segons la
[història de Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc.,
fundada per Cassie Heart, desenvolupa el protocol i ofereix Quorum com un dels seus serveis
gestionats ([preguntes freqüents](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Com funciona Quorum

Els detalls següents provenen del codi font dels clients de Quorum,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) per a les aplicacions web i
d'escriptori i [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), a data d'octubre
de 2026.

- **Identitats.** La identitat mestra d'un usuari és un conjunt de claus Ed448, i cada dispositiu
  rep les seves pròpies claus X448 i Ed448. Al navegador, les claus estan protegides per una clau
  d'accés (passkey). Les adreces són hashes que comencen per `Qm`, i els usuaris poden mostrar un
  nom d'usuari del servei de noms de Quilibrium.
- **Xifratge.** Els missatges directes fan servir el Double Ratchet entre dispositius. Un Space
  comparteix una única sessió de Triple Ratchet entre els seus membres, que signen els missatges amb
  claus específiques d'aquell Space. Tots els Spaces estan xifrats, i Quorum afirma que la seva
  intermediació de missatges impedeix que el servei que retransmet els missatges vinculi remitents i
  destinataris.
- **Unir-s'hi.** Als Spaces s'hi entra amb enllaços d'invitació. Un enllaç d'un sol ús porta a la
  URL les claus per unir-s'hi; un enllaç públic les obté del servei de Quorum, i els Spaces públics
  poden figurar en un directori amb cercador.
- **Transport.** Els clients web, d'escriptori i mòbil es connecten tots per HTTPS i un WebSocket a
  un únic servei,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Aquest servei retransmet els missatges xifrats a la safata d'entrada de cada membre i emmagatzema
  els registres d'usuaris, el manifest xifrat de cada Space (canals, rols, emoji), el material
  d'invitació, el directori públic i una sincronització opcional i xifrada de la configuració. El
  programari de node de Quilibrium té un servei de safata d'entrada i hub amb la mateixa estructura,
  però ni els clients ni la documentació de Quilibrium diuen com es correspon aquest servei amb la
  xarxa.
- **Historial.** El client de cada membre conserva la seva pròpia còpia del Space a l'emmagatzematge
  local. El client web i d'escriptori recupera l'historial anterior demanant a un membre connectat
  que el sincronitzi; el client mòbil reprodueix un registre que el servei manté per a cada Space,
  de manera que es pot posar al dia quan no hi ha cap altre membre connectat.
- **Moderació.** Els rols concedeixen permisos per esborrar, fixar, silenciar i fer mencions
  `@everyone`. El client de cada membre comprova la signatura de cada acció de moderació i només
  l'aplica si el signant té el rol adequat. El propietari pot expulsar un membre, cosa que rota les
  claus del Space perquè el membre expulsat no pugui llegir els missatges nous. Un Space pot exigir
  missatges signats o deixar que els membres publiquin missatges sense signar, l'autoria dels quals
  es pot negar.
- **Codi.** El client web i d'escriptori té llicència AGPL-3.0, i el client mòbil, GPL-3.0. El
  client mòbil també inclou una cartera de criptomonedes, integració amb Farcaster i Apex, una
  subscripció de pagament que es descriu més avall.

## On es diferencien

### Grups privats i comunitats públiques

Un Space de Quorum és un grup de membres: només qui té les seves claus el pot llegir, i per
unir-s'hi cal un enllaç d'invitació. Un enllaç públic deixa entrar qualsevol, però només després
d'unir-s'hi. Una comunitat de Bitsocial no té membres. Qualsevol la pot llegir, des de qualsevol
aplicació, sense unir-s'hi, i qualsevol pot intentar publicar-hi, subjecte al repte de la comunitat.

### Què manté un grup en línia

Un Space de Quorum no té cap node amfitrió. Els membres envien els missatges a través del servei de
Quorum, el client de cada membre en conserva una còpia i el propietari no necessita estar en línia
perquè els altres conversin. Una comunitat de Bitsocial viu al node del seu propietari, que accepta
o rebutja cada publicació i publica l'estat més recent de la comunitat. La comunitat continua sent
llegible mentre hi hagi iguals que en facin de seeders, però no pot acceptar publicacions noves
mentre el seu node està desconnectat. Consulta [Protocol peer-to-peer](/peer-to-peer-protocol/).

### Qui fa complir les regles

A Quorum, les regles es fan complir als extrems. El client de cada membre decideix si aplica un
esborrat, una fixació o un silenciament segons el rol del signant, i una expulsió funciona
traslladant tots els altres a claus noves. A Bitsocial, les regles es fan complir al node de la
comunitat: una publicació que no supera el repte o les regles de la comunitat mai no arriba a
formar-ne part. Consulta [Moderació local, no prohibicions globals](/local-moderation/).

### Control de l'spam

Quorum manté fora l'spam sobretot mitjançant invitacions. Un enllaç d'un sol ús admet una persona,
un enllaç públic admet qualsevol que el tingui, i el propietari pot expulsar i canviar les claus
després; el client també limita la freqüència dels seus propis enviaments. Les identitats de
Bitsocial són parells de claus gratuïts, de manera que cada comunitat tria un repte que s'executa
abans d'acceptar una publicació, com ara un captcha, un pagament, un saldo de tokens o una llista de
permesos. Consulta [Reptes antispam personalitzats](/custom-challenges/).

### El client i la xarxa

Una aplicació de Quorum és un client del servei de Quorum, que gestiona Quilibrium Inc. Les
aplicacions no s'uneixen per si mateixes a cap xarxa peer-to-peer, de manera que arribar a un Space
depèn d'aquest únic punt d'accés. Al darrere, Quilibrium és una xarxa pròpia: l'octubre de 2026, el
seu [explorador](https://dashboard.quilibrium.com/) mostrava 114 iguals accessibles i 181 provers
repartits en 99 shards.

Una aplicació web de Bitsocial pot executar un node libp2p a la pestanya, obtenir dels iguals el
contingut de les comunitats i publicar mitjançant gossipsub. El descobriment d'iguals passa per
encaminadors HTTP que només retornen adreces de proveïdors; qualsevol en pot executar un, i els
clients poden canviar d'encaminador modificant la seva configuració. Consulta
[Peer-to-peer al navegador](/browser-p2p/).

### Economia

Quilibrium té un token al seu nucli. Els nodes minen QUIL, amb què es paguen les tarifes de la
xarxa, i una versió embolcallada (wrapped), wQUIL, circula a Ethereum. Quorum en si és gratuït i no
demana cap pagament ni número de telèfon. La seva subscripció opcional Apex costa
[5 dòlars al mes](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
es paga en wQUIL, SNAP o USDC a Ethereum i es reparteix entre Quilibrium Inc. i quatre Spaces que
tria el subscriptor. Bitsocial no té cap capa de pagaments al protocol; una comunitat pot exigir un
pagament o un token mitjançant el seu repte.

### Missatges privats

Aquí Quorum és més fort. Els missatges directes i els missatges dels Spaces estan xifrats d'extrem a
extrem amb secret cap endavant, i el contingut dels missatges només arriba al servei de Quorum com a
text xifrat. Bitsocial se centra en les comunitats públiques i encara no té missatges directes
nadius. Una publicació de Bitsocial va xifrada amb la clau del node de la comunitat mentre viatja
per pubsub, però un cop acceptada és pública.

## Estat del projecte

L'octubre de 2026, el repositori de Quorum qualificava l'aplicació web de beta, i el lloc web de
Quorum encara presentava les aplicacions de Google Play i App Store com a properament disponibles.
Els dos clients també divergeixen: l'aplicació mòbil té les funcions de cartera, Farcaster i Apex,
mentre que el client web i d'escriptori mostra les seves pàgines Wallet i Farcaster com a
properament disponibles, i tots dos es posen al dia de l'historial dels Spaces de manera diferent.

La mainnet de Quilibrium va arribar a la versió 2.1 el 30 de setembre de 2025, quan la xarxa es va
reprendre després d'una aturada ([anunci](https://x.com/QuilibriumInc/status/1973082817236984270)).
El 2026 el node es va reescriure en Rust, amb signatures postquàntiques per al consens i un protocol
de comunicació que els nodes més antics no entenen. Parts de la documentació descriuen el disseny i
no el codi en funcionament: descriuen
l'[encaminament per mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/),
però al node 2.1.0.25 el servei de mixnet és un
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
que accepta missatges sense barrejar-los.

## Comparació

| Pregunta                       | Quorum                                                                                                    | Bitsocial                                                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Categoria                      | Aplicació de missatgeria de grup xifrada d'extrem a extrem a la xarxa Quilibrium                          | Xarxa de comunitats peer-to-peer                                                                                      |
| Identitat                      | Conjunt de claus mestre Ed448 més claus per dispositiu, protegides per una clau d'accés                   | Parells de claus Ed25519 per a usuaris i comunitats                                                                   |
| Qui pot llegir                 | Els membres que tenen les claus d'un Space                                                                | Qualsevol, des de qualsevol aplicació                                                                                 |
| On viuen els missatges         | El dispositiu de cada membre; el client mòbil també reprodueix un registre que guarda el servei de Quorum | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders                              |
| A què es connecten els clients | Al servei de Quorum a `api.quorummessenger.com`                                                           | A iguals mitjançant libp2p, fins i tot des d'una pestanya del navegador                                               |
| Comunitats                     | Spaces amb canals, rols i enllaços d'invitació                                                            | Objectes de primera classe el node dels quals accepta o rebutja publicacions                                          |
| Control de l'spam              | Enllaços d'invitació, expulsions amb canvi de claus, límits de freqüència al client                       | El repte de cada comunitat abans d'acceptar una publicació                                                            |
| Moderació                      | Rols que aplica el client de cada membre; el propietari expulsa                                           | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren                                       |
| Missatges privats              | Missatges directes xifrats d'extrem a extrem                                                              | Comunitats públiques; encara sense missatges directes nadius                                                          |
| Economia                       | Token de xarxa QUIL; subscripció Apex opcional de 5 dòlars al mes                                         | Cap al protocol; un repte pot exigir un pagament o un token                                                           |
| Contrapartida principal        | Grups privats i xifrats, però tots els clients depenen d'un únic servei                                   | Identitats gratuïtes i accés des del navegador, però sense missatgeria privada i només es conserva l'estat més recent |
