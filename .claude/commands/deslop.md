# Remove AI code slop

Check the diff against main, and remove all AI generated slop introduced in this branch.

This includes:

- Extra comments that a human wouldn't add or is inconsistent with the rest of the file
- Extra defensive checks or try/catch blocks that are abnormal for that area of the codebase (especially if called by trusted / validated codepaths)
- Casts to any to get around type issues
- Any other style that is inconsistent with the file

Keep in mind that comments are necessary when code expresses non-obvious intent, domain-specific reasoning, constraints, or trade-offs that cannot be reliably inferred from the implementation itself (for example, why something is done, not what it does).

Report at the end with only a 1-3 sentence summary of what you changed
