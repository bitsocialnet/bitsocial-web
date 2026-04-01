# Rrjedha e punës e agjentëve afatgjatë

Përdoreni këtë libër lojërash kur një detyrë ka të ngjarë të përfshijë disa seanca, dorëzime ose agjentë të krijuar.

## Golat

- Jepini çdo sesioni të ri një mënyrë të shpejtë për të rifituar kontekstin
- Vazhdoni punën në rritje në vend që të bëni një ndryshim të madh
- Kapni një bazë të thyer lokale përpara se të shtoni më shumë kod
- Lini objekte të qëndrueshme që mund t'i besojë sesioni tjetër

## Ku të mbahet shteti

- Përdorni `docs/agent-runs/<slug>/` kur njerëzit, robotët e rishikimit ose zinxhirët e shumtë të mjeteve kanë nevojë për të njëjtën gjendje detyrash.
- Përdorni një direktori lokale veglash si `.codex/runs/<slug>/` vetëm kur gjendja e detyrës është qëllimisht lokale në një stacion pune ose një zinxhir veglash.
- Mos e fshihni gjendjen e përbashkët me shumë sesione në një skedar gërvishtjeje private nëse një kontribues ose agjent tjetër do t'i duhet më vonë.

## Skedarët e kërkuar

Krijoni këto skedarë në fillim të detyrës afatgjatë:

- `feature-list.json`
- `progress.md`

Përdorni shabllonet në `docs/agent-playbooks/templates/feature-list.template.json` dhe `docs/agent-playbooks/templates/progress.template.md`.

Preferoni JSON për listën e veçorive në mënyrë që agjentët të mund të përditësojnë një numër të vogël fushash pa e rishkruar të gjithë dokumentin.

## Lista kontrolluese e fillimit të sesionit

1. Ekzekutoni `pwd`.
2. Lexoni `progress.md`.
3. Lexoni `feature-list.json`.
4. Ekzekutoni `git log --oneline -20`.
5. Ekzekutoni `./scripts/agent-init.sh --smoke`.
6. Zgjidhni saktësisht një artikull me përparësi më të lartë që është ende `pending`, `in_progress` ose `blocked`.

Nëse hapi i tymit dështon, rregulloni vijën bazë të thyer përpara se të zbatoni një pjesë të re të veçorive.

## Rregullat e sesionit

- Punoni në një veçori ose një pjesë të detyrës në të njëjtën kohë.
- Mbajeni listën e veçorive të lexueshme dhe të qëndrueshme nga makina. Përditësoni statusin, shënimet, skedarët dhe fushat e verifikimit në vend që të rishkruani artikuj që nuk kanë lidhje.
- Shënoni vetëm një artikull të verifikuar pas ekzekutimit të komandës ose rrjedhës së përdoruesit të listuar në atë artikull.
- Përdorni agjentët e krijuar për feta të kufizuara, jo për pronësinë e përgjithshme të gjendjes së detyrës.
- Kur një agjent fëmijë zotëron një artikull, jepini atij ID-në e saktë të artikullit, kriteret e pranimit dhe skedarët që mund të prekë.

## Lista kontrolluese e përfundimit të sesionit

1. Shtoni një hyrje të shkurtër progresi te `progress.md`.
2. Përditëso artikullin e prekur në `feature-list.json`.
3. Regjistroni komandat e sakta të ekzekutuara për verifikim.
4. Kapni bllokuesit, ndjekjet dhe artikullin tjetër më të mirë për të rifilluar.

## Forma e rekomanduar e hyrjes së progresit

Përdorni një strukturë të shkurtër si:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
