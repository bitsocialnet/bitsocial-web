# Taahhüt ve Sorun Formatı

Anlamlı kod değişiklikleri önerirken veya uygularken bunu kullanın.

## Öneri Formatını Kaydet

- **Başlık:** Geleneksel Taahhüt tarzı, kısa, geri tırnaklarla sarılmış.
- Performans optimizasyonları için `perf` (`fix` değil) kullanın.
- **Açıklama:** Çözümü açıklayan isteğe bağlı 2-3 resmi olmayan cümle. Kısa ve teknik, madde işareti yok.

Örnek:

> **Taahhüt başlığı:** `fix: correct date formatting in timezone conversion`
>
> `date-utils.ts`'daki `formatDate()`, saat dilimi farklarını düzgün bir şekilde işlemek için güncellendi.

## GitHub Sayı Öneri Formatı

- **Başlık:** Mümkün olduğu kadar kısa, geri tırnaklara sarılmış.
- **Açıklama:** Sorunu (çözümü değil) sanki hala çözülmemiş gibi açıklayan 2-3 resmi olmayan cümle.

Örnek:

> **GitHub sorunu:**
>
> - **Başlık:** `Date formatting displays incorrect timezone`
> - **Açıklama:** Yorum zaman damgaları, kullanıcılar farklı bölgelerdeki gönderileri görüntülediğinde yanlış saat dilimlerini gösteriyor. `formatDate()` işlevi kullanıcının yerel saat dilimi ayarlarını hesaba katmaz.
