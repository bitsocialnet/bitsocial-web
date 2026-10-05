# Feina d'agents de llarga durada

Feu servir un estat de tasca persistent quan la feina s'hagi de reprendre o traspassar, o quan una sola execució duri prou perquè la compactació del context pugui perdre el fil de la feina pendent. Les tasques petites no necessiten cap tauler ni cap fitxer de progrés. Per a la feina compartida, mantingueu un `feature-list.json` i un `progress.md` concisos en un `docs/agent-runs/<slug>/` específic de la tasca, fent servir les plantilles existents quan siguin útils.

Registreu el resultat sol·licitat, la branca/worktree actual, la propietat dels fitxers, els canvis completats, les comprovacions amb els seus resultats, els processos/sessions propis i el següent pas pendent. No deseu credencials ni bolcats arbitraris de codi font. Marqueu una funcionalitat com a completada només quan se n'hagin verificat els criteris d'acceptació.

En reprendre la feina, reviseu l'estat de Git, el progrés més recent i el codi font rellevant abans d'editar. Reutilitzeu els recursos propis compatibles; inicieu un servidor de desenvolupament només quan la comprovació següent el necessiti. Trieu les comprovacions segons el seu impacte fent servir [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), en lloc de repetir una passada completa sense canvis.

Mantingueu la feina delegada relacionada acotada i sense solapaments. Un sol agent s'encarrega de les comprovacions pesades i de les sessions del navegador. Actualitzeu l'estat persistent quan una part completada, un bloqueig o un traspàs canviï el que ha de saber la següent persona que hi contribueixi; no registreu mecànicament cada ordre.
