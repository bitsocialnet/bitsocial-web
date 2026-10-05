# Lavoro degli agenti di lunga durata

Usa uno stato dell'attività durevole quando il lavoro deve poter essere ripreso o passato di mano, oppure quando una singola esecuzione dura abbastanza perché la compattazione del contesto possa far perdere traccia del lavoro rimanente. Le attività piccole non hanno bisogno di una board né di un file di avanzamento. Per il lavoro condiviso, mantieni un `feature-list.json` e un `progress.md` concisi in una directory `docs/agent-runs/<slug>/` dedicata all'attività, usando i modelli esistenti quando sono utili.

Registra il risultato richiesto, il branch/worktree corrente, la responsabilità sui file, le modifiche completate, i controlli con i relativi esiti, i processi/le sessioni di cui sei responsabile e il prossimo passo ancora aperto. Non salvare credenziali né dump arbitrari del sorgente. Contrassegna una funzionalità come completata solo quando i suoi criteri di accettazione sono stati verificati.

Alla ripresa, prima di modificare qualcosa ispeziona lo stato di Git, l'avanzamento più recente e il sorgente pertinente. Riusa le risorse compatibili di cui sei responsabile; avvia un dev server solo quando il controllo successivo ne ha bisogno. Scegli i controlli in base all'impatto usando [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), invece di ripetere un passaggio completo quando nulla è cambiato.

Mantieni il lavoro delegato correlato circoscritto e senza sovrapposizioni. Un solo agente è responsabile dei controlli pesanti e delle sessioni del browser. Aggiorna lo stato durevole quando una parte completata, un impedimento o un passaggio di consegne cambia ciò che il prossimo collaboratore deve sapere; non registrare meccanicamente ogni comando.
