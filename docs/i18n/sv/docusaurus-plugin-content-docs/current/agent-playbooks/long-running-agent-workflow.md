# Långvarigt agentarbete

Använd beständigt uppgiftstillstånd när arbetet behöver kunna återupptas eller lämnas över, eller när en enskild körning är så lång att kontextkomprimering kan göra att det återstående arbetet tappas bort. Små uppgifter behöver ingen tavla eller förloppsfil. För delat arbete, håll en koncis `feature-list.json` och `progress.md` i en uppgiftsspecifik `docs/agent-runs/<slug>/`, och använd befintliga mallar där det hjälper.

Registrera det begärda resultatet, aktuell gren/worktree, filägarskap, slutförda ändringar, kontroller med resultat, ägda processer/sessioner och nästa olösta steg. Lagra inte autentiseringsuppgifter eller godtyckliga dumpar av källkod. Markera en funktion som klar först när dess acceptanskriterier har verifierats.

När arbetet återupptas, granska Git-tillståndet, det senaste förloppet och relevant källkod innan du redigerar. Återanvänd kompatibla resurser som du äger; starta en utvecklingsserver bara när nästa kontroll behöver en. Välj kontroller efter påverkan med hjälp av [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), i stället för att upprepa en oförändrad fullständig körning.

Håll relaterat delegerat arbete avgränsat och utan överlapp. En agent äger tunga kontroller och webbläsarsessioner. Uppdatera det beständiga tillståndet när en slutförd del, ett hinder eller en överlämning ändrar vad nästa bidragsgivare behöver veta; logga inte mekaniskt varje kommando.
