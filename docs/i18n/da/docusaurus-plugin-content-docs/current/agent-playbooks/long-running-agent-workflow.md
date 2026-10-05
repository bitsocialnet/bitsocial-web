# Langvarigt agentarbejde

Brug holdbar opgavetilstand, når arbejdet skal kunne genoptages eller overdrages, eller når en enkelt kørsel er så lang, at kontekstkomprimering kan miste overblikket over det resterende arbejde. Små opgaver behøver hverken en tavle eller en fremdriftsfil. Ved delt arbejde holdes en kortfattet `feature-list.json` og `progress.md` i en opgavespecifik `docs/agent-runs/<slug>/`, gerne med de eksisterende skabeloner, hvor de hjælper.

Registrér det ønskede resultat, den aktuelle gren/worktree, filejerskab, gennemførte ændringer, kontroller med deres resultater, ejede processer/sessioner og det næste uafklarede trin. Gem ikke legitimationsoplysninger eller vilkårlige dumps af kildekode. Markér kun en funktion som færdig, når dens acceptkriterier er verificeret.

Ved genoptagelse skal du undersøge Git-tilstanden, den seneste fremdrift og den relevante kildekode, før du redigerer. Genbrug kompatible ressourcer, du ejer; start kun en dev-server, når den næste kontrol kræver en. Vælg kontroller efter påvirkning ved hjælp af [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) i stedet for at gentage et uændret fuldt gennemløb.

Hold relateret uddelegeret arbejde afgrænset og uden overlap. Én agent ejer tunge kontroller og browsersessioner. Opdatér den holdbare tilstand, når en færdig del, en blokering eller en overdragelse ændrer, hvad den næste bidragyder har brug for at vide; log ikke mekanisk hver eneste kommando.
