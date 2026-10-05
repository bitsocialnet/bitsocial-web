# Pekerjaan agen yang berjalan lama

Gunakan status tugas yang tahan lama ketika pekerjaan perlu dilanjutkan atau diserahterimakan, atau ketika satu kali eksekusi cukup panjang sehingga pemadatan konteks bisa membuat sisa pekerjaan terlupakan. Tugas kecil tidak memerlukan papan tugas atau berkas progres. Untuk pekerjaan bersama, simpan `feature-list.json` dan `progress.md` yang ringkas di `docs/agent-runs/<slug>/` khusus tugas tersebut, dengan memakai templat yang ada bila membantu.

Catat hasil yang diminta, branch/worktree saat ini, kepemilikan berkas, perubahan yang sudah selesai, pemeriksaan beserta hasilnya, proses/sesi yang dimiliki, dan langkah berikutnya yang belum terselesaikan. Jangan menyimpan kredensial atau salinan kode sumber sembarangan. Tandai sebuah fitur selesai hanya setelah kriteria penerimaannya terverifikasi.

Saat melanjutkan, periksa status Git, progres terbaru, dan kode sumber yang relevan sebelum menyunting. Pakai ulang sumber daya milik sendiri yang kompatibel; jalankan server dev hanya ketika pemeriksaan berikutnya membutuhkannya. Pilih pemeriksaan berdasarkan dampaknya dengan [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), alih-alih mengulang putaran penuh yang tidak berubah.

Jaga agar pekerjaan terdelegasi yang saling terkait tetap terbatas cakupannya dan tidak tumpang tindih. Satu agen memegang pemeriksaan berat dan sesi browser. Perbarui status yang tahan lama ketika potongan kerja yang selesai, pemblokir, atau serah terima mengubah apa yang perlu diketahui kontributor berikutnya; jangan mencatat setiap perintah secara mekanis.
