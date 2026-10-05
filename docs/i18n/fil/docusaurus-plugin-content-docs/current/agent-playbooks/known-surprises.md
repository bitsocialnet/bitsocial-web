# Mga Kilalang Sorpresa

Sinusubaybayan ng file na ito ang mga punto ng pagkalitong tiyak sa repositoryong ito at nagdulot ng mga pagkakamali ng ahente.

## Pamantayan sa Pagpasok

Magdagdag lamang ng entry kung totoo ang lahat ng sumusunod:

- Tiyak ito sa repositoryong ito (hindi pangkalahatang payo).
- Malamang na maulit ito para sa mga susunod na ahente.
- May konkretong mitigasyon itong kayang sundin.

Kung hindi ka sigurado, tanungin muna ang developer bago magdagdag ng entry.

## Template ng Entry

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Mga Entry

### Maaaring bumalik ang mga production domain ng Vercel app sa mga deployment ng Git master

- **Petsa:** 2026-04-28
- **Naobserbahan ni:** Tommaso + Codex
- **Konteksto:** Pag-verify ng mga app mirror ng Seedit at 5chan sa app directory ng Bitsocial Web.
- **Ano ang nakakagulat:** May `gitProviderOptions.createDeployments = "enabled"` ang mga proyektong `seedit` at `5chan` sa Vercel, kaya isinusulong sa mga production domain ang mga push sa GitHub `master` kahit inaasahan ng patakaran ng repo na maghain lamang ng mga release artifact ang mga production app mirror.
- **Epekto:** Maaaring maging mali ang mga verified mirror badge sa app directory dahil naghahain ang mga production domain ng pinakabagong development commit sa halip na ng GitHub release ZIP na ang hash ng `index.html` ay nakatala sa `about/src/lib/apps-data.ts`.
- **Mitigasyon:** Bago magdagdag o mag-refresh ng metadata ng pag-verify ng mirror, suriin ang proyekto sa Vercel gamit ang `vercel api /v9/projects/<project-id>` at kumpirmahin ang `gitProviderOptions.createDeployments = "disabled"`. I-deploy ang nilalaman ng release ZIP gamit ang `vercel deploy --prebuilt --prod` at gamitin ang `seedit-omega.vercel.app` o `5chan-omega.vercel.app` para sa mga development deployment.
- **Katayuan:** nakumpirma

### Muling ginagamit ng Portless 0.11 ang lumang estado ng proxy maliban kung pipilitin ng launcher ang HTTPS

- **Petsa:** 2026-04-28
- **Naobserbahan ni:** Tommaso + Codex
- **Konteksto:** Pag-upgrade ng karaniwang daloy ng `yarn start` mula sa lumang proxy URL na `http://bitsocial.localhost:1355` patungo sa `https://bitsocial.localhost`.
- **Ano ang nakakagulat:** Kahit naka-install na ang `portless@0.11.1`, muling ginamit ng Portless ang umiiral na HTTP proxy na `~/.portless/proxy.port = 1355` at ipinakita nito ang lumang URL na `:1355`.
- **Epekto:** Hindi sapat ang pag-update ng mga bersyon ng package at ng dokumentasyon; maaari pa ring ianunsyo at gamitin ng `yarn start` ang lumang URL kapag may tumatakbong lumang estado ng Portless sa makina ng isang kontribyutor.
- **Mitigasyon:** Panatilihing tahasang sinisimulan ng mga start script ang Portless HTTPS proxy sa port `443` bago irehistro ang mga app route, upang lumayo ang runtime flow sa nakaimbak na estadong `1355` sa halip na manahin ito.
- **Katayuan:** nakumpirma

### Binabago ng Portless ang canonical na URL ng lokal na app

- **Petsa:** 2026-03-18
- **Naobserbahan ni:** Codex
- **Konteksto:** Mga daloy ng pag-verify sa browser at ng smoke check
- **Ano ang nakakagulat:** Ang default na lokal na URL ay hindi ang karaniwang Vite port. Inaasahan ng repo ang `https://bitsocial.localhost` sa pamamagitan ng Portless, kaya ang pagsuri sa `localhost:3000` o `localhost:5173` ay maaaring tumama sa maling app o sa wala man lang.
- **Epekto:** Maaaring mabigo ang mga pagsusuri sa browser o mapatunayan nila ang maling target kahit maayos ang dev server.
- **Mitigasyon:** Gamitin ang `https://bitsocial.localhost` muna. I-bypass lamang ito gamit ang `PORTLESS=0 corepack yarn start` kapag tahasang kailangan mo ng direktang Vite port.
- **Katayuan:** nakumpirma

