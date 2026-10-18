---
title: Ku ruhen postimet dhe sa gjatë qëndrojnë të disponueshme
description: Pse postimet e Bitsocial janë të nënshkruara dhe të adresuara sipas përmbajtjes, por jo të ruajtura përgjithmonë nga çdo nyje, kush i mban në linjë dhe si arkivat e mbajnë të lexueshme përmbajtjen e vjetër.
---

# Ku ruhen postimet dhe sa gjatë qëndrojnë të disponueshme

Bitsocial nuk e ruan çdo postim në një blockchain apo në bazën e të dhënave të një kompanie. Nyja e
vetë çdo komuniteti i mban postimet e tij, lexuesit dhe seeder-at ndihmojnë t'i shërbejnë, dhe kushdo
që dëshiron një regjistër të përhershëm mund ta ruajë. Ruajtja përgjithmonë e postimeve është
**opsionale, jo e detyrueshme**: protokolli nuk e detyron çdo pjesëmarrës të ruajë të gjithë historikun
e rrjetit.

Kjo faqe shpjegon çfarë do të thotë kjo në praktikë, sepse «nuk ruhet përgjithmonë» mund të keqkuptohet
lehtë si «zhduket» ose «më beso».

## Autenticiteti dhe disponueshmëria janë pyetje të veçanta

Për një postim ka dy pyetje të ndryshme:

1. **A është i vërtetë?** A e shkroi ky autor dhe a e pranoi ky komunitet?
2. **A është ende në linjë?** A mund ta marrë dikush sot?

Bitsocial i përgjigjet pyetjes së parë me kriptografi, jo me besim. Çdo postim nënshkruhet me çiftin e
çelësave të autorit dhe, sapo një komunitet e pranon, postimi ruhet nën një identifikues përmbajtjeje
(CID): një hash i bajteve të tij të saktë. Kushdo që merr një postim mund ta kontrollojë vetë
nënshkrimin dhe hash-in. Një nyje, ruter, gateway ose arkiv nuk mund ta ndryshojë tekstin e një postimi
apo të falsifikojë një postim nga dikush tjetër pa dështuar kontrolli.

Pyetja e dytë është se kush mban një kopje, dhe kjo është e vetmja pjesë që nuk garantohet.

## Kush i mban postimet në linjë

- **Nyja e komunitetit.** Nyja e pronarit pranon postime dhe i mban në bazën e vet të të dhënave për aq
  kohë sa komuniteti i ruan. Kjo është kopja që ekziston gjithmonë sa kohë që komuniteti funksionon.
  Shihni [Protokolli Peer-to-Peer](/peer-to-peer-protocol/).
- **Lexuesit.** Aplikacionet desktop, si aplikacioni 5chan Electron, i seeding komunitetet që ngarkojnë
  për sa kohë funksionojnë, prandaj komunitetet e popullarizuara shërbehen nga shumë homologë, si
  torrentet e popullarizuara. Një skedë shfletuesi mund të ruajë në memorie dhe të vlerësojë përmbajtjen
  sa kohë është e hapur, por nuk është një strehues afatgjatë.
- **Seeder-at.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) lejon këdo të
  kontribuojë kapacitet gjithmonë aktiv nga një VPS ose një makinë rezervë. Ai fikson faqet më të fundit
  dhe përditësimet e postimeve të komuniteteve, gjë që i bën të ngarkueshme nga shfletuesi edhe
  komunitetet e strehuara pas ruterëve shtëpiakë.
- **Arkivuesit.** Kushdo mund t'i zvarritë komunitetet dhe të ruajë gjithçka që sheh. Arkivat janë
  shërbime të zakonshme të ndërtuara mbi rrjet, jo një rol i veçantë në protokoll.

## Komunitetet zgjedhin vetë ruajtjen e tyre

