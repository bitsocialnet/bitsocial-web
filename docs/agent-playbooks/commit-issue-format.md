# Commit and Issue Format

Use this when the user requests commit/issue wording or an authorized commit/issue is being created. Do not append suggestions to unrelated answers.

## Commit Suggestion Format

- **Title:** Conventional Commits style, short, wrapped in backticks.
- Use `perf` (not `fix`) for performance optimizations.
- **Description:** Optional 2-3 informal sentences describing the solution. Concise, technical, no bullet points.

Example:

> **Commit title:** `fix: correct date formatting in timezone conversion`
>
> Updated `formatDate()` in `date-utils.ts` to properly handle timezone offsets.

## GitHub Issue Suggestion Format

- **Title:** As short as possible, wrapped in backticks.
- **Description:** 2-3 informal sentences describing the problem (not the solution), as if still unresolved.

Example:

> **GitHub issue:**
>
> - **Title:** `Date formatting displays incorrect timezone`
> - **Description:** Comment timestamps show incorrect timezones when users view posts from different regions. The `formatDate()` function doesn't account for user's local timezone settings.