### Hinaharangan ng mga Commitizen hook ang mga non-interactive na commit

- **Petsa:** 2026-03-18
- **Naobserbahan ni:** Codex
- **Konteksto:** Mga daloy ng commit na pinapatakbo ng ahente
- **Ano ang nakakagulat:** Pinapagana ng `git commit` ang Commitizen sa pamamagitan ng Husky at naghihintay ito ng interactive na TTY input, kaya nagha-hang ang mga non-interactive na shell ng ahente.
- **Epekto:** Maaaring tumigil nang walang katapusan ang mga ahente sa gitna ng dapat sana ay karaniwang commit.
- **Mitigasyon:** Gamitin ang `git commit --no-verify -m "message"` para sa mga commit na gawa ng ahente. Magagamit pa rin ng mga tao ang `corepack yarn commit` o `corepack yarn exec cz`.
- **Katayuan:** nakumpirma

### Kailangan ang Corepack upang maiwasan ang Yarn classic

- **Petsa:** 2026-03-19
- **Naobserbahan ni:** Codex
- **Konteksto:** Paglipat ng package manager patungong Yarn 4
- **Ano ang nakakagulat:** May global na pag-install pa rin ng Yarn classic ang makina sa `PATH`, kaya ang pagpapatakbo ng payak na `yarn` ay maaaring tumukoy sa v1 sa halip na sa naka-pin na bersyon ng Yarn 4.
- **Epekto:** Maaaring hindi sinasadyang malampasan ng mga developer ang package-manager pinning ng repo at makakuha ng ibang gawi sa pag-install o ibang output ng lockfile.
- **Mitigasyon:** Gamitin ang `corepack yarn ...` para sa mga shell command, o patakbuhin muna ang `corepack enable` upang tumukoy ang payak na `yarn` sa naka-pin na bersyon ng Yarn 4.
- **Katayuan:** nakumpirma

### Nagbabanggaan ang mga nakapirming pangalan ng Portless app sa mga worktree ng Bitsocial Web

- **Petsa:** 2026-03-30
- **Naobserbahan ni:** Codex
- **Konteksto:** Pagpapatakbo ng `yarn start` sa isang worktree ng Bitsocial Web habang may isa pang worktree na naghahain na sa pamamagitan ng Portless
- **Ano ang nakakagulat:** Ang paggamit ng literal na pangalan ng Portless app na `bitsocial` sa bawat worktree ay nagpapabanggaan mismo sa route, kahit magkaiba ang mga port sa likod nito, kaya nabibigo ang pangalawang proseso dahil nakarehistro na ang `bitsocial.localhost`.
- **Epekto:** Maaaring harangan ng magkakatabing sangay ng Bitsocial Web ang isa't isa kahit layunin ng Portless na payagan silang magsabay nang ligtas.
- **Mitigasyon:** Panatilihin ang pagsisimula ng Portless sa likod ng `scripts/start-dev.mjs`, na ngayon ay gumagamit ng branch-scoped na route na `*.bitsocial.localhost` sa labas ng canonical na kaso at bumabagsak sa isang branch-scoped na route kapag okupado na ang payak na pangalang `bitsocial.localhost`.
- **Katayuan:** nakumpirma

### Dating naka-hard-code sa port 3001 ang preview ng docs

- **Petsa:** 2026-03-30
- **Naobserbahan ni:** Codex
- **Konteksto:** Pagpapatakbo ng `yarn start` kasabay ng ibang lokal na repo at ahente
- **Ano ang nakakagulat:** Pinatatakbo ng root dev command ang docs workspace gamit ang `docusaurus start --port 3001`, kaya nabibigo ang buong dev session tuwing may ibang prosesong nagmamay-ari na ng `3001`, kahit gumagamit na ng Portless ang pangunahing app.
- **Epekto:** Maaaring patayin ng `yarn start` ang web process kaagad matapos itong mag-boot, na nakaaabala sa walang kaugnayang lokal na trabaho dahil lamang sa banggaan ng port ng docs.
- **Mitigasyon:** Panatilihin ang pagsisimula ng docs sa likod ng `yarn start:docs`, na ngayon ay gumagamit ng Portless kasama ang `scripts/start-docs.mjs` upang igalang ang isang na-inject na libreng port o bumagsak sa susunod na available na port kapag direktang pinatakbo.
- **Katayuan:** nakumpirma

