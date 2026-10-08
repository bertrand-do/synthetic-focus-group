#!/usr/bin/env node
// browse.mjs: a small, stateless browser CLI for persona agents in a synthetic focus group.
//
// Every command launches headless Chrome with the persona's own profile directory, does one short
// thing, saves evidence (numbered PNG screenshots and/or innerText dumps) and exits. Cookies and
// local storage persist in the profile between commands, so a login survives from one command to
// the next. The last visited URL is remembered in <out>/.last-url so `shot`, `click`, `type` and
// `text` can work on "the current page".
//
// Commands:
//   goto  <url> <name> [scrolls]    open the URL, screenshot the top, then scroll by 0.9 viewport
//                                   `scrolls` times (default 0) with a screenshot after each
//   text  [url] [name]              dump document.body.innerText to <NN>-<name>.txt (default: current page)
//   shot  <name> [--full]           screenshot the current page (optionally full page)
//   click <visible text> [name]     click the first button/link/[role=button] whose text matches, then screenshot
//   type  <css selector> <text> [name] [--enter]   type into a field, optionally press Enter, then screenshot
//   wait  <visible text> [seconds]  wait for text to appear (capped at 45 s), then screenshot
//
// Options (CLI flag > environment variable > --config JSON file > default):
//   --out <dir>        BROWSE_OUT       where evidence is written            (default ./focus-evidence)
//   --profile <dir>    BROWSE_PROFILE   Chrome userDataDir for this persona  (default <out>/.profile)
//   --chrome <path>    CHROME_PATH      Chrome executable                    (default: macOS Google Chrome)
//   --width <px>       BROWSE_WIDTH     viewport width                       (default 1440)
//   --height <px>      BROWSE_HEIGHT    viewport height                      (default 900)
//   --mobile                            shorthand for a 390 x 844 viewport
//   --base <url>       BROWSE_BASE      base for relative URLs, e.g. https://app.example.com
//   --config <file>                     JSON with any of: out, profile, chrome, width, height, base, chromeArgs
//                      BROWSE_CHROME_ARGS  extra Chrome switches, separated by "||"
//
// puppeteer-core must be importable. If it is not installed next to this script, set
// PUPPETEER_CORE_FROM to any project directory whose node_modules contains puppeteer-core.
//
// Rules this script enforces: Chrome always runs headless ("new" mode), and every command is
// killed after 55 seconds so an agent never blocks longer than a minute. Poll with repeated short
// commands instead of one long wait.

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HARD_LIMIT_MS = 55_000;
const killer = setTimeout(() => {
  console.error(`browse.mjs: stopped after ${HARD_LIMIT_MS / 1000}s so the caller never blocks. Poll again with a short command.`);
  process.exit(124);
}, HARD_LIMIT_MS);
killer.unref();

const DEFAULT_CHROME = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
  win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}[process.platform];

// ---- argument parsing --------------------------------------------------------------------------

const raw = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < raw.length; i += 1) {
  const token = raw[i];
  if (["--full", "--mobile", "--enter"].includes(token)) flags[token.slice(2)] = true;
  else if (token.startsWith("--")) { flags[token.slice(2)] = raw[i + 1]; i += 1; }
  else positional.push(token);
}

let fileConfig = {};
if (flags.config) fileConfig = JSON.parse(await readFile(flags.config, "utf8"));
const pick = (flag, env, key, fallback) => flags[flag] ?? process.env[env] ?? fileConfig[key] ?? fallback;

const out = path.resolve(pick("out", "BROWSE_OUT", "out", "focus-evidence"));
const profile = path.resolve(pick("profile", "BROWSE_PROFILE", "profile", path.join(out, ".profile")));
const chrome = pick("chrome", "CHROME_PATH", "chrome", DEFAULT_CHROME);
const base = pick("base", "BROWSE_BASE", "base", null);
const width = Number(flags.mobile ? 390 : pick("width", "BROWSE_WIDTH", "width", 1440));
const height = Number(flags.mobile ? 844 : pick("height", "BROWSE_HEIGHT", "height", 900));

const extraArgs = (process.env.BROWSE_CHROME_ARGS ? process.env.BROWSE_CHROME_ARGS.split("||") : fileConfig.chromeArgs ?? [])
  .map((arg) => arg.trim()).filter(Boolean);

const [command, ...rest] = positional;
const usage = "usage: browse.mjs <goto|text|shot|click|type|wait> ... (see the header of this file)";
if (!command) { console.error(usage); process.exit(2); }
if (!chrome || !existsSync(chrome)) {
  console.error(`Chrome not found at "${chrome}". Set CHROME_PATH or pass --chrome.`);
  process.exit(2);
}

// ---- helpers -----------------------------------------------------------------------------------

async function loadPuppeteer() {
  try {
    const mod = await import("puppeteer-core");
    return mod.default ?? mod;
  } catch (error) {
    const from = process.env.PUPPETEER_CORE_FROM;
    if (!from) throw new Error("puppeteer-core is not installed here. npm i puppeteer-core, or set PUPPETEER_CORE_FROM to a project that has it.");
    const resolved = createRequire(path.join(path.resolve(from), "noop.js")).resolve("puppeteer-core");
    const mod = await import(pathToFileURL(resolved).href);
    return mod.default ?? mod;
  }
}

