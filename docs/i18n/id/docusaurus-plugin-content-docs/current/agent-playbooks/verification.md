# Verifikasi

Pilih pemeriksaan berdasarkan perilaku yang berubah dan ketidakpastian yang tersisa. Pakai ulang bukti yang berhasil untuk keadaan akhir yang sama; jalankan ulang setelah ada suntingan atau kegagalan yang relevan. Persyaratan CI/rilis/pengguna yang eksplisit tetap berlaku.

| Perubahan                                               | Pemeriksaan yang sesuai                                                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Hanya prosa/komentar/pemformatan                        | Diff, referensi, generator yang relevan; tanpa build aplikasi                                                                  |
| Sumber/konfigurasi alur kerja AI                        | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; regenerasi indeks LLM ketika konteksnya berubah    |
| Helper atau skrip yang terisolasi                       | Pemanggilan/fixture yang terfokus serta pemeriksaan sintaks atau tipe/lint untuk kode yang terdampak                           |
| Perubahan runtime bersama, dependensi, build, integrasi | Pemeriksaan terfokus pada bagian yang terdampak ditambah pemeriksaan build/tipe/lint yang relevan di bawah ini                 |
| Hanya CSS/tema/tata letak                               | Rute/viewport/tema yang terdampak di browser terpilih; build ketika impor, aset, atau pemrosesan CSS berubah                   |
| State/effect/performa React                             | Perilaku yang terdampak dan panduan React yang berlaku; Doctor ketika diagnostiknya bisa menuntaskan kekhawatiran yang konkret |

## Pemeriksaan proyek

- `yarn build:verify` memilih workspace yang terdampak. Untuk cakupan yang sudah diketahui, gunakan `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor`, atau `yarn docs:build:verify`.
- `yarn build` memang sengaja menjalankan build produksi about/docs secara penuh, termasuk semua locale dokumentasi. Gunakan untuk validasi tingkat rilis atau perubahan yang memang membutuhkan cakupan sebesar itu.
- `yarn lint`, `yarn typecheck`, dan `yarn format:check` mencakup gerbang repositori yang sudah ada; untuk suntingan skrip yang sempit, jalankan dulu pemeriksaan sintaks/fixture/format yang terfokus pada skrip itu.
- Perubahan manifest/lock mewajibkan `corepack yarn install`, `yarn deps:check-pinned`, dan `yarn deps:check-hardened`. `yarn knip` hanya bersifat penasihat untuk dependensi/impor.
- Pemeriksaan terjemahan dokumentasi ada di [translations.md](translations.md); jangan jalankan penulis terjemahan massal untuk perubahan dokumentasi yang terfokus.

## Bukti browser dan kepemilikan

Gunakan Chrome untuk perubahan browser yang kecil dan terisolasi. Tambahkan Firefox dan WebKit untuk CSS/tata letak/responsivitas bersama, API yang sensitif terhadap browser, interaksi yang luas, rilis, atau kriteria lintas browser yang eksplisit. Sertakan tata letak mobile/perilaku sentuh yang terdampak. Mengubah ukuran viewport saja bukanlah emulasi sentuh. Pilih rute dan konten yang sebenarnya dari kode sumber alih-alih menganggap contoh pasti tersedia.

Gunakan `playwright-cli` melalui `./scripts/pw-session.sh`. Hanya satu browser yang aktif di seluruh mesin; engine yang dipilih berjalan berurutan dan setiap sesi milik sendiri ditutup secara persis, bahkan setelah terjadi kegagalan. Pakai ulang sesi milik pemanggil yang sudah diizinkan tanpa menutupnya. Jangan pernah memakai pembersihan browser global atau menghentikan server yang kepemilikannya tidak jelas. Pekerjaan yang hanya menyangkut dokumentasi tidak memerlukan browser/server.

Untuk pekerjaan performa, bandingkan alur yang sama dengan viewport, konten, pengaturan jaringan/CPU, mode build, dan overhead pengukuran yang setara. Bedakan pengamatan dari dugaan penyebab. Gunakan skill profile ketika pengukuran ini menjawab permintaan yang sebenarnya.

## Bukti akhir

Satu agen memegang verifikasi berat. Periksa beban kerja yang sedang aktif dan jalankan secara berurutan instalasi, build/rangkaian uji lengkap, Doctor, pekerjaan Android/Electron, dan profiling browser. Laporkan perintah/hasil serta keterbatasan yang spesifik; data yang hilang atau engine yang dilewati bukanlah hasil lulus. Fixture perkakas memverifikasi format dan mekanisme, bukan penemuan oleh aplikasi secara end-to-end atau kualitas keputusan model.

## Pemeriksaan React otomatis

`yarn agent:verify` menjalankan build yang dipilih, diikuti `yarn doctor:check` dan `yarn perf:check`. `perf:check` mencakup selftest kompatibilitas kolektor dan regresi yang disengaja, sehingga baik CI maupun jalur verifikasi agen tidak memerlukan putaran `perf:test` terpisah. Pasang perkakas browser yang dipatok sekali saja dengan `yarn perf:install` (`--with-deps` di CI Linux). Gunakan filter target/skenario untuk menjalankan ulang secara terfokus setelah putaran lengkap yang relevan. Anggaran skenario dinyatakan secara eksplisit di `scripts/react-perf/config.mjs`; simpan buktinya dan perbaiki regresi sebelum mempertimbangkan perubahan baseline yang beralasan. Build produksi biasa tidak menyertakan Bippy; perintah `build:profile:*` yang terpisah menyediakan instrumentasi profiling React resmi.

Skenario `apps-search` di about diberi tempo oleh nilai URL/input yang di-commit untuk setiap karakter. Hasil lulusnya mencakup urutan kueri yang di-commit itu, bukan responsivitas saat mengetik cepat. Gunakan reproduksi input cepat yang terpisah ketika menilai karakter yang hilang atau responsivitas input.
