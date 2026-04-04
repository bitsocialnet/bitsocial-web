# Pitkäaikainen agenttityönkulku

Käytä tätä ohjekirjaa, kun tehtävä todennäköisesti kattaa useita istuntoja, kanavanvaihtoja tai synnyttäneitä agentteja.

## Maalit

- Anna jokaiselle tuoreelle istunnolle nopea tapa saada konteksti takaisin
- Jatka työskentelyä asteittain sen sijaan, että tekisit suuren muutoksen yhdellä kertaa
- Ota kiinni rikki paikallisesta perusviivasta ennen kuin lisäät koodia
- Jätä kestäviä esineitä, joihin seuraava istunto voi luottaa

## Missä pitää valtion

- Käytä `docs/agent-runs/<slug>/`, kun ihmiset, tarkistusbotit tai useat työkaluketjut tarvitsevat saman tehtävätilan.
- Käytä paikallista työkaluhakemistoa, kuten `.codex/runs/<slug>/`, vain, kun tehtävän tila on tarkoituksellisesti paikallinen yhdelle työasemalle tai työkaluketjulle.
- Älä piilota usean istunnon jaettua tilaa yksityiseen raaputusarpatiedostoon, jos toinen avustaja tai agentti tarvitsee sitä myöhemmin.

## Vaaditut tiedostot

Luo nämä tiedostot pitkään jatkuvan tehtävän alussa:

- `feature-list.json`
- `progress.md`

Käytä mallien `docs/agent-playbooks/templates/feature-list.template.json` ja `docs/agent-playbooks/templates/progress.template.md` malleja.

Valitse ominaisuusluettelossa JSON, jotta agentit voivat päivittää pienen määrän kenttiä kirjoittamatta koko asiakirjaa uudelleen.

## Istunnon aloituksen tarkistuslista

1. Suorita `pwd`.
2. Lue `progress.md`.
3. Lue `feature-list.json`.
4. Suorita `git log --oneline -20`.
5. Suorita `./scripts/agent-init.sh --smoke`.
6. Valitse täsmälleen yksi tärkein tuote, joka on edelleen `pending`, `in_progress` tai `blocked`.

Jos savuvaihe epäonnistuu, korjaa rikkinäinen perusviiva ennen uuden ominaisuuden käyttöönottoa.

## Istunnon säännöt

- Työskentele yhden ominaisuuden tai tehtävälohkon parissa kerrallaan.
- Pidä ominaisuusluettelo koneellisesti luettavana ja vakaana. Päivitä tila, muistiinpanot, tiedostot ja vahvistuskentät sen sijaan, että kirjoitat uudelleen toisiinsa liittymättömiä kohteita.
- Merkitse kohde vahvistetuksi vasta, kun olet suorittanut kyseisessä kohdassa luetellun komennon tai käyttäjän kulun.
- Käytä syntyneitä agentteja rajatuille osille, älä yleiseen tehtävän tilan omistajuuteen.
- Kun alaagentti omistaa yhden kohteen, anna sille tarkka nimikkeen tunnus, hyväksymisehdot ja tiedostot, joita se voi koskea.

## Istunnon päättymisen tarkistuslista

1. Liitä lyhyt edistymismerkintä kohtaan `progress.md`.
2. Päivitä kosketettu kohde kohteessa `feature-list.json`.
3. Tallenna tarkat komennot, jotka suoritetaan vahvistusta varten.
4. Kaappaa estotoiminnot, seurannat ja seuraavaksi paras kohde, jota voit jatkaa.

## Suositeltu edistymismuoto

Käytä lyhyttä rakennetta, kuten:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
