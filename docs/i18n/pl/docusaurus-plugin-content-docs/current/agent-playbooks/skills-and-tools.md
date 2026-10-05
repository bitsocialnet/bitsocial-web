# Umiejętności i narzędzia

Wspólne umiejętności znajdują się w `.agents/skills/`. Edytuj te źródła, a następnie uruchom `yarn ai-workflow:sync`, aby wygenerować `.claude/skills/` dla Claude Code. Codex i Cursor wykrywają `.agents/skills/` bezpośrednio; nie przywracaj zduplikowanych katalogów głównych `.codex/skills/` ani `.cursor/skills/`.

Wspólne prompty ról znajdują się w `.agents/roles/*.md`. To format źródłowy specyficzny dla tego repozytorium, a nie natywna ścieżka wykrywania agentów. `scripts/ai-workflow-files.mjs` przekształca te źródła w wymienione niżej pliki specyficzne dla aplikacji; `yarn ai-workflow:sync` je zapisuje. Zatwierdzaj wygenerowane pliki razem z ich źródłami, aby świeży checkout miał natywną konfigurację bez wcześniejszego uruchamiania generatora. Po usunięciu źródła jawnie usuń jego nieaktualne wygenerowane pliki; walidator je zgłasza, zamiast po cichu usuwać pliki.

## Natywne ścieżki wykrywania

Zweryfikowano z oficjalną dokumentacją 2026-09-12:

