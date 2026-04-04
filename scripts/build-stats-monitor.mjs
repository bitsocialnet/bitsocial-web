#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const monitorRoot = path.join(repoRoot, "stats", "monitor");

function collectFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }

    if (entry.isFile() && /\.(c|m)?js$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function runCheck(filePath) {
  const relativePath = path.relative(repoRoot, filePath);
  console.log(`Checking syntax: ${relativePath}`);

  const result = spawnSync(process.execPath, ["--check", filePath], {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if ((result.status ?? 0) !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!statSync(monitorRoot).isDirectory()) {
  console.error(`stats monitor directory not found: ${monitorRoot}`);
  process.exit(1);
}

for (const filePath of collectFiles(monitorRoot)) {
  runCheck(filePath);
}

console.log("Stats monitor syntax check complete.");
