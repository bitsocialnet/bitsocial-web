---
title: Bitsocial dan Urbit
description: Perbandingan Urbit, jaringan server pribadi dengan Urbit ID berbasis Ethereum dan grup yang dijalankan oleh host di Tlon Messenger, dengan komunitas peer-to-peer Bitsocial.
---

# Bitsocial dan Urbit

[Urbit](https://urbit.org/) adalah jaringan server pribadi. Setiap pengguna memiliki komputer yang
selalu menyala, yang disebut kapal. Kapal ini menjalankan sistem operasi milik Urbit sendiri (Arvo),
yang ditulis dalam bahasa-bahasa milik Urbit sendiri (Nock dan Hoon), dan diidentifikasi oleh sebuah
Urbit ID. Aplikasi sosial utamanya adalah [Tlon Messenger](https://tlon.io/), yang dibuat oleh Tlon,
perusahaan yang didirikan pada 2013 untuk mengembangkan Urbit.

Urbit bertujuan menggantikan seluruh tumpukan komputasi, sehingga proyeknya jauh lebih luas daripada
Bitsocial. Namun, lapisan sosialnya memakai model yang mirip dengan Bitsocial: sebuah komunitas
tinggal di node pemiliknya, dan node itulah yang memutuskan apa yang boleh masuk. Keduanya berbeda
dalam hal siapa yang harus menjalankan server dan bagaimana spam dijauhkan.

## Cara kerja Urbit

- **Urbit ID.** Setiap kapal memiliki Urbit ID: sebuah angka yang ditampilkan sebagai nama yang
  bisa diucapkan, seperti `~sampel-palnet`. ID Layer 1 adalah NFT yang kepemilikan dan kunci publik
  jaringannya tercatat di kontrak Azimuth di Ethereum. ID Layer 2, yang ditambahkan pada 2021 untuk
  memangkas biaya, memakai "rollup naif": transaksinya diposting ke Ethereum secara berkelompok,
  tetapi kepemilikannya tidak disimpan di kontrak Azimuth, dan setiap kapal menghitungnya secara
  lokal. Tlon menjalankan roller yang bisa dipakai publik secara gratis, menurut
  [dokumentasi Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) dan
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Hierarki tetap.** Ruang alamatnya berisi 256 galaksi, 65.536 bintang, dan sekitar 4 miliar
  planet untuk penggunaan sehari-hari. Galaksi menerbitkan bintang, bintang menerbitkan planet, dan
  setiap planet bisa menerbitkan bulan untuk perangkatnya sendiri. Komet adalah ID gratis yang
  dibuat sebuah kapal untuk dirinya sendiri dan tidak pernah menyentuh blockchain. Para pemilik
  galaksi membentuk Galactic Senate, yang memberikan suara atas peningkatan kontrak Azimuth dan
  memilih dewan Urbit Foundation.
- **Jaringan.** Kapal-kapal bertukar paket terenkripsi secara peer-to-peer. Sejak Juli 2026,
  protokol jaringannya adalah [Directed Messaging](https://urbit.org/blog/directed-messaging),
  penulisan ulang berbasis konten dari protokol Ames yang lebih lama. Galaksi menangani penemuan
  peer: masing-masing mencatat lokasi kapal-kapal di bawahnya, dan meneruskan paket kepada mereka
  sampai kedua kapal bisa saling menjangkau secara langsung, atau selama firewall menghalanginya,
  menurut
  [makalah Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grup.** Di Tlon Messenger, sebuah grup di-host oleh kapal pembuatnya. Anggota mengirim pesan
  ke host, yang mendistribusikannya ke kapal setiap anggota, dan kapal setiap anggota menyimpan
  salinannya sendiri, menurut [FAQ Tlon](https://tlon.io/posts/faq). Host mengendalikan peran,
  kanal, dan penerimaan anggota. Grup bisa bersifat publik, privat, atau rahasia, dan bisa
  [memblokir kapal tertentu atau seluruh tingkatan ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanal berupa chat, buku catatan, atau koleksi gambar dan tautan.
- **Hosting.** Mendaftar di Tlon memberi pengguna baru sebuah kapal yang dijalankan Tlon, dengan
  kunci yang berada dalam penguasaan Tlon. Pengguna bisa mengekspor kapal beserta master ticket-nya
  dan menjalankannya di tempat lain: di perangkat [Native Planet](https://www.nativeplanet.io/),
  atau dengan runtime Vere di Linux, macOS, atau Windows. Kapal belum bisa menyimpan file besar
  secara langsung, sehingga Tlon Messenger menaruh gambar dan media lain di penyimpanan cloud yang
  kompatibel dengan S3.

## Letak perbedaannya

### Siapa yang harus menjalankan server

Di Urbit, setiap peserta adalah server. Aplikasi Tlon adalah antarmuka untuk kapal milik pengguna
sendiri, dan bahkan membaca sebuah grup pun melewati kapal itu. Orang yang tidak menjalankan kapal
sendiri menyewanya, yang membawa penyedia hosting kembali ke dalam gambaran: Tlon memegang kunci
pengguna yang di-host dan mempertahankan akses terbatas untuk pemeliharaan, meskipun pengguna bisa
pergi dengan membawa seluruh kapalnya.

Di Bitsocial, hanya pemilik komunitas yang membutuhkan node yang selalu menyala. Pembaca dan
pemosting bisa menjalankan node peer-to-peer di dalam tab browser, dan akun mereka adalah pasangan
kunci yang disimpan aplikasi. Lihat [Peer-to-Peer di Browser](/browser-p2p/). Ketika seseorang
memang memakai node yang di-host, desain Bitsocial bertujuan memungkinkannya mendelegasikan uptime
tanpa menyerahkan penguasaan atas identitasnya. Lihat
[Identitas dan Kepemilikan Komunitas](/identity-and-ownership/).

### Host komunitas

Di sinilah keduanya paling mirip. Grup Tlon dan komunitas Bitsocial sama-sama tinggal di node
pemiliknya. Host memutuskan siapa yang boleh memposting, menerapkan moderasi, dan mendistribusikan
hasilnya, dan tidak satu pun dari kedua protokol menempatkan moderator di atas host. Pada keduanya,
host harus online. FAQ Tlon menyebutkan bahwa jika host offline, "grup ikut tumbang bersamanya",
dan komunitas Bitsocial tidak bisa menerima postingan baru selama node-nya offline.

Keduanya menyimpan konten dengan cara berbeda. Kapal setiap anggota menyimpan salinan riwayat grup,
sehingga anggota masih bisa membaca apa yang sudah mereka terima selama host mati. Pembaca
Bitsocial mengambil status terbaru komunitas dari node komunitas atau dari peer yang men-seed-nya,
sehingga komunitas yang offline tetap bisa dibaca selama peer masih memilikinya, tetapi jaringan
hanya menyimpan status terbaru.

Grup Tlon juga punya daftar anggota, dan host-nya bisa membuatnya khusus undangan. Komunitas
Bitsocial tidak punya keanggotaan: siapa pun bisa membacanya, dan siapa pun bisa mencoba memposting,
dengan tunduk pada tantangannya.

### Spam dan identitas

Urbit melawan spam dengan membuat identitas menjadi langka. Jumlah planet tetap dan setiap planet
diterbitkan oleh sebuah bintang. Komet gratis mengakali kelangkaan itu, sehingga grup yang ingin
kelangkaan itu bertahan menolak komet: dokumentasi Urbit mencatat bahwa sebagian grup menolak komet,
dan grup Tlon bisa memblokir seluruh tingkatan komet dengan satu pengaturan. Begitu komet ditolak,
pengguna yang diblokir membutuhkan planet lain dari pemilik sebuah bintang untuk bisa kembali.
Reputasi juga bisa mengikuti hierarki: Azimuth menyertakan kontrak Censures yang memungkinkan
galaksi dan bintang menandai ID. Karena kelangkaan itu tertanam di ruang alamat, ia bekerja dengan
cara yang sama di setiap grup yang menolak komet.

Identitas Bitsocial adalah pasangan kunci gratis. Setiap komunitas memilih tantangannya sendiri
sebelum menerima postingan, seperti captcha, pembayaran, saldo token, atau allowlist, dan komunitas
lain bisa memilih secara berbeda. Lihat [Tantangan Anti-Spam Khusus](/custom-challenges/).

### Blockchain dan tata kelola

Lapisan identitas Urbit bergantung pada Ethereum. Kontrak Azimuth mencatat kepemilikan Layer 1 dan
kunci jaringan, transaksi Layer 2 diposting ke Ethereum secara berkelompok, dan Galactic Senate
bisa meningkatkan kontrak yang mengatur Azimuth. 256 galaksi yang sama juga menangani penemuan peer
dan penerusan paket, sehingga satu set identitas yang tetap memikul tata kelola sekaligus sebagian
routing jaringan.

Identitas Bitsocial adalah pasangan kunci yang tidak memerlukan pendaftaran. Nama `.bso` dan `.eth`
adalah alias opsional yang diresolusi menjadi pasangan kunci tersebut. Penemuan peer berjalan
melalui router HTTP yang hanya mengembalikan alamat penyedia; siapa pun bisa menjalankannya, dan
klien bisa berganti router dengan mengubah konfigurasinya.

### Cakupan

Urbit adalah komputer serbaguna. Sebuah kapal bisa meng-host Git remote, basis pengetahuan pribadi,
atau agen AI, dan Tlon Messenger hanyalah satu program di antara banyak program lain. Membangun
untuk Urbit sebagian besar berarti menulis aplikasi Hoon untuk Arvo. Bitsocial adalah protokol
untuk komunitas publik, dengan aplikasi seperti [5chan](/apps/5chan/) dan [Seedit](/apps/seedit/).
Bitsocial berjalan di atas tumpukan yang sudah ada (libp2p, IPFS, dan browser) alih-alih
menggantinya, dan kliennya dibangun dengan perkakas web biasa. Lihat
[Bangun klien Anda sendiri](/build-your-own-client/).

### Pesan pribadi

Di sinilah Urbit lebih unggul. Pesan langsung berpindah dari satu kapal langsung ke kapal lain,
semua lalu lintas antarkapal dienkripsi, dan grup bisa bersifat privat atau rahasia. Tlon mencatat
bahwa pesan dienkripsi saat transit tetapi disimpan tanpa enkripsi di kapal. Bitsocial berfokus
pada komunitas publik dan belum punya pesan langsung bawaan.

## Status proyek

Urbit pernah diguncang gejolak. Pada Agustus 2024, Urbit Foundation, organisasi nirlaba yang
mengarahkan pengembangan inti, memecat direktur eksekutifnya; pendiri Curtis Yarvin kembali untuk
memimpin strategi tanpa jabatan resmi, beberapa pengembang inti keluar, dan dana Foundation hanya
cukup untuk hitungan bulan,
[lapor CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin mengusulkan pemindahan Azimuth ke layer 2 Ethereum yang sudah ada, dengan Base sebagai
pilihan yang paling mungkin, serta penerbitan token "visa" yang fungible dan bisa dikonversi
menjadi planet. Per Oktober 2026,
[dokumentasi ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) Urbit masih menjelaskan Azimuth
di Ethereum dengan rollup naifnya. Pada Oktober 2025, Galactic Senate mengganti dewan Foundation,
dan dewan baru menunjuk direktur eksekutif baru
([pengumuman](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Pengembangan terus berjalan. Directed Messaging mulai aktif dengan rilis 408k pada 14 Juli 2026.
Pada Juni 2026, Tlon Messenger
[membuka pendaftaran publik tanpa daftar tunggu](https://urbit.org/blog/this-month-in-urbit-june-2026),
dan Tlon kini memperkenalkan dirinya sebagai tempat manusia dan agen AI bekerja bersama.

## Perbandingan

| Pertanyaan                    | Urbit                                                                                            | Bitsocial                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Kategori                      | Jaringan server pribadi dan sistem operasi                                                       | Jaringan komunitas peer-to-peer                                                                             |
| Identitas                     | Urbit ID: sekitar 4 miliar planet di Ethereum atau di rollup Layer 2-nya, ditambah komet gratis  | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                                         |
| Siapa yang menjalankan server | Setiap pengguna, di kapalnya sendiri atau di kapal yang di-host                                  | Pemilik komunitas; pembaca dan pemosting bisa memakai tab browser                                           |
| Tempat postingan disimpan     | Kapal host grup dan salinan di kapal setiap anggota                                              | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                                   |
| Komunitas                     | Grup yang di-host kapal pembuatnya, dengan daftar anggota                                        | Objek kelas satu yang node-nya menerima atau menolak postingan                                              |
| Pengendalian spam             | ID langka yang diterbitkan bintang; grup memblokir kapal atau seluruh tingkatan                  | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                                         |
| Moderasi                      | Peran dan blokir yang diatur host grup                                                           | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan                            |
| Penemuan peer                 | Galaksi melacak kapal-kapal di bawahnya dan meneruskan paket untuk mereka                        | Router HTTP mengembalikan peer penyedia dan tidak menyimpan konten                                          |
| Tata kelola                   | Galactic Senate yang terdiri dari 256 galaksi memberikan suara atas peningkatan Azimuth          | Tidak ada otoritas tingkat protokol atas identitas atau komunitas                                           |
| Pesan pribadi                 | Pesan langsung terenkripsi dan grup khusus undangan                                              | Komunitas publik; belum ada pesan langsung bawaan                                                           |
| Konsekuensi utama             | Komputer pribadi utuh dengan grup privat, tetapi setiap pengguna butuh kapal yang selalu menyala | Identitas gratis dan akses lewat browser, tetapi tanpa pesan pribadi dan hanya status terbaru yang disimpan |
