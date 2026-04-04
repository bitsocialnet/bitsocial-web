# ఏజెంట్ హుక్స్ సెటప్

మీ AI కోడింగ్ అసిస్టెంట్ లైఫ్‌సైకిల్ హుక్స్‌కి మద్దతిస్తే, ఈ రెపో కోసం వీటిని కాన్ఫిగర్ చేయండి.

## సిఫార్సు చేయబడిన హుక్స్

| హుక్            | ఆదేశం                                      | ప్రయోజనం                                                                                                                                                                                     |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI సవరణల తర్వాత ఆటో-ఫార్మాట్ ఫైల్‌లు                                                                                                                                                         |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json` మారినప్పుడు `corepack yarn install`ని అమలు చేయండి                                                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | పాత రెఫ్‌లను కత్తిరించండి మరియు ఇంటిగ్రేటెడ్ తాత్కాలిక టాస్క్ శాఖలను తొలగించండి                                                                                                              |
| `stop`          | `scripts/agent-hooks/verify.sh`            | హార్డ్-గేట్ బిల్డ్, లింట్, టైప్‌చెక్ మరియు ఫార్మాట్ చెక్‌లు; `yarn npm audit` సమాచారాన్ని ఉంచుకోండి మరియు డిపెండెన్సీలు/దిగుమతులు మారినప్పుడు `yarn knip`ని విడిగా సలహా ఆడిట్‌గా అమలు చేయండి |

## ఎందుకు

- స్థిరమైన ఫార్మాటింగ్
- లాక్‌ఫైల్ సింక్‌లో ఉంటుంది
- బిల్డ్/లింట్/రకం సమస్యలు ముందుగానే గుర్తించబడ్డాయి
- `yarn npm audit` ద్వారా భద్రతా దృశ్యమానత
- `yarn knip`తో డిపెండెన్సీ/దిగుమతి డ్రిఫ్ట్‌ని ధ్వనించే గ్లోబల్ స్టాప్ హుక్‌గా మార్చకుండా తనిఖీ చేయవచ్చు
- కోడెక్స్ మరియు కర్సర్ రెండింటికీ ఒక భాగస్వామ్య హుక్ అమలు
- తాత్కాలిక టాస్క్ శాఖలు రెపో యొక్క వర్క్‌ట్రీ వర్క్‌ఫ్లోతో సమలేఖనం చేయబడతాయి

## ఉదాహరణ హుక్ స్క్రిప్ట్‌లు

### ఫార్మాట్ హుక్

```bash
#!/bin/bash
# AI సవరణల తర్వాత JS/TS ఫైల్‌లను ఆటో-ఫార్మాట్ చేయండి
# హుక్ ఫైల్_పాత్‌తో stdin ద్వారా JSONని అందుకుంటుంది

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### హుక్ని ధృవీకరించండి

```bash
#!/bin/bash
# ఏజెంట్ పూర్తయినప్పుడు బిల్డ్, లింట్, టైప్ చెక్, ఫార్మాట్ చెక్ మరియు సెక్యూరిటీ ఆడిట్‌ని అమలు చేయండి

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

డిఫాల్ట్‌గా, అవసరమైన చెక్ విఫలమైనప్పుడు `scripts/agent-hooks/verify.sh` సున్నా కాకుండా నిష్క్రమిస్తుంది. మీరు ఉద్దేశపూర్వకంగా హుక్‌ను నిరోధించకుండా విరిగిన చెట్టు నుండి సిగ్నల్ అవసరమైనప్పుడు మాత్రమే `AGENT_VERIFY_MODE=advisory`ని సెట్ చేయండి. సలహా దిగుమతి/డిపెండెన్సీ సమస్యలపై రెపో స్పష్టంగా విఫలమవ్వాలని నిర్ణయించుకుంటే మినహా `yarn knip`ని హార్డ్ గేట్ వెలుపల ఉంచండి.

### నూలు ఇన్‌స్టాల్ హుక్

```bash
#!/bin/bash
# ప్యాకేజీ.json మార్చబడినప్పుడు కోర్‌ప్యాక్ నూలు ఇన్‌స్టాల్‌ను అమలు చేయండి
# హుక్ ఫైల్_పాత్‌తో stdin ద్వారా JSONని అందుకుంటుంది

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

మీ ఏజెంట్ టూల్ డాక్స్ (`hooks.json`, సమానమైనది, మొదలైనవి) ప్రకారం హుక్ వైరింగ్‌ను కాన్ఫిగర్ చేయండి.

ఈ రెపోలో, `.codex/hooks/*.sh` మరియు `.cursor/hooks/*.sh` లు `scripts/agent-hooks/` క్రింద భాగస్వామ్య అమలులకు డెలిగేట్ చేసే సన్నని రేపర్‌లుగా ఉండాలి.
