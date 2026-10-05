# Haki agentów

Zatwierdzone w repozytorium haki cyklu życia formatują wyłącznie pomyślnie edytowane pliki JavaScript/TypeScript za pomocą zainstalowanego oxfmt. Wspólna logika znajduje się w `scripts/agent-hooks/format.mjs`; każdy natywny wrapper deleguje do niej.

| Aplikacja | Natywna konfiguracja | Zdarzenie |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude nie odczytuje samodzielnego pliku `.claude/hooks.json`. Każda aplikacja nadal sama kontroluje zaufanie do projektu i to, czy haki są włączone; sprawdź jej bieżące ustawienia, zamiast obchodzić mechanizm zaufania. `.codex/config.toml` to konfiguracja repozytorium, a nie rejestr poleceń haków.

Formatter weryfikuje zdarzenie i ładunek, powodzenie edycji, rozszerzenie pliku oraz to, czy plik znajduje się w repozytorium, z uwzględnieniem dowiązań symbolicznych. Brakujące zależności lub nieistotne dane wejściowe nie powodują żadnej pracy. Polecenia używają tablicy argumentów z wyłączonym dostępem Corepack do sieci; haki nie instalują zależności, nie uruchamiają budowania ani przeglądów i nie modyfikują Gita.

Uruchamiaj kontrole jawnie zgodnie z [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Po zmianie przepływu pracy uruchom `yarn ai-workflow:sync`, `yarn ai-workflow:check` i `yarn ai-workflow:test`. Fixtures używają plików jednorazowych i pozorowanych wywołań formattera; nie dowodzą, że każda aplikacja wczytała swoją konfigurację. Po aktualizacjach przeładuj aplikację i sprawdź jej katalog.

Umiejętność projektowa Impeccable i jej wykonywalne helpery pozostają dostępne na żądanie w `.agents/skills/impeccable`. Jej dawny hak dla Codex wskazywał na nieistniejący katalog; przepływ pracy projektowej uruchamia się teraz, gdy zostanie wybrana ta umiejętność, bez stale aktywnego haka projektowego. Umiejętność nie może przekonfigurowywać haków projektu jako ubocznego kroku projektowego.
