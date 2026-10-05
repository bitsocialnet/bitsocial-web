# Skill dan Alat

Skill bersama berada di `.agents/skills/`. Sunting sumber-sumber ini, lalu jalankan `yarn ai-workflow:sync` untuk menghasilkan `.claude/skills/` bagi Claude Code. Codex dan Cursor menemukan `.agents/skills/` secara langsung; jangan pulihkan root duplikat `.codex/skills/` atau `.cursor/skills/`.

Prompt peran bersama berada di `.agents/roles/*.md`. Ini adalah format sumber khusus repositori ini, bukan jalur penemuan agen native. `scripts/ai-workflow-files.mjs` mengonversi sumber-sumber ini menjadi berkas khusus aplikasi yang tercantum di bawah; `yarn ai-workflow:sync` yang menuliskannya. Commit berkas hasil generate bersama sumbernya agar checkout baru sudah memiliki konfigurasi native tanpa harus menjalankan generator terlebih dahulu. Setelah menghapus sebuah sumber, hapus keluaran hasil generate-nya yang usang secara eksplisit; validator melaporkannya alih-alih menghapus berkas secara diam-diam.

## Jalur penemuan native

Diverifikasi terhadap dokumentasi resmi pada 2026-09-12:

| Aplikasi    | Instruksi proyek                                                                         | Skill yang dipakai repositori ini               | Agen kustom yang dipakai repositori ini    |
| ----------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| Codex       | `AGENTS.md`                                                                              | `.agents/skills/<name>/SKILL.md`                | `.codex/agents/<name>.toml` hasil generate |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` tetap tersedia untuk aturan kondisional khusus Cursor | `.agents/skills/<name>/SKILL.md`                | `.cursor/agents/<name>.md` hasil generate  |
| Claude Code | `CLAUDE.md` mengimpor `@AGENTS.md`                                                       | `.claude/skills/<name>/SKILL.md` hasil generate | `.claude/agents/<name>.md` hasil generate  |

Sumber: [Skill Codex](https://learn.chatgpt.com/docs/build-skills), [Subagen Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Aturan Cursor](https://cursor.com/docs/rules), [Skill Cursor](https://cursor.com/docs/skills), [Subagen Cursor](https://cursor.com/docs/subagents), [Memori Claude](https://code.claude.com/docs/en/memory), [Skill Claude](https://code.claude.com/docs/en/skills), [Subagen Claude](https://code.claude.com/docs/en/sub-agents).

Jangan mengganti direktori agen native dengan `.agents/roles` atau mengasumsikan Claude menemukan `.agents/skills`. Claude tetap bisa membaca berkas yang dirujuk di sana sebagai konteks proyek biasa. Cursor juga menemukan `.claude/skills` demi kompatibilitas; salinan-salinannya tetap tersinkron, tetapi panduan skill yang diterbitkan Cursor tidak menjelaskan deduplikasi di antara root-root tersebut. Periksa katalog skill di aplikasi yang terpasang alih-alih menjanjikan bahwa entri duplikat tidak mungkin muncul.

Direktori AI memakai akhir baris LF melalui `.gitattributes` agar teks hasil generate tetap identik di semua platform. Aset pendukung skill disalin byte demi byte.

## Skill

| Skill                                | Tujuan                                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `commit`                             | Membuat commit lokal yang diizinkan dan sesuai cakupan                                               |
| `commit-format`, `issue-format`      | Memformat saran ketika diminta                                                                       |
| `make-closed-issue`                  | Membuat issue, commit sesuai cakupan, dan PR yang diizinkan                                          |
| `review-and-merge-pr`                | Memilah masukan PR; memperbaiki/memublikasikan/merge hanya dalam cakupan yang diminta                |
| `fix-merge-conflicts`                | Menyelesaikan konflik dan memverifikasi hasil merge                                                  |
| `release`                            | Menyiapkan teks rilis dan menjalankan langkah rilis yang diizinkan                                   |
| `code-quality-review`                | Meninjau diff yang tidak sepele atau masalah kualitas yang diminta secara eksplisit                  |
| `retro`                              | Mengubah kesalahan yang terbukti menjadi pemeriksaan atau panduan terfokus yang mencegahnya terulang |
| `refactor-pass`, `deslop`            | Pembersihan atas permintaan pada perubahan yang sudah ada                                            |
| `debug-agent`                        | Debugging berbasis bukti, dengan instrumentasi bila diperlukan                                       |
| `you-might-not-need-an-effect`       | Tinjauan effect/memo yang terfokus                                                                   |
| `vercel-react-best-practices`        | Panduan performa React yang berlaku; lewati aturan Next.js/khusus server untuk klien Vite ini        |
| `translate`                          | Menghasilkan terjemahan, lalu menerapkan peta melalui satu penulis                                   |
| `playwright-cli`, `inspect-elements` | Verifikasi browser dan pemetaan DOM ke kode sumber                                                   |
| `profile-browsing`                   | Profiling browser dan React sesuai cakupan                                                           |
| `test-apk`                           | Memverifikasi pembungkus Android pendamping yang diberikan                                           |
| `impeccable`, `improve-threejs`      | Desain antarmuka sesuai cakupan dan tinjauan rendering Three.js                                      |
| `implement-plan`                     | Menjalankan rencana dengan delegasi terbatas yang opsional                                           |
| `readme`                             | Memelihara dokumentasi proyek yang terverifikasi                                                     |
| `context7`                           | Mengambil dokumentasi pustaka yang sesuai versi                                                      |
| `find-skills`                        | Menemukan skill tambahan ketika diminta secara eksplisit                                             |

## Peran dan model

Pertahankan peran kustom untuk `browser-check`, `profiler`, `test-apk`, `translator`, dan `reviewer`. Gunakan peran worker/general-purpose atau explorer bawaan harness untuk implementasi biasa dan penelusuran kode. Agen induk menetapkan kriteria penerimaan dan kepemilikan; satu pemilik menjalankan pemeriksaan berat.

Berkas agen Codex mencakup `name`, `description`, dan `developer_instructions`. `.codex/config.toml` membatasi agen anak yang berjalan bersamaan hingga empat menggunakan `max_concurrent_threads_per_session`. Metadata peran bersama berisi nama, deskripsi, dan mode sandbox opsional; metadata itu sengaja tidak memiliki field model.

Jangan cantumkan field model dan reasoning di skill dan agen kustom yang di-commit, di ketiga aplikasi. Dengan begitu, pilihan saat pemanggilan runtime, default pengguna, dan pewarisan dari induk berlaku sesuai urutan prioritas yang didokumentasikan masing-masing aplikasi. Alias keluarga Claude mengurangi pemeliharaan versi tetapi tetap memilih sebuah keluarga; model Cursor yang berversi memerlukan pembaruan di kemudian hari. Simpan pilihan semacam itu di pengaturan pengguna/sesi bila diperlukan. Pewarisan tidak menjanjikan pemilihan otomatis model terbaik saat ini. Jangan mengarang alias `latest` atau menambahkan riset katalog model ke tugas rutin. Lihat [pemilihan model di Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [pemilihan model di Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model), dan [pemilihan model di Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` dipetakan ke sandbox Codex dan `readonly` Cursor; daftar alat Claude dan instruksi peran membatasi alur kerja tinjauannya, tetapi akses Bash bukanlah sandbox tingkat OS.

