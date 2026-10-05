# Skillek és eszközök

A közös skillek a `.agents/skills/` könyvtárban találhatók. Ezeket a forrásokat szerkessze, majd futtassa a `yarn ai-workflow:sync` parancsot, amely létrehozza a `.claude/skills/` könyvtárat a Claude Code számára. A Codex és a Cursor közvetlenül felfedezi a `.agents/skills/` könyvtárat; ne állítsa vissza a duplikált `.codex/skills/` vagy `.cursor/skills/` gyökeret.

A közös szerepkör-promptok a `.agents/roles/*.md` fájlokban találhatók. Ez repóspecifikus forrásformátum, nem natív ügynökfelfedezési útvonal. A `scripts/ai-workflow-files.mjs` ezeket a forrásokat az alábbi alkalmazásspecifikus fájlokká alakítja; a `yarn ai-workflow:sync` írja ki őket. A generált fájlokat a forrásaikkal együtt commitolja, hogy egy friss checkoutban generátor futtatása nélkül is meglegyen a natív konfiguráció. Egy forrás eltávolítása után kifejezetten távolítsa el az elavult generált kimeneteit is; a validátor jelzi ezeket, ahelyett hogy csendben törölné a fájlokat.

## Natív felfedezési útvonalak

A hivatalos dokumentációval 2026-09-12-én ellenőrizve:

| Alkalmazás  | Projektutasítások                                                                                     | A repó által használt skillek             | A repó által használt egyéni ügynökök |
| ----------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------- |
| Codex       | `AGENTS.md`                                                                                           | `.agents/skills/<name>/SKILL.md`          | Generált `.codex/agents/<name>.toml`  |
| Cursor      | `AGENTS.md`; a `.cursor/rules/*.mdc` továbbra is elérhető a Cursor-specifikus feltételes szabályokhoz | `.agents/skills/<name>/SKILL.md`          | Generált `.cursor/agents/<name>.md`   |
| Claude Code | A `CLAUDE.md` importálja az `@AGENTS.md` fájlt                                                        | Generált `.claude/skills/<name>/SKILL.md` | Generált `.claude/agents/<name>.md`   |

