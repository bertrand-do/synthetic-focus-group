#!/usr/bin/env node
// fix-shots.mjs: scripted verification of focus-group fixes, with screenshots as evidence.
//
// After a panel finds problems and the team fixes them, write one named check per fix. Each check
// opens a route of your LOCAL dev server with the API mocked in the browser (request interception),
// drives the UI, asserts what a buyer should now see, and takes screenshots. Results go to
// <out>/results.json, screenshots to <out>/<name>.png. The point: a fix is "verified" by a terminal
// state on screen plus an assertion, not by the presence of code.
//
// Usage:
//   node fix-shots.mjs --checks ./my-checks.mjs --base http://localhost:5173 --out ./fix-shots [--only a,b]
//   node fix-shots.mjs --self-test --out ./fix-shots-selftest
//
// Options (CLI flag > environment variable > --config JSON > default):
//   --checks <file>     FIX_CHECKS        module exporting `default async function (kit)` (see below)
//   --base <url>        FIX_BASE          local dev server (default http://localhost:5173)
//   --out <dir>         FIX_OUT           evidence folder (default ./fix-shots)
//   --only <a,b>                          run only these check names
//   --chrome <path>     CHROME_PATH       Chrome executable (default: macOS Google Chrome)
//   --api-prefix <p>    FIX_API_PREFIX    path prefix that is mocked (default /api/)
//   --stale-words <re>  FIX_STALE_WORDS   regex for words that must not appear (e.g. a retired name)
//   --allow-remote                        allow a non-localhost base (read-only checks only; off by default)
//   --config <file>                       JSON with any of: checks, base, out, apiPrefix, staleWords,
//                                         allowHosts (array of hosts allowed to load), session ({key, value})
//
// A checks module receives `kit` = { check, open, shot, text, waitText, clickText, sweep, assert, out, base, config }:
//
//   export default async function ({ check, open, shot, waitText, clickText, assert }) {
//     await check("1a-clear-error-no-retry", async () => {
//       const { page, calls } = await open("/form", {
//         api: (pathname, body, method) => pathname === "/api/save"
//           ? [422, { error: "That name is already taken.", retryable: false }] : null,
//       });
//       await clickText(page, "Save");
//       await waitText(page, "already taken");
//       assert.equal(calls.filter((c) => c.path === "/api/save").length, 1, "exactly one call, no silent retry");
//       const overflow = await shot(page, "1a-clear-error");
//       await page.close();
//       return { overflow };
//     });
//   }
//
// open(route, { api, width, height, session, fullyOffline }) returns { page, calls }.
//   api(pathname, body, method) returns [status, json] to mock a call, or null for the default ({}).
//   session = { key, value } is written to localStorage before the app loads (fake signed-in state).
// shot(page, name, { fullPage }) saves <name>.png and returns true when the page scrolls sideways.
// sweep(name, route, options) returns the lines that match --stale-words, with a full-page shot.
//
// Chrome always runs headless ("new" mode). puppeteer-core must be importable; otherwise set
// PUPPETEER_CORE_FROM to a project directory whose node_modules contains it.

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_CHROME = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
  win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}[process.platform];

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
const has = (name) => argv.includes(`--${name}`);
const fileConfig = flag("config") ? JSON.parse(await readFile(flag("config"), "utf8")) : {};
const pick = (name, env, key, fallback) => flag(name) ?? process.env[env] ?? fileConfig[key] ?? fallback;

const selfTest = has("self-test");
const out = path.resolve(pick("out", "FIX_OUT", "out", selfTest ? "fix-shots-selftest" : "fix-shots"));
const only = flag("only")?.split(",") ?? null;
const chrome = pick("chrome", "CHROME_PATH", "chrome", DEFAULT_CHROME);
const apiPrefix = pick("api-prefix", "FIX_API_PREFIX", "apiPrefix", "/api/");
const staleSource = pick("stale-words", "FIX_STALE_WORDS", "staleWords", selfTest ? "retired name|legacy wording" : null);
const staleWords = staleSource ? new RegExp(staleSource, "i") : null;
const allowHosts = new Set(fileConfig.allowHosts ?? []);
const defaultSession = fileConfig.session ?? null;

