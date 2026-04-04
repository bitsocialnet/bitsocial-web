# Fähigkeiten und Werkzeuge

Verwenden Sie dieses Playbook beim Einrichten/Anpassen von Fertigkeiten und externen Werkzeugen.

## Empfohlene Fähigkeiten

### Context7 (Bibliotheksdokumente)

Für aktuelle Dokumente zu Bibliotheken.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Dramatiker-CLI

Verwenden Sie `playwright-cli` für die Browser-Automatisierung (Navigation, Interaktion, Screenshots, Tests, Extraktion).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Skill-Installationsorte:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Best Practices für Vercel React

Für ausführlichere Anleitungen zur React/Next-Leistung.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Finden Sie Fähigkeiten

Entdecken/installieren Sie Fähigkeiten aus dem offenen Ökosystem.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Begründung der MCP-Richtlinie

Vermeiden Sie GitHub-MCP- und Browser-MCP-Server für dieses Projekt, da sie einen erheblichen Tool-Schema-/Kontext-Overhead verursachen.

- GitHub-Vorgänge: Verwenden Sie die `gh`-CLI.
- Browseroperationen: Verwenden Sie `playwright-cli`.
