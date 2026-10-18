---
title: On viuen les publicacions i quant duren
description: Per què les publicacions de Bitsocial estan signades i adreçades pel contingut però no tots els nodes les desen per sempre, qui les manté en línia i com els arxius fan llegible el contingut antic.
---

# On viuen les publicacions i quant duren

Bitsocial no desa cada publicació en una cadena de blocs ni en una base de dades d'empresa. El node de
cada comunitat conserva les seves publicacions, els lectors i seeders ajuden a servir-les, i qui vulgui
un registre permanent en pot conservar un. Conservar publicacions per sempre és **opcional, no
obligatori**: el protocol no obliga cada participant a desar la història de tota la xarxa.

Aquesta pàgina explica què significa això a la pràctica, perquè «no desat per sempre» es pot entendre
fàcilment com «desapareix» o «creu-me».

## L'autenticitat i la disponibilitat són preguntes separades

Hi ha dues preguntes diferents sobre una publicació:

1. **És real?** L'ha escrita aquest autor i l'ha acceptada aquesta comunitat?
2. **Encara és en línia?** Algú la pot obtenir avui?

Bitsocial respon la primera pregunta amb criptografia, no amb confiança. Cada publicació està signada
pel parell de claus de l'autor i, quan una comunitat l'accepta, es desa sota un identificador de
contingut (CID): un hash dels seus bytes exactes. Qui obtingui una publicació en pot comprovar la
signatura i el hash. Un node, encaminador, passarel·la o arxiu no en pot canviar el text ni falsificar
una publicació d'una altra persona sense que la comprovació falli.

La segona pregunta és qui en conserva una còpia, i aquesta és l'única part no garantida.

## Qui manté les publicacions en línia

- **El node de la comunitat.** El node del propietari accepta les publicacions i les conserva a la seva
  base de dades mentre la comunitat les conservi. És la còpia que sempre existeix mentre la comunitat
  funciona. Consulta [Protocol peer-to-peer](/peer-to-peer-protocol/).
- **Lectors.** Aplicacions d'escriptori com l'aplicació Electron de 5chan fan de seeders de les
  comunitats que carreguen mentre s'executen; així, moltes parelles serveixen les comunitats populars,
  com passa amb els torrents populars. Una pestanya pot desar contingut a la memòria cau i validar-lo
  mentre és oberta, però no és un host de llarga durada.
- **Seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) permet que
  qualsevol aporti capacitat sempre activa des d'un VPS o una màquina de recanvi. Fixa les últimes
  pàgines i actualitzacions de publicacions de les comunitats, cosa que també fa carregables des de
  navegadors les comunitats allotjades darrere d'encaminadors domèstics.
- **Arxivadors.** Qualsevol persona pot rastrejar comunitats i conservar tot el que vegi. Els arxius
  són serveis ordinaris construïts sobre la xarxa, no un rol especial del protocol.

## Les comunitats trien la seva pròpia retenció

El temps que una comunitat conserva les publicacions antigues és decisió del propietari, no una regla
del protocol. Algunes comunitats volen anys d'història. D'altres estan pensades per oblidar: els
boards de 5chan funcionen com un imageboard, on els fils cauen del board, passen a un arxiu i es purguen
del node del board després d'un temps establert (48 hores per defecte). Una comunitat també pot ometre
l'arxiu del tot.

El mateix protocol admet totes dues opcions perquè la retenció és una política que fixa cada comunitat,
no un cost que hagi de pagar cada node.

## Per què no ho desem tot per sempre?

Una xarxa que exigeix a cada node conservar cada publicació per sempre ha de pagar-ho d'alguna manera:

- **Les cadenes de blocs** fan que cada node complet desi tota la història; per tant, les exigències
  dels nodes creixen amb tota l'activitat i publicar sol costar una comissió.
- **L'emmagatzematge de pagament**, com el lloguer d'emmagatzematge de Farcaster, fa que els usuaris
  paguin per conservar la seva història i poda les publicacions més antigues que excedeixen el que
  paguen. Consulta [Bitsocial i Farcaster](/comparisons/farcaster/).
- **Els servidors centrals** ho conserven tot, però només mentre una empresa ho vol i sota les seves
  regles.

Les xarxes socials no necessiten un registre global. No importa si la publicació A es va acceptar un
mil·lisegon abans que la B, i la majoria de publicacions antigues rarament es llegeixen. Bitsocial deixa
que cada node de comunitat només mantingui les seves comunitats, fent l'allotjament prou barat per a un
portàtil, una Raspberry Pi o un VPS petit. Consulta
[Per què no una cadena de blocs?](/peer-to-peer-protocol/#why-not-a-blockchain)

## La contrapartida

Si ningú no conserva una còpia d'una publicació, pot deixar d'estar disponible. El CID no canvia mai,
però un CID és només una adreça: el contingut només es pot obtenir mentre almenys un node el serveixi.
Si el node d'una comunitat queda fora de línia definitivament i cap lector, seeder o arxiu no n'ha
conservat les publicacions, aquestes publicacions es perden.

Aquest és el cost honest de no exigir un registre global. És també el cost que ja tenen les grans
plataformes: les publicacions antigues hi desapareixen quan desapareixen comptes, servidors o empreses.
La diferència és que, a Bitsocial, conservar alguna cosa no requereix permís de ningú.

## Conservar allò que importa

- **Executa tu mateix el node de la comunitat.** Un propietari que manté el node en marxa conserva
  l'historial de la comunitat mentre la configuració de la comunitat el retingui.
- **Fes de seeder.** Deixar oberta una aplicació d'escriptori o executar `bitsocial-seeder` manté les
  comunitats disponibles per als altres.
- **Arxiva.** Els arxius independents mantenen els fils antics llegibles i cercables després que una
  comunitat els descarti. [5archive.org](https://5archive.org) arxiva boards de 5chan i
  [seeditarchive.org](https://seeditarchive.org) arxiva comunitats Seedit. Tots dos són de codi obert,
  de manera que qualsevol pot mantenir un mirall o un arxiu competidor.

Com que cada publicació arxivada continua signada, un arxiu no pot reescriure en silenci el que algú va
dir: un lector pot comprovar la signatura d'una publicació arxivada igual que la d'una de viva.
