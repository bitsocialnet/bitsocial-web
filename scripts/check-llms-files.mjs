import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPaths = [
  "about/public/llms.txt",
  "about/public/llms-full.txt",
  "chain/public/llms.txt",
  "chain/public/llms-full.txt",
  "docs/static/llms.txt",
  "docs/static/llms-full.txt",
];
const stalePatterns = [
  ["legacy Chain route", /https:\/\/bitsocial\.net\/chain\//u],
  ["development-only blog route", /https:\/\/bitsocial\.net\/blog(?:[/?#]|$)/u],
  ["legacy browser-gateway claim", /web client that can't join a P2P swarm directly/iu],
  [
    "unredacted private-network URL",
    /(?:https?|wss?):\/\/(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})/u,
  ],
  ["unredacted RPC auth segment", /:9138\/[A-Za-z0-9_-]{16,}/u],
  ["raw Docusaurus directive", /^:::/mu],
  ["stale whitepaper URL", /github\.com\/pkc\/whitepaper\/discussions\/2/u],
  ["stale generated oclif source URL", /github\.com\/oclif\/plugin-help\/blob/u],
  ["non-resolving libp2p.direct apex link", /\]\(https:\/\/libp2p\.direct\)/u],
];
const landingTranslations = JSON.parse(
  await readFile(path.join(repoRoot, "about/public/translations/en/default.json"), "utf8"),
);
// Check the same semantic sections after copy edits without pinning old slogans.
const requiredLandingCopy = [
  "problem",
  "browserPeer",
  "adoptionThesis",
  "textOnlyProtocol",
  "mailingList",
  "faq",
].map((section) => {
  const title = landingTranslations[section]?.title;
  assert(typeof title === "string" && title.trim(), `missing landing title: ${section}.title`);
  const plainTitle = title
    .replace(/<br\s*\/?>/giu, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  assert(plainTitle, `empty landing title: ${section}.title`);
  return plainTitle;
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findRelativeMarkdownLinks(value) {
  const links = [];
  for (const match of value.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/gu)) {
    const target = match[1].trim().split(/\s/u, 1)[0];
    if (!/^(?:[A-Za-z][A-Za-z0-9+.-]*:|#)/u.test(target)) links.push(target);
  }
  return links;
}

const outputs = new Map();
for (const outputPath of outputPaths) {
  const contents = await readFile(path.join(repoRoot, outputPath), "utf8");
  assert(contents.startsWith("# "), `${outputPath} must start with an H1`);
  assert(/^>\s+\S/mu.test(contents), `${outputPath} must include a summary blockquote`);
  outputs.set(outputPath, contents);
}

for (const outputPath of outputPaths) {
  const contents = outputs.get(outputPath);
  const relativeLinks = findRelativeMarkdownLinks(contents);
  assert(
    relativeLinks.length === 0,
    `${outputPath} contains relative markdown links: ${relativeLinks.join(", ")}`,
  );

  for (const [label, pattern] of stalePatterns) {
    assert(!pattern.test(contents), `${outputPath} contains ${label}`);
  }
}

const appsData = await readFile(path.join(repoRoot, "about/src/lib/apps-data.ts"), "utf8");
const appsSection = appsData.slice(appsData.indexOf("export const APPS"));
const appSlugs = [...appsSection.matchAll(/^\s{4}slug:\s*"([^"]+)",/gmu)].map((match) => match[1]);
const appRepos = [
  "bitsocialnet/bitsocial-web",
  ...new Set(
    [...appsSection.matchAll(/^\s{4}githubRepo:\s*"([^"]+)",/gmu)].map((match) => match[1]),
  ),
];
assert(appSlugs.length > 0, "could not parse app slugs from about/src/lib/apps-data.ts");
assert(appRepos.length > 1, "could not parse app repositories from about/src/lib/apps-data.ts");

for (const outputPath of ["about/public/llms.txt", "about/public/llms-full.txt"]) {
  const contents = outputs.get(outputPath);
  for (const slug of appSlugs) {
    assert(contents.includes(`https://bitsocial.net/apps/${slug}`), `${outputPath} omits ${slug}`);
  }
}

for (const outputPath of ["about/public/llms-full.txt", "docs/static/llms-full.txt"]) {
  const contents = outputs.get(outputPath);
  for (const repo of appRepos) {
    assert(contents.includes(`Repository: ${repo}`), `${outputPath} omits ${repo} README`);
  }
}

const chainSectionsIndex = await readFile(
  path.join(repoRoot, "chain/src/sections/index.tsx"),
  "utf8",
);
const chainSectionFiles = [
  ...chainSectionsIndex.matchAll(/^import\s+\w+\s+from\s+"\.\/([^"]+)";$/gmu),
].map((match) => `${match[1]}.tsx`);
assert(chainSectionFiles.length > 0, "could not parse Chain sections from their rendered index");

for (const filename of chainSectionFiles) {
  const sectionSource = await readFile(path.join(repoRoot, "chain/src/sections", filename), "utf8");
  const id = sectionSource.match(/\bid="([^"]+)"/u)?.[1];
  assert(id, `could not parse a section id from chain/src/sections/${filename}`);

  for (const outputPath of ["chain/public/llms.txt", "chain/public/llms-full.txt"]) {
    assert(
      outputs.get(outputPath).includes(`https://chain.bitsocial.net/#${id}`),
      `${outputPath} omits Chain section ${id}`,
    );
  }
}

for (const outputPath of ["chain/public/llms.txt", "chain/public/llms-full.txt"]) {
  assert(
    outputs.get(outputPath).includes("The missing social layer of crypto"),
    `${outputPath} omits the Chain hero`,
  );
}

for (const outputPath of ["about/public/llms-full.txt", "docs/static/llms-full.txt"]) {
  const contents = outputs.get(outputPath);
  for (const excerpt of requiredLandingCopy) {
    assert(contents.includes(excerpt), `${outputPath} omits landing copy: ${excerpt}`);
  }
}

for (const outputPath of outputPaths) {
  const contents = outputs.get(outputPath);
  if (outputPath.startsWith("chain/")) continue;
  assert(contents.includes("https://chain.bitsocial.net/"), `${outputPath} omits Bitsocial Chain`);
}

console.log(
  `[llms-check] verified ${outputPaths.length} files, ${appSlugs.length} app routes, ${appRepos.length} project READMEs, ${chainSectionFiles.length} Chain sections, complete landing coverage, absolute links, and corpus hygiene`,
);
