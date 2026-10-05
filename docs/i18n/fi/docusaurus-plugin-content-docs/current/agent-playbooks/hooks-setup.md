# Agenttikoukut

Versionhallintaan tallennetut elinkaarikoukut ainoastaan muotoilevat onnistuneesti muokatut JavaScript-/TypeScript-tiedostot asennetulla oxfmt:llä. Jaettu logiikka on tiedostossa `scripts/agent-hooks/format.mjs`; jokainen natiivi kääre delegoi työn sille.

| Sovellus | Natiivi määritys | Tapahtuma |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude ei lue erillistä tiedostoa `.claude/hooks.json`. Kukin sovellus päättää edelleen itse projektin luottamuksesta ja siitä, ovatko koukut käytössä; tarkista sen nykyiset asetukset sen sijaan, että ohittaisit luottamuksen. `.codex/config.toml` on repon määritystiedosto, ei koukkukomentojen rekisteri.

Muotoilija tarkistaa tapahtuman ja hyötykuorman, muokkauksen onnistumisen, tiedostopäätteen ja sen, että tiedosto on repon sisällä, symboliset linkit mukaan lukien. Puuttuvat riippuvuudet tai epäolennainen syöte eivät käynnistä mitään työtä. Komennot käyttävät argumenttitaulukkoa, ja Corepackin verkkoyhteys on poistettu käytöstä; koukut eivät asenna riippuvuuksia, aja koonteja tai katselmointeja eivätkä muuta Gitin tilaa.

Aja tarkistukset erikseen sivun [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) mukaisesti. Aja `yarn ai-workflow:sync`, `yarn ai-workflow:check` ja `yarn ai-workflow:test` työnkulun muuttamisen jälkeen. Fixturet käyttävät kertakäyttöisiä tiedostoja ja valemuotoilijakutsuja; ne eivät todista, että kukin sovellus latasi määrityksensä. Lataa sovellus uudelleen ja tarkista sen katalogi päivitysten jälkeen.

Impeccable-suunnittelutaito ja sen suoritettavat apuohjelmat ovat edelleen tarvittaessa käytettävissä hakemistossa `.agents/skills/impeccable`. Sen aiempi Codex-koukku osoitti puuttuvaan hakemistoon; suunnittelutyönkulku ajetaan nyt, kun sen taito valitaan, eikä jatkuvasti päällä olevaa suunnittelukoukkua ole. Taito ei saa määrittää projektin koukkuja uudelleen suunnittelutyön sivutuotteena.
