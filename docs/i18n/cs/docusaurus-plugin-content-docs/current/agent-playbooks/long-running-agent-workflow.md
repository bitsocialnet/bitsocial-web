# Dlouhotrvající práce agentů

Trvalý stav úlohy používejte, když bude potřeba práci obnovit nebo předat, nebo když je jeden běh tak dlouhý, že by kompakce kontextu mohla ztratit přehled o zbývající práci. Malé úlohy nepotřebují nástěnku úkolů ani soubor s průběhem. U sdílené práce udržujte stručné `feature-list.json` a `progress.md` v adresáři `docs/agent-runs/<slug>/` vyhrazeném pro danou úlohu a podle potřeby využijte existující šablony.

Zaznamenejte požadovaný výsledek, aktuální větev/worktree, vlastnictví souborů, dokončené změny, kontroly s jejich výsledky, vlastněné procesy a relace a další nevyřešený krok. Neukládejte přihlašovací údaje ani libovolné výpisy zdrojového kódu. Funkci označte jako dokončenou teprve tehdy, když jsou ověřena její kritéria přijetí.

Při obnovení práce si před úpravami prohlédněte stav Gitu, nejnovější záznam o průběhu a relevantní zdrojový kód. Kompatibilní prostředky, které vlastníte, znovu využijte; vývojový server spouštějte, jen když ho další kontrola potřebuje. Kontroly vybírejte podle dopadu pomocí [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), místo abyste opakovali plný průchod nad nezměněným stavem.

Související delegovanou práci udržujte jasně vymezenou a bez překryvů. Těžké kontroly a relace prohlížeče vlastní jeden agent. Trvalý stav aktualizujte, když dokončená část, blokátor nebo předání mění to, co potřebuje vědět další přispěvatel; nezapisujte mechanicky každý příkaz.
