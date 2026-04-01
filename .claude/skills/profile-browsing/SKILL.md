---
name: profile-browsing
description: Profile app performance while browsing, collecting Web Vitals and React rerender data via react-scan. Orchestrates parallel profiler subagents via playwright-cli to capture navigation timing, long tasks, layout shifts, LCP, React commit counts, render bursts, and per-component render data. Use when profiling browsing performance, finding bottlenecks, diagnosing excessive rerenders, or auditing page performance.
---

# Profile Browsing Performance

Two-layer profiling: browser-level symptoms (Web Vitals, long tasks, scroll jank) and React-level diagnosis (commit counts, render bursts, per-component render data from react-scan). Each profiler subagent runs in its own browser session and context window.

## Prerequisites

- Dev server running at `http://bitsocial.localhost:1355` (`yarn start` via Portless)
- `playwright-cli` installed (`npm install -g @playwright/cli@latest`)

**IMPORTANT:** The orchestrator (you) is responsible for ensuring exactly one dev server is running. Profiler subagents must never start a dev server themselves.

### react-scan and element-source (already configured)

The app exposes performance and source-inspection helpers in `about/src/lib/react-scan.ts`. In dev mode it:

- enables `react-scan`
- exposes `window.__getReactScanReport()` for programmatic render data
- exposes `window.__ELEMENT_SOURCE__` for DOM-to-source resolution

The profiler's `addInitScript` sets `window.__PROFILING__ = true` before the app loads, which tells `react-scan` to disable its toolbar and sounds during automated runs.

## Step 0: Ensure the Dev Server Is Running

Before spawning any profiler subagents, verify exactly one dev server is available:

```bash
curl -sf http://bitsocial.localhost:1355 -o /dev/null && echo "OK" || echo "NOT RUNNING"
```

- If `OK`: proceed to Step 1.
- If `NOT RUNNING`: start one instance with `yarn start` in the background, then poll until it responds. Do not start more than one.

## Step 1: Define Route Batches

Split routes into batches of 2 to 4 for parallel profiling.

Default batches for this app:

| Batch | Session  | Routes            | Focus                             |
| ----- | -------- | ----------------- | --------------------------------- |
| 1     | `prof-1` | `/`, `/docs`      | Home page plus docs content       |
| 2     | `prof-2` | `/apps`, `/about` | App directory plus about page     |
| 3     | `prof-3` | `/blog`, `/stats` | Secondary content plus stats page |

Adjust batches to match the routes relevant to the change under investigation.

## Step 2: Spawn Profiler Subagents

Read the profiler subagent definition at `.claude/agents/profiler.md`. Then spawn one `profiler` subagent per batch in parallel using Cursor's current delegation tool.

For each batch, include:

- `agent: "profiler"`
- session name: `prof-N`
- routes to profile
- any non-default app URL or extra profiling constraints

Spawn up to 4 subagents simultaneously. Each one opens its own browser session, navigates routes, scrolls, collects both Web Vitals and `react-scan` data per route, and returns a structured issues list.

Parallel is faster but can skew timing results under heavy machine load. For precise measurements, run the batches sequentially.

## Step 3: Merge Results

Collect structured output from each subagent and merge:

1. Concatenate all `Critical`, `Warning`, `React Rerenders`, `Scroll Jank`, and `Info` items.
2. Combine per-view summary tables into one.
3. Merge `react-scan` component data across routes.
4. Deduplicate shared issues.
5. Sort by severity with `Critical` first.

## Step 4: Final Report

```markdown
## Performance Profile Results

### Critical
- [metric]: [value] at [route] — [what likely needs fixing]

### Warning
- [metric]: [value] at [route] — [what likely needs fixing]

### React Rerenders
- [route]: [N] commits during load, [M] during scroll — [likely cause]
- Render bursts detected at [routes] — suggests cascading state updates
- Top rerendering components (react-scan):
  - [ComponentName]: [total count] renders across [routes], [time]ms total
  - [ComponentName]: [total count] renders across [routes], [time]ms total

### Scroll Jank
- [route]: [N] long tasks during scroll (max [X]ms), [M] React commits — [likely cause]

### Info
- [observations]

### Per-View Summary
| View | Nav (ms) | Long Tasks | CLS | LCP (ms) | Commits | Scroll Commits | Bursts | Top Component |
|------|----------|-----------|-----|-----------|---------|----------------|--------|---------------|
| / | ... | ... | ... | ... | ... | ... | ... | ... |
```

## Interpreting React Metrics

| Signal                                   | Likely cause                                            | Fix direction                               |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| High commits, no long tasks              | Frequent cheap rerenders                                | `React.memo`, stabilize props               |
| High commits + long tasks                | Expensive rerenders                                     | Profile render cost, split components       |
| High scroll commits                      | Scroll or intersection observer work triggering renders | Throttle handlers, memoize heavy list items |
| Render bursts (>5 in 100ms)              | Cascading state updates                                 | Batch updates, remove derived-state effects |
| `react-scan`: component with >30 renders | Missing memoization or unstable references              | Stabilize props and parent renders          |
| `react-scan`: component with >50ms time  | Expensive render function                               | Split component, move work out of render    |

## Element-source Follow-up

When `react-scan` identifies a rerender hotspot but you still need the exact file behind a concrete DOM node, hand off to `$inspect-elements`.

```bash
playwright-cli -s=prof-followup eval "async el => JSON.stringify(await window.__ELEMENT_SOURCE__.resolve(el))" e7
```

Use `source.filePath` as the direct edit target and `stack` to understand which parent components own the node.

## Step 5: Cleanup

After profiling is complete and the report is delivered, verify no orphaned processes were left behind:

```bash
playwright-cli -s=prof-1 close 2>/dev/null
playwright-cli -s=prof-2 close 2>/dev/null
playwright-cli -s=prof-3 close 2>/dev/null
```

If the orchestrator started the dev server in Step 0, stop it now. If it was already running, leave it alone.

## Notes

- Session isolation: each subagent uses a named `playwright-cli` session.
- Per-route collection: data resets on each `goto`, so collect before navigating away.
- Tracing: each subagent produces a `trace.zip` viewable in [Trace Viewer](https://trace.playwright.dev).
- If `__getReactScanReport` returns `null`, the profiler still provides useful commit counts and render bursts.
