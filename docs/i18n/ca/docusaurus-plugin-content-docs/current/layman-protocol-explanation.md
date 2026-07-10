---
title: Una explicació completa del protocol Bitsocial
description: Una guia senzilla en anglès de les comunitats Bitsocial, la cerca entre iguals, la publicació, els reptes contra el correu brossa, la moderació i les aplicacions.
---

# Una explicació completa del protocol Bitsocial

Aquesta pàgina explica Bitsocial sense suposar que ja enteneu les xarxes peer-to-peer, les claus criptogràfiques, IPFS o pubsub.

Alguns detalls es simplifiquen a propòsit. Per a la versió més tècnica, llegiu la pàgina [Protocol peer-to-peer](./peer-to-peer-protocol.md).

## La versió curta

Bitsocial és un protocol per a aplicacions socials on les comunitats són propietat de claus en comptes d'una base de dades de l'empresa.

Una comunitat Bitsocial té una adreça. Les aplicacions utilitzen aquesta adreça per trobar companys que serveixen a la comunitat, obtenir les darreres publicacions d'aquests companys i publicar publicacions noves a través d'un canal de missatges peer-to-peer. Abans d'acceptar una publicació, la comunitat pot requerir un repte anti-spam, com ara un captcha, un codi d'invitació, un pagament, una comprovació de testimoni, una verificació de moderació de l'IA, una llista de permisos o qualsevol altra regla que es pugui codificar.

Aquesta és la idea central:

1. Una comunitat està controlada per una clau privada.
2. La clau pública proporciona a la comunitat una adreça estable.
3. Els companys ajuden els lectors a trobar i buscar la comunitat.
4. Un node de comunitat accepta o rebutja publicacions noves.
5. La política anti-spam pertany a cada comunitat, no a una plataforma global.

## Per què importen els hashes

Un hash és una empremta digital curta per a dades.

Si dues persones han xifrat exactament el mateix fitxer, obtenen la mateixa empremta digital. Si el fitxer canvia, l'empremta digital canvia. Això fa que els hash siguin útils per trobar i comprovar dades sense confiar en una empresa per dir-vos quin és el fitxer.

Els sistemes peer-to-peer utilitzen aquesta idea constantment. En lloc de demanar a un lloc web "el fitxer anomenat photo.png", un company pot demanar a la xarxa les dades amb una empremta digital específica. Si un altre igual torna les dades incorrectes, la comprovació hash falla.

Bitsocial utilitza hash i identificadors de contingut per a dades de publicació i altres elements de l'estat de la comunitat. El punt important és senzill: les dades es poden abordar pel que són, no només pel lloc on les va allotjar una empresa.

## Per què importen les claus públiques

Una clau pública i una clau privada són un parell coincident.

La clau privada és secreta. És allò que dóna control. La clau pública es pot compartir amb seguretat. Permet a tots els altres comprovar que un missatge, una actualització o una acció de moderació provenen realment de la clau privada corresponent.

Així és com Bitsocial evita els comptes normals de la plataforma. Una empresa no necessita emetre la identitat. Una fila de base de dades no necessita definir el propietari. El parell de claus és l'autoritat.

En termes senzills:

- la clau privada és el controlador de control del propietari
- la clau pública és la identitat o l'adreça pública
- les signatures demostren que una acció prové del propietari

## Què és una comunitat Bitsocial

Una comunitat Bitsocial no és només una pàgina en una aplicació.

Té el seu propi parell de tecles. La clau pública proporciona a la comunitat una adreça de xarxa estable. La clau privada controla les actualitzacions de l'estat de la comunitat, com ara les metadades, les regles, la llista de moderadors, la configuració de desafiaments i els indicadors del contingut acceptat més recent.

Això vol dir que una comunitat pot sobreviure a una interfície. Una aplicació el pot mostrar com un tauler. Una altra aplicació la pot mostrar com a fòrum. Una futura aplicació la pot mostrar en un feed basat en perfils. L'aplicació pot canviar, però l'adreça de la comunitat encara apunta a la mateixa comunitat de propietat.

## Com funciona la lectura

Quan un usuari obre una comunitat Bitsocial, l'aplicació no demana a una base de dades central per a la pàgina.

El flux és més proper a això:

1. L'aplicació ja sap l'adreça de la comunitat o l'obté d'una llista, enllaç, superfície de cerca o
   nom llegible pels humans.
2. L'aplicació demana als encaminadors lleugers quins companys proporcionen actualment aquesta adreça de comunitat.
3. Els encaminadors només retornen adreces d'iguals. No retornen publicacions, regles, perfils o comunitat
   metadades.
4. L'aplicació es connecta als companys i obté l'estat de la comunitat més recent.
5. Aquest estat conté punters per publicar contingut.
6. L'aplicació obté el contingut de la publicació dels companys i el representa en una interfície social normal.

L'encaminador només és un ajudant de cerca. Està més a prop de preguntar-se "qui té això?" que preguntar "si us plau, serviu-me tot el lloc web".

Per obtenir més detalls sobre aquesta divisió, llegiu [Descobriment de continguts](./content-discovery.md).

## Com funciona la publicació

La publicació és diferent de la lectura perquè les xarxes obertes d'igual a igual es poden enviar correu brossa.

Bitsocial gestiona la publicació mitjançant un flux de repte-resposta:

