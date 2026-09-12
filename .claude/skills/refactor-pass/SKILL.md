---
name: refactor-pass
description: Simplify code while preserving behavior when the user requests a refactor or cleanup pass.
---

<!-- Generated from .agents/skills/refactor-pass/SKILL.md; run yarn ai-workflow:sync. -->

# Refactor Pass

Identify the requested scope from the conversation and diff; include relevant staged, unstaged, and untracked work. If no scope is supplied, inspect recent task changes without expanding into unrelated code.

Prefer removing dead code, clarifying control flow, or reusing existing helpers over adding abstractions. Read surrounding source and tests before changing a boundary. Check history when the purpose of a guard, workaround, or optimization is unclear; keep it when its necessity cannot be established.

Preserve observable behavior, error contracts, accessibility, and project architecture. Remove memoization only when its purpose and impact are understood. Preserve workspace boundaries and existing data/state ownership. Keep derived values in render when appropriate; do not impose patterns from a client or a server framework on unrelated workspaces.

Keep the diff focused and avoid new dependencies for routine cleanup. Verify the affected behavior using `docs/agent-playbooks/verification.md`; report what became simpler and any remaining uncertainty.
