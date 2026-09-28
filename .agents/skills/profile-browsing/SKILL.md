---
name: profile-browsing
description: Measure Bitsocial Web loading, navigation, or interaction performance and investigate observed bottlenecks.
---

# Browsing performance

Define the affected route/interaction and the symptom or comparison to establish. Verify routes in the affected workspace and wait for the actual content or control to be ready.

Reuse a compatible server in this worktree. If one is needed, the task owner starts it in an owned terminal, records its process/session, and stops only that server afterward. A profiling child does not manage servers. Other tasks may have valid Vite processes.

Keep one browser active machine-wide through `./scripts/pw-session.sh`. Use the `playwright-cli` skill for session lifecycle and affected-flow coverage. Browser work and other heavy checks remain serialized. Profile a small flow directly; delegate a substantial independent route set to `profiler` only when useful, with a supplied URL, unique session name, criteria, and evidence to return. Wait for its browser cleanup before another browser task starts.

Use `yarn doctor:check` for automatic source diagnostics, `yarn perf:check` for repeatable runtime regression checks, and `yarn perf:record --target <about|chain|docs>` for JSON and native-trace evidence. Read the measurement reference before interpreting committed render counts or timings.

Read [measurement guidance](references/measurement.md) for browser observers, document-versus-hash timing, and this checkout's React evidence. Use the approved collector and runner for affected scenarios. An authorized instrumentation task may extend them; keep ordinary profiling changes scoped to evidence collection.

The about `apps-search` scenario waits for each character to commit to the URL and input before continuing. It is a committed-query render check, not a rapid-typing responsiveness test; investigate fast-input behavior separately.

Compare the same narrow flow before/after with equivalent throttle, viewport, content, and capture settings. Report URLs, methods, observed cost, evidence paths, and unavailable metrics. Separate symptoms from inferred causes; cheap rerenders alone do not justify an optimization. Close the exact session on every exit path and leave preexisting servers/profiles untouched.
