---
title: RPC Publik Tanpa Izin
description: Usulan desain untuk layanan RPC Bitsocial publik dengan pengguna terisolasi, izin terbatas, dan kepemilikan komunitas.
---

# RPC Publik Tanpa Izin

Proposal RPC publik asli berlaku sebagai terbitan GitHub yang ditulis dalam terminologi plebbit lama. Halaman ini menulis ulang ide tersebut dalam bahasa Bitsocial dan membingkainya sebagai proposal tingkat produk, bukan sebagai dinding detail implementasi.

## Tujuan bahasa sederhana

Bitsocial Forge dapat menjalankan layanan RPC publik yang memungkinkan banyak pengguna mengelola komunitas Bitsocial mereka dari jarak jauh, tanpa mengubah operator menjadi penjaga komunitas tersebut.

Layanan ini harus membuat klien mobile dan ringan menjadi praktis dengan tetap menjaga tiga kendala:

1. Pengguna tetap terisolasi satu sama lain secara default.
2. Izin tetap eksplisit dan terperinci.
3. Kompatibilitas dengan bentuk respons dan permintaan RPC saat ini dapat dipertahankan selama peluncuran.

## Masalah apa yang dipecahkannya

Saat ini, model RPC paling sederhana biasanya semuanya atau tidak sama sekali: satu kunci autentikasi, satu domain otoritas, akses penuh. Itu berfungsi untuk satu operator tetapi tidak untuk layanan multi-pengguna publik.

RPC publik tanpa izin memerlukan model yang lebih kuat:

- satu layanan dapat menampung banyak pengguna
- setiap pengguna mendapatkan komunitas dan batasannya sendiri
- kebijakan yang ditentukan operator dapat mencegah penyalahgunaan
- pengguna masih bisa pindah atau self-host nantinya

## Model inti

### Pengguna

Setiap pengguna mendapatkan kredensial autentikasi ditambah paket izin.

### Komunitas

Komunitas yang dibuat melalui layanan ini ditetapkan ke catatan pemilik. Kepemilikan dilacak secara eksplisit sehingga metode pengelolaan dapat disesuaikan dengan pengguna yang tepat.

### Izin

Izin didasarkan pada kemampuan. Daripada menggunakan satu boolean untuk “dapat menggunakan RPC”, server dapat mengontrol:

- berapa banyak komunitas yang dapat dibuat oleh pengguna
- metode manajemen mana yang tersedia
- operasi publikasi apa yang diperbolehkan
- batasan tarif apa yang berlaku
- permukaan admin apa yang terlihat

### Permukaan Admin

RPC publik sendiri harus tetap fokus pada perilaku RPC yang dihadapi pengguna. Tugas administratif seperti pembuatan pengguna, transfer kepemilikan, dan tinjauan audit berada dalam API dan dasbor operator terpisah.

## Sikap kompatibilitas

Dokumentasi yang dapat dilihat pengguna harus menggunakan istilah Bitsocial seperti **komunitas** dan **profil**.

Pada level wire, peluncuran pertama masih dapat mempertahankan bentuk transport dan payload JSON-RPC saat ini yang berguna untuk kompatibilitas. Dengan kata lain: dokumen tidak perlu lagi berbicara seperti dokumen plebbit lama, meskipun masa transisi menyimpan beberapa nama metode lama atau bentuk permintaan di belakang layar.

## Paket izin yang diusulkan

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Nama metode yang tepat bersifat ilustratif. Bagian yang penting adalah bentuk kebijakannya: kemampuan individu dikontrol secara independen dan bukan digabungkan menjadi satu token pengguna super.

## Aliran koneksi

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Kesadaran izin harus tetap opsional. Klien yang mengabaikan notifikasi masih dapat berperilaku benar dengan menangani kegagalan otorisasi standar dari server.

## Penegakan kepemilikan

Saat layanan membuat komunitas, layanan tersebut akan secara otomatis menetapkan kepemilikan kepada pengguna yang menelepon. Dari sana:

- tindakan memulai, menghentikan, mengedit, dan menghapus komunitas berada dalam cakupan pemilik
- tanggapan daftar dan langganan default ke komunitas penelepon itu sendiri
- visibilitas yang lebih luas adalah izin admin yang eksplisit, bukan default

Kasus satu sisi sangat penting: jika pengguna berlangganan komunitas yang **bukan** mereka miliki, server hanya boleh mengekspos keadaan publik yang harus dilihat oleh pengamat luar. Konfigurasi khusus pemilik atau data runtime internal tidak boleh bocor melalui API langganan.

## Permukaan operator yang disarankan

API admin bisa saja tetap membosankan dan eksplisit:

- daftar pengguna
- memeriksa satu pengguna
- membuat atau memperbarui pengguna
- menghapus pengguna
- mengalihkan kepemilikan masyarakat
- memeriksa log audit

Otentikasi untuk API operator ini harus benar-benar terpisah dari autentikasi RPC pengguna akhir.

## Fase peluncuran

### Fase 1

- menetapkan struktur proyek RPC publik
- tambahkan catatan pengguna dan pelacakan kepemilikan
- fork atau perluas server RPC saat ini

### Fase 2

- menerapkan bundel izin
- menerapkannya di lapisan metode RPC
- mengembalikan metadata izin saat terhubung

### Fase 3

- tambahkan API operator
- tambahkan pencatatan audit
- tambahkan otentikasi admin

### Fase 4

- kirimkan dasbor admin
- pengendalian penyalahgunaan tes
- memperketat pembatasan tarif dan kuota penyimpanan

## Pertanyaan terbuka

### Spam kredensial autentikasi

Jika pembuatan autentikasi berbiaya rendah, layanan publik mungkin memerlukan lapisan tantangan sebelum menerbitkan kredensial. Salah satu cara yang mungkin dilakukan adalah dengan menggunakan kembali model tantangan komunitas itu sendiri sehingga penerbitan kredensial mewarisi filosofi anti-penyalahgunaan yang sama dengan jaringan lainnya.

### Penamaan warisan

Beberapa implementasi awal mungkin masih menampilkan nama metode lama secara internal untuk kompatibilitas. Hal ini harus dianggap sebagai detail migrasi, bukan sebagai kosa kata publik permanen dari dokumen Bitsocial.

## Ringkasan

Proposal ini sebenarnya tentang satu hal: membuat infrastruktur RPC publik berguna tanpa menjadikannya sebagai tempat kustodian. RPC Bitsocial publik yang baik seharusnya terasa seperti bantuan opsional untuk menjalankan komunitas, bukan seperti platform pusat baru yang mendapatkan kembali kepemilikan melalui pintu belakang.
