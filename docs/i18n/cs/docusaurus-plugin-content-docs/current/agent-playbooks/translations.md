# Překlady

Web about používá JSON pro i18next v `about/public/translations/{lang}/default.json`. Zdrojové překlady pro Docusaurus žijí odděleně v `docs/i18n/`.

## Klíče webu about

Použijte `.agents/skills/translate/SKILL.md`. Aktuální jazykové verze zjistěte z disku a zachovejte zástupné symboly, značkování, technické termíny a názvy značek. U větších požadavků mohou podřízení agenti generovat nezávislé mapy, ale všechny zápisy do jazykových verzí provádí postupně jediný rodičovský agent; aktualizační skript nemá zámek pro zápis.

Použijte jedinečnou cestu k mapě, kterou vlastní daná úloha. Náhled si zobrazte pomocí `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` a pak změny aplikujte se stejnými argumenty a `--write`. Po zápisu ověřte pokrytí a hodnoty a odstraňte pouze dočasné mapy, které vlastní tato úloha.

Pro vyžádaná odstranění použijte `--delete`. Před autorizovaným `--audit --write` si prohlédněte zjištění z `--audit --dry`; dynamické překladové klíče vyžadují ruční kontrolu zdrojového kódu. Anglický text kopírujte do všech jazykových verzí jen u technického termínu, značky nebo zástupného symbolu.

## Stránky Docusaurus

`scripts/translate-docs.py` je hromadný zapisovač pro všechny stránky a jazykové verze a nemá filtr pro jednotlivé soubory; pro úzkou úpravu překladu ho nepoužívejte. `scripts/check-docs-translations.py` je ověřovač pouze pro čtení a podporuje `--locales` a `--paths`.

Bloky kódu, odkazy, inline kód, adresy kontraktů, nadpisy, tabulky a bloky upozornění (admonitions) udržujte v souladu s anglickým zdrojem. Chyby ověřovače vyřešte; varování `frontmatter-untranslated` u názvů značek lze očekávat. Řiďte se `docs/AGENTS.md`, a když měníte motiv dokumentace nebo chování i18n, sestavujte přes kořen repozitáře, aby statický výstup a Pagefind zůstaly v souladu.

## Volitelná sémantická revize

Pro vybrané klíče i18next použijte `scripts/jev/translation-README.md`. U stránek dokumentace nejprve spusťte `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Příkaz vyžaduje explicitní výběr jazykových verzí a stránek, spustí strukturální ověřovač a sémantickou revizi hlásí jako neověřenou, dokud není povolena živá inference. `--live` přidejte jen tehdy, když má úloha autorizaci pro použití poskytovatele a rozpočet; přihlašovací údaje a připnutý model dodává sdílená soukromá konfigurace stroje. Toto nastavení lze přepsat proměnnými prostředí a parametrem `--model`. Příkaz nikdy neupravuje překlady.

Adaptér pro stránky zachovává kontext celé stránky a omezuje každou stránku na 24 KB a každý běh na 30 dvojic. U větších stránek připravte pro `translations.mjs --pairs` explicitně zarovnané dvojice odstavců zdroje a překladu; nepárujte odstavce automaticky podle indexu. Sémantické výsledky mají poradní charakter: prohlédněte si nahlášené problémy a míru nejistoty a ponechte deterministické kontroly kódu, odkazů a adres.
