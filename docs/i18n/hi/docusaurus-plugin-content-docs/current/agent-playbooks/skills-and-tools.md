# कौशल और उपकरण

कौशल और बाहरी टूलींग को स्थापित/समायोजित करते समय इस प्लेबुक का उपयोग करें।

## अनुशंसित कौशल

### प्रसंग7 (लाइब्रेरी दस्तावेज़)

पुस्तकालयों पर नवीनतम दस्तावेज़ों के लिए।

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### नाटककार सीएलआई

ब्राउज़र स्वचालन (नेविगेशन, इंटरैक्शन, स्क्रीनशॉट, परीक्षण, निष्कर्षण) के लिए `playwright-cli` का उपयोग करें।

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

कौशल स्थापित स्थान:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### वर्सेल रिएक्ट सर्वोत्तम अभ्यास

गहन प्रतिक्रिया/अगला प्रदर्शन मार्गदर्शन के लिए।

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### कौशल खोजें

खुले पारिस्थितिकी तंत्र से कौशल खोजें/स्थापित करें।

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## एमसीपी नीति तर्क

इस प्रोजेक्ट के लिए GitHub MCP और ब्राउज़र MCP सर्वर से बचें क्योंकि वे महत्वपूर्ण टूल-स्कीमा/संदर्भ ओवरहेड जोड़ते हैं।

- GitHub संचालन: `gh` CLI का उपयोग करें।
- ब्राउज़र संचालन: `playwright-cli` का उपयोग करें।
