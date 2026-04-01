---
title: tiket masuk
description: Sistem otentikasi berbasis NFT yang membantu komunitas Bitsocial memverifikasi pengguna dan mengurangi serangan sybil.
sidebar_position: 2
---

# tiket masuk

Mintpass adalah sistem otentikasi berbasis NFT untuk komunitas Bitsocial. Pengguna membuat NFT verifikasi yang tidak dapat dipindahtangankan setelah menyelesaikan tantangan (seperti SMS OTP), dan komunitas dapat memeriksa kepemilikan NFT untuk mencegah serangan sybil seperti suara palsu, penghindaran larangan, dan spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Lisensi**: MIT

## Cara Kerjanya

Alur verifikasi memiliki empat langkah:

1. **Permintaan** -- Pengguna mengunjungi `mintpass.org/request` untuk memulai proses.
2. **Tantangan** -- Pengguna menyelesaikan verifikasi kata sandi satu kali melalui SMS.
3. **Mint** -- Setelah verifikasi berhasil, NFT yang tidak dapat ditransfer akan dicetak ke dompet pengguna.
4. **Verifikasi** -- Komunitas menanyakan kepemilikan NFT untuk mengonfirmasi bahwa pengguna telah diverifikasi.

Karena NFT tidak dapat dipindahtangankan, ia tetap terikat pada dompet yang telah menyelesaikan verifikasi, sehingga mencegah pengguna memperdagangkan atau menjual status terverifikasi mereka.

## Struktur Proyek

Repositori ini disusun menjadi tiga area utama:

| Direktori    | Tujuan                                              |
| ------------ | --------------------------------------------------- |
| `contracts/` | Kontrak pintar soliditas untuk verifikasi NFT.      |
| `challenge/` | Lapisan integrasi untuk sistem tantangan Bitsocial. |
| `web/`       | Next.js dan React frontend untuk alur pencetakan.   |

## Privasi dan Penanganan Data

Mintpass mengambil pendekatan data minimal:

- **Data operasional** (kode OTP, token sesi) disimpan di Redis dengan TTL pendek dan otomatis habis masa berlakunya.
- **Asosiasi mint** (tautan antara identitas terverifikasi dan dompet) adalah satu-satunya catatan yang persisten.

Tidak ada nomor telepon atau detail pribadi yang disimpan setelah jendela verifikasi ditutup.

## Lapisan Keamanan Opsional

Operator komunitas dapat mengaktifkan perlindungan tambahan bergantung pada model ancaman mereka:

- **Pemeriksaan reputasi IP** -- Menilai permintaan masuk berdasarkan basis data penyalahgunaan yang diketahui.
- **Penilaian risiko melalui telepon** -- Tandai nomor sekali pakai atau nomor VoIP sebelum mengajukan tantangan.
- **Pemblokiran geografis** -- Membatasi verifikasi pada wilayah tertentu.
- **Cooldown per-IP** -- Upaya verifikasi berulang dengan batas nilai dari alamat yang sama.

## Tumpukan Teknologi

| Lapisan      | Teknologi                                        |
| ------------ | ------------------------------------------------ |
| Kontrak      | Soliditas, diterapkan dengan Hardhat dan Foundry |
| Bagian depan | Berikutnya.js + Bereaksi                         |
| Jaringan     | Basis (Ethereum L2)                              |

Penerapan di Base menjaga biaya bahan bakar tetap rendah sekaligus mewarisi jaminan keamanan Ethereum.

## Peta jalan

Perbaikan yang direncanakan meliputi:

- **Opsi bayar untuk mencetak uang** -- Memungkinkan masyarakat untuk meminta sedikit biaya untuk mencetak uang, sehingga menambah hambatan sybil ekonomi.
- **Sinyal verifikasi tambahan** -- Perluas lebih dari sekadar SMS ke sinyal identitas lainnya.
- **Peralatan admin yang diperluas** -- Dasbor dan kontrol yang lebih kaya untuk operator komunitas.
