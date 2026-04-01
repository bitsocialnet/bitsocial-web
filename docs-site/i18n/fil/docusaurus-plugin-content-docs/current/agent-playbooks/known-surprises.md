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

### Binabago ng Portless ang canonical na lokal na URL ng app

- **Petsa:** 2026-03-18
- **Inobserbahan ni:** Codex
- **Konteksto:** Pag-verify ng browser at umaagos ang usok
- **Ano ang nakakagulat:** Ang default na lokal na URL ay hindi ang karaniwang Vite port. Inaasahan ng repo ang `http://bitsocial.localhost:1355` sa pamamagitan ng Portless, kaya ang pagsuri sa `localhost:3000` o `localhost:5173` ay maaaring matamaan ang maling app o wala talaga.
- **Epekto:** Maaaring mabigo o mapatunayan ng mga pagsusuri sa browser ang maling target kahit na malusog ang dev server.
- **Mitigation:** Gamitin muna ang `http://bitsocial.localhost:1355`. I-bypass lang ito gamit ang `PORTLESS=0 corepack yarn start` kapag tahasang kailangan mo ng direktang Vite port.
- **Status:** nakumpirma

### Hinaharang ng mga commitizen hook ang mga hindi interactive na commit

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
- **Ano ang nakakagulat:** Ang makina ay mayroon pa ring pandaigdigang Yarn classic na pag-install sa `PATH`, kaya ang pagpapatakbo ng plain na `yarn` ay maaaring malutas sa v1 sa halip na ang naka-pin na bersyon ng Yarn 4.
- **Epekto:** Maaaring ma-bypass ng mga developer ang pagpi-pin ng package-manager ng repo at makakuha ng ibang gawi sa pag-install o output ng lockfile.
- **Mitigation:** Gamitin ang `corepack yarn ...` para sa mga shell command, o patakbuhin muna ang `corepack enable` upang ang plain na `yarn` ay malutas sa naka-pin na bersyon ng Yarn 4.
- **Status:** nakumpirma

### Ang mga nakapirming Portless na pangalan ng app ay nagbabanggaan sa mga worktree ng Bitsocial Web

- **Petsa:** 2026-03-30
- **Inobserbahan ni:** Codex
- **Context:** Nagsisimula ang `yarn start` sa isang Bitsocial Web worktree habang ang isa pang worktree ay nagsisilbi na sa pamamagitan ng Portless
- **Ano ang nakakagulat:** Ang paggamit ng literal na Portless na pangalan ng app na `bitsocial` sa bawat worktree ay nagiging sanhi ng pagbangga mismo ng ruta, kahit na magkaiba ang mga backing port, kaya nabigo ang pangalawang proseso dahil nakarehistro na ang `bitsocial.localhost`.
- **Epekto:** Maaaring i-block ng mga parallel Bitsocial Web branch ang isa't isa kahit na ang Portless ay nilayon upang hayaan silang magkasamang mabuhay nang ligtas.
- **Mitigation:** Panatilihin ang Portless startup sa likod ng `scripts/start-dev.mjs`, na ngayon ay gumagamit ng isang branch-scoped `*.bitsocial.localhost:1355` na ruta sa labas ng canonical case at bumabalik sa isang branch-scoped na ruta kapag ang hubad na `bitsocial.localhost` na pangalan ay okupado na.
- **Status:** nakumpirma

### Docs preview na ginamit sa hard-code port 3001

- **Petsa:** 2026-03-30
- **Inobserbahan ni:** Codex
- **Konteksto:** Tumatakbo ang `yarn start` kasama ng iba pang mga lokal na repo at ahente
- **Ano ang nakakagulat:** Ang root dev command ay nagpatakbo sa docs workspace na may `docusaurus start --port 3001`, kaya ang buong dev session ay nabigo sa tuwing may isa pang proseso na nagmamay-ari na ng `3001`, kahit na ang pangunahing app ay gumagamit na ng Portless.
- **Epekto:** Maaaring patayin ng `yarn start` ang proseso ng web kaagad pagkatapos nitong mag-boot, na nakakaabala sa hindi nauugnay na lokal na gawain dahil sa banggaan ng docs-port.
- **Mitigation:** Panatilihin ang docs startup sa likod ng `yarn start:docs`, na ngayon ay gumagamit ng Portless plus `scripts/start-docs.mjs` upang bigyang-galang ang isang injected na libreng port o bumalik sa susunod na available na port kapag direktang tumakbo.
- **Status:** nakumpirma
