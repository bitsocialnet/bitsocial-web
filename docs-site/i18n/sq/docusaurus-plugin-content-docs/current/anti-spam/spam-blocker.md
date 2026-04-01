---
title: Bllokues i spamit
description: Shërbimi i centralizuar i zbulimit të postës së padëshiruar me vlerësimin e rrezikut, sfidat e OAuth dhe pragjet e nivelit të konfigurueshëm.
sidebar_position: 1
---

# Bllokues i spamit

:::warning Legacy Naming
Kjo paketë fillimisht u botua nën sferën `@plebbit`. Është riemërtuar në `@bitsocial/spam-blocker-server` dhe `@bitsocial/spam-blocker-challenge`. Referencat për emrat e vjetër mund të shfaqen ende në dokumentacionin më të vjetër ose në bazat e kodeve.
:::

"Bllokuesi i postës së padëshiruar" është një shërbim i centralizuar për zbulimin e postës së padëshiruar që vlerëson publikimet e ardhura dhe cakton rezultatet e rrezikut. Ai përbëhet nga dy pako:

- **`@bitsocial/spam-blocker-server`** -- serveri HTTP që pret API-të e vlerësimit dhe sfidës.
- **`@bitsocial/spam-blocker-challenge`** -- një paketë e lehtë klienti që komunitetet e integrojnë për të dërguar botime për vlerësim.

**Kodi burimor:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Si funksionon vlerësimi i rrezikut

Çdo publikim i dorëzuar në pikën përfundimtare `/evaluate` merr një rezultat numerik rreziku. Rezultati është një kombinim i ponderuar i disa sinjaleve:

| Sinjali               | Përshkrimi                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mosha e llogarisë     | Llogaritë më të reja marrin rezultate më të larta rreziku.                                                                                                       |
| Karma                 | Karma e akumuluar e komunitetit zvogëlon rrezikun.                                                                                                               |
| Reputacioni i autorit | Të dhënat e reputacionit të mbledhura nga indeksuesi i rrjetit të sfondit.                                                                                       |
| Analiza e përmbajtjes | Heuristika e nivelit të tekstit (dendësia e lidhjes, modelet e njohura të postës së padëshiruar, etj.).                                                          |
| Shpejtësia            | Postimet e shpejta të njëpasnjëshme nga i njëjti autor rrisin rrezikun.                                                                                          |
| Inteligjenca IP       | Gjeolokacioni në nivel vendi dhe kërkimet e furnizimit me kërcënime. Vetëm kodet e shteteve ruhen -- adresat IP të papërpunuara nuk ndahen kurrë me komunitetet. |

## Pragjet e nivelit

Rezultati i rrezikut hartohet në një nga katër nivelet e konfigurueshme që përcaktojnë se çfarë ndodh më pas:

1. **Auto-prano** -- rezultati është mjaft i ulët sa që publikimi të miratohet pa asnjë sfidë.
2. **OAuth-mjaftueshëm** -- autori duhet të përfundojë një verifikim OAuth për të vazhduar.
3. **OAuth-plus-more ** -- OAuth vetëm nuk mjafton; kërkohet verifikim shtesë (p.sh. CAPTCHA).
4. **Refuzo automatikisht** -- rezultati është shumë i lartë; publikimi refuzohet plotësisht.

Të gjitha vlerat e pragut janë të konfigurueshme për komunitet.

## Rrjedha e sfidës

Kur një publikim bie në një nivel që kërkon verifikim, rrjedha e sfidës fillon:

1. Fillimisht autorit i kërkohet të vërtetojë nëpërmjet **OAuth** (GitHub, Google, Twitter dhe ofrues të tjerë të mbështetur).
2. Nëse vetëm OAuth është i pamjaftueshëm (niveli 3), paraqitet një **CAPTCHA rezervë** e mundësuar nga Cloudflare Turnstile.
3. Identiteti OAuth përdoret vetëm për verifikim -- ai **nuk ndahet kurrë** me komunitetin ose përdoruesit e tjerë.

## Pikat e fundit të API

### `POST /evaluate`

Paraqisni një publikim për vlerësimin e rrezikut. Rikthen rezultatin e llogaritur të rrezikut dhe nivelin e kërkuar të sfidës.

### `POST /challenge/verify`

Paraqisni rezultatin e një sfide të përfunduar (token OAuth, zgjidhje CAPTCHA ose të dyja) për verifikim.

### `GET /iframe/:sessionId`

Kthen një faqe HTML të ngulitur që jep ndërfaqen e përshtatshme të sfidës për seancën e caktuar.

## Kufizimi i normës

Kufijtë e tarifave zbatohen në mënyrë dinamike bazuar në moshën dhe reputacionin e autorit. Autorët më të rinj ose me reputacion më të ulët përballen me kufij më të rreptë, ndërsa autorët e njohur gëzojnë pragje më bujare. Kjo parandalon përmbytjet e padëshiruara pa penalizuar pjesëmarrësit e besuar.

## Indeksuesi i rrjetit të sfondit

Serveri drejton një indeksues sfondi që zvarritet vazhdimisht në rrjet për të ndërtuar dhe ruajtur të dhënat e reputacionit të autorit. Këto të dhëna ushqehen drejtpërdrejt në tubacionin e vlerësimit të rrezikut, duke lejuar sistemin të njohë pjesëmarrësit e përsëritur me besim të mirë në të gjithë komunitetet.

## Privatësia

Bllokuesi i spamit është krijuar duke pasur parasysh privatësinë:

- Identitetet e OAuth përdoren vetëm për verifikimin e sfidave dhe **nuk u zbulohen kurrë** komuniteteve.
- Adresat IP zgjidhen në **vetëm kodet e shteteve**; IP-të e papërpunuara nuk ruhen ose ndahen.

## Baza e të dhënave

Serveri përdor **SQLite** (nëpërmjet `better-sqlite3`) për qëndrueshmërinë lokale të të dhënave të reputacionit, gjendjes së sesionit dhe konfigurimit.
