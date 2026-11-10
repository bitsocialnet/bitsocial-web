import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createHookRunner, reactHooksStub } from "./hook-runner.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

const bundles = new Map();
let instances = 0;

/** A fresh module instance per call, so module-level caches start over. */
async function loadChainModule(file) {
  if (!bundles.has(file)) {
    const { outputFiles } = await build({
      entryPoints: [path.join(repoRoot, file)],
      alias: { "@": path.join(repoRoot, "chain/src") },
      bundle: true,
      format: "esm",
      jsx: "automatic",
      platform: "neutral",
      plugins: [reactHooksStub],
      write: false,
    });
    bundles.set(file, outputFiles[0].text);
  }
  instances += 1;
  const source = `${bundles.get(file)}\n// instance ${instances}\n`;
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
}

function replaceGlobal(t, name, value) {
  const original = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, value, writable: true });
  t.after(() => {
    if (original) {
      Object.defineProperty(globalThis, name, original);
    } else {
      delete globalThis[name];
    }
  });
}

/** A browser whose system scheme is `system`; `storage: null` blocks site data like a browser does. */
function chainBrowser(t, { system, storage = new Map() }) {
  const darkClass = { value: null };
  const window = {
    matchMedia: (query) => ({ matches: query.includes(system) }),
  };
  Object.defineProperty(window, "localStorage", {
    get() {
      if (!storage) {
        throw new DOMException("The operation is insecure.", "SecurityError");
      }
      return {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
      };
    },
  });
  replaceGlobal(t, "window", window);
  replaceGlobal(t, "document", {
    documentElement: {
      classList: {
        toggle: (name, force) => {
          assert.equal(name, "dark");
          darkClass.value = force;
        },
      },
    },
  });
  return { darkClass, storage };
}

test("the chain theme renders when the browser blocks site data", async (t) => {
  const { darkClass } = chainBrowser(t, { system: "light", storage: null });
  const { ThemeProvider } = await loadChainModule("chain/src/lib/useTheme.tsx");
  const runner = createHookRunner(() => ThemeProvider({ children: null }));

  const context = runner.render().props.value;
  assert.equal(context.theme, "light");
  assert.equal(darkClass.value, false);

  context.toggle();
  assert.equal(runner.render().props.value.theme, "dark");
  assert.equal(darkClass.value, true);
});

test("the chain theme follows the system until the reader picks one", async (t) => {
  const { darkClass, storage } = chainBrowser(t, { system: "light" });
  const { ThemeProvider } = await loadChainModule("chain/src/lib/useTheme.tsx");
  const runner = createHookRunner(() => ThemeProvider({ children: null }));

  assert.equal(runner.render().props.value.theme, "light");
  assert.equal(darkClass.value, false);
  assert.equal(storage.has("bso-theme"), false, "a theme nobody chose is not stored");

  runner.render().props.value.toggle();
  assert.equal(runner.render().props.value.theme, "dark");
  assert.equal(storage.get("bso-theme"), "dark");
  assert.equal(darkClass.value, true);
});

test("a stored chain theme wins over the system", async (t) => {
  chainBrowser(t, { system: "light", storage: new Map([["bso-theme", "dark"]]) });
  const { ThemeProvider } = await loadChainModule("chain/src/lib/useTheme.tsx");
  const runner = createHookRunner(() => ThemeProvider({ children: null }));

  assert.equal(runner.render().props.value.theme, "dark");
});
