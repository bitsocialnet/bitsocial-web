# Tunnetut yllätykset

Tähän tiedostoon kootaan tälle repolle ominaiset sekaannuskohdat, jotka ovat aiheuttaneet agenttien virheitä.

## Merkinnän kriteerit

Lisää merkintä vain, jos kaikki seuraavat pitävät paikkansa:

- Se koskee nimenomaan tätä repoa (ei ole yleisluontoinen neuvo).
- Se toistuu todennäköisesti myös tulevilla agenteilla.
- Sille on olemassa konkreettinen ohje, jota voi seurata.

Jos olet epävarma, kysy kehittäjältä ennen merkinnän lisäämistä.

## Merkinnän malli

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Merkinnät

### Vercel-sovellusten tuotantodomainit voivat ajautua takaisin Gitin master-julkaisuihin

- **Päivämäärä:** 2026-04-28
- **Havainnut:** Tommaso + Codex
- **Konteksti:** Seedit- ja 5chan-sovelluspeilien tarkistaminen Bitsocial Webin sovellushakemistossa.
- **Yllättävää oli:** Vercel-projekteilla `seedit` ja `5chan` oli asetus `gitProviderOptions.createDeployments = "enabled"`, joten GitHubin `master`-haaraan tehdyt pushit ylennettiin tuotantodomaineihin, vaikka repon linjaus edellyttää, että tuotannon sovelluspeilit tarjoavat vain julkaisuartefakteja.
- **Vaikutus:** Sovellushakemiston varmennettujen peilien merkinnät voivat muuttua valheellisiksi, koska tuotantodomainit tarjoavat uusimman kehityscommitin sen sijaan, että ne tarjoaisivat GitHub-julkaisun ZIP-paketin, jonka `index.html`-tiiviste on kirjattu tiedostoon `about/src/lib/apps-data.ts`.
- **Ratkaisu:** Ennen peilien varmennustietojen lisäämistä tai päivittämistä tarkista Vercel-projekti komennolla `vercel api /v9/projects/<project-id>` ja varmista, että `gitProviderOptions.createDeployments = "disabled"`. Julkaise julkaisu-ZIP:n sisältö komennolla `vercel deploy --prebuilt --prod` ja käytä kehitysjulkaisuihin osoitteita `seedit-omega.vercel.app` tai `5chan-omega.vercel.app`.
- **Tila:** vahvistettu

### Portless 0.11 käyttää uudelleen vanhaa välityspalvelintilaa, ellei käynnistin pakota HTTPS:ää

- **Päivämäärä:** 2026-04-28
- **Havainnut:** Tommaso + Codex
- **Konteksti:** Tavanomaisen `yarn start` -kulun päivittäminen vanhasta välityspalvelinosoitteesta `http://bitsocial.localhost:1355` osoitteeseen `https://bitsocial.localhost`.
- **Yllättävää oli:** Vaikka `portless@0.11.1` oli asennettuna, Portless käytti uudelleen olemassa olevaa HTTP-välityspalvelinta `~/.portless/proxy.port = 1355` ja tulosti vanhan `:1355`-osoitteen.
- **Vaikutus:** Pakettiversioiden ja dokumentaation päivittäminen ei riitä; `yarn start` voi yhä mainostaa ja käyttää vanhaa osoitetta, jos kehittäjällä on käynnissä vanhaa Portless-tilaa.
- **Ratkaisu:** Pidä käynnistysskriptit sellaisina, että ne käynnistävät Portlessin HTTPS-välityspalvelimen nimenomaisesti portissa `443` ennen sovellusreittien rekisteröintiä, jotta ajonaikainen kulku siirtyy pois tallennetusta `1355`-tilasta sen sijaan, että perisi sen.
- **Tila:** vahvistettu

### Portless muuttaa paikallisen sovelluksen kanonisen osoitteen

- **Päivämäärä:** 2026-03-18
- **Havainnut:** Codex
- **Konteksti:** Selaintarkistukset ja savutestikulut
- **Yllättävää oli:** Oletusarvoinen paikallinen osoite ei ole tavanomainen Vite-portti. Repo odottaa osoitetta `https://bitsocial.localhost` Portlessin kautta, joten osoitteiden `localhost:3000` tai `localhost:5173` tarkistaminen voi osua väärään sovellukseen tai ei mihinkään.
- **Vaikutus:** Selaintarkistukset voivat epäonnistua tai kohdistua väärään kohteeseen, vaikka kehityspalvelin toimisi moitteettomasti.
- **Ratkaisu:** Käytä osoitetta `https://bitsocial.localhost` ensisijaisesti. Ohita se komennolla `PORTLESS=0 corepack yarn start` vain, kun tarvitset nimenomaisesti suoraa Vite-porttia.
- **Tila:** vahvistettu

