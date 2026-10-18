---
title: Kde příspěvky jsou a jak dlouho vydrží
description: Proč jsou příspěvky Bitsocialu podepsané a adresované obsahem, ale každý uzel je neukládá navždy, kdo je drží online a jak archivy udržují starý obsah čitelný.
---

# Kde příspěvky jsou a jak dlouho vydrží

Bitsocial neukládá každý příspěvek na blockchain ani do firemní databáze. Příspěvky drží vlastní uzel
každé komunity, čtenáři a seedery pomáhají s jejich doručováním a kdo chce trvalý záznam, může jej
uchovat. Uchovávat příspěvky navždy je **volitelné, ne povinné**: protokol nenutí každého účastníka
ukládat historii celé sítě.

Tato stránka vysvětluje, co to znamená v praxi, protože „neukládá se navždy“ lze snadno mylně chápat
jako „zmizí“ nebo „věř mi“.

## Autenticita a dostupnost jsou různé otázky

O příspěvku jsou dvě odlišné otázky:

1. **Je pravý?** Napsal jej tento autor a přijala ho tato komunita?
2. **Je stále online?** Může jej dnes někdo stáhnout?

Na první otázku Bitsocial odpovídá kryptografií, ne důvěrou. Každý příspěvek je podepsán párem klíčů
autora a po přijetí komunitou je uložen pod identifikátorem obsahu (CID), hashem jeho přesných bytů.
Kdokoli, kdo příspěvek stáhne, si může podpis i hash sám ověřit. Uzel, router, brána ani archiv nemohou
změnit text příspěvku ani podvrhnout příspěvek jiného člověka, aniž by ověření selhalo.

Druhá otázka se týká toho, kdo drží kopii, a jen tato část není zaručena.

## Kdo drží příspěvky online

- **Uzel komunity.** Uzel vlastníka přijímá příspěvky a drží je v databázi, dokud je drží komunita.
  Je to kopie, která existuje vždy, když komunita běží. Viz
  [Protokol peer-to-peer](/peer-to-peer-protocol/).
- **Čtenáři.** Desktopové aplikace, jako aplikace 5chan Electron, seedují načtené komunity, dokud běží;
  oblíbené komunity tak obsluhuje mnoho peerů jako oblíbené torrenty. Záložka prohlížeče může otevřený
  obsah ukládat do mezipaměti a ověřovat, není však dlouhodobým hostitelem.
- **Seedery.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) dovoluje komukoli
  přispět trvale zapnutou kapacitou z VPS nebo volného stroje. Připíná nejnovější stránky komunit a
  aktualizace příspěvků; proto se z prohlížečů načtou i komunity za domácími routery.
- **Archiváři.** Kdokoli může komunity procházet a uchovat vše, co vidí. Archivy jsou běžné služby nad
  sítí, ne zvláštní role v protokolu.

## Komunity si volí vlastní dobu uchování

O tom, jak dlouho komunita drží staré příspěvky, rozhoduje její vlastník, ne pravidlo protokolu. Některé
komunity chtějí roky historie. Jiné jsou navrženy tak, aby zapomínaly: boardy 5chan fungují jako
imageboard, kde thready z boardu odpadnou, přesunou se do archivu a po stanovené době (ve výchozím stavu
48 hodin) jsou z uzlu boardu vymazány. Komunita může archiv také zcela vynechat.

Stejný protokol podporuje obě možnosti, protože uchovávání je zásada každé komunity, nikoli náklad,
který musí platit každý uzel.

## Proč neukládat vše navždy?

Síť, která vyžaduje, aby každý uzel držel každý příspěvek navždy, to musí nějak zaplatit:

- **Blockchainy** nutí každý plný uzel ukládat celou historii, takže nároky na uzly rostou se vší
  aktivitou a publikování obvykle stojí poplatek.
- **Placené úložiště**, například storage rent Farcasteru, nutí uživatele platit za historii a maže
  nejstarší příspěvky nad rámec toho, za co zaplatili. Viz
  [Bitsocial a Farcaster](/comparisons/farcaster/).
- **Centrální servery** drží vše, ale jen dokud to chce jedna společnost a podle jejích pravidel.

Sociální média nepotřebují globální účetní knihu. Nezáleží na tom, zda byl příspěvek A přijat o
milisekundu dříve než B, a většina starých příspěvků se čte jen zřídka. Bitsocial nechává každý uzel
komunity držet jen vlastní komunity, takže hosting zůstává levný pro notebook, Raspberry Pi nebo malý
VPS. Viz [Proč ne blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Kompromis

Když nikdo nedrží kopii příspěvku, může být nedostupný. CID příspěvku se nikdy nemění, ale CID je jen
adresa: obsah lze stáhnout jen tehdy, když jej poskytuje aspoň jeden uzel. Pokud uzel komunity natrvalo
vypadne a žádný čtenář, seeder ani archiv její příspěvky neuchoval, jsou tyto příspěvky pryč.

To je poctivá cena za nevyžadování globální účetní knihy. Je to i cena, kterou už mají všechny velké
platformy: staré příspěvky z nich mizí, když zmizí účty, servery nebo firmy. Rozdíl je, že na Bitsocialu
nikdo nepotřebuje povolení, aby něco uchoval.

## Zachování toho důležitého

- **Provozujte uzel komunity sami.** Vlastník, který jej nechá běžet, drží historii komunity, dokud ji
  uchovává nastavení komunity.
- **Seedujte.** Otevřená desktopová aplikace nebo běžící `bitsocial-seeder` drží komunity dostupné pro
  ostatní.
- **Archivujte.** Nezávislé archivy udrží staré thready čitelné a vyhledatelné poté, co je komunita
  odstraní. [5archive.org](https://5archive.org) archivuje boardy 5chan a
  [seeditarchive.org](https://seeditarchive.org) archivuje komunity Seedit. Oba jsou open source,
  takže kdokoli může provozovat zrcadlo či konkurenční archiv.

Protože každý archivovaný příspěvek zůstává podepsaný, archiv nemůže potají přepsat, co někdo řekl:
čtenář může ověřit podpis archivovaného příspěvku stejně jako u živého.