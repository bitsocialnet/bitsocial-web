# দক্ষতা এবং সরঞ্জাম

দক্ষতা এবং বাহ্যিক টুলিং সেট আপ/সামঞ্জস্য করার সময় এই প্লেবুকটি ব্যবহার করুন।

## প্রস্তাবিত দক্ষতা

### প্রসঙ্গ7 (লাইব্রেরি ডক্স)

লাইব্রেরিতে আপ-টু-ডেট ডক্সের জন্য।

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### নাট্যকার সি.এল.আই

ব্রাউজার অটোমেশনের জন্য `playwright-cli` ব্যবহার করুন (নেভিগেশন, ইন্টারঅ্যাকশন, স্ক্রিনশট, পরীক্ষা, নিষ্কাশন)।

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

দক্ষতা ইনস্টল করার অবস্থান:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### ভার্সেল প্রতিক্রিয়া সর্বোত্তম অনুশীলন

গভীর প্রতিক্রিয়া/পরবর্তী কর্মক্ষমতা নির্দেশিকা জন্য.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### দক্ষতা খুঁজুন

ওপেন ইকোসিস্টেম থেকে দক্ষতা আবিষ্কার/ইনস্টল করুন।

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## এমসিপি নীতির যুক্তি

এই প্রকল্পের জন্য GitHub MCP এবং ব্রাউজার MCP সার্ভারগুলি এড়িয়ে চলুন কারণ তারা উল্লেখযোগ্য টুল-স্কিমা/প্রসঙ্গ ওভারহেড যোগ করে।

- GitHub অপারেশন: `gh` CLI ব্যবহার করুন।
- ব্রাউজার অপারেশন: `playwright-cli` ব্যবহার করুন।
