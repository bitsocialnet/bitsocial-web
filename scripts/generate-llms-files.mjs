import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteOrigin = "https://bitsocial.net";
const docsOrigin = "https://docs.bitsocial.net";
const statsOrigin = "https://stats.bitsocial.net";
const aboutPublicDir = path.join(repoRoot, "about", "public");
const docsRoot = path.join(repoRoot, "docs");
const docsStaticDir = path.join(docsRoot, "static");
const appsDataPath = path.join(repoRoot, "about", "src", "lib", "apps-data.ts");
const aboutEnglishTranslationsPath = path.join(
  repoRoot,
  "about",
  "public",
  "translations",
  "en",
  "default.json",
);
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

const landingDeepComparisonServices = [
  { id: "nostr", anchor: "nostr-comparison" },
  { id: "bluesky", anchor: "bluesky-comparison" },
  { id: "mastodon", anchor: "mastodon-comparison" },
  { id: "farcaster", anchor: "farcaster-comparison" },
  { id: "lens", anchor: "lens-comparison" },
  { id: "deso", anchor: "deso-comparison" },
  { id: "steemit", anchor: "steemit-comparison" },
];

const landingDeepComparisonRows = [
  "replies",
  "antiSpam",
  "scalingEconomics",
  "dataLayer",
  "moderation",
  "communityModel",
  "browserMobile",
  "identity",
  "contentDiscovery",
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

function translationToSingleLine(value) {
  if (typeof value !== "string") return "";

  return collapseBlankLines(value.replace(/<[^>]+>/g, " "))
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[*_>#]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,;:!?])/g, "$1")
    .replace(/\s+\.(\s|$)/g, ".$1")
    .trim();
}

function tableCell(value) {
  return translationToSingleLine(value).replaceAll("|", "\\|");
}

function sentenceList(values) {
  return values.map(translationToSingleLine).filter(Boolean).join(" ");
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
  return `${docsOrigin}/${docSlugFromRelativePath(relativePath)}/`;
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
      .replaceAll(
        "https://bitsocial.net/apps?category=",
        "https://bitsocial.net/projects?category=",
      )
      .replaceAll("Bitsocial app directory", "Bitsocial project directory")
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

async function readAboutTranslations() {
  const raw = await readFile(aboutEnglishTranslationsPath, "utf8");
  return JSON.parse(raw);
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

function titleFromId(id) {
  return id
    .split(/[-_]/u)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function serviceDetailKey(serviceId) {
  return `detail${serviceId.charAt(0).toUpperCase()}${serviceId.slice(1)}`;
}

function buildLandingData(translations) {
  const heroSegments = translations.hero?.taglineSegments ?? {};
  const features = translations.features?.items ?? {};
  const sanctuary = translations.sanctuary ?? {};
  const deepComparison = sanctuary.deepComparison ?? {};
  const arbitraryChallenges = translations.arbitraryChallenges ?? {};
  const textOnlyProtocol = translations.textOnlyProtocol ?? {};
  const masterPlan = translations.masterPlan ?? {};

  const deepServices = landingDeepComparisonServices
    .map(({ id, anchor }) => ({
      id,
      anchor,
      label: translationToSingleLine(deepComparison.services?.[id]) || titleFromId(id),
    }))
    .filter((service) => service.label);
  const deepRows = landingDeepComparisonRows
    .map((id) => ({
      id,
      label: translationToSingleLine(deepComparison.rows?.[id]?.label) || titleFromId(id),
    }))
    .filter((row) => row.label);

  return {
    arbitraryChallenges: {
      quote: translationToSingleLine(arbitraryChallenges.quote),
      options: Object.values(arbitraryChallenges.options ?? {})
        .map(translationToSingleLine)
        .filter(Boolean),
      supporting: translationToSingleLine(arbitraryChallenges.supporting),
      title: translationToSingleLine(arbitraryChallenges.title),
    },
    textOnlyProtocol: {
      cards: ["communities", "apps", "media"]
        .map((id) => {
          const { myth, reality, ...points } = textOnlyProtocol[id] ?? {};
          return {
            myth: translationToSingleLine(myth),
            reality: translationToSingleLine(reality),
            points: Object.values(points).map(translationToSingleLine).filter(Boolean),
          };
        })
        .filter((card) => card.reality || card.points.length),
      supporting: translationToSingleLine(textOnlyProtocol.supporting),
      title: translationToSingleLine(textOnlyProtocol.title),
      quote: translationToSingleLine(textOnlyProtocol.quote),
    },
    comparison: {
      approaches: Object.values(sanctuary.approaches ?? {})
        .map((approach) => {
          const label = translationToSingleLine(approach.label);
          const subtitle = translationToSingleLine(approach.subtitle);
          return subtitle ? `${label} (${subtitle})` : label;
        })
        .filter(Boolean),
      approachLabels: Object.fromEntries(
        Object.entries(sanctuary.approaches ?? {}).map(([id, approach]) => [
          id,
          translationToSingleLine(approach.label),
        ]),
      ),
      rows: Object.values(sanctuary.rows ?? {})
        .map((row) => ({
          bitsocial: translationToSingleLine(row.bitsocial),
          blockchain: translationToSingleLine(row.blockchain),
          federated: translationToSingleLine(row.federated),
          label: translationToSingleLine(row.label),
        }))
        .filter((row) => row.label),
      supporting: translationToSingleLine(sanctuary.supporting),
    },
    deepComparison: {
      rows: deepRows,
      services: deepServices,
      rawRows: deepComparison.rows ?? {},
    },
    features: Object.entries(features)
      .map(([id, feature]) => ({
        title: titleFromId(id),
        description: translationToSingleLine(feature.description),
      }))
      .filter((feature) => feature.description),
    hero:
      translationToSingleLine(translations.hero?.tagline) ||
      sentenceList(Object.values(heroSegments)),
    masterPlan: {
      epilogue: translationToSingleLine(masterPlan.epilogue),
      epilogueFinal: translationToSingleLine(masterPlan.epilogueFinal),
      phases: Object.values(masterPlan.phases ?? {})
        .map((phase) => ({
          description: translationToSingleLine(phase.description),
          phase: translationToSingleLine(phase.phase),
          title: translationToSingleLine(phase.title),
        }))
        .filter((phase) => phase.title),
      subtitle: translationToSingleLine(masterPlan.subtitle),
      title: translationToSingleLine(masterPlan.title),
    },
  };
}

function renderLandingShortIndex(landing, heading = "Landing page highlights") {
  const deepServices = landing.deepComparison.services.map((service) => service.label).join(", ");
  const deepRows = landing.deepComparison.rows.map((row) => row.label).join(", ");
  const challengeOptions = landing.arbitraryChallenges.options.join(", ");

  return collapseBlankLines(`
## ${heading}

- [Home](${siteOrigin}/): ${landing.hero}
- [Core features](${siteOrigin}/): Bitsocial is open source, peer-to-peer via IPFS/libp2p, app-oriented, serverless by default, locally moderated with no protocol-level global bans, and built around key-controlled identities and communities.
- [Sanctuary comparison](${siteOrigin}/#decentralized): Compares ${landing.comparison.approaches.join("; ")} across self-hosting cost, who keeps content online, scaling, custom anti-spam logic, and takedown choke points.
- [Deep comparison tables](${siteOrigin}/#nostr-comparison): Sourced modal tables compare Bitsocial with ${deepServices} across ${deepRows}.
- [Arbitrary Challenges](${siteOrigin}/#arbitrary-challenges): ${landing.arbitraryChallenges.supporting} Example modules include ${challengeOptions}.
- [Text-only Protocol](${siteOrigin}/#text-only-protocol): ${landing.textOnlyProtocol.supporting}
- [Master Plan](${siteOrigin}/#master-plan): ${landing.masterPlan.subtitle}
`);
}

function renderLandingComparisonTable(landing) {
  const { approachLabels } = landing.comparison;
  const rows = landing.comparison.rows
    .map(
      (row) =>
        `| ${tableCell(row.label)} | ${tableCell(row.federated)} | ${tableCell(row.blockchain)} | ${tableCell(row.bitsocial)} |`,
    )
    .join("\n");

  if (!rows) return "";

  return collapseBlankLines(`
### Sanctuary comparison

Source: ${siteOrigin}/#decentralized

${landing.comparison.supporting}

| Topic | ${tableCell(approachLabels.federated) || "Federated"} | ${tableCell(approachLabels.blockchain) || "Blockchain-based"} | ${tableCell(approachLabels.bitsocial) || "Bitsocial"} |
| --- | --- | --- | --- |
${rows}
`);
}

function renderLandingDeepComparisonCorpus(landing) {
  const sections = landing.deepComparison.services
    .map((service) => {
      const rows = landingDeepComparisonRows
        .map((rowId) => {
          const row = landing.deepComparison.rawRows[rowId];
          if (!row?.[service.id]) return null;

          return {
            bitsocial: row.bitsocial,
            detail: row[serviceDetailKey(service.id)] || row.detail,
            label: row.label,
            service: row[service.id],
          };
        })
        .filter(Boolean);

      if (rows.length === 0) return "";

      const tableRows = rows
        .map(
          (row) =>
            `| ${tableCell(row.label)} | ${tableCell(row.service)} | ${tableCell(row.bitsocial)} |`,
        )
        .join("\n");
      const detailRows = rows
        .map(
          (row) =>
            `- ${translationToSingleLine(row.label)}: ${translationToSingleLine(row.detail)}`,
        )
        .join("\n");

      return collapseBlankLines(`
### ${service.label} vs Bitsocial

Source: ${siteOrigin}/#${service.anchor}

| Topic | ${tableCell(service.label)} | Bitsocial |
| --- | --- | --- |
${tableRows}

Details:

${detailRows}
`);
    })
    .filter(Boolean)
    .join("\n\n");

  return collapseBlankLines(`
## Landing page deep comparison tables

${sections}
`);
}

function renderLandingFullCorpus(landing) {
  const featureRows = landing.features
    .map((feature) => `- ${feature.title}: ${feature.description}`)
    .join("\n");
  const textOnlyCardRows = landing.textOnlyProtocol.cards
    .map((card) => `- ${card.reality} ${card.points.join(" ")}`.trim())
    .join("\n");
  const masterPlanRows = landing.masterPlan.phases
    .map((phase) => `- ${phase.phase} - ${phase.title}: ${phase.description}`)
    .join("\n");

  return collapseBlankLines(`
## Landing page corpus

### Hero

Source: ${siteOrigin}/

${landing.hero}

### Core features

${featureRows}

${renderLandingComparisonTable(landing)}

### Arbitrary Challenges

Source: ${siteOrigin}/#arbitrary-challenges

${landing.arbitraryChallenges.title}

${landing.arbitraryChallenges.supporting}

Plug-in examples: ${landing.arbitraryChallenges.options.join(", ")}.

Founder note: ${landing.arbitraryChallenges.quote}

### Text-only Protocol

Source: ${siteOrigin}/#text-only-protocol

${landing.textOnlyProtocol.title}

${landing.textOnlyProtocol.supporting}

${textOnlyCardRows}

Founder note: ${landing.textOnlyProtocol.quote}

### Master Plan

Source: ${siteOrigin}/#master-plan

${landing.masterPlan.title}

${landing.masterPlan.subtitle}

${masterPlanRows}

${landing.masterPlan.epilogue}

${landing.masterPlan.epilogueFinal}

${renderLandingDeepComparisonCorpus(landing)}
`);
}

function buildSiteLlms(docs, landing) {
  return collapseBlankLines(`
# Bitsocial

> Bitsocial is an open-source peer-to-peer social network and app ecosystem. This site is the public entry point for the network overview, project directory, privacy notice, and documentation covering protocol notes, apps, anti-spam modules, infrastructure, and contributor workflows.

Use \`${siteOrigin}/\` for the public product overview and \`${docsOrigin}/\` for deeper technical documentation. Ignore \`/about\` and \`/blog\` if they appear in source code or local builds; those routes exist in the web app but are currently development-only, not public production surfaces.

## Main site

- [Home](${siteOrigin}/): High-level explanation of Bitsocial and why it is built around peer-to-peer social apps instead of a centralized platform.
- [Projects](${siteOrigin}/projects): Directory of Bitsocial clients, anti-spam modules, and operator tools.
- [Privacy](${siteOrigin}/privacy): Privacy notice for the about site, docs, analytics, and newsletter flows.

${renderLandingShortIndex(landing)}

## Apps and tools

${renderBulletList(siteAppEntries)}

## Docs

- [Docs home](${docsOrigin}/): Entry point for protocol notes, roadmap material, app docs, and contributor playbooks.
- [Docs llms.txt](${docsOrigin}/llms.txt): Curated docs-specific index for LLMs.
- [Peer-to-Peer Protocol](${docsOrigin}/peer-to-peer-protocol/): Core explanation of the serverless social model and pubsub-based protocol.
- [Bitsocial Chain](${docsOrigin}/bitsocial-network/): Master-plan overview of the proposed Ethereum L2 appchain economic layer for Bitsocial apps.
- [Build your own client](${docsOrigin}/build-your-own-client/): Builder guide for shipping independent Bitsocial clients.
- [CLI](${docsOrigin}/developer-tools/cli/): Command-line documentation for the Bitsocial protocol tooling.
- [Spam Blocker](${docsOrigin}/anti-spam/spam-blocker/): Technical documentation for the centralized risk-scoring anti-spam service.

## Optional

- [llms-full.txt](${siteOrigin}/llms-full.txt): Expanded inline corpus covering the public docs plus companion project READMEs.
- [Docs llms-full.txt](${docsOrigin}/llms-full.txt): Docs-scoped full inline corpus if only the documentation surface is needed.
- [Contributor playbooks](${docsOrigin}/agent-playbooks/): Public workflow docs for contributors and AI agents; useful for repo and process questions, but usually unnecessary for end-user product questions.
- [All public docs pages](${docsOrigin}/llms.txt): ${docs.length} curated public docs entries from the Bitsocial docs site.
`);
}

function buildDocsLlms(docs, landing) {
  return collapseBlankLines(`
# Bitsocial Docs

> Bitsocial Docs is the technical documentation surface for the Bitsocial protocol, roadmap, apps, anti-spam modules, infrastructure, and contributor workflows.

Use this file as the short routing index for \`${docsOrigin}/\`. Use \`${docsOrigin}/llms-full.txt\` when you want the full inline documentation corpus instead of the curated map.

${renderLandingShortIndex(landing, "Related landing page context")}

${renderDocsSections(docs)}

## Optional

- [llms-full.txt](${docsOrigin}/llms-full.txt): Full inline markdown aggregation of the public Bitsocial docs plus companion project READMEs.
- [Main site llms.txt](${siteOrigin}/llms.txt): Site-wide entry point covering the public web surfaces outside the docs app.
- [Main site llms-full.txt](${siteOrigin}/llms-full.txt): Site-wide full corpus that includes the public docs and the app/project README appendix.
`);
}

function buildDocsLlmsFull(docs, readmes, landing) {
  return collapseBlankLines(`
# Bitsocial Docs

> Bitsocial Docs is the technical documentation surface for the Bitsocial protocol, roadmap, apps, anti-spam modules, infrastructure, and contributor workflows.

This file expands \`${docsOrigin}/llms.txt\` into a single inline corpus. It includes the public English docs source, key landing-page context, and companion project READMEs pulled from GitHub where available.

## How to use this file

Use this file when you want direct inline context instead of following per-page links.

The content is biased toward inference-time lookup, not formal API reference generation. Bitsocial's strongest public material today is protocol explanation, roadmap context, app notes, anti-spam design, and contributor workflow documentation.

${renderLandingShortIndex(landing, "Related landing page context")}

${renderDocsSections(docs)}

${renderLandingFullCorpus(landing)}

## Full docs corpus

${renderFullDocsCorpus(docs)}

## Companion project READMEs

${renderReadmeCorpus(readmes)}
`);
}

function buildSiteLlmsFull(docs, readmes, landing) {
  return collapseBlankLines(`
# Bitsocial

> Bitsocial is an open-source peer-to-peer social network and app ecosystem. Bitsocial.net is the public web surface for the network overview, project catalog, privacy notice, and technical documentation.

This file expands \`${siteOrigin}/llms.txt\` into a large inline corpus. It includes public-site routing notes, the full English docs corpus, and companion project READMEs for the main Bitsocial repos linked from the project directory.

## How to use this file

Use this file when you want a single context bundle for Bitsocial instead of following separate doc links.

Two interpretation notes matter:

- Bitsocial is not a centralized social platform. The core model is peer-to-peer publishing, key-controlled ownership, and app-level choice instead of one company-controlled backend.
- Some routes exist in the React app for development (\`/about\` and \`/blog\`) but are not part of the current public production site. Do not treat them as canonical public content.

## Public site surfaces

- [Home](${siteOrigin}/): Public overview of Bitsocial, its decentralized positioning, and the main paths for trying apps or reading docs.
- [Projects](${siteOrigin}/projects): Catalog page grouping public clients, anti-spam modules, and operator tools.
- [Privacy](${siteOrigin}/privacy): Privacy notice for the about site, docs, analytics, and newsletter handling.
- [Docs home](${docsOrigin}/): Technical docs covering protocol notes, roadmap material, app notes, infrastructure docs, and contributor playbooks.
- [Docs llms.txt](${docsOrigin}/llms.txt): Curated docs-specific routing index.
- [Docs llms-full.txt](${docsOrigin}/llms-full.txt): Docs-scoped full inline corpus.
- [Stats dashboard](${statsOrigin}/): Grafana-backed public stats surface for Bitsocial apps and infrastructure.

${renderLandingShortIndex(landing)}

## Public apps and tools

${renderBulletList(siteAppEntries)}

${renderLandingFullCorpus(landing)}

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

  if (!existsSync(aboutEnglishTranslationsPath)) {
    throw new Error(
      `missing expected file: ${path.relative(repoRoot, aboutEnglishTranslationsPath)}`,
    );
  }

  const aboutTranslations = await readAboutTranslations();
  const landing = buildLandingData(aboutTranslations);
  const docs = (await collectDocs()).sort((left, right) =>
    left.sortKey.localeCompare(right.sortKey),
  );
  const readmes = await collectRepoReadmes();

  await writeOutput("about/public/llms.txt", buildSiteLlms(docs, landing));
  await writeOutput("about/public/llms-full.txt", buildSiteLlmsFull(docs, readmes, landing));
  await writeOutput("docs/static/llms.txt", buildDocsLlms(docs, landing));
  await writeOutput("docs/static/llms-full.txt", buildDocsLlmsFull(docs, readmes, landing));
}

main().catch((error) => {
  const detail = error instanceof Error ? error.stack || error.message : String(error);
  console.error(detail);
  process.exitCode = 1;
});
