---
title: Kupongutmaning
description: Antispam-utmaning som låser publicering bakom unika kupongkoder som distribueras av community-ägare.
sidebar_position: 3
---

# Kupongutmaning

Voucher Challenge är en anti-spam-mekanism som låser publicering av innehåll bakom unika kupongkoder. Istället för att förlita sig på automatiserad detektering flyttar den förtroendet till communityägaren, som manuellt distribuerar koder till personer de litar på.

**Källkod:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Hur det fungerar

1. En communityägare genererar en eller flera unika verifikationskoder.
2. Ägaren distribuerar dessa koder till betrodda författare via en valfri kanal (direktmeddelande, e-post, personligen, etc.).
3. När en författare försöker publicera, uppmanar utmaningssystemet dem att ange en kupongkod.
4. Koden är validerad -- om den är äkta och inte redan har använts accepteras publiceringen.

Varje kupongkod är knuten till en specifik författare när den har lösts in, vilket förhindrar återanvändning av andra.

## När du ska använda den

Voucher Challenge är bäst lämpad för:

- **Gruppen endast för inbjudningar** där medlemskapet avsiktligt begränsas.
- **Utvalda utrymmen** där ägaren personligen vetar varje deltagare.
- **Högförtroendemiljöer** där automatiserad skräppostpoängning är onödig eller oönskad.

Eftersom det kräver manuell koddistribution, skalas det inte till stora öppna gemenskaper. För dessa scenarier, överväg [Spamblockerare](./spam-blocker.md) eller [EVM Contract Call Challenge](./evm-contract-call.md) istället.

## Integration

Voucher Challenge ansluts till samma utmaningsgränssnitt som används av andra anti-spam-paket i Bitsocial-ekosystemet. Gemenskapsägare aktiverar det genom sina communityinställningar, och utmaningen presenteras för författare automatiskt när de försöker göra inlägg.
