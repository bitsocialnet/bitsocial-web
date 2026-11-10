import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, writeFile, rm, chmod, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { JevError } from "./client.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Every process below `pids`, read from the process table: playwright-cli detaches its daemon, so
// it is outside the wrapper's process group but still the client's child.
async function descendantsOf(...pids) {
  let table;
  try {
    ({ stdout: table } = await promisify(execFile)("ps", ["-A", "-o", "pid=,ppid="]));
  } catch {
    return [];
  }
  const children = new Map();
  for (const line of table.trim().split("\n")) {
    const [child, parent] = line.trim().split(/\s+/).map(Number);
    children.set(parent, [...(children.get(parent) ?? []), child]);
  }
  const found = pids.flatMap((pid) => children.get(pid) ?? []);
  for (let index = 0; index < found.length; index++)
    found.push(...(children.get(found[index]) ?? []));
  return found;
}

// pw-session.sh runs `playwright-cli open` in the foreground and passes no signal on, so a timeout
// that killed only the wrapper left the browser launching after close() had released the slot. A
// timeout now signals the wrapper and every process below it, the detached daemon included. The
// command settles once the wrapper and the playwright-cli client have exited and closed the output
// pipes. The detached daemon does not hold them, but the client waits for a daemon that is still
// launching, so the launch has then stopped or finished and is closable. A daemon that was already
// listening may still be shutting down when close() runs. `killAfter` ms after the SIGTERM, the
// processes signalled then and anything started below them since are killed.
export function runCommand(file, args, { timeout, maxBuffer, killAfter = 20_000, ...options }) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    const output = { stdout: "", stderr: "" };
    let killed = false,
      settled = false,
      timer;
    const killAll = (pids, name) => {
      for (const pid of pids) {
        try {
          process.kill(pid, name);
        } catch {
          // Already exited.
        }
      }
    };
    const stop = async () => {
      if (killed) return;
      killed = true;
      clearTimeout(timer);
      const pids = [...(await descendantsOf(child.pid)), child.pid];
      if (settled) return;
      killAll(pids, "SIGTERM");
      // A process that ignores SIGTERM must neither hold cleanup up for good nor outlive it.
      timer = setTimeout(async () => {
        killAll([...(await descendantsOf(...pids)), ...pids], "SIGKILL");
        child.stdout.destroy();
        child.stderr.destroy();
      }, killAfter);
    };
    timer = setTimeout(stop, timeout);
    for (const name of ["stdout", "stderr"]) {
      child[name].setEncoding("utf8");
      child[name].on("data", (chunk) => {
        output[name] += chunk;
        if (output[name].length > maxBuffer) stop();
      });
    }
    child.on("error", (error) => {
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    // "close" waits for every process still holding the output pipes, the wrapper's
    // playwright-cli client included.
    child.on("close", (code, signal) => {
      settled = true;
      clearTimeout(timer);
      if (code === 0 && !killed) resolve(output);
      else
        reject(
          Object.assign(new Error(`${path.basename(file)} exited with ${signal ?? code}`), {
            ...output,
            code,
            signal,
            killed,
          }),
        );
    });
  });
}
const locatorCode = `function locate(target) {
  let parent = page;
  if (target.within) parent = page.getByRole(target.within.role, {name: target.within.name, exact: true});
  let locator = parent.getByRole(target.role, {name: target.name, exact: true});
  if (target.nth !== undefined) locator = locator.nth(target.nth);
  return locator;
}`;

// Shared by both transports: combining observations must not change assertion semantics.
const assertionCode = (assertions) => `${locatorCode}
  const assertions = ${JSON.stringify(assertions)};
  const results = [];
  for (const assertion of assertions) {
    try {
      if (assertion.type === 'url') { results.push(page.url() === assertion.equals); continue; }
      if (assertion.type === 'bodyClass') {
        const has = await page.locator('body').evaluate((element, value) => element.classList.contains(value), assertion.value);
        results.push(has === assertion.present); continue;
      }
      const locator = locate(assertion);
      const count = await locator.count();
      if (assertion.state === 'hidden') { results.push(count === 0 || (count === 1 && !await locator.isVisible())); continue; }
      if (count !== 1 || !await locator.isVisible()) { results.push(false); continue; }
      if (assertion.state === 'visible') results.push(true);
      else if (assertion.state === 'checked') results.push(await locator.isChecked());
      else if (assertion.state === 'unchecked') results.push(!await locator.isChecked());
      else if (assertion.state === 'value') results.push(await locator.inputValue() === assertion.equals);
      else if (assertion.state === 'text') results.push(await locator.innerText() === assertion.equals);
      else results.push(false);
    } catch { results.push(false); }
  }`;

