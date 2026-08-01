# Skills and Tools

Use this playbook when setting up/adjusting skills and external tooling.

## Recommended Skills

### Context7 (library docs)

For up-to-date docs on libraries.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Playwright CLI

Use `playwright-cli` for browser automation (navigation, interaction, screenshots, tests, extraction).

When using `playwright-cli` for repo UI verification, do not stop after one engine. Run the relevant flow in all three main browser engines:

- `chrome` for Blink
- `firefox` for Gecko
- `webkit` for Safari/WebKit coverage

Use separate named sessions per engine so evidence stays isolated, but run those sessions sequentially. Only one Playwright browser session may be active at a time, machine-wide, because the contended resource is machine RAM and CPU rather than the repository. Open and close sessions through `./scripts/pw-session.sh`; it holds that shared lock so concurrent agents defer and retry browser work instead of saturating the machine. If an engine is intentionally skipped, record why.

During iteration, use Chrome/Blink only. Run the full Chrome, Firefox, and WebKit sequence once the change is ready for final verification. Reuse each engine session for desktop and mobile by resizing it, close it in a finally-style cleanup, and only then open the next engine.

```bash
./scripts/pw-session.sh open verify-chrome https://bitsocial.localhost --browser=chrome
playwright-cli -s=verify-chrome snapshot
./scripts/pw-session.sh close verify-chrome
```

When the slot is busy, `open` exits 75; block on `./scripts/pw-session.sh open --wait[=SECONDS] ...` (default 300s) instead of retrying by hand. A lock left behind by an interrupted workflow is reclaimed automatically, because `open` drops any slot whose recorded browser is no longer running. Inspect the holder with `./scripts/pw-session.sh status`; `release <session>` is a last resort for the rare case where `status` cannot verify the browser state.

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Skill install locations:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React Best Practices

For deeper React/Next performance guidance.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Find Skills

Discover/install skills from the open ecosystem.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP Policy Rationale

Avoid GitHub MCP and browser MCP servers for this project because they add significant tool-schema/context overhead.

- GitHub operations: use `gh` CLI.
- Browser operations: use `playwright-cli`.

## Model Availability

- `composer-2` is available only in Cursor. Do not configure it under `.claude/` or `.codex/`.
- Codex does not document a `latest` model alias. Committed custom-agent TOMLs under `.codex/**/agents/*.toml` omit both `model` and `model_reasoning_effort` so they inherit the current parent session settings.
