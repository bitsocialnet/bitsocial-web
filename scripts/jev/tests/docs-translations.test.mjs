import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadDocPairs, main } from "../docs-translations.mjs";

test("documentation pairs use explicit source paths and preserve whole-page context", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "docs-qa-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const target = path.join(root, "docs/i18n/it/docusaurus-plugin-content-docs/current");
  await fs.mkdir(target, { recursive: true });
  await fs.writeFile(path.join(root, "docs/page.md"), "# Local only\nNot global.");
  await fs.writeFile(path.join(target, "page.md"), "# Solo locale\nNon globale.");
  const [pair] = await loadDocPairs(root, ["it"], ["page.md"]);
  assert.equal(pair.key, "page.md");
  assert.equal(pair.source, "# Local only\nNot global.");
  assert.equal(pair.translation, "# Solo locale\nNon globale.");
  for (const [locales, paths] of [
    [[], ["page.md"]],
    [["it"], []],
    [["../it"], ["page.md"]],
    [["it"], ["../page.md"]],
    [["en"], ["page.md"]],
  ]) {
    await assert.rejects(loadDocPairs(root, locales, paths));
  }
  await fs.writeFile(path.join(root, "docs/large.md"), "a".repeat(24_001));
  await assert.rejects(loadDocPairs(root, ["it"], ["large.md"]), /24 KB/);
  await fs.writeFile(path.join(root, "outside.md"), "outside");
  await fs.symlink(path.join(root, "outside.md"), path.join(root, "docs/escape.md"));
  await assert.rejects(loadDocPairs(root, ["it"], ["escape.md"]), /escapes/);
});

test("a structural checker failure blocks live inference", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "docs-qa-block-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const target = path.join(root, "docs/i18n/it/docusaurus-plugin-content-docs/current");
  await fs.mkdir(target, { recursive: true });
  await fs.mkdir(path.join(root, "scripts"));
  await fs.writeFile(path.join(root, "docs/page.md"), "Local only.");
  await fs.writeFile(path.join(target, "page.md"), "Solo locale.");
  await fs.writeFile(
    path.join(root, "scripts/check-docs-translations.py"),
    "raise SystemExit(1)\n",
  );
  const fetch = t.mock.method(globalThis, "fetch", () => {
    throw new Error("Provider must not run");
  });
  await assert.rejects(
    main(["--locales", "it", "--paths", "page.md", "--live", "--model", "jev-1.13.0"], root),
  );
  assert.equal(fetch.mock.callCount(), 0);
});
