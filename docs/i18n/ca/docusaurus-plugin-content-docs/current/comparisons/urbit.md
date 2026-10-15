---
title: Bitsocial i Urbit
description: Com es compara Urbit, una xarxa de servidors personals amb Urbit IDs basats en Ethereum i grups gestionats pel seu amfitrió a Tlon Messenger, amb les comunitats peer-to-peer de Bitsocial.
---

# Bitsocial i Urbit

[Urbit](https://urbit.org/) és una xarxa de servidors personals. Cada usuari té un ordinador sempre
encès, anomenat nau (ship), que executa el sistema operatiu propi d'Urbit (Arvo), escrit en els seus
propis llenguatges (Nock i Hoon), i que s'identifica amb un Urbit ID. La seva aplicació social
principal és [Tlon Messenger](https://tlon.io/), creada per Tlon, l'empresa fundada el 2013 per
desenvolupar Urbit.

Urbit aspira a substituir tota la pila informàtica, de manera que és un projecte molt més ampli que
Bitsocial. La seva capa social, però, fa servir un model proper al de Bitsocial: una comunitat viu
al node del seu propietari, i aquest node decideix què hi entra. Tots dos es diferencien en qui ha
d'executar un servidor i en com es manté fora l'spam.

## Com funciona Urbit

- **Urbit IDs.** Cada nau té un Urbit ID: un número que es mostra com un nom pronunciable, per
  exemple `~sampel-palnet`. Els ID de capa 1 (Layer 1) són NFT la titularitat i les claus públiques
  de xarxa dels quals es registren als contractes d'Azimuth a Ethereum. Els ID de capa 2 (Layer 2),
  afegits el 2021 per reduir les comissions, fan servir un «naive rollup»: les seves transaccions es
  publiquen a Ethereum per lots, però la seva titularitat no es desa al contracte d'Azimuth, i cada
  nau la calcula localment. Tlon gestiona un roller d'ús públic i gratuït, segons la
  [documentació d'Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) i
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Una jerarquia fixa.** L'espai d'adreces té 256 galàxies, 65.536 estrelles i uns 4.000 milions de
  planetes per a l'ús quotidià. Les galàxies emeten estrelles, les estrelles emeten planetes, i cada
  planeta pot emetre llunes per als seus propis dispositius. Els cometes són ID gratuïts que una nau
  genera per a si mateixa i que mai no toquen la cadena de blocs. Els propietaris de les galàxies
  formen el Galactic Senate, que vota les actualitzacions dels contractes d'Azimuth i elegeix la
  junta de la Urbit Foundation.
- **Xarxa.** Les naus intercanvien paquets xifrats de manera peer-to-peer. Des del juliol de 2026,
  el protocol de xarxa és [Directed Messaging](https://urbit.org/blog/directed-messaging), una
  reescriptura centrada en el contingut de l'antic protocol Ames. Les galàxies s'encarreguen del
  descobriment d'iguals: cadascuna fa el seguiment d'on són les naus que té per sota i els
  retransmet paquets fins que les dues naus es poden comunicar directament, o durant tot el temps
  que un tallafoc ho impedeixi, segons
  l'[article sobre Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grups.** A Tlon Messenger, un grup s'allotja a la nau del seu creador. Els membres envien
  missatges a l'amfitrió, que els distribueix a la nau de cada membre, i la nau de cada membre en
  conserva la seva pròpia còpia, segons les
  [preguntes freqüents de Tlon](https://tlon.io/posts/faq). L'amfitrió controla els rols, els canals
  i l'admissió. Un grup pot ser públic, privat o secret, i pot
  [vetar naus concretes o rangs sencers d'ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Els canals són xats, quaderns o col·leccions d'imatges i enllaços.
- **Allotjament.** En registrar-se a Tlon, un usuari nou rep una nau que gestiona Tlon, amb claus
  que Tlon custodia. Un usuari pot exportar la nau i el seu master ticket i executar-la en un altre
  lloc: en un dispositiu de [Native Planet](https://www.nativeplanet.io/) o amb el runtime Vere a
  Linux, macOS o Windows. Les naus encara no poden emmagatzemar fitxers grans directament, de manera
  que Tlon Messenger desa les imatges i altres continguts multimèdia en un emmagatzematge al núvol
  compatible amb S3.

## On es diferencien

### Qui ha d'executar un servidor

A Urbit, cada participant és un servidor. Les aplicacions de Tlon són interfícies per a la nau
pròpia de l'usuari, i fins i tot llegir un grup passa per ella. Qui no executa una nau pròpia en
lloga una, cosa que torna a posar en escena un proveïdor d'allotjament: Tlon guarda les claus dels
usuaris allotjats i conserva un accés limitat per a tasques de manteniment, tot i que els usuaris
poden marxar amb tota la seva nau.

A Bitsocial, només els propietaris de comunitats necessiten un node sempre encès. Qui llegeix i
publica pot executar un node peer-to-peer dins d'una pestanya del navegador, i el seu compte és un
parell de claus que guarda l'aplicació. Consulta [Peer-to-peer al navegador](/browser-p2p/). Quan
algú sí que fa servir un node allotjat, el disseny de Bitsocial pretén que pugui delegar la
disponibilitat sense cedir la custòdia de la identitat. Consulta
[Identitat i propietat de les comunitats](/identity-and-ownership/).

### L'amfitrió de la comunitat

Aquí és on tots dos s'assemblen més. Un grup de Tlon i una comunitat de Bitsocial viuen tots dos al
node del seu propietari. L'amfitrió decideix qui pot publicar, aplica la moderació i distribueix el
resultat, i cap dels dos protocols no posa un moderador per sobre de l'amfitrió. En tots dos casos,
l'amfitrió ha d'estar en línia. Les preguntes freqüents de Tlon diuen que, si l'amfitrió es
desconnecta, «el grup cau amb ell», i una comunitat de Bitsocial no pot acceptar publicacions noves
mentre el seu node està desconnectat.

Emmagatzemen el contingut de manera diferent. La nau de cada membre conserva una còpia de
l'historial del grup, de manera que els membres poden continuar llegint el que ja han rebut mentre
l'amfitrió està caigut. Un lector de Bitsocial obté l'estat més recent de la comunitat del node de
la comunitat o dels iguals que en fan de seeders, de manera que una comunitat desconnectada continua
sent llegible mentre hi hagi iguals que la tinguin, però la xarxa només conserva l'estat més recent.

Un grup de Tlon també té una llista de membres, i el seu amfitrió pot fer que només s'hi pugui
entrar per invitació. Una comunitat de Bitsocial no té membres: qualsevol la pot llegir, i qualsevol
pot intentar publicar-hi, subjecte al seu repte.

### Spam i identitat

Urbit combat l'spam fent que la identitat sigui escassa. L'oferta de planetes és fixa i cadascun
l'emet una estrella. Els cometes gratuïts eludeixen aquesta escassetat, de manera que els grups que
volen que es mantingui els rebutgen: la documentació d'Urbit assenyala que alguns grups rebutgen els
cometes, i un grup de Tlon pot vetar tot el rang dels cometes amb un sol ajust. Un cop exclosos els
cometes, un usuari vetat necessita un altre planeta del propietari d'una estrella per tornar. La
reputació també pot seguir la jerarquia: Azimuth inclou un contracte Censures que permet a galàxies
i estrelles marcar ID. Com que l'escassetat està integrada a l'espai d'adreces, funciona igual en
tots els grups que rebutgen els cometes.

Les identitats de Bitsocial són parells de claus gratuïts. Cada comunitat tria el seu propi repte
abans d'acceptar una publicació, com ara un captcha, un pagament, un saldo de tokens o una llista de
permesos, i altres comunitats poden triar de manera diferent. Consulta
[Reptes antispam personalitzats](/custom-challenges/).

### Cadena de blocs i governança

La capa d'identitat d'Urbit depèn d'Ethereum. Els contractes d'Azimuth registren la titularitat i
les claus de xarxa de capa 1, les transaccions de capa 2 es publiquen a Ethereum per lots, i el
Galactic Senate pot actualitzar el contracte que governa Azimuth. Aquestes mateixes 256 galàxies
també s'encarreguen del descobriment d'iguals i de la retransmissió, de manera que un conjunt fix
d'identitats sosté alhora la governança i part de l'encaminament de la xarxa.

Les identitats de Bitsocial són parells de claus que no necessiten registre. Els noms `.bso` i
`.eth` són àlies opcionals que s'hi resolen. El descobriment d'iguals passa per encaminadors HTTP
que només retornen adreces de proveïdors; qualsevol en pot executar un, i els clients poden canviar
d'encaminador modificant la seva configuració.

### Abast

Urbit és un ordinador d'ús general. Una nau pot allotjar un remot de Git, una base de coneixement
personal o agents d'IA, i Tlon Messenger és un programa entre molts. Desenvolupar per a Urbit vol
dir sobretot escriure aplicacions en Hoon per a Arvo. Bitsocial és un protocol per a comunitats
públiques, amb aplicacions com [5chan](/apps/5chan/) i [Seedit](/apps/seedit/). Funciona sobre la
pila existent (libp2p, IPFS i el navegador) en lloc de substituir-la, i els seus clients es
construeixen amb eines web corrents. Consulta
[Construeix el teu propi client](/build-your-own-client/).

### Missatges privats

Aquí Urbit és més fort. Els missatges directes van d'una nau directament a una altra, tot el trànsit
entre naus està xifrat, i els grups poden ser privats o secrets. Tlon adverteix que els missatges es
xifren en trànsit, però s'emmagatzemen sense xifrar a la nau. Bitsocial se centra en les comunitats
públiques i encara no té missatges directes nadius.

## Estat del projecte

Urbit ha passat per una etapa convulsa. L'agost de 2024, la Urbit Foundation, l'organització sense
ànim de lucre que dirigeix el desenvolupament del nucli, va acomiadar el seu director executiu; el
fundador Curtis Yarvin va tornar per dirigir l'estratègia sense cap càrrec formal, diversos
desenvolupadors del nucli se'n van anar i el marge financer de la Foundation es mesurava en mesos,
[segons va informar CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin va proposar traslladar Azimuth a una capa 2 d'Ethereum ja existent, probablement Base, i
emetre tokens fungibles de «visat» convertibles en planetes. A data d'octubre de 2026, la
[documentació d'ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) d'Urbit encara descriu Azimuth
a Ethereum amb el seu naive rollup. L'octubre de 2025, el Galactic Senate va substituir la junta de
la Foundation, i la nova junta va nomenar un nou director executiu
([anunci](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

El desenvolupament continua. Directed Messaging va entrar en funcionament amb la versió 408k el 14
de juliol de 2026. El juny de 2026, Tlon Messenger
[va obrir el registre públic sense llista d'espera](https://urbit.org/blog/this-month-in-urbit-june-2026),
i Tlon ara es presenta com un lloc on persones i agents d'IA treballen junts.

## Comparació

| Pregunta                  | Urbit                                                                                               | Bitsocial                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Categoria                 | Xarxa de servidors personals i sistema operatiu                                                     | Xarxa de comunitats peer-to-peer                                                                                      |
| Identitat                 | Urbit IDs: uns 4.000 milions de planetes a Ethereum o al seu rollup de capa 2, més cometes gratuïts | Parells de claus Ed25519 per a usuaris i comunitats                                                                   |
| Qui executa un servidor   | Cada usuari, a la seva pròpia nau o en una d'allotjada                                              | Els propietaris de comunitats; qui llegeix i publica pot fer servir una pestanya del navegador                        |
| On viuen les publicacions | La nau de l'amfitrió del grup i una còpia a la nau de cada membre                                   | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders                              |
| Comunitats                | Grups allotjats a la nau del seu creador, amb llistes de membres                                    | Objectes de primera classe el node dels quals accepta o rebutja publicacions                                          |
| Control de l'spam         | ID escassos emesos per estrelles; els grups veten naus o rangs sencers                              | El repte de cada comunitat abans d'acceptar una publicació                                                            |
| Moderació                 | Els rols i vetos de l'amfitrió del grup                                                             | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren                                       |
| Descobriment d'iguals     | Les galàxies fan el seguiment de les naus que tenen per sota i en retransmeten el trànsit           | Els encaminadors HTTP retornen iguals proveïdors i no emmagatzemen contingut                                          |
| Governança                | El Galactic Senate de 256 galàxies vota les actualitzacions d'Azimuth                               | Cap autoritat a nivell de protocol sobre les identitats o les comunitats                                              |
| Missatges privats         | Missatges directes xifrats i grups només per invitació                                              | Comunitats públiques; encara sense missatges directes nadius                                                          |
| Contrapartida principal   | Un ordinador personal complet amb grups privats, però cada usuari necessita una nau sempre encesa   | Identitats gratuïtes i accés des del navegador, però sense missatgeria privada i només es conserva l'estat més recent |
