# Çeviriler

About sitesi `about/public/translations/{lang}/default.json` konumundaki i18next JSON dosyalarını kullanır. Docusaurus kaynak çevirileri ayrı olarak `docs/i18n/` içinde bulunur.

## About sitesi anahtarları

`.agents/skills/translate/SKILL.md` dosyasını kullanın. Güncel yerel ayarları diskten belirleyin; yer tutucuları, işaretlemeyi, teknik terimleri ve marka adlarını koruyun. Daha büyük isteklerde alt ajanlar birbirinden bağımsız haritalar üretebilir, ancak tüm yerel ayar yazımlarını tek bir üst ajan sırayla uygular; güncelleyicinin yazıcı kilidi yoktur.

Göreve ait, benzersiz bir harita yolu kullanın. Önce `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` ile önizleyin, ardından aynı argümanlar ve `--write` ile uygulayın. Yazdıktan sonra kapsamı/değerleri doğrulayın ve yalnızca bu göreve ait geçici haritaları kaldırın.

İstenen kaldırmalar için `--delete` kullanın. Yetkilendirilmiş bir `--audit --write` işleminden önce `--audit --dry` bulgularını inceleyin; dinamik çeviri anahtarları kaynağın elle incelenmesini gerektirir. İngilizce metni her yerel ayara yalnızca teknik bir terim, marka veya yer tutucu söz konusuysa kopyalayın.

## Docusaurus sayfaları

`scripts/translate-docs.py` tüm sayfalar/yerel ayarlar için çalışan bir toplu yazıcıdır ve dosya bazında filtresi yoktur; dar kapsamlı bir çeviri düzenlemesi için kullanmayın. `scripts/check-docs-translations.py` salt okunur doğrulayıcıdır ve `--locales` ile `--paths` seçeneklerini destekler.

Kod bloklarını, bağlantıları, satır içi kodu, sözleşme adreslerini, başlıkları, tabloları ve uyarı kutularını İngilizce kaynakla uyumlu tutun. Doğrulayıcı hatalarını giderin; marka adlarından kaynaklanan `frontmatter-untranslated` uyarıları beklenebilir. Belge temasını veya i18n davranışını değiştirirken `docs/AGENTS.md` dosyasına uyun ve statik çıktı ile Pagefind uyumlu kalsın diye derlemeyi kök dizinden yapın.

## İsteğe bağlı anlamsal inceleme

Seçili i18next anahtarları için `scripts/jev/translation-README.md` dosyasını kullanın. Belge sayfaları için önce `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md` komutunu çalıştırın. Bu komut açık bir yerel ayar/sayfa seçimi gerektirir, yapısal doğrulayıcıyı çalıştırır ve canlı çıkarım etkinleştirilene kadar anlamsal incelemeyi doğrulanmamış olarak bildirir. `--live` seçeneğini yalnızca görevin sağlayıcı yetkilendirmesi ve bütçesi varsa ekleyin; kimlik bilgilerini ve sabitlenmiş bir modeli paylaşılan özel makine yapılandırması sağlar. Ortam değişkenleri ve `--model` bu kurulumu geçersiz kılabilir. Komut çevirileri hiçbir zaman düzenlemez.

Sayfa bağdaştırıcısı sayfanın bütün bağlamını korur; her sayfayı 24 KB ile, her çalıştırmayı da 30 çiftle sınırlar. Daha büyük sayfalar için `translations.mjs --pairs` aracına açıkça hizalanmış kaynak/çeviri paragraf çiftleri hazırlayın; paragrafları sıra numarasına göre otomatik olarak eşleştirmeyin. Anlamsal sonuçlar tavsiye niteliğindedir: bildirilen sorunları ve belirsizlikleri inceleyin, deterministik kod/bağlantı/adres kontrollerini de koruyun.
