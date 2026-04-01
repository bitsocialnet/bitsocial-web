---
title: Wyzwanie kuponowe
description: Wyzwanie antyspamowe, które uniemożliwia publikację unikalnych kodów kuponów dystrybuowanych przez właścicieli społeczności.
sidebar_position: 3
---

# Wyzwanie kuponowe

Voucher Challenge to mechanizm antyspamowy, który blokuje publikację treści za unikalnymi kodami kuponów. Zamiast polegać na automatycznym wykrywaniu, przenosi zaufanie na właściciela społeczności, który ręcznie dystrybuuje kody zaufanym osobom.

**Kod źródłowy:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Jak to działa

1. Właściciel społeczności generuje jeden lub więcej unikalnych kodów kuponów.
2. Właściciel dystrybuuje te kody zaufanym autorom za pośrednictwem wybranego przez nich kanału (bezpośrednia wiadomość, e-mail, osobiście itp.).
3. Gdy autor próbuje opublikować, system wyzwania prosi go o podanie kodu promocyjnego.
4. Kod zostaje zweryfikowany – jeżeli jest autentyczny i nie był jeszcze używany, publikacja zostaje zaakceptowana.

Po wykorzystaniu każdy kod kuponu jest powiązany z konkretnym autorem, co uniemożliwia jego ponowne wykorzystanie przez innych.

## Kiedy go używać

Voucher Challenge najlepiej nadaje się do:

- **Społeczności dostępne tylko dla zaproszonych**, w których członkostwo jest celowo ograniczone.
- **Wybrane przestrzenie**, w których właściciel osobiście sprawdza każdego uczestnika.
- **Środowiska o wysokim poziomie zaufania**, w których automatyczna ocena spamu jest niepotrzebna lub niepożądana.

Ponieważ wymaga ręcznej dystrybucji kodu, nie można go skalować do dużych otwartych społeczności. W takich scenariuszach rozważ zamiast tego opcję [Blokada spamu](./spam-blocker.md) lub [Wyzwanie wywołania kontraktu EVM](./evm-contract-call.md).

## Integracja

Voucher Challenge łączy się z tym samym interfejsem wyzwań, z którego korzystają inne pakiety antyspamowe w ekosystemie Bitsocial. Właściciele społeczności umożliwiają to w swoich ustawieniach społeczności, a wyzwanie jest automatycznie prezentowane autorom, gdy próbują opublikować post.
