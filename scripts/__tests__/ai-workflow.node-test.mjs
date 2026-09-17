import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { generatedFiles, listFiles, readFrontmatter } from "../ai-workflow-files.mjs";
import { validateWorkflow } from "../validate-ai-workflow.mjs";

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "bitsocial-web-workflow-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const relative of [
    ".agents",
    ".codex/config.toml",
    ".codex/hooks.json",
    ".codex/hooks",
    ".cursor/hooks.json",
    ".cursor/hooks",
    ".claude/settings.json",
    ".claude/hooks",
    "CLAUDE.md",
  ]) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(path.join(repository, relative), target, { recursive: true });
  }
  for (const [relative, content] of generatedFiles(root)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return root;
}

test("shared sources generate valid, deterministic harness outputs", (t) => {
  const root = fixture(t);
  const before = generatedFiles(root);
  assert.deepEqual(generatedFiles(root), before);
  const result = validateWorkflow(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.roles, 5);
  const codexTranslator = before.get(".codex/agents/translator.toml");
  assert.match(codexTranslator, /name = ['"]translator['"]/);
  assert.doesNotMatch(codexTranslator, /(?:^|\n)model\s*=/);
  for (const harness of ["claude", "cursor"]) {
    assert.equal(
      readFrontmatter(before.get(`.${harness}/agents/translator.md`)).metadata.model,
      undefined,
    );
  }
});

test("validation detects a missing agent and obsolete compatibility files", (t) => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, ".codex/agents/reviewer.toml"));
  fs.writeFileSync(path.join(root, ".cursor/agents/obsolete.md"), "old role");
  const errors = validateWorkflow(root).errors;
  assert.ok(errors.some((error) => error.includes("reviewer.toml")));
  assert.ok(errors.some((error) => error.includes("Obsolete generated file")));
});

test("validation rejects Stop mutations even when JSON parses", (t) => {
  const root = fixture(t);
  const file = path.join(root, ".codex/hooks.json");
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  config.hooks.Stop = [{ hooks: [{ type: "command", command: "git fetch --prune" }] }];
  fs.writeFileSync(file, JSON.stringify(config));
  assert.ok(validateWorkflow(root).errors.some((error) => error.includes("no Stop")));
});

test("manual invocation needs the documented Codex policy as well as Claude frontmatter", (t) => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, ".agents/skills/commit/agents/openai.yaml"));
  assert.ok(
    validateWorkflow(root).errors.some((error) =>
      error.includes("Manual skill needs Codex invocation policy"),
    ),
  );
});

test("unknown role metadata fails instead of silently changing model inheritance", (t) => {
  const root = fixture(t);
  const file = path.join(root, ".agents/roles/translator.md");
  const content = fs
    .readFileSync(file, "utf8")
    .replace("name: translator", "name: translator\nmodel: undocumented-model");
  fs.writeFileSync(file, content);
  assert.throws(() => generatedFiles(root), /Unsupported role field model/);
});

test("duplicate legacy skill roots fail validation", (t) => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, ".codex/skills"));
  assert.ok(validateWorkflow(root).errors.some((error) => error.includes("Duplicate skill root")));
});

test("logical paths use forward slashes and skill assets retain their bytes", (t) => {
  const root = fixture(t);
  const relative = ".agents/skills/commit/assets/example.bin";
  const bytes = Buffer.from([0, 255, 128, 13, 10]);
  fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
  fs.writeFileSync(path.join(root, relative), bytes);
  assert.ok(listFiles(root).includes(relative));
  const outputs = generatedFiles(root);
  assert.ok([...outputs.keys()].every((key) => !key.includes("\\")));
  assert.deepEqual(outputs.get(".claude/skills/commit/assets/example.bin"), bytes);
});

test("edit hooks and wrappers reject appended lifecycle commands", (t) => {
  const root = fixture(t);
  for (const harness of [".codex", ".claude", ".cursor"]) {
    const configPath = path.join(
      root,
      harness,
      harness === ".claude" ? "settings.json" : "hooks.json",
    );
    const original = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(original);
    const handler =
      harness === ".cursor" ? config.hooks.afterFileEdit[0] : config.hooks.PostToolUse[0].hooks[0];
    handler.command += "; git fetch --prune";
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.ok(
      validateWorkflow(root).errors.some((error) => error.includes("only its formatter wrapper")),
    );
    fs.writeFileSync(configPath, original);
    const wrapper = path.join(root, harness, "hooks/format.sh");
    const originalWrapper = fs.readFileSync(wrapper, "utf8");
    fs.appendFileSync(wrapper, "\ngit fetch --prune\n");
    assert.ok(
      validateWorkflow(root).errors.some((error) =>
        error.includes("only the shared formatter invocation"),
      ),
    );
    fs.writeFileSync(wrapper, originalWrapper);
  }
});

test("role sources reject model settings and invalid sandbox values", (t) => {
  const root = fixture(t);
  const file = path.join(root, ".agents/roles/translator.md");
  const original = fs.readFileSync(file, "utf8");
  for (const key of ["model", "model_reasoning_effort", "claude-model", "cursor-model"]) {
    fs.writeFileSync(
      file,
      original.replace("name: translator", `name: translator\n${key}: inherit`),
    );
    assert.throws(() => generatedFiles(root), /Unsupported role field/);
  }
  fs.writeFileSync(
    file,
    original.replace("name: translator", "name: translator\nsandbox-mode: false"),
  );
  assert.throws(() => generatedFiles(root), /Unsupported role sandbox/);
});

