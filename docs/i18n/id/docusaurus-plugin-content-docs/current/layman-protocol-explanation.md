---
title: Penjelasan awam lengkap tentang protokol Bitsocial
description: Panduan sederhana dalam bahasa Inggris tentang komunitas Bitsocial, pencarian rekan, penerbitan, tantangan anti-spam, moderasi, dan aplikasi.
---

# Penjelasan awam lengkap tentang protokol Bitsocial

Halaman ini menjelaskan Bitsocial tanpa berasumsi Anda sudah memahami jaringan peer-to-peer, kunci kriptografi, IPFS, atau pubsub.

Beberapa detail sengaja disederhanakan. Untuk versi yang lebih teknis, baca halaman [Protokol Peer-to-Peer](./peer-to-peer-protocol.md).

## Versi pendek

Bitsocial adalah protokol untuk aplikasi sosial yang komunitasnya dimiliki oleh kunci, bukan oleh database perusahaan.

Komunitas Bitsocial memiliki alamat. Aplikasi menggunakan alamat tersebut untuk menemukan rekan yang melayani komunitas, mengambil postingan terbaru dari rekan tersebut, dan mempublikasikan postingan baru melalui saluran pesan peer-to-peer. Sebelum postingan diterima, komunitas dapat mewajibkan tantangan anti-spam seperti captcha, kode undangan, pembayaran, pemeriksaan token, pemeriksaan moderasi AI, daftar yang diizinkan, atau aturan lain apa pun yang dapat diberi kode.

Itulah ide intinya:

1. Komunitas dikendalikan oleh kunci pribadi.
2. Kunci publik memberi komunitas alamat yang stabil.
3. Rekan membantu pembaca menemukan dan menjemput komunitas.
4. Node komunitas menerima atau menolak postingan baru.
5. Kebijakan anti-spam adalah milik masing-masing komunitas, bukan milik satu platform global.

## Mengapa hash penting

Hash adalah sidik jari singkat untuk data.

Jika dua orang melakukan hash pada file yang sama persis, mereka mendapatkan sidik jari yang sama. Jika file berubah, sidik jarinya pun berubah. Hal ini membuat hash berguna untuk menemukan dan memeriksa data tanpa memercayai perusahaan untuk memberi tahu Anda apa file tersebut.

Sistem peer-to-peer menggunakan ide ini terus-menerus. Daripada menanyakan "file bernama photo.png" pada satu situs web, rekan dapat meminta data jaringan dengan sidik jari tertentu. Jika rekan lain mengembalikan data yang salah, pemeriksaan hash gagal.

Bitsocial menggunakan hash dan pengidentifikasi konten untuk data posting dan bagian komunitas lainnya. Poin pentingnya sederhana: data dapat ditangani berdasarkan apa adanya, tidak hanya berdasarkan tempat perusahaan menyimpannya.

## Mengapa kunci publik penting

Kunci publik dan kunci pribadi adalah pasangan yang cocok.

Kunci pribadi itu rahasia. Itu adalah hal yang memberi kendali. Kunci publik aman untuk dibagikan. Ini memungkinkan orang lain memeriksa apakah pesan, pembaruan, atau tindakan moderasi benar-benar berasal dari kunci pribadi yang cocok.

Beginilah cara Bitsocial menghindari akun platform normal. Suatu perusahaan tidak perlu mengeluarkan identitasnya. Baris database tidak perlu menentukan pemiliknya. Pasangan kunci adalah otoritas.

Secara sederhana:

- kunci pribadi adalah pegangan kendali pemilik
- kunci publik adalah identitas atau alamat publik
- tanda tangan membuktikan bahwa suatu tindakan datang dari pemiliknya

## Apa itu komunitas Bitsocial

Komunitas Bitsocial bukan hanya sebuah halaman dalam satu aplikasi.

Ia memiliki pasangan kuncinya sendiri. Kunci publik memberi komunitas alamat jaringan yang stabil. Kunci pribadi mengontrol pembaruan status komunitas, seperti metadata, aturan, daftar moderator, konfigurasi tantangan, dan penunjuk ke konten terbaru yang diterima.