### Commitizen-koukut estävät ei-interaktiiviset commitit

- **Päivämäärä:** 2026-03-18
- **Havainnut:** Codex
- **Konteksti:** Agenttivetoiset commit-työnkulut
- **Yllättävää oli:** `git commit` käynnistää Commitizenin Huskyn kautta ja jää odottamaan interaktiivista TTY-syötettä, mikä jumittaa ei-interaktiiviset agenttikuoret.
- **Vaikutus:** Agentit voivat jäädä jumiin loputtomiin sen aikana, minkä pitäisi olla tavallinen commit.
- **Ratkaisu:** Käytä agenttien tekemiin commiteihin komentoa `git commit --no-verify -m "message"`. Ihmiset voivat edelleen käyttää komentoja `corepack yarn commit` tai `corepack yarn exec cz`.
- **Tila:** vahvistettu

### Corepack on välttämätön, jotta vältetään Yarn classic

- **Päivämäärä:** 2026-03-19
- **Havainnut:** Codex
- **Konteksti:** Paketinhallinnan siirtyminen Yarn 4:ään
- **Yllättävää oli:** Koneella on edelleen globaali Yarn classic -asennus polussa `PATH`, joten pelkkä `yarn` voi viitata versioon 1 kiinnitetyn Yarn 4:n sijaan.
- **Vaikutus:** Kehittäjät voivat vahingossa ohittaa repon paketinhallinnan kiinnityksen ja saada erilaisen asennuskäyttäytymisen tai poikkeavan lukkotiedoston.
- **Ratkaisu:** Käytä komentotulkissa muotoa `corepack yarn ...` tai aja ensin `corepack enable`, jolloin pelkkä `yarn` viittaa kiinnitettyyn Yarn 4 -versioon.
- **Tila:** vahvistettu

### Kiinteät Portless-sovellusnimet törmäävät Bitsocial Webin worktreiden välillä

- **Päivämäärä:** 2026-03-30
- **Havainnut:** Codex
- **Konteksti:** `yarn start` -komennon ajaminen yhdessä Bitsocial Web -worktreessä, kun toinen worktree jo tarjosi sivustoa Portlessin kautta
- **Yllättävää oli:** Kirjaimellisen Portless-sovellusnimen `bitsocial` käyttäminen joka worktreessä saa itse reitin törmäämään, vaikka taustaportit olisivat eri, joten toinen prosessi epäonnistuu, koska `bitsocial.localhost` on jo rekisteröity.
- **Vaikutus:** Rinnakkaiset Bitsocial Web -haarat voivat estää toisiaan, vaikka Portlessin on tarkoitus antaa niiden toimia turvallisesti rinnakkain.
- **Ratkaisu:** Pidä Portlessin käynnistys tiedoston `scripts/start-dev.mjs` takana. Se käyttää nyt haarakohtaista `*.bitsocial.localhost`-reittiä kanonisen tapauksen ulkopuolella ja siirtyy haarakohtaiseen reittiin, kun paljas nimi `bitsocial.localhost` on jo varattu.
- **Tila:** vahvistettu

### Dokumentaation esikatselu kovakoodasi aiemmin portin 3001

- **Päivämäärä:** 2026-03-30
- **Havainnut:** Codex
- **Konteksti:** `yarn start` -komennon ajaminen muiden paikallisten repojen ja agenttien rinnalla
- **Yllättävää oli:** Juuritason kehityskomento ajoi dokumentaatiotyötilaa komennolla `docusaurus start --port 3001`, joten koko kehitysistunto epäonnistui aina, kun jokin toinen prosessi omisti jo portin `3001` — vaikka pääsovellus käytti jo Portlessia.
- **Vaikutus:** `yarn start` saattoi lopettaa web-prosessin heti sen käynnistyttyä ja keskeyttää muuta paikallista työtä pelkän dokumentaatioportin törmäyksen takia.
- **Ratkaisu:** Pidä dokumentaation käynnistys komennon `yarn start:docs` takana. Se käyttää nyt Portlessia ja tiedostoa `scripts/start-docs.mjs`, joka huomioi sille annetun vapaan portin tai siirtyy seuraavaan vapaaseen porttiin, kun se ajetaan suoraan.
- **Tila:** vahvistettu

