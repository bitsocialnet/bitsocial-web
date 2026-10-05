# Dovednosti a nástroje

Sdílené dovednosti žijí v `.agents/skills/`. Upravujte tyto zdroje a pak spusťte `yarn ai-workflow:sync`, který pro Claude Code vygeneruje `.claude/skills/`. Codex a Cursor objevují `.agents/skills/` přímo; neobnovujte duplicitní kořeny `.codex/skills/` ani `.cursor/skills/`.

Sdílené prompty rolí žijí v `.agents/roles/*.md`. Jde o zdrojový formát specifický pro tento repozitář, nikoli o nativní cestu, kterou by agenti sami objevovali. `scripts/ai-workflow-files.mjs` převádí tyto zdroje na níže uvedené soubory pro jednotlivé aplikace; `yarn ai-workflow:sync` je zapisuje. Vygenerované soubory commitujte spolu s jejich zdroji, aby čerstvý checkout měl nativní konfiguraci, aniž by bylo nutné nejdřív spouštět generátor. Po odstranění zdroje odstraňte explicitně i jeho zastaralé vygenerované výstupy; validátor je nahlásí, místo aby soubory potichu mazal.

## Nativní cesty objevování

Ověřeno podle oficiální dokumentace ke dni 2026-09-12:

| Aplikace    | Instrukce projektu                                                                                  | Dovednosti používané tímto repozitářem        | Vlastní agenti používaní tímto repozitářem |
| ----------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| Codex       | `AGENTS.md`                                                                                         | `.agents/skills/<name>/SKILL.md`              | Vygenerované `.codex/agents/<name>.toml`   |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` zůstává k dispozici pro podmíněná pravidla specifická pro Cursor | `.agents/skills/<name>/SKILL.md`              | Vygenerované `.cursor/agents/<name>.md`    |
| Claude Code | `CLAUDE.md` importuje `@AGENTS.md`                                                                  | Vygenerované `.claude/skills/<name>/SKILL.md` | Vygenerované `.claude/agents/<name>.md`    |

Zdroje: [dovednosti v Codexu](https://learn.chatgpt.com/docs/build-skills), [subagenti v Codexu](https://learn.chatgpt.com/docs/agent-configuration/subagents), [pravidla v Cursoru](https://cursor.com/docs/rules), [dovednosti v Cursoru](https://cursor.com/docs/skills), [subagenti v Cursoru](https://cursor.com/docs/subagents), [paměť v Claude](https://code.claude.com/docs/en/memory), [dovednosti v Claude](https://code.claude.com/docs/en/skills), [subagenti v Claude](https://code.claude.com/docs/en/sub-agents).

Nenahrazujte nativní adresáře agentů adresářem `.agents/roles` a nepředpokládejte, že Claude objevuje `.agents/skills`. Claude si odkazovaný soubor odtamtud i tak může přečíst jako běžný kontext projektu. Cursor kvůli kompatibilitě objevuje také `.claude/skills`; kopie zůstávají synchronizované, ale jeho zveřejněná příručka k dovednostem nespecifikuje deduplikaci napříč těmito kořeny. Místo slibů, že se duplicitní položky nemohou objevit, zkontrolujte katalog dovedností v nainstalované aplikaci.

Adresáře pro AI používají díky `.gitattributes` konce řádků LF, aby vygenerovaný text zůstal na všech platformách totožný. Podpůrné soubory dovedností se kopírují bajt po bajtu.

## Dovednosti

| Dovednost                            | Účel                                                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Vytváření autorizovaných lokálních commitů s vymezeným rozsahem                                                             |
| `commit-format`, `issue-format`      | Formátované návrhy na požádání                                                                                              |
| `make-closed-issue`                  | Vytvoření autorizovaného issue, commitu s vymezeným rozsahem a PR                                                           |
| `review-and-merge-pr`                | Třídění zpětné vazby k PR; opravy, publikace a merge jen v rámci požadovaného rozsahu                                       |
| `fix-merge-conflicts`                | Řešení konfliktů a ověření výsledku sloučení                                                                                |
| `release`                            | Příprava textu vydání a provedení autorizovaných kroků vydání                                                               |
| `code-quality-review`                | Revize netriviálních diffů nebo výslovně vyžádaného problému s kvalitou                                                     |
| `retro`                              | Přeměna prokázaných chyb na cílené kontroly nebo pokyny, které zabrání jejich opakování                                     |
| `refactor-pass`, `deslop`            | Vyžádaný úklid existujících změn                                                                                            |
| `debug-agent`                        | Ladění založené na důkazech, v případě potřeby s instrumentací                                                              |
| `you-might-not-need-an-effect`       | Cílená revize efektů a memoizace                                                                                            |
| `vercel-react-best-practices`        | Použitelná doporučení pro výkon Reactu; pravidla jen pro Next.js nebo server u tohoto klienta postaveného na Vite přeskočte |
| `translate`                          | Generování překladů a následné aplikování map přes jediný zapisovač                                                         |
| `playwright-cli`, `inspect-elements` | Ověřování v prohlížeči a mapování DOM na zdrojový kód                                                                       |
| `profile-browsing`                   | Cílené profilování prohlížeče a Reactu                                                                                      |
| `test-apk`                           | Ověření dodaného doprovodného obalu pro Android                                                                             |
| `impeccable`, `improve-threejs`      | Vymezený design rozhraní a revize vykreslování v Three.js                                                                   |
| `implement-plan`                     | Provedení plánu s volitelnou ohraničenou delegací                                                                           |
| `readme`                             | Údržba ověřené projektové dokumentace                                                                                       |
| `context7`                           | Získání dokumentace knihoven odpovídající dané verzi                                                                        |
| `find-skills`                        | Hledání dalších dovedností na výslovné vyžádání                                                                             |

## Role a modely

Vlastní role ponechte pro `browser-check`, `profiler`, `test-apk`, `translator` a `reviewer`. Pro běžnou implementaci a průzkum kódu použijte vestavěnou roli agentního prostředí worker/general-purpose nebo explorer. Rodičovský agent přiděluje kritéria přijetí a vlastnictví; náročné kontroly spouští jediný vlastník.

Soubory agentů pro Codex obsahují `name`, `description` a `developer_instructions`. `.codex/config.toml` omezuje počet souběžných podřízených agentů na čtyři pomocí `max_concurrent_threads_per_session`. Sdílená metadata rolí obsahují název, popis a volitelný režim sandboxu; pole pro model záměrně nemají.

Pole pro model a úroveň uvažování vynechte z commitnutých dovedností a vlastních agentů ve všech třech aplikacích. Díky tomu se uplatní volby při spuštění, výchozí nastavení uživatele a dědění od rodiče podle dokumentovaného pořadí priorit každé aplikace. Aliasy rodin modelů v Claude snižují nároky na údržbu verzí, ale stále určují rodinu; verzovaný model v Cursoru bude vyžadovat budoucí aktualizace. Pokud je taková volba potřeba, držte ji v nastavení uživatele nebo relace. Dědění nezaručuje automatický výběr nejlepšího aktuálního modelu. Nevymýšlejte alias `latest` a nepřidávejte do rutinních úloh průzkum katalogu modelů. Viz [výběr v Codexu](https://learn.chatgpt.com/docs/agent-configuration/subagents), [výběr v Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) a [výběr v Cursoru](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` se mapuje na sandbox Codexu a na `readonly` v Cursoru; u Claude jeho revizní postup omezují seznam nástrojů a instrukce role, přístup k Bashi však není sandbox na úrovni operačního systému.

