# Hata Araştırma İş Akışı

Belirli bir dosya/satır/kod bloğunda bir hata bildirildiğinde bunu kullanın.

## Zorunlu İlk Adım

Düzenlemeden önce ilgili kod için git geçmişini kontrol edin. Önceki katkıda bulunanlar bir uç durum/geçici çözüm için davranış sunmuş olabilir.

## İş akışı

1. Dosya/alan için son kayıt başlıklarını (yalnızca başlıklar) tarayın:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Kapsamlı farklarla yalnızca ilgili taahhütleri inceleyin:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Geçmiş bağlamını anladıktan sonra çoğaltmaya devam edin ve düzeltin.

## Sorun Giderme Kuralı

Engellendiğinde, en son düzeltmeleri/geçici çözümleri bulmak için web'de arama yapın.
