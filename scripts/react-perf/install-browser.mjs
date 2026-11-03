import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { browserDriver } from "./browser.mjs";

const driver = browserDriver();
const channel = process.env.REACT_PERF_BROWSER_CHANNEL || "chrome";
const options = process.argv.slice(2);
if (channel === "chrome" && options.length === 0) {
  // Ask the pinned driver for the same system Chrome it would actually launch.
  const { registry } = createRequire(driver.install)("playwright-core/lib/coreBundle").registry;
  const installed = registry.findExecutable(channel).executablePath();
  if (installed) {
    console.log(`Using system Chrome at ${installed}`);
  } else {
    console.error(
      "Google Chrome is missing. Install it with your system package manager or run yarn perf:install --force to install it system-wide.",
    );
    process.exitCode = 1;
  }
} else {
  const result = spawnSync(process.execPath, [driver.install, "install", channel, ...options], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
