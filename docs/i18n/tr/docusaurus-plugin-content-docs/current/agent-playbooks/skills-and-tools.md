# Beceriler ve Araçlar

Becerileri ve harici araçları ayarlarken/ayarlarken bu başucu kitabını kullanın.

## Önerilen Beceriler

### Context7 (kütüphane belgeleri)

Kütüphanelerdeki güncel dokümanlar için.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Oyun Yazarı CLI

Tarayıcı otomasyonu (gezinme, etkileşim, ekran görüntüleri, testler, çıkarma) için `playwright-cli` kullanın.

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Beceri yükleme konumları:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React'ın En İyi Uygulamaları

Daha derin React/Next performans rehberliği için.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Beceri Bul

Açık ekosistemdeki becerileri keşfedin/yükleyin.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP Politikasının Mantığı

Bu proje için GitHub MCP ve tarayıcı MCP sunucularından kaçının çünkü önemli miktarda araç şeması/bağlam yükü eklerler.

- GitHub işlemleri: `gh` CLI'yi kullanın.
- Tarayıcı işlemleri: `playwright-cli` kullanın.
