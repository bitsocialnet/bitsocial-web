# एजेंट हुक सेटअप

यदि आपका AI कोडिंग सहायक जीवनचक्र हुक का समर्थन करता है, तो इस रेपो के लिए इन्हें कॉन्फ़िगर करें।

## अनुशंसित हुक

| हुक             | आदेश                                       | Purpose                                                                                                                                                           |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI संपादन के बाद फ़ाइलें स्वतः-प्रारूपित हो जाती हैं                                                                                                              |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json` बदलने पर `corepack yarn install` चलाएँ                                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | पुराने रेफरी को छाँटें और एकीकृत अस्थायी कार्य शाखाओं को हटाएँ                                                                                                    |
| `stop`          | `scripts/agent-hooks/verify.sh`            | हार्ड-गेट बिल्ड, लिंट, टाइपचेक, और प्रारूप जांच; `yarn npm audit` को सूचनात्मक रखें और निर्भरता/आयात बदलने पर सलाहकार ऑडिट के रूप में `yarn knip` को अलग से चलाएं |

## क्यों

- लगातार स्वरूपण
- लॉकफाइल सिंक में रहता है
- बिल्ड/लिंट/टाइप संबंधी समस्याएं जल्दी पकड़ी गईं
- `yarn npm audit` के माध्यम से सुरक्षा दृश्यता
- निर्भरता/आयात बहाव को शोर वाले वैश्विक स्टॉप हुक में बदले बिना `yarn knip` के साथ जांचा जा सकता है
- कोडेक्स और कर्सर दोनों के लिए एक साझा हुक कार्यान्वयन
- अस्थायी कार्य शाखाएँ रेपो के वर्कट्री वर्कफ़्लो के साथ संरेखित रहती हैं

## उदाहरण हुक स्क्रिप्ट

### प्रारूप हुक

```bash
#!/bin/bash
# एआई संपादन के बाद जेएस/टीएस फाइलों को स्वत: प्रारूपित करें
# हुक फ़ाइल_पथ के साथ stdin के माध्यम से JSON प्राप्त करता है

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### हुक सत्यापित करें

```bash
#!/bin/bash
# एजेंट का काम पूरा होने पर बिल्ड, लिंट, टाइपचेक, फॉर्मेट चेक और सुरक्षा ऑडिट चलाएँ

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

डिफ़ॉल्ट रूप से, आवश्यक जांच विफल होने पर `scripts/agent-hooks/verify.sh` गैर-शून्य से बाहर निकल जाता है। `AGENT_VERIFY_MODE=advisory` को केवल तभी सेट करें जब आपको जानबूझकर हुक को अवरुद्ध किए बिना टूटे हुए पेड़ से सिग्नल की आवश्यकता हो। `yarn knip` को हार्ड गेट से बाहर रखें जब तक कि रेपो स्पष्ट रूप से सलाहकार आयात/निर्भरता मुद्दों पर विफल होने का निर्णय न ले ले।

### यार्न इंस्टाल हुक

```bash
#!/bin/bash
# जब package.json बदल जाए तो कोरपैक यार्न इंस्टॉल चलाएँ
# हुक फ़ाइल_पथ के साथ stdin के माध्यम से JSON प्राप्त करता है

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

अपने एजेंट टूल डॉक्स (`hooks.json`, समतुल्य, आदि) के अनुसार हुक वायरिंग कॉन्फ़िगर करें।

इस रेपो में, `.codex/hooks/*.sh` और `.cursor/hooks/*.sh` को पतले रैपर के रूप में रहना चाहिए जो `scripts/agent-hooks/` के तहत साझा कार्यान्वयन को सौंपते हैं।