Frontmatter skill bersama memakai `disable-model-invocation: true` untuk alur kerja yang dipanggil pengguna bila berlaku. Pengaturan padanannya di Codex ada di `agents/openai.yaml` sebagai `policy.allow_implicit_invocation: false`; validator mewajibkan keduanya. Metadata pemanggilan melengkapi aturan otorisasi eksplisit; permintaan tinjauan tidak pernah mengizinkan publikasi hanya karena sebuah skill memuat langkah publikasi.

## Pemeriksaan dan penemuan

- `yarn ai-workflow:sync` meregenerasi keluaran kompatibilitas memakai `js-yaml` dan `smol-toml` yang terpasang.
- `yarn ai-workflow:check` mengurai sumber/frontmatter/konfigurasi, memeriksa keluaran hasil generate, metadata pemanggilan, penempatan field model, dan penyambungan hook yang hanya untuk formatter. Perintah ini tidak mencocokkan pengenal model dengan katalog penyedia.
- `yarn ai-workflow:test` menjalankan fixture Node yang terisolasi untuk payload hook serta pembuatan/validasi alur kerja.
- Setelah meng-upgrade aplikasi agen, verifikasi penemuan skill/peran di aplikasi tersebut. Pemeriksaan sintaks/paritas tidak menggantikan pemeriksaan loader. Muat ulang aplikasi jika sesi yang ada masih menyimpan katalog lama.
- Hook memerlukan kepercayaan proyek dan peninjauan hook dari harness; jangan melewati mekanisme kepercayaan demi membuat pemeriksaan lolos. Lihat [hooks-setup.md](hooks-setup.md).

