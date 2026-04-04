# Długotrwały przepływ pracy agenta

Skorzystaj z tego podręcznika, jeśli zadanie może obejmować wiele sesji, przekazania lub uruchomienia agentów.

## Cele

- Daj każdej nowej sesji szybki sposób na odzyskanie kontekstu
- Pracuj stopniowo, zamiast wprowadzać duże zmiany za jednym razem
- Zanim dodasz więcej kodu, złap zepsutą lokalną linię bazową
- Zostaw trwałe artefakty, którym można zaufać podczas następnej sesji

## Gdzie przechowywać stan

- Użyj `docs/agent-runs/<slug>/`, gdy ludzie, boty przeglądające lub wiele łańcuchów narzędzi potrzebują tego samego stanu zadania.
- Katalogu lokalnego narzędzia, takiego jak `.codex/runs/<slug>/`, należy używać tylko wtedy, gdy stan zadania jest celowo lokalny dla jednej stacji roboczej lub jednego łańcucha narzędzi.
- Nie ukrywaj udostępnionego stanu wielu sesji w prywatnym pliku tymczasowym, jeśli inny współpracownik lub agent będzie go później potrzebował.

## Wymagane pliki

Utwórz te pliki na początku długotrwałego zadania:

- `feature-list.json`
- `progress.md`

Użyj szablonów w `docs/agent-playbooks/templates/feature-list.template.json` i `docs/agent-playbooks/templates/progress.template.md`.

Preferuj JSON dla listy funkcji, aby agenci mogli aktualizować niewielką liczbę pól bez przepisywania całego dokumentu.

## Lista kontrolna rozpoczęcia sesji

1. Uruchom `pwd`.
2. Przeczytaj `progress.md`.
3. Przeczytaj `feature-list.json`.
4. Uruchom `git log --oneline -20`.
5. Uruchom `./scripts/agent-init.sh --smoke`.
6. Wybierz dokładnie jeden element o najwyższym priorytecie, którym nadal jest `pending`, `in_progress` lub `blocked`.

Jeśli krok dymu nie powiedzie się, napraw uszkodzoną linię bazową przed wdrożeniem nowego wycinka funkcji.

## Regulamin sesji

- Pracuj nad jedną funkcją lub fragmentem zadania na raz.
- Zadbaj o to, aby lista funkcji była czytelna maszynowo i stabilna. Aktualizuj status, notatki, pliki i pola weryfikacyjne zamiast przepisywać niepowiązane elementy.
- Oznacz element jako zweryfikowany dopiero po uruchomieniu polecenia lub przepływu użytkownika wymienionego w tym elemencie.
- Używaj agentów spawnowanych dla ograniczonych wycinków, a nie dla ogólnej własności stanu zadania.
- Jeśli agent podrzędny jest właścicielem jednego przedmiotu, podaj mu dokładny identyfikator przedmiotu, kryteria akceptacji i pliki, których może dotykać.

## Lista kontrolna zakończenia sesji

1. Dołącz krótki wpis postępu do `progress.md`.
2. Zaktualizuj dotknięty element w `feature-list.json`.
3. Zapisz dokładnie wykonane polecenia w celu weryfikacji.
4. Przechwytuj blokady, działania następcze i kolejny najlepszy element do wznowienia.

## Zalecany kształt wpisu postępu

Użyj krótkiej struktury, takiej jak:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
