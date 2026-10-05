# Kejutan yang Sudah Diketahui

Berkas ini mencatat titik-titik kebingungan khas repositori ini yang pernah membuat agen keliru.

## Kriteria Entri

Tambahkan entri hanya jika semua hal berikut terpenuhi:

- Hal itu spesifik untuk repositori ini (bukan saran umum).
- Hal itu berpeluang terulang pada agen berikutnya.
- Ada mitigasi konkret yang bisa diikuti.

Jika ragu, tanyakan dulu kepada developer sebelum menambahkan entri.

## Templat Entri

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entri

### Domain produksi aplikasi Vercel bisa kembali menyajikan deployment master dari Git

- **Tanggal:** 2026-04-28
- **Diamati oleh:** Tommaso + Codex
- **Konteks:** Memverifikasi mirror aplikasi Seedit dan 5chan di direktori aplikasi Bitsocial Web.
- **Yang mengejutkan:** Proyek Vercel `seedit` dan `5chan` memiliki `gitProviderOptions.createDeployments = "enabled"`, sehingga push ke `master` di GitHub dipromosikan ke domain produksi padahal kebijakan repo mengharapkan mirror aplikasi produksi hanya menyajikan artefak rilis.
- **Dampak:** Badge mirror terverifikasi di direktori aplikasi bisa menjadi tidak benar karena domain produksi menyajikan commit pengembangan terbaru, bukan ZIP rilis GitHub yang hash `index.html`-nya tercatat di `about/src/lib/apps-data.ts`.
- **Mitigasi:** Sebelum menambahkan atau menyegarkan metadata verifikasi mirror, periksa proyek Vercel dengan `vercel api /v9/projects/<project-id>` dan pastikan `gitProviderOptions.createDeployments = "disabled"`. Deploy isi ZIP rilis dengan `vercel deploy --prebuilt --prod` dan gunakan `seedit-omega.vercel.app` atau `5chan-omega.vercel.app` untuk deployment pengembangan.
- **Status:** confirmed

### Portless 0.11 memakai ulang state proxy lama kecuali launcher memaksa HTTPS

- **Tanggal:** 2026-04-28
- **Diamati oleh:** Tommaso + Codex
- **Konteks:** Memindahkan alur `yarn start` biasa dari URL proxy lama `http://bitsocial.localhost:1355` ke `https://bitsocial.localhost`.
- **Yang mengejutkan:** Meski `portless@0.11.1` sudah terpasang, Portless tetap memakai ulang proxy HTTP `~/.portless/proxy.port = 1355` yang sudah ada dan mencetak URL lama `:1355`.
- **Dampak:** Memperbarui versi paket dan dokumentasi saja tidak cukup; `yarn start` masih bisa mengumumkan dan memakai URL lama ketika seorang kontributor punya state Portless lama yang masih berjalan.
- **Mitigasi:** Pastikan skrip start secara eksplisit menyalakan proxy HTTPS Portless di port `443` sebelum mendaftarkan rute aplikasi, agar alur runtime berpindah dari state `1355` yang tersimpan alih-alih mewarisinya.
- **Status:** confirmed

### Portless mengubah URL aplikasi lokal yang kanonis

- **Tanggal:** 2026-03-18
- **Diamati oleh:** Codex
- **Konteks:** Verifikasi browser dan alur smoke test
- **Yang mengejutkan:** URL lokal bawaan bukanlah port Vite yang biasa. Repo mengharapkan `https://bitsocial.localhost` melalui Portless, jadi memeriksa `localhost:3000` atau `localhost:5173` bisa mengenai aplikasi yang salah atau tidak mengenai apa pun.
- **Dampak:** Pemeriksaan browser bisa gagal atau memvalidasi target yang salah meski server dev sehat-sehat saja.
- **Mitigasi:** Pakai `https://bitsocial.localhost` lebih dulu. Lewati hanya dengan `PORTLESS=0 corepack yarn start` ketika Anda memang butuh port Vite langsung.
- **Status:** confirmed

### Hook Commitizen memblokir commit non-interaktif

