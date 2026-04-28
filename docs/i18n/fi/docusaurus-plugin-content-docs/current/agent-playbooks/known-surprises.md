# Tunnettuja yllätyksiä

Tämä tiedosto seuraa arkistokohtaisia sekaannuksia, jotka aiheuttivat agenttivirheitä.

## Osallistumiskriteerit

Lisää merkintä vain, jos kaikki ovat totta:

- Se on nimenomaan tälle tietovarastolle (ei yleisiä neuvoja).
- Se todennäköisesti toistuu tuleville agenteille.
- Sillä on konkreettinen lievennys, jota voidaan seurata.

Jos olet epävarma, kysy kehittäjältä ennen merkinnän lisäämistä.

## Sisääntulomalli

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

## merkinnät

### Portless muuttaa ensisijaisen paikallisen sovelluksen URL-osoitteen

- **Päivämäärä:** 18.3.2026
- **Havaittu:** Codex
- **Konteksti:** Selaimen vahvistus ja savuvirta
- **Mikä oli yllättävää:** Paikallinen oletus-URL-osoite ei ole tavallinen Vite-portti. Repo odottaa `https://bitsocial.localhost`:ta Portlessin kautta, joten `localhost:3000`:n tai `localhost:5173`:n tarkistaminen voi osua väärään sovellukseen tai ei ollenkaan.
- **Vaikutus:** Selaimen tarkistukset voivat epäonnistua tai vahvistaa väärän kohteen, vaikka kehityspalvelin olisi kunnossa.
- **Liikennys:** Käytä ensin `https://bitsocial.localhost`. Ohita se vain `PORTLESS=0 corepack yarn start`:lla, kun tarvitset suoraan Vite-portin.
- **Tila:** vahvistettu

### Commitizen-koukut estävät ei-interaktiiviset sitoumukset

- **Päivämäärä:** 18.3.2026
- **Havaittu:** Codex
- **Konteksti:** Agenttilähtöiset toimitustyönkulut
- **Mikä oli yllättävää:** `git commit` laukaisee Commitizenin Huskyn kautta ja odottaa interaktiivista TTY-syötettä, joka ripustaa ei-interaktiiviset agentin kuoret.
- **Vaikutus:** Agentit voivat viipyä toistaiseksi normaalin sitoumuksen aikana.
- **Liikennys:** Käytä `git commit --no-verify -m "message"` agentin luomiin sitoumuksiin. Ihmiset voivat edelleen käyttää `corepack yarn commit`:ta tai `corepack yarn exec cz`:ta.
- **Tila:** vahvistettu

### Corepack vaaditaan lankaklassikon välttämiseksi

- **Päivämäärä:** 19.3.2026
- **Havaittu:** Codex
- **Konteksti:** Paketinhallinnan siirto lankaan 4
- **Mikä oli yllättävää:** Koneessa on edelleen yleinen Yarn Classic -asennus `PATH`:lle, joten pelkkä `yarn` voi ratkaista version 1 kiinnitetyn Yarn 4 -version sijaan.
- **Vaikutus:** Kehittäjät voivat vahingossa ohittaa repon paketinhallintakiinnityksen ja saada erilaisen asennuskäyttäytymisen tai lukitustiedoston.
- **Liikennys:** Käytä komentotulkkikomentoihin `corepack yarn ...` tai suorita `corepack enable` ensin, jotta tavallinen `yarn` ratkaisee kiinnitetyn Lanka 4 -version.
- **Tila:** vahvistettu

### Korjatut Portless-sovellusten nimet törmäävät Bitsocial Web -työpuihin

