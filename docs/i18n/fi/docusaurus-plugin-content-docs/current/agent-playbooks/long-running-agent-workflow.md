# Pitkäkestoinen agenttityö

Käytä pysyvää tehtävätilaa, kun työtä on jatkettava myöhemmin tai se luovutetaan toiselle, tai kun yksittäinen ajo on niin pitkä, että kontekstin tiivistäminen voisi kadottaa jäljellä olevan työn. Pienet tehtävät eivät tarvitse taulua tai edistymistiedostoa. Jaetussa työssä pidä tiivistä `feature-list.json`- ja `progress.md`-tiedostoa tehtäväkohtaisessa hakemistossa `docs/agent-runs/<slug>/` ja käytä olemassa olevia malleja, kun niistä on apua.

Kirjaa pyydetty lopputulos, nykyinen haara/worktree, tiedostojen omistajuus, valmiit muutokset, tarkistukset tuloksineen, omat prosessit ja istunnot sekä seuraava ratkaisematon vaihe. Älä tallenna tunnistetietoja tai mielivaltaisia lähdekoodivedoksia. Merkitse ominaisuus valmiiksi vasta, kun sen hyväksymisehdot on varmistettu.

Kun jatkat työtä, tarkista Gitin tila, viimeisin edistyminen ja olennainen lähdekoodi ennen muokkaamista. Käytä uudelleen yhteensopivia omia resursseja; käynnistä kehityspalvelin vain, kun seuraava tarkistus tarvitsee sitä. Valitse tarkistukset vaikutuksen perusteella sivun [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) avulla sen sijaan, että toistaisit muuttumattoman täyden ajon.

Pidä toisiinsa liittyvä delegoitu työ rajattuna ja päällekkäisyyksistä vapaana. Yksi agentti omistaa raskaat tarkistukset ja selainistunnot. Päivitä pysyvä tila, kun valmistunut osakokonaisuus, esto tai luovutus muuttaa sitä, mitä seuraavan tekijän on tiedettävä; älä kirjaa mekaanisesti jokaista komentoa.
