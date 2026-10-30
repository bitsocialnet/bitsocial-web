#!/usr/bin/env node

// Captures a chain page's skeleton bones with boneyard's CLI, inside the repository's one browser
// slot. Run it with this checkout's chain dev server up, passing the page's URL on it: worktrees get
// their own hosts, so a default could capture another checkout. Each page keeps its own registry,
// so neither page bundles the other's bones.

import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { withBrowser } from "./react-perf/browser.mjs";

// The widths where each page's skeleton layout changes in English. The chart: the toolbar's rows,
// the era buttons' columns and the 40rem query, plus 960 and the widest layout. The rich list: the
// supply legend's rows, the holders table's phone grid up to 40rem, and where holder names stop
// wrapping.
const PAGES = {
  chart: {
    out: "src/chart/bones",
    breakpoints: "336,416,496,644,720,788,960,1120,1280",
  },
  "rich-list": {
    out: "src/rich-list/bones",
    breakpoints: "320,360,452,520,641,664,760,828,884,988",
  },
};

const exec = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chainRoot = path.join(repoRoot, "chain");
const [pageName, pageUrl] = process.argv.slice(2);
const page = Object.hasOwn(PAGES, pageName) ? PAGES[pageName] : undefined;
if (!page || !pageUrl) {
  console.error(
    `Usage: node scripts/capture-bones.mjs <${Object.keys(PAGES).join("|")}> <page URL, e.g. https://chain.bitsocial.localhost/${page ? pageName : "chart"}/>`,
  );
  process.exit(1);
}
// The bones follow the English layout whatever the machine's locale. `lang` is LANGUAGE_QUERY_PARAM
// in chain/src/lib/locales.ts, which the page reads before the browser's language.
const url = new URL(pageUrl);
url.searchParams.set("lang", "en");

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
      page.out,
      "--breakpoints",
      page.breakpoints,
      "--wait",
      "1500",
    ],
    { cwd: chainRoot, timeout: 300000 },
  );
  process.stdout.write(stdout);
});
await exec("yarn", ["oxfmt", path.join("chain", page.out)], { cwd: repoRoot });
