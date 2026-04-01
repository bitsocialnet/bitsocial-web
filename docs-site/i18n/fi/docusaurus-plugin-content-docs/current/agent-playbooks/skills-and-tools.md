# Taidot ja työkalut

Käytä tätä ohjekirjaa, kun määrität/säädät taitojasi ja ulkoisia työkaluja.

## Suositeltavat taidot

### Konteksti7 (kirjaston asiakirjat)

Ajantasaiset asiakirjat kirjastoista.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Näytelmäkirjailija CLI

Käytä `playwright-cli`:ta selaimen automatisointiin (navigointi, vuorovaikutus, kuvakaappaukset, testit, purkaminen).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Taitojen asennuspaikat:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel Reactin parhaat käytännöt

Syvempi React/Next-suoritusopastus.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Etsi taitoja

Löydä/asenna taitoja avoimesta ekosysteemistä.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP-politiikan perusteet

Vältä GitHubin MCP- ja selaimen MCP-palvelimia tässä projektissa, koska ne lisäävät huomattavaa työkalukaaviota/kontekstia.

- GitHub-toiminnot: käytä `gh` CLI:tä.
- Selaimen toiminnot: käytä `playwright-cli`.