### Naka-hard-code ang nakapirming Portless hostname ng docs

- **Petsa:** 2026-04-03
- **Naobserbahan ni:** Codex
- **Konteksto:** Pagpapatakbo ng `yarn start` sa isang pangalawang worktree ng Bitsocial Web habang may isa pang worktree na naghahain na ng docs sa pamamagitan ng Portless
- **Ano ang nakakagulat:** Nirerehistro pa rin ng `start:docs` ang literal na hostname na `docs.bitsocial.localhost`, kaya maaaring mabigo ang `yarn start` kahit alam na ng about app kung paano iwasan ang banggaan ng Portless route para sa sarili nitong hostname.
- **Epekto:** Hindi maaasahang magamit ng magkakatabing worktree ang root dev command dahil unang lumalabas ang docs process at pagkatapos ay pinapatay ng `concurrently` ang natitirang bahagi ng session.
- **Mitigasyon:** Panatilihin ang pagsisimula ng docs sa likod ng `scripts/start-docs.mjs`, na ngayon ay kumukuha ng parehong branch-scoped na Portless hostname gaya ng about app at nag-iinject ng nakabahaging pampublikong URL na iyon sa dev proxy target na `/docs`.
- **Katayuan:** nakumpirma

### Maaaring hindi makuha ng mga shell sa worktree ang naka-pin na bersyon ng Node ng repo

- **Petsa:** 2026-04-03
- **Naobserbahan ni:** Codex
- **Konteksto:** Pagpapatakbo ng `yarn start` sa mga Git worktree gaya ng `.claude/worktrees/*` o ng mga katabing worktree checkout
- **Ano ang nakakagulat:** May ilang shell sa worktree na tumukoy sa `node` at `yarn node` bilang Homebrew Node `25.2.1` kahit naka-pin ang repo sa `22.12.0` sa `.nvmrc`, kaya maaaring tahimik na patakbuhin ng `yarn start` ang mga dev launcher sa maling runtime.
- **Epekto:** Maaaring maglihis ang gawi ng dev server sa pagitan ng pangunahing checkout at ng mga worktree, kaya nagiging mahirap ulitin ang mga bug at nalalabag ang inaasahang Node 22 toolchain ng repo.
- **Mitigasyon:** Panatilihin ang mga dev launcher sa likod ng `scripts/start-dev.mjs` at `scripts/start-docs.mjs`, na ngayon ay muling nag-e-exec sa ilalim ng Node binary mula sa `.nvmrc` kapag nasa maling bersyon ang kasalukuyang shell. Dapat pa ring unahin ng shell setup ang `nvm use`.
- **Katayuan:** nakumpirma

### Maaaring itago ng mga natirang `docs-site/` ang nawawalang docs source pagkatapos ng refactor

- **Petsa:** 2026-04-01
- **Naobserbahan ni:** Codex
- **Konteksto:** Paglilinis ng monorepo pagkatapos ng merge nang ilipat ang proyektong Docusaurus mula sa `docs-site/` patungong `docs/`
- **Ano ang nakakagulat:** Maaaring manatili sa disk ang lumang folder na `docs-site/` kasama ang mga luma ngunit mahahalagang file gaya ng `i18n/`, kahit lumipat na sa `docs/` ang sinusubaybayang repo. Dahil dito, mukhang doble ang refactor sa lokal na makina at maitatago nito ang katotohanang hindi talaga nailipat sa `docs/` ang mga sinusubaybayang salin ng docs.
- **Epekto:** Maaaring burahin ng mga ahente ang lumang folder bilang “basura” at hindi sinasadyang mawala ang tanging lokal na kopya ng mga salin ng docs, o patuloy nilang i-edit ang mga script na nakaturo pa rin sa patay na landas na `docs-site/`.
- **Mitigasyon:** Ituring ang `docs/` bilang tanging canonical na proyekto ng docs. Bago burahin ang anumang natirang lokal na `docs-site/`, ibalik muna ang sinusubaybayang source gaya ng `docs/i18n/` at i-update ang mga script at hook upang tumigil sa pagtukoy sa `docs-site`.
- **Katayuan:** nakumpirma

