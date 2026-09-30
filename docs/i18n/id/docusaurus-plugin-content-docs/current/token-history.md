---
title: Riwayat Token BSO
description: Riwayat lengkap setiap generasi token BSO, dari asal-usulnya di Avalanche pada 2021 hingga kontrak Ethereum yang kini permanen dan tanpa admin.
---

# Riwayat Token BSO

BSO adalah koin yang nilainya bertumpu pada asal-usulnya. Protokol di balik Bitsocial bersifat
terbuka, dan token maupun chain-nya opsional secara desain: siapa pun boleh mem-fork kodenya,
menjalankan kliennya sendiri, atau membangun ekonominya sendiri di atasnya. Yang tidak bisa direbut
lewat fork adalah asal-usul itu sendiri. BSO sudah menjadi token resmi Bitsocial sejak hari pertama,
dan setiap migrasi sejak saat itu dapat diverifikasi on-chain.

Halaman ini memuat setiap generasi token secara berurutan, lengkap dengan alamat kontrak penuh
sehingga siapa pun dapat memeriksa catatannya secara mandiri.

## Gen 1: awal mula, Avalanche, 2021

- **Chain**: Avalanche
- **Tahun**: 2021
- **Alamat**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorer**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Di sinilah BSO bermula. Pasokan dibagikan melalui tiga airdrop dan imbalan liquidity mining, tanpa
presale dan tanpa alokasi tim yang disisihkan lebih dulu di depan
komunitas. Kontraknya berupa proxy yang dapat diupgrade, praktik
yang lazim pada masa itu dan memungkinkan tim mengirimkan perbaikan pada masa awal token.

## Gen 2: pindah ke Ethereum, 2024

- **Chain**: Ethereum
- **Tahun**: 2024
- **Alamat**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 memindahkan BSO dari Avalanche ke Ethereum, tempat sisa peta jalan Bitsocial Chain dibangun.
Sama seperti Gen 1, kontrak ini masih berupa proxy yang dapat diupgrade, dipertahankan untuk satu
generasi lagi sementara kontrak final yang permanen disiapkan.

## Gen 3: sepenuhnya permanen, 2025

- **Chain**: Ethereum
- **Tahun**: 2025
- **Alamat**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 adalah kontrak BSO yang berlaku sekarang sekaligus yang terakhir. Kontrak ini sepenuhnya tidak
dapat diubah dan tidak punya admin:

- tidak ada fungsi mint, sehingga pasokan tidak dapat digelembungkan
- tidak ada alamat pemilik, sehingga tidak ada pihak yang bisa mengubah perilaku kontrak secara sepihak
- tidak ada fungsi pause, sehingga transfer tidak dapat dibekukan
- tidak ada pola proxy, sehingga logikanya sendiri tidak dapat ditukar di kemudian hari

Inilah kondisi akhir yang dituju oleh dua generasi sebelumnya: token yang tidak menyisakan satu pun
kunci admin untuk dipegang.

## Bagaimana migrasinya berjalan

Setiap migrasi, dari Gen 1 ke Gen 2 dan dari Gen 2 ke Gen 3, berupa airdrop pasif 1:1. Pemegang token
tidak perlu mengajukan klaim, menandatangani pesan, atau melakukan tindakan apa pun. Saldo pada
kontrak lama dibaca langsung dan disalin 1:1 ke kontrak baru, sehingga posisi setiap pemegang terjaga
persis melewati migrasi.

Karena kontrak lama maupun kontrak baru tetap publik dan berada on-chain, setiap langkah proses ini
dapat diverifikasi secara independen. Siapa pun bisa membandingkan snapshot pemegang dari Gen 1 atau
Gen 2 dengan saldo Gen 3 saat ini dan memastikan migrasinya benar-benar sesuai dengan yang dijanjikan.
Tidak ada bagian dari riwayat ini yang mengharuskan Anda percaya begitu saja pada ucapan Bitsocial.

## Verifikasi semuanya

Jangan menerima semua ini sebagai keyakinan. Periksa catatannya secara langsung:

- Gen 1 di [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 di [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 di [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- situs chain terkini di [chain.bitsocial.net](https://chain.bitsocial.net)

Jika sebuah alamat tidak cocok dengan yang tercantum di sini, alamat itu bukan token BSO resmi.
