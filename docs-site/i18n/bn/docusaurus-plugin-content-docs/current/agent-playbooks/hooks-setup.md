# এজেন্ট হুক সেটআপ

যদি আপনার AI কোডিং সহকারী লাইফসাইকেল হুক সমর্থন করে, তাহলে এই রেপোর জন্য এগুলি কনফিগার করুন।

## প্রস্তাবিত হুক

| হুক             | আদেশ                                       | উদ্দেশ্য                                                                                                                                                             |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI সম্পাদনা করার পরে ফাইলগুলি স্বয়ংক্রিয় ফর্ম্যাট করুন                                                                                                             |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json` পরিবর্তন হলে `corepack yarn install` চালান                                                                                                            |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | বাসি রেফ ছেঁটে দিন এবং সমন্বিত অস্থায়ী টাস্ক শাখাগুলি মুছুন                                                                                                         |
| `stop`          | `scripts/agent-hooks/verify.sh`            | হার্ড-গেট বিল্ড, লিন্ট, টাইপচেক এবং ফরম্যাট চেক; `yarn npm audit` তথ্যগত রাখুন এবং নির্ভরতা/আমদানি পরিবর্তন হলে উপদেষ্টা নিরীক্ষা হিসাবে `yarn knip` আলাদাভাবে চালান |

## কেন

- সামঞ্জস্যপূর্ণ বিন্যাস
- লকফাইল সিঙ্কে থাকে
- বিল্ড/লিন্ট/টাইপ সমস্যা তাড়াতাড়ি ধরা পড়ে
- `yarn npm audit` এর মাধ্যমে নিরাপত্তা দৃশ্যমানতা
- নির্ভরতা/আমদানি ড্রিফ্ট এটিকে গোলমালপূর্ণ গ্লোবাল স্টপ হুকে পরিণত না করে `yarn knip` দিয়ে পরীক্ষা করা যেতে পারে
- কোডেক্স এবং কার্সার উভয়ের জন্য একটি ভাগ করা হুক বাস্তবায়ন
- অস্থায়ী টাস্ক শাখাগুলি রেপোর ওয়ার্কট্রি ওয়ার্কফ্লোয়ের সাথে সারিবদ্ধ থাকে

## উদাহরণ হুক স্ক্রিপ্ট

### ফরম্যাট হুক

```bash
#!/bin/bash
# Auto-format JS/TS files after AI edits
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### হুক যাচাই করুন

```bash
#!/bin/bash
# Run build, lint, typecheck, format check, and security audit when agent finishes

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

ডিফল্টরূপে, একটি প্রয়োজনীয় চেক ব্যর্থ হলে `scripts/agent-hooks/verify.sh` অ-শূন্য থেকে বেরিয়ে যায়। `AGENT_VERIFY_MODE=advisory` সেট করুন শুধুমাত্র যখন আপনার ইচ্ছাকৃতভাবে হুক ব্লক না করে একটি ভাঙা গাছ থেকে সংকেত প্রয়োজন। `yarn knip` কে হার্ড গেটের বাইরে রাখুন যদি না রেপো স্পষ্টভাবে পরামর্শমূলক আমদানি/নির্ভরতার বিষয়ে ব্যর্থ হওয়ার সিদ্ধান্ত নেয়।

### সুতা ইনস্টল হুক

```bash
#!/bin/bash
# Run corepack yarn install when package.json is changed
# Hook receives JSON via stdin with file_path

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

আপনার এজেন্ট টুল ডক্স অনুযায়ী হুক ওয়্যারিং কনফিগার করুন (`hooks.json`, সমতুল্য, ইত্যাদি)।

এই রেপোতে, `.codex/hooks/*.sh` এবং `.cursor/hooks/*.sh` পাতলা মোড়ক হিসাবে থাকা উচিত যা `scripts/agent-hooks/` এর অধীনে শেয়ার করা বাস্তবায়নের জন্য প্রতিনিধিত্ব করে।
