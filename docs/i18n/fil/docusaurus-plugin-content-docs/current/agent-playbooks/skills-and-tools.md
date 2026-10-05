# Mga Skill at Kasangkapan

Nasa `.agents/skills/` ang mga nakabahaging skill. I-edit ang mga source na ito, at saka patakbuhin ang `yarn ai-workflow:sync` upang buuin ang `.claude/skills/` para sa Claude Code. Direktang tinutuklas ng Codex at Cursor ang `.agents/skills/`; huwag ibalik ang mga dobleng root na `.codex/skills/` o `.cursor/skills/`.

Nasa `.agents/roles/*.md` ang mga nakabahaging role prompt. Isa itong format ng source na tiyak sa repository na ito, hindi native na discovery path ng ahente. Kino-convert ng `scripts/ai-workflow-files.mjs` ang mga source na ito sa mga file na tiyak sa bawat app na nasa ibaba; isinusulat ang mga ito ng `yarn ai-workflow:sync`. I-commit ang mga nabuong file kasama ng kanilang mga source para magkaroon ang isang bagong checkout ng native na configuration nang hindi muna nagpapatakbo ng generator. Pagkatapos mag-alis ng source, tahasang alisin ang mga lipas na output na nabuo mula rito; iniuulat ng validator ang mga ito sa halip na tahimik na magbura ng mga file.

## Mga native na discovery path

Na-verify laban sa opisyal na dokumentasyon noong 2026-09-12:

| App         | Mga tagubilin ng proyekto                                                                                            | Mga skill na ginagamit ng repository na ito | Mga custom agent na ginagamit ng repository na ito |
| ----------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                                          | `.agents/skills/<name>/SKILL.md`            | Nabuong `.codex/agents/<name>.toml`                |
| Cursor      | `AGENTS.md`; nananatiling available ang `.cursor/rules/*.mdc` para sa mga kondisyonal na panuntunang tiyak sa Cursor | `.agents/skills/<name>/SKILL.md`            | Nabuong `.cursor/agents/<name>.md`                 |
| Claude Code | Ini-import ng `CLAUDE.md` ang `@AGENTS.md`                                                                           | Nabuong `.claude/skills/<name>/SKILL.md`    | Nabuong `.claude/agents/<name>.md`                 |