Források: [Codex-skillek](https://learn.chatgpt.com/docs/build-skills), [Codex-alügynökök](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor-szabályok](https://cursor.com/docs/rules), [Cursor-skillek](https://cursor.com/docs/skills), [Cursor-alügynökök](https://cursor.com/docs/subagents), [Claude-memória](https://code.claude.com/docs/en/memory), [Claude-skillek](https://code.claude.com/docs/en/skills), [Claude-alügynökök](https://code.claude.com/docs/en/sub-agents).

Ne cserélje le a natív ügynökkönyvtárakat a `.agents/roles` könyvtárra, és ne feltételezze, hogy a Claude felfedezi a `.agents/skills` könyvtárat. A Claude ettől még elolvashat egy ott lévő, hivatkozott fájlt hétköznapi projektkontextusként. A Cursor a kompatibilitás érdekében a `.claude/skills` könyvtárat is felfedezi; a másolatok szinkronban maradnak, de a Cursor közzétett skill-útmutatója nem határozza meg, hogyan szűri a duplikátumokat ezek között a gyökerek között. Ahelyett, hogy megígérné, hogy duplikált bejegyzések nem jelenhetnek meg, ellenőrizze a telepített alkalmazás skillkatalógusát.

Az AI-könyvtárak a `.gitattributes` révén LF sorvégeket használnak, így a generált szöveg minden platformon azonos marad. A skillek kiegészítő fájljai bájtra pontosan másolódnak.

## Skillek

| Skill                                | Cél                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Engedélyezett, körülhatárolt helyi commitok létrehozása                                                                |
| `commit-format`, `issue-format`      | Formázási javaslatok kérésre                                                                                           |
| `make-closed-issue`                  | Engedélyezett issue, körülhatárolt commit és PR létrehozása                                                            |
| `review-and-merge-pr`                | PR-visszajelzések osztályozása; javítás/közzététel/merge csak a kért hatókörön belül                                   |
| `fix-merge-conflicts`                | Ütközések feloldása és az egyesített eredmény ellenőrzése                                                              |
| `release`                            | Kiadási szöveg előkészítése és az engedélyezett kiadási lépések végrehajtása                                           |
| `code-quality-review`                | Nem triviális diffek vagy kifejezetten kért minőségi aggály átnézése                                                   |
| `retro`                              | A ténylegesen előfordult hibák célzott ellenőrzésekké vagy útmutatássá alakítása, amelyek megelőzik az ismétlődést     |
| `refactor-pass`, `deslop`            | A meglévő változtatások kért takarítása                                                                                |
| `debug-agent`                        | Bizonyítékalapú hibakeresés, szükség esetén instrumentálással                                                          |
| `you-might-not-need-an-effect`       | Célzott effekt-/memo-átnézés                                                                                           |
| `vercel-react-best-practices`        | Alkalmazható React-teljesítményútmutatás; ennél a Vite-kliensnél hagyja ki a Next.js-es/csak szerveroldali szabályokat |
| `translate`                          | Fordítások előállítása, majd a szótárfájlok alkalmazása egyetlen íróval                                                |
| `playwright-cli`, `inspect-elements` | Böngészős ellenőrzés és a DOM forráskódra való leképezése                                                              |
| `profile-browsing`                   | Körülhatárolt böngésző- és React-profilozás                                                                            |
| `test-apk`                           | Egy átadott Android-kísérőburkoló ellenőrzése                                                                          |
| `impeccable`, `improve-threejs`      | Körülhatárolt felülettervezés és Three.js-renderelési átnézés                                                          |
| `implement-plan`                     | Terv végrehajtása opcionális, korlátozott delegálással                                                                 |
| `readme`                             | Ellenőrzött projektdokumentáció karbantartása                                                                          |
| `context7`                           | A verziónak megfelelő könyvtárdokumentáció lekérése                                                                    |
| `find-skills`                        | További skillek keresése, ha ezt kifejezetten kérik                                                                    |

## Szerepkörök és modellek

Tartsa meg az egyéni szerepköröket a `browser-check`, `profiler`, `test-apk`, `translator` és `reviewer` feladatokhoz. Hétköznapi implementációhoz és kódfelderítéshez a keretrendszer beépített worker/általános célú vagy explorer szerepkörét használja. A szülő jelöli ki az elfogadási feltételeket és a tulajdonjogot; a nehéz ellenőrzéseket egyetlen tulajdonos futtatja.

A Codex ügynökfájljai tartalmazzák a `name`, a `description` és a `developer_instructions` mezőt. A `.codex/config.toml` a `max_concurrent_threads_per_session` beállítással négyben korlátozza az egyidejű gyermekügynökök számát. A közös szerepkör-metaadatok a nevet, a leírást és az opcionális sandbox-módot tartalmazzák; modellmezőket szándékosan nem.

Mindhárom alkalmazásban hagyja ki a modell- és gondolkodási mezőket a commitolt skillekből és egyéni ügynökökből. Így az egyes alkalmazások dokumentált elsőbbségi sorrendje szerint érvényesülhetnek a futásidejű meghívási döntések, a felhasználói alapértelmezések és a szülőtől való öröklés. A Claude modellcsalád-aliasai csökkentik a verziók karbantartását, de így is egy családot választanak; egy verziószámmal megadott Cursor-modell a jövőben frissítést igényel. Ha szükséges, az ilyen döntéseket a felhasználói/munkamenet-beállításokban tartsa. Az öröklés nem ígéri, hogy automatikusan a legjobb aktuális modell lesz kiválasztva. Ne találjon ki `latest` aliast, és ne tegye a modellkatalógus kutatását a rutinfeladatok részévé. Lásd: [Codex-modellválasztás](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Claude-modellválasztás](https://code.claude.com/docs/en/sub-agents#choose-a-model) és [Cursor-modellválasztás](https://cursor.com/docs/subagents#model-configuration).

A `sandbox-mode: read-only` a Codex sandboxára és a Cursor `readonly` beállítására képeződik le; a Claude esetében az eszközlista és a szerepkör utasításai korlátozzák az átnézési munkafolyamatot, de a Bash-hozzáférés nem operációsrendszer-szintű sandbox.

A közös skillek frontmattere a felhasználó által indított munkafolyamatoknál, ahol ez alkalmazható, a `disable-model-invocation: true` beállítást használja. A Codex megfelelő beállítása az `agents/openai.yaml` fájlban található `policy.allow_implicit_invocation: false` formában; a validátor mindkettőt megköveteli. A meghívási metaadatok kiegészítik a kifejezett engedélyezési szabályokat; egy átnézési kérés soha nem jogosít fel közzétételre csak azért, mert egy skill közzétételi lépéseket is tartalmaz.

## Ellenőrzések és felfedezés

- A `yarn ai-workflow:sync` a telepített `js-yaml` és `smol-toml` csomaggal újragenerálja a kompatibilitási kimeneteket.
- A `yarn ai-workflow:check` elemzi a forrásokat/frontmattert/konfigurációkat, és ellenőrzi a generált kimeneteket, a meghívási metaadatokat, a modellmezők elhelyezését és a csak formázást végző hookbekötést. A modellazonosítókat nem veti össze egy szolgáltatói katalógussal.
- A `yarn ai-workflow:test` elszigetelt Node-fixture-öket futtat a hookok payloadjaihoz és a munkafolyamat generálásához/validálásához.
- Egy ügynökalkalmazás frissítése után ellenőrizze a skillek/szerepkörök felfedezését az adott alkalmazásban. A szintaxis- és egyezésellenőrzések nem helyettesítik a betöltés ellenőrzését. Töltse újra az alkalmazást, ha egy meglévő munkamenet megtartja a régi katalógust.
- A hookokhoz szükség van a keretrendszer projektmegbízhatósági jóváhagyására és a hookok átnézésére; ne kerülje meg a megbízhatóságot csak azért, hogy egy ellenőrzés átmenjen. Lásd: [hooks-setup.md](hooks-setup.md).

## Hasznos utasítások karbantartása

Kövesse az [OpenAI skillekre és promptokra vonatkozó útmutatását](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (átnézve: 2026-09-12): a leírások legyenek pontosak, a részleteket csak akkor töltse be, ha relevánsak, és őrizze meg a felhasználó által kért hatókört. A közös skillek különböző modelleket szolgálnak ki; őrizze meg a projektspecifikus invariánsokat, miközben teret hagy a rutinszerű implementációs döntéseknek.

A skill célját, döntési határait és alapvető megkötéseit a `SKILL.md` fájlban tartsa. A terjedelmes, módspecifikus parancsokat vagy példákat opcionális hivatkozásként linkelje. A rövid leírásokban az aktiválási feltételek kerüljenek előre; egy egyező kulcsszó önmagában ne bővítse ki a feladatot. A meglévő meghívási metaadatokat őrizze meg, hacsak nem szándékosan módosítja a viselkedésüket.

Egy jelentős utasításmódosítás után próbáljon ki néhány reprezentatív kis és nagy kérést. Ellenőrizze, mely skillek/hivatkozások lettek kiválasztva, a műveletek a hatókörön belül maradtak-e, az ellenőrzés illeszkedett-e a változáshoz, és elkészült-e az engedélyezett munka. A séma- és fixture-tesztek az eszközök helyességét igazolják, nem az ügynök döntéseinek minőségét.

## Eszközök és a böngésző tulajdonjoga

Részesítse előnyben a meglévő skill- és eszközkatalógust és a projektben telepített CLI-ket. A GitHubhoz a `gh`, böngészős ellenőrzéshez a `playwright-cli` eszközt használja, és ha egy könyvtár viselkedése számít, a hivatalos/verzióspecifikus dokumentációt. Kerülje a duplikált skillek telepítését, és ne töltsön le rögzítetlen csomagot csak azért, hogy egy meglévő formázót futtasson.

Az MCP többletterhelése a keretrendszertől függ: a késleltetett eszközbetöltéssel elkerülhető, hogy minden séma előre betöltődjön. Az integrációk legyenek relevánsak, ahelyett hogy magát az MCP-t elavultnak tekintené. A meglévő CLI-választások továbbra is hasznosak a reprodukálhatóság és az erőforrások kézben tartása szempontjából.

Minden böngésző-munkamenet a `./scripts/pw-session.sh` szkriptet használja, amely gépszinten egyetlen aktív böngészőt enged. Alapértelmezésként friss, elszigetelt munkamenetet használjon. A felhasználó aktuális személyes böngészőjéhez való hozzáféréshez kifejezett engedély kell; ezt az engedélyt a későbbi lépésekben használja újra. A böngészőket/nézetablakokat az érintett viselkedéshez válassza meg, a kiválasztott motorokat sorosan futtassa, takarításkor a pontosan megnevezett munkamenetet zárja be, és soha ne használja a `close-all`/`kill-all` parancsot. Lásd a `playwright-cli` skillt és a [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) oldalt.
