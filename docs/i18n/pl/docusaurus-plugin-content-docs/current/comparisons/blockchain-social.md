---
title: Bitsocial i blockchainowe sieci społecznościowe
description: Jak Lens, DeSo i Steem umieszczają dane społecznościowe lub reguły na blockchainie i dlaczego Bitsocial go nie używa.
---

# Bitsocial i blockchainowe sieci społecznościowe

Lens, DeSo i Steem umieszczają aktywność społecznościową na blockchainie. Konta, obserwacje, posty
lub otaczające je reguły stają się transakcjami, które walidatorzy porządkują i przechowują.
Bitsocial nie używa blockchaina: media społecznościowe nie potrzebują globalnej kolejności każdego
posta, więc Bitsocial pomija konsensus, gaz i staking. Uzasadnienie znajdziesz w artykule
[Protokół peer-to-peer](/peer-to-peer-protocol/).

## Co je łączy

- **Ktoś płaci za każdy zapis.** Lens pobiera gaz, który aplikacje mogą sponsorować; DeSo pobiera
  opłatę za każdą akcję; Steem racjonuje akcje według zastakowanych tokenów.
- **Łańcuch narzuca wszystkim jedną politykę antyspamową.** Opłaty, stake i koszty kont obowiązują w
  całej sieci, zamiast być wybierane przez każdą społeczność.
- **Zapisy onchain są trwałe.** Aplikacje mogą ukrywać treści, ale nie mogą usunąć ich z łańcucha.
- **Przeglądarki są klientami API.** Aplikacje webowe podpisują transakcje i czytają dane przez
  węzeł, indekser lub API prowadzone przez kogoś innego.

## Lens