Mga sanggunian: [Mga skill ng Codex](https://learn.chatgpt.com/docs/build-skills), [Mga subagent ng Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Mga rule ng Cursor](https://cursor.com/docs/rules), [Mga skill ng Cursor](https://cursor.com/docs/skills), [Mga subagent ng Cursor](https://cursor.com/docs/subagents), [Memory ng Claude](https://code.claude.com/docs/en/memory), [Mga skill ng Claude](https://code.claude.com/docs/en/skills), [Mga subagent ng Claude](https://code.claude.com/docs/en/sub-agents).

Huwag palitan ng `.agents/roles` ang mga native na direktoryo ng ahente, at huwag ipagpalagay na tinutuklas ng Claude ang `.agents/skills`. Maaari pa ring basahin ng Claude ang isang file doon na tinutukoy, bilang ordinaryong konteksto ng proyekto. Tinutuklas din ng Cursor ang `.claude/skills` para sa compatibility; nananatiling naka-sync ang mga kopya, ngunit hindi tinutukoy ng nailathalang gabay nito sa mga skill ang deduplication sa mga root na ito. Suriin ang skill catalog ng naka-install na app sa halip na mangakong hindi maaaring lumitaw ang mga dobleng entry.

Gumagamit ang mga AI directory ng LF line ending sa pamamagitan ng `.gitattributes` para manatiling magkapareho ang nabuong teksto sa iba't ibang platform. Kinokopya bilang mga byte ang mga sumusuportang asset ng skill.

## Mga skill

| Skill                                | Layunin                                                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Gumawa ng awtorisado at may-saklaw na mga lokal na commit                                                                         |
| `commit-format`, `issue-format`      | Mga mungkahi sa format kapag hiniling                                                                                             |
| `make-closed-issue`                  | Gumawa ng awtorisadong isyu, may-saklaw na commit at PR                                                                           |
| `review-and-merge-pr`                | I-triage ang feedback sa PR; mag-ayos/mag-publish/mag-merge lamang sa loob ng hiniling na saklaw                                  |
| `fix-merge-conflicts`                | Lutasin ang mga conflict at i-verify ang na-merge na resulta                                                                      |
| `release`                            | Ihanda ang pananalita ng release at isagawa ang mga awtorisadong hakbang sa release                                               |
| `code-quality-review`                | Suriin ang mga hindi simpleng diff o ang isang tahasang hiniling na alalahanin sa kalidad                                         |
| `retro`                              | Gawing mga nakatutok na pagsusuri o gabay ang mga napatunayang pagkakamali upang hindi na maulit ang mga ito                      |
| `refactor-pass`, `deslop`            | Hiniling na paglilinis ng mga umiiral na pagbabago                                                                                |
| `debug-agent`                        | Pag-debug na nakabatay sa ebidensiya, may instrumentation kapag kailangan                                                         |
| `you-might-not-need-an-effect`       | Nakatutok na review ng effect/memo                                                                                                |
| `vercel-react-best-practices`        | Naaangkop na gabay sa performance ng React; laktawan ang mga panuntunang para lamang sa Next.js/server para sa Vite client na ito |
| `translate`                          | Bumuo ng mga salin, at saka ilapat ang mga mapa sa pamamagitan ng iisang writer                                                   |
| `playwright-cli`, `inspect-elements` | Pag-verify sa browser at pagmamapa mula DOM patungong source                                                                      |
| `profile-browsing`                   | May-saklaw na profiling ng browser at React                                                                                       |
| `test-apk`                           | I-verify ang isang ibinigay na kasamang Android wrapper                                                                           |
| `impeccable`, `improve-threejs`      | May-saklaw na disenyo ng interface at review ng Three.js rendering                                                                |
| `implement-plan`                     | Isagawa ang isang plano na may opsyonal at limitadong delegasyon                                                                  |
| `readme`                             | Panatilihin ang beripikadong dokumentasyon ng proyekto                                                                            |
| `context7`                           | Kunin ang dokumentasyon ng library na angkop sa bersyon                                                                           |
| `find-skills`                        | Maghanap ng karagdagang skill kapag tahasang hiniling                                                                             |

## Mga role at modelo

Panatilihin ang mga custom role para sa `browser-check`, `profiler`, `test-apk`, `translator`, at `reviewer`. Gamitin ang built-in na worker/general-purpose o explorer role ng harness para sa ordinaryong implementasyon at pagtuklas ng code. Itinatalaga ng magulang na ahente ang mga pamantayan sa pagtanggap at ang pagmamay-ari; iisang may-ari ang nagpapatakbo ng mabibigat na pagsusuri.

Kasama sa mga agent file ng Codex ang `name`, `description`, at `developer_instructions`. Nililimitahan ng `.codex/config.toml` sa apat ang sabay-sabay na anak na ahente gamit ang `max_concurrent_threads_per_session`. Naglalaman ang nakabahaging metadata ng role ng pangalan, paglalarawan, at opsyonal na sandbox mode; sadyang wala itong mga field ng modelo.

Huwag isama ang mga field ng modelo at reasoning sa mga naka-commit na skill at custom agent sa lahat ng tatlong app. Pinapayagan nito ang mga pagpili sa oras ng pagtawag, ang mga default ng user, at ang pagmamana mula sa magulang na ahente ayon sa nakadokumentong precedence ng bawat app. Binabawasan ng mga family alias ng Claude ang pagpapanatili ng bersyon ngunit pumipili pa rin ang mga ito ng isang family; nangangailangan ng mga update sa hinaharap ang isang Cursor model na may bersyon. Itago ang ganitong mga pagpili sa mga setting ng user/session kapag kailangan. Hindi nangangako ang pagmamana ng awtomatikong pagpili ng pinakamahusay na kasalukuyang modelo. Huwag mag-imbento ng alias na `latest` o magdagdag ng pananaliksik sa model catalog sa mga karaniwang gawain. Tingnan ang [pagpili sa Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [pagpili sa Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model), at [pagpili sa Cursor](https://cursor.com/docs/subagents#model-configuration).

Nagmamapa ang `sandbox-mode: read-only` sa sandbox ng Codex at sa `readonly` ng Cursor; nililimitahan ng listahan ng tool ng Claude at ng mga tagubilin ng role ang review workflow nito, ngunit hindi OS-level na sandbox ang access sa Bash.

Gumagamit ang frontmatter ng nakabahaging skill ng `disable-model-invocation: true` para sa mga workflow na tinatawag ng user kung saan naaangkop. Nasa `agents/openai.yaml` ang katumbas na setting ng Codex bilang `policy.allow_implicit_invocation: false`; hinihingi ng validator ang dalawa. Dinadagdagan ng invocation metadata ang mga tahasang panuntunan sa awtorisasyon; hindi kailanman nagbibigay ng awtorisasyon sa paglalathala ang isang kahilingan sa review dahil lamang may mga hakbang sa paglalathala ang isang skill.

## Mga pagsusuri at pagtuklas

- Muling binubuo ng `yarn ai-workflow:sync` ang mga compatibility output gamit ang naka-install na `js-yaml` at `smol-toml`.
- Pina-parse ng `yarn ai-workflow:check` ang source/frontmatter/mga config, at sinusuri nito ang mga nabuong output, ang invocation metadata, ang paglalagay ng mga field ng modelo, at ang wiring ng hook na para lamang sa formatter. Hindi nito nireresolba ang mga identifier ng modelo laban sa catalog ng provider.
- Pinapatakbo ng `yarn ai-workflow:test` ang mga hiwalay na Node fixture para sa mga payload ng hook at sa pagbuo/pag-validate ng workflow.
- Pagkatapos i-upgrade ang isang agent application, i-verify ang pagtuklas ng skill/role sa application na iyon. Hindi napapalitan ng mga pagsusuri sa syntax/parity ang pagsusuri sa loader. I-reload ang application kung may lumang catalog pa rin ang isang umiiral na session.
- Nangangailangan ang mga hook ng project trust at hook review ng harness; huwag lampasan ang trust para lang pumasa ang isang pagsusuri. Tingnan ang [hooks-setup.md](hooks-setup.md).

## Pagpapanatili ng kapaki-pakinabang na mga tagubilin

Sundin ang [gabay ng OpenAI sa mga skill at prompt](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (sinuri noong 2026-09-12): panatilihing tumpak ang mga paglalarawan, i-load lamang ang mga detalye kapag kaugnay, at panatilihin ang saklaw na hiniling ng user. Naglilingkod ang mga nakabahaging skill sa iba't ibang modelo; panatilihin ang mga invariant na tiyak sa proyekto habang pinapayagan ang mga karaniwang pagpili sa implementasyon.

Panatilihin sa `SKILL.md` ang layunin ng isang skill, ang mga hangganan ng desisyon nito, at ang mahahalagang limitasyon. I-link bilang opsyonal na reference ang malalaking command o halimbawa na tiyak sa isang mode. Ilagay nang maaga sa maiikling paglalarawan ang mga kondisyon ng pag-trigger; hindi dapat palawakin ng isang tumutugmang keyword lamang ang gawain. Panatilihin ang umiiral na invocation metadata maliban kung sinasadyang baguhin ang gawi nito.

Pagkatapos ng malaking pagbabago sa tagubilin, subukan ang ilang kinatawang maliit at malaking kahilingan. Suriin kung aling mga skill/reference ang napili, kung nanatili sa saklaw ang mga aksyon, kung tumugma ang pag-verify sa pagbabago, at kung natapos ang awtorisadong gawain. Pinatutunayan ng mga schema at fixture test ang kawastuhan ng tooling, hindi ang kalidad ng desisyon ng ahente.

## Mga kasangkapan at pagmamay-ari ng browser

Mas piliin ang umiiral na skill/tool catalog at ang mga naka-install na CLI ng proyekto. Gamitin ang `gh` para sa GitHub, ang `playwright-cli` para sa pag-verify sa browser, at ang opisyal na dokumentasyong tiyak sa bersyon kapag mahalaga ang gawi ng library. Iwasang mag-install ng mga dobleng skill o kumuha ng package na hindi naka-pin para lang magpatakbo ng umiiral na formatter.

Nakadepende sa harness ang overhead ng MCP: maaaring maiwasan ng deferred tool loading ang paglo-load ng bawat schema sa simula pa lamang. Panatilihing kaugnay ang mga integration sa halip na ituring na lipas na ang MCP mismo. Nananatiling kapaki-pakinabang ang mga umiiral na pagpili ng CLI para sa reproducibility at kontrol sa resource.

Gumagamit ang lahat ng browser session ng `./scripts/pw-session.sh`, na nagpapatupad ng iisang aktibong browser sa buong makina. Bilang default, gumamit ng bago at hiwalay na session. Nangangailangan ng tahasang awtorisasyon ang kasalukuyang access sa personal na browser; muling gamitin ang awtorisasyong iyon sa mga susunod na hakbang. Pumili ng mga browser/viewport para sa apektadong gawi, patakbuhin nang sunod-sunod ang mga napiling engine, isara ang eksaktong pinangalanang session sa paglilinis, at huwag kailanman gumamit ng `close-all`/`kill-all`. Tingnan ang `playwright-cli` skill at ang [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
