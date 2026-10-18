---
title: Bitsocial dan Quorum
description: Perbandingan Quorum, messenger grup terenkripsi end-to-end milik Quilibrium dengan Space bergaya Discord, dengan komunitas peer-to-peer publik Bitsocial.
---

# Bitsocial dan Quorum

[Quorum](https://www.quorummessenger.com/) adalah messenger grup yang dibuat oleh Quilibrium Inc. di
atas jaringan [Quilibrium](https://quilibrium.com/) miliknya. Quorum disusun seperti Discord, dengan
Space, kanal, peran, dan pesan langsung, dan pesannya terenkripsi end-to-end. Quorum muncul dalam
pembahasan bersama Bitsocial karena keduanya menyebut diri sebagai peer-to-peer dan tahan sensor,
dengan grup yang menetapkan aturannya sendiri. Namun tujuan keduanya berbeda: Quorum menyasar
obrolan grup privat, sedangkan Bitsocial menyasar komunitas publik yang bisa dibaca siapa pun.

Quilibrium menggambarkan dirinya sebagai alternatif terdesentralisasi bagi platform cloud: jaringan
node yang menyimpan data dalam hipergraf terenkripsi dan menyepakati statusnya melalui konsensus
yang disebutnya Proof of Meaningful Work. Node mendapatkan QUIL, token jaringan, yang dipakai untuk
membayar biaya penggunaan. Quorum bermula pada 2018 sebagai Howler, sebuah gagasan untuk alternatif
Discord yang privat, dan menjadi aplikasi pertama yang aktif di Quilibrium, menurut
[kisah Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc., yang
didirikan oleh Cassie Heart, mengembangkan protokol tersebut dan menawarkan Quorum sebagai salah satu
layanan terkelolanya ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Cara kerja Quorum

Rincian di bawah ini berasal dari kode sumber klien Quorum per Oktober 2026, yaitu
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) untuk aplikasi web dan desktop
serta [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile).

- **Identitas.** Identitas induk pengguna adalah set kunci Ed448, dan setiap perangkat mendapatkan
  kunci X448 dan Ed448 sendiri. Di browser, kunci-kunci itu dilindungi oleh kunci sandi (passkey).
  Alamat berupa hash yang diawali `Qm`, dan pengguna bisa menampilkan nama pengguna dari layanan nama
  Quilibrium.
- **Enkripsi.** Pesan langsung memakai Double Ratchet antarperangkat. Sebuah Space berbagi satu sesi
  Triple Ratchet di antara anggotanya, yang menandatangani pesan mereka dengan kunci khusus Space
  tersebut. Setiap Space terenkripsi, dan Quorum menyatakan bahwa mekanisme perantaraan pesannya
  mencegah layanan yang meneruskan pesan untuk menghubungkan pengirim dengan penerima.
- **Bergabung.** Space dimasuki melalui tautan undangan. Tautan sekali pakai membawa kunci untuk
  bergabung di dalam URL; tautan publik mengambil kunci itu dari layanan Quorum, dan Space publik
  bisa dicantumkan di direktori yang dapat dicari.
- **Transport.** Klien web, desktop, dan seluler semuanya terhubung melalui HTTPS dan WebSocket ke
  satu layanan,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Layanan ini meneruskan pesan terenkripsi ke kotak masuk setiap anggota, serta menyimpan registrasi
  pengguna, manifes terenkripsi setiap Space (kanal, peran, emoji), materi undangan, direktori
  publik, dan sinkronisasi pengaturan terenkripsi yang opsional. Perangkat lunak node Quilibrium
  memiliki layanan inbox dan hub dengan bentuk yang sama, tetapi baik klien maupun dokumentasi
  Quilibrium tidak menjelaskan bagaimana layanan ini dipetakan ke jaringan.
- **Riwayat.** Klien setiap anggota menyimpan salinan Space-nya sendiri di penyimpanan lokal. Klien
  web dan desktop melengkapi riwayat dengan meminta anggota yang sedang online untuk menyinkronkan;
  klien seluler memutar ulang log yang disimpan layanan untuk setiap Space, sehingga klien itu bisa
  mengejar ketertinggalan meskipun tidak ada anggota lain yang online.
- **Moderasi.** Peran memberikan hak untuk menghapus, menyematkan, membisukan, dan menyebut
  `@everyone`. Klien setiap anggota memeriksa tanda tangan pada setiap tindakan moderasi dan hanya
  menerapkannya jika penandatangan memegang peran yang tepat. Pemilik bisa mengeluarkan anggota, yang
  akan merotasi kunci Space sehingga anggota yang dikeluarkan tidak bisa membaca pesan baru. Sebuah
  Space bisa mewajibkan pesan bertanda tangan atau membiarkan anggota memposting pesan tanpa tanda
  tangan yang dapat disangkal.
- **Kode.** Klien web dan desktop dilisensikan di bawah AGPL-3.0, dan klien seluler di bawah
  GPL-3.0. Klien seluler juga memiliki dompet kripto, integrasi Farcaster, dan Apex, langganan
  berbayar yang dijelaskan di bawah.

## Letak perbedaannya

### Grup privat dan komunitas publik

Space Quorum adalah sekelompok anggota: hanya orang yang memegang kuncinya yang bisa membacanya, dan
bergabung memerlukan tautan undangan. Tautan publik memungkinkan siapa pun masuk, tetapi hanya
setelah bergabung. Komunitas Bitsocial tidak punya keanggotaan. Siapa pun bisa membacanya, dari
aplikasi apa pun, tanpa bergabung, dan siapa pun bisa mencoba memposting, dengan tunduk pada
tantangan komunitas tersebut.

### Apa yang membuat grup tetap online

Space Quorum tidak punya node host. Anggota mengirim pesan melalui layanan Quorum, klien setiap
anggota menyimpan salinan, dan pemilik tidak perlu online agar anggota lain bisa berbincang.
Komunitas Bitsocial tinggal di node pemiliknya, yang menerima atau menolak setiap postingan dan
memublikasikan status terbaru komunitas. Komunitas tetap bisa dibaca selama peer men-seed-nya,
tetapi tidak bisa menerima postingan baru selama node-nya offline. Lihat
[Protokol Peer-to-Peer](/peer-to-peer-protocol/).

### Siapa yang menegakkan aturan

Di Quorum, penegakan terjadi di tepi (edge). Klien setiap anggota memutuskan apakah akan menerapkan
penghapusan, penyematan, atau pembisuan, berdasarkan peran penandatangan, dan pengeluaran anggota
bekerja dengan memindahkan semua anggota lain ke kunci baru. Di Bitsocial, penegakan terjadi di node
komunitas: postingan yang gagal melewati tantangan atau aturan komunitas tidak pernah menjadi bagian
dari komunitas. Lihat [Moderasi Lokal, Bukan Larangan Global](/local-moderation/).

### Pengendalian spam

Quorum menjauhkan spam terutama melalui undangan. Tautan sekali pakai memasukkan satu orang, tautan
publik memasukkan siapa pun yang memegangnya, dan pemilik bisa mengeluarkan anggota dan mengganti
kunci sesudahnya; klien juga membatasi laju pengirimannya sendiri. Identitas Bitsocial adalah
pasangan kunci gratis, sehingga setiap komunitas memilih tantangan yang dijalankan sebelum menerima
postingan, seperti captcha, pembayaran, saldo token, atau allowlist. Lihat
[Tantangan Anti-Spam Khusus](/custom-challenges/).

### Klien dan jaringan

Aplikasi Quorum adalah klien dari layanan Quorum, yang dijalankan oleh Quilibrium Inc. Aplikasi itu
sendiri tidak bergabung ke jaringan peer-to-peer, sehingga akses ke sebuah Space bergantung pada satu
endpoint itu. Di baliknya, Quilibrium adalah jaringan tersendiri: pada Oktober 2026,
[explorer](https://dashboard.quilibrium.com/) miliknya menampilkan 114 peer yang dapat dijangkau dan
181 prover di 99 shard.

Aplikasi web Bitsocial bisa menjalankan node libp2p di dalam tab, mengambil konten komunitas dari
peer, dan memublikasikan melalui gossipsub. Penemuan peer berjalan melalui router HTTP yang hanya
mengembalikan alamat penyedia; siapa pun bisa menjalankannya, dan klien bisa berganti router dengan
mengubah konfigurasinya. Lihat [Peer-to-Peer di Browser](/browser-p2p/).

### Ekonomi

Token menjadi inti Quilibrium. QUIL ditambang oleh node dan dipakai untuk membayar biaya jaringan,
dan versi wrapped-nya, wQUIL, beredar di Ethereum. Quorum sendiri gratis dan tidak memerlukan
pembayaran atau nomor telepon. Langganan Apex opsionalnya berharga
[$5 per bulan](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
dibayar dengan wQUIL, SNAP, atau USDC di Ethereum dan dibagi antara Quilibrium Inc. dan empat Space
yang dipilih pelanggan. Bitsocial tidak punya lapisan pembayaran di protokolnya; sebuah komunitas
bisa mewajibkan pembayaran atau token melalui tantangannya.

### Pesan pribadi

Di sinilah Quorum lebih unggul. Pesan langsung dan pesan Space terenkripsi end-to-end dengan forward
secrecy, dan isi pesan hanya sampai ke layanan Quorum sebagai ciphertext. Bitsocial berfokus pada
komunitas publik dan belum punya pesan langsung bawaan. Postingan Bitsocial dienkripsi ke kunci node
komunitas selama berpindah melalui pubsub, tetapi setelah diterima, postingan itu bersifat publik.

## Status proyek

Pada Oktober 2026, repositori Quorum menyebut aplikasi webnya sebagai beta, dan situs web Quorum
masih mencantumkan aplikasi Google Play dan App Store sebagai segera hadir. Kedua klien juga
berbeda: aplikasi seluler memiliki fitur dompet, Farcaster, dan Apex, sedangkan klien web dan
desktop menampilkan halaman Wallet dan Farcaster-nya sebagai segera hadir, dan keduanya mengejar
riwayat Space dengan cara berbeda.

Mainnet Quilibrium mencapai versi 2.1 pada 30 September 2025, ketika jaringan kembali berjalan
setelah sempat terhenti ([pengumuman](https://x.com/QuilibriumInc/status/1973082817236984270)). Pada
2026, node ditulis ulang dalam Rust, dengan tanda tangan pascakuantum untuk konsensus dan protokol
wire yang tidak bisa dipakai oleh node versi lama. Sebagian dokumentasi menjelaskan rancangan
alih-alih kode yang berjalan: dokumentasi itu menjelaskan
[routing mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), tetapi pada
node 2.1.0.25 layanan mixnet berupa
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
yang menerima pesan tanpa mencampurnya.

## Perbandingan

| Pertanyaan              | Quorum                                                                                      | Bitsocial                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Kategori                | Messenger grup terenkripsi end-to-end di jaringan Quilibrium                                | Jaringan komunitas peer-to-peer                                                                             |
| Identitas               | Set kunci induk Ed448 plus kunci per perangkat, dilindungi kunci sandi                      | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                                         |
| Siapa yang bisa membaca | Anggota yang memegang kunci sebuah Space                                                    | Siapa pun, dari aplikasi apa pun                                                                            |
| Tempat pesan disimpan   | Perangkat setiap anggota; klien seluler juga memutar ulang log yang disimpan layanan Quorum | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                                   |
| Tujuan koneksi klien    | Layanan Quorum di `api.quorummessenger.com`                                                 | Peer melalui libp2p, termasuk dari tab browser                                                              |
| Komunitas               | Space dengan kanal, peran, dan tautan undangan                                              | Objek kelas satu yang node-nya menerima atau menolak postingan                                              |
| Pengendalian spam       | Tautan undangan, pengeluaran anggota disertai penggantian kunci, batas laju di sisi klien   | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                                         |
| Moderasi                | Peran yang ditegakkan oleh klien setiap anggota; pemilik mengeluarkan anggota               | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan                            |
| Pesan pribadi           | Pesan langsung terenkripsi end-to-end                                                       | Komunitas publik; belum ada pesan langsung bawaan                                                           |
| Ekonomi                 | Token jaringan QUIL; langganan Apex opsional $5 per bulan                                   | Tidak ada di protokol; tantangan bisa mewajibkan pembayaran atau token                                      |
| Konsekuensi utama       | Grup privat dan terenkripsi, tetapi setiap klien bergantung pada satu layanan               | Identitas gratis dan akses lewat browser, tetapi tanpa pesan pribadi dan hanya status terbaru yang disimpan |
