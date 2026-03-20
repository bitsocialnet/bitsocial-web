---
name: release
description: Automate a Bitsocial Web release by analyzing commits, choosing a version bump, updating package.json, verifying the release build, and preparing the tag or push steps. Use when the user says "release", "new version", "cut a release", "prepare release", or provides a version number to ship.
---

# Release

End-to-end release automation for Bitsocial Web.

## Usage

The user provides a version bump (`patch`, `minor`, `major`, or explicit `x.y.z`).
If omitted, ask which bump level they want.

## Workflow

Track progress with this checklist:

```text
Release Progress:
- [ ] Step 1: Analyze commits
- [ ] Step 2: Draft release summary
- [ ] Step 3: Bump version in package.json
- [ ] Step 4: Verify release build
- [ ] Step 5: Commit, tag, push
```

### Step 1: Analyze commits

Find the latest tag:

```bash
git tag --sort=-creatordate | head -1
```

Then list commits since that tag:

```bash
git log --oneline <tag>..HEAD
```

If there are no new commits, stop.

### Step 2: Draft the Release Summary

Write a short one-paragraph release summary from the commits since the last tag.

Rules:

- Lead with the most meaningful user-facing changes
- Group minor fixes instead of listing every commit
- Use plain language
- Do not invent changelog or blotter files that do not exist in this repo

### Step 3: Bump the Version

Read `package.json`, compute the new version from the bump level, and update the `"version"` field.

| Bump | Effect |
|------|--------|
| `patch` | `0.1.0` → `0.1.1` |
| `minor` | `0.1.0` → `0.2.0` |
| `major` | `0.1.0` → `1.0.0` |
| `x.y.z` | Set exactly |

### Step 4: Verify the Release Build

Run:

```bash
yarn build
yarn lint
yarn typecheck
yarn format:check
```

If one of these fails because of a pre-existing baseline issue, call that out explicitly before continuing.

### Step 5: Commit, Tag, Push

When the user wants the actual release actions:

```bash
git add package.json yarn.lock
git commit --no-verify -m "chore(release): v<version>"
git tag v<version>
git push
git push --tags
```

If the user asks for a dry run or preview, stop after Step 4 and return the proposed version plus the release summary.
