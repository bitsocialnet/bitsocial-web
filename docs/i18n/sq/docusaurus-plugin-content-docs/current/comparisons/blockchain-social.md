---
title: Bitsocial dhe rrjetet sociale mbi blockchain
description: Si Lens, DeSo dhe Steem i vendosin të dhënat ose rregullat sociale në një blockchain, dhe pse Bitsocial nuk përdor një të tillë.
---

# Bitsocial dhe rrjetet sociale mbi blockchain

Lens, DeSo dhe Steem e vendosin secili aktivitetin social në një blockchain. Llogaritë, ndjekjet,
postimet ose rregullat përreth tyre bëhen transaksione që validatorët i rendisin dhe i ruajnë.
Bitsocial nuk përdor blockchain: media sociale nuk ka nevojë për renditje globale të çdo postimi,
prandaj Bitsocial i shmang konsensusin, gazin dhe staking-un. Shihni
[Protokolli Peer-to-Peer](/peer-to-peer-protocol/) për këtë arsyetim.

## Çfarë kanë të përbashkët

- **Dikush paguan për çdo shkrim.** Lens kërkon gaz, të cilin aplikacionet mund ta sponsorizojnë;
  DeSo merr një tarifë për çdo veprim; Steem i racionon veprimet sipas token-ëve të vënë në staking.
- **Zinxhiri vendos një politikë të vetme kundër spamit për të gjithë.** Tarifat, staking-u dhe
  kostot e llogarive vlejnë në të gjithë rrjetin, në vend që t'i zgjedhë çdo komunitet.
- **Regjistrimet on-chain janë të përhershme.** Aplikacionet mund ta fshehin përmbajtjen, por nuk
  mund ta heqin nga zinxhiri.
- **Shfletuesit janë klientë API.** Aplikacionet web nënshkruajnë transaksione dhe lexojnë përmes
  një nyjeje, indeksuesi ose API-je që e operon dikush tjetër.

## Lens

