# Hosszú távú ügynöki munkafolyamat

Használja ezt a forgatókönyvet, ha egy feladat valószínűleg több munkamenetet, átadást vagy létrejött ügynököt fog felölelni.

## Gólok

- Adjon minden új munkamenetnek gyors módot a kontextus visszanyerésére
- Folytassa a növekményes munkát, ahelyett, hogy egyszeri nagy változtatásokat hajtana végre
- Fogjon meg egy törött helyi alapvonalat, mielőtt további kódot adna hozzá
- Hagyjon tartós műtermékeket, amelyekben a következő munkamenet megbízhat

## Hol tartsuk az államot

- Használja a `docs/agent-runs/<slug>/`-t, ha az embereknek, a felülvizsgálati robotoknak vagy több eszközláncnak ugyanarra a feladatállapotra van szüksége.
- Csak akkor használjon tool-local könyvtárat, mint például a `.codex/runs/<slug>/`, ha a feladatállapot szándékosan helyi egy munkaállomásra vagy egy eszközláncra.
- Ne rejtse el a több munkamenetben megosztott állapotot egy privát scratch fájlban, ha később egy másik közreműködőnek vagy ügynöknek szüksége lesz rá.

## Szükséges fájlok

A hosszan tartó feladat elején hozza létre ezeket a fájlokat:

- `feature-list.json`
- `progress.md`

Használja a `docs/agent-playbooks/templates/feature-list.template.json` és `docs/agent-playbooks/templates/progress.template.md` sablonokat.

Előnyben részesítse a JSON-t a szolgáltatáslistában, hogy az ügynökök a teljes dokumentum átírása nélkül frissíthessenek néhány mezőt.

## Munkamenet kezdési ellenőrzőlista

1. Futtassa a `pwd` parancsot.
2. Olvassa el a következőt: `progress.md`.
3. Olvassa el a következőt: `feature-list.json`.
4. Futtassa a `git log --oneline -20` parancsot.
5. Futtassa a `./scripts/agent-init.sh --smoke` parancsot.
6. Válasszon pontosan egy legmagasabb prioritású elemet, amely továbbra is `pending`, `in_progress` vagy `blocked`.

Ha a füstlépés sikertelen, javítsa ki a törött alapvonalat, mielőtt új szolgáltatásszeletet implementálna.

## A foglalkozás szabályai

- Dolgozzon egyszerre egy szolgáltatáson vagy feladatszeleten.
- A funkciók listája legyen gépileg olvasható és stabil. Frissítse az állapotot, a megjegyzéseket, a fájlokat és az ellenőrző mezőket a nem kapcsolódó elemek átírása helyett.
- Csak az elemben felsorolt parancs vagy felhasználói folyamat futtatása után jelöljön meg egy elemet ellenőrzöttnek.
- Használjon létrehozott ügynököket a korlátos szeletekhez, ne az általános feladatállapot-tulajdonhoz.
- Ha egy alárendelt ügynök birtokol egy elemet, adja meg a pontos elemazonosítót, az elfogadási feltételeket és a fájlokat, amelyeket érinthet.

## Munkamenet végi ellenőrzőlista

1. Adjon hozzá egy rövid előrehaladási bejegyzést a következőhöz: `progress.md`.
2. Frissítse a megérintett elemet a `feature-list.json`-ban.
3. Jegyezze fel az ellenőrzéshez futtatott parancsokat.
4. Rögzítse a blokkolókat, a nyomon követéseket és a következő legjobb elemet a folytatáshoz.

## Javasolt előrehaladási belépési forma

Használjon rövid szerkezetet, például:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
