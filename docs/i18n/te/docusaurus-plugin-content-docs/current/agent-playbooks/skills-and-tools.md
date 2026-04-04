# నైపుణ్యాలు మరియు సాధనాలు

నైపుణ్యాలు మరియు బాహ్య సాధనాలను సెటప్ చేసేటప్పుడు/సర్దుబాటు చేసేటప్పుడు ఈ ప్లేబుక్‌ని ఉపయోగించండి.

## సిఫార్సు చేసిన నైపుణ్యాలు

### సందర్భం7 (లైబ్రరీ డాక్స్)

లైబ్రరీలలో తాజా డాక్స్ కోసం.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### నాటక రచయిత CLI

బ్రౌజర్ ఆటోమేషన్ (నావిగేషన్, ఇంటరాక్షన్, స్క్రీన్‌షాట్‌లు, పరీక్షలు, వెలికితీత) కోసం `playwright-cli`ని ఉపయోగించండి.

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

నైపుణ్యం సంస్థాపన స్థానాలు:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### వెర్సెల్ రియాక్ట్ బెస్ట్ ప్రాక్టీసెస్

లోతైన ప్రతిచర్య/తదుపరి పనితీరు మార్గదర్శకత్వం కోసం.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### నైపుణ్యాలను కనుగొనండి

ఓపెన్ ఎకోసిస్టమ్ నుండి నైపుణ్యాలను కనుగొనండి/ఇన్‌స్టాల్ చేయండి.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP పాలసీ హేతుబద్ధత

ఈ ప్రాజెక్ట్ కోసం GitHub MCP మరియు బ్రౌజర్ MCP సర్వర్‌లను నివారించండి ఎందుకంటే అవి ముఖ్యమైన టూల్-స్కీమా/కాంటెక్స్ట్ ఓవర్‌హెడ్‌ని జోడిస్తాయి.

- GitHub కార్యకలాపాలు: `gh` CLIని ఉపయోగించండి.
- బ్రౌజర్ కార్యకలాపాలు: `playwright-cli`ని ఉపయోగించండి.
