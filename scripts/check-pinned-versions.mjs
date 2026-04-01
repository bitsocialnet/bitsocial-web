import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const dependencySections = ["dependencies", "devDependencies", "optionalDependencies"];
const ignoredDirs = new Set([".git", ".yarn", "dist", "node_modules"]);
const exactSemverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const pinnedProtocols = ["file:", "link:", "patch:", "portal:", "workspace:"];
const urlProtocols = [
  "git://",
  "git+http://",
  "git+https://",
  "git+ssh://",
  "github:",
  "http://",
  "https://",
];

async function findPackageJsonFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const packageJsonFiles = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) {
        continue;
      }

      packageJsonFiles.push(...(await findPackageJsonFiles(path.join(dir, entry.name))));
      continue;
    }

    if (entry.name === "package.json") {
      packageJsonFiles.push(path.join(dir, entry.name));
    }
  }

  return packageJsonFiles;
}

function isPinnedVersion(specifier) {
  if (exactSemverPattern.test(specifier)) {
    return true;
  }

  if (pinnedProtocols.some((prefix) => specifier.startsWith(prefix))) {
    return true;
  }

  if (specifier.startsWith("npm:")) {
    const aliasSeparator = specifier.lastIndexOf("@");
    if (aliasSeparator === -1) {
      return false;
    }

    return isPinnedVersion(specifier.slice(aliasSeparator + 1));
  }

  if (urlProtocols.some((prefix) => specifier.startsWith(prefix))) {
    return true;
  }

  return false;
}

function formatFailure(packageJsonPath, section, name, specifier) {
  return `${path.relative(repoRoot, packageJsonPath)}: ${section}.${name} uses non-pinned version "${specifier}"`;
}

const packageJsonFiles = (await findPackageJsonFiles(repoRoot)).sort();
const failures = [];

for (const packageJsonPath of packageJsonFiles) {
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

  for (const section of dependencySections) {
    const dependencies = packageJson[section];
    if (!dependencies) {
      continue;
    }

    for (const [name, specifier] of Object.entries(dependencies)) {
      if (typeof specifier !== "string" || isPinnedVersion(specifier)) {
        continue;
      }

      failures.push(formatFailure(packageJsonPath, section, name, specifier));
    }
  }
}

if (failures.length > 0) {
  console.error("Found non-pinned dependency versions:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Pinned dependency check passed for ${packageJsonFiles.length} package.json file(s).`);
