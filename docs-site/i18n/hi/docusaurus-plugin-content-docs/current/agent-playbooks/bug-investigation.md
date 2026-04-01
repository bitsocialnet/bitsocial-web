# बग जांच वर्कफ़्लो

किसी विशिष्ट फ़ाइल/लाइन/कोड ब्लॉक में बग रिपोर्ट होने पर इसका उपयोग करें।

## अनिवार्य पहला कदम

संपादन से पहले, प्रासंगिक कोड के लिए गिट इतिहास जांचें। पिछले योगदानकर्ताओं ने एज केस/वर्कअराउंड के लिए व्यवहार पेश किया होगा।

## कार्यप्रवाह

1. फ़ाइल/क्षेत्र के लिए हाल के प्रतिबद्ध शीर्षक (केवल शीर्षक) को स्कैन करें:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. स्कोप्ड अंतर के साथ केवल प्रासंगिक प्रतिबद्धताओं का निरीक्षण करें:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. इतिहास संदर्भ को समझने के बाद पुनरुत्पादन जारी रखें और ठीक करें।

## समस्या निवारण नियम

अवरुद्ध होने पर, हाल के सुधारों/समाधानों के लिए वेब पर खोजें।
