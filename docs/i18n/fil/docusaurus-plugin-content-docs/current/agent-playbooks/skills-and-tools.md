# Mga Kasanayan at Kasangkapan

Gamitin ang playbook na ito kapag nagse-set up/nag-aayos ng mga kasanayan at panlabas na tool.

## Mga Inirerekomendang Kasanayan

### Context7 (library docs)

Para sa napapanahon na mga doc sa mga aklatan.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Playwright CLI

Gamitin ang `playwright-cli` para sa pag-automate ng browser (nabigasyon, pakikipag-ugnayan, mga screenshot, pagsubok, pagkuha).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Mga lokasyon ng pag-install ng kasanayan:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Pinakamahuhusay na Kasanayan sa Vercel React

Para sa mas malalim na gabay sa React/Next performance.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Maghanap ng mga Kasanayan

Tumuklas/mag-install ng mga kasanayan mula sa bukas na ecosystem.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Makatwirang Patakaran ng MCP

Iwasan ang GitHub MCP at browser MCP server para sa proyektong ito dahil nagdaragdag sila ng makabuluhang tool-schema/context overhead.

- Mga pagpapatakbo ng GitHub: gumamit ng `gh` CLI.
- Mga pagpapatakbo ng browser: gamitin ang `playwright-cli`.