[Lens](https://lens.xyz/) funksionon në Lens Chain, një layer 2 i Ethereum i ndërtuar me ZK Stack të
ZKsync, që përdor Avail për disponueshmërinë e të dhënave. Mask Network
[e administron Lens që nga janari 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Në zinxhir:** llogaritë janë kontrata inteligjente, emrat e përdoruesve janë NFT brenda
  hapësirave të emrave, dhe grafet, grupet, rrjedhat dhe rregullat e tyre janë gjithashtu kontrata.
- **Jashtë zinxhirit:** teksti dhe media e një postimi ndodhen në një skedar JSON në një URI,
  zakonisht në Grove, i cili është shërbimi i ruajtjes i Lens që vepron si shtresë përpara IPFS.
  Reagimet dhe faqeshënuesit i mban Lens API, dhe aplikacionet lexojnë përmes atij API-je.
- **Spami dhe portat:** transaksionet kanë nevojë për gaz në GHO, të cilin aplikacionet mund ta
  sponsorizojnë me kufizime shpejtësie. Rregullat e rrjedhave dhe të grupeve mund të kërkojnë
  zotërim token-ësh ose pagesa.
- **Funksionimi i zinxhirit:** [L2BEAT](https://l2beat.com/scaling/projects/lens) e vlerëson Lens
  Chain si një validium të Stage 0 me një operator të centralizuar që mund të refuzojë të përfshijë
  transaksione.

## DeSo

[DeSo](https://docs.deso.org/) është një blockchain layer 1 i ndërtuar për aplikacione sociale. Në
korrik 2024 kaloi nga proof of work në proof of stake.

- **Në zinxhir:** profilet, postimet, pëlqimet, ndjekjet dhe mesazhet direkte janë të gjitha
  transaksione që i ruan çdo nyje e plotë. Imazhet dhe videot strehohen jashtë zinxhirit; nyja
  referencë përdor Google Cloud Storage dhe Cloudflare Stream.
- **Spami:** çdo veprim paguan një tarifë në DESO. Përdoruesit e rinj zakonisht marrin DESO
  fillestare nga një nyje pas verifikimit të telefonit.
- **Moderimi:** çdo nyje vendos çfarë shfaq duke e futur përmbajtjen në listë të zezë ose gri, por
  [përmbajtja mbetet on-chain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Komunitetet:** dokumentacioni nuk përshkruan asnjë primitiv komuniteti apo forumi; një
  "komunitet" është një rrjedhë që e kuron një aplikacion.
- **Mbajtja e një nyjeje:** sipas
  [udhëzuesit të validatorëve](https://docs.deso.org/deso-validators/run-a-validator), validatorët
  kanë nevojë për të paktën 32 GB RAM dhe 200 GB disk.

## Steem

[Steem](https://steem.com/) është një blockchain social që i paguan autorët dhe kuratorët me
token-ë, me [Steemit](https://steemit.com/) si aplikacionin kryesor të bloggimit. Hive u nda nga
Steem në vitin 2020; sipas [whitepaper-it të Hive](https://hive.io/whitepaper.pdf), fork-u erdhi pas
shitjes së Steemit Inc. te Justin Sun.

- **Në zinxhir:** postime tekstuale, komente, vota dhe historiku i redaktimeve të tyre, të renditura
  nga 21 dëshmitarë (witnesses) të zgjedhur që prodhojnë një bllok çdo tre sekonda. Imazhet
  strehohen jashtë zinxhirit.
- **Spami:** veprimet konsumojnë Resource Credits, që rriten me STEEM-in e vënë në staking. Krijimi
  i një llogarie kushton STEEM; Steemit e paguan atë për përdoruesit që verifikojnë një adresë
  emaili dhe një numër telefoni.
- **Komunitetet:** ato janë
  [operacione të personalizuara që i interpreton një indeksues](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  jashtë konsensusit. Moderatorët mund t'i heshtin postimet, gjë që i fsheh ato në aplikacione, por
  i lë on-chain.
- **Shpërblimet:** inflacioni financon shpërblimet, dhe votat e peshuara sipas staking-ut vendosin
  si ndahen ato, kështu që mbajtësit e mëdhenj përcaktojnë se çfarë fiton vëmendje.

## Krahasimi

| Pyetja                 | Lens                                                                                     | DeSo                                                                               | Steem                                                                                   | Bitsocial                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Zinxhiri               | Layer 2 i Ethereum (validium ZK Stack)                                                   | Layer 1 i vet, proof of stake                                                      | Zinxhir i vet, delegated proof of stake                                                 | Asnjë                                                                                               |
| Përmbajtja e postimeve | JSON jashtë zinxhirit, zakonisht në Grove                                                | Tekst on-chain; media jashtë zinxhirit                                             | Tekst on-chain; imazhe jashtë zinxhirit                                                 | Në nyjen e pronarit të komunitetit dhe te homologët që e lexojnë dhe e shpërndajnë                  |
| Identiteti             | Llogari si kontratë inteligjente; NFT për emrat e përdoruesve                            | Çift çelësash me profil on-chain                                                   | Llogari zinxhiri me emër dhe çelësa me nivele                                           | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                              |
| Komunitetet            | Grupe dhe rrjedha si kontrata me rregulla                                                | Pa primitiv komuniteti                                                             | Komunitete të interpretuara nga indeksuesi jashtë konsensusit                           | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet                         |
| Kontrolli i spamit     | Gaz (shpesh i sponsorizuar), rregulla me token-ë ose pagesa                              | Tarifë për çdo veprim; fonde fillestare pas kontrollit të telefonit                | Resource Credits nga staking-u; krijim llogarie me pagesë                               | Sfida e secilit komunitet përpara se një postim të pranohet                                         |
| Moderimi               | Administratorët e grupeve, rregulla on-chain, fshehje në nivel API-je                    | Çdo nyje filtron atë që shfaq                                                      | Heshtje në komunitete, vota negative të peshuara sipas staking-ut, filtra aplikacionesh | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin           |
| Funksionimi            | Operatori i zinxhirit plus Lens API dhe Grove                                            | Validatorë me të paktën 32 GB RAM                                                  | Dëshmitarë të zgjedhur plus nyje API dhe indeksuesish                                   | Një nyje komuniteti në pajisje të zakonshme konsumatori, plus seeder-a ndihmës                      |
| Kompromisi kryesor     | Rregulla on-chain të programueshme, por përmbajtja dhe leximi varen nga shërbimet e Lens | Grup i hapur të dhënash, por çdo veprim kushton një tarifë dhe mbetet përgjithmonë | Shpërblime të integruara, por staking-u formëson dukshmërinë dhe qeverisjen             | Pa tarifa apo staking, por pa renditje globale, dhe përmbajtja e vjetër nuk garantohet përgjithmonë |