- **Tanggal:** 2026-03-18
- **Diamati oleh:** Codex
- **Konteks:** Alur kerja commit yang dijalankan agen
- **Yang mengejutkan:** `git commit` memicu Commitizen lewat Husky dan menunggu masukan TTY interaktif, sehingga shell agen yang non-interaktif menggantung.
- **Dampak:** Agen bisa terhenti tanpa batas waktu pada proses yang seharusnya berupa commit biasa.
- **Mitigasi:** Gunakan `git commit --no-verify -m "message"` untuk commit yang dibuat agen. Manusia tetap bisa memakai `corepack yarn commit` atau `corepack yarn exec cz`.
- **Status:** confirmed

### Corepack wajib dipakai agar tidak terjatuh ke Yarn classic

- **Tanggal:** 2026-03-19
- **Diamati oleh:** Codex
- **Konteks:** Migrasi package manager ke Yarn 4
- **Yang mengejutkan:** Mesin ini masih punya instalasi global Yarn classic di `PATH`, sehingga menjalankan `yarn` polos bisa mengarah ke v1 alih-alih versi Yarn 4 yang dipatok.
- **Dampak:** Developer bisa tanpa sengaja melewati patokan package manager repo lalu mendapat perilaku instalasi atau keluaran lockfile yang berbeda.
- **Mitigasi:** Gunakan `corepack yarn ...` untuk perintah shell, atau jalankan `corepack enable` lebih dulu supaya `yarn` polos mengarah ke versi Yarn 4 yang dipatok.
- **Status:** confirmed

### Nama aplikasi Portless yang tetap saling bentrok antar-worktree Bitsocial Web

- **Tanggal:** 2026-03-30
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` di satu worktree Bitsocial Web sementara worktree lain sudah menyajikan lewat Portless
- **Yang mengejutkan:** Memakai nama aplikasi Portless harfiah `bitsocial` di setiap worktree membuat rutenya sendiri bentrok, bahkan ketika port pendukungnya berbeda, sehingga proses kedua gagal karena `bitsocial.localhost` sudah terdaftar.
- **Dampak:** Branch Bitsocial Web yang berjalan paralel bisa saling memblokir padahal Portless justru dimaksudkan agar keduanya bisa hidup berdampingan dengan aman.
- **Mitigasi:** Biarkan startup Portless tetap ditangani `scripts/start-dev.mjs`, yang kini memakai rute `*.bitsocial.localhost` bercakupan branch di luar kasus kanonis dan jatuh ke rute bercakupan branch ketika nama polos `bitsocial.localhost` sudah dipakai.
- **Status:** confirmed

### Pratinjau dokumentasi dulu memakai port 3001 secara hard-code

- **Tanggal:** 2026-03-30
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` berdampingan dengan repo dan agen lokal lainnya
- **Yang mengejutkan:** Perintah dev di root menjalankan workspace dokumentasi dengan `docusaurus start --port 3001`, sehingga seluruh sesi dev gagal setiap kali proses lain sudah memakai `3001`, walaupun aplikasi utamanya sudah memakai Portless.
- **Dampak:** `yarn start` bisa mematikan proses web tepat setelah proses itu menyala, mengganggu pekerjaan lokal yang tidak berhubungan hanya karena bentrokan port dokumentasi.
- **Mitigasi:** Biarkan startup dokumentasi tetap ditangani `yarn start:docs`, yang kini memakai Portless plus `scripts/start-docs.mjs` untuk menghormati port bebas yang disuntikkan atau jatuh ke port bebas berikutnya ketika dijalankan langsung.
- **Status:** confirmed

### Hostname Portless untuk dokumentasi dulu ditulis hard-code

- **Tanggal:** 2026-04-03
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` di worktree Bitsocial Web sekunder sementara worktree lain sudah menyajikan dokumentasi lewat Portless
- **Yang mengejutkan:** `start:docs` masih mendaftarkan hostname harfiah `docs.bitsocial.localhost`, sehingga `yarn start` bisa gagal padahal aplikasi about sudah tahu cara menghindari bentrokan rute Portless untuk hostname-nya sendiri.
- **Dampak:** Worktree paralel tidak bisa memakai perintah dev di root dengan andal karena proses dokumentasi keluar lebih dulu lalu `concurrently` mematikan sisa sesinya.
- **Mitigasi:** Biarkan startup dokumentasi tetap ditangani `scripts/start-docs.mjs`, yang kini menurunkan hostname Portless bercakupan branch yang sama seperti aplikasi about dan menyuntikkan URL publik bersama itu ke target proxy dev `/docs`.
- **Status:** confirmed

### Shell di worktree bisa melewatkan versi Node yang dipatok repo

- **Tanggal:** 2026-04-03
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` di worktree Git seperti `.claude/worktrees/*` atau checkout worktree bersaudara
- **Yang mengejutkan:** Sebagian shell worktree mengarahkan `node` dan `yarn node` ke Node Homebrew `25.2.1` padahal repo mematok `22.12.0` di `.nvmrc`, sehingga `yarn start` bisa diam-diam menjalankan launcher dev di runtime yang salah.
- **Dampak:** Perilaku server dev bisa menyimpang antara checkout utama dan worktree, membuat bug sulit direproduksi sekaligus melanggar toolchain Node 22 yang diharapkan repo.
- **Mitigasi:** Biarkan launcher dev tetap ditangani `scripts/start-dev.mjs` dan `scripts/start-docs.mjs`, yang kini mengeksekusi ulang dirinya di bawah biner Node dari `.nvmrc` ketika shell saat ini berada di versi yang salah. Penyiapan shell tetap sebaiknya memakai `nvm use`.
- **Status:** confirmed