### Maaaring pumalo ang paggamit ng RAM ng multilocale docs preview habang nagve-verify

- **Petsa:** 2026-04-01
- **Naobserbahan ni:** Codex
- **Konteksto:** Pag-aayos ng docs i18n, locale routing, at gawi ng Pagefind gamit ang `yarn start:docs` kasama ang Playwright
- **Ano ang nakakagulat:** Gumagawa na ngayon ang default na mode ng docs preview ng buong multilocale docs build kasama ang Pagefind indexing bago ito maghain, at ang pagpapanatiling buhay sa prosesong iyon kasabay ng maraming session ng Playwright o Chrome ay maaaring kumonsumo ng mas maraming RAM kaysa sa karaniwang Vite o single-locale na Docusaurus dev loop.
- **Epekto:** Maaaring maubusan ng memorya ang makina, maaaring mag-crash ang mga session ng browser, at maaaring mag-iwan ang mga naantalang pagpapatakbo ng lumang docs server o headless browser na patuloy na kumakain ng memorya.
- **Mitigasyon:** Para sa gawaing docs na hindi nangangailangan ng pag-verify ng locale route o Pagefind, mas piliin ang `DOCS_START_MODE=live yarn start:docs`. Gamitin lamang ang default na multilocale preview kapag kailangan mong patunayan ang mga isinaling route o ang Pagefind. Panatilihing iisa ang session ng Playwright, isara ang mga lumang session ng browser bago magbukas ng bago, at ihinto ang docs server pagkatapos mag-verify kung hindi mo na ito kailangan.
- **Katayuan:** nakumpirma

### Maaaring mag-iwan ang `translate-docs.py` ng kalahating naisaling docs locale o ng mga sirang link target

- **Petsa:** 2026-04-06
- **Naobserbahan ni:** Codex
- **Konteksto:** Pag-aayos ng mga na-localize na docs route at nilalaman matapos maghain ang `yarn start:docs` ng mga detail page sa Ingles o mabigo itong bumuo ng output para sa locale
- **Ano ang nakakagulat:** May dalawang magkasabay na paraan ng pagkabigo na tiyak sa repong ito ang docs translation pipeline: kumukuha lamang ang `scripts/translate-docs.py` ng maliit na bahagi ng mga mensahe ng `DocsHome` kapag gumamit ang mga tawag na `tr(...)` ng mga anyong hindi nito nauunawaan, at maaaring maglaman ang isinaling markdown sa ilalim ng `docs/i18n/**` ng mga slug na isinalin ng makina o ng mga artifact na `ZXQPLACEHOLDER` sa loob ng mga link target.
- **Epekto:** Maaaring tahimik na bumalik sa Ingles ang mga na-localize na homepage, maaaring magmukhang hindi naisalin ang mga na-localize na detail page, at maaaring mabigo ang buong `yarn docs:build` dahil sa mga sirang link ng locale kahit balido ang source docs.
- **Mitigasyon:** Pagkatapos baguhin ang mga salin ng docs o muling buuin ang mga file ng locale, palaging patakbuhin ang `yarn docs:build` mula sa root ng repo, i-scan ang markdown sa `docs/i18n/**` para sa `ZXQPLACEHOLDER`, at tiyaking nakaturo pa rin ang mga isinaling link sa mga canonical na doc slug gaya ng `/apps/5chan/` sa halip na sa mga isinaling landas ng URL. Kung nagbago ang teksto ng `DocsHome`, kumpirmahing kinukuha pa rin ng `scripts/translate-docs.py` ang lahat ng mensaheng `docs.home.*`.
- **Katayuan:** nakumpirma

### Dapat gamitin ng mga no-JS na pagsusuri sa about site ang Portless route, hindi ang hiwalay na SSR preview

