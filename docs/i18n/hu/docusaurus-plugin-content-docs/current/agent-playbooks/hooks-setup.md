# Ügynöki hookok

A commitolt életciklus-hookok csak a sikeresen szerkesztett JavaScript/TypeScript fájlokat formázzák a telepített oxfmt segítségével. A közös logika a `scripts/agent-hooks/format.mjs` fájlban található; minden natív burkoló erre delegál.

| Alkalmazás | Natív konfiguráció | Esemény |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

A Claude nem olvas be különálló `.claude/hooks.json` fájlt. A projekt megbízhatóságáról és a hookok engedélyezéséről továbbra is az egyes alkalmazások döntenek; a megbízhatóság megkerülése helyett vizsgálja meg az aktuális beállításaikat. A `.codex/config.toml` repókonfiguráció, nem hookparancs-nyilvántartás.

A formázó ellenőrzi az eseményt/payloadot, a szerkesztés sikerességét, a fájlkiterjesztést, valamint azt, hogy a fájl a repón belül van-e, a szimbolikus linkeket is beleértve. Hiányzó függőségek vagy nem releváns bemenet esetén nem végez munkát. A parancsok argumentumtömböt használnak, letiltott Corepack-hálózati hozzáféréssel; a hookok nem telepítenek függőségeket, nem futtatnak buildet vagy átnézést, és nem módosítják a Git-állapotot.

Az ellenőrzéseket külön, kifejezetten futtassa a [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) szerint. A munkafolyamat módosítása után futtassa a `yarn ai-workflow:sync`, `yarn ai-workflow:check` és `yarn ai-workflow:test` parancsot. A fixture-ök eldobható fájlokat és álformázó-hívásokat használnak; nem bizonyítják, hogy az egyes alkalmazások betöltötték a konfigurációjukat. Frissítések után töltse újra az alkalmazást, és vizsgálja meg a katalógusát.

Az Impeccable tervezési skill és a futtatható segédprogramjai igény szerint továbbra is elérhetők a `.agents/skills/impeccable` alatt. Korábbi Codex-hookja egy nem létező könyvtárra mutatott; a tervezési munkafolyamat mostantól akkor fut, amikor a skillt kiválasztják, mindig aktív tervezési hook nélkül. A skill nem konfigurálhatja át a projekt hookjait mellékes tervezési lépésként.