1. L'usuari escriu una publicació o una resposta.
2. L'aplicació s'uneix al tema del missatge peer-to-peer de la comunitat.
3. L'aplicació demana un repte al node de la comunitat.
4. El node de la comunitat envia de tornada el repte.
5. L'usuari o l'aplicació completa el repte.
6. L'aplicació envia la publicació més la resposta al repte.
7. El node de comunitat comprova la resposta i la publicació.
8. Si passa, el node de la comunitat accepta la publicació a la propera actualització de la comunitat.
9. Altres lectors obtenen l'estat actualitzat de la comunitat dels companys.

El repte es produeix abans que la publicació passi a formar part de l'estat comunitari acceptat. Aquesta és la diferència important amb els sistemes on el correu brossa s'accepta primer i s'amaga després.

## Per què són importants els reptes anti-spam

La majoria de les plataformes socials converteixen l'anti-spam en una política de plataforma. Una empresa decideix què compta com a compte vàlid, publicació vàlida, abast vàlid o usuari vàlid.

Bitsocial separa aquestes coses. El protocol ofereix a les comunitats una manera d'exigir un repte abans d'acceptar una publicació, però no obliga totes les comunitats a utilitzar el mateix repte.

Una comunitat pot utilitzar un captcha. Un altre podria utilitzar codis d'invitació. Un altre pot requerir un xec per SMS, un pagament, un NFT, un saldo de testimoni, una puntuació de moderació de l'IA, una prova de reputació, una llista de permisos específica de la comunitat o una regla personalitzada.

Aquesta flexibilitat és important perquè el correu brossa canvia. Una regla de correu brossa a nivell de protocol queda obsoleta. Un repte a nivell de comunitat pot evolucionar sense migrar tota la xarxa.

Per a l'explicació centrada, llegiu [Reptes personalitzats contra el correu brossa](./custom-challenges.md).

## Com funciona la moderació

Bitsocial no està lliure de moderació. És moderació sense un superadministrador global.

Una comunitat pot tenir propietaris i moderadors. Les adreces dels moderadors formen part de l'estat de la comunitat. Quan un moderador fa una acció, aquesta es pot signar. El node de la comunitat i els clients poden comprovar la signatura amb la llista de moderadors.

Això dóna a la moderació un àmbit local:

- un propietari de la comunitat controla aquesta comunitat
- els moderadors actuen mitjançant les claus que la comunitat reconeix
- les aplicacions encara poden triar què indexen, classifiquen, amaguen o ressalten
- cap compte d'empresa a nivell de protocol pot esborrar totes les identitats o apoderar-se de totes les comunitats

A la pràctica, això significa que una comunitat pot eliminar el correu brossa o fer complir regles dins del seu propi espai sense convertir les seves normes en llei per a tota la xarxa.

Per a la vista de política, llegiu [Moderació local, no prohibicions globals](./local-moderation.md).

## Quines aplicacions afegeixen

El protocol no decideix com ha de ser tot el producte.

Una aplicació afegeix l'experiència humana al voltant del protocol:

- llistes de comunitats per defecte
- recerca i descoberta
- feeds i classificació
- maquetació i interfície de publicació
- maneig dels mitjans
- eines de moderació
- embalatge per a mòbils, ordinadors o navegadors
- model de negoci i valors predeterminats

És per això que Bitsocial admet diferents estils d'aplicacions. 5chan pot sentir-se com un tauler d'imatges. Seedit pot semblar una discussió d'estil fòrum. Altres clients poden crear diferents superfícies de descobriment, sistemes de classificació, visualitzacions de moderació o valors predeterminats de la comunitat mentre segueixen utilitzant comunitats Bitsocial compatibles a sota.

El protocol manté la propietat i la publicació portàtils. Les aplicacions competeixen per la qualitat del producte.

## Què afegeix RPC públic

Executar directament un node de comunitat d'igual a igual és potent, però no tothom vol gestionar una màquina sempre activa.

Public RPC és la capa de servei que pot fer que Bitsocial sigui més convenient. Un proveïdor públic de RPC pot ajudar els usuaris a gestionar comunitats des d'un telèfon o un client lleuger, mentre que el model de propietat a llarg termini encara hauria de permetre als usuaris allunyar-se, allotjar-se o triar un proveïdor competidor.

La distinció importa:

- RPC pot ajudar amb el temps de funcionament i la comoditat
- RPC no hauria de convertir-se en custòdia permanent
- la relació del propietari hauria de romandre lligada a les claus, no a la base de dades d'un proveïdor

## El que no és Bitsocial

Bitsocial no és una xarxa social blockchain. Les xarxes socials no necessiten que cada publicació es converteixi en una transacció en un registre global.

Bitsocial no és una federació en el sentit d'ActivityPub. Una comunitat no ha de tenir un compte en un servidor amb un domini, un administrador i una base de dades de servidor.

Bitsocial tampoc és una aplicació. És una capa de protocol compartida per a aplicacions, comunitats, nodes, encaminadors, proveïdors de RPC, serveis de descobriment, mòduls antispam i eines de moderació.

La qüestió no és que cada usuari hagi d'entendre tot això abans de publicar-ho. La qüestió és que el producte pot sentir-se normal mentre que el model de propietat a sota és diferent.

## On anar després

- [Protocol peer-to-peer](./peer-to-peer-protocol.md) explica el flux tècnic.
- [Descobriment de continguts](./content-discovery.md) explica la cerca de xarxa versus la curació d'aplicacions.
- [Reptes personalitzats contra el correu brossa](./custom-challenges.md) explica el sistema de desafiaments.
- [Identitat i propietat comunitària](./identity-and-ownership.md) explica el control de claus
  propietat.
- [Construeix el teu propi client](/build-your-own-client/) explica com es poden basar les aplicacions independents
  la mateixa xarxa.
