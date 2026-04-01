# Format ng Commit at Isyu

Gamitin ito kapag nagmumungkahi o nagpapatupad ng mga makabuluhang pagbabago sa code.

## Format ng Suhestiyon ng Commit

- **Pamagat:** Estilo ng Conventional Commits, maikli, nakabalot sa mga backtick.
- Gamitin ang `perf` (hindi `fix`) para sa mga pag-optimize ng performance.
- **Paglalarawan:** Opsyonal 2-3 impormal na mga pangungusap na naglalarawan ng solusyon. Concise, teknikal, walang bullet point.

Halimbawa:

> **Pangalan ng pangako:** `fix: correct date formatting in timezone conversion`
>
> Na-update ang `formatDate()` sa `date-utils.ts` para maayos na pangasiwaan ang mga offset ng timezone.

## Format ng Suhestiyon sa Isyu sa GitHub

- **Pamagat:** Bilang maikli hangga't maaari, nakabalot sa mga backtick.
- **Paglalarawan:** 2-3 impormal na pangungusap na naglalarawan sa problema (hindi ang solusyon), na parang hindi pa rin nareresolba.

Halimbawa:

> **Isyu sa GitHub:**
>
> - **Pamagat:** `Date formatting displays incorrect timezone`
> - **Paglalarawan:** Ang mga timestamp ng komento ay nagpapakita ng mga maling timezone kapag tinitingnan ng mga user ang mga post mula sa iba't ibang rehiyon. Ang `formatDate()` function ay hindi isinasaalang-alang ang mga setting ng lokal na timezone ng user.