| Aplikacja   | Instrukcje projektu                                                                                   | Umiejętności używane w tym repozytorium       | Własne agenty używane w tym repozytorium |
| ----------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| Codex       | `AGENTS.md`                                                                                           | `.agents/skills/<name>/SKILL.md`              | Wygenerowany `.codex/agents/<name>.toml` |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` pozostaje dostępny dla warunkowych reguł specyficznych dla Cursora | `.agents/skills/<name>/SKILL.md`              | Wygenerowany `.cursor/agents/<name>.md`  |
| Claude Code | `CLAUDE.md` importuje `@AGENTS.md`                                                                    | Wygenerowany `.claude/skills/<name>/SKILL.md` | Wygenerowany `.claude/agents/<name>.md`  |

Źródła: [umiejętności Codex](https://learn.chatgpt.com/docs/build-skills), [subagenty Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [reguły Cursor](https://cursor.com/docs/rules), [umiejętności Cursor](https://cursor.com/docs/skills), [subagenty Cursor](https://cursor.com/docs/subagents), [pamięć Claude](https://code.claude.com/docs/en/memory), [umiejętności Claude](https://code.claude.com/docs/en/skills), [subagenty Claude](https://code.claude.com/docs/en/sub-agents).

Nie zastępuj natywnych katalogów agentów katalogiem `.agents/roles` i nie zakładaj, że Claude wykrywa `.agents/skills`. Claude nadal może odczytać plik, do którego się tam odwołano, jako zwykły kontekst projektu. Cursor dla zgodności wykrywa także `.claude/skills`; kopie pozostają zsynchronizowane, ale opublikowany przewodnik Cursora po umiejętnościach nie określa deduplikacji między tymi katalogami głównymi. Sprawdzaj katalog umiejętności w zainstalowanej aplikacji, zamiast obiecywać, że zduplikowane wpisy nie mogą się pojawić.

Katalogi AI używają końców linii LF dzięki `.gitattributes`, więc wygenerowany tekst pozostaje identyczny na wszystkich platformach. Pomocnicze zasoby umiejętności są kopiowane bajt w bajt.

## Umiejętności

| Umiejętność                          | Przeznaczenie                                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `commit`                             | Tworzenie autoryzowanych lokalnych commitów o ograniczonym zakresie                                        |
| `commit-format`, `issue-format`      | Formatowanie propozycji na żądanie                                                                         |
| `make-closed-issue`                  | Tworzenie autoryzowanego zgłoszenia, commita o ograniczonym zakresie i PR                                  |
| `review-and-merge-pr`                | Segregowanie uwag do PR; poprawianie/publikowanie/scalanie tylko w żądanym zakresie                        |
| `fix-merge-conflicts`                | Rozwiązywanie konfliktów i weryfikacja scalonego wyniku                                                    |
| `release`                            | Przygotowanie treści wydania i wykonanie autoryzowanych kroków wydania                                     |
| `code-quality-review`                | Przegląd nietrywialnych diffów lub jawnie zgłoszonego problemu z jakością                                  |
| `retro`                              | Przekształcanie wykazanych błędów w ukierunkowane kontrole lub wytyczne, które zapobiegają ich powtórzeniu |
| `refactor-pass`, `deslop`            | Zlecone porządkowanie istniejących zmian                                                                   |
| `debug-agent`                        | Debugowanie oparte na dowodach, w razie potrzeby z instrumentacją                                          |
| `you-might-not-need-an-effect`       | Ukierunkowany przegląd efektów/memo                                                                        |
| `vercel-react-best-practices`        | Odpowiednie wytyczne wydajności React; w tym kliencie Vite pomiń reguły dla Next.js i wyłącznie serwerowe  |
| `translate`                          | Generowanie tłumaczeń, a następnie stosowanie map przez jeden proces zapisujący                            |
| `playwright-cli`, `inspect-elements` | Weryfikacja w przeglądarce i mapowanie DOM na kod źródłowy                                                 |
| `profile-browsing`                   | Profilowanie przeglądarki i React w ograniczonym zakresie                                                  |
| `test-apk`                           | Weryfikacja dostarczonego wrappera Android aplikacji towarzyszącej                                         |
| `impeccable`, `improve-threejs`      | Projektowanie interfejsu w ograniczonym zakresie i przegląd renderowania Three.js                          |
| `implement-plan`                     | Realizacja planu z opcjonalną, ograniczoną delegacją                                                       |
| `readme`                             | Utrzymywanie zweryfikowanej dokumentacji projektu                                                          |
| `context7`                           | Pobieranie dokumentacji bibliotek odpowiedniej dla wersji                                                  |
| `find-skills`                        | Wyszukiwanie dodatkowych umiejętności na wyraźne żądanie                                                   |

## Role i modele

Zachowaj własne role dla `browser-check`, `profiler`, `test-apk`, `translator` i `reviewer`. Do zwykłej implementacji i przeszukiwania kodu używaj wbudowanej roli worker/general-purpose lub explorer w harnessie. Agent nadrzędny przydziela kryteria akceptacji i własność; jeden właściciel uruchamia ciężkie kontrole.

Pliki agentów Codex zawierają `name`, `description` i `developer_instructions`. `.codex/config.toml` ogranicza liczbę równoległych agentów potomnych do czterech za pomocą `max_concurrent_threads_per_session`. Wspólne metadane ról zawierają nazwę, opis i opcjonalny tryb piaskownicy; celowo nie mają pól modelu.

Pomijaj pola modelu i rozumowania w zatwierdzonych umiejętnościach i własnych agentach we wszystkich trzech aplikacjach. Pozwala to na wybory przy wywołaniu w czasie działania, ustawienia domyślne użytkownika i dziedziczenie po agencie nadrzędnym zgodnie z udokumentowaną kolejnością pierwszeństwa w każdej aplikacji. Aliasy rodzin modeli Claude ograniczają utrzymywanie wersji, ale nadal wybierają rodzinę; wersjonowany model Cursora wymaga przyszłych aktualizacji. W razie potrzeby trzymaj takie wybory w ustawieniach użytkownika/sesji. Dziedziczenie nie gwarantuje automatycznego wyboru najlepszego aktualnego modelu. Nie wymyślaj aliasu `latest` i nie dodawaj badania katalogu modeli do rutynowych zadań. Zobacz [wybór modelu w Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [wybór modelu w Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) i [wybór modelu w Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` odpowiada piaskownicy Codex i trybowi `readonly` w Cursorze; w Claude przepływ pracy przeglądu ograniczają lista narzędzi i instrukcje roli, ale dostęp do Bash nie jest piaskownicą na poziomie systemu operacyjnego.

Frontmatter wspólnych umiejętności używa `disable-model-invocation: true` dla przepływów pracy wywoływanych przez użytkownika, tam gdzie ma to zastosowanie. Odpowiednie ustawienie Codex znajduje się w `agents/openai.yaml` jako `policy.allow_implicit_invocation: false`; walidator wymaga obu. Metadane wywołania uzupełniają jawne reguły autoryzacji; prośba o przegląd nigdy nie upoważnia do publikacji tylko dlatego, że umiejętność zawiera kroki publikacji.

