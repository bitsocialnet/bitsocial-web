# Commit current work

Commit current work.

## Instructions

- Always check git diffs before committing. First you check the diffs for all uncommitted changes, so you can figure out what should be the commit title for the diffs.
- If some diffs/uncommitted changes are unrelated to each other, then we need to do multiple commits. Each commit should describe a specific set of diffs. If a set of diffs is completely unrelated to another set of diffs, each set should be committed separately.
- The commit title should be very short and concise, and follow commitizen rules such as: always include the scope, always include the commit type (feat, fix, refactor, chore, docs, perf, etc.).
- **CRITICAL: When displaying the commit title to the user, ALWAYS wrap it in backticks (inline code).** Example: `fix: correct date formatting` — NOT: fix: correct date formatting
- Only include a commit message if the commit title is not enough by itself. If the commit title already conveys enough information about the change, then no commit message is needed. If a commit message is needed, make sure it's very concise with no bullet points and it doesn't repeat any word/information that's already written in the commit title.
- You should only commit work when instructed. Do not keep committing subsquent work unless explicitly told so.
- Never push, just commit (I'll push myself).
