# Langvarig agentarbeid

Bruk varig oppgavetilstand når arbeidet må kunne gjenopptas eller overleveres, eller når én enkelt kjøring er så lang at kontekstkomprimering kan miste oversikten over gjenstående arbeid. Små oppgaver trenger ikke en tavle eller fremdriftsfil. For delt arbeid, hold en kortfattet `feature-list.json` og `progress.md` i en oppgavespesifikk `docs/agent-runs/<slug>/`, og bruk eksisterende maler der det hjelper.

Registrer det ønskede resultatet, gjeldende gren/worktree, fileierskap, fullførte endringer, sjekker med resultater, prosesser/økter du eier, og neste uløste steg. Ikke lagre legitimasjon eller vilkårlige dumper av kildekode. Merk en funksjon som fullført bare når akseptansekriteriene for den er verifisert.

Når du gjenopptar, undersøk Git-tilstanden, siste fremdrift og relevant kildekode før du redigerer. Gjenbruk kompatible ressurser du eier; start en utviklingsserver bare når neste sjekk trenger det. Velg sjekker etter påvirkning ved hjelp av [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), i stedet for å gjenta en uendret full kjøring.

Hold relatert delegert arbeid avgrenset og uten overlapp. Én agent eier tunge sjekker og nettleserøkter. Oppdater den varige tilstanden når en fullført del, en blokkering eller en overlevering endrer hva neste bidragsyter trenger å vite; ikke logg hver kommando mekanisk.
