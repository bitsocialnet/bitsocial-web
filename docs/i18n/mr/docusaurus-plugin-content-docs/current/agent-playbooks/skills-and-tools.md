# कौशल्ये आणि साधने

कौशल्य आणि बाह्य टूलिंग सेट अप/समायोजित करताना हे प्लेबुक वापरा.

## शिफारस केलेले कौशल्ये

### संदर्भ7 (लायब्ररी डॉक्स)

लायब्ररीवरील अद्ययावत दस्तऐवजांसाठी

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### . CLI

ब्राउझर ऑटोमेशनसाठी `playwright-cli` वापरा (नेव्हिगेशन, परस्परसंवाद, स्क्रीनशॉट, चाचण्या, एक्स्ट्रॅक्शन).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

कौशल्य स्थापना स्थानः

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React सर्वोत्तम पद्धती

सखोल प्रतिक्रिया/पुढील कार्यप्रदर्शन मार्गदर्शनासाठी.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### कौशल्य शोधा

ओपन इकोसिस्टममधून कौशल्ये शोधा/इंस्टॉल करा.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP धोरण तर्क

हे ब्राउझर MHCP Avoid आणि MCP Avoid प्रकल्पासाठी महत्त्वपूर्ण सेवा देतात. tool-schema/context overhead.

- GitHub ऑपरेशन्स: `gh` CLI वापरा.
- ब्राउझर ऑपरेशन्स: `playwright-cli` वापरा.