- **Petsa:** 2026-04-12
- **Naobserbahan ni:** Codex
- **Konteksto:** Pag-verify ng suporta sa no-JS para sa site na `about/` mula sa isang worktree ng sangay
- **Ano ang nakakagulat:** Maaaring mukhang maayos ang isang hiwalay na SSR preview samantalang ang tunay na branch-scoped na Portless route ay naghahain pa rin ng maling app shell o ng isang lumang proseso. Sa repong ito, ang tunay na lokal na kasunduan ay ang Portless hostname mula sa `yarn start`, hindi ang isang pansamantalang preview server.
- **Epekto:** Maaaring maling ideklara ng mga ahente na gumagana ang suporta sa no-JS, o hindi nila mapansin ang mga regression na lumalabas lamang sa `*.bitsocial.localhost`.
- **Mitigasyon:** Para sa pag-verify sa browser ng `about/`, palaging simulan ang tunay na lokal na server gamit ang `yarn start` o `yarn start:about` at subukan muna ang branch-scoped na Portless URL. Kung mukhang luma ang isang Portless hostname, suriin at ihinto ang lumang proseso bago muling sumubok.
- **Katayuan:** nakumpirma

### Hindi nakikita ang `chain/` ng `yarn build:verify` at ng `yarn doctor`

- **Petsa:** 2026-07-05
- **Naobserbahan ni:** Codex
- **Konteksto:** Pag-verify ng isang diff na para lamang sa chain/ matapos idagdag sa monorepo ang workspace na `chain/` (hiwalay na Vite app para sa `chain.bitsocial.net`).
- **Ano ang nakakagulat:** Kinikilala lamang ng `scripts/verify-build.mjs` ang mga path prefix na `about/`, `docs/`, at `stats/`, kaya ang diff na para lamang sa chain/ ay nagpi-print ng "No targeted build checks matched the current diff" at hindi nagpapatakbo ng anumang build, kahit umiiral na ang `build:chain` sa root na `package.json`. Bukod pa riyan, naka-hard-code ang `yarn doctor` sa `react-doctor about -y`, kaya walang anumang saklaw ng React Doctor ang mga pagbabago sa React sa ilalim ng `chain/src`.
- **Epekto:** Kailangang alam ng mga ahenteng nagve-verify ng mga pagbabago sa chain na tawagin nang direkta ang `yarn build:chain` sa halip na magtiwala sa `yarn build:verify`, at hindi natutukoy ng `yarn doctor` ang mga isyu sa React sa `chain/src` (mga effect, hook, patay na code).
- **Mitigasyon:** May sangay na para sa `chain/` ngayon ang `scripts/verify-build.mjs` na katulad ng sa `about/`, at pinapatakbo na ng `doctor` / `doctor:verbose` ang `react-doctor --project about,chain -y` sa iisang tawag. Nananatiling para lamang sa `about` ang `doctor:score` dahil tahimik na walang ipi-print ang `--score` kapag isinama ito sa `--project` para sa mahigit isang proyekto; gamitin ang `yarn react-doctor --project about,chain --verbose -y` (o `--json`) kung kailangan ang score para sa chain.
- **Katayuan:** nakumpirma

### Tumatakbo ang browser P2P sa secure na WebSockets; tinatanggihan ng pkc-js ang WebRTC at WebTransport bilang default

