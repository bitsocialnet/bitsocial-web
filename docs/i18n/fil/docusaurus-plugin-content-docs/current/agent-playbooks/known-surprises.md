# Mga Kilalang Sorpresa

Sinusubaybayan ng file na ito ang mga punto ng kalituhan na partikular sa repositoryo na nagdulot ng mga pagkakamali ng ahente.

## Pamantayan sa Pagpasok

Magdagdag lang ng entry kung totoo ang lahat:

- Ito ay partikular sa repositoryong ito (hindi generic na payo).
- Ito ay malamang na maulit para sa hinaharap na mga ahente.
- Mayroon itong konkretong pagpapagaan na maaaring sundin.

Kung hindi sigurado, magtanong sa developer bago magdagdag ng entry.

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

## Mga entry

### Binabago ng Portless ang canonical na URL ng lokal na app

- **Petsa:** 2026-03-18
- **Inobserbahan ni:** Codex
- **Konteksto:** Pag-verify ng browser at umaagos ang usok
- **Ano ang nakakagulat:** Ang default na lokal na URL ay hindi ang karaniwang Vite port. Inaasahan ng repo ang `https://bitsocial.localhost` sa pamamagitan ng Portless, kaya ang pagsuri sa `localhost:3000` o `localhost:5173` ay maaaring matamaan ang maling app o wala talaga.
- **Epekto:** Maaaring mabigo o mapatunayan ng mga pagsusuri sa browser ang maling target kahit na malusog ang dev server.
- **Mitigation:** Gamitin muna ang `https://bitsocial.localhost`. I-bypass lang ito gamit ang `PORTLESS=0 corepack yarn start` kapag tahasang kailangan mo ng direktang Vite port.
- **Status:** nakumpirma

### Hinaharang ng mga commitizen hook ang mga non-interactive na commit

- **Petsa:** 2026-03-18
- **Inobserbahan ni:** Codex
- **Konteksto:** Mga daloy ng trabaho sa commit na hinimok ng ahente
- **Ano ang nakakagulat:** Na-trigger ng `git commit` ang Commitizen sa pamamagitan ng Husky at naghihintay ng interactive na input ng TTY, na nag-hang ng mga non-interactive na shell ng ahente.
- **Epekto:** Maaaring tumigil ang mga ahente nang walang tiyak na oras sa panahon ng dapat ay isang normal na commit.
- **Mitigation:** Gamitin ang `git commit --no-verify -m "message"` para sa mga commit na ginawa ng ahente. Magagamit pa rin ng mga tao ang `corepack yarn commit` o `corepack yarn exec cz`.
- **Status:** nakumpirma

### Kinakailangan ang Corepack para maiwasan ang Yarn classic

- **Petsa:** 2026-03-19
- **Inobserbahan ni:** Codex
- **Konteksto:** Ang paglipat ng manager ng package sa Yarn 4
- **Ano ang nakakagulat:** Ang makina ay mayroon pa ring pandaigdigang pag-install ng Yarn classic sa `PATH`, kaya ang pagpapatakbo ng plain na `yarn` ay maaaring malutas sa v1 sa halip na ang naka-pin na bersyon ng Yarn 4.
- **Epekto:** Maaaring ma-bypass ng mga developer ang pagpi-pin ng package-manager ng repo at makakuha ng ibang gawi sa pag-install o output ng lockfile.
- **Mitigation:** Gamitin ang `corepack yarn ...` para sa mga shell command, o patakbuhin muna ang `corepack enable` upang ang plain na `yarn` ay malutas sa naka-pin na bersyon ng Yarn 4.
- **Status:** nakumpirma

### Ang mga nakapirming Portless na pangalan ng app ay nagbabanggaan sa mga worktree ng Bitsocial Web

