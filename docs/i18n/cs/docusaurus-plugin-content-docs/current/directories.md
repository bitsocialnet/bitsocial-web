---
title: Adresáře
description: Jak aplikace Bitsocial nechávají komunity soupeřit o tematický název, místo aby ho natrvalo držel ten, kdo si ho zabral jako první.
---

# Adresáře

Na Redditu může název jako `r/opensource` patřit jen jedné komunitě a kdo ji ovládá, ten si ho ponechá. Pokud její moderátoři dělají rozhodnutí, která se uživatelům nelíbí, jedinou alternativou je založit `r/opensource2`. Nová komunita začíná s nulou odběratelů, přestože většině lidí, kteří odebírali `r/opensource`, šlo o open source, a ne o tento konkrétní moderátorský tým.

Aplikace Bitsocial tomu předcházejí pomocí **adresářů**. Adresář je tematický název, například `opensource`, o který komunity soupeří. Krátká cesta pro tento název otevře tu komunitu, která je právě na prvním místě, takže lepší komunita může název převzít, aniž by k tomu potřebovala něčí svolení.

## Jak to funguje

1. **Kód adresáře je tematický název.** Seedit používá cesty jako `/s/funny`. 5chan používá cesty typické pro imageboardy, například `/g/`.
2. **Komunity soupeří jako kandidáti.** Každý adresář má seznam kandidátských komunit, každá s vlastní přesnou adresou, například `funny-posting.bso`.
3. **Cestu získá nejvýše hodnocený kandidát.** Po otevření `/s/funny` se zobrazí aktuální vítěz.
4. **Prohra nic nemaže.** Komunita, která nevyhrála, si ponechá svou adresu, příspěvky i odběratele a kdokoli ji může dál otevřít přímo.

## Název slouží jako vstupní dveře, ne jako identita

Kód adresáře je jen cesta k objevování obsahu. Vše trvalé ukazuje na konkrétní komunitu:

- Přihlášení k odběru z `/s/funny` přihlásí k odběru přesné adresy aktuálního vítěze. Samotný kód adresáře se jako odběr nikdy neukládá.
- Odkazy na příspěvky vždy používají přesnou adresu komunity, takže starý odkaz nemůže po změně vítěze začít ukazovat na jinou komunitu.
- Když se vítěz změní, Seedit stávající odběry ponechá beze změny a každého odběratele se zeptá, zda chce přejít k novému vítězi, ponechat si obě komunity, nebo zůstat u stávající. Automatické přepínání je volitelné nastavení pro každý adresář zvlášť a automatické přepnutí zobrazí oznámení s možností vrátit ho zpět.

Konkurenční komunita tedy nikomu nebere odběry. Vyhrává název: noví návštěvníci přicházejí k ní a stávající odběratelé dostanou volbu na jedno kliknutí. Kdo dával přednost staré komunitě, ten si ji ponechá.

## Proč nepřidělovat názvy podle pořadí

- **Žádné zabírání názvů.** Držet dobrý název nestačí. Komunita pro něj musí zůstat nejlepším kandidátem.
- **Názvy nepřiděluje žádný administrátor.** Přidělování administrátorem by znovu vytvořilo ústřední právo veta, které má Bitsocial odstranit.
- **Konkurenti si zachovají cestu k publiku.** Konkurenční komunita míří na stejný název, místo aby začínala znovu pod horším.
- **Klienti se shodnou na vítězi.** Seedit řadí kandidáty deterministicky, takže každý klient, který čte stejný finalizovaný snímek adresáře, zobrazí stejného vítěze. Seedit nedosadí jiného kandidáta jen proto, že je vítěz z připojení jednoho uživatele dočasně nedostupný.

## Jak se dnes vybírají vítězové

Kandidáti se zveřejňují jako soubory JSON v repozitáři [bitsocialnet/lists](https://github.com/bitsocialnet/lists), jeden soubor na adresář, a komunita se k adresáři připojí pull requestem do jeho souboru. Jde o počáteční, přechodný krok. Cílem je, aby pull requesty jako způsob rozhodování o vítězích nahradilo hlasování.

- **Seedit** řadí kandidáty adresáře podle skóre, poté podle času přidání a nakonec podle adresy. Každý soubor adresáře nese číslo revize a každá změna jeho kandidátů nebo vítěze zveřejní novou revizi.
- **5chan** pořádá pro každý adresář jedno hlasování pomocí [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Klienti si vyměňují podepsané hlasovací lístky přes libp2p gossipsub a výsledek si spočítají sami, bez serveru, který by hlasy sčítal. K hlasování je potřeba vlastnit 5chan Pass, nepřenosný token, a každý držitel má jeden hlas. Hlas pro board, který na seznamu ještě není, jej nominuje. Hlasování zatím probíhají na testnetu Base Sepolia, a dokud se z testnetu nepřesunou, výsledky se zobrazují, ale pořadí seznamu nemění.

## Protokol, nebo aplikace?

Adresáře nejsou součástí PKC, peer-to-peer vrstvy, která komunity ukládá a přenáší. Jde o konvenci, kterou klienti uplatňují nad touto vrstvou, vedle výchozích seznamů a vyhledávání; viz [Objevování obsahu](./content-discovery.md). Klient může číst stejné soubory adresářů, zveřejňovat vlastní, nebo adresáře úplně vynechat, a uživatelé mohou kteroukoli komunitu dál otevřít podle její adresy.
