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
- **Mikä oli yllättävää:** Paikallinen oletus-URL-osoite ei ole tavallinen Vite-portti. Repo odottaa `http://bitsocial.localhost:1355`:ta Portlessin kautta, joten `localhost:3000`:n tai `localhost:5173`:n tarkistaminen voi osua väärään sovellukseen tai ei ollenkaan.
- **Vaikutus:** Selaimen tarkistukset voivat epäonnistua tai vahvistaa väärän kohteen, vaikka kehityspalvelin olisi kunnossa.
- **Liikennys:** Käytä ensin `http://bitsocial.localhost:1355`. Ohita se vain `PORTLESS=0 corepack yarn start`:lla, kun tarvitset suoraan Vite-portin.
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
- **Liikennys:** Käytä komentotulkkikomentoihin `corepack yarn ...` tai suorita `corepack enable` ensin, jotta yksinkertainen `yarn` ratkaisee kiinnitetyn Lanka 4 -version.
- **Tila:** vahvistettu

### Korjatut Portless-sovellusten nimet törmäävät Bitsocial Web -työpuihin

- **Päivämäärä:** 30.3.2026
- **Havaittu:** Codex
- **Konteksti:** `yarn start` käynnistetään yhdessä Bitsocial Web -työpuussa, kun toinen työpuu palveli jo Portlessin kautta
- **Mikä oli yllättävää:** Portless-sovelluksen kirjaimellisen nimen `bitsocial` käyttäminen jokaisessa työpuussa saa itse reitin törmäämään, vaikka taustaportit olisivat erilaisia, joten toinen prosessi epäonnistuu, koska `bitsocial.localhost` on jo rekisteröity.
- **Vaikutus:** Rinnakkaiset Bitsocial Web -haarat voivat estää toisensa, vaikka Portlessin on tarkoitus antaa niiden olla turvallisesti rinnakkain.
- **Liikennys:** Pidä porttiton käynnistys `scripts/start-dev.mjs`:n takana, joka nyt käyttää haaralaajuista `*.bitsocial.localhost:1355`-reittiä kanonisen tapauksen ulkopuolella ja palaa haaralaajuiseen reittiin, kun paljas `bitsocial.localhost`-nimi on jo varattu.
- **Tila:** vahvistettu

### Asiakirjojen esikatselu, jota käytetään portin 3001 kovakoodaukseen

- **Päivämäärä:** 30.3.2026
- **Havaittu:** Codex
- **Konteksti:** Toimii `yarn start` muiden paikallisten repojen ja agenttien kanssa
- **Mikä oli yllättävää:** Root dev -komento suoritti docs-työtilan `docusaurus start --port 3001`:lla, joten koko kehitysistunto epäonnistui aina, kun jokin toinen prosessi omisti jo `3001`:n, vaikka pääsovellus käytti jo Portlessia.
- **Vaikutus:** `yarn start` voi pysäyttää verkkoprosessin heti sen käynnistymisen jälkeen ja keskeyttää asiaankuulumattoman paikallisen työn docs-portin törmäyksen vuoksi.
- **Liikennys:** Pidä asiakirjojen käynnistys `yarn start:docs`:n takana, joka nyt käyttää Portlessia plus `scripts/start-docs.mjs`:ta injektoidun vapaan portin kunnioittamiseen tai palaa seuraavaan vapaaseen porttiin, kun se suoritetaan suoraan.
- **Tila:** vahvistettu