Artinya, sebuah komunitas dapat bertahan lebih lama dari satu antarmuka. Satu aplikasi dapat menampilkannya sebagai papan. Aplikasi lain dapat menampilkannya sebagai forum. Aplikasi masa depan dapat menampilkannya di feed berbasis profil. Aplikasi dapat berubah, namun alamat komunitas tetap mengarah ke komunitas milik yang sama.

## Cara kerja membaca

Saat pengguna membuka komunitas Bitsocial, aplikasi tidak meminta satu database pusat untuk halaman tersebut.

Alurnya lebih dekat dengan ini:

1. Aplikasi sudah mengetahui alamat komunitas, atau mendapatkannya dari daftar, tautan, platform pencarian, atau
   nama yang bisa dibaca manusia.
2. Aplikasi ini menanyakan router ringan rekan mana yang saat ini memberikan alamat komunitas tersebut.
3. Router hanya mengembalikan alamat rekan. Mereka tidak mengembalikan postingan, aturan, profil, atau komunitas
   metadata.
4. Aplikasi ini terhubung ke rekan-rekan dan mengambil status komunitas terbaru.
5. Status itu berisi petunjuk untuk memposting konten.
6. Aplikasi ini mengambil konten postingan dari rekan-rekan dan merendernya dalam antarmuka sosial normal.

Router hanyalah pembantu pencarian. Hal ini lebih dekat dengan bertanya "siapa yang memiliki ini?" daripada bertanya "tolong layani saya seluruh situs web."

Untuk detail lebih lanjut mengenai pemisahan ini, baca [Penemuan Konten](./content-discovery.md).

## Cara kerja pengeposan

Memposting berbeda dengan membaca karena jaringan terbuka peer-to-peer dapat menerima spam.

Bitsocial menangani penerbitan melalui aliran tantangan-respons:

1. Pengguna menulis posting atau balasan.
2. Aplikasi ini bergabung dengan topik pesan peer-to-peer komunitas.
3. Aplikasi ini meminta tantangan kepada simpul komunitas.
4. Node komunitas mengirimkan kembali tantangan tersebut.
5. Pengguna atau aplikasi menyelesaikan tantangan.
6. Aplikasi mengirimkan postingan ditambah jawaban tantangan.
7. Node komunitas memeriksa jawaban dan postingan.
8. Jika lolos, node komunitas menerima postingan tersebut ke pembaruan komunitas berikutnya.
9. Pembaca lain mengambil status komunitas terbaru dari rekan-rekannya.

Tantangannya terjadi sebelum postingan tersebut menjadi bagian dari komunitas yang diterima negara. Inilah perbedaan penting dari sistem di mana spam diterima terlebih dahulu dan kemudian disembunyikan.

## Mengapa tantangan anti-spam penting

Sebagian besar platform sosial mengubah anti-spam menjadi kebijakan platform. Satu perusahaan memutuskan apa yang dianggap sebagai akun yang valid, postingan yang valid, jangkauan yang valid, atau pengguna yang valid.

Bitsocial memisahkan hal-hal itu. Protokol ini memberi komunitas cara untuk meminta tantangan sebelum menerima postingan, namun tidak memaksa setiap komunitas untuk menggunakan tantangan yang sama.

Satu komunitas mungkin menggunakan captcha. Yang lain mungkin menggunakan kode undangan. Yang lain mungkin memerlukan cek SMS, pembayaran, NFT, saldo token, skor moderasi AI, bukti reputasi, daftar yang diizinkan khusus komunitas, atau aturan khusus.

Fleksibilitas itu penting karena spam berubah. Aturan spam tingkat protokol menjadi basi. Tantangan di tingkat komunitas dapat berkembang tanpa memigrasi seluruh jaringan.

Untuk penjelasan terfokus, baca [Tantangan Anti-Spam Khusus](./custom-challenges.md).

## Cara kerja moderasi

Bitsocial tidak bebas moderasi. Ini adalah moderasi tanpa satu admin super global.

Komunitas dapat memiliki pemilik dan moderator. Alamat moderator adalah bagian dari negara komunitas. Ketika moderator mengambil tindakan, tindakan itu dapat ditandatangani. Node komunitas dan klien dapat memeriksa tanda tangan terhadap daftar moderator.

