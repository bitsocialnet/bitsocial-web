# Pengaturan Agen Hooks

Jika asisten pengkodean AI Anda mendukung kait siklus hidup, konfigurasikan ini untuk repo ini.

## Kait yang Direkomendasikan

| Kait            | Memerintah                                 | Tujuan                                                                                                                                                                                                   |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Format file secara otomatis setelah pengeditan AI                                                                                                                                                        |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Jalankan `corepack yarn install` ketika `package.json` berubah                                                                                                                                           |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Pangkas referensi lama dan hapus cabang tugas sementara yang terintegrasi                                                                                                                                |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Pemeriksaan pembuatan hard-gate, lint, typecheck, dan format; simpan `yarn npm audit` informasional dan jalankan `yarn knip` secara terpisah sebagai audit penasehat ketika ketergantungan/impor berubah |

## Mengapa

- Pemformatan yang konsisten
- Lockfile tetap sinkron
- Masalah build/lint/type diketahui lebih awal
- Visibilitas keamanan melalui `yarn npm audit`
- Penyimpangan ketergantungan/impor dapat diperiksa dengan `yarn knip` tanpa mengubahnya menjadi stop hook global yang berisik
- Satu implementasi hook bersama untuk Codex dan Cursor
- Cabang tugas sementara tetap selaras dengan alur kerja pohon kerja repo

## Contoh Skrip Kait

### Kait Format

```bash
#!/bin/bash
# Format otomatis file JS/TS setelah pengeditan AI
# Hook menerima JSON melalui stdin dengan file_path

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
# Jalankan build, lint, typecheck, format check, dan audit keamanan setelah agen selesai

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Secara default, `scripts/agent-hooks/verify.sh` keluar bukan nol ketika pemeriksaan yang diperlukan gagal. Setel `AGENT_VERIFY_MODE=advisory` hanya ketika Anda sengaja membutuhkan sinyal dari pohon yang patah tanpa menghalangi pengaitnya. Jauhkan `yarn knip` dari hard gate kecuali repo secara eksplisit memutuskan untuk gagal dalam masalah impor/ketergantungan.

### Kait Pemasangan Benang

```bash
#!/bin/bash
# Jalankan corepack Yarn install ketika package.json diubah
# Hook menerima JSON melalui stdin dengan file_path

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

Konfigurasikan pengkabelan kait sesuai dengan dokumen alat agen Anda (`hooks.json`, yang setara, dll.).

Dalam repo ini, `.codex/hooks/*.sh` dan `.cursor/hooks/*.sh` harus tetap sebagai pembungkus tipis yang mendelegasikan ke implementasi bersama di bawah `scripts/agent-hooks/`.
