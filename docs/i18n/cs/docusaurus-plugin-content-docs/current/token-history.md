---
title: Historie tokenu BSO
description: Úplná historie generací tokenu BSO, od jeho vzniku na Avalanche v roce 2021 až po dnešní neměnný kontrakt na Ethereu bez administrátorských práv.
---

# Historie tokenu BSO

BSO je coin s doložitelným původem. Protokol, na kterém Bitsocial stojí, je otevřený a token i
řetězec jsou záměrně volitelné: kdokoli může kód forknout, provozovat vlastního klienta nebo nad ním
postavit vlastní ekonomiku. Co forknout nelze, je původ. BSO je oficiálním tokenem Bitsocial od
prvního dne a každá pozdější migrace je ověřitelná přímo on-chain.

Tato stránka uvádí každou generaci tokenu v pořadí, včetně úplných adres kontraktů, aby si záznam
mohl kdokoli nezávisle ověřit.

## Gen 1: začátek na Avalanche, 2021

- **Řetězec**: Avalanche
- **Rok**: 2021
- **Adresa**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Průzkumník**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Tady BSO začal. Zásoba byla rozdána prostřednictvím tří airdropů a odměn z liquidity miningu, bez presale a bez podílu vyčleněného pro tým před komunitou. Kontrakt byl upgradovatelný proxy, což byla tehdy běžná praxe a týmu to umožňovalo
dodávat opravy v raném období tokenu.

## Gen 2: přechod na Ethereum, 2024

- **Řetězec**: Ethereum
- **Rok**: 2024
- **Adresa**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Průzkumník**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 přesunula BSO z Avalanche na Ethereum, kde se staví zbytek plánu pro Bitsocial Chain. Stejně
jako Gen 1 byl i tento kontrakt stále upgradovatelný proxy, ponechaný o jednu generaci navíc, než
byl připraven finální trvalý kontrakt.

## Gen 3: plně neměnný, 2025

- **Řetězec**: Ethereum
- **Rok**: 2025
- **Adresa**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Průzkumník**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 je současný a finální kontrakt BSO. Je plně neměnný a nemá žádného administrátora:

- žádná funkce mint, takže zásobu nelze nafouknout
- žádná adresa vlastníka, takže nikdo nemůže jednostranně změnit chování kontraktu
- žádná funkce pause, takže převody nelze zmrazit
- žádný proxy vzor, takže samotnou logiku nelze později vyměnit

To je cílový stav, ke kterému první dvě generace směřovaly: token, u kterého už nezbývají žádné
administrátorské klíče.

## Jak migrace probíhaly

Každá migrace, z Gen 1 na Gen 2 i z Gen 2 na Gen 3, byla pasivní airdrop v poměru 1:1. Držitelé
nemuseli podávat žádost, podepisovat zprávu ani dělat cokoli dalšího. Zůstatky na starém kontraktu
byly přečteny přímo a zrcadleny v poměru 1:1 na nový kontrakt, takže pozice držitele zůstala napříč
migrací přesně zachována.

Protože staré i nové kontrakty zůstávají veřejné a on-chain, je každý krok tohoto procesu nezávisle
ověřitelný. Kdokoli může porovnat historické snapshoty držitelů z Gen 1 nebo Gen 2 se současnými
zůstatky Gen 3 a potvrdit, že migrace odpovídala tomu, co deklarovala. Žádná část této historie
nestojí na tom, že byste museli Bitsocial věřit na slovo.

## Ověřte si všechno

Nic z toho neberte na víru. Zkontrolujte záznam přímo:

- Gen 1 na [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 na [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 na [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- aktuální web řetězce na [chain.bitsocial.net](https://chain.bitsocial.net)

Pokud se adresa neshoduje s tím, co je uvedeno zde, nejde o oficiální token BSO.
