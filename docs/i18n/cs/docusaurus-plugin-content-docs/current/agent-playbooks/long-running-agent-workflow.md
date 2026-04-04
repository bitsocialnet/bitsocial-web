# Dlouhotrvající pracovní postup agenta

Tuto příručku použijte, pokud je pravděpodobné, že úkol bude zahrnovat více relací, předání nebo vytvoření agentů.

## Cíle

- Poskytněte každé nové relaci rychlý způsob, jak znovu získat kontext
- Pracujte postupně, místo abyste jednorázově udělali velkou změnu
- Než přidáte další kód, zachyťte nefunkční místní směrný plán
- Zanechte odolné artefakty, kterým může příští sezení věřit

## Kde udržet stát

- Použijte `docs/agent-runs/<slug>/`, když lidé, kontrolní roboti nebo více toolchainů potřebují stejný stav úkolu.
- Adresář místního nástroje, jako je `.codex/runs/<slug>/`, použijte pouze v případě, že je stav úlohy záměrně lokální pro jednu pracovní stanici nebo jeden řetězec nástrojů.
- Neskrývejte sdílený stav více relací v soukromém odkládacím souboru, pokud jej později bude potřebovat jiný přispěvatel nebo agent.

## Požadované soubory

Na začátku dlouhotrvající úlohy vytvořte tyto soubory:

- `feature-list.json`
- `progress.md`

Použijte šablony v `docs/agent-playbooks/templates/feature-list.template.json` a `docs/agent-playbooks/templates/progress.template.md`.

Upřednostněte JSON pro seznam funkcí, aby agenti mohli aktualizovat malý počet polí bez přepisování celého dokumentu.

## Kontrolní seznam zahájení relace

1. Spusťte `pwd`.
2. Přečtěte si `progress.md`.
3. Přečtěte si `feature-list.json`.
4. Spusťte `git log --oneline -20`.
5. Spusťte `./scripts/agent-init.sh --smoke`.
6. Vyberte přesně jednu položku s nejvyšší prioritou, která je stále `pending`, `in_progress` nebo `blocked`.

Pokud se krok kouře nezdaří, opravte přerušenou základní linii před implementací nového segmentu funkce.

## Pravidla relace

- Pracujte na jednom prvku nebo dílčím úkolu najednou.
- Udržujte seznam funkcí strojově čitelný a stabilní. Aktualizujte stav, poznámky, soubory a ověřovací pole namísto přepisování nesouvisejících položek.
- Označte položku ověřenou pouze po spuštění příkazu nebo uživatelského toku uvedeného v této položce.
- Používejte vytvořené agenty pro ohraničené řezy, nikoli pro celkové vlastnictví stavu úkolu.
- Když podřízený agent vlastní jednu položku, dejte jí přesné ID položky, kritéria přijetí a soubory, kterých se může dotýkat.

## Kontrolní seznam ukončení relace

1. Připojte krátký záznam průběhu k `progress.md`.
2. Aktualizujte dotčenou položku v `feature-list.json`.
3. Zaznamenejte si přesné spuštění příkazů pro ověření.
4. Zachyťte blokátory, sledování a další nejlepší položku, kterou chcete obnovit.

## Doporučený vstupní tvar postupu

Použijte krátkou strukturu jako:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
