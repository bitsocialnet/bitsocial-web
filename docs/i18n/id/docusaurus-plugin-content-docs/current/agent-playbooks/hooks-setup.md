# Hook agen

Hook siklus hidup yang di-commit hanya memformat berkas JavaScript/TypeScript yang berhasil disunting, melalui oxfmt yang terpasang. Logika bersamanya berada di `scripts/agent-hooks/format.mjs`; setiap pembungkus native mendelegasikan ke sana.

| Aplikasi | Konfigurasi native | Event |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude tidak membaca `.claude/hooks.json` yang berdiri sendiri. Setiap aplikasi tetap mengendalikan kepercayaan proyek dan apakah hook diaktifkan; periksa pengaturannya saat ini alih-alih melewati mekanisme kepercayaan itu. `.codex/config.toml` adalah konfigurasi repositori, bukan registri perintah hook.

Formatter memvalidasi event/payload, keberhasilan suntingan, ekstensi berkas, dan keberadaan berkas di dalam repositori, termasuk lewat symlink. Dependensi yang hilang atau masukan yang tidak relevan tidak memicu pekerjaan apa pun. Perintah memakai array argumen dengan akses jaringan Corepack dinonaktifkan; hook tidak memasang dependensi, tidak menjalankan build/review, dan tidak mengubah Git.

Jalankan pemeriksaan secara eksplisit sesuai [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Jalankan `yarn ai-workflow:sync`, `yarn ai-workflow:check`, dan `yarn ai-workflow:test` setelah mengubah alur kerja. Fixture memakai berkas sekali pakai dan pemanggilan formatter palsu; fixture tidak membuktikan bahwa setiap aplikasi benar-benar memuat konfigurasinya. Muat ulang dan periksa katalog aplikasi setelah upgrade.

Skill desain Impeccable beserta helper yang dapat dieksekusinya tetap tersedia sesuai kebutuhan di bawah `.agents/skills/impeccable`. Hook Codex-nya yang lama menunjuk ke direktori yang tidak ada; alur kerja desain kini berjalan ketika skill-nya dipilih, tanpa hook desain yang selalu aktif. Skill tersebut tidak boleh mengonfigurasi ulang hook proyek sebagai langkah desain sampingan.