Frontmatter sdílených dovedností používá u workflow spouštěných uživatelem, kde je to vhodné, `disable-model-invocation: true`. Odpovídající nastavení Codexu žije v `agents/openai.yaml` jako `policy.allow_implicit_invocation: false`; validátor vyžaduje obojí. Metadata o spouštění doplňují pravidla explicitní autorizace; žádost o revizi nikdy neopravňuje k publikaci jen proto, že dovednost obsahuje kroky publikace.

## Kontroly a objevování

- `yarn ai-workflow:sync` znovu generuje výstupy pro kompatibilitu pomocí nainstalovaných `js-yaml` a `smol-toml`.
- `yarn ai-workflow:check` parsuje zdroje, frontmatter a konfigurace a kontroluje vygenerované výstupy, metadata o spouštění, umístění polí pro model a zapojení hooku, který pouze formátuje. Identifikátory modelů neověřuje proti katalogu poskytovatele.
- `yarn ai-workflow:test` spouští izolované fixtures v Node pro payloady hooků a pro generování a validaci workflow.
- Po aktualizaci agentní aplikace ověřte přímo v ní, že objevuje dovednosti a role. Kontroly syntaxe a parity nenahrazují kontrolu načítání. Pokud si existující relace drží starý katalog, aplikaci znovu načtěte.
- Hooky vyžadují, aby agentní prostředí projektu důvěřovalo a hooky schválilo; neobcházejte důvěru jen proto, aby kontrola prošla. Viz [hooks-setup.md](hooks-setup.md).

