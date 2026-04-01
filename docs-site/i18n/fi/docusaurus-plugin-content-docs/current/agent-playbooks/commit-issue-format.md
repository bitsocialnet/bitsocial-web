# Sitoumus- ja julkaisumuoto

Käytä tätä, kun ehdotat tai toteutat merkityksellisiä koodimuutoksia.

## Sitouta ehdotusmuoto

- **Otsikko:** Perinteinen sitoumustyyli, lyhyt, kääritty selkäpuikoihin.
- Käytä `perf`:ta (ei `fix`) suorituskyvyn optimointiin.
- **Kuvaus:** Valinnainen 2–3 epävirallista lausetta, jotka kuvaavat ratkaisua. Lyhyt, tekninen, ei luodikohtia.

Esimerkki:

> **Sitoumuksen nimi:** `fix: correct date formatting in timezone conversion`
>
> Päivitetty `formatDate()` malliin `date-utils.ts`, jotta aikavyöhykesiirtymät voidaan käsitellä oikein.

## GitHub-ongelmaehdotusmuoto

- **Otsikko:** Mahdollisimman lyhyt, selkäpukuihin käärittynä.
- **Kuvaus:** 2–3 epävirallista lausetta, jotka kuvaavat ongelmaa (ei ratkaisua), ikään kuin se olisi edelleen ratkaisematon.

Esimerkki:

> **GitHub-ongelma:**
>
> - **Otsikko:** `Date formatting displays incorrect timezone`
> - **Kuvaus:** Kommenttien aikaleimat näyttävät väärät aikavyöhykkeet, kun käyttäjät katselevat viestejä eri alueilta. `formatDate()`-toiminto ei ota huomioon käyttäjän paikallisia aikavyöhykeasetuksia.