- **Petsa:** 2026-08-02
- **Naobserbahan ni:** Claude
- **Konteksto:** Pagsulat ng teksto para sa landing page at docs tungkol sa kung paano gumagana ang Bitsocial browser P2P
- **Ano ang nakakagulat:** Naghahatid ang `@pkcprotocol/pkc-js` ng default na connection gater na tumatanggi sa mga dial ng WebRTC at WebTransport sa browser — ini-export ng `dist/browser/helia/dial-transport-filter.js` ang `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Ibinibigay ng komento sa source nito ang dahilan: sa browser, nagdaragdag ang mga transport na iyon ng mahaba at madalas nabibigong landas ng pagbuo ng koneksyon (STUN/ICE, certhash rotation) na nagpapabagal sa pag-load, samantalang direkta at maaasahan ang WebSocket. Bawat buhay na peer sa P2P status panel ng blog ay nagpapakita ng "Secure WebSocket". Nasa `node_modules` ang gater, kaya walang anuman sa repo ang nagpapahiwatig nito.
- **Epekto:** Napakadaling makasulat ng pampublikong tekstong mukhang makatwiran sa teknikal na paraan ngunit mali — halimbawa, ang pagbibigay ng kredito sa pag-abot ng WebTransport sa browser Baseline noong Marso 2026 para sa pagiging posible ng Bitsocial browser P2P. Nakarating ang pahayag na iyon sa landing page, sa comparison table, at sa dalawang pahina ng docs bago ito nahuli ng developer. Ang mga maling pahayag tungkol sa arkitektura sa mga pampublikong pahina ay sinusuri mismo ng mga developer na siyang target na audience ng site.
- **Mitigasyon:** Huwag kailanman hulaan kung aling mga transport ang ginagamit ng Bitsocial batay lamang sa kung ano ang sinusuportahan ng libp2p o ng browser platform sa prinsipyo. Suriin ang `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` para sa kasalukuyang deny list, kumpirmahing walang override na `connectionGater` sa ilalim ng `about/src/`, at basahin ang mga live na label ng transport sa "P2P status" panel ng blog bago gumawa ng anumang pampublikong pahayag. Ang upstream na pagbabagong talagang nagbukas ng daan para sa pag-publish mula sa browser ay ang pag-aayos ng monotonic seqno ng gossipsub sa `@libp2p/gossipsub` 15.0.21 (Mayo 2026); kasalukuyang naghahatid ang pkc-js ng 16.0.4.
- **Katayuan:** nakumpirma

### Sinisira ng mga relatibong link na `./page.md` mula sa isang hindi naisaling docs page ang bawat localized na build

- **Petsa:** 2026-08-02
- **Naobserbahan ni:** Claude
- **Konteksto:** Pagdaragdag ng bagong pahinang Ingles lamang, `docs/browser-p2p.md`, na nag-link sa mga umiiral na docs gamit ang `./peer-to-peer-protocol.md` at `./apps/5chan.md`
- **Ano ang nakakagulat:** Sinasalamin ng bawat locale sa ilalim ng `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` ang puno ng docs. Ang bagong pahinang wala sa mga salaming iyon ay nire-render pa rin sa bawat locale sa pamamagitan ng English fallback, ngunit hindi na tumutugma ang mga relatibong markdown link nito — naglalabas ang Docusaurus ng `/ar/browser-p2p/peer-to-peer-protocol.md/` at nabibigo ang build na may "Docusaurus found broken links!". Ang mahalaga, binubuo lamang ng `yarn build:verify` at ng `yarn docs:build:verify` ang `en` at malinis silang nakakapasa; tanging ang buong `yarn docs:build` ang naglalabas nito, at humihinto ito sa unang locale ayon sa alpabeto (`ar`).
- **Epekto:** Maaaring makapasa ang isang pagbabago sa docs sa lahat ng mabilisang lokal na pagsusuri at masira pa rin nito ang production multilocale build. Mukhang walang kaugnayan din ang pagkabigo sa pagbabago, dahil pinapangalanan ng error ang isang landas ng locale na hindi kailanman hinawakan ng may-akda.
- **Mitigasyon:** Sa anumang docs page na hindi sinasalamin sa `docs/i18n/**`, gumamit ng root-relative na link (`/peer-to-peer-protocol/`, `/apps/5chan/`) sa halip na relatibong link na `.md`; awtomatikong nilalagyan ng Docusaurus ang mga ito ng prefix ng locale. Ang umiiral na halimbawa ay ang `docs/build-your-own-client.md`. Patakbuhin ang buong `yarn docs:build` — hindi lamang ang `build:verify` — bago iabot ang anumang pagbabagong nagdaragdag o nag-link ng isang docs page.
- **Katayuan:** nakumpirma

### Tahimik na nawawalan ng mga key ang sabayang pagpapatakbo ng `update-translations.js`

- **Petsa:** 2026-08-02
- **Naobserbahan ni:** Claude
- **Konteksto:** Paglalapat ng 26 na isinaling i18next key sa lahat ng 36 na locale sa pamamagitan ng `translate` skill
- **Ano ang nakakagulat:** Ang bawat tawag ay isang read-modify-write sa lahat ng 36 na file ng locale, kaya nagpapatungan ang dalawang tawag na sabay tumatakbo at nawawala ang isang key nang walang error. Tahasang nag-uutos ang `translate` skill na maglunsad ng hanggang 4 na subagent nang sabay, at bawat isa sa kanila ay tatawag sa script.
- **Epekto:** Tahimik itong nabibigo: nawawala ang mga key mula sa mga di-tiyak na locale, at mukhang makatwiran pa rin ang diff.
- **Mitigasyon:** Huwag kailanman hayaang sabay na magsulat ng mga file ng locale ang mga subagent na tagasalin — hayaan silang maglabas lamang ng mga JSON file ng diksyunaryo, at saka ilapat ang bawat key nang sunod-sunod mula sa magulang na ahente. Pagkatapos ilapat, patunayan sa pamamagitan ng programa na umiiral ang bawat key sa lahat ng 35 na locale na hindi Ingles at walang halagang byte-identical sa source na Ingles.
- **Katayuan:** nakumpirma
- **Pag-update (2026-08-10):** Dati ring tinutukoy ng script ang target nito bilang `path.join(process.cwd(), "public", "translations")`, kaya nabibigo ang nakadokumentong command mula sa root ng repo nang may "Translations directory not found" at kinailangan itong patakbuhin mula sa `about/`. Tinutukoy na nito ngayon ang workspace mula sa kasalukuyang direktoryo o mula sa sarili nitong lokasyon, at gumagana ito mula saanman. Hindi nagbago ang bitag sa concurrency na nasa itaas.

### Maaaring maharang ng mga development annotation control ang mga click na isinasagawa ng automation

- **Konteksto:** May mga nakapirming control sa kanang-ibabang sulok ang about site at ang chain site, kung saan lumalabas din ang Agentation toolbar habang nasa development.
- **Mitigasyon:** Inirerehistro ng `scripts/pw-session.sh open` ang `window.__NO_DEV_TOOLBAR__ = true` bago i-reload ang pahina. Iginagalang din ng Agentation initializer ang `__VISUAL_TESTING__` at `__PROFILING__`; nananatiling available nang hiwalay ang source inspection. Kailangang itakda ng direktang browser automation ang parehong flag bago i-load ang application.

### Nag-i-install ang `skills add` ng mga kopya para sa Codex at Cursor sa naka-gitignore na direktoryong `.agents/`

- **Petsa:** 2026-08-18
- **Naobserbahan ni:** Tommaso + Claude
- **Konteksto:** Pag-install ng `improve-threejs` skill mula sa `millionco/react-doctor` gamit ang `skills` CLI (`vercel-labs/skills`).
- **Ano ang nakakagulat:** Parehong nagsusulat ang `npx skills add <repo> --skill <name> --agent codex` at ang `--agent cursor` sa `.agents/skills/<name>/`, hindi sa `.codex/skills/` o `.cursor/skills/`. Ipinagbabawal ng `AGENTS.md` ang isang `.agents/` na direktoryo sa antas ng repo at ini-ignore ito ng `.gitignore:29`, kaya tahimik na hindi nasusubaybayan ang parehong kopya. Tanging ang `--agent claude-code` ang nagsusulat sa inaasahang `.claude/skills/`. Bukod pa riyan, nabibigo ang nakadokumentong anyong pinaghihiwalay ng kuwit (`--agent claude-code,codex,cursor`) nang may "Invalid agents" at walang ini-install, kahit balido ang bawat pangalan nang mag-isa.
- **Epekto:** Nag-uulat ng tagumpay ang pag-install habang napupunta ang dalawa sa tatlong kopya ng toolchain sa isang lugar na hindi kailanman maku-commit, kaya tahimik na nawawalan ng skill ang Codex at Cursor pagkatapos ng bagong clone. Maaari ring magresulta ang anyong may kuwit sa isang pag-install na walang ginawa ngunit mukhang matagumpay.
- **Kasalukuyang mitigasyon:** Sinusubaybayan na ngayon ng repository ang `.agents/skills` bilang canonical na source nito at bumubuo ito ng mga kopya para sa Claude gamit ang `yarn ai-workflow:sync`. Inalis na ang dating pagbabawal sa `.agents` at ang panuntunan sa pag-ignore nito. Huwag kopyahin ang mga bagong skill sa tatlong magkakahiwalay na root; suriin ang parity ng mga nabuong file at ang catalog ng app pagkatapos magdagdag ng skill.
- **Katayuan:** nakumpirma