const lastUrlFile = path.join(out, ".last-url");
async function currentUrl() {
  if (!existsSync(lastUrlFile)) throw new Error("No current page yet. Run `goto <url> <name>` first.");
  return (await readFile(lastUrlFile, "utf8")).trim();
}
function resolveUrl(url) {
  if (/^https?:\/\//i.test(url) || url.startsWith("file:")) return url;
  if (!base) throw new Error(`Relative URL "${url}" needs --base or BROWSE_BASE.`);
  return new URL(url, base).href;
}
const safe = (name) => String(name).replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "page";

// Evidence files are numbered in the order they are taken: 01-home.png, 02-pricing.txt ...
async function nextNumber() {
  const files = existsSync(out) ? await readdir(out) : [];
  const numbers = files.map((file) => Number(/^(\d+)-/.exec(file)?.[1] ?? 0));
  return String(Math.max(0, ...numbers) + 1).padStart(2, "0");
}

const saved = [];
async function screenshot(page, name, fullPage = false) {
  const file = path.join(out, `${await nextNumber()}-${safe(name)}.png`);
  await page.screenshot({ path: file, fullPage });
  saved.push(file);
  return file;
}
async function dumpText(page, name) {
  const file = path.join(out, `${await nextNumber()}-${safe(name)}.txt`);
  const body = await page.evaluate(() => document.body?.innerText ?? "");
  await writeFile(file, `URL: ${page.url()}\nTITLE: ${await page.title()}\n\n${body}\n`);
  saved.push(file);
  return file;
}
const settle = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

async function open(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 }).catch(async (error) => {
    // Pages with long-polling never go idle; keep whatever rendered.
    if (!/timeout/i.test(String(error))) throw error;
  });
  await settle();
  return page;
}

// ---- run ---------------------------------------------------------------------------------------

await mkdir(out, { recursive: true });
await mkdir(profile, { recursive: true });
const puppeteer = await loadPuppeteer();
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new", // never a visible window: it would steal focus from the person at the computer
  userDataDir: profile,
  args: ["--no-first-run", "--no-default-browser-check", ...extraArgs],
});

let exitCode = 0;
try {
  if (command === "goto") {
    const [url, name = "page", scrolls = "0"] = rest;
    if (!url) throw new Error("goto <url> <name> [scrolls]");
    const page = await open(browser, resolveUrl(url));
    await screenshot(page, `${name}-top`);
    for (let i = 1; i <= Number(scrolls); i += 1) {
      const moved = await page.evaluate(() => {
        const before = window.scrollY;
        window.scrollBy(0, Math.round(window.innerHeight * 0.9));
        return window.scrollY !== before;
      });
      if (!moved) break; // reached the bottom
      await settle(500);
      await screenshot(page, `${name}-scroll${i}`);
    }
    await writeFile(lastUrlFile, page.url());
  } else if (command === "text") {
    const [maybeUrl, name] = rest;
    const isUrl = maybeUrl && (/^(https?:|file:|\/)/i.test(maybeUrl));
    const url = isUrl ? resolveUrl(maybeUrl) : await currentUrl();
    const page = await open(browser, url);
    await dumpText(page, (isUrl ? name : maybeUrl) ?? "page-text");
    await writeFile(lastUrlFile, page.url());
  } else if (command === "shot") {
    const [name = "shot"] = rest;
    const page = await open(browser, await currentUrl());
    await screenshot(page, name, Boolean(flags.full));
  } else if (command === "click") {
    const [label, name = `after-click-${label}`] = rest;
    if (!label) throw new Error("click <visible text> [name]");
    const page = await open(browser, await currentUrl());
    const handle = await page.evaluateHandle((value) => {
      const wanted = value.trim().toLowerCase();
      const nodes = [...document.querySelectorAll("button, a, [role=button], input[type=submit], summary, label")];
      const textOf = (node) => (node.innerText || node.value || node.getAttribute("aria-label") || "").trim().toLowerCase();
      return nodes.find((node) => textOf(node) === wanted) ?? nodes.find((node) => textOf(node).includes(wanted)) ?? null;
    }, label);
    const element = handle.asElement();
    if (!element) throw new Error(`Nothing clickable with the text "${label}" on ${page.url()}`);
    await element.click();
    await settle(1500);
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 10_000 }).catch(() => {});
    await screenshot(page, name);
    await writeFile(lastUrlFile, page.url());
  } else if (command === "type") {
    const [selector, value, name = "after-type"] = rest;
    if (!selector || value === undefined) throw new Error("type <css selector> <text> [name] [--enter]");
    const page = await open(browser, await currentUrl());
    await page.waitForSelector(selector, { timeout: 10_000 });
    await page.click(selector, { clickCount: 3 });
    await page.type(selector, value, { delay: 20 });
    if (flags.enter) {
      await page.keyboard.press("Enter");
      await settle(1500);
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 10_000 }).catch(() => {});
    }
    await screenshot(page, name);
    await writeFile(lastUrlFile, page.url());
  } else if (command === "wait") {
    const [needle, seconds = "30"] = rest;
    if (!needle) throw new Error("wait <visible text> [seconds]");
    const timeout = Math.min(Number(seconds), 45) * 1000;
    const page = await open(browser, await currentUrl());
    const found = await page
      .waitForFunction((value) => document.body?.innerText.includes(value), { timeout }, needle)
      .then(() => true, () => false);
    await screenshot(page, found ? `found-${needle}` : `still-waiting-${needle}`);
    if (!found) { console.log(`not yet: "${needle}" did not appear within ${timeout / 1000}s. Poll again.`); exitCode = 3; }
  } else {
    throw new Error(`Unknown command "${command}". ${usage}`);
  }
} catch (error) {
  console.error(`browse.mjs: ${error?.message ?? error}`);
  exitCode = 1;
} finally {
  await browser.close().catch(() => {});
}
for (const file of saved) console.log(file);
process.exit(exitCode);
