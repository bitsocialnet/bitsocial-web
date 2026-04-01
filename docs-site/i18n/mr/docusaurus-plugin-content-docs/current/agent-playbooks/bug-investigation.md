# बग इन्व्हेस्टिगेशन वर्कफ्लो

विशिष्ट फाइल/लाइन/कोड ब्लॉकमध्ये बग नोंदवल्यावर याचा वापर करा.

## अनिवार्य पहिली पायरी

संपादन करण्यापूर्वी, संबंधित कोडसाठी गिट इतिहास तपासा. मागील योगदानकर्त्यांनी एज केस/वर्कअराउंडसाठी वर्तन सादर केले असावे.

## वर्कफ्लो

1. फाइल/क्षेत्रासाठी अलीकडील कमिट शीर्षके (केवळ शीर्षके) स्कॅन करा:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. स्कोप केलेल्या भिन्नतेसह फक्त संबंधित कमिटची तपासणी करा:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. इतिहास समजून घेतल्यानंतर प्रक्रिया पुन्हा सुरू करा. संदर्भ.

## समस्यानिवारण नियम

अवरोधित केल्यावर, अलीकडील निराकरणे/वर्कअराउंड्ससाठी वेब शोधा.
