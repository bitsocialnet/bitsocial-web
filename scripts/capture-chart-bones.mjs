#!/usr/bin/env node

// Captures the price chart's skeleton bones into chain/src/bones with boneyard's CLI, inside the
// repository's one browser slot. Run it with this checkout's chain dev server up, passing the
// chart's URL on it: worktrees get their own hosts, so a default could capture another checkout.

import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { withBrowser } from "./react-perf/browser.mjs";

const exec = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chainRoot = path.join(repoRoot, "chain");
const [chartUrl] = process.argv.slice(2);
if (!chartUrl) {
  console.error(
    "Usage: corepack yarn chart:bones <chart URL, e.g. https://chain.bitsocial.localhost/chart/>",
  );
  process.exit(1);
}
// The bones follow the English layout whatever the machine's locale. `lang` is LANGUAGE_QUERY_PARAM
// in chain/src/lib/locales.ts, which the page reads before the browser's language.
const url = new URL(chartUrl);
url.searchParams.set("lang", "en");
// The widths where the chart panel's layout changes in English: the toolbar's rows, the era
// buttons' columns and the 40rem query, plus 960 and the widest layout.
const breakpoints = "336,416,496,644,720,788,960,1120,1280";

await withBrowser(chainRoot, false, async (_browser, cdpUrl) => {
  const { stdout } = await exec(
    "yarn",
    [
      "boneyard-js",
      "build",
      url.href,
      "--cdp",
      cdpUrl,
      "--force",
      "--out",
      "src/bones",
      "--breakpoints",
      breakpoints,
      "--wait",
      "1500",
    ],
    { cwd: chainRoot, timeout: 300000 },
  );
  process.stdout.write(stdout);
});
await exec("yarn", ["oxfmt", "chain/src/bones"], { cwd: repoRoot });
