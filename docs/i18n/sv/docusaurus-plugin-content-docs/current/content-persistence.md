---
title: Var inlägg finns och hur länge de finns kvar
description: Varför Bitsocial-inlägg är signerade och innehållsadresserade men inte lagras för alltid av varje nod, vem som håller dem online och hur arkiv håller gammalt innehåll läsbart.
---

# Var inlägg finns och hur länge de finns kvar

Bitsocial lagrar inte varje inlägg på en blockkedja eller i ett företags databas. Varje communitys egen
nod behåller sina inlägg, läsare och seeders hjälper till att servera dem, och den som vill ha ett
permanent register kan behålla ett. Att behålla inlägg för alltid är **valfritt, inte obligatoriskt**:
protokollet tvingar inte varje deltagare att lagra hela nätverkets historik.

Den här sidan förklarar vad det innebär i praktiken, eftersom ”inte lagrat för alltid” lätt misstolkas
som ”försvinner” eller ”lita på mig”.

## Äkthet och tillgänglighet är skilda frågor

Det finns två olika frågor om ett inlägg:

1. **Är det äkta?** Skrev denna författare det, och accepterades det av denna community?
2. **Är det fortfarande online?** Kan någon hämta det i dag?

Bitsocial besvarar den första frågan med kryptografi, inte tillit. Varje inlägg signeras av författarens
nyckelpar och, när en community accepterar det, lagras det under en innehållsidentifierare (CID): en
hash av dess exakta byte. Den som hämtar ett inlägg kan själv kontrollera signaturen och hashen. En
nod, router, gateway eller ett arkiv kan inte ändra texten eller förfalska ett inlägg utan att kontrollen
misslyckas.

Den andra frågan gäller vem som behåller en kopia, och det är den enda delen som inte garanteras.

## Vem håller inlägg online

- **Communityns nod.** Ägarens nod tar emot inlägg och behåller dem i sin databas så länge communityn
  behåller dem. Detta är kopian som alltid finns medan communityn körs. Se [Peer-to-peer-protokoll](/peer-to-peer-protocol/).
- **Läsare.** Skrivbordsappar som 5chan Electron-appen seedar de communities de laddar medan de körs,
  så populära communities serveras av många peers, som populära torrents. En webbläsarflik kan cacha
  och validera innehåll medan den är öppen, men är ingen långlivad värd.
- **Seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) låter vem som helst
  bidra med kapacitet som alltid är på från en VPS eller extramaskin. Den pin:ar communities senaste
  sidor och inläggsuppdateringar och gör även communities bakom hemroutrar laddningsbara i webbläsare.
- **Arkiverare.** Vem som helst kan genomsöka communities och behålla allt de ser. Arkiv är vanliga
  tjänster ovanpå nätverket, inte en särskild roll i protokollet.

## Communities väljer sin egen bevaringstid

Hur länge en community behåller gamla inlägg är ägarens beslut, inte en protokollregel. Vissa vill ha
åratal av historik. Andra är gjorda för att glömma: 5chan-tavlor fungerar som imageboards, där trådar
faller bort från tavlan, flyttas till ett arkiv och rensas från tavlans nod efter en bestämd tid (48
timmar som standard). En community kan också hoppa över arkivet helt.

Samma protokoll stöder båda, eftersom bevaring är en policy varje community bestämmer och inte en
kostnad varje nod måste betala.

## Varför inte lagra allt för alltid?

Ett nätverk som kräver att varje nod behåller varje inlägg för alltid måste betala för det på något sätt:

- **Blockkedjor** låter varje full nod lagra hela historiken, så nodkraven växer med all aktivitet och
  publicering kostar vanligen en avgift.
- **Betald lagring**, som Farcasters lagringshyra, får användare att betala för historiken och rensar de
  äldsta inläggen utöver vad de betalar för. Se [Bitsocial och Farcaster](/comparisons/farcaster/).
- **Centrala servrar** behåller allt, men bara så länge ett företag vill och enligt företagets regler.

Sociala medier behöver ingen global huvudbok. Det spelar ingen roll om inlägg A accepterades en
millisekund före B, och de flesta gamla inlägg läses sällan. Bitsocial låter varje communitynod hålla
bara sina egna communities, vilket gör drift billig nog för en laptop, Raspberry Pi eller liten VPS.
Se [Varför inte en blockkedja?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Avvägningen

Om ingen behåller en kopia av ett inlägg kan det bli otillgängligt. Ett inläggs CID ändras aldrig, men
en CID är bara en adress: innehåll kan hämtas endast medan minst en nod serverar det. Om en communitys
nod stängs av för gott och ingen läsare, seeder eller arkiverare sparade inläggen är de borta.

Det är den ärliga kostnaden för att inte kräva en global huvudbok. Det är också kostnaden som alla stora
plattformar redan har: gamla inlägg försvinner när konton, servrar eller företag försvinner. Skillnaden
är att det på Bitsocial inte krävs någons tillstånd för att behålla något.

## Behåll det som betyder något

- **Driv communitynoden själv.** En communityägare som håller noden igång behåller dess historik, så
  länge communityns inställningar behåller den.
- **Seeda.** Att lämna en skrivbordsapp öppen eller köra `bitsocial-seeder` håller communities tillgängliga.
- **Arkivera.** Oberoende arkiv håller gamla trådar läsbara och sökbara efter att en community släppt dem.
  [5archive.org](https://5archive.org) arkiverar 5chan-tavlor och [seeditarchive.org](https://seeditarchive.org)
  arkiverar Seedit-communities. Båda är öppen källkod, så vem som helst kan driva en spegel eller ett konkurrerande arkiv.

Eftersom varje arkiverat inlägg fortfarande är signerat kan ett arkiv inte i smyg skriva om vad någon
sade: en läsare kan kontrollera ett arkiverat inläggs signatur på samma sätt som ett live-inlägg.
