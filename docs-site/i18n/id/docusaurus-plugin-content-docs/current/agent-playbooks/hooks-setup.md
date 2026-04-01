# Pengaturan Agen Hooks

Jika asisten pengkodean AI Anda mendukung kait siklus hidup, konfigurasikan ini untuk repo ini.

## Kait yang Direkomendasikan

| Kait            | Perintah                                   | Tujuan                                                                                                                                                                                           |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Format file otomatis setelah pengeditan AI                                                                                                                                                       |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Jalankan `corepack yarn install` ketika `package.json` berubah                                                                                                                                   |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Pangkas referensi lama dan hapus cabang tugas sementara yang terintegrasi                                                                                                                        |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Pemeriksaan pembuatan hard-gate, lint, typecheck, dan format; simpan informasi `yarn npm audit` dan jalankan `yarn knip` secara terpisah sebagai audit penasehat ketika dependensi/impor berubah |

## Mengapa

- Pemformatan yang konsisten
- Lockfile tetap sinkron
- Masalah build/lint/type diketahui lebih awal
- Visibilitas keamanan melalui `yarn npm audit`
- Ketergantungan/penyimpangan impor dapat diperiksa dengan `yarn knip` tanpa mengubahnya menjadi global stop hook yang berisik
- Satu implementasi hook bersama untuk Codex dan Cursor
- Cabang tugas sementara tetap selaras dengan alur kerja pohon kerja repo

## Contoh Skrip Kait

### Kait Format

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

### Verifikasi Kait

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

Secara default, `scripts/agent-hooks/verify.sh` keluar bukan nol ketika pemeriksaan yang diperlukan gagal. Atur `AGENT_VERIFY_MODE=advisory` hanya ketika Anda sengaja membutuhkan sinyal dari pohon yang patah tanpa menghalangi pengait. Jauhkan `yarn knip` dari hard gate kecuali repo secara eksplisit memutuskan untuk gagal karena masalah impor/ketergantungan yang disarankan.

### Kait Pemasangan Benang

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

Konfigurasikan pengkabelan kait sesuai dengan dokumen alat agen Anda (`hooks.json`, setara, dll.).

Dalam repo ini, `.codex/hooks/*.sh` dan `.cursor/hooks/*.sh` harus tetap sebagai pembungkus tipis yang didelegasikan ke implementasi bersama di bawah `scripts/agent-hooks/`.
