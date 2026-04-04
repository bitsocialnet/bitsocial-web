# Keterampilan dan Alat

Gunakan pedoman ini saat menyiapkan/menyesuaikan keterampilan dan peralatan eksternal.

## Keterampilan yang Direkomendasikan

### Context7 (dokumen perpustakaan)

Untuk dokumen terkini tentang perpustakaan.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### CLI penulis naskah drama

Gunakan `playwright-cli` untuk otomatisasi browser (navigasi, interaksi, tangkapan layar, pengujian, ekstraksi).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Lokasi pemasangan keterampilan:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Praktik Terbaik Vercel React

Untuk panduan performa React/Next yang lebih mendalam.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Temukan Keterampilan

Temukan/instal keterampilan dari ekosistem terbuka.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Alasan Kebijakan MCP

Hindari GitHub MCP dan server MCP browser untuk proyek ini karena keduanya menambah overhead skema alat/konteks secara signifikan.

- Operasi GitHub: gunakan `gh` CLI.
- Pengoperasian browser: gunakan `playwright-cli`.