[Lens](https://lens.xyz/) działa na Lens Chain, sieci warstwy 2 Ethereum zbudowanej na ZK Stack od
ZKsync, która korzysta z Avail do zapewnienia dostępności danych. Mask Network
[opiekuje się Lens od stycznia 2026 roku](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **W łańcuchu:** konta są smart kontraktami, nazwy użytkowników są NFT w przestrzeniach nazw, a
  grafy, grupy, feedy i ich reguły również są kontraktami.
- **Poza łańcuchem:** tekst i multimedia posta znajdują się w pliku JSON pod adresem URI, zwykle w
  Grove, usłudze przechowywania Lens działającej przed IPFS. Reakcje i zakładki przechowuje Lens API,
  a aplikacje czytają dane przez to API.
- **Spam i bariery:** transakcje wymagają gazu w GHO, który aplikacje mogą sponsorować z limitami
  częstotliwości. Reguły feedów i grup mogą wymagać posiadania tokenów lub płatności.
- **Działanie łańcucha:** [L2BEAT](https://l2beat.com/scaling/projects/lens) ocenia Lens Chain jako
  validium na etapie Stage 0 z centralnym operatorem, który może odmówić uwzględnienia transakcji.

## DeSo

[DeSo](https://docs.deso.org/) to blockchain warstwy 1 zbudowany dla aplikacji społecznościowych. W
lipcu 2024 roku przeszedł z proof of work na proof of stake.

- **W łańcuchu:** profile, posty, polubienia, obserwacje i wiadomości prywatne to transakcje
  przechowywane przez każdy pełny węzeł. Obrazy i wideo są hostowane poza łańcuchem; węzeł
  referencyjny korzysta z Google Cloud Storage i Cloudflare Stream.
- **Spam:** każda akcja wymaga opłaty w DESO. Nowi użytkownicy zwykle dostają startowe DESO od węzła
  po weryfikacji numeru telefonu.
- **Moderacja:** każdy węzeł decyduje, co pokazuje, za pomocą czarnych i szarych list, ale
  [treść pozostaje w łańcuchu](https://docs.deso.org/deso-blockchain/content-moderation).
- **Społeczności:** dokumentacja nie opisuje prymitywu społeczności ani forum; „społeczność” to feed,
  który kuratoruje aplikacja.
- **Prowadzenie węzła:** walidatorzy potrzebują co najmniej 32 GB RAM i 200 GB dysku, według
  [przewodnika dla walidatorów](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) to społecznościowy blockchain, który płaci autorom i kuratorom w
tokenach, a jego główną aplikacją blogową jest [Steemit](https://steemit.com/). Hive oddzielił się
od Steem w 2020 roku; według [whitepapera Hive](https://hive.io/whitepaper.pdf) fork nastąpił po
tym, jak Steemit Inc. kupił Justin Sun.

- **W łańcuchu:** posty tekstowe, komentarze, głosy i historia ich edycji, porządkowane przez 21
  wybranych świadków (witnesses), którzy co trzy sekundy produkują blok. Obrazy są hostowane poza
  łańcuchem.
- **Spam:** akcje zużywają Resource Credits, które rosną wraz z zastakowanym STEEM. Utworzenie konta
  kosztuje STEEM; Steemit pokrywa ten koszt za użytkowników, którzy zweryfikują adres e-mail i numer
  telefonu.
- **Społeczności:** to
  [niestandardowe operacje interpretowane przez indekser](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  poza konsensusem. Moderatorzy mogą wyciszać posty, co ukrywa je w aplikacjach, ale pozostawia w
  łańcuchu.
- **Nagrody:** nagrody są finansowane z inflacji, a o ich podziale decydują głosy ważone wielkością
  stake'u, więc duzi posiadacze kształtują to, co zdobywa uwagę.

## Porównanie

| Pytanie              | Lens                                                                     | DeSo                                                              | Steem                                                                                   | Bitsocial                                                                                       |
| -------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Łańcuch              | Warstwa 2 Ethereum (validium na ZK Stack)                                | Własna warstwa 1, proof of stake                                  | Własny łańcuch, delegated proof of stake                                                | Brak                                                                                            |
| Treść postów         | JSON poza łańcuchem, zwykle w Grove                                      | Tekst w łańcuchu; multimedia poza nim                             | Tekst w łańcuchu; obrazy poza nim                                                       | Na węźle właściciela społeczności i u peerów, które ją czytają i seedują                        |
| Tożsamość            | Konto będące smart kontraktem; nazwy użytkowników jako NFT               | Para kluczy z profilem w łańcuchu                                 | Nazwane konto w łańcuchu z wielopoziomowymi kluczami                                    | Pary kluczy Ed25519 dla użytkowników i społeczności                                             |
| Społeczności         | Grupy i feedy jako kontrakty z regułami                                  | Brak prymitywu społeczności                                       | Społeczności interpretowane przez indekser poza konsensusem                             | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                                  |
| Ochrona przed spamem | Gaz (często sponsorowany), reguły tokenowe lub płatnicze                 | Opłata za każdą akcję; środki startowe po weryfikacji telefonu    | Resource Credits ze stake'u; płatne zakładanie kont                                     | Wyzwanie danej społeczności przed przyjęciem posta                                              |
| Moderacja            | Administratorzy grup, reguły w łańcuchu, ukrywanie na poziomie API       | Każdy węzeł filtruje to, co pokazuje                              | Wyciszenia w społecznościach, głosy przeciw ważone wielkością stake'u, filtry aplikacji | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują           |
| Utrzymanie           | Operator łańcucha plus Lens API i Grove                                  | Walidatorzy z co najmniej 32 GB RAM                               | Wybrani świadkowie plus węzły API i indeksujące                                         | Węzeł społeczności na sprzęcie konsumenckim plus pomocnicze węzły seedujące                     |
| Główny kompromis     | Programowalne reguły w łańcuchu, ale treść i odczyt zależą od usług Lens | Otwarta pula danych, ale każda akcja kosztuje i zostaje na zawsze | Wbudowane nagrody, ale stake kształtuje widoczność i zarządzanie                        | Bez opłat i stake'u, ale bez globalnej kolejności, a stare treści nie są gwarantowane na zawsze |
