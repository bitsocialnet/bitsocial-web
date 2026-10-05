# Hook-et e agjentëve

Hook-et e ciklit jetësor të futura në depo vetëm formatojnë, përmes oxfmt të instaluar, skedarët JavaScript/TypeScript të redaktuar me sukses. Logjika e përbashkët ndodhet te `scripts/agent-hooks/format.mjs`; çdo mbështjellës vendas ia delegon punën asaj.

| Aplikacioni | Konfigurimi vendas | Ngjarja |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude nuk lexon një `.claude/hooks.json` më vete. Çdo aplikacion vazhdon të kontrollojë besimin te projekti dhe nëse hook-et janë të aktivizuara; inspektoni cilësimet e tij aktuale në vend që ta anashkaloni besimin. `.codex/config.toml` është konfigurim i depos, jo regjistër komandash për hook-et.

Formatuesi validon ngjarjen/ngarkesën, suksesin e redaktimit, prapashtesën e skedarit dhe qëndrimin brenda depos, duke përfshirë lidhjet simbolike. Varësitë që mungojnë ose hyrjet e parëndësishme nuk shkaktojnë asnjë punë. Komandat përdorin një varg argumentesh me qasjen në rrjet të Corepack të çaktivizuar; hook-et nuk instalojnë varësi, nuk ekzekutojnë ndërtime/rishikime dhe nuk ndryshojnë gjendjen e Git-it.

Ekzekutojini kontrollet shprehimisht sipas [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Pas ndryshimit të rrjedhës së punës, ekzekutoni `yarn ai-workflow:sync`, `yarn ai-workflow:check` dhe `yarn ai-workflow:test`. Fixture-t përdorin skedarë të përkohshëm dhe thirrje të simuluara të formatuesit; ato nuk provojnë se çdo aplikacion e ka ngarkuar konfigurimin e vet. Pas përditësimeve, ringarkoni aplikacionin dhe inspektoni katalogun e tij.

Aftësia e dizajnit Impeccable dhe ndihmësit e saj të ekzekutueshëm mbeten të disponueshëm sipas nevojës nën `.agents/skills/impeccable`. Hook-u i saj i dikurshëm për Codex tregonte te një direktori që nuk ekzistonte; rrjedha e punës së dizajnit tani ekzekutohet kur zgjidhet aftësia e saj, pa asnjë hook dizajni gjithmonë aktiv. Aftësia nuk duhet t'i rikonfigurojë hook-et e projektit si hap anësor gjatë punës me dizajnin.
