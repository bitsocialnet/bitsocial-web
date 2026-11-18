---
title: Spam Blocker
description: Shërbim i centralizuar për zbulimin e spamit, me vlerësim rreziku, sfida OAuth dhe pragje nivelesh të konfigurueshme.
sidebar_position: 1
---

# Spam Blocker

Spam Blocker është një shërbim i centralizuar për zbulimin e spamit, i cili vlerëson publikimet hyrëse dhe u cakton atyre pikë rreziku. Ai përbëhet nga dy paketa:

- **`@bitsocial/spam-blocker-server`** -- serveri HTTP që strehon API-të e vlerësimit dhe të sfidave.
- **`@bitsocial/spam-blocker-challenge`** -- një paketë e lehtë klienti që komunitetet e integrojnë për të dërguar publikime për vlerësim.

**Kodi burimor:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Si funksionon vlerësimi i rrezikut

Çdo publikim që dërgohet te endpoint-i `/evaluate` merr një pikë numerike rreziku. Kjo pikë është një kombinim i peshuar i disa sinjaleve:

| Sinjali                 | Përshkrimi                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Mosha e llogarisë       | Llogaritë më të reja marrin pikë rreziku më të larta.                                                                         |
| Karma                   | Karma e grumbulluar në komunitet e ul rrezikun.                                                                               |
| Reputacioni i autorit   | Të dhëna reputacioni të mbledhura nga indeksuesi i rrjetit që punon në sfond.                                                 |
| Analiza e përmbajtjes   | Heuristika në nivel teksti (dendësia e lidhjeve, modele spami të njohura etj.).                                               |
| Shpejtësia e publikimit | Postimet e njëpasnjëshme e të shpejta nga i njëjti autor e rrisin rrezikun.                                                   |
| Të dhënat për IP-në     | Gjeolokalizim në nivel shteti dhe kontrolle në lista kërcënimesh. Adresat IP të papërpunuara nuk ndahen kurrë me komunitetet. |

## Pragjet e niveleve

Pikët e rrezikut përkojnë me një nga katër nivelet e konfigurueshme, të cilat përcaktojnë se çfarë ndodh më pas:

1. **Pranim automatik** -- pikët janë aq të ulëta sa publikimi miratohet pa asnjë sfidë.
2. **OAuth i mjaftueshëm** -- autori duhet të përfundojë një verifikim me OAuth për të vazhduar.
3. **OAuth plus verifikim shtesë** -- vetëm OAuth nuk mjafton; kërkohet një verifikim i mëtejshëm (p.sh. CAPTCHA).
4. **Refuzim automatik** -- pikët janë shumë të larta; publikimi refuzohet menjëherë.

Të gjitha vlerat e pragjeve konfigurohen veç e veç për çdo komunitet.

## Rrjedha e sfidës

Kur një publikim bie në një nivel që kërkon verifikim, nis rrjedha e sfidës:

1. Autorit i kërkohet fillimisht të autentikohet nëpërmjet **OAuth** (GitHub, Google, Twitter dhe ofrues të tjerë të mbështetur).
2. Nëse OAuth nuk mjafton më vete (niveli 3), shfaqet një **CAPTCHA rezervë** e mbështetur nga Cloudflare Turnstile.
3. Identiteti OAuth përdoret vetëm për verifikim -- ai **nuk u jepet kurrë** komunitetit ose përdoruesve të tjerë.

## Endpoint-et e API-së

### `POST /evaluate`

Dërgoni një publikim për vlerësim rreziku. Kthen pikët e llogaritura të rrezikut dhe nivelin e sfidës që kërkohet.

### `POST /challenge/verify`

Dërgoni për verifikim rezultatin e një sfide të përfunduar (token OAuth, zgjidhje CAPTCHA, ose të dyja).

### `GET /iframe/:sessionId`

Kthen një faqe HTML të ngulitshme që shfaq ndërfaqen e duhur të sfidës për seancën e dhënë.

## Kufizimi i shpeshtisë

Kufijtë e shpeshtisë zbatohen në mënyrë dinamike sipas moshës dhe reputacionit të autorit. Autorët e rinj ose me reputacion më të ulët hasin kufij më të rreptë, ndërsa autorët e konsoliduar përfitojnë pragje më bujare. Kjo pengon vërshimet e spamit pa i penalizuar pjesëmarrësit e besuar.

## Indeksuesi i rrjetit në sfond

Serveri drejton një indeksues në sfond që zvarrit vazhdimisht rrjetin për të ndërtuar dhe mirëmbajtur të dhënat e reputacionit të autorëve. Këto të dhëna futen drejtpërdrejt në procesin e vlerësimit të rrezikut, duke i mundësuar sistemit të njohë nëpër komunitete pjesëmarrësit e ndershëm që kthehen rregullisht.

## Privatësia

Spam Blocker është projektuar duke pasur parasysh privatësinë:

- Identitetet OAuth përdoren vetëm për verifikimin e sfidave dhe **nuk u zbulohen kurrë** komuniteteve.
- Operatori i shërbimit ruan adresat IP të papërpunuara për zbulimin e abuzimeve dhe i dërgon te një ofrues i jashtëm të dhënash për IP-në për klasifikim.
- Komunitetet marrin vetëm kodin e shtetit, rrezikun e IP-së dhe vlerësimin e llojit të lidhjes, kurrë IP-në e papërpunuar.

## Baza e të dhënave

Serveri përdor **SQLite** (nëpërmjet `better-sqlite3`) për ruajtjen lokale të të dhënave të reputacionit, të gjendjes së seancave dhe të konfigurimit.