let server = null;
let base = pick("base", "FIX_BASE", "base", "http://localhost:5173");
if (selfTest) ({ server, base } = await startSelfTestServer());

const host = new URL(base).hostname;
if (!["localhost", "127.0.0.1", "[::1]"].includes(host) && !has("allow-remote")) {
  throw new Error(`Checks must run against a local dev server, not ${host}. Pass --allow-remote only for read-only checks.`);
}
if (!chrome || !existsSync(chrome)) throw new Error(`Chrome not found at "${chrome}". Set CHROME_PATH or pass --chrome.`);

async function loadPuppeteer() {
  try {
    const mod = await import("puppeteer-core");
    return mod.default ?? mod;
  } catch {
    const from = process.env.PUPPETEER_CORE_FROM;
    if (!from) throw new Error("puppeteer-core is not installed here. npm i puppeteer-core, or set PUPPETEER_CORE_FROM.");
    const resolved = createRequire(path.join(path.resolve(from), "noop.js")).resolve("puppeteer-core");
    const mod = await import(pathToFileURL(resolved).href);
    return mod.default ?? mod;
  }
}

const puppeteer = await loadPuppeteer();
const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-first-run", "--no-default-browser-check"] });
await mkdir(out, { recursive: true });
const results = [];
const baseOrigin = new URL(base).origin;

// ---- the kit -----------------------------------------------------------------------------------

async function open(route, { api = () => null, width = 1440, height = 900, session = defaultSession } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.setRequestInterception(true);
  const calls = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    const json = (body, status = 200) => request.respond({
      status, contentType: "application/json",
      headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*" },
      body: JSON.stringify(body),
    });
    if (url.origin === baseOrigin && url.pathname.startsWith(apiPrefix)) {
      let body = {};
      try { body = request.postData() ? JSON.parse(request.postData()) : {}; } catch { body = { raw: request.postData() }; }
      calls.push({ path: url.pathname, method: request.method(), body });
      const custom = api(url.pathname, body, request.method());
      if (custom) return json(custom[1], custom[0]);
      return json({});
    }
    if (url.origin === baseOrigin || allowHosts.has(url.hostname) || url.protocol === "data:") return request.continue();
    // Everything else (analytics, auth providers, third-party APIs) is answered empty: no real network.
    return request.respond({ status: 204, body: "" });
  });
  if (session?.key) {
    await page.evaluateOnNewDocument((key, value) => localStorage.setItem(key, value), session.key,
      typeof session.value === "string" ? session.value : JSON.stringify(session.value));
  }
  await page.goto(new URL(route, base).href, { waitUntil: "networkidle0", timeout: 30_000 });
  return { page, calls };
}

const text = (page) => page.evaluate(() => document.body.innerText);
async function waitText(page, needle, timeout = 25_000) {
  await page.waitForFunction((value) => document.body.innerText.includes(value), { timeout }, needle);
}
async function shot(page, name, { fullPage = false } = {}) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage });
  return overflow;
}
async function clickText(page, label) {
  const handle = await page.evaluateHandle((value) =>
    [...document.querySelectorAll("button, a, [role=button]")].find((element) => element.textContent?.trim() === value) ?? null, label);
  const element = handle.asElement();
  if (!element) throw new Error(`No button or link "${label}"`);
  await element.click();
}
async function sweep(name, route, options = {}) {
  if (!staleWords) throw new Error("sweep needs --stale-words (or staleWords in the config).");
  const { page } = await open(route, options);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const hits = (await text(page)).split("\n").filter((line) => staleWords.test(line));
  await shot(page, name, { fullPage: true });
  await page.close();
  return hits;
}
async function check(name, run) {
  if (only && !only.includes(name)) return;
  try {
    const detail = await run();
    results.push({ name, ok: true, ...(detail ?? {}) });
    console.log(`ok      ${name}${detail ? ` ${JSON.stringify(detail)}` : ""}`);
  } catch (error) {
    results.push({ name, ok: false, error: String(error?.message ?? error) });
    for (const page of await browser.pages()) {
      if (page.url().startsWith(base)) console.log(`  page ${page.url()}: ${(await text(page).catch(() => "")).replace(/\n+/g, " | ").slice(0, 600)}`);
    }
    console.log(`FAIL    ${name}: ${String(error?.message ?? error).slice(0, 400)}`);
  }
}