- **Petsa:** 2026-03-30
- **Inobserbahan ni:** Codex
- **Context:** Nagsisimula ang `yarn start` sa isang Bitsocial Web worktree habang ang isa pang worktree ay nagsisilbi na sa pamamagitan ng Portless
- **Ano ang nakakagulat:** Ang paggamit ng literal na Portless na pangalan ng app na `bitsocial` sa bawat worktree ay nagiging sanhi ng pagbangga mismo ng ruta, kahit na magkaiba ang mga backing port, kaya nabigo ang pangalawang proseso dahil nakarehistro na ang `bitsocial.localhost`.
- **Epekto:** Maaaring i-block ng mga parallel Bitsocial Web branch ang isa't isa kahit na ang Portless ay nilayon upang hayaan silang magkasamang mabuhay nang ligtas.
- **Mitigation:** Panatilihin ang Portless startup sa likod ng `scripts/start-dev.mjs`, na ngayon ay gumagamit ng isang branch-scoped `*.bitsocial.localhost` na ruta sa labas ng canonical case at bumabalik sa isang branch-scoped na ruta kapag ang hubad na `bitsocial.localhost` na pangalan ay okupado na.
- **Status:** nakumpirma

### Docs preview na ginamit sa hard-code port 3001

- **Petsa:** 2026-03-30
- **Inobserbahan ni:** Codex
- **Konteksto:** Tumatakbo ang `yarn start` kasama ng iba pang mga lokal na repo at ahente
- **Ano ang nakakagulat:** Ang root dev command ay nagpatakbo sa docs workspace na may `docusaurus start --port 3001`, kaya ang buong dev session ay nabigo sa tuwing may isa pang proseso na nagmamay-ari na ng `3001`, kahit na ang pangunahing app ay gumagamit na ng Portless.
- **Epekto:** Maaaring patayin ng `yarn start` ang proseso ng web kaagad pagkatapos itong mag-boot, na nakakaabala sa hindi nauugnay na lokal na gawain dahil sa banggaan ng docs-port.
- **Mitigation:** Panatilihin ang docs startup sa likod ng `yarn start:docs`, na ngayon ay gumagamit ng Portless plus `scripts/start-docs.mjs` upang bigyan ng parangal ang isang injected na libreng port o bumalik sa susunod na available na port kapag direktang tumakbo.
- **Status:** nakumpirma

### Ang mga nakapirming docs Portless hostname ay hard-coded

- **Petsa:** 2026-04-03
- **Inobserbahan ni:** Codex
- **Context:** Tumatakbo ang `yarn start` sa pangalawang Bitsocial Web worktree habang ang isa pang worktree ay naghahatid na ng mga doc sa pamamagitan ng Portless
- **Ano ang nakakagulat:** Nirehistro pa rin ng `start:docs` ang literal na `docs.bitsocial.localhost` hostname, kaya maaaring mabigo ang `yarn start` kahit na alam na ng about app kung paano maiwasan ang mga banggaan ng Portless na ruta para sa sarili nitong hostname.
- **Epekto:** Hindi maaasahang gamitin ng mga parallel worktree ang root dev command dahil ang proseso ng doc ay unang lumabas at `concurrently` pagkatapos ay pinatay ang natitirang bahagi ng session.
- **Mitigation:** Panatilihin ang docs startup sa likod ng `scripts/start-docs.mjs`, na ngayon ay nakukuha ang parehong branch-scoped Portless hostname bilang tungkol sa app at mga inject na nagbahagi ng pampublikong URL sa `/docs` dev proxy target.
- **Status:** nakumpirma

### Maaaring makaligtaan ng mga shell ng Worktree ang naka-pin na bersyon ng Node ng repo

