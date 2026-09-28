// Install the React hook before evaluating React DOM or development annotation tools.
async function start() {
  if (import.meta.env.DEV || import.meta.env.MODE === "profiling") {
    const { installCollector } = await import("../../scripts/react-perf/collector.mjs");
    installCollector({ buildType: import.meta.env.DEV ? "development" : "profiling" });
  }
  await import("./bootstrap");
}

void start();
