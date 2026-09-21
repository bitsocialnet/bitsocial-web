import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { buildCandidates, collectDocs, extractDoc, suggestLinks } from "../docs-links.mjs";
import { createJevClient } from "../client.mjs";

const exec = promisify(execFile);
// Synthetic authoring cases; these are not labels of Jev quality.
const prose =
  "Community ownership follows the private key and remains independent of the hosting provider.";
const source = (extra = "") =>
  extractDoc(
    "docs/source.md",
    `---\ntitle: Community ownership metadata is not prose\n---\n# Hosting\n\n${prose}\n\n${extra}`,
  );
const target = extractDoc(
  "docs/ownership.md",
  "# Community ownership\n\nCommunity ownership means authority follows the private key, even when the hosting service changes.\n",
);
const choice = (selected, probability = 0.98) => ({
  type: "choice",
  choice: selected,
  confidence: probability,
  probabilities: Object.fromEntries(
    ["useful", "not_useful", "uncertain"].map((key) => [
      key,
      key === selected ? probability : (1 - probability) / 2,
    ]),
  ),
});
const fakeClient = (answer, inspect = () => {}, limits = {}) =>
  createJevClient({
    live: true,
    apiKey: "fixture-docs-links-key",
    model: "jev-1.13.0",
    ...limits,
    fetchImpl: async (_, options) => {
      inspect(JSON.parse(options.body));
      return Response.json({
        model: "jev-1.13.0",
        answers: { relevance: answer },
        usage: { input_tokens: 123, output_tokens: 8 },
      });
    },
  });

test("source spans are exact, resolve only existing targets, and ignore markup", () => {
  const doc = source(
    "```md\nCommunity ownership hidden in code should not be used as source evidence.\n```\n\nCommunity ownership in `inline code` is not an eligible paragraph.\n\n[Community ownership](https://example.test) already has a link.\n",
  );
  assert.equal(doc.blocks.length, 1);
  const candidates = buildCandidates([doc, target], { sources: [doc.file] });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].phrase, "Community ownership");
  assert.equal(doc.text.slice(candidates[0].start, candidates[0].end), candidates[0].phrase);
  assert.equal(
    path.posix.normalize(path.posix.join(path.posix.dirname(doc.file), candidates[0].href)),
    target.file,
  );
  assert.ok(!candidates[0].href.includes("#"));
  assert.match(candidates[0].sourceSha256, /^[a-f0-9]{64}$/);
});

test("existing page, fragment, reference, multiline, encoded and absolute links suppress duplicates", () => {
  for (const link of [
    "[existing](ownership.md)",
    "[existing](./ownership.md#actual-section)",
    "[existing](/ownership)",
    "[existing](https://docs.bitsocial.net/ownership#actual-section)",
    "[existing](ownership%2Emd)",
    "[existing][own]\n\n[own]: ownership.md#section",
    "[existing](\n ownership.md\n)",
  ]) {
    assert.deepEqual(
      buildCandidates([source(link), target], { sources: ["docs/source.md"] }),
      [],
      link,
    );
  }
});

test("unsafe syntax and route ambiguity are omitted, and bad paths are rejected", () => {
  for (const text of [
    "# Title\n\n<Thing>\n\n" + prose + "\n</Thing>",
    "# Title\n\nAn inline <Thing>\n\n" + prose,
    "# Title\n\n{expression\n\n" + prose,
  ])
    assert.equal(extractDoc("docs/test.md", text).omitted, "embedded_markup");
  for (const field of ["slug: /elsewhere", "id: other", "draft: true # hidden"])
    assert.ok(extractDoc("docs/test.md", `---\n${field}\n---\n# Title\n\n${prose}`).omitted);
  assert.equal(extractDoc("docs/test.md", "---\nmissing close").omitted, "invalid_frontmatter");
  for (const file of [
    "docs/../secrets.md",
    "docs/i18n/private.md",
    "/tmp/test.md",
    "docs/test.mdx",
  ])
    assert.throws(() => extractDoc(file, prose), /invalid_document/);
  assert.throws(() => extractDoc("docs/test.md", "a".repeat(64001)), /invalid_document/);
  assert.equal(source("sk-" + "x".repeat(30)).omitted, "possible_secret");
});

test("shortlist excludes self links, repeated targets, overlapping spans and invalid limits", () => {
  const other = extractDoc(
    "docs/other.md",
    "# Community ownership\n\nCommunity ownership helps readers understand keys, communities and the authority of hosting services.",
  );
  const candidates = buildCandidates([source(), target, other], { sources: ["docs/source.md"] });
  assert.equal(candidates.length, 1);
  assert.notEqual(candidates[0].source, candidates[0].target);
  for (const maxCandidates of [0, 21, 1.1, NaN])
    assert.throws(
      () => buildCandidates([source(), target], { maxCandidates }),
      /invalid_selection/,
    );
  assert.throws(
    () => buildCandidates([source(), target], { sources: ["docs/missing.md"] }),
    /source_not_available/,
  );
});