## Kontrole i wykrywanie

- `yarn ai-workflow:sync` ponownie generuje pliki zgodności przy użyciu zainstalowanych `js-yaml` i `smol-toml`.
- `yarn ai-workflow:check` parsuje źródła/frontmatter/konfiguracje, sprawdza wygenerowane pliki, metadane wywołania, umiejscowienie pól modelu i podpięcie haka, który tylko formatuje. Nie weryfikuje identyfikatorów modeli względem katalogu dostawcy.
- `yarn ai-workflow:test` uruchamia odizolowane fixtures Node dla ładunków haków oraz generowania/walidacji przepływu pracy.
- Po aktualizacji aplikacji agenta sprawdź w niej wykrywanie umiejętności/ról. Kontrole składni/zgodności nie zastępują kontroli wczytywania. Przeładuj aplikację, jeśli istniejąca sesja zachowuje stary katalog.
- Haki wymagają zaufania do projektu i przeglądu haków w harnessie; nie obchodź mechanizmu zaufania, aby kontrola przeszła. Zobacz [hooks-setup.md](hooks-setup.md).

## Utrzymywanie użytecznych instrukcji

Stosuj się do [wytycznych OpenAI dotyczących umiejętności i promptów](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (przejrzane 2026-09-12): utrzymuj precyzyjne opisy, wczytuj szczegóły tylko wtedy, gdy są istotne, i zachowuj zakres żądany przez użytkownika. Wspólne umiejętności obsługują różne modele; zachowuj niezmienniki specyficzne dla projektu, pozostawiając swobodę rutynowych wyborów implementacyjnych.

Cel umiejętności, granice decyzji i kluczowe ograniczenia trzymaj w `SKILL.md`. Obszerne polecenia lub przykłady dla konkretnych trybów linkuj jako opcjonalne odniesienia. Warunki wyzwalające umieszczaj na początku krótkich opisów; samo pasujące słowo kluczowe nie powinno rozszerzać zadania. Zachowuj istniejące metadane wywołania, chyba że celowo zmieniasz ich działanie.

Po istotnej zmianie instrukcji przetestuj kilka reprezentatywnych małych i dużych zleceń. Sprawdź, które umiejętności/odniesienia zostały wybrane, czy działania pozostały w zakresie, czy weryfikacja pasowała do zmiany i czy autoryzowana praca została ukończona. Testy schematów i fixtures potwierdzają poprawność narzędzi, a nie jakość decyzji agenta.

## Narzędzia i własność przeglądarki

Preferuj istniejący katalog umiejętności/narzędzi i zainstalowane CLI projektu. Używaj `gh` do GitHub, `playwright-cli` do weryfikacji w przeglądarce oraz oficjalnej, właściwej dla wersji dokumentacji, gdy liczy się zachowanie biblioteki. Unikaj instalowania zduplikowanych umiejętności lub pobierania nieprzypiętego pakietu tylko po to, by uruchomić istniejący formatter.

Narzut MCP zależy od harnessu: odroczone wczytywanie narzędzi pozwala uniknąć wczytywania każdego schematu z góry. Utrzymuj integracje istotne dla pracy, zamiast traktować samo MCP jako przestarzałe. Istniejące wybory CLI nadal są przydatne dla odtwarzalności i kontroli zasobów.

Wszystkie sesje przeglądarki używają `./scripts/pw-session.sh`, który wymusza jedną aktywną przeglądarkę w całej maszynie. Domyślnie zaczynaj od świeżej, odizolowanej sesji. Dostęp do bieżącej osobistej przeglądarki wymaga jawnej autoryzacji; wykorzystuj tę autoryzację w kolejnych krokach. Dobieraj przeglądarki/viewporty do dotkniętego zachowania, uruchamiaj wybrane silniki po kolei, przy sprzątaniu zamykaj dokładnie tę nazwaną sesję i nigdy nie używaj `close-all`/`kill-all`. Zobacz umiejętność `playwright-cli` i [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
