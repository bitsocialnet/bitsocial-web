import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteOrigin = "https://bitsocial.net";
const aboutPublicDir = path.join(repoRoot, "about", "public");
const docsRoot = path.join(repoRoot, "docs");
const docsStaticDir = path.join(docsRoot, "static");
const appsDataPath = path.join(repoRoot, "about", "src", "lib", "apps-data.ts");
const rootReadmePath = path.join(repoRoot, "README.md");

const excludedDocDirs = new Set([
  ".docusaurus",
  "agent-runs",
  "build",
  "dist",
  "i18n",
  "node_modules",
  "src",
  "static",
]);
const excludedDocFiles = new Set(["AGENTS.md", "README.md", "index.mdx", "search.mdx"]);

const docsCategoryOrder = [
  "Protocol notes",
  "Master plan",
  "Apps",
  "Developer tools",
  "Anti-spam challenges",
  "Infrastructure",
  "Contributor playbooks",
  "Other",
];

const siteAppEntries = [
  {
    name: "5chan",
    url: `${siteOrigin}/apps/5chan`,
    description: "Decentralized imageboard client with web, Android, and desktop distribution.",
  },
  {
    name: "Seedit",
    url: `${siteOrigin}/apps/seedit`,
    description: "Forum-style client for Bitsocial with browser, Android, and desktop access.",
  },
  {
    name: "Mintpass",
    url: `${siteOrigin}/apps/mintpass`,
    description: "NFT-backed access control and anti-spam gateway for Bitsocial communities.",
  },
  {
    name: "Spam Blocker",
    url: `${siteOrigin}/apps/spam-blocker`,
    description: "Risk-scoring service for filtering abusive publications.",
  },
  {
    name: "Bitsocial CLI",
    url: `${siteOrigin}/apps/bitsocial-cli`,
    description: "Command-line interface for nodes, publishing, and automation workflows.",
  },
  {
    name: "Telegram Bots",
    url: `${siteOrigin}/apps/telegram-bots`,
    description: "Feed bots that relay Bitsocial posts into Telegram channels.",
  },
];

function log(message) {
  console.log(`[llms] ${message}`);
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, "\n");
}

function collapseBlankLines(value) {
  return value.replace(/\n{3,}/g, "\n\n").trim();
}

function stripFrontmatter(raw) {
  const normalized = normalizeLineEndings(raw);

  if (!normalized.startsWith("---\n")) {
    return normalized.trim();
  }

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    return normalized.trim();
  }

  return normalized.slice(end + 5).trim();
}

function parseFrontmatter(raw) {
  const normalized = normalizeLineEndings(raw);
  const metadata = {};

  if (!normalized.startsWith("---\n")) {
    return metadata;
  }

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    return metadata;
  }

  const frontmatter = normalized.slice(4, end);
  for (const line of frontmatter.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    metadata[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return metadata;
}

function sanitizeMdxContent(raw) {
  return collapseBlankLines(
    stripFrontmatter(raw)
      .replace(/^import\s.+$/gm, "")
      .replace(/^export\s.+$/gm, "")
      .replace(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>\s*$/gm, "")
      .replace(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*>[\s\S]*?<\/\1>\s*$/gm, ""),
  );
}

function markdownToSingleLine(value) {
  return collapseBlankLines(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstHeading(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}

function extractSummary(content) {
  const lines = collapseBlankLines(content)
    .split("\n")
    .map((line) => line.trim());

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line.startsWith("import ")) continue;
    if (line.startsWith("export ")) continue;
    return markdownToSingleLine(line);
  }

  return "";
}

function docSlugFromRelativePath(relativePath) {
  return relativePath.replace(/\.(md|mdx)$/u, "");
}

function docsUrlFromRelativePath(relativePath) {
  return `${siteOrigin}/docs/${docSlugFromRelativePath(relativePath)}/`;
}

function categorizeDoc(relativePath) {
  if (relativePath.startsWith("apps/")) return "Apps";
  if (relativePath.startsWith("developer-tools/")) return "Developer tools";
  if (relativePath.startsWith("anti-spam/")) return "Anti-spam challenges";
  if (relativePath.startsWith("infrastructure/")) return "Infrastructure";
  if (relativePath.startsWith("agent-playbooks/")) return "Contributor playbooks";

  if (
    [
      "peer-to-peer-protocol.md",
      "custom-challenges.md",
      "local-moderation.md",
      "identity-and-ownership.md",
    ].includes(relativePath)
  ) {
    return "Protocol notes";
  }

  if (
    [
      "permissionless-public-rpc.md",
      "bitsocial-network.md",
      "flagship-bitsocial-app.md",
      "scale-bitsocial-economies.md",
      "build-your-own-client.md",
      "decentralize-all-social-media.md",
    ].includes(relativePath)
  ) {
    return "Master plan";
  }

  return "Other";
}

async function collectDocs(dir = docsRoot, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const docs = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.isDirectory()) {
      if (excludedDocDirs.has(entry.name)) continue;
      docs.push(...(await collectDocs(path.join(dir, entry.name), path.join(prefix, entry.name))));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!/\.(md|mdx)$/u.test(entry.name)) continue;
    if (excludedDocFiles.has(entry.name)) continue;

    const relativePath = path.join(prefix, entry.name).replaceAll(path.sep, "/");
    const fullPath = path.join(dir, entry.name);
    const raw = await readFile(fullPath, "utf8");
    const content = sanitizeMdxContent(raw);
    const frontmatter = parseFrontmatter(raw);
    const title =
      frontmatter.title || extractFirstHeading(content) || entry.name.replace(/\.(md|mdx)$/u, "");
    const description = frontmatter.description || extractSummary(content);

    docs.push({
      content,
      description,
      relativePath,
      sortKey: `${docsCategoryOrder.indexOf(categorizeDoc(relativePath)).toString().padStart(2, "0")}:${relativePath}`,
      title,
      url: docsUrlFromRelativePath(relativePath),
      category: categorizeDoc(relativePath),
    });
  }

  return docs;
}