Hal ini memberi moderasi ruang lingkup lokal:

- pemilik komunitas mengendalikan komunitas itu
- moderator bertindak melalui kunci yang dikenali komunitas
- aplikasi masih dapat memilih apa yang diindeks, diberi peringkat, disembunyikan, atau disorot
- tidak ada akun perusahaan tingkat protokol yang dapat menghapus setiap identitas atau menyita setiap komunitas

Dalam praktiknya, hal ini berarti komunitas dapat menghapus spam atau menegakkan aturan di dalam ruangnya sendiri tanpa mengubah aturannya menjadi undang-undang untuk seluruh jaringan.

Untuk pandangan kebijakan, baca [Moderasi Lokal, Bukan Larangan Global](./local-moderation.md).

## Aplikasi apa yang ditambahkan

Protokol tidak menentukan seperti apa tampilan keseluruhan produk.

Sebuah aplikasi menambahkan pengalaman manusia seputar protokol:

- daftar komunitas default
- pencarian dan penemuan
- feed dan peringkat
- tata letak dan antarmuka posting
- penanganan media
- alat moderasi
- kemasan seluler, desktop, atau browser
- model bisnis dan default

Itu sebabnya Bitsocial dapat mendukung gaya aplikasi yang berbeda. 5chan bisa terasa seperti papan gambar. Seedit bisa terasa seperti diskusi bergaya forum. Klien lain dapat membangun permukaan penemuan yang berbeda, sistem peringkat, tampilan moderasi, atau default komunitas sambil tetap menggunakan komunitas Bitsocial yang kompatibel di bawahnya.

Protokol ini menjaga kepemilikan dan penerbitan tetap portabel. Aplikasi bersaing dalam kualitas produk.

## Apa yang ditambahkan oleh RPC publik

Menjalankan node komunitas peer-to-peer secara langsung memang ampuh, namun tidak semua orang ingin mengelola mesin yang selalu aktif.

RPC Publik adalah lapisan layanan yang dapat membuat Bitsocial lebih nyaman. Penyedia RPC publik dapat membantu pengguna mengelola komunitas dari telepon atau klien ringan, sedangkan model kepemilikan jangka panjang tetap membiarkan pengguna berpindah, menghosting sendiri, atau memilih penyedia pesaing.

Perbedaan itu penting:

- RPC dapat membantu uptime dan kenyamanan
- RPC tidak boleh menjadi hak asuh permanen
- hubungan pemilik harus tetap terikat pada kunci, bukan pada database satu penyedia

## Apa yang bukan Bitsocial

Bitsocial bukanlah jaringan sosial blockchain. Media sosial tidak memerlukan setiap postingan untuk menjadi transaksi dalam satu buku besar global.

Bitsocial bukanlah federasi dalam pengertian ActivityPub. Komunitas tidak perlu menjadi akun dalam satu server dengan satu domain, satu admin, dan satu database server.

Bitsocial juga bukan satu aplikasi. Ini adalah lapisan protokol bersama untuk aplikasi, komunitas, node, router, penyedia RPC, layanan penemuan, modul anti-spam, dan alat moderasi.

Intinya bukanlah setiap pengguna perlu memahami semua ini sebelum memposting. Intinya produknya bisa terasa biasa saja, sedangkan model kepemilikan di bawahnya berbeda.

## Ke mana harus pergi selanjutnya

- [Protokol Peer-to-Peer](./peer-to-peer-protocol.md) menjelaskan alur teknisnya.
- [Penemuan Konten](./content-discovery.md) menjelaskan pencarian jaringan versus kurasi aplikasi.
- [Tantangan Anti-Spam Khusus](./custom-challenges.md) menjelaskan sistem tantangan.
- [Identitas dan Kepemilikan Komunitas](./identity-and-ownership.md) menjelaskan kendali kunci
  kepemilikan.
- [Bangun klien Anda sendiri](/build-your-own-client/) menjelaskan bagaimana aplikasi independen dapat dibangun
  jaringan yang sama.
