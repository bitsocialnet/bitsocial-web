---
title: Hvor indlæg lever, og hvor længe de varer
description: Hvorfor Bitsocial-indlæg er signerede og indholdsadresserede, men ikke gemmes for altid af hver node, hvem der holder dem online, og hvordan arkiver holder gammelt indhold læsbart.
---

# Hvor indlæg lever, og hvor længe de varer

Bitsocial gemmer ikke hvert indlæg på en blockchain eller i en virksomheds database. Hvert fællesskabs
egen node beholder indlæggene, læsere og seedere hjælper med at levere dem, og alle, der vil have et
permanent register, kan føre ét. At beholde indlæg for altid er **valgfrit, ikke obligatorisk**:
protokollen tvinger ikke hver deltager til at gemme hele netværkets historik.

Denne side forklarer, hvad det betyder i praksis, for „ikke gemt for altid“ er let at misforstå som
„forsvinder“ eller „tro mig“.

## Ægthed og tilgængelighed er forskellige spørgsmål

Der er to forskellige spørgsmål om et indlæg:

1. **Er det ægte?** Skrev denne forfatter det, og accepterede dette fællesskab det?
2. **Er det stadig online?** Kan nogen hente det i dag?

Bitsocial svarer på det første med kryptografi, ikke tillid. Hvert indlæg er signeret af forfatterens
nøglepar, og når et fællesskab accepterer det, gemmes det under en indholdsidentifikator (CID): en hash
af dets nøjagtige bytes. Alle, der henter et indlæg, kan selv kontrollere signaturen og hashen. En node,
router, gateway eller et arkiv kan ikke ændre indlæggets tekst eller forfalske et indlæg fra andre uden
at kontrollen fejler.

Det andet spørgsmål handler om, hvem der beholder en kopi, og det er den eneste del, der ikke garanteres.

## Hvem holder indlæg online

- **Fællesskabets node.** Ejerens node accepterer indlæg og beholder dem i databasen, så længe
  fællesskabet beholder dem. Det er den ene kopi, som altid findes, mens fællesskabet kører. Se
  [Peer-to-peer-protokol](/peer-to-peer-protocol/).
- **Læsere.** Desktopapps som 5chan Electron-appen seeder de fællesskaber, de indlæser, mens de kører;
  populære fællesskaber leveres dermed af mange peers, som populære torrents. En browserfane kan cache
  og validere indhold, mens den er åben, men er ikke en langtidshost.
- **Seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) lader alle bidrage
  med altid tændt kapacitet fra en VPS eller en reservemaskine. Den pinner fællesskabers seneste sider
  og indlægsopdateringer, så fællesskaber bag hjemmeroutere også kan indlæses fra browsere.
- **Arkivarer.** Alle kan crawle fællesskaber og beholde alt, de ser. Arkiver er almindelige tjenester
  oven på netværket, ikke en særlig rolle i protokollen.

## Fællesskaber vælger selv deres opbevaringstid

Hvor længe et fællesskab beholder gamle indlæg, afgør ejeren, ikke protokollen. Nogle ønsker mange års
historik. Andre er lavet til at glemme: 5chan-boards fungerer som et imageboard, hvor tråde falder af
boardet, flyttes til et arkiv og slettes fra boardets node efter en fast tid (48 timer som standard).
Et fællesskab kan også helt springe arkivet over.

Samme protokol understøtter begge dele, fordi opbevaring er en politik, hvert fællesskab fastlægger, og
ikke en udgift, hver node skal betale.

## Hvorfor ikke gemme alt for altid?

Et netværk, der kræver, at hver node beholder hvert indlæg for altid, må betale for det på en måde:

- **Blockchains** får hver fuld node til at gemme hele historikken; derfor vokser nodekravene med al
  aktivitet, og publicering koster normalt et gebyr.
- **Betalt lagring**, som Farcasters storage rent, får brugere til at betale for deres historik og
  beskærer de ældste indlæg ud over det, de betaler for. Se
  [Bitsocial og Farcaster](/comparisons/farcaster/).
- **Centrale servere** beholder alt, men kun så længe et firma vil det, og efter firmaets regler.

Sociale medier behøver ikke en global hovedbog. Det betyder intet, om indlæg A blev accepteret et
millisekund før B, og de fleste gamle indlæg læses sjældent. Bitsocial lader hver fællesskabsnode kun
holde sine egne fællesskaber, så hosting er billigt nok for en bærbar, en Raspberry Pi eller en lille
VPS. Se [Hvorfor ikke en blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Afvejningen

Hvis ingen beholder en kopi af et indlæg, kan det blive utilgængeligt. Et indlægs CID ændrer sig aldrig,
men en CID er kun en adresse: indhold kan kun hentes, mens mindst én node leverer det. Hvis en
fællesskabsnode går permanent offline, og ingen læser, seeder eller arkiv beholdt indlæggene, er de væk.

Det er den ærlige pris for ikke at kræve en global hovedbog. Det er også en pris, alle store platforme
allerede har: gamle indlæg forsvinder, når konti, servere eller virksomheder forsvinder. Forskellen er,
at det på Bitsocial ikke kræver nogens tilladelse at beholde noget.

## Bevar det, der betyder noget

- **Kør selv fællesskabsnoden.** En ejer, der holder noden i gang, bevarer fællesskabets historik, så
  længe fællesskabets indstillinger bevarer den.
- **Seed.** En åben desktopapp eller `bitsocial-seeder` holder fællesskaber tilgængelige for andre.
- **Arkivér.** Uafhængige arkiver holder gamle tråde læsbare og søgbare, efter et fællesskab dropper
  dem. [5archive.org](https://5archive.org) arkiverer 5chan-boards, og
  [seeditarchive.org](https://seeditarchive.org) arkiverer Seedit-fællesskaber. Begge er open source,
  så alle kan drive et spejl eller et konkurrerende arkiv.

Da hvert arkiveret indlæg stadig er signeret, kan et arkiv ikke i stilhed omskrive, hvad nogen sagde:
en læser kan kontrollere et arkiveret indlægs signatur på samme måde som et levende.