### Dokumentaation Portless-isäntänimi oli kovakoodattu

- **Päivämäärä:** 2026-04-03
- **Havainnut:** Codex
- **Konteksti:** `yarn start` -komennon ajaminen toissijaisessa Bitsocial Web -worktreessä, kun toinen worktree jo tarjosi dokumentaatiota Portlessin kautta
- **Yllättävää oli:** `start:docs` rekisteröi edelleen kirjaimellisen isäntänimen `docs.bitsocial.localhost`, joten `yarn start` saattoi epäonnistua, vaikka about-sovellus osasi jo välttää Portless-reittien törmäykset oman isäntänimensä osalta.
- **Vaikutus:** Rinnakkaiset worktreet eivät voineet luotettavasti käyttää juuritason kehityskomentoa, koska dokumentaatioprosessi päättyi ensin ja `concurrently` lopetti sen jälkeen loput istunnosta.
- **Ratkaisu:** Pidä dokumentaation käynnistys tiedoston `scripts/start-docs.mjs` takana. Se johtaa nyt saman haarakohtaisen Portless-isäntänimen kuin about-sovellus ja syöttää tämän jaetun julkisen osoitteen `/docs`-kehitysvälityspalvelimen kohteeksi.
- **Tila:** vahvistettu

### Worktreen komentotulkeilta voi jäädä huomaamatta repon kiinnitetty Node-versio

- **Päivämäärä:** 2026-04-03
- **Havainnut:** Codex
- **Konteksti:** `yarn start` -komennon ajaminen Git-worktreissä, kuten `.claude/worktrees/*` tai sisarhakemistoihin luoduissa worktree-kopioissa
- **Yllättävää oli:** Osa worktree-komentotulkeista ratkaisi komennot `node` ja `yarn node` Homebrew'n Node-versioon `25.2.1`, vaikka repo kiinnittää version `22.12.0` tiedostossa `.nvmrc`. Näin `yarn start` saattoi ajaa kehityskäynnistimet huomaamatta väärällä ajoympäristöllä.
- **Vaikutus:** Kehityspalvelimen käyttäytyminen voi poiketa pääkopion ja worktreiden välillä, mikä vaikeuttaa vikojen toistamista ja rikkoo repon oletetun Node 22 -työkaluketjun.
- **Ratkaisu:** Pidä kehityskäynnistimet tiedostojen `scripts/start-dev.mjs` ja `scripts/start-docs.mjs` takana. Ne käynnistävät itsensä nyt uudelleen `.nvmrc`-tiedoston mukaisella Node-binäärillä, kun nykyinen komentotulkki on väärässä versiossa. Komentotulkin asetuksissa kannattaa silti suosia komentoa `nvm use`.
- **Tila:** vahvistettu

### `docs-site/`-jäänteet voivat peittää puuttuvan dokumentaatiolähteen refaktoroinnin jälkeen

- **Päivämäärä:** 2026-04-01
- **Havainnut:** Codex
- **Konteksti:** Monorepon siivous yhdistämisen jälkeen, kun Docusaurus-projekti siirrettiin hakemistosta `docs-site/` hakemistoon `docs/`
- **Yllättävää oli:** Vanha `docs-site/`-kansio voi jäädä levylle mukanaan vanhentuneita mutta tärkeitä tiedostoja, kuten `i18n/`, vaikka versioitu repo on siirtynyt hakemistoon `docs/`. Se saa refaktoroinnin näyttämään paikallisesti kahdennetulta ja voi peittää sen, ettei versioituja dokumentaation käännöksiä koskaan siirretty hakemistoon `docs/`.
- **Vaikutus:** Agentit voivat poistaa vanhan kansion "roskana" ja menettää vahingossa ainoan paikallisen kopion dokumentaation käännöksistä, tai jatkaa sellaisten skriptien muokkaamista, jotka osoittavat yhä kuolleeseen `docs-site/`-polkuun.
- **Ratkaisu:** Kohtele hakemistoa `docs/` ainoana kanonisena dokumentaatioprojektina. Ennen paikallisten `docs-site/`-jäänteiden poistamista palauta versioitu lähde, kuten `docs/i18n/`, ja päivitä skriptit ja koukut niin, etteivät ne enää viittaa hakemistoon `docs-site`.
- **Tila:** vahvistettu