- **Petsa:** 2026-04-03
- **Inobserbahan ni:** Codex
- **Konteksto:** Tumatakbo ng `yarn start` sa mga worktree ng Git gaya ng `.claude/worktrees/*` o mga checkout ng kapatid na worktree
- **Ano ang nakakagulat:** Naresolba ng ilang worktree shell ang `node` at `yarn node` sa Homebrew Node `25.2.1` kahit na ang repo pin ay `22.12.0` sa `.nvmrc`, kaya ang mga dev ay maaaring tumakbo nang mali sa ilalim ng ZXlentlyZPLACE runtime.
- **Epekto:** Ang pag-uugali ng dev-server ay maaaring lumipat sa pagitan ng pangunahing pag-checkout at mga worktree, na nagpapahirap sa mga bug na kopyahin at lumalabag sa inaasahang Node 22 toolchain ng repo.
- **Mitigation:** Panatilihin ang mga dev launcher sa likod ng `scripts/start-dev.mjs` at `scripts/start-docs.mjs`, na ngayon ay muling isinasagawa sa ilalim ng `.nvmrc` Node binary kapag ang kasalukuyang shell ay nasa maling bersyon. Mas gusto pa rin ng setup ng shell ang `nvm use`.
- **Status:** nakumpirma

### Maaaring itago ng `docs-site/` ang mga natira sa nawawalang docs source pagkatapos ng refactor

- **Petsa:** 2026-04-01
- **Inobserbahan ni:** Codex
- **Context:** Post-merge monorepo cleanup pagkatapos ilipat ang Docusaurus project mula `docs-site/` patungong `docs/`
- **Ano ang nakakagulat:** Ang lumang `docs-site/` na folder ay maaaring manatili sa disk na may mga lipas ngunit mahahalagang file tulad ng `i18n/`, kahit na matapos ang sinusubaybayang repo ay lumipat sa `docs/`. Ginagawa nitong lokal na duplicate ang refactor at maaaring itago ang katotohanan na ang mga sinusubaybayang pagsasalin ng mga doc ay hindi aktwal na inilipat sa `docs/`.
- **Epekto:** Maaaring tanggalin ng mga ahente ang lumang folder bilang “junk” at hindi sinasadyang mawala ang nag-iisang lokal na kopya ng mga pagsasalin ng doc, o patuloy na mag-edit ng mga script na tumuturo pa rin sa patay na `docs-site/` na landas.
- **Mitigation:** Tratuhin ang `docs/` bilang ang tanging canonical docs project. Bago i-delete ang anumang lokal na `docs-site/` natira, i-restore ang sinusubaybayang source tulad ng `docs/i18n/` at i-update ang mga script at hook para ihinto ang pagre-refer sa `docs-site`.
- **Status:** nakumpirma

### Maaaring mag-spike ng RAM ang multilocale docs preview sa panahon ng pag-verify

- **Petsa:** 2026-04-01
- **Inobserbahan ni:** Codex
- **Context:** Inaayos ang docs i18n, locale routing, at Pagefind na gawi sa `yarn start:docs` plus Playwright
- **Ano ang nakakagulat:** Ang default na docs preview mode ay gumagawa na ngayon ng buong multilocale docs build kasama ang Pagefind indexing bago ihatid, at ang pagpapanatiling buhay ng prosesong iyon kasama ng maraming Playwright o Chrome session ay maaaring kumonsumo ng mas maraming RAM kaysa sa isang normal na Vite o single-locale na Docusaurus dev loop.
- **Epekto:** Ang makina ay maaaring maging memory-constrained, ang mga session ng browser ay maaaring mag-crash, at ang mga naantala na pagtakbo ay maaaring mag-iwan ng mga lipas na docs server o walang ulo na mga browser sa likod na patuloy na kumakain ng memorya.
- **Mitigation:** Para sa mga gawaing doc na hindi nangangailangan ng lokal na ruta o pag-verify ng Pagefind, mas gusto ang `DOCS_START_MODE=live yarn start:docs`. Gamitin lang ang default na multilocale na preview kapag kailangan mong i-validate ang mga isinaling ruta o Pagefind. Panatilihin ang isang session ng Playwright, isara ang mga lumang session ng browser bago magbukas ng mga bago, at ihinto ang docs server pagkatapos ng pag-verify kung hindi mo na ito kailangan.
- **Status:** nakumpirma
