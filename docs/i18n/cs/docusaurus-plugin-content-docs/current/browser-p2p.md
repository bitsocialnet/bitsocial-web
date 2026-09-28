---
title: Peer-to-Peer v prohlížeči
description: Jak webová aplikace Bitsocial provozuje skutečný uzel libp2p přímo v záložce prohlížeče, které transporty používá a jaká upstreamová oprava z roku 2026 zprovoznila publikování ze záložky.
---

# Peer-to-Peer v prohlížeči

Webová aplikace Bitsocial nemusí být jen klientem cizího serveru. Může přímo v záložce prohlížeče
provozovat uzel [Helia](https://helia.io/), připojit se ke stejné peer-to-peer síti jako desktopové
a CLI uzly, stahovat obsah komunit od peerů a publikovat přes pubsub.

Tato stránka vysvětluje, co to prakticky znamená, které transporty se přitom používají, co takový
uzel stále neumí a proč publikování ze záložky začalo fungovat až v roce 2026.

Širší návrh sítě popisuje [Protokol Peer-to-Peer](/peer-to-peer-protocol/).

## Co běží v záložce

Když je P2P v prohlížeči aktivní, drží stránka skutečný uzel libp2p:

- navazuje spojení s dalšími peery přes zabezpečené WebSockets
- stahuje a ověřuje obsah komunit přímo od těchto peerů, nikoli z IPFS gateway
- účastní se gossipsubu, takže publikování příspěvku nepotřebuje hostovaného poskytovatele pubsub
- používá stejný klientský stack protokolu (`pkc-js`) jako každá další aplikace Bitsocial

Praktickým důsledkem je, že mezi čtenářem na webu a komunitou nestojí žádný provozovatel gateway.
Neexistuje jediný HTTPS endpoint, na který by stačilo zatlačit, aby komunita naráz zmizela všem
uživatelům v prohlížeči.

## Jak se uzly v prohlížeči připojují

`pkc-js` navazuje spojení s peery přes **zabezpečené WebSockets**. Spojení přes WebRTC
a WebTransport jsou ve výchozím nastavení zamítána connection gaterem, protože v prohlížeči přidávají
dlouhé a často neúspěšné cesty k navázání spojení — vyjednávání STUN/ICE, rotaci certhashů —, které
zpomalují načítání stránky, zatímco WebSocket nabízí přímý a spolehlivý transport. Volající, kteří
WebRTC nebo WebTransport výslovně chtějí, mohou gater přepsat přes
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Praktickým důsledkem je, že peer v prohlížeči se připojuje k uzlům vystavujícím WSS endpoint,
a takové uzly tedy potřebují doménu a certifikát podepsaný certifikační autoritou. Peery za běžnými
domácími připojeními, které nic z toho nemají, se dosahuje nepřímo, ne přímým spojením ze záložky.

## Proč publikování z prohlížeče začalo fungovat až v roce 2026

Peer-to-peer v prohlížeči není nová myšlenka. V roce 2026 se změnilo to, že _příspěvky_ uzlu
běžícího v prohlížeči se konečně dostanou ke zbytku sítě.

Specifikace pubsub v libp2p vyžaduje, aby `seqno` zprávy bylo lineárně rostoucí 64bitové celé číslo
v pořadí big-endian. `js-libp2p-gossipsub` místo toho generoval osm náhodných bajtů, zatímco
go-libp2p-pubsub i rust-libp2p používaly čítač. Kubo 0.40+ zapíná ve výchozím nastavení
`BasicSeqnoValidator`, který zamítne každou zprávu, jejíž seqno není vyšší než dosud nejvyšší
viděné od daného peeru.

Důsledkem bylo, že většinu zpráv publikovaných uzlem v JavaScriptu — včetně uzlu v prohlížeči —
peery s Kubo tiše zahodily. Reprodukční test naměřil, že z 30 zpráv dorazily 2 až 8.

Problém byl popsán v
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) a opraven ve
verzi **`@libp2p/gossipsub` 15.0.21** v květnu 2026. Do té doby se uzel v prohlížeči dokázal
připojit a číst, ale jeho příspěvky se cestou ke Go peerům většinou ztratily. `pkc-js` dodává
`@libp2p/gossipsub` ve verzi 16.0.4, tedy až za touto opravou.

## Co uzel v prohlížeči stále neumí

Uzel v prohlížeči je skutečný peer, ne server. Má jiné limity než desktopový nebo trvale běžící uzel:

- obvykle nedokáže přijímat libovolná příchozí spojení z veřejného internetu
- funguje jen po dobu, kdy je záložka otevřená, takže není dlouhodobým hostitelem dat komunity
- nemůže se připojit k DHT v libp2p, a proto zjišťování probíhá přes HTTP routery
- pro seedování ve větším měřítku se hodí špatně

Plnohodnotné hostování komunity nadále nejlépe zvládne desktopová aplikace, `bitsocial-cli` nebo
jiný trvale běžící uzel. P2P v prohlížeči mění to, kdo může _číst a přispívat_ bez gateway;
neodstraňuje potřebu peerů, kteří zůstávají online.

## HTTP routery nejsou gateways

Klienti v prohlížeči se stále dotazují
[HTTP routerů](/peer-to-peer-protocol/#public-key-based-addressing), aby zjistili, kteří peeři
právě poskytují adresu dané komunity. To je poctivá hvězdička u tvrzení „čisté peer-to-peer
v prohlížeči“ a stojí za to být v tom přesný:

- router uchovává jen adresy peerů k dané adrese obsahu
- obsah komunity neukládá, neposkytuje a ani ho nezná
- klienti se dotazují několika routerů paralelně a výsledky slučují
- provozovat ho může kdokoli a výměna routeru je změna konfigurace bez migrace dat

Po zjištění peerů probíhá přenos obsahu i provoz pubsub peer-to-peer. Router, který zmizí, vás
připraví o jednu vyhledávací cestu, ne o data. IPFS gateway naproti tomu leží přímo v cestě obsahu.

## Kde to dnes běží

- [5chan](/apps/5chan/) běží ve výchozím nastavení jako čisté P2P v prohlížeči ve webové aplikaci na
  [5chan.app](https://5chan.app).

## Záložní gateway

Přístup přes gateway existuje dál jako cesta kompatibility pro prohlížeče nebo sítě, které se
nemohou připojit přímo. Viz [Záložní gateway](/peer-to-peer-protocol/#gateway-fallback). Cílovou
architekturou je P2P v prohlížeči na prvním místě a gateways jako volitelná záloha, ne jako výchozí
úzké hrdlo.
