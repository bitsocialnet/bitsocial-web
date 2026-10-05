# Mga salin

Gumagamit ang about site ng i18next JSON sa `about/public/translations/{lang}/default.json`. Hiwalay na nakalagay sa `docs/i18n/` ang mga salin ng source ng Docusaurus.

## Mga key ng about site

Gamitin ang `.agents/skills/translate/SKILL.md`. Tuklasin ang kasalukuyang mga locale mula sa disk at panatilihin ang mga placeholder, markup, teknikal na termino, at brand name. Para sa mas malalaking kahilingan, maaaring bumuo ang mga anak na ahente ng mga independiyenteng mapa, ngunit iisang magulang na ahente ang naglalapat ng bawat pagsulat sa locale nang sunod-sunod; walang writer lock ang updater.

Gumamit ng natatanging path ng mapa na pagmamay-ari ng gawain. I-preview gamit ang `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, at saka ilapat gamit ang parehong mga argumento at `--write`. I-verify ang saklaw/mga halaga pagkatapos magsulat at alisin lamang ang mga pansamantalang mapa na pagmamay-ari ng gawaing ito.

Gamitin ang `--delete` para sa mga hiniling na pag-alis. Suriin ang mga natuklasan ng `--audit --dry` bago ang isang awtorisadong `--audit --write`; nangangailangan ng manwal na pagsusuri sa source ang mga dynamic na translation key. Kopyahin lamang ang Ingles sa bawat locale para sa isang teknikal na termino, brand, o placeholder.

## Mga pahina ng Docusaurus

Ang `scripts/translate-docs.py` ay isang bulk writer para sa lahat ng pahina/locale at walang filter kada file; huwag itong gamitin para sa makitid na pag-edit ng salin. Ang `scripts/check-docs-translations.py` ang read-only na verifier at sinusuportahan nito ang `--locales` at `--paths`.

Panatilihing nakahanay sa source na Ingles ang mga code fence, link, inline code, contract address, heading, table, at admonition. Lutasin ang mga error ng verifier; maaaring asahan ang mga babalang `frontmatter-untranslated` para sa brand name. Sundin ang `docs/AGENTS.md` at mag-build mula sa root kapag binabago ang docs theme o ang gawi ng i18n para manatiling nakahanay ang static output at ang Pagefind.

## Opsyonal na semantic review

Para sa mga piling i18next key, gamitin ang `scripts/jev/translation-README.md`. Para sa mga pahina ng dokumentasyon, patakbuhin muna ang `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Nangangailangan ito ng tahasang pagpili ng locale/pahina, pinapatakbo nito ang structural verifier, at iniuulat nitong hindi pa na-verify ang semantic review hangga't hindi naka-enable ang live inference. Idagdag lamang ang `--live` kapag may awtorisasyon ng provider at budget ang gawain; ang nakabahaging pribadong configuration ng makina ang nagbibigay ng mga credential at ng naka-pin na modelo. Maaaring i-override ng mga environment variable at ng `--model` ang setup na iyon. Hindi kailanman nag-e-edit ng mga salin ang command.

Pinapanatili ng page adapter ang konteksto ng buong pahina at nililimitahan nito ang bawat pahina sa 24 KB at ang bawat run sa 30 pares. Para sa mas malalaking pahina, maghanda ng tahasang nakahanay na mga pares ng talata ng source/salin para sa `translations.mjs --pairs`; huwag awtomatikong ipares ang mga talata ayon sa index. Payo lamang ang mga resulta ng semantic review: suriin ang mga iniulat na isyu at kawalang-katiyakan, at panatilihin ang mga deterministic na pagsusuri sa code/link/address.