### Sisa `docs-site/` bisa menyembunyikan sumber dokumentasi yang hilang setelah refaktor

- **Tanggal:** 2026-04-01
- **Diamati oleh:** Codex
- **Konteks:** Pembersihan monorepo pascamerge setelah memindahkan proyek Docusaurus dari `docs-site/` ke `docs/`
- **Yang mengejutkan:** Folder lama `docs-site/` bisa tertinggal di disk berisi berkas usang tetapi penting seperti `i18n/`, bahkan setelah repo terlacak pindah ke `docs/`. Hal itu membuat refaktornya tampak terduplikasi secara lokal dan bisa menutupi fakta bahwa terjemahan dokumentasi yang terlacak sebenarnya belum dipindahkan ke `docs/`.
- **Dampak:** Agen bisa menghapus folder lama itu sebagai “sampah” lalu tanpa sengaja kehilangan satu-satunya salinan lokal terjemahan dokumentasi, atau terus menyunting skrip yang masih menunjuk ke jalur mati `docs-site/`.
- **Mitigasi:** Perlakukan `docs/` sebagai satu-satunya proyek dokumentasi yang kanonis. Sebelum menghapus sisa `docs-site/` lokal mana pun, pulihkan sumber terlacak seperti `docs/i18n/` dan perbarui skrip serta hook agar berhenti mengacu ke `docs-site`.
- **Status:** confirmed

### Pratinjau dokumentasi multilokal bisa melonjakkan pemakaian RAM saat verifikasi

- **Tanggal:** 2026-04-01
- **Diamati oleh:** Codex
- **Konteks:** Memperbaiki i18n dokumentasi, perutean locale, dan perilaku Pagefind dengan `yarn start:docs` plus Playwright
- **Yang mengejutkan:** Mode pratinjau dokumentasi bawaan kini melakukan build dokumentasi multilokal penuh plus pengindeksan Pagefind sebelum menyajikan, dan membiarkan proses itu tetap hidup berdampingan dengan beberapa sesi Playwright atau Chrome bisa menghabiskan RAM jauh lebih banyak daripada loop dev Vite biasa atau Docusaurus satu locale.
- **Dampak:** Mesin bisa kehabisan memori, sesi browser bisa crash, dan proses yang terputus bisa meninggalkan server dokumentasi atau browser headless usang yang terus memakan memori.
- **Mitigasi:** Untuk pekerjaan dokumentasi yang tidak memerlukan verifikasi rute locale atau Pagefind, utamakan `DOCS_START_MODE=live yarn start:docs`. Pakai pratinjau multilokal bawaan hanya ketika Anda perlu memvalidasi rute terjemahan atau Pagefind. Jaga hanya ada satu sesi Playwright, tutup sesi browser lama sebelum membuka yang baru, dan hentikan server dokumentasi setelah verifikasi jika sudah tidak diperlukan.
- **Status:** confirmed

### `translate-docs.py` bisa meninggalkan locale dokumentasi setengah diterjemahkan atau dengan target tautan rusak

