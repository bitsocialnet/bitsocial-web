# Measure the affected flow

Use the task's URL, selected browser, real routes/content, and owned session. When throttling is relevant, use supported Chromium tooling and record its actual settings. Record viewport, browser, throttle, cache state, dev/production build, and capture overhead so before/after samples are comparable.

## Browser evidence

Use existing evidence first. When timings alone cannot identify the affected phase, this small observer can be loaded before the app. Open `about:blank` with the wrapper, then run the function below through `playwright-cli -s=<session> run-code --filename=<task-owned-file>`. It needs a new document load to take effect; a same-document transition does not run init scripts again.

```javascript
async page => {
  await page.addInitScript(() => {
    window.__PROFILING__ = true;
    window.__PROFILE__ = { longTasks: [], shifts: [], lcp: null, supported: [] };
    const observe = (type, collect) => {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) return;
      window.__PROFILE__.supported.push(type);
      new PerformanceObserver(list => list.getEntries().forEach(collect)).observe({ type, buffered: true });
    };
    observe("longtask", e => window.__PROFILE__.longTasks.push({ start: e.startTime, duration: e.duration }));
    observe("layout-shift", e => {
      if (!e.hadRecentInput) window.__PROFILE__.shifts.push({ start: e.startTime, value: e.value });
    });
    observe("largest-contentful-paint", e => { window.__PROFILE__.lcp = e.startTime; });
  });
}
```

`__PROFILING__` suppresses the app's Agentation toolbar. Preserve the installed React DevTools hook; do not replace or wrap it merely to count commits. Unsupported observer types are unavailable measurements, not zero values.

- **Document load:** navigate to the full route URL, explicitly reloading if the preceding navigation changed only the hash. Read `performance.getEntriesByType("navigation")` and measure when the actual content/control becomes ready. The document load event can finish before the requested content is ready; a reload is not automatically a cold-cache test.
- **SPA transition or interaction:** mark phase start, perform the action, wait for its observable completion, then mark phase end in the same document. Put those operations in one `run-code` invocation to avoid including idle time between CLI calls. Do not compare marks across reloads.
- **Scroll or repeated interaction:** capture phase start/end timestamps and filter long tasks/shifts to that interval. Same-document navigation retains counters; do not sum cumulative data again for each route. Collect results before a document reload discards them.

```bash
playwright-cli -s=profile-task eval '() => performance.getEntriesByType("navigation").map(n => ({ loadMs: n.loadEventEnd, domMs: n.domContentLoadedEventEnd }))'
playwright-cli -s=profile-task eval '() => window.__PROFILE__'
playwright-cli -s=profile-task console error
```

Raw layout-shift events, even with recent-input events excluded, are not the complete CLS session-window calculation. LCP describes a document load, not each hash navigation. Long tasks show main-thread stalls without identifying their cause. Treat all counts and thresholds as triage evidence; establish measured cost before recommending memoization or refactoring.

Use a [Playwright trace](../../playwright-cli/references/tracing.md) to correlate actions with requests/DOM state when useful; it is not a CPU sampling profile. Record missing content, dynamic tooling readiness, background activity, and instrumentation overhead as limitations.

## React evidence

The pinned Bippy collector starts before React DOM in development and explicit profiling builds. `window.__REACT_PERF__.reset()` starts a measurement window; `snapshot()` returns committed mount/update/unmount events, component-instance IDs, commit IDs, dropped-event counters, and official React Profiler timing callbacks. Counts exclude StrictMode function replays and abandoned renders. Check collector readiness and dropped events; missing instrumentation must fail, never be interpreted as zero work. Profiler durations are inclusive subtree costs: never add parent and child durations as total CPU time.

Use the repeatable commands first:

```bash
yarn doctor:check
yarn perf:check
yarn perf:record --target about --scenario apps-search
yarn perf:record --target chain --scenario newsletter-input
yarn perf:record --target docs --scenario language-search
```

`doctor:check` runs pinned source diagnostics on the affected projects. These are static findings, not runtime counts. `perf:check` first runs collector compatibility and deliberate-regression selftests, then drives the real app scenarios in `scripts/react-perf/config.mjs` with three samples and 4× CPU throttling, enforcing per-phase component-update, commit, render-duration, and action-latency limits. `perf:record` defaults to one unthrottled sample and writes JSON plus a Chrome trace under `.react-perf/`. Use `--url <explicit-local-url>` to reuse a compatible server; otherwise the runner owns an isolated server on an available port. Its machine-wide browser lock must remain serialized with Playwright, Doctor scan, and other browser work. Report target/scenario, build mode, CPU/sample settings, per-instance counts, timing method, limits, dropped events, and evidence paths. Do not edit baselines simply to make a regression pass.

The initial scenarios cover controlled app search, newsletter typing without submission, and docs language filtering. They do not claim to cover feed, peer, animation, or network performance. Before broadening budgets or relying on a React/Bippy upgrade, run `yarn perf:check` for compatibility, deliberate-regression detection and affected real scenarios. `yarn perf:test` is available for a standalone compatibility-only investigation. Use source and traces to explain avoidable work before changing memoization or effects.

The about `apps-search` scenario exercises `/projects` as five committed query changes. It waits for both the URL and controlled input to reflect each character before sending the next one. This verifies committed-render budgets, not rapid-typing responsiveness: passing it does not establish that the input retains characters when keystrokes arrive before router navigation commits. Test rapid typing separately at the relevant CPU settings and preserve its evidence independently.

Normal production output excludes the collector. For production React component timings, use a separate `build:profile:about`, `build:profile:chain`, or `build:profile:docs` build with the official `react-dom/profiling` renderer; outputs live in `dist-profile/` and preserve normal deployment artifacts. Serve the matching output and pass its URL to `perf:record`. A regular production preview can measure page timing but lacks this component instrumentation. Development and profiling-build baselines are distinct; never compare them as equivalent.

Doctor's optional `doctor:scan <url>` can still record native Chrome traces. Its injected transient `__REACT_DOCTOR_RUNTIME_SCAN__` probe is not the repository collector and its JSON component summary is not a complete committed-render counter. Keep its browser isolated and preserve the trace path. Use native traces to investigate effects, cascading work and scheduler phases; Agentation only supplies visual annotation context. Source attribution remains available independently through `__ELEMENT_SOURCE__` in development.