## Memelihara instruksi yang berguna

Ikuti [panduan skill dan prompt dari OpenAI](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (ditinjau 2026-09-12): jaga deskripsi tetap presisi, muat detail hanya ketika relevan, dan pertahankan cakupan yang diminta pengguna. Skill bersama melayani model yang berbeda-beda; pertahankan invarian khusus proyek sambil memberi keleluasaan untuk pilihan implementasi rutin.

Simpan tujuan, batas keputusan, dan batasan penting sebuah skill di `SKILL.md`. Tautkan perintah atau contoh khusus mode yang substansial sebagai referensi opsional. Letakkan kondisi pemicu di awal deskripsi yang pendek; kata kunci yang cocok saja tidak boleh memperluas tugas. Pertahankan metadata pemanggilan yang ada kecuali perilakunya memang sengaja diubah.

Setelah perubahan instruksi yang substansial, uji beberapa permintaan kecil dan besar yang representatif. Periksa skill/referensi mana yang dipilih, apakah tindakan tetap dalam cakupan, apakah verifikasi sesuai dengan perubahan, dan apakah pekerjaan yang diizinkan benar-benar selesai. Uji skema dan fixture membuktikan kebenaran perkakas, bukan kualitas keputusan agen.

## Alat dan kepemilikan browser

Utamakan katalog skill/alat yang ada dan CLI proyek yang terpasang. Gunakan `gh` untuk GitHub, `playwright-cli` untuk verifikasi browser, serta dokumentasi resmi/khusus versi ketika perilaku pustaka berpengaruh. Hindari memasang skill duplikat atau mengambil paket yang versinya tidak dipatok hanya untuk menjalankan formatter yang sudah ada.

Overhead MCP bergantung pada harness: pemuatan alat yang ditunda dapat menghindari pemuatan setiap skema di awal. Pertahankan integrasi yang relevan alih-alih menganggap MCP itu sendiri sudah usang. Pilihan CLI yang ada tetap berguna untuk reprodusibilitas dan pengendalian sumber daya.

Semua sesi browser memakai `./scripts/pw-session.sh`, yang memberlakukan satu browser aktif di seluruh mesin. Secara bawaan, gunakan sesi baru yang terisolasi. Akses ke browser pribadi yang sedang dipakai memerlukan otorisasi eksplisit; pakai ulang otorisasi itu pada langkah-langkah berikutnya. Pilih browser/viewport sesuai perilaku yang terdampak, jalankan engine yang dipilih secara berurutan, tutup sesi bernama yang persis saat pembersihan, dan jangan pernah memakai `close-all`/`kill-all`. Lihat skill `playwright-cli` dan [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
