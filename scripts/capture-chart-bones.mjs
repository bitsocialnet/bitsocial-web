#!/usr/bin/env node

// Captures the price chart's skeleton bones into chain/src/bones with boneyard's CLI, inside the
// repository's one browser slot. Run it with the chain dev server up; pass the chart's URL when it
// is not at the canonical dev URL.

import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { withBrowser } from "./react-perf/browser.mjs";

const exec = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chainRoot = path.join(repoRoot, "chain");
const url = process.argv[2] ?? "https://chain.bitsocial.localhost/chart/";
// The widths where the chart panel's layout changes in English: the toolbar's rows, the era
// buttons' columns and the 40rem query, plus 960 and the widest layout.
const breakpoints = "336,416,496,644,720,788,960,1120,1280";

await withBrowser(chainRoot, false, async (_browser, cdpUrl) => {
  const { stdout } = await exec(
    "yarn",
    [
      "boneyard-js",
      "build",
      url,
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