const kit = { check, open, shot, text, waitText, clickText, sweep, assert, out, base, config: fileConfig };

// ---- run ---------------------------------------------------------------------------------------

try {
  if (selfTest) {
    await selfTestChecks(kit);
  } else {
    const checksFile = pick("checks", "FIX_CHECKS", "checks", null);
    if (!checksFile) throw new Error("Pass --checks <file.mjs> (or --self-test).");
    const mod = await import(pathToFileURL(path.resolve(checksFile)).href);
    await (mod.default ?? mod.run)(kit);
  }
} finally {
  await browser.close();
  server?.close();
}
const failed = results.filter((result) => !result.ok);
await writeFile(path.join(out, "results.json"), `${JSON.stringify({ base, ranAt: new Date().toISOString(), results }, null, 2)}\n`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed. Evidence: ${out}`);
if (failed.length) process.exitCode = 1;

// ---- self-test: a tiny local app that shows an API error message --------------------------------

async function startSelfTestServer() {
  const html = `<!doctype html><meta charset="utf-8"><title>Self-test app</title>
<style>body{font:16px system-ui;margin:24px;max-width:640px} .card{border:1px solid #ccc;border-radius:8px;padding:16px}</style>
<div class="card"><h1>Settings</h1><p id="status">Ready.</p><button id="go">Save</button></div>
<script>
document.getElementById("go").onclick = async () => {
  const res = await fetch("/api/save", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "test" }) });
  const data = await res.json();
  document.getElementById("status").textContent = res.ok ? "Saved." : data.error;
  if (!res.ok && data.retryable) { const b = document.createElement("button"); b.textContent = "Try again"; document.querySelector(".card").append(b); }
};
</script>`;
  const srv = http.createServer((req, res) => {
    if (req.url.startsWith("/api/")) { res.writeHead(500, { "content-type": "application/json" }); return res.end('{"error":"real API should be mocked"}'); }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  });
  await new Promise((resolve) => srv.listen(0, "127.0.0.1", resolve));
  return { server: srv, base: `http://127.0.0.1:${srv.address().port}` };
}

async function selfTestChecks({ check, open, shot, waitText, clickText, sweep, assert }) {
  await check("selftest-1-clear-error-no-retry", async () => {
    const { page, calls } = await open("/", {
      api: (pathname) => pathname === "/api/save" ? [422, { error: "That name is already taken. Nothing was saved.", retryable: false }] : null,
    });
    await clickText(page, "Save");
    await waitText(page, "already taken");
    const body = await page.evaluate(() => document.body.innerText);
    assert.ok(!body.includes("Try again"), "no retry button on a permanent refusal");
    assert.equal(calls.filter((call) => call.path === "/api/save").length, 1, "exactly one call");
    const overflow = await shot(page, "selftest-1-error-1440");
    await page.setViewport({ width: 390, height: 844 });
    const overflowMobile = await shot(page, "selftest-1-error-390");
    await page.close();
    return { overflow, overflowMobile };
  });
  await check("selftest-2-stale-word-sweep", async () => {
    const hits = await sweep("selftest-2-sweep", "/");
    assert.deepEqual(hits, [], `stale wording found: ${hits.join(" / ")}`);
  });
}