function parseGithubReposFromAppsData(source) {
  const repos = [];
  const seen = new Set(["bitsocialnet/bitsocial-web"]);
  repos.push("bitsocialnet/bitsocial-web");

  for (const match of source.matchAll(/githubRepo:\s*"([^"]+)"/g)) {
    const repo = match[1];
    if (seen.has(repo)) continue;
    seen.add(repo);
    repos.push(repo);
  }

  return repos;
}

function sanitizeReadme(raw) {
  const normalized = normalizeLineEndings(raw);
  const firstHeadingIndex = normalized.search(/^#\s+/m);
  const trimmed = firstHeadingIndex >= 0 ? normalized.slice(firstHeadingIndex) : normalized;

  return collapseBlankLines(
    trimmed
      .replace(/^<img\b[^>]*>\s*$/gm, "")
      .replace(/^!\[[^\]]*]\([^)]+\)\s*$/gm, "")
      .replace(/^\[!\[[^\]]*]\([^)]+\)\]\([^)]+\)\s*$/gm, ""),
  );
}

function readLocalRootReadme() {
  return readFile(rootReadmePath, "utf8");
}

function runGh(args) {
  const result = spawnSync("gh", args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `gh ${args.join(" ")} failed`);
  }

  return result.stdout;
}

async function collectRepoReadmes() {
  const appsData = await readFile(appsDataPath, "utf8");
  const repos = parseGithubReposFromAppsData(appsData);
  const readmes = [];

  for (const repo of repos) {
    log(`fetching README for ${repo}`);

    try {
      const raw =
        repo === "bitsocialnet/bitsocial-web"
          ? await readLocalRootReadme()
          : runGh(["api", `repos/${repo}/readme`, "-H", "Accept: application/vnd.github.raw+json"]);
      const content = sanitizeReadme(raw);
      const title = extractFirstHeading(content) || repo;
      const description = extractSummary(content);

      readmes.push({
        content,
        description,
        repo,
        title,
        url: `https://github.com/${repo}#readme`,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      log(`warning: skipping ${repo} README (${detail})`);
    }
  }

  return readmes;
}

function renderBulletList(entries) {
  return entries
    .map((entry) => `- [${entry.title || entry.name}](${entry.url}): ${entry.description}`)
    .join("\n");
}

function renderDocsSections(docs) {
  return docsCategoryOrder
    .map((category) => {
      const categoryDocs = docs.filter((doc) => doc.category === category);
      if (categoryDocs.length === 0) return "";
      return `## ${category}\n\n${renderBulletList(categoryDocs)}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

function renderFullDocsCorpus(docs) {
  return docs
    .map((doc) =>
      [
        `### ${doc.title}`,
        "",
        `Source: ${doc.url}`,
        `Path: docs/${doc.relativePath}`,
        ...(doc.description ? [`Description: ${doc.description}`, ""] : [""]),
        doc.content,
      ].join("\n"),
    )
    .join("\n\n");
}

function renderReadmeCorpus(readmes) {
  return readmes
    .map((readme) =>
      [
        `### ${readme.title}`,
        "",
        `Repository: ${readme.repo}`,
        `Source: ${readme.url}`,
        ...(readme.description ? [`Description: ${readme.description}`, ""] : [""]),
        readme.content,
      ].join("\n"),
    )
    .join("\n\n");
}

function buildSiteLlms(docs) {
  return collapseBlankLines(`
# Bitsocial

> Bitsocial is an open-source peer-to-peer social network and app ecosystem. This site is the public entry point for the network overview, app directory, privacy notice, and documentation covering protocol notes, apps, anti-spam modules, infrastructure, and contributor workflows.

Use \`${siteOrigin}/\` for the public product overview and \`${siteOrigin}/docs/\` for deeper technical documentation. Ignore \`/about\` and \`/blog\` if they appear in source code or local builds; those routes exist in the web app but are currently development-only, not public production surfaces.

## Main site

- [Home](${siteOrigin}/): High-level explanation of Bitsocial and why it is built around peer-to-peer social apps instead of a centralized platform.
- [Apps](${siteOrigin}/apps): Directory of Bitsocial clients, anti-spam modules, and operator tools.
- [Privacy](${siteOrigin}/privacy): Privacy notice for the about site, docs, analytics, and newsletter flows.

## Apps and tools

${renderBulletList(siteAppEntries)}

## Docs

- [Docs home](${siteOrigin}/docs/): Entry point for protocol notes, roadmap material, app docs, and contributor playbooks.
- [Docs llms.txt](${siteOrigin}/docs/llms.txt): Curated docs-specific index for LLMs.
- [Peer-to-Peer Protocol](${siteOrigin}/docs/peer-to-peer-protocol/): Core explanation of the serverless social model and pubsub-based protocol.
- [Bitsocial Network](${siteOrigin}/docs/bitsocial-network/): Master-plan overview of the shared economic layer proposed for Bitsocial apps.
- [Build your own client](${siteOrigin}/docs/build-your-own-client/): Builder guide for shipping independent Bitsocial clients.
- [CLI](${siteOrigin}/docs/developer-tools/cli/): Command-line documentation for the Bitsocial protocol tooling.
- [Spam Blocker](${siteOrigin}/docs/anti-spam/spam-blocker/): Technical documentation for the centralized risk-scoring anti-spam service.

## Optional

- [llms-full.txt](${siteOrigin}/llms-full.txt): Expanded inline corpus covering the public docs plus companion project READMEs.
- [Docs llms-full.txt](${siteOrigin}/docs/llms-full.txt): Docs-scoped full inline corpus if only the documentation surface is needed.
- [Contributor playbooks](${siteOrigin}/docs/agent-playbooks/): Public workflow docs for contributors and AI agents; useful for repo and process questions, but usually unnecessary for end-user product questions.
- [All public docs pages](${siteOrigin}/docs/llms.txt): ${docs.length} curated public docs entries from the Bitsocial docs site.
`);
}

function buildDocsLlms(docs) {
  return collapseBlankLines(`
# Bitsocial Docs

> Bitsocial Docs is the technical documentation surface for the Bitsocial protocol, roadmap, apps, anti-spam modules, infrastructure, and contributor workflows.

Use this file as the short routing index for \`${siteOrigin}/docs/\`. Use \`${siteOrigin}/docs/llms-full.txt\` when you want the full inline documentation corpus instead of the curated map.

${renderDocsSections(docs)}

## Optional

- [llms-full.txt](${siteOrigin}/docs/llms-full.txt): Full inline markdown aggregation of the public Bitsocial docs plus companion project READMEs.
- [Main site llms.txt](${siteOrigin}/llms.txt): Site-wide entry point covering the public web surfaces outside the docs app.
- [Main site llms-full.txt](${siteOrigin}/llms-full.txt): Site-wide full corpus that includes the public docs and the app/project README appendix.
`);
}

function buildDocsLlmsFull(docs, readmes) {
  return collapseBlankLines(`
# Bitsocial Docs

> Bitsocial Docs is the technical documentation surface for the Bitsocial protocol, roadmap, apps, anti-spam modules, infrastructure, and contributor workflows.

This file expands \`${siteOrigin}/docs/llms.txt\` into a single inline corpus. It includes the public English docs source plus companion project READMEs pulled from GitHub where available.

## How to use this file

Use this file when you want direct inline context instead of following per-page links.

The content is biased toward inference-time lookup, not formal API reference generation. Bitsocial's strongest public material today is protocol explanation, roadmap context, app notes, anti-spam design, and contributor workflow documentation.

${renderDocsSections(docs)}

## Full docs corpus

${renderFullDocsCorpus(docs)}

## Companion project READMEs

${renderReadmeCorpus(readmes)}
`);
}

function buildSiteLlmsFull(docs, readmes) {
  return collapseBlankLines(`
# Bitsocial

> Bitsocial is an open-source peer-to-peer social network and app ecosystem. Bitsocial.net is the public web surface for the network overview, app catalog, privacy notice, and technical documentation.

This file expands \`${siteOrigin}/llms.txt\` into a large inline corpus. It includes public-site routing notes, the full English docs corpus, and companion project READMEs for the main Bitsocial repos linked from the app directory.

## How to use this file

Use this file when you want a single context bundle for Bitsocial instead of following separate doc links.

Two interpretation notes matter:

- Bitsocial is not a centralized social platform. The core model is peer-to-peer publishing, key-controlled ownership, and app-level choice instead of one company-controlled backend.
- Some routes exist in the React app for development (\`/about\` and \`/blog\`) but are not part of the current public production site. Do not treat them as canonical public content.

## Public site surfaces

- [Home](${siteOrigin}/): Public overview of Bitsocial, its decentralized positioning, and the main paths for trying apps or reading docs.
- [Apps](${siteOrigin}/apps): Catalog page grouping public clients, anti-spam modules, and operator tools.
- [Privacy](${siteOrigin}/privacy): Privacy notice for the about site, docs, analytics, and newsletter handling.
- [Docs home](${siteOrigin}/docs/): Technical docs covering protocol notes, roadmap material, app notes, infrastructure docs, and contributor playbooks.
- [Docs llms.txt](${siteOrigin}/docs/llms.txt): Curated docs-specific routing index.
- [Docs llms-full.txt](${siteOrigin}/docs/llms-full.txt): Docs-scoped full inline corpus.

## Public apps and tools

${renderBulletList(siteAppEntries)}

## Documentation map

${renderDocsSections(docs)}

## Full docs corpus

${renderFullDocsCorpus(docs)}

## Companion project READMEs

${renderReadmeCorpus(readmes)}
`);
}

async function writeOutput(relativePath, contents) {
  const outputPath = path.join(repoRoot, relativePath);
  await writeFile(outputPath, `${contents}\n`);
  log(`wrote ${relativePath}`);
}

async function main() {
  if (!existsSync(aboutPublicDir)) {
    throw new Error(`missing expected directory: ${path.relative(repoRoot, aboutPublicDir)}`);
  }

  if (!existsSync(docsStaticDir)) {
    throw new Error(`missing expected directory: ${path.relative(repoRoot, docsStaticDir)}`);
  }

  if (!existsSync(rootReadmePath)) {
    throw new Error(`missing expected file: ${path.relative(repoRoot, rootReadmePath)}`);
  }

  const docs = (await collectDocs()).sort((left, right) =>
    left.sortKey.localeCompare(right.sortKey),
  );
  const readmes = await collectRepoReadmes();

  await writeOutput("about/public/llms.txt", buildSiteLlms(docs));
  await writeOutput("about/public/llms-full.txt", buildSiteLlmsFull(docs, readmes));
  await writeOutput("docs/static/llms.txt", buildDocsLlms(docs));
  await writeOutput("docs/static/llms-full.txt", buildDocsLlmsFull(docs, readmes));
}

main().catch((error) => {
  const detail = error instanceof Error ? error.stack || error.message : String(error);
  console.error(detail);
  process.exitCode = 1;
});