### Monikielinen dokumentaation esikatselu voi kasvattaa muistinkulutusta varmistuksen aikana

- **Päivämäärä:** 2026-04-01
- **Havainnut:** Codex
- **Konteksti:** Dokumentaation i18n:n, kieliversioreitityksen ja Pagefindin käyttäytymisen korjaaminen komennolla `yarn start:docs` sekä Playwrightilla
- **Yllättävää oli:** Dokumentaation esikatselun oletustila tekee nykyään täyden monikielisen koonnin ja Pagefind-indeksoinnin ennen tarjoilua, ja tuon prosessin pitäminen käynnissä usean Playwright- tai Chrome-istunnon rinnalla voi kuluttaa selvästi enemmän muistia kuin tavallinen Vite- tai yhden kieliversion Docusaurus-kehityssilmukka.
- **Vaikutus:** Kone voi käydä muistista tiukille, selainistunnot voivat kaatua, ja keskeytyneet ajot voivat jättää jälkeensä vanhentuneita dokumentaatiopalvelimia tai headless-selaimia, jotka jatkavat muistin kuluttamista.
- **Ratkaisu:** Kun dokumentaatiotyö ei vaadi kieliversioreittien tai Pagefindin tarkistamista, suosi komentoa `DOCS_START_MODE=live yarn start:docs`. Käytä oletusarvoista monikielistä esikatselua vain, kun sinun täytyy validoida käännettyjä reittejä tai Pagefindia. Pidä käynnissä yksi Playwright-istunto, sulje vanhat selainistunnot ennen uusien avaamista ja pysäytä dokumentaatiopalvelin varmistuksen jälkeen, jos et enää tarvitse sitä.
- **Tila:** vahvistettu

### `translate-docs.py` voi jättää dokumentaation kieliversiot puolittain käännetyiksi tai rikkoa linkkien kohteita

- **Päivämäärä:** 2026-04-06
- **Havainnut:** Codex
- **Konteksti:** Käännettyjen dokumentaatioreittien ja sisällön korjaaminen sen jälkeen, kun `yarn start:docs` tarjosi englanninkielisiä yksityiskohtasivuja tai kieliversioiden koonti epäonnistui
- **Yllättävää oli:** Dokumentaation käännösputkessa oli kaksi repokohtaista vikatilaa yhtä aikaa: `scripts/translate-docs.py` poimi vain pienen osan `DocsHome`-viesteistä, kun `tr(...)`-kutsut käyttivät muotoja joita se ei osannut jäsentää, ja hakemiston `docs/i18n/**` käännetty markdown saattoi sisältää konekäännettyjä slugeja tai `ZXQPLACEHOLDER`-jäänteitä linkkien kohteissa.
- **Vaikutus:** Käännetyt etusivut voivat hiljaisesti pudota takaisin englantiin, käännetyt yksityiskohtasivut voivat näyttää kääntämättömiltä, ja koko `yarn docs:build` voi kaatua rikkinäisiin kieliversiolinkkeihin, vaikka lähdedokumentaatio olisi kunnossa.
- **Ratkaisu:** Aja dokumentaation käännösten muuttamisen tai kieliversiotiedostojen uudelleenluonnin jälkeen aina `yarn docs:build` repon juuresta, käy hakemiston `docs/i18n/**` markdown läpi `ZXQPLACEHOLDER`-jäänteiden varalta ja varmista, että käännetyt linkit osoittavat edelleen kanonisiin dokumentaatioslugeihin, kuten `/apps/5chan/`, eivätkä käännettyihin URL-polkuihin. Jos `DocsHome`-tekstit muuttuivat, varmista että `scripts/translate-docs.py` poimii yhä kaikki `docs.home.*`-viestit.
- **Tila:** vahvistettu

### About-sivuston no-JS-tarkistukset on tehtävä Portless-reitin kautta, ei erillisellä SSR-esikatselulla

