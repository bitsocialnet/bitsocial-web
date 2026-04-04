# Flux de lucru al agentului de lungă durată

Folosiți acest manual atunci când o sarcină poate cuprinde mai multe sesiuni, transferuri sau agenți generați.

## Goluri

- Oferiți fiecărei sesiuni proaspete o modalitate rapidă de a recăpăta contextul
- Păstrați munca progresivă, în loc să faceți o schimbare majoră
- Obțineți o linie de bază locală întreruptă înainte de a adăuga mai mult cod
- Lăsați artefacte durabile în care următoarea sesiune poate avea încredere

## Unde să păstrați statul

- Utilizați `docs/agent-runs/<slug>/` atunci când oamenii, roboții de revizuire sau mai multe lanțuri de instrumente au nevoie de aceeași stare de activitate.
- Utilizați un director local de instrumente, cum ar fi `.codex/runs/<slug>/`, numai atunci când starea sarcinii este în mod intenționat locală pentru o stație de lucru sau un lanț de instrumente.
- Nu ascundeți starea partajată cu mai multe sesiuni într-un fișier răzuit privat dacă un alt colaborator sau agent va avea nevoie de el mai târziu.

## Fișiere obligatorii

Creați aceste fișiere la începutul sarcinii de lungă durată:

- `feature-list.json`
- `progress.md`

Utilizați șabloanele din `docs/agent-playbooks/templates/feature-list.template.json` și `docs/agent-playbooks/templates/progress.template.md`.

Preferați JSON pentru lista de caracteristici, astfel încât agenții să poată actualiza un număr mic de câmpuri fără a rescrie întregul document.

## Lista de verificare a începerii sesiunii

1. Rulați `pwd`.
2. Citiți `progress.md`.
3. Citiți `feature-list.json`.
4. Rulați `git log --oneline -20`.
5. Rulați `./scripts/agent-init.sh --smoke`.
6. Alegeți exact un articol cu ​​cea mai mare prioritate, care este în continuare `pending`, `in_progress` sau `blocked`.

Dacă pasul de fum nu reușește, remediați linia de bază întreruptă înainte de a implementa o nouă secțiune de caracteristică.

## Regulile sesiunii

- Lucrați la o singură caracteristică sau secțiune de sarcină la un moment dat.
- Păstrați lista de caracteristici care poate fi citită de mașină și stabilă. Actualizați starea, notele, fișierele și câmpurile de verificare în loc să rescrieți elementele care nu au legătură.
- Marcați un articol verificat numai după rularea comenzii sau a fluxului de utilizator listat în acel articol.
- Utilizați agenți generați pentru secțiunile delimitate, nu pentru proprietatea generală a stării sarcinii.
- Când un agent copil deține un articol, dați-i ID-ul exact al articolului, criteriile de acceptare și fișierele pe care le poate atinge.

## Lista de verificare a sfârșitului sesiunii

1. Adăugați o scurtă intrare de progres la `progress.md`.
2. Actualizați elementul atins în `feature-list.json`.
3. Înregistrați comenzile exacte executate pentru verificare.
4. Capturați blocanți, urmăriri și următorul articol cel mai bun de reluat.

## Forma de intrare recomandată pentru progres

Utilizați o structură scurtă precum:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
