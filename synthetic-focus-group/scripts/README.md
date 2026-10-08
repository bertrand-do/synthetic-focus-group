# Scripts

Two small Node scripts. Both need Node 18 or newer, Google Chrome, and `puppeteer-core`:

```bash
npm i puppeteer-core            # in this folder, or anywhere and set PUPPETEER_CORE_FROM=<that project>
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"   # the macOS default
```

Both always run Chrome headless. Neither touches your personal browser profile.

## browse.mjs: the persona's browser

A stateless CLI a persona agent calls from Bash, one short command at a time. Each command opens headless Chrome with the persona's own profile directory (so a login persists between commands), saves numbered evidence into the persona's folder, and exits. Every command is stopped after 55 seconds, so an agent never blocks for more than a minute.

```bash
export BROWSE_OUT=./focus-group-[date]/[persona]
export BROWSE_PROFILE=/tmp/fg-[persona]-profile

node browse.mjs goto https://app.example.com/pricing pricing 6   # top + 6 scroll screenshots
node browse.mjs text pricing-text                                  # innerText of the current page
node browse.mjs click "Start free trial" after-cta                 # click by visible text, screenshot
node browse.mjs type "input[name=email]" "someone@example.test" email-typed --enter
node browse.mjs wait "Export complete" 40                           # poll; exit code 3 if not yet
node browse.mjs shot pricing-mobile --mobile --full                 # 390 x 844, full page
```

Files land as `01-pricing-top.png`, `02-pricing-scroll1.png`, ..., `08-pricing-text.txt`. The last URL is remembered in `.last-url`, so `shot`, `click`, `type`, `wait` and `text` act on the current page.

Configuration: CLI flag, then environment variable, then a `--config file.json`, then the default.

| Flag | Env | Default |
|---|---|---|
| `--out` | `BROWSE_OUT` | `./focus-evidence` |
| `--profile` | `BROWSE_PROFILE` | `<out>/.profile` |
| `--chrome` | `CHROME_PATH` | macOS Google Chrome path |
| `--width` / `--height` | `BROWSE_WIDTH` / `BROWSE_HEIGHT` | 1440 x 900 |
| `--mobile` | | 390 x 844 |
| `--base` | `BROWSE_BASE` | none (needed for relative URLs) |
| | `BROWSE_CHROME_ARGS` | extra Chrome switches, separated by `\|\|` |

For long operations, poll: run `wait` or `shot` every 20 to 45 seconds instead of one long wait. Keep the profile directory per persona and outside the repo.

## fix-shots.mjs: scripted verification of fixes

After a panel finds problems and the team fixes them, write one named check per fix. Each check opens a route of your **local** dev server with the API mocked in the browser, drives the UI, asserts what a buyer should now see, and saves screenshots. Output: `<out>/<check>.png` and `<out>/results.json`. It refuses a non-localhost base unless you pass `--allow-remote`.

```bash
node fix-shots.mjs --self-test --out ./fix-shots-selftest      # proves the harness works on this machine
node fix-shots.mjs --checks ./checks.mjs --base http://localhost:5173 --out ./fix-shots
node fix-shots.mjs --checks ./checks.mjs --only 1a-clear-error-no-retry,3b-no-retired-wording
```

A checks module exports one function that receives the kit:

```js
export default async function ({ check, open, shot, waitText, clickText, sweep, assert }) {
  await check("1a-clear-error-no-retry", async () => {
    const { page, calls } = await open("/form", {
      api: (pathname) => pathname === "/api/save"
        ? [422, { error: "That name is already taken.", retryable: false }]
        : null,                                    // null = default mock ({})
      session: { key: "<your auth storage key>", value: { access_token: "mock" } },
    });
    await clickText(page, "Save");
    await waitText(page, "already taken");
    assert.equal(calls.filter((c) => c.path === "/api/save").length, 1, "one call, no silent retry");
    const overflow = await shot(page, "1a-error-1440");            // true if the page scrolls sideways
    await page.setViewport({ width: 390, height: 844 });
    await shot(page, "1a-error-390");
    await page.close();
    return { overflow };
  });

  await check("3b-no-retired-wording", async () => {
    const hits = await sweep("3b-sweep-dashboard", "/app");       // needs --stale-words
    assert.deepEqual(hits, [], hits.join(" / "));
  });
}
```

Options: `--api-prefix` (default `/api/`), `--stale-words "<regex>"` for wording that must not appear (for example a retired product name), and a `--config` JSON with `allowHosts` (hosts allowed to load, such as an image CDN) and a default `session`. Everything else outside your dev server is answered with an empty response, so no real backend, auth provider or paid API is ever called.

Tips from use: assert call counts (exactly one request, no retry on a permanent refusal), capture each fix at 1440 and 390 px, capture before and after when you can, and keep each check named after the finding it verifies so the fix coverage map can point at it.
