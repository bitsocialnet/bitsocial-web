---
title: Bitsocial i ActivityPub
description: Com es compara el Fediverse, amb Mastodon per al microblogging i Lemmy per a comunitats a l'estil de Reddit, amb les comunitats peer-to-peer de Bitsocial.
---

# Bitsocial i ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) és l'estàndard del W3C en què es basa el
Fediverse. Els usuaris trien un servidor, anomenat instància, que allotja el seu compte, i els
servidors s'intercanvien publicacions entre ells. [Mastodon](https://joinmastodon.org/) n'és el
programari de microblogging més conegut; [Lemmy](https://join-lemmy.org/) és un agregador d'enllaços
i fòrum a l'estil de Reddit format per comunitats temàtiques, cosa que el converteix en l'equivalent
més proper del Fediverse a aplicacions de Bitsocial com [Seedit](/apps/seedit/).

## Com funciona ActivityPub

- **Safates d'entrada i de sortida.** Cada compte té una safata d'entrada (inbox) i una de sortida
  (outbox). Els servidors lliuren activitats a les safates d'entrada d'altres servidors, i cada
  servidor receptor emmagatzema la seva pròpia còpia del que segueixen els seus usuaris.
- **Identitat propietat del servidor.** Els ID dels comptes i de les publicacions són adreces HTTPS
  al domini del servidor d'origen. Un identificador de Mastodon és `@user@domain`, es resol amb
  WebFinger, i el servidor signa els missatges de federació en nom de l'usuari.
- **Clients.** Les aplicacions i els navegadors només parlen amb el servidor de l'usuari, a través
  de l'API d'aquest servidor.
- **Comunitats de Lemmy.** Una comunitat és un actor de grup allotjat en una instància. Els usuaris
  envien publicacions a la comunitat, que les retransmet als seus seguidors; segons l'estàndard
  compartit per a fòrums
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), una
  comunitat pot validar primer les publicacions, fins i tot amb aprovació manual dels moderadors.
- **Moderació.** La moderació és local a cada servidor. Els administradors poden suspendre comptes,
  bloquejar servidors sencers o federar només amb una llista blanca; Lemmy també té moderadors per a
  cada comunitat.
- **Control de l'spam.** ActivityPub no defineix cap mecanisme antispam. Mastodon i Lemmy filtren
  els registres amb aprovació, invitacions, preguntes de sol·licitud, captchas i verificacions de
  correu electrònic, i després confien en els límits de freqüència, les denúncies i la moderació.

## On es diferencien

### La identitat pertany a un domini

Un compte del Fediverse pertany al domini del seu servidor. Mastodon pot redirigir els seguidors a
un compte nou, però [les publicacions no es traslladen](https://docs.joinmastodon.org/user/moving/),
el trasllat s'ha d'iniciar des del servidor antic i hi ha un període d'espera de 30 dies. A
Bitsocial, els perfils i les comunitats són parells de claus, de manera que canviar d'amfitrió o
d'aplicació no canvia la identitat. Consulta
[Identitat i propietat de les comunitats](/identity-and-ownership/).

### On viu una comunitat

Estructuralment, una comunitat de Lemmy s'assembla a una de Bitsocial: les publicacions van a la
comunitat, que les pot revisar abans de retransmetre-les. La diferència és on viu. Una comunitat de
Lemmy només es pot crear a la instància d'origen del seu creador, l'administrador de la instància en
té el [control complet](https://join-lemmy.org/docs/users/05-censorship-resistance.html) i no hi ha
cap manera documentada de traslladar-la a una altra instància. Una comunitat de Bitsocial és un
parell de claus propi: el propietari pot executar-ne el node on vulgui, i no hi ha cap administrador
de servidor per sobre seu.

### Control de l'spam

Els servidors del Fediverse aturen l'spam sobretot en el registre i moderen després. Una comunitat
de Bitsocial executa un repte sobre cada publicació abans d'acceptar-la, i cada comunitat tria el
seu: captcha, llista blanca, pagament o qualsevol altre codi. Consulta
[Reptes antispam personalitzats](/custom-challenges/).

### Mantenir la infraestructura

Mantenir una instància vol dir tenir un servidor sempre en marxa amb domini, TLS i correu
electrònic. Mastodon també necessita PostgreSQL, Redis i processos en segon pla; Lemmy és més
lleuger, uns 150 MB de RAM segons les seves pròpies xifres. Cada instància emmagatzema còpies del
contingut remot que segueixen els seus usuaris. Un node de comunitat de Bitsocial no necessita
domini ni certificat i funciona des de l'aplicació d'escriptori o amb `bitsocial-cli`.

### Què ofereixen els servidors a canvi

Els servidors del Fediverse conserven l'historial complet i el serveixen de manera fiable, i
Mastodon té eines de moderació madures, fruit d'anys de desenvolupament. Bitsocial no garanteix el
contingut antic per sempre, i les seves eines de moderació són a cada aplicació.

## Comparació

| Pregunta                  | ActivityPub (Mastodon, Lemmy)                                                                   | Bitsocial                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Categoria                 | Servidors federats                                                                              | Xarxa de comunitats peer-to-peer                                                         |
| Identitat                 | Compte al domini d'un servidor, signat pel servidor                                             | Parells de claus Ed25519 per a usuaris i comunitats                                      |
| On viuen les publicacions | El servidor d'origen, més còpies a cada servidor que la segueix                                 | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders |
| Qui ho manté en línia     | Administradors d'instàncies                                                                     | Node del propietari de la comunitat més seeders auxiliars                                |
| Comunitats                | Comunitats de Lemmy allotjades en una sola instància                                            | Objectes de primera classe el node dels quals accepta o rebutja publicacions             |
| Control de l'spam         | Filtres de registre, límits de freqüència, denúncies i moderació                                | El repte de cada comunitat abans d'acceptar una publicació                               |
| Moderació                 | Administradors de servidor i moderadors de comunitat, locals a cada servidor                    | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren          |
| Noms                      | Identificadors `@user@domain` i `!community@domain`                                             | Noms `.bso` i `.eth` que es resolen en claus                                             |
| Navegador                 | Client del servidor de l'usuari                                                                 | Node peer-to-peer dins d'una pestanya normal del navegador                               |
| Contrapartida principal   | Historial fiable i moderació madura, però la identitat i les comunitats pertanyen a un servidor | No cal cap servidor ni domini, però el contingut antic no està garantit per sempre       |
