---
title: Bitsocial dhe Farcaster
description: Si krahasohet Farcaster, me llogari onchain, qira ruajtjeje dhe rrjetin e validatorëve Snapchain, me komunitetet peer-to-peer të Bitsocial.
---

# Bitsocial dhe Farcaster

[Farcaster](https://docs.farcaster.xyz/) e mban identitetin në një blockchain dhe të dhënat sociale
jashtë tij. Llogaritë, çelësat e aplikacioneve dhe pagesat për ruajtjen ndodhen në kontrata në OP
Mainnet, një layer 2 i Ethereum. Postimet, të quajtura cast, bashkë me ndjekjet dhe reagimet, janë
mesazhe të nënshkruara që i ruan [Snapchain](https://snapchain.farcaster.xyz/), një rrjet i ngjashëm
me blockchain që në vitin 2025 zëvendësoi rrjetin e mëparshëm Hub të Farcaster.

## Si funksionon Farcaster

- **Llogaritë.** Një llogari është një Farcaster ID numerik në pronësi të një adrese Ethereum, e
  cila mund të caktojë edhe një adresë rikuperimi. Aplikacionet postojnë me çelësa aplikacioni të
  deleguar, të regjistruar onchain; një çelës aplikacioni nuk mund ta marrë në kontroll llogarinë.
- **Qiraja e ruajtjes.** Çdo llogari merr me qira njësi ruajtjeje, aktualisht 0,20 dollarë për njësi
  në vit. Një njësi e marrë me qira që nga korriku 2025 mban 100 cast; përtej kësaj, cast-et më të
  vjetra fshihen. Kufizimet e shpejtësisë rriten bashkë me ruajtjen e marrë me qira.
- **Snapchain.** Validatorët i rendisin mesazhet në blloqe me konsensus të stilit Tendermint, dhe
  çdo nyje e plotë mban të dhënat e të gjithë rrjetit. Sipas
  [udhëzuesit të nyjes](https://snapchain.farcaster.xyz/getting-started), nyjet kanë nevojë për
  rreth 16 GB RAM dhe 2 TB hapësirë ruajtjeje.
- **Emrat.** Emrat e parazgjedhur të përdoruesve, të quajtur fname, janë falas dhe lëshohen nga
  serveri i emrave i vetë Farcaster, i cili
  [mund t'i revokojë](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Përdoruesit
  mund të përdorin në vend të tyre një emër `.eth` të regjistruar në Ethereum.
- **Kanalet.** Kanalet tematike janë një veçori eksperimentale e klientit Farcaster. Cast-et në një
  kanal janë të dhëna të protokollit, por meta të dhënat e kanaleve, ndjekjet dhe moderimi
  [ruhen në klient](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Leximi.** Aplikacionet lexojnë përmes një nyjeje Snapchain që e drejtojnë vetë ose përmes një
  ofruesi të menaxhuar, zakonisht Neynar.

## Ku ndryshojnë

### Blockchain-et dhe validatorët

Farcaster varet nga OP Mainnet për llogaritë dhe pagesat, dhe nga Snapchain, një rrjet i ngjashëm me
blockchain, për renditjen e të gjitha të dhënave sociale. Grupi i validatorëve të Snapchain është me
leje (permissioned). Whitepaper-i i tij thotë se censura bëhet e vështirë me rreth dhjetë validatorë
të shpërndarë globalisht; në tetor 2026
[lista e validatorëve](https://snapchain.farcaster.xyz/validators) ishte më e vogël, dhe shumica e
çelësave i përkisnin Neynar, e cila
[bleu Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) në janar 2026. Bitsocial nuk
ka zinxhir, validatorë apo konsensus.

### Të paguash për të postuar

Çdo llogari Farcaster paguan qira ruajtjeje, dhe ruajtja kufizon sa nga historiku i një llogarie
mban rrjeti. Te Bitsocial, postimi nuk kushton asgjë në nivel protokolli; çdo komunitet vendos nëse
do të kërkojë captcha, pagesë, token apo diçka tjetër. Shihni
[Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Komunitetet

Kanalet e Farcaster janë veçori e klientit: klienti ruan meta të dhënat e tyre dhe zbaton moderimin
e kanaleve, kështu që një cast i bllokuar në një kanal mund të mbetet i vlefshëm në rrjet dhe i
dukshëm në aplikacione të tjera. Te Bitsocial, komunitetet janë objekte protokolli me çiftin e tyre
të çelësave, dhe nyja e komunitetit i pranon ose i refuzon postimet.

### Operimi i infrastrukturës

Një nyje Farcaster mban të gjithë rrjetin, kështu që hapësira e saj e ruajtjes rritet me çdo
aktivitet; Farcaster parashikon rritje drejt disqeve më të mëdha në cloud. Një nyje komuniteti
Bitsocial mban vetëm komunitetet e veta dhe funksionon në pajisje të zakonshme konsumatori.

### Shfletuesi

Një aplikacion shfletuesi i Farcaster është klient HTTP i një nyjeje ose ofruesi. Një aplikacion web
i Bitsocial mund të ekzekutojë një nyje peer-to-peer brenda skedës. Shihni
[Peer-to-Peer në shfletues](/browser-p2p/).

## Krahasimi

| Pyetja               | Farcaster                                                                                              | Bitsocial                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Kategoria            | Identitet onchain me të dhëna sociale të renditura nga validatorët                                     | Rrjet komunitetesh peer-to-peer                                                                            |
| Identiteti           | Farcaster ID në pronësi të një adrese Ethereum, me çelësa aplikacioni të deleguar                      | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                                     |
| Ku ruhen postimet    | Snapchain, i replikuar në çdo nyje të plotë, brenda kufijve të ruajtjes së paguar                      | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë                                |
| Kush e mban në linjë | Validatorët e Snapchain dhe operatorët e nyjeve                                                        | Nyja e pronarit të komunitetit plus seeder-a ndihmës                                                       |
| Komunitetet          | Kanale eksperimentale të menaxhuara nga klienti Farcaster                                              | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet                                |
| Kontrolli i spamit   | Qira ruajtjeje dhe kufizime shpejtësie, plus etiketa spami në nivel aplikacioni                        | Sfida e secilit komunitet përpara se një postim të pranohet                                                |
| Moderimi             | Pritësit e kanaleve në klient, filtra aplikacionesh, rrezik censure në nivel validatorësh              | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin                  |
| Emrat                | Fname falas që Farcaster mund t'i revokojë, ose emra `.eth`                                            | Emra `.bso` dhe `.eth` që zgjidhen në çelësa                                                               |
| Shfletuesi           | Klient HTTP i një nyjeje ose ofruesi                                                                   | Nyje peer-to-peer brenda një skede të zakonshme shfletuesi                                                 |
| Kompromisi kryesor   | Një grup i vetëm dhe koherent të dhënash globale, por qira, zinxhirë dhe një grup i vogël validatorësh | Pa tarifa apo zinxhirë, por pa grup të dhënash global, dhe përmbajtja e vjetër nuk garantohet përgjithmonë |