- **Päivämäärä:** 30.3.2026
- **Havaittu:** Codex
- **Konteksti:** `yarn start` käynnistetään yhdessä Bitsocial Web -työpuussa, kun toinen työpuu palveli jo Portlessin kautta
- **Mikä oli yllättävää:** Portless-sovelluksen kirjaimellisen nimen `bitsocial` käyttäminen jokaisessa työpuussa saa itse reitin törmäämään, vaikka taustaportit ovat erilaiset, joten toinen prosessi epäonnistuu, koska `bitsocial.localhost` on jo rekisteröity.
- **Vaikutus:** Rinnakkaiset Bitsocial Web -haarat voivat estää toisensa, vaikka Portlessin on tarkoitus antaa niiden olemassaolo turvallisesti rinnakkain.
- **Liikennys:** Säilytä porttiton käynnistys `scripts/start-dev.mjs`:n takana, joka nyt käyttää haaralaajuista `*.bitsocial.localhost`-reittiä kanonisen tapauksen ulkopuolella ja palaa haaralaajuiseen reittiin, kun paljas `bitsocial.localhost`-nimi on jo varattu.
- **Tila:** vahvistettu

### Asiakirjojen esikatselu, jota käytetään portin 3001 kovakoodaukseen

- **Päivämäärä:** 30.3.2026
- **Havaittu:** Codex
- **Konteksti:** Toimii `yarn start` muiden paikallisten repojen ja agenttien kanssa
- **Mikä oli yllättävää:** Root dev -komento suoritti docs-työtilan `docusaurus start --port 3001`:lla, joten koko kehitysistunto epäonnistui aina, kun jokin toinen prosessi omisti jo `3001`:n, vaikka pääsovellus käytti jo Portlessia.
- **Vaikutus:** `yarn start` voi pysäyttää verkkoprosessin heti sen käynnistymisen jälkeen ja keskeyttää asiaankuulumattoman paikallisen työn docs-portin törmäyksen vuoksi.
- **Liikennys:** Pidä asiakirjojen käynnistys `yarn start:docs`:n takana, joka nyt käyttää Portlessia plus `scripts/start-docs.mjs`:ta injektoidun vapaan portin kunnioittamiseen tai palaa seuraavaan vapaaseen porttiin, kun se suoritetaan suoraan.
- **Tila:** vahvistettu

### Korjatut asiakirjat Portless-isäntänimi oli kovakoodattu

- **Päivämäärä:** 2026-04-03
- **Havaittu:** Codex
- **Konteksti:** Suoritetaan `yarn start` toissijaisessa Bitsocial Web -työpuussa, kun toinen työpuu palveli jo asiakirjoja Portlessin kautta
- **Mikä oli yllättävää:** `start:docs` rekisteröi edelleen kirjaimellisen `docs.bitsocial.localhost`-isäntänimen, joten `yarn start` saattoi epäonnistua, vaikka about-sovellus osasi jo välttää porttittoman reitin törmäykset omalle isäntänimelleen.
- **Vaikutus:** Rinnakkaiset työpuut eivät voineet käyttää luotettavasti root dev -komentoa, koska dokumenttiprosessi poistui ensin ja `concurrently` lopetti sitten istunnon loppuosan.
- **Liikennys:** Pidä docs-käynnistys `scripts/start-docs.mjs`:n takana. Se johtaa nyt saman haaralaajuisen Portless-isäntänimen kuin about-sovellus ja lisää jaetun julkisen URL-osoitteen `/docs`-kehittäjän välityspalvelimeen.
- **Tila:** vahvistettu

### Worktree-kuoret voivat jättää väliin repon kiinnitetyn Node-version

