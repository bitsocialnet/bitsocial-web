# Hata Araştırma İş Akışı

Belirli bir dosya/satır/kod bloğunda bir hata bildirildiğinde bunu kullanın.

## Zorunlu İlk Adım

Düzenlemeden önce ilgili kod için git geçmişini kontrol edin. Önceki katkıda bulunanlar bir uç durum/geçici çözüm için davranış sunmuş olabilir.

## İş akışı

1. Dosya/alan için son kayıt başlıklarını (yalnızca başlıklar) tarayın:

```bash
# Belirli bir dosya için son kayıt başlıkları
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Belirli bir satır aralığı için son kayıt başlıkları
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Kapsamlı farklarla yalnızca ilgili taahhütleri inceleyin:

```bash
# Bir dosya için taahhüt mesajını + farkı göster
git show <commit-hash> -- path/to/file.tsx
```

3. Geçmiş bağlamını anladıktan sonra çoğaltmaya devam edin ve düzeltin.

## Sorun Giderme Kuralı

Engellendiğinde, en son düzeltmeleri/geçici çözümleri bulmak için web'de arama yapın.
