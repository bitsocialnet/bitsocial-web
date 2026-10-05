# Pag-verify

Pumili ng mga pagsusuri batay sa nagbagong gawi at sa natitirang kawalang-katiyakan. Muling gamitin ang matagumpay na ebidensiya para sa parehong huling estado; muling magpatakbo pagkatapos ng mga kaugnay na pag-edit o pagkabigo. Nalalapat pa rin ang mga tahasang kinakailangan ng CI/release/user.

| Pagbabago                                                           | Angkop na mga pagsusuri                                                                                                                |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Prosa/mga komento/pag-format lamang                                 | Diff, mga reference, mga kaugnay na generator; walang app build                                                                        |
| Mga source/configuration ng AI workflow                             | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; muling buuin ang mga LLM index kapag nagbago ang konteksto |
| Hiwalay na helper o script                                          | Nakatutok na pagpapatakbo/mga fixture at mga pagsusuri sa syntax o type/lint para sa apektadong code                                   |
| Pagbabago sa nakabahaging runtime, dependency, build, o integration | Nakatutok na mga pagsusuri sa apektadong bahagi kasama ang mga kaugnay na pagsusuri sa build/type/lint sa ibaba                        |
| CSS/theme/layout lamang                                             | Mga apektadong route/viewport/theme sa mga napiling browser; build kapag nagbago ang mga import, asset, o pagproseso ng CSS            |
| React state/effects/performance                                     | Apektadong gawi at naaangkop na gabay sa React; Doctor kapag malulutas ng diagnostics nito ang isang konkretong alalahanin             |

## Mga pagsusuri ng proyekto

- Pinipili ng `yarn build:verify` ang apektadong workspace. Para sa kilalang saklaw, gamitin ang `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor`, o `yarn docs:build:verify`.
- Sadyang pinapatakbo ng `yarn build` ang buong production build ng about/docs, kasama ang lahat ng docs locale. Gamitin ito para sa pag-validate na saklaw ang buong release o para sa mga pagbabagong nangangailangan ng ganoong saklaw.
- Saklaw ng `yarn lint`, `yarn typecheck`, at `yarn format:check` ang mga umiiral na gate ng repository; para sa makitid na pag-edit ng script, gamitin muna ang mga nakatutok na pagsusuri nito sa syntax/fixture/format.
- Nangangailangan ang mga pagbabago sa manifest/lock ng `corepack yarn install`, `yarn deps:check-pinned`, at `yarn deps:check-hardened`. Advisory lamang ang `yarn knip` para sa mga dependency/import.
- Nasa [translations.md](translations.md) ang mga pagsusuri sa salin ng docs; huwag patakbuhin ang bulk translation writer para sa isang nakatutok na pagbabago sa docs.

## Ebidensiya sa browser at pagmamay-ari

Gamitin ang Chrome para sa maliliit at hiwalay na pagbabago sa browser. Idagdag ang Firefox at WebKit para sa nakabahaging CSS/layout/responsiveness, mga API na sensitibo sa browser, malawakang interaksyon, mga release, o tahasang pamantayang cross-browser. Isama ang mga apektadong mobile layout/gawi sa touch. Hindi touch emulation ang simpleng pag-resize ng viewport. Pumili ng aktwal na mga route at nilalaman mula sa source sa halip na ipagpalagay na available ang mga halimbawa.

Gamitin ang `playwright-cli` sa pamamagitan ng `./scripts/pw-session.sh`. Iisang browser lamang ang aktibo sa buong makina; sunod-sunod na tumatakbo ang mga napiling engine at isinasara ang bawat eksaktong session na pagmamay-ari mo kahit may pagkabigo. Muling gamitin ang isang awtorisadong session na pagmamay-ari ng tumawag nang hindi ito isinasara. Huwag kailanman gumamit ng pandaigdigang paglilinis ng browser o huminto ng server na hindi malinaw kung sino ang may-ari. Walang kailangang browser/server para sa gawaing dokumentasyon lamang.

Para sa gawaing pang-performance, ihambing ang parehong daloy na may katumbas na viewport, nilalaman, mga setting ng network/CPU, build mode, at overhead ng pagsukat. Ihiwalay ang mga obserbasyon sa mga pinaghihinalaang sanhi. Gamitin ang profile skill kapag sinasagot ng mga pagsukat na ito ang aktwal na kahilingan.

## Panghuling ebidensiya

Iisang ahente ang may-ari ng mabigat na pag-verify. Suriin ang mga aktibong workload at patakbuhin nang sunod-sunod ang mga install, build/buong suite, Doctor, gawain sa Android/Electron, at pag-profile sa browser. Iulat ang mga command/kinalabasan at ang mga tiyak na limitasyon; hindi pumapasang resulta ang kulang na datos o ang nilaktawang engine. Bine-verify ng mga tooling fixture ang mga format at mekanika, hindi ang end-to-end na pagtuklas sa app o ang kalidad ng desisyon ng modelo.

## Mga awtomatikong pagsusuri sa React

Pinapatakbo ng `yarn agent:verify` ang mga napiling build at pagkatapos ay ang `yarn doctor:check` at `yarn perf:check`. Kasama sa `perf:check` ang selftest para sa compatibility ng collector at sa sinasadyang regression, kaya hindi na kailangan ng CI o ng daan ng pag-verify ng ahente ang hiwalay na pass ng `perf:test`. I-install nang isang beses ang naka-pin na browser tooling gamit ang `yarn perf:install` (`--with-deps` sa Linux CI). Gumamit ng mga filter ng target/scenario para sa mga nakatutok na muling pagpapatakbo pagkatapos ng buong kaugnay na pass. Tahasang nakatakda ang mga budget ng scenario sa `scripts/react-perf/config.mjs`; panatilihin ang ebidensiya at ayusin ang regression bago isaalang-alang ang isang makatwirang pagbabago sa baseline. Hindi isinasama ng mga ordinaryong production build ang Bippy; nagbibigay ang hiwalay na mga command na `build:profile:*` ng opisyal na instrumentation para sa React profiling.

Ang takbo ng scenario na `apps-search` ng about ay idinidikta ng mga naka-commit na URL/input value para sa bawat character. Saklaw ng pumapasang resulta nito ang naka-commit na pagkakasunod-sunod ng query na iyon, hindi ang pagtugon sa mabilis na pagta-type. Gumamit ng hiwalay na reproduksyon na may mabilis na input kapag sinusuri ang pagkawala ng character o ang pagtugon sa input.
