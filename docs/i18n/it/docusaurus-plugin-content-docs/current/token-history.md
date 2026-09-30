---
title: Storia del token BSO
description: La storia completa delle generazioni del token BSO, dall'origine su Avalanche nel 2021 all'attuale contratto Ethereum immutabile e senza amministratori.
---

# Storia del token BSO

BSO è una moneta di provenienza. Il protocollo dietro Bitsocial è aperto, e il token e la chain sono
opzionali per scelta progettuale: chiunque può forkare il codice, eseguire il proprio client o
costruirci sopra la propria economia. Ciò che nessun fork può portare via è la provenienza. BSO è il
token ufficiale di Bitsocial fin dal primo giorno, e ogni migrazione successiva è verificabile
on-chain.

Questa pagina elenca ogni generazione del token, in ordine, con gli indirizzi completi dei contratti,
così che chiunque possa controllare la documentazione in modo indipendente.

## Gen 1: l'origine, Avalanche, 2021

- **Blockchain**: Avalanche
- **Anno**: 2021
- **Indirizzo**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorer**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

È qui che BSO è nato. L'offerta è stata distribuita tramite tre airdrop e ricompense di liquidity
mining, senza prevendita e senza una quota riservata al team prima della
comunità. Il contratto era un proxy aggiornabile, prassi
standard all'epoca, che permetteva al team di distribuire correzioni nella prima fase di vita del
token.

## Gen 2: il passaggio a Ethereum, 2024

- **Blockchain**: Ethereum
- **Anno**: 2024
- **Indirizzo**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

La Gen 2 ha spostato BSO da Avalanche a Ethereum, dove viene costruito il resto della roadmap di
Bitsocial Chain. Come la Gen 1, anche questo contratto era ancora un proxy aggiornabile, mantenuto
per un'ultima generazione mentre si preparava il contratto finale e definitivo.

## Gen 3: completamente immutabile, 2025

- **Blockchain**: Ethereum
- **Anno**: 2025
- **Indirizzo**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

La Gen 3 è il contratto BSO attuale e definitivo. È completamente immutabile e senza amministratori:

- nessuna funzione di mint, quindi l'offerta non può essere inflazionata
- nessun indirizzo proprietario, quindi nessuno può cambiare unilateralmente il comportamento del
  contratto
- nessuna funzione di pausa, quindi i trasferimenti non possono essere congelati
- nessun pattern proxy, quindi la logica stessa non può essere sostituita in seguito

È lo stato finale verso cui puntavano le prime due generazioni: un token senza più alcuna chiave di
amministrazione da custodire.

## Come hanno funzionato le migrazioni

Ogni migrazione, dalla Gen 1 alla Gen 2 e dalla Gen 2 alla Gen 3, è stata un airdrop passivo 1:1.
Chi deteneva il token non ha dovuto presentare una richiesta, firmare un messaggio o compiere alcuna
azione. I saldi sul vecchio contratto sono stati letti direttamente e replicati 1:1 sul nuovo
contratto, così che la posizione di ciascun detentore fosse conservata esattamente attraverso la
migrazione.

Poiché sia i vecchi contratti sia quelli nuovi restano pubblici e on-chain, ogni passaggio di questo
processo è verificabile in modo indipendente. Chiunque può confrontare le istantanee storiche dei
detentori della Gen 1 o della Gen 2 con i saldi attuali della Gen 3 e confermare che la migrazione
ha fatto ciò che dichiarava. Nessuna parte di questa storia dipende dal credere a Bitsocial sulla
parola.

## Verifica tutto

Non dare nulla per buono sulla fiducia. Controlla direttamente la documentazione:

- Gen 1 su [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 su [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 su [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- il sito attuale della chain su [chain.bitsocial.net](https://chain.bitsocial.net)

Se un indirizzo non corrisponde a quelli elencati qui, non è il token BSO ufficiale.
