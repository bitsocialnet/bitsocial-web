#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const yarnBin = process.platform === "win32" ? "yarn.cmd" : "yarn";

function readLines(args) {
  const output = execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();

  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function runYarnCommand(args) {
  console.log(`Running: ${yarnBin} ${args.join(" ")}`);

  const result = spawnSync(yarnBin, args, {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if ((result.status ?? 0) !== 0) {
    process.exit(result.status ?? 1);
  }
}

const trackedChanges = readLines(["diff", "--name-only", "HEAD", "--"]);
const untrackedChanges = readLines(["ls-files", "--others", "--exclude-standard"]);
const changedPaths = [...new Set([...trackedChanges, ...untrackedChanges])];

const touchesRootDependencies =
  changedPaths.includes("package.json") || changedPaths.includes("yarn.lock");
const needsAboutBuild =
  touchesRootDependencies ||
  changedPaths.some(
    (filePath) => filePath === "about/package.json" || filePath.startsWith("about/"),
  );
const needsDocsBuild = changedPaths.some(
  (filePath) => filePath === "docs/package.json" || filePath.startsWith("docs/"),
);
const needsStatsMonitorCheck = changedPaths.some(
  (filePath) =>
    filePath === "stats/package.json" ||
    filePath === "stats/monitor/package.json" ||
    filePath.startsWith("stats/monitor/"),
);
const needsStatsDashboardsBuild = changedPaths.some((filePath) =>
  filePath.startsWith("stats/grafana/"),
);

if (changedPaths.length === 0) {
  console.log("No local changes detected; running the default frontend verification build.");
  runYarnCommand(["build:about"]);
  process.exit(0);
}

console.log("Changed paths:");
for (const filePath of changedPaths) {
  console.log(`- ${filePath}`);
}
console.log("");

if (needsAboutBuild) {
  runYarnCommand(["build:about"]);
}

if (needsDocsBuild) {
  runYarnCommand(["docs:build:verify"]);
}

if (needsStatsDashboardsBuild) {
  runYarnCommand(["build:stats-dashboards"]);
}

if (needsStatsMonitorCheck) {
  runYarnCommand(["build:stats-monitor"]);
}

if (!needsAboutBuild && !needsDocsBuild && !needsStatsDashboardsBuild && !needsStatsMonitorCheck) {
  console.log("No targeted build checks matched the current diff.");
}
