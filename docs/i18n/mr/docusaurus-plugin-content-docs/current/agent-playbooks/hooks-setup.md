# एजंट हुक्स सेटअप

तुमचा AI कोडिंग असिस्टंट लाइफसायकल हुकला सपोर्ट करत असल्यास, ते या रेपोसाठी कॉन्फिगर करा.

## शिफारस केलेले हुक

| हुक             | आज्ञा                                      | उद्देश                                                                                                                                                                     |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI संपादनांनंतर फायली स्वयं स्वरूपित करा                                                                                                                                   |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json` बदलल्यावर `corepack yarn install` चालवा                                                                                                                     |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | शिळ्या संदर्भांची छाटणी करा आणि एकात्मिक तात्पुरत्या कार्य शाखा हटवा                                                                                                       |
| `stop`          | `scripts/agent-hooks/verify.sh`            | हार्ड-गेट बिल्ड, लिंट, टाइपचेक आणि फॉरमॅट चेक; `yarn npm audit` माहितीपूर्ण ठेवा आणि जेव्हा अवलंबित्व/आयात बदलते तेव्हा सल्लागार ऑडिट म्हणून स्वतंत्रपणे `yarn knip` चालवा |

## का

- सातत्यपूर्ण स्वरूपन
- लॉकफाइल समक्रमित राहते
- बिल्ड/लिंट/टाईप समस्या लवकर पकडल्या गेल्या
- `yarn npm audit`
- अवलंबन/आयात ड्रिफ्ट द्वारे `yarn knip` द्वारे गोंगाट करणारा जागतिक स्टॉप हुक मध्ये बदलल्याशिवाय तपासता येऊ शकतो
- कोडेक्स आणि कर्सर दोन्हीसाठी एक सामायिक हुक अंमलबजावणी
- तात्पुरत्या कार्य शाखा रेपोच्या वर्कट्री वर्कफ्लोसह संरेखित राहतात

## उदाहरण हुक स्क्रिप्ट

### हुक फॉरमॅट करा

```bash
#!/bin/bash
# AI संपादनानंतर JS/TS फायली ऑटो-फॉर्मेट करा
# हुक फाइल_पाथ सह stdin द्वारे JSON प्राप्त करतो

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### हूक सत्यापित करा

```bash
#!/bin/bash
# एजंट पूर्ण झाल्यावर बिल्ड, लिंट, टाइपचेक, फॉरमॅट चेक आणि सिक्युरिटी ऑडिट चालवा

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

डिफॉल्टनुसार, आवश्यक तपासणी अयशस्वी झाल्यावर `scripts/agent-hooks/verify.sh` शून्य नसून बाहेर पडते. जेव्हा तुम्हाला हुक न अडवता तुटलेल्या झाडावरून जाणूनबुजून सिग्नलची आवश्यकता असेल तेव्हाच `AGENT_VERIFY_MODE=advisory` सेट करा. `yarn knip` ला हार्ड गेटच्या बाहेर ठेवा जोपर्यंत रेपो स्पष्टपणे सल्लागार आयात/अवलंबन समस्यांवर अयशस्वी होण्याचा निर्णय घेत नाही.

### यार्न इंस्टॉल हुक

```bash
#!/bin/bash
# पॅकेज.जेसन बदलल्यावर कोरेपॅक यार्न इंस्टॉल चालवा
# हुक फाइल_पाथ सह stdin द्वारे JSON प्राप्त करतो

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

तुमच्या एजंट टूल डॉक्सनुसार हुक वायरिंग कॉन्फिगर करा (`hooks.json`, समतुल्य, इ.).

या रेपोमध्ये, `.codex/hooks/*.sh` आणि `.cursor/hooks/*.sh` हे पातळ रॅपर म्हणून राहिले पाहिजेत जे `scripts/agent-hooks/` अंतर्गत सामायिक अंमलबजावणीसाठी नियुक्त करतात.