- **Päivämäärä:** 2026-04-12
- **Havainnut:** Codex
- **Konteksti:** `about/`-sivuston no-JS-tuen tarkistaminen haaran worktreestä
- **Yllättävää oli:** Erillinen SSR-esikatselu voi näyttää terveeltä, vaikka varsinainen haarakohtainen Portless-reitti tarjoaisi yhä väärää sovelluskuorta tai vanhempaa prosessia. Tässä repossa todellinen paikallinen sopimus on `yarn start` -komennon Portless-isäntänimi, ei tilapäinen esikatselupalvelin.
- **Vaikutus:** Agentit voivat virheellisesti väittää no-JS-tuen toimivan tai jättää huomaamatta regressioita, jotka näkyvät vain osoitteessa `*.bitsocial.localhost`.
- **Ratkaisu:** Käynnistä `about/`-sivuston selaintarkistuksia varten aina todellinen paikallinen palvelin komennolla `yarn start` tai `yarn start:about` ja testaa ensin haarakohtaista Portless-osoitetta. Jos Portless-isäntänimi vaikuttaa vanhentuneelta, tutki ja pysäytä vanha prosessi ennen uudelleentestausta.
- **Tila:** vahvistettu

### `chain/` jäi näkymättömiin komennoilta `yarn build:verify` ja `yarn doctor`

- **Päivämäärä:** 2026-07-05
- **Havainnut:** Codex
- **Konteksti:** Pelkkää chain/-hakemistoa koskevan muutoksen tarkistaminen sen jälkeen, kun `chain/`-työtila (itsenäinen Vite-sovellus osoitteelle `chain.bitsocial.net`) lisättiin monorepoon.
- **Yllättävää oli:** `scripts/verify-build.mjs` tunnisti vain polkuetuliitteet `about/`, `docs/` ja `stats/`, joten pelkkä chain/-muutos tulosti "No targeted build checks matched the current diff" eikä ajanut lainkaan koontia, vaikka `build:chain` oli jo olemassa juuritason tiedostossa `package.json`. Tästä erillään `yarn doctor` oli kovakoodattu muotoon `react-doctor about -y`, joten hakemiston `chain/src` React-muutokset jäivät täysin React Doctorin katveeseen.
- **Vaikutus:** Chain-muutoksia tarkistavien agenttien piti tietää kutsua suoraan komentoa `yarn build:chain` sen sijaan, että olisivat luottaneet komentoon `yarn build:verify`, ja hakemiston `chain/src` React-ongelmat (efektit, hookit, kuollut koodi) jäivät komennolta `yarn doctor` huomaamatta.
- **Ratkaisu:** Tiedostossa `scripts/verify-build.mjs` on nyt `chain/`-haara, joka vastaa `about/`-haaraa, ja `doctor` sekä `doctor:verbose` ajavat nyt yhdellä kutsulla komennon `react-doctor --project about,chain -y`. `doctor:score` koskee edelleen vain projektia `about`, koska `--score` tulostaa hiljaisesti tyhjää, kun se yhdistetään useampaan projektiin viittaavaan `--project`-valintaan; käytä komentoa `yarn react-doctor --project about,chain --verbose -y` (tai `--json`), jos tarvitset chainin pistemäärän.
- **Tila:** vahvistettu

### Selain-P2P toimii suojattujen WebSocket-yhteyksien varassa; pkc-js estää oletuksena WebRTC:n ja WebTransportin