- **Tanggal:** 2026-04-06
- **Diamati oleh:** Codex
- **Konteks:** Memperbaiki rute dan konten dokumentasi terlokalkan setelah `yarn start:docs` menyajikan halaman detail berbahasa Inggris atau gagal membangun keluaran locale
- **Yang mengejutkan:** Pipeline terjemahan dokumentasi punya dua mode kegagalan khas repo sekaligus: `scripts/translate-docs.py` hanya mengekstrak sebagian kecil pesan `DocsHome` ketika panggilan `tr(...)` memakai bentuk yang tidak bisa diuraikannya, dan markdown terjemahan di bawah `docs/i18n/**` bisa memuat slug hasil terjemahan mesin atau artefak `ZXQPLACEHOLDER` di dalam target tautan.
- **Dampak:** Beranda terlokalkan bisa diam-diam jatuh ke bahasa Inggris, halaman detail terlokalkan bisa tampak tidak diterjemahkan, dan `yarn docs:build` penuh bisa gagal karena tautan locale rusak padahal dokumentasi sumbernya valid.
- **Mitigasi:** Setelah mengubah terjemahan dokumentasi atau meregenerasi berkas locale, selalu jalankan `yarn docs:build` dari root repo, telusuri markdown di `docs/i18n/**` untuk mencari `ZXQPLACEHOLDER`, dan pastikan tautan terjemahan masih menunjuk ke slug dokumen kanonis seperti `/apps/5chan/` alih-alih jalur URL yang diterjemahkan. Jika teks `DocsHome` berubah, konfirmasi bahwa `scripts/translate-docs.py` masih mengekstrak seluruh pesan `docs.home.*`.
- **Status:** confirmed

### Pemeriksaan tanpa-JS situs about harus memakai rute Portless, bukan pratinjau SSR yang berdiri sendiri

- **Tanggal:** 2026-04-12
- **Diamati oleh:** Codex
- **Konteks:** Memverifikasi dukungan tanpa-JS untuk situs `about/` dari sebuah worktree branch
- **Yang mengejutkan:** Pratinjau SSR yang berdiri sendiri bisa terlihat sehat padahal rute Portless bercakupan branch yang sebenarnya masih menyajikan shell aplikasi yang salah atau proses yang lebih lama. Di repo ini, kontrak lokal yang sesungguhnya adalah hostname Portless dari `yarn start`, bukan server pratinjau dadakan.
- **Dampak:** Agen bisa keliru menyatakan dukungan tanpa-JS berfungsi, atau melewatkan regresi yang hanya muncul di `*.bitsocial.localhost`.
- **Mitigasi:** Untuk verifikasi browser `about/`, selalu nyalakan server lokal yang sebenarnya dengan `yarn start` atau `yarn start:about` lalu uji URL Portless bercakupan branch lebih dulu. Jika sebuah hostname Portless tampak basi, periksa dan hentikan proses lama sebelum menguji ulang.
- **Status:** confirmed

### `chain/` tidak terlihat oleh `yarn build:verify` dan `yarn doctor`

- **Tanggal:** 2026-07-05
- **Diamati oleh:** Codex
- **Konteks:** Memverifikasi diff yang hanya menyentuh chain/ setelah workspace `chain/` (aplikasi Vite mandiri untuk `chain.bitsocial.net`) ditambahkan ke monorepo.
- **Yang mengejutkan:** `scripts/verify-build.mjs` hanya mengenali prefiks jalur `about/`, `docs/`, dan `stats/`, sehingga diff yang hanya menyentuh chain/ mencetak "No targeted build checks matched the current diff" dan sama sekali tidak menjalankan build, padahal `build:chain` sudah ada di `package.json` root. Terpisah dari itu, `yarn doctor` di-hard-code ke `react-doctor about -y`, jadi perubahan React di bawah `chain/src` sama sekali tidak tercakup React Doctor.
- **Dampak:** Agen yang memverifikasi perubahan chain harus tahu untuk memanggil `yarn build:chain` langsung alih-alih memercayai `yarn build:verify`, dan masalah React di `chain/src` (effect, hook, kode mati) lolos tanpa terdeteksi `yarn doctor`.
- **Mitigasi:** `scripts/verify-build.mjs` kini punya cabang `chain/` yang mencerminkan cabang `about/`, dan `doctor` / `doctor:verbose` kini menjalankan `react-doctor --project about,chain -y` dalam satu panggilan. `doctor:score` tetap khusus `about` karena `--score` diam-diam tidak mencetak apa pun bila digabung dengan `--project` untuk lebih dari satu proyek; gunakan `yarn react-doctor --project about,chain --verbose -y` (atau `--json`) jika skor untuk chain dibutuhkan.
- **Status:** confirmed

