---
title: Waar berichten staan en hoe lang ze blijven bestaan
description: Waarom Bitsocial-berichten zijn ondertekend en op inhoud zijn geadresseerd, maar niet voor altijd door elke node worden opgeslagen, wie ze online houdt en hoe archieven oude inhoud leesbaar houden.
---

# Waar berichten staan en hoe lang ze blijven bestaan

Bitsocial bewaart niet elk bericht op een blockchain of in een bedrijfsdatabase. De eigen node van elke
community bewaart haar berichten, lezers en seeders helpen ze te serveren, en wie een permanent archief
wil, kan dat bijhouden. Berichten voor altijd bewaren is **optioneel, niet verplicht**: het protocol
dwingt geen enkele deelnemer om de hele geschiedenis van het netwerk op te slaan.

Deze pagina legt uit wat dat in de praktijk betekent, want "niet voor altijd opgeslagen" wordt
makkelijk verkeerd gelezen als "verdwijnt" of "vertrouw me maar".

## Authenticiteit en beschikbaarheid zijn verschillende vragen

Er zijn twee verschillende vragen over een bericht:

1. **Is het echt?** Heeft deze auteur het geschreven en is het door deze community geaccepteerd?
2. **Staat het nog online?** Kan iemand het vandaag ophalen?

Bitsocial beantwoordt de eerste vraag met cryptografie, niet met vertrouwen. Elk bericht is ondertekend
met het sleutelpaar van de auteur en zodra een community het accepteert, wordt het opgeslagen onder een
content identifier (CID): een hash van de exacte bytes. Iedereen die een bericht ophaalt, kan zelf de
handtekening en de hash controleren. Een node, router, gateway of archief kan de tekst van een bericht
niet wijzigen of namens iemand anders een bericht vervalsen zonder dat die controle faalt.

De tweede vraag gaat over wie een kopie bewaart, en dat is het enige deel dat niet wordt gegarandeerd.

## Wie berichten online houdt

- **De node van de community.** De node van de eigenaar accepteert berichten en bewaart ze in zijn
  database zolang de community ze bewaart. Dit is de ene kopie die altijd bestaat zolang de community
  draait. Zie [Peer-to-peer-protocol](/peer-to-peer-protocol/).
- **Lezers.** Desktopapps zoals de 5chan Electron-app seeden de communities die ze laden zolang ze
  draaien, zodat populaire communities door veel peers worden geserveerd, net als populaire torrents.
  Een browsertabblad kan inhoud cachen en valideren zolang het open is, maar is geen langdurige host.
- **Seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) laat iedereen
  permanente capaciteit bijdragen vanaf een VPS of een reservemachine. Deze pinnen de nieuwste pagina's
  en berichtupdates van communities, waardoor communities achter thuisrouters ook in browsers laden.
- **Archivarissen.** Iedereen kan communities crawlen en alles bewaren wat diegene ziet. Archieven zijn
  gewone diensten boven op het netwerk, geen speciale rol in het protocol.

## Communities kiezen hun eigen bewaartermijn

Hoe lang een community oude berichten bewaart, is een beslissing van de eigenaar, geen protocolregel.
Sommige communities willen jaren aan geschiedenis. Andere zijn ontworpen om te vergeten: 5chan-borden
werken als een imageboard, waar threads van het bord vallen, naar een archief gaan en na een bepaalde
tijd van de node van het bord worden verwijderd (standaard na 48 uur). Een community kan het archief ook
helemaal overslaan.

Hetzelfde protocol ondersteunt beide, omdat bewaartermijnen beleid zijn dat elke community instelt,
niet een kost die elke node moet dragen.

## Waarom niet alles voor altijd opslaan?

Een netwerk dat vereist dat elke node elk bericht voor altijd bewaart, moet daar op een of andere manier
voor betalen:

- **Blockchains** laten elke volledige node de hele geschiedenis opslaan, waardoor de nodevereisten met
  alle activiteit groeien en posten meestal geld kost.
- **Betaalde opslag**, zoals Farcaster's opslaghuur, laat gebruikers betalen om hun geschiedenis te
  bewaren en verwijdert de oudste berichten boven wat ze betalen. Zie
  [Bitsocial en Farcaster](/comparisons/farcaster/).
- **Centrale servers** bewaren alles, maar alleen zolang één bedrijf dat wil, onder de regels van dat
  bedrijf.

Sociale media hebben geen wereldwijd grootboek nodig. Het maakt niet uit of bericht A één milliseconde
vóór bericht B werd geaccepteerd, en de meeste oude berichten worden zelden gelezen. Bitsocial laat elke
communitynode alleen zijn eigen communities bewaren, wat hosting goedkoop genoeg houdt voor een laptop,
een Raspberry Pi of een kleine VPS. Zie [Waarom geen blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## De afweging

Als niemand een kopie van een bericht bewaart, kan het onbeschikbaar worden. De CID van een bericht
verandert nooit, maar een CID is slechts een adres: inhoud blijft alleen opvraagbaar zolang minstens één
node die serveert. Als de node van een community voorgoed offline gaat en geen lezer, seeder of archief
de berichten heeft bewaard, zijn die berichten weg.

Dat is de eerlijke prijs van geen wereldwijd grootboek vereisen. Het is ook de prijs die elk groot
platform al betaalt: oude berichten verdwijnen er wanneer accounts, servers of bedrijven verdwijnen.
Het verschil is dat het behouden van iets op Bitsocial niemands toestemming vereist.

## Bewaar wat belangrijk is

- **Draai zelf de communitynode.** Een communityeigenaar die de node draaiende houdt, bewaart de
  geschiedenis van de community zolang de instellingen van de community die behouden.
- **Seed.** Een desktopapp open laten of `bitsocial-seeder` draaien houdt communities beschikbaar voor
  anderen.
- **Archiveer.** Onafhankelijke archieven houden oude threads leesbaar en doorzoekbaar nadat een
  community ze verwijdert. [5archive.org](https://5archive.org) archiveert 5chan-borden en
  [seeditarchive.org](https://seeditarchive.org) archiveert Seedit-communities. Beide zijn open source,
  dus iedereen kan een mirror of concurrerend archief draaien.

Omdat elk gearchiveerd bericht nog steeds is ondertekend, kan een archief niet stilletjes veranderen wat
iemand zei: een lezer kan de handtekening van een gearchiveerd bericht net als van een live bericht
controleren.
