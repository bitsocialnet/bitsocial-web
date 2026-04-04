---
title: Voucher Challenge
description: Antispamová výzva, která omezuje publikování za unikátní kódy voucherů distribuované vlastníky komunity.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge je antispamový mechanismus, který zajišťuje publikování obsahu za unikátní kódy voucherů. Místo toho, aby se spoléhalo na automatickou detekci, přesouvá důvěru na vlastníka komunity, který ručně distribuuje kódy lidem, kterým důvěřují.

**Zdrojový kód:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Jak to funguje

1. Vlastník komunity vygeneruje jeden nebo více jedinečných kódů voucherů.
2. Vlastník tyto kódy distribuuje důvěryhodným autorům prostřednictvím kanálu, který si zvolí (přímá zpráva, e-mail, osobně atd.).
3. Když se autor pokusí publikovat, systém výzvy jej vyzve k zadání kódu voucheru.
4. Kód je ověřen – pokud je pravý a ještě nebyl použit, je zveřejnění přijato.

Každý kód voucheru je po uplatnění vázán na konkrétního autora, což zabraňuje opětovnému použití ostatními.

## Kdy ji použít

Voucher Challenge se nejlépe hodí pro:

- **Komunity pouze pro zvané**, kde je členství záměrně omezeno.
- **Upravené prostory**, kde majitel osobně prověřuje každého účastníka.
- **Vysoce důvěryhodná prostředí**, kde je automatické hodnocení spamu zbytečné nebo nežádoucí.

Protože vyžaduje ruční distribuci kódu, neškáluje se na velké otevřené komunity. Pro tyto scénáře zvažte místo toho [Spam Blocker](./spam-blocker.md) nebo [EVM Contract Call Challenge](./evm-contract-call.md).

## Integrace

Voucher Challenge se zapojuje do stejného rozhraní výzvy, jaké používají jiné antispamové balíčky v ekosystému Bitsocial. Vlastníci komunity to umožňují prostřednictvím nastavení komunity a výzva se autorům zobrazí automaticky, když se pokusí přidat příspěvek.
