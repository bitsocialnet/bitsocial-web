# Készségek és eszközök

Használja ezt a játékkönyvet a készségek és a külső szerszámok beállításához/beállításához.

## Ajánlott készségek

### Context7 (könyvtári dokumentumok)

A könyvtárakkal kapcsolatos naprakész dokumentumokért.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### drámaíró CLI

A `playwright-cli` használata a böngésző automatizálásához (navigáció, interakció, képernyőképek, tesztek, kibontás).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Ügyességi telepítési helyek:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### A Vercel React legjobb gyakorlatai

A React/Next teljesítményre vonatkozó mélyebb útmutatásért.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Találja meg a készségeket

Fedezze fel / telepítse a nyitott ökoszisztéma készségeit.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP-házirend indoklása

Kerülje el a GitHub MCP-t és a böngésző MCP-kiszolgálókat ebben a projektben, mert jelentős eszközséma/kontextus többletterhelést jelentenek.

- GitHub-műveletek: használja a `gh` CLI-t.
- Böngészőműveletek: használja a `playwright-cli`-t.
