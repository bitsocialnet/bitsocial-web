---
title: Bitsocial dhe Lapis Net
description: Si krahasohet Lapis Net, një protokoll social peer-to-peer në Kotlin me vlerësime besimi për çdo lexues dhe dukshmëri të mbështetur nga Bitcoin, me Bitsocial.
---

# Bitsocial dhe Lapis Net

[Lapis Net](https://net.lapisproject.dev/) është një protokoll rrjeti social peer-to-peer i shkruar
në Kotlin për JVM. Ai arriti në mënyrë të pavarur te themele të afërta me ato të Bitsocial:
identitete me çifte çelësash, ruajtje përmbajtjeje në stilin e IPFS dhe libp2p gossipsub. Të dy
ndryshojnë në vendin ku e vendosin filtrimin e spamit dhe kurimin. Lapis i jep çdo lexuesi një graf
personal besimi dhe lejon që pagesat në Bitcoin dhe Lightning të rrisin dukshmërinë; Bitsocial e lë
çdo komunitet të vendosë se çfarë mund të publikohet.

Lapis është një prototip funksional. Sipas
[depos së tij](https://github.com/lapisproject-dev/Lapis-Net), në tetor 2026 ai nuk kishte ende
rrjet publik, dhe lidhja e dy nyjeve ishte një hap manual.

## Si funksionon Lapis

- **Identitetet.** Çdo identitet është një çift çelësash secp256k1, i përputhshëm me çelësat e
  Bitcoin, me një çelës Ed25519 të lidhur me të për peer ID-në e libp2p.
- **Ruajtja dhe përhapja.** Përmbajtja ruhet me Nabu, një zbatim i IPFS mbi libp2p (DHT dhe
  Bitswap), dhe përhapet me libp2p gossipsub.
- **Vlerësimet.** Katër vlerësime opsionale qëndrojnë mbi një bërthamë që mbetet neutrale ndaj
  kurimit:
  - Veritas, një rrjet besimi i llogaritur nga grafi i besimit i vetë secilit lexues
  - Virtus, dukshmëri e mbështetur nga prova pagese on-chain ose Lightning që zbehen me kalimin e
    kohës
  - Karma, pëlqime falas të peshuara sipas Veritas
  - Madli, një vlerësim reputacioni që nyjet e mbajnë për sjelljen e njëra-tjetrës
- **Mesazhimi.** Mesazhet direkte të enkriptuara skaj më skaj, thirrjet zanore një me një dhe një
  sistem mesazhesh asinkron i ngjashëm me emailin janë pjesë e projektit.
- **Klientët.** Çdo përdorues ekzekuton një nyje JVM. Klienti referencë është një ndërfaqe web që e
  shërben ajo nyje lokale.

## Ku ndryshojnë

### Kush e filtron spamin

Lapis filtron te lexuesi. Përmbajtja përhapet, dhe më pas grafi i besimit i secilit lexues dhe
rregullat e pagesave të aplikacionit që përdor ai vendosin çfarë del në sipërfaqe. Bitsocial filtron
te komuniteti: një postim duhet të kalojë sfidën e komunitetit përpara se nyja e komunitetit ta
pranojë, kështu që spami i refuzuar nuk bëhet kurrë pjesë e komunitetit. Shihni
[Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Kush e ka pushtetin

Te Lapis, çdo lexues vendos kujt i beson, dhe operatori i çdo aplikacioni vendos si funksionon aty
dukshmëria me pagesë. Te Bitsocial, pronari i një komuniteti vendos rregullat për atë komunitet të
vetëm, dhe aplikacionet zgjedhin çfarë shfaqin. Asnjëri prej tyre nuk ka administrator në nivel
protokolli.

### Ekonomia

Lapis i ndërton provat e pagesave në Bitcoin dhe Lightning brenda vlerësimit të tij të dukshmërisë.
Bitsocial nuk ka shtresë pagesash në protokoll; një komunitet mund të kërkojë një pagesë ose një
token përmes sfidës së vet.

### Shfletuesi

Aplikacionet Bitsocial mund të ekzekutojnë një nyje peer-to-peer brenda një skede të zakonshme
shfletuesi. Shihni [Peer-to-Peer në shfletues](/browser-p2p/). Ndërfaqja e shfletuesit e Lapis është
një faqe lokale që e shërben nyja JVM e përdoruesit.

### Shtrirja

Lapis përfshin mesazhe direkte, thirrje zanore dhe postë. Bitsocial përqendrohet te komunitetet
publike dhe ende nuk ka mesazhe direkte native.

## Krahasimi

| Pyetja             | Lapis Net                                                                                               | Bitsocial                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Kategoria          | Protokoll social peer-to-peer (prototip)                                                                | Rrjet komunitetesh peer-to-peer                                                                     |
| Identiteti         | Çift çelësash secp256k1 me një peer ID Ed25519 të lidhur me të                                          | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                              |
| Ku ruhen postimet  | Ruajtje Nabu (IPFS mbi libp2p) në nyjet pjesëmarrëse                                                    | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë                         |
| Komunitetet        | Pa objekt komuniteti; kurimi bëhet për çdo lexues dhe për çdo aplikacion                                | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet                         |
| Kontrolli i spamit | Grafi i besimit i lexuesit, dukshmëri me pagesë, depozita Lightning për mesazhet e para                 | Sfida e secilit komunitet përpara se një postim të pranohet                                         |
| Moderimi           | Grafi i besimit i secilit lexues; operatorët e aplikacioneve vendosin rregullat e dukshmërisë me pagesë | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin           |
| Ekonomia           | Prova pagesash në Bitcoin dhe Lightning brenda vlerësimeve                                              | Asnjë në protokoll; një sfidë mund të kërkojë një pagesë ose token                                  |
| Shfletuesi         | Ndërfaqe web lokale që e shërben një nyje JVM                                                           | Nyje peer-to-peer brenda një skede të zakonshme shfletuesi                                          |
| Rrjeti             | Prototip pa rrjet publik                                                                                | Rrjet aktiv me aplikacione si [5chan](/apps/5chan/) dhe [Seedit](/apps/seedit/)                     |
| Kompromisi kryesor | Reputacion dhe mesazhim i pasur i integruar, por ende pa rrjet publik                                   | Bërthamë më e vogël që funksionon në shfletues, por pa reputacion apo mesazhe direkte të integruara |

## A mund të punojnë bashkë?

Sfidat e Bitsocial janë kod arbitrar, kështu që një vlerësim besimi në stilin e Lapis mund të bëhej
një prej tyre. Sfida e integruar `whitelist` mund të lexojë tashmë lista adresash të lejuara nga
URL. Një shërbim që publikon adresat Bitsocial të cilave u beson një graf Veritas mund t'u lejonte
këtyre autorëve të anashkalonin një CAPTCHA në një komunitet. Kjo do të kërkonte një mënyrë për ta
lidhur një identitet Lapis me një adresë Bitsocial, dhe sot nuk ekziston asgjë e tillë.
