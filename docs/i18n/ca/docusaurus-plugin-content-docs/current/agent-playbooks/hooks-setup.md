# Hooks d'agents

Els hooks de cicle de vida confirmats al repositori només formaten, amb l'oxfmt instal·lat, els fitxers JavaScript/TypeScript editats correctament. La lògica compartida és a `scripts/agent-hooks/format.mjs`; cada wrapper natiu hi delega.

| Aplicació | Configuració nativa | Esdeveniment |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude no llegeix cap `.claude/hooks.json` independent. Cada aplicació continua controlant la confiança en el projecte i si els hooks estan activats; reviseu-ne la configuració actual en lloc d'eludir la confiança. `.codex/config.toml` és configuració del repositori, no un registre d'ordres de hooks.

El formatador valida l'esdeveniment i la càrrega útil, que l'edició hagi tingut èxit, l'extensió del fitxer i que el fitxer sigui dins del repositori, inclosos els enllaços simbòlics. Si falten dependències o l'entrada no és rellevant, no fa res. Les ordres fan servir un array d'arguments amb l'accés a la xarxa de Corepack desactivat; els hooks no instal·len dependències, no executen builds ni revisions i no modifiquen Git.

Executeu les comprovacions explícitament segons [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Executeu `yarn ai-workflow:sync`, `yarn ai-workflow:check` i `yarn ai-workflow:test` després de canviar el flux de treball. Els fixtures fan servir fitxers d'un sol ús i invocacions simulades del formatador; no demostren que cada aplicació hagi carregat la seva configuració. Després de les actualitzacions, recarregueu l'aplicació i reviseu-ne el catàleg.

La skill de disseny Impeccable i els seus helpers executables continuen disponibles sota demanda a `.agents/skills/impeccable`. El seu antic hook de Codex apuntava a un directori inexistent; ara el flux de disseny s'executa quan se selecciona la seva skill, sense cap hook de disseny sempre actiu. La skill no ha de reconfigurar els hooks del projecte com a pas secundari d'una feina de disseny.
