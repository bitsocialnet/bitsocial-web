#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { main as review } from "./translations.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const csv = (value) => [
  ...new Set(
    (value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ),
];

export async function loadDocPairs(repository, locales, paths) {
  if (!locales.length || !paths.length || locales.length * paths.length > 30)
    throw new Error("Select 1–30 locale/page pairs");
  if (
    locales.some((locale) => !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(locale) || locale === "en")
  )
    throw new Error("Invalid target locale");
  if (
    paths.some(
      (name) =>
        !/\.mdx?$/.test(name) ||
        name.startsWith("-") ||
        path.isAbsolute(name) ||
        name.split(/[\\/]/).some((part) => !part || part === ".." || part === ".") ||
        name.startsWith("i18n/"),
    )
  )
    throw new Error("Use source-relative Markdown paths");
  const docs = await fs.realpath(path.join(repository, "docs"));
  async function read(relative) {
    const file = await fs.realpath(path.join(docs, relative));
    if (!file.startsWith(`${docs}${path.sep}`)) throw new Error("Document escapes docs directory");
    if ((await fs.stat(file)).size > 24_000)
      throw new Error(
        "Page exceeds 24 KB; select reviewed paragraph pairs with translations.mjs --pairs",
      );
    return fs.readFile(file, "utf8");
  }
  const pairs = [];
  for (const name of paths) {
    const source = await read(name);
    for (const locale of locales) {
      pairs.push({
        key: name,
        locale,
        source,
        translation: await read(`i18n/${locale}/docusaurus-plugin-content-docs/current/${name}`),
        context:
          "Bitsocial technical documentation. Preserve the original qualifications and distinguish local peer behavior from global guarantees.",
      });
    }
  }
  return pairs;
}

export async function main(argv = process.argv.slice(2), repository = root) {
  const { values } = parseArgs({
    args: argv,
    options: {
      help: { type: "boolean", short: "h" },
      locales: { type: "string" },
      paths: { type: "string" },
      live: { type: "boolean" },
      model: { type: "string" },
      "max-requests": { type: "string" },
      "max-cost-usd": { type: "string" },
      "no-cache": { type: "boolean" },
      "cache-dir": { type: "string" },
    },
  });
  if (values.help) {
    console.log(
      "Usage: node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md [--live --model <pinned-model>]\nRuns the existing structural checker before read-only semantic QA; never rewrites docs. Use translation-README.md for budgets and interpretation.",
    );
    return 0;
  }
  const locales = csv(values.locales),
    paths = csv(values.paths);
  const pairs = await loadDocPairs(repository, locales, paths);
  // A deterministic defect blocks provider calls. Keep the existing checker's diagnostics visible.
  execFileSync(
    "python3",
    [
      path.join(repository, "scripts/check-docs-translations.py"),
      "--locales",
      ...locales,
      "--paths",
      ...paths,
    ],
    { cwd: repository, stdio: ["ignore", "inherit", "inherit"], timeout: 30_000 },
  );
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "bitsocial-docs-qa-"));
  try {
    const file = path.join(temporary, "pairs.json");
    await fs.writeFile(file, JSON.stringify(pairs), { mode: 0o600 });
    const args = ["--pairs", file];
    for (const name of ["model", "max-requests", "max-cost-usd", "cache-dir"])
      if (values[name]) args.push(`--${name}`, values[name]);
    for (const name of ["live", "no-cache"]) if (values[name]) args.push(`--${name}`);
    return await review(args);
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch(() => {
      console.error(
        "Docs QA could not complete. Check explicit locales/paths, page size, and structural diagnostics; use --help. No translations were changed.",
      );
      process.exitCode = 2;
    });
}