- **Päivämäärä:** 2026-08-02
- **Havainnut:** Claude
- **Konteksti:** Laskeutumissivun ja dokumentaation tekstien kirjoittaminen siitä, miten Bitsocialin selain-P2P toimii
- **Yllättävää oli:** `@pkcprotocol/pkc-js` sisältää oletusarvoisen yhteyksien portinvartijan, joka hylkää WebRTC- ja WebTransport-yhteydenotot selaimessa — `dist/browser/helia/dial-transport-filter.js` vie ulos arvon `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Lähdekoodin kommentti kertoo syyn: selaimessa nuo siirtotavat lisäävät pitkiä ja usein epäonnistuvia yhteydenmuodostuspolkuja (STUN/ICE, certhash-rotaatio), jotka hidastavat latauksia, kun taas WebSocket on suora ja luotettava. Jokainen elävä vertainen blogin P2P-tilapaneelissa näyttää merkinnän "Secure WebSocket". Portinvartija sijaitsee hakemistossa `node_modules`, joten mikään repossa ei vihjaa sen olemassaolosta.
- **Vaikutus:** On hyvin helppoa kirjoittaa teknisesti uskottavaa mutta virheellistä julkista tekstiä — esimerkiksi antaa Bitsocialin selain-P2P:n mahdollistamisesta kunnia sille, että WebTransport saavutti selainten Baseline-tason maaliskuussa 2026. Tuo väite ehti laskeutumissivulle, vertailutaulukkoon ja kahdelle dokumentaatiosivulle ennen kuin kehittäjä huomasi sen. Julkisilla sivuilla olevat virheelliset arkkitehtuuriväitteet tarkistaa juuri se kehittäjäyleisö, jolle sivusto on suunnattu.
- **Ratkaisu:** Älä koskaan päättele Bitsocialin käyttämiä siirtotapoja siitä, mitä libp2p tai selainalusta periaatteessa tukee. Tarkista nykyinen estolista tiedostosta `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js`, varmista ettei hakemistossa `about/src/` ole `connectionGater`-ohitusta, ja lue blogin "P2P status" -paneelin elävät siirtotapamerkinnät ennen kuin esität julkisia väitteitä. Ylävirran muutos, joka tosiasiassa avasi selainjulkaisun, oli gossipsubin monotonisen seqnon korjaus paketissa `@libp2p/gossipsub` 15.0.21 (toukokuu 2026); pkc-js sisältää tällä hetkellä version 16.0.4.
- **Tila:** vahvistettu

### Suhteelliset `./page.md`-linkit kääntämättömältä dokumentaatiosivulta rikkovat jokaisen käännetyn koonnin

- **Päivämäärä:** 2026-08-02
- **Havainnut:** Claude
- **Konteksti:** Uuden, vain englanninkielisen sivun `docs/browser-p2p.md` lisääminen; se linkitti olemassa oleviin dokumentteihin muodoilla `./peer-to-peer-protocol.md` ja `./apps/5chan.md`
- **Yllättävää oli:** Jokainen kieliversio hakemistossa `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` peilaa dokumentaatiopuun. Uusi sivu, jota noissa peileissä ei ole, näkyy silti jokaisessa kieliversiossa englanninkielisenä varasisältönä, mutta sen suhteelliset markdown-linkit eivät enää ratkea — Docusaurus tuottaa polun `/ar/browser-p2p/peer-to-peer-protocol.md/` ja kaataa koonnin virheeseen "Docusaurus found broken links!". Olennaista on, että `yarn build:verify` ja `yarn docs:build:verify` kokoavat vain kieliversion `en` ja menevät puhtaasti läpi; vain täysi `yarn docs:build` paljastaa ongelman, ja se keskeytyy aakkosjärjestyksessä ensimmäiseen kieliversioon (`ar`).
- **Vaikutus:** Dokumentaatiomuutos voi läpäistä kaikki nopeat paikalliset tarkistukset ja rikkoa silti monikielisen tuotantokoonnin. Virhe näyttää myös liittymättömältä muutokseen, koska virheilmoitus mainitsee kieliversiopolun, johon tekijä ei ole koskenut.
- **Ratkaisu:** Käytä jokaisella dokumentaatiosivulla, jota ei ole peilattu hakemistoon `docs/i18n/**`, juuritason linkkejä (`/peer-to-peer-protocol/`, `/apps/5chan/`) suhteellisten `.md`-linkkien sijaan; Docusaurus lisää niihin kieliversioetuliitteen automaattisesti. `docs/build-your-own-client.md` on tästä olemassa oleva esimerkki. Aja täysi `yarn docs:build` — ei pelkkä `build:verify` — ennen kuin luovutat muutoksen, joka lisää dokumentaatiosivun tai linkittää siihen.
- **Tila:** vahvistettu

### Rinnakkaiset `update-translations.js`-ajot hukkaavat avaimia hiljaisesti

- **Päivämäärä:** 2026-08-02
- **Havainnut:** Claude
- **Konteksti:** 26 käännetyn i18next-avaimen vieminen kaikkiin 36 kieliversioon `translate`-taidon avulla
- **Yllättävää oli:** Jokainen ajo on luku-muokkaus-kirjoitus kaikkien 36 kieliversiotiedoston yli, joten kaksi samanaikaista ajoa ylikirjoittavat toisensa ja yksi avain katoaa ilman virheilmoitusta. `translate`-taito ohjeistaa nimenomaisesti käynnistämään jopa neljä aliagenttia rinnakkain, ja jokainen niistä kutsuisi tätä skriptiä.
- **Vaikutus:** Virhe on hiljainen: avaimia katoaa satunnaisista kieliversioista, ja diff näyttää silti uskottavalta.
- **Ratkaisu:** Älä koskaan anna kääntäjä-aliagenttien kirjoittaa kieliversiotiedostoja rinnakkain — anna niiden tuottaa vain sanakirja-JSON-tiedostoja ja vie sitten jokainen avain sarjassa pääagentista. Varmista viennin jälkeen ohjelmallisesti, että jokainen avain löytyy kaikista 35 ei-englanninkielisestä kieliversiosta eikä yksikään arvo ole tavulleen identtinen englanninkielisen lähteen kanssa.
- **Tila:** vahvistettu
- **Päivitys (2026-08-10):** Skripti ratkaisi aiemmin myös kohteensa muodossa `path.join(process.cwd(), "public", "translations")`, joten dokumentoitu repon juuresta ajettava komento epäonnistui virheeseen "Translations directory not found", ja skripti piti ajaa hakemistosta `about/`. Nyt se ratkaisee työtilan nykyisestä hakemistosta tai omasta sijainnistaan ja toimii mistä tahansa. Yllä kuvattu rinnakkaisuusansa on ennallaan.

### Kehitystilan annotaatiosäätimet voivat siepata automaation klikkauksia

- **Konteksti:** About- ja chain-sivustoilla on kiinteitä säätimiä oikeassa alakulmassa, jossa myös Agentation-työkalupalkki näkyy kehitystilassa.
- **Ratkaisu:** `scripts/pw-session.sh open` rekisteröi asetuksen `window.__NO_DEV_TOOLBAR__ = true` ennen sivun uudelleenlatausta. Agentationin alustaja huomioi myös liput `__VISUAL_TESTING__` ja `__PROFILING__`; lähdekoodin tarkastelu pysyy käytettävissä tästä riippumatta. Suoran selainautomaation on asetettava sama lippu ennen sovelluksen lataamista.

### `skills add` asentaa Codexin ja Cursorin kopiot gitignoroituun `.agents/`-hakemistoon

- **Päivämäärä:** 2026-08-18
- **Havainnut:** Tommaso + Claude
- **Konteksti:** `improve-threejs`-taidon asentaminen lähteestä `millionco/react-doctor` `skills`-komentorivityökalulla (`vercel-labs/skills`).
- **Yllättävää oli:** `npx skills add <repo> --skill <name> --agent codex` ja `--agent cursor` kirjoittavat molemmat hakemistoon `.agents/skills/<name>/` eivätkä hakemistoihin `.codex/skills/` tai `.cursor/skills/`. `AGENTS.md` kieltää repotason `.agents/`-hakemiston, ja `.gitignore:29` jättää sen huomiotta, joten molemmat kopiot jäävät hiljaisesti versionhallinnan ulkopuolelle. Vain `--agent claude-code` kirjoittaa odotettuun hakemistoon `.claude/skills/`. Tästä erillään dokumentoitu pilkuin erotettu muoto (`--agent claude-code,codex,cursor`) epäonnistuu virheeseen "Invalid agents" eikä asenna mitään, vaikka jokainen nimi on yksinään kelvollinen.
- **Vaikutus:** Asennus ilmoittaa onnistuneensa, vaikka kaksi kolmesta työkaluketjun kopiosta päätyy paikkaan, jota ei koskaan commitoida, joten Codexilta ja Cursorilta puuttuu taito hiljaisesti tuoreen kloonauksen jälkeen. Pilkkumuoto voi myös tuottaa asennuksen, joka ei tee mitään mutta näyttää onnistuneelta.
- **Nykyinen ratkaisu:** Repo seuraa nyt hakemistoa `.agents/skills` kanonisena lähteenään ja generoi Claude-kopiot komennolla `yarn ai-workflow:sync`. Aiempi `.agents`-kielto ja ohitussääntö on poistettu. Älä kopioi uusia taitoja kolmeen erilliseen juureen; tarkista generoitu vastaavuus ja sovelluksen katalogi taidon lisäämisen jälkeen.
- **Tila:** vahvistettu
