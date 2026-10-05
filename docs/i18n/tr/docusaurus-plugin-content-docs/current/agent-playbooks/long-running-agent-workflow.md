# Uzun süreli ajan çalışmaları

İşin kaldığı yerden sürdürülmesi veya devredilmesi gerektiğinde ya da tek bir çalıştırma, bağlam sıkıştırmanın kalan işi gözden kaçırmasına yol açabilecek kadar uzun sürdüğünde kalıcı görev durumu kullanın. Küçük görevler pano veya ilerleme dosyası gerektirmez. Paylaşılan işlerde göreve özgü bir `docs/agent-runs/<slug>/` dizininde kısa bir `feature-list.json` ve `progress.md` tutun; işe yaradığı yerlerde mevcut şablonları kullanın.

İstenen sonucu, mevcut dalı/worktree'yi, dosya sahipliğini, tamamlanan değişiklikleri, sonuçlarıyla birlikte kontrolleri, sahip olunan süreçleri/oturumları ve çözülmemiş bir sonraki adımı kaydedin. Kimlik bilgilerini veya gelişigüzel kaynak kod dökümlerini saklamayın. Bir özelliği yalnızca kabul ölçütleri doğrulandığında tamamlandı olarak işaretleyin.

İşi sürdürürken, düzenlemeden önce Git durumunu, en son ilerleme kaydını ve ilgili kaynak kodu inceleyin. Uyumlu ve size ait kaynakları yeniden kullanın; geliştirme sunucusunu yalnızca bir sonraki kontrol gerektiriyorsa başlatın. Kontrolleri, değişmemiş bir tam geçişi tekrarlamak yerine [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) belgesinden yararlanarak etkiye göre seçin.

Birbiriyle ilişkili devredilen işlerin kapsamını belirli ve çakışmasız tutun. Ağır kontrollerin ve tarayıcı oturumlarının sahibi tek bir ajandır. Tamamlanan bir dilim, bir engel veya bir devir, bir sonraki katkıda bulunanın bilmesi gerekenleri değiştirdiğinde kalıcı durumu güncelleyin; her komutu mekanik olarak kaydetmeyin.