// Playwright CLI's run-code VM omits URL. Requests are already canonical absolute URLs;
// use the exact origin boundary there, and evaluate location/relative URLs inside the page.
export const canonicalNavigationAllowed = (requestUrl, origin) =>
  requestUrl.startsWith(origin + "/");
export const browserOriginGuard = (origin) =>
  `if (await page.evaluate(() => location.origin) !== ${JSON.stringify(origin)}) throw new Error('origin_changed');`;

export async function findPlaywrightCli() {
  const override = process.env.PLAYWRIGHT_CLI_BIN;
  if (override) return /[/\\]/.test(override) ? path.resolve(process.cwd(), override) : override;
  for (const relative of [
    "node_modules/.bin/playwright-cli",
    "webui/node_modules/.bin/playwright-cli",
    "packages/admin/node_modules/.bin/playwright-cli",
  ]) {
    const candidate = path.join(root, relative);
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* Try the next installed surface. */
    }
  }
  // PATH lookup only; this never uses npx or installs packages.
  return "playwright-cli";
}

export function createPlaywrightDriver({ execute = runCommand } = {}) {
  const session = `jev-${process.pid}-${randomBytes(4).toString("hex")}`;
  let directory,
    cli,
    plan,
    started,
    combinedObservation = false,
    opening = false;
  const childEnv = { ...process.env };
  delete childEnv.TYPESAFE_API_KEY;
  delete childEnv.TYPESAFE_API_KEY_FILE;
  delete childEnv.JEV_CONFIG_FILE;
  delete childEnv.JEV_MODEL;
  async function command(args, wrapper = false, cleanup = false) {
    const remaining = cleanup ? 15_000 : plan.limits.deadlineMs - (Date.now() - started);
    if (remaining <= 0) throw new JevError("deadline_exceeded");
    try {
      const result = await execute(wrapper ? path.join(root, "scripts/pw-session.sh") : cli, args, {
        cwd: directory,
        env: { ...childEnv, PLAYWRIGHT_CLI_BIN: cli },
        timeout: Math.min(remaining, 30_000),
        maxBuffer: 512_000,
      });
      if (
        cleanup &&
        /^pw-session: warning: closing browser .* exited \d+/m.test(result.stderr || "")
      )
        throw new JevError("cleanup_failed");
      if (/^### Error/m.test(result.stdout)) throw new JevError("browser_command_failed");
      return result.stdout;
    } catch (error) {
      if (error.code === 75) {
        opening = false;
        throw new JevError("browser_slot_busy");
      }
      if (error instanceof JevError) throw error;
      throw new JevError(error.killed ? "browser_command_timeout" : "browser_command_failed");
    }
  }
  async function code(body, cleanup = false) {
    const output = await command(
      [`-s=${session}`, "run-code", `async page => { ${body} }`],
      false,
      cleanup,
    );
    const match = output.match(/### Result\s*\n([\s\S]*?)(?=\n### |$)/);
    if (!match) throw new JevError("browser_result_missing");
    try {
      return JSON.parse(match[1].trim());
    } catch {
      throw new JevError("browser_result_invalid");
    }
  }
  function guard() {
    return browserOriginGuard(plan.origin);
  }
  return {
    get adapterMode() {
      return combinedObservation ? "combined-aria" : "snapshot-command";
    },
    async open(validatedPlan) {
      plan = validatedPlan;
      started = Date.now();
      cli = await findPlaywrightCli();
      directory = await mkdtemp(path.join(tmpdir(), "bitsocial-jev-browser-"));
      await chmod(directory, 0o700);
      const config = path.join(directory, "config.json");
      await writeFile(
        config,
        JSON.stringify({
          browser: {
            isolated: true,
            launchOptions: { chromiumSandbox: true },
            contextOptions: { serviceWorkers: "block" },
          },
          outputDir: directory,
        }),
        { mode: 0o600 },
      );
      opening = true;
      // Start blank so navigation guards exist before the plan URL is visited.
      await command(
        ["open", session, "about:blank", "--browser=chrome", `--config=${config}`],
        true,
      );
      const capabilities = await code(`
        const origin = ${JSON.stringify(plan.origin)};
        const navigationAllowed = ${canonicalNavigationAllowed.toString()};
        page.setDefaultTimeout(4000);
        page.setDefaultNavigationTimeout(10000);
        await page.addInitScript(() => { window.__NO_DEV_TOOLBAR__ = true; window.__VISUAL_TESTING__ = true; });
        await page.context().route('**/*', async route => {
          const request = route.request();
          if (request.isNavigationRequest() && request.frame().parentFrame() === null && !navigationAllowed(request.url(), origin)) await route.abort();
          else await route.continue();
        });
        page.context().on('page', popup => { if (popup !== page) void popup.close(); });
        await page.goto(${JSON.stringify(plan.url)}, {waitUntil: 'domcontentloaded'});
        return {ariaSnapshot: typeof page.ariaSnapshot === 'function'};
      `);
      combinedObservation = capabilities?.ariaSnapshot === true;
    },
    async observe(assertions = []) {
      if (combinedObservation) {
        const observation = await code(`${guard()}
          const snapshot = await page.ariaSnapshot({mode: 'ai'});
          ${assertionCode(assertions)}
          ${guard()} return {url: page.url(), snapshot, assertions: results};`);
        // A method can exist on an older installation without supporting AI mode.
        // Default ARIA output has roles but no actionable refs. Preserve the CLI's
        // supported serialization in that case; other failures still fail closed.
        if (
          typeof observation.snapshot !== "string" ||
          !/(?:^|\n)\s*-\s+(?!text:)[a-z]/.test(observation.snapshot) ||
          /\[ref=[a-zA-Z0-9_-]+\]/.test(observation.snapshot)
        )
          return observation;
        combinedObservation = false;
      }
      // Older installed CLIs keep their supported snapshot command. Never substitute
      // a ref-less default ARIA snapshot or silently retry a failing combined call.
      const snapshotFile = path.join(directory, "snapshot.yml");
      await command([`-s=${session}`, "snapshot", `--filename=${snapshotFile}`]);
      const result = await code(
        `${guard()} ${assertionCode(assertions)} ${guard()} return {url: page.url(), assertions: results};`,
      );
      return { ...result, snapshot: await readFile(snapshotFile, "utf8") };
    },
    async act(action) {
      const result = await code(`
        ${guard()} ${locatorCode}
        const action = ${JSON.stringify(action)};
        const expected = locate(action);
        const current = page.locator('aria-ref=' + action.ref);
        if (await expected.count() !== 1 || await current.count() !== 1 || !await current.isVisible() || !await current.isEnabled()) return false;
        const expectedElement = await expected.elementHandle();
        if (!await current.evaluate((element, expectedElement) => element === expectedElement, expectedElement)) return false;
        const hrefAllowed = await current.evaluate((element, origin) => {
          const href = element.getAttribute('href');
          return !href || new URL(href, location.href).origin === origin;
        }, ${JSON.stringify(plan.origin)});
        if (!hrefAllowed) return false;
        if (action.op === 'click') await current.click();
        else if (action.op === 'fill') await current.fill(action.value);
        else if (action.op === 'select') await current.selectOption({label: action.value});
        else if (action.op === 'check') await current.check();
        else if (action.op === 'uncheck') await current.uncheck();
        else return false;
        ${guard()} return true;
      `);
      if (result !== true) throw new JevError("stale_or_blocked_target");
    },
    async assert(assertions) {
      return code(`${guard()} ${assertionCode(assertions)} return results;`);
    },
    async text(target) {
      return code(`${guard()} ${locatorCode} const locator = locate(${JSON.stringify(target)});
        if (await locator.count() !== 1 || !await locator.isVisible()) return null;
        return locator.innerText();`);
    },
    async reload() {
      await code(`${guard()} await page.reload({waitUntil: 'domcontentloaded'}); return true;`);
    },
    async close() {
      try {
        if (opening) await command(["close", session], true, true);
      } finally {
        if (directory) await rm(directory, { recursive: true, force: true });
      }
    },
  };
}
