import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../update-translations.js", import.meta.url));
const translations = { en: "Hello", fr: "Bonjour", de: "Hallo" };

/** A workspace with one `greeting` key per language; the updater resolves it from the cwd. */
async function workspace(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "bitsocial-update-translations-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const [lang, greeting] of Object.entries(translations)) {
    await mkdir(path.join(dir, "public/translations", lang), { recursive: true });
    await writeFile(
      path.join(dir, "public/translations", lang, "default.json"),
      `${JSON.stringify({ greeting }, null, 2)}\n`,
    );
  }
  return dir;
}

async function greetings(dir) {
  const result = {};
  for (const lang of Object.keys(translations)) {
    const file = path.join(dir, "public/translations", lang, "default.json");
    result[lang] = JSON.parse(await readFile(file, "utf8")).greeting;
  }
  return result;
}

function run(dir, args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: "utf8" });
}

test("an empty --value is a usage error instead of blanking every locale", async (t) => {
  for (const args of [
    ["--key", "greeting", "--value", "--write"],
    ["--key", "greeting", "--value", "", "--write"],
  ]) {
    const dir = await workspace(t);
    const result = run(dir, args);
    assert.equal(result.status, 1, `${args.join(" ")} should fail`);
    assert.match(result.stderr, /--value/);
    assert.deepEqual(await greetings(dir), translations);
  }
});

test("an empty --map is a usage error instead of copying English into every locale", async (t) => {
  for (const args of [
    ["--key", "greeting", "--map", "--write"],
    ["--key", "greeting", "--map", "", "--include-en", "--write"],
  ]) {
    const dir = await workspace(t);
    const result = run(dir, args);
    assert.equal(result.status, 1, `${args.join(" ")} should fail`);
    assert.match(result.stderr, /--map/);
    assert.deepEqual(await greetings(dir), translations);
  }
});

test("a literal --value and the default copy from English still write every other locale", async (t) => {
  const literal = await workspace(t);
  assert.equal(run(literal, ["--key", "greeting", "--value", "Hi", "--write"]).status, 0);
  assert.deepEqual(await greetings(literal), { en: "Hello", fr: "Hi", de: "Hi" });

  const copied = await workspace(t);
  assert.equal(run(copied, ["--key", "greeting", "--write"]).status, 0);
  assert.deepEqual(await greetings(copied), { en: "Hello", fr: "Hello", de: "Hello" });
});