Sa gjatë një komunitet i mban postimet e vjetra është vendim i pronarit, jo rregull protokolli. Disa
komunitete duan histori për vite. Të tjera janë krijuar për të harruar: board-et 5chan funksionojnë si
një imageboard, ku temat bien nga board-i, kalojnë në arkiv dhe pastrohen nga nyja e board-it pas një
kohe të caktuar (48 orë si parazgjedhje). Një komunitet mund ta anashkalojë plotësisht edhe arkivin.

I njëjti protokoll i mbështet të dyja, sepse ruajtja është politikë që e cakton çdo komunitet, jo kosto
që duhet ta paguajë çdo nyje.

## Pse të mos ruhet gjithçka përgjithmonë?

Një rrjet që kërkon që çdo nyje ta mbajë çdo postim përgjithmonë duhet të paguajë për të në një mënyrë:

- **Blockchain-et** e bëjnë çdo nyje të plotë të ruajë gjithë historikun, kështu që kërkesat e nyjeve
  rriten me gjithë aktivitetin dhe postimi zakonisht kushton një tarifë.
- **Ruajtja me pagesë**, si qiraja e ruajtjes së Farcaster, i bën përdoruesit të paguajnë për të ruajtur
  historikun dhe i krasit postimet më të vjetra përtej asaj që paguajnë. Shihni
  [Bitsocial dhe Farcaster](/comparisons/farcaster/).
- **Serverët qendrorë** mbajnë gjithçka, por vetëm për aq kohë sa e dëshiron një kompani, sipas
  rregullave të asaj kompanie.

Media sociale nuk ka nevojë për një regjistër global. Nuk ka rëndësi nëse postimi A u pranua një
milisekondë përpara postimit B, dhe shumica e postimeve të vjetra lexohen rrallë. Bitsocial e lejon çdo
nyje komuniteti të mbajë vetëm komunitetet e veta, çka e mban strehimin mjaftueshëm të lirë për një
laptop, një Raspberry Pi ose një VPS të vogël. Shihni [Pse jo një blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Kompromisi

Nëse askush nuk mban një kopje të një postimi, ai mund të bëhet i padisponueshëm. CID-ja e postimit nuk
ndryshon kurrë, por CID-ja është vetëm një adresë: përmbajtja mbetet e arritshme vetëm derisa të paktën
një nyje po e shërben. Nëse nyja e një komuniteti del përgjithmonë jashtë linje dhe asnjë lexues, seeder
apo arkiv nuk i mbajti postimet e tij, ato postime humben.

Ky është çmimi i ndershëm i moskërkimit të një regjistri global. Është gjithashtu çmimi që çdo platformë
e madhe e paguan tashmë: postimet e vjetra zhduken prej tyre kur zhduken llogaritë, serverët ose
kompanitë. Dallimi është se në Bitsocial ruajtja e diçkaje nuk ka nevojë për lejen e askujt.

## Ruaj atë që ka rëndësi

- **Drejtoje vetë nyjën e komunitetit.** Një pronar komuniteti që e mban nyjën në punë, mban historikun
  e komunitetit për aq kohë sa cilësimet e komunitetit e ruajnë.
- **Bëj seed.** Lënia hapur e një aplikacioni desktop ose drejtimi i `bitsocial-seeder` i mban
  komunitetet të disponueshme për të tjerët.
- **Arkivo.** Arkivat e pavarura i mbajnë temat e vjetra të lexueshme dhe të kërkueshme pasi një
  komunitet i heq. [5archive.org](https://5archive.org) arkivon board-et 5chan dhe
  [seeditarchive.org](https://seeditarchive.org) arkivon komunitetet Seedit. Të dyja janë open source,
  kështu që kushdo mund të drejtojë një pasqyrë ose një arkiv konkurrues.

Sepse çdo postim i arkivuar ende është i nënshkruar, një arkiv nuk mund të rishkruajë fshehurazi atë që
tha dikush: një lexues mund ta verifikojë nënshkrimin e një postimi të arkivuar njësoj si të një postimi
në linjë.
