# Langlopend agentwerk

Gebruik duurzame taakstatus wanneer werk hervat of overgedragen moet worden, of wanneer één run zo lang duurt dat contextcompactie het overzicht over het resterende werk kan kwijtraken. Kleine taken hebben geen bord of voortgangsbestand nodig. Houd voor gedeeld werk een beknopte `feature-list.json` en `progress.md` bij in een taakspecifieke `docs/agent-runs/<slug>/`, en gebruik waar nuttig bestaande sjablonen.

Leg de gevraagde uitkomst vast, de huidige branch/worktree, het eigenaarschap van bestanden, afgeronde wijzigingen, checks met hun resultaten, processen en sessies die je bezit, en de volgende onopgeloste stap. Sla geen inloggegevens of willekeurige dumps van broncode op. Markeer een feature pas als voltooid wanneer de acceptatiecriteria ervan zijn geverifieerd.

Bekijk bij het hervatten de Git-status, de laatste voortgang en de relevante broncode voordat je iets bewerkt. Hergebruik compatibele resources die je bezit; start alleen een dev-server wanneer de volgende check er een nodig heeft. Kies checks op basis van impact met [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), in plaats van een ongewijzigde volledige run te herhalen.

Houd gerelateerd gedelegeerd werk afgebakend en zonder overlap. Eén agent is eigenaar van zware checks en browsersessies. Werk de duurzame status bij wanneer een afgerond onderdeel, een blokkade of een overdracht verandert wat de volgende bijdrager moet weten; log niet mechanisch elk commando.
