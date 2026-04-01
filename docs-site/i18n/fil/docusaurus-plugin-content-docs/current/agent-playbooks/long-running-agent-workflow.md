# Long-Running Agent Workflow

Gamitin ang playbook na ito kapag ang isang gawain ay malamang na sumasaklaw sa maraming session, handoff, o spawned agent.

## Mga layunin

- Bigyan ang bawat bagong session ng mabilis na paraan upang mabawi ang konteksto
- Panatilihing incremental ang trabaho sa halip na mag-one-shot ng malaking pagbabago
- Makakuha ng sirang lokal na baseline bago magdagdag ng higit pang code
- Mag-iwan ng mga matibay na artifact na mapagkakatiwalaan ng susunod na session

## Kung saan Panatilihin ang Estado

- Gamitin ang `docs/agent-runs/<slug>/` kapag kailangan ng mga tao, mga bot ng review, o maraming toolchain ng parehong estado ng gawain.
- Gumamit lamang ng tool-local na direktoryo tulad ng `.codex/runs/<slug>/` kapag ang estado ng gawain ay sadyang lokal sa isang workstation o isang toolchain.
- Huwag itago ang multi-session shared state sa isang pribadong scratch file kung kakailanganin ito ng ibang contributor o ahente sa ibang pagkakataon.

## Mga Kinakailangang File

Lumikha ng mga file na ito sa simula ng matagal nang gawain:

- `feature-list.json`
- `progress.md`

Gamitin ang mga template sa `docs/agent-playbooks/templates/feature-list.template.json` at `docs/agent-playbooks/templates/progress.template.md`.

Mas gusto ang JSON para sa listahan ng tampok upang ma-update ng mga ahente ang isang maliit na bilang ng mga field nang hindi muling sinusulat ang buong dokumento.

## Checklist ng Pagsisimula ng Sesyon

1. Patakbuhin ang `pwd`.
2. Basahin ang `progress.md`.
3. Basahin ang `feature-list.json`.
4. Patakbuhin ang `git log --oneline -20`.
5. Patakbuhin ang `./scripts/agent-init.sh --smoke`.
6. Pumili ng eksaktong isang item na may pinakamataas na priyoridad na `pending`, `in_progress`, o `blocked` pa rin.

Kung nabigo ang smoke step, ayusin ang sirang baseline bago magpatupad ng bagong feature slice.

## Mga Panuntunan sa Sesyon

- Magtrabaho sa isang feature o task slice sa isang pagkakataon.
- Panatilihing nababasa at stable ng makina ang listahan ng feature. I-update ang status, mga tala, mga file, at mga field ng pag-verify sa halip na muling isulat ang mga hindi nauugnay na item.
- Markahan lamang ang isang item na na-verify pagkatapos patakbuhin ang command o daloy ng user na nakalista sa item na iyon.
- Gumamit ng mga spawned agent para sa mga bounded slice, hindi para sa pangkalahatang pagmamay-ari ng task-state.
- Kapag nagmamay-ari ang isang ahente ng bata ng isang item, ibigay dito ang eksaktong item id, pamantayan sa pagtanggap, at mga file na maaaring mahawakan nito.

## Checklist ng Pagtatapos ng Sesyon

1. Magdagdag ng maikling pag-usad na entry sa `progress.md`.
2. I-update ang hinawakan na item sa `feature-list.json`.
3. Itala ang mga eksaktong command na pinapatakbo para sa pag-verify.
4. Kunin ang mga blocker, follow-up, at ang susunod na pinakamagandang item na ipagpatuloy.

## Inirerekomendang Hugis ng Pagpasok sa Pag-unlad

Gumamit ng isang maikling istraktura tulad ng:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