### P2P di browser berjalan di atas WebSockets aman; pkc-js menolak WebRTC dan WebTransport secara bawaan

- **Tanggal:** 2026-08-02
- **Diamati oleh:** Claude
- **Konteks:** Menulis teks landing page dan dokumentasi tentang cara kerja P2P Bitsocial di browser
- **Yang mengejutkan:** `@pkcprotocol/pkc-js` menyertakan connection gater bawaan yang menolak dial WebRTC dan WebTransport di browser — `dist/browser/helia/dial-transport-filter.js` mengekspor `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Komentar pada sumbernya menyebut alasannya: di browser, transport tersebut menambah jalur pembentukan koneksi yang panjang dan kerap gagal (STUN/ICE, rotasi certhash) sehingga memperlambat pemuatan, sedangkan WebSocket bersifat langsung dan andal. Setiap peer aktif di panel status P2P blog menampilkan "Secure WebSocket". Gater itu berada di `node_modules`, jadi tidak ada apa pun di repo yang mengisyaratkannya.
- **Dampak:** Sangat mudah menulis teks publik yang terdengar masuk akal secara teknis tetapi keliru — misalnya mengklaim bahwa WebTransport mencapai Baseline browser pada Maret 2026 adalah yang memungkinkan P2P Bitsocial di browser. Klaim itu sempat terbit di landing page, tabel perbandingan, dan dua halaman dokumentasi sebelum developer menangkapnya. Klaim arsitektur yang salah di halaman publik akan diperiksa persis oleh audiens developer yang dibidik situs ini.
- **Mitigasi:** Jangan pernah menyimpulkan transport apa yang dipakai Bitsocial dari apa yang secara prinsip didukung libp2p atau platform browser. Periksa `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` untuk daftar penolakan terkini, pastikan tidak ada override `connectionGater` di bawah `about/src/`, dan baca label transport langsung di panel "P2P status" pada blog sebelum membuat klaim publik apa pun. Perubahan hulu yang benar-benar membuka jalan bagi publikasi dari browser adalah perbaikan seqno monotonik gossipsub di `@libp2p/gossipsub` 15.0.21 (Mei 2026); pkc-js saat ini menyertakan 16.0.4.
- **Status:** confirmed

### Tautan relatif `./page.md` dari halaman dokumentasi yang belum diterjemahkan merusak seluruh build terlokalkan

- **Tanggal:** 2026-08-02
- **Diamati oleh:** Claude
- **Konteks:** Menambahkan halaman baru khusus bahasa Inggris, `docs/browser-p2p.md`, yang menautkan ke dokumentasi yang sudah ada dengan `./peer-to-peer-protocol.md` dan `./apps/5chan.md`
- **Yang mengejutkan:** Setiap locale di bawah `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` mencerminkan pohon dokumentasi. Halaman baru yang tidak ada di cermin tersebut tetap dirender di setiap locale lewat fallback bahasa Inggris, tetapi tautan markdown relatifnya tidak lagi teratasi — Docusaurus memancarkan `/ar/browser-p2p/peer-to-peer-protocol.md/` dan menggagalkan build dengan "Docusaurus found broken links!". Yang krusial, `yarn build:verify` dan `yarn docs:build:verify` hanya membangun `en` dan lolos bersih; hanya `yarn docs:build` penuh yang memunculkannya, dan build itu berhenti pada locale pertama menurut abjad (`ar`).
- **Dampak:** Sebuah perubahan dokumentasi bisa lolos semua pemeriksaan lokal yang cepat namun tetap merusak build multilokal produksi. Kegagalannya juga tampak tidak berhubungan dengan perubahan tersebut, karena pesan errornya menyebut jalur locale yang tidak pernah disentuh penulisnya.
- **Mitigasi:** Pada halaman dokumentasi mana pun yang tidak dicerminkan ke `docs/i18n/**`, gunakan tautan relatif-root (`/peer-to-peer-protocol/`, `/apps/5chan/`) alih-alih tautan `.md` relatif; Docusaurus otomatis menambahkan awalan locale. `docs/build-your-own-client.md` adalah contoh yang sudah ada. Jalankan `yarn docs:build` penuh — bukan sekadar `build:verify` — sebelum menyerahkan perubahan apa pun yang menambahkan atau menautkan halaman dokumentasi.
- **Status:** confirmed

### Eksekusi `update-translations.js` yang bersamaan diam-diam menghilangkan key

- **Tanggal:** 2026-08-02
- **Diamati oleh:** Claude
- **Konteks:** Menerapkan 26 key i18next hasil terjemahan ke seluruh 36 locale lewat skill `translate`
- **Yang mengejutkan:** Setiap pemanggilan adalah operasi baca-ubah-tulis atas seluruh 36 berkas locale, sehingga dua pemanggilan yang berjalan bersamaan saling menimpa dan satu key lenyap tanpa error. Skill `translate` secara eksplisit menginstruksikan pemunculan hingga 4 subagen secara bersamaan, dan masing-masing akan memanggil skrip tersebut.
- **Dampak:** Gagal secara senyap: key hilang dari locale yang acak, dan diff-nya tetap terlihat wajar.
- **Mitigasi:** Jangan pernah membiarkan subagen penerjemah menulis berkas locale secara bersamaan — biarkan mereka hanya menghasilkan berkas JSON kamus, lalu terapkan setiap key secara berurutan dari agen induk. Setelah diterapkan, verifikasi secara terprogram bahwa setiap key ada di seluruh 35 locale non-Inggris dan bahwa tidak ada nilai yang identik byte-per-byte dengan sumber bahasa Inggrisnya.
- **Status:** confirmed
- **Pembaruan (2026-08-10):** Skrip ini dulu juga menentukan targetnya sebagai `path.join(process.cwd(), "public", "translations")`, sehingga perintah terdokumentasi dari root repo gagal dengan "Translations directory not found" dan harus dijalankan dari `about/`. Kini skrip menentukan workspace dari direktori saat ini atau dari lokasinya sendiri, sehingga berfungsi dari mana saja. Jebakan konkurensi di atas tidak berubah.

### Kontrol anotasi mode pengembangan bisa mencegat klik dari otomasi

- **Konteks:** Situs about dan chain memiliki kontrol tetap di pojok kanan bawah, tempat toolbar Agentation juga muncul dalam mode pengembangan.
- **Mitigasi:** `scripts/pw-session.sh open` mendaftarkan `window.__NO_DEV_TOOLBAR__ = true` sebelum memuat ulang halaman. Penginisialisasi Agentation juga menghormati `__VISUAL_TESTING__` dan `__PROFILING__`; inspeksi kode sumber tetap tersedia secara terpisah. Otomasi browser langsung harus menyetel flag yang sama sebelum memuat aplikasi.

### `skills add` memasang salinan Codex dan Cursor ke direktori `.agents/` yang di-gitignore

- **Tanggal:** 2026-08-18
- **Diamati oleh:** Tommaso + Claude
- **Konteks:** Memasang skill `improve-threejs` dari `millionco/react-doctor` dengan CLI `skills` (`vercel-labs/skills`).
- **Yang mengejutkan:** `npx skills add <repo> --skill <name> --agent codex` dan `--agent cursor` sama-sama menulis ke `.agents/skills/<name>/`, bukan ke `.codex/skills/` atau `.cursor/skills/`. `AGENTS.md` melarang direktori `.agents/` di tingkat repo dan `.gitignore:29` mengabaikannya, sehingga kedua salinan itu diam-diam tidak terlacak. Hanya `--agent claude-code` yang menulis ke `.claude/skills/` sesuai harapan. Terpisah dari itu, bentuk dipisah koma yang terdokumentasi (`--agent claude-code,codex,cursor`) gagal dengan "Invalid agents" dan tidak memasang apa pun, padahal tiap nama valid jika dipakai sendiri-sendiri.
- **Dampak:** Instalasi melaporkan keberhasilan padahal dua dari tiga salinan toolchain berakhir di tempat yang tidak akan pernah di-commit, sehingga Codex dan Cursor diam-diam tidak memiliki skill tersebut setelah clone baru. Bentuk koma juga bisa menghasilkan instalasi kosong yang tampak berhasil.
- **Mitigasi saat ini:** Repositori kini melacak `.agents/skills` sebagai sumber kanonisnya dan menghasilkan salinan Claude dengan `yarn ai-workflow:sync`. Larangan `.agents` sebelumnya beserta aturan ignore-nya telah dihapus. Jangan menyalin skill baru ke tiga root yang terpisah; periksa paritas hasil generate dan katalog aplikasi setelah menambahkan skill.
- **Status:** confirmed
