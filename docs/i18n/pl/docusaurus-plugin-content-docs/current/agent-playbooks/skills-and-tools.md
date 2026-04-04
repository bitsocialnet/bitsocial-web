# Umiejętności i narzędzia

Skorzystaj z tego podręcznika podczas konfigurowania/dostosowywania umiejętności i narzędzi zewnętrznych.

## Zalecane umiejętności

### Kontekst7 (dokumentacja biblioteczna)

Aby uzyskać aktualne dokumenty dotyczące bibliotek.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramaturg CLI

Użyj `playwright-cli` do automatyzacji przeglądarki (nawigacja, interakcja, zrzuty ekranu, testy, ekstrakcja).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Lokalizacje instalacji umiejętności:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Najlepsze praktyki Vercel React

Aby uzyskać szczegółowe wskazówki dotyczące wydajności React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Znajdź umiejętności

Odkryj/zainstaluj umiejętności z otwartego ekosystemu.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Uzasadnienie polityki MCP

W przypadku tego projektu należy unikać serwerów GitHub MCP i przeglądarek MCP, ponieważ zwiększają one znaczny narzut związany ze schematem narzędzi/kontekstem.

- Operacje na GitHubie: użyj interfejsu CLI `gh`.
- Operacje na przeglądarce: użyj `playwright-cli`.