- **Päivämäärä:** 2026-04-03
- **Havaittu:** Codex
- **Konteksti:** `yarn start`:n käyttäminen Git-työpuissa, kuten `.claude/worktrees/*`, tai sisarustyöpuun kassoissa
- **Mikä oli yllättävää:** Jotkin työpuun kuoret ratkaisivat `node` ja `yarn node` Homebrew-solmuksi `25.2.1`, vaikka repo nastat `22.12.0` `.nvmrc`:ssa, joten `yarn node` saattoi käynnistyä hiljaa QPLACEHOLDERXQ:n alla. väärä käyttöaika.
- **Vaikutus:** Kehittäjäpalvelimen käyttäytyminen voi ajautua pääkassan ja työpuiden välillä, mikä tekee virheistä vaikeasti toistettavia ja rikkoo repon odotettua Node 22 -työkaluketjua.
- **Liikennys:** Pidä kehityskäynnistimet `scripts/start-dev.mjs`:n ja `scripts/start-docs.mjs`:n takana, jotka nyt suorittavat uudelleen `.nvmrc` Node -binaarin alla, kun nykyinen kuori on väärässä versiossa. Shell-asetusten tulisi silti suosia `nvm use`.
- **Tila:** vahvistettu

### `docs-site/`-jäämät voivat piilottaa puuttuvan asiakirjalähteen refaktorin jälkeen

- **Päivämäärä:** 1.4.2026
- **Havaittu:** Codex
- **Konteksti:** Yhdistämisen jälkeinen monorepo-siivous sen jälkeen, kun Docusaurus-projekti on siirretty `docs-site/`:sta `docs/`:han
- **Mikä oli yllättävää:** Vanha `docs-site/`-kansio voi jäädä levylle vanhentuneiden mutta tärkeiden tiedostojen, kuten `i18n/`, kanssa, vaikka seurattu repo on siirretty hakemistoon `docs/`. Tämä saa refaktorin näyttämään päällekkäiseltä paikallisesti ja voi piilottaa sen tosiasian, että jäljitettyjen asiakirjojen käännöksiä ei itse asiassa siirretty `docs/`:hen.
- **Vaikutus:** Agentit voivat poistaa vanhan kansion "roskapostina" ja menettää vahingossa ainoan paikallisen kopion asiakirjojen käännöksistä tai jatkaa sellaisten komentosarjojen muokkausta, jotka osoittavat edelleen kuolleeseen `docs-site/`-polkuun.
- **Liikennys:** Käsittele `docs/`:ta ainoana kanonisena dokumenttiprojektina. Ennen kuin poistat paikalliset `docs-site/`-jäämät, palauta jäljitetty lähde, kuten `docs/i18n/`, ja päivitä komentosarjat ja koukut lopettaaksesi `docs-site`-viittauksen.
- **Tila:** vahvistettu

### Multilocale docs -esikatselu voi lisätä RAM-muistia vahvistuksen aikana

- **Päivämäärä:** 1.4.2026
- **Havaittu:** Codex
- **Konteksti:** docs i18n:n, locale-reitityksen ja Pagefind-toiminnan korjaaminen `yarn start:docs` plus Playwrightin avulla
- **Mikä oli yllättävää:** Dokumenttien oletusesikatselutilassa luodaan nyt täydelliset monipaikkaiset asiakirjat sekä Pagefind-indeksointi ennen käyttöä, ja prosessin pitäminen käynnissä useiden Playwright- tai Chrome-istuntojen rinnalla voi kuluttaa paljon enemmän RAM-muistia kuin tavallinen Vite- tai yksikielinen Docusaurus-kehityssilmukka.
- **Vaikutus:** Laitteen muisti voi olla rajoitettu, selainistunnot voivat kaatua ja keskeytyneet ajot voivat jättää taakseen vanhentuneet asiakirjapalvelimet tai päättömät selaimet, jotka kuluttavat jatkuvasti muistia.
- **Liikennys:** Jos käytät asiakirjatyötä, joka ei vaadi kieli- tai Pagefind-vahvistusta, valitse `DOCS_START_MODE=live yarn start:docs`. Käytä oletusarvoista monilokaalista esikatselua vain, kun sinun on vahvistettava käännetyt reitit tai Pagefind. Pidä yksi Playwright-istunto, sulje vanhat selainistunnot ennen uusien avaamista ja pysäytä asiakirjapalvelin vahvistuksen jälkeen, jos et enää tarvitse sitä.
- **Tila:** vahvistettu