## Udržování užitečných instrukcí

Řiďte se [doporučeními OpenAI k dovednostem a promptům](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (zkontrolováno 2026-09-12): popisy udržujte přesné, podrobnosti načítejte jen tehdy, když jsou relevantní, a zachovávejte rozsah, o který uživatel požádal. Sdílené dovednosti slouží různým modelům; zachovejte invarianty specifické pro projekt a zároveň ponechte prostor pro běžná implementační rozhodnutí.

Účel dovednosti, hranice jejího rozhodování a zásadní omezení držte v `SKILL.md`. Rozsáhlé příkazy nebo příklady pro konkrétní režimy odkazujte jako volitelné reference. Podmínky spuštění uvádějte na začátku krátkých popisů; samotné shodné klíčové slovo by nemělo rozšiřovat úlohu. Existující metadata o spouštění zachovejte, pokud jejich chování záměrně neměníte.

Po podstatné změně instrukcí vyzkoušejte několik reprezentativních malých i velkých požadavků. Zkontrolujte, které dovednosti a reference byly vybrány, zda akce zůstaly v rámci rozsahu, zda ověření odpovídalo změně a zda byla autorizovaná práce dokončena. Testy schémat a fixtures prokazují správnost nástrojů, ne kvalitu rozhodování agenta.

## Nástroje a vlastnictví prohlížeče

Upřednostňujte existující katalog dovedností a nástrojů a nainstalovaná CLI projektu. Pro GitHub používejte `gh`, pro ověřování v prohlížeči `playwright-cli` a oficiální dokumentaci pro konkrétní verzi, když záleží na chování knihovny. Neinstalujte duplicitní dovednosti a nestahujte nepřipnutý balíček jen proto, abyste spustili existující formátovač.

Režie MCP závisí na agentním prostředí: odložené načítání nástrojů může zabránit tomu, aby se všechna schémata načetla předem. Integrace udržujte relevantní, místo abyste MCP jako takové považovali za zastaralé. Stávající volba CLI nástrojů zůstává užitečná kvůli reprodukovatelnosti a kontrole nad prostředky.

Všechny relace prohlížeče používají `./scripts/pw-session.sh`, který vynucuje jediný aktivní prohlížeč v rámci celého stroje. Ve výchozím stavu použijte čerstvou izolovanou relaci. Přístup k aktuálnímu osobnímu prohlížeči vyžaduje výslovnou autorizaci; jakmile ji získáte, platí i pro následující kroky. Prohlížeče a viewporty volte podle dotčeného chování, vybrané enginy spouštějte postupně, při úklidu zavřete přesně tu pojmenovanou relaci a nikdy nepoužívejte `close-all`/`kill-all`. Viz dovednost `playwright-cli` a [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