// These fake executables record the optional vendor helper's real subprocess argv;
// no authenticated CLI, model provider, or project source is invoked.
for (const provider of ["codex", "claude"]) {
  test(`Impeccable ${provider} copy runner inherits model and permissions unless explicitly configured`, async (t) => {
    const { runCopyEditBatchAgent } =
      await import("../../.agents/skills/impeccable/scripts/live-copy-edit-agent.mjs");
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "impeccable-runner-"));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    const bin = path.join(root, "bin");
    fs.mkdirSync(bin);
    const capture = path.join(root, "argv.json");
    fs.writeFileSync(
      path.join(bin, provider),
      `#!${process.execPath}\nconst fs = require('node:fs');\nconst args = process.argv.slice(2);\nfs.writeFileSync(process.env.ARGV_OUTPUT, JSON.stringify(args));\nconst result = JSON.stringify({status:'done', appliedEntryIds:[], failed:[], files:[], notes:[]});\nconst output = args.indexOf('--output-last-message');\nif (output >= 0) fs.writeFileSync(args[output + 1], result);\nelse process.stdout.write(result);\nprocess.stdin.resume();\n`,
      { mode: 0o755 },
    );
    const env = { PATH: bin, ARGV_OUTPUT: capture };
    const run = async (overrides = {}) => {
      await runCopyEditBatchAgent(
        { entries: [] },
        {
          provider,
          cwd: root,
          outDir: path.join(root, "out"),
          env: { ...env, ...overrides },
          timeoutMs: 5000,
        },
      );
      return JSON.parse(fs.readFileSync(capture, "utf8"));
    };
    const inherited = await run();
    assert.ok(!inherited.includes("--model"));
    assert.ok(!inherited.some((arg) => arg.startsWith("model_reasoning_effort=")));
    assert.ok(!inherited.includes("--dangerously-bypass-approvals-and-sandbox"));
    assert.ok(!inherited.includes("--permission-mode"));
    const selected = await run({
      IMPECCABLE_LIVE_COPY_AGENT_MODEL: "chosen-at-runtime",
      IMPECCABLE_LIVE_COPY_AGENT_EFFORT: "high",
    });
    assert.equal(selected[selected.indexOf("--model") + 1], "chosen-at-runtime");
    if (provider === "codex") assert.ok(selected.includes('model_reasoning_effort="high"'));
  });
}

test("LLM corpus checks follow current source headings and still reject missing coverage", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "llms-check-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const relative of [
    "scripts/check-llms-files.mjs",
    "about/src/lib/apps-data.ts",
    "chain/src/sections",
    "about/public/translations/en/default.json",
    "about/public/llms.txt",
    "about/public/llms-full.txt",
    "chain/public/llms.txt",
    "chain/public/llms-full.txt",
    "docs/static/llms.txt",
    "docs/static/llms-full.txt",
  ]) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(path.join(repository, relative), target, { recursive: true });
  }
  const run = () =>
    spawnSync(process.execPath, [path.join(root, "scripts/check-llms-files.mjs")], {
      encoding: "utf8",
    });
  assert.equal(run().status, 0);
  const translationsPath = path.join(root, "about/public/translations/en/default.json");
  const translations = JSON.parse(fs.readFileSync(translationsPath, "utf8"));
  const original = translations.browserPeer.title;
  const replacement = "A revised browser section heading.";
  translations.browserPeer.title = replacement;
  fs.writeFileSync(translationsPath, JSON.stringify(translations));
  for (const relative of ["about/public/llms-full.txt", "docs/static/llms-full.txt"]) {
    const target = path.join(root, relative);
    fs.writeFileSync(target, fs.readFileSync(target, "utf8").replaceAll(original, replacement));
  }
  assert.equal(run().status, 0, "copy changes should not require editing the checker");
  const corpus = path.join(root, "about/public/llms-full.txt");
  fs.writeFileSync(corpus, fs.readFileSync(corpus, "utf8").replaceAll(replacement, ""));
  const missingCoverage = run();
  assert.notEqual(missingCoverage.status, 0);
  assert.match(missingCoverage.stderr, /omits landing copy/);
  delete translations.browserPeer.title;
  fs.writeFileSync(translationsPath, JSON.stringify(translations));
  const missingTitle = run();
  assert.notEqual(missingTitle.status, 0);
  assert.match(missingTitle.stderr, /missing landing title: browserPeer.title/);
});

test("Impeccable context CLI keeps project facts while respecting session scope", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "impeccable-context-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "package.json"), '{"name":"context-fixture","version":"1.0.0"}');
  fs.writeFileSync(
    path.join(root, "PRODUCT.md"),
    "# Product\n\n## What it is\nA fixture catalog for testing the context helper.\n",
  );
  fs.writeFileSync(path.join(root, "DESIGN.md"), "# Design\n\nKeep the fixture catalog compact.\n");
  const script = path.join(repository, ".agents/skills/impeccable/scripts/context.mjs");
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
    env: { PATH: process.env.PATH, IMPECCABLE_NO_UPDATE_CHECK: "1", IMPECCABLE_CONTEXT_DIR: root },
    timeout: 5000,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /fixture catalog/);
  assert.match(result.stdout, /TASK_SCOPE:/);
  assert.match(result.stdout, /DELEGATION:/);
  assert.doesNotMatch(
    result.stdout,
    /AUTONOMY_DIRECTIVE_CHECK|SUBAGENT_AUTHORIZATION|probe once|is that request for the skill/,
  );
});