test("offline execution touches neither credentials nor the provided client", async () => {
  const result = await suggestLinks([source(), target], {
    sources: ["docs/source.md"],
    client: {
      ask() {
        throw Error("network must not run");
      },
      stats() {
        throw Error("must not inspect client");
      },
    },
  });
  assert.equal(result.offline, true);
  assert.deepEqual(result.usage, { requests: 0 });
  assert.equal(result.items[0].status, "unverified");
  assert.equal(result.items[0].code, "offline");
  assert.equal(result.items[0].model, null);
  assert.match(result.rubricSha256, /^[a-f0-9]{64}$/);
});

test("live requests expose only bounded excerpts and never permit invented destinations", async () => {
  const client = fakeClient(choice("useful"), (body) => {
    assert.deepEqual(Object.keys(body.state).sort(), [
      "phrase",
      "sourceContext",
      "targetEvidence",
      "targetTitle",
    ]);
    assert.equal(body.state.sourceContext, prose);
    assert.ok(!JSON.stringify(body).includes("source.md"));
    assert.deepEqual(Object.keys(body.questions.relevance.criteria), [
      "useful",
      "not_useful",
      "uncertain",
    ]);
  });
  const result = await suggestLinks([source(), target], {
    live: true,
    client,
    sources: ["docs/source.md"],
  });
  assert.equal(result.advisory, true);
  assert.equal(result.items[0].status, "suggested");
  assert.equal(result.items[0].model, "jev-1.13.0");
  assert.equal(result.items[0].target, target.file);
  assert.equal(result.usage.requests, 1);
  const invalid = await suggestLinks([source(), target], {
    live: true,
    sources: ["docs/source.md"],
    client: fakeClient({ ...choice("useful"), choice: "https://evil.test" }),
  });
  assert.equal(invalid.items[0].status, "unverified");
  assert.equal(invalid.items[0].code, "invalid_response");
});

test("low probability, uncertainty, malformed responses and budget errors stay unverified", async () => {
  for (const answer of [
    choice("uncertain"),
    choice("useful", 0.6),
    { ...choice("useful"), probabilities: { useful: 1 } },
  ]) {
    const result = await suggestLinks([source(), target], {
      live: true,
      client: fakeClient(answer),
      sources: ["docs/source.md"],
    });
    assert.equal(result.items[0].status, "unverified");
  }
  const result = await suggestLinks([source(), target], {
    live: true,
    client: fakeClient(choice("useful"), () => assert.fail("must not send"), { maxInputTokens: 1 }),
    sources: ["docs/source.md"],
  });
  assert.equal(result.items[0].code, "budget_exhausted");
  assert.equal(result.usage.requests, 0);
  const rejected = await suggestLinks([source(), target], {
    live: true,
    client: fakeClient(choice("not_useful")),
    sources: ["docs/source.md"],
  });
  assert.equal(rejected.items[0].status, "rejected");
});

test("catalog confines reads to regular files in the supported directories", async (t) => {
  const repo = await fs.mkdtemp(path.join(os.tmpdir(), "docs-links-"));
  t.after(() => fs.rm(repo, { recursive: true, force: true }));
  await fs.mkdir(path.join(repo, "docs"));
  await fs.writeFile(path.join(repo, "docs/source.md"), source().text);
  await fs.symlink("source.md", path.join(repo, "docs/linked.md"));
  await fs.mkdir(path.join(repo, "docs/i18n"));
  await fs.writeFile(path.join(repo, "docs/i18n/private.md"), "not public input");
  assert.deepEqual(
    (await collectDocs(repo)).map((doc) => doc.file),
    ["docs/source.md"],
  );
  await fs.symlink("i18n", path.join(repo, "docs/apps"));
  await assert.rejects(collectDocs(repo), /symlink_document_directory/);
});

test("CLI dry run works with deliberately unusable credentials and writes no documentation", async () => {
  const { stdout } = await exec(process.execPath, ["scripts/jev/docs-links.mjs", "--limit", "3"], {
    cwd: new URL("../../../", import.meta.url),
    env: {
      ...process.env,
      JEV_CONFIG_FILE: "/does-not-exist/docs-link-config",
      TYPESAFE_API_KEY_FILE: "/does-not-exist/docs-link-key",
    },
  });
  const result = JSON.parse(stdout);
  assert.equal(result.items.length, 3);
  assert.equal(result.usage.requests, 0);
  assert.ok(result.items.every((item) => item.status === "unverified"));
});
