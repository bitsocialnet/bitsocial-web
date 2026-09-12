# Long-running agent work

Use durable task state when work needs resumption or a handoff. Small tasks do not need a board or progress file. For shared work, keep a concise `feature-list.json` and `progress.md` in a task-specific `docs/agent-runs/<slug>/`, using existing templates where helpful.

Record the requested outcome, current branch/worktree, file ownership, completed changes, checks with results, owned processes/sessions, and the next unresolved step. Do not store credentials or arbitrary source dumps. Mark a feature complete only when its acceptance criteria are verified.

On resumption, inspect Git state, the latest progress, and relevant source before editing. Reuse compatible owned resources; start a dev server only when the next check needs one. Select checks by impact using [verification.md](verification.md), rather than repeating an unchanged full pass.

Keep related delegated work scoped and non-overlapping. One agent owns heavy checks and browser sessions. Update durable state when a completed slice, blocker, or handoff changes what the next contributor needs to know; do not mechanically log every command.
