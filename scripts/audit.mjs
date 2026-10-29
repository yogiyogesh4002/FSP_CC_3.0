import puppeteer from "puppeteer-core";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";

const url = process.env.VERIFY_URL || "http://localhost:3001";
const output = "artifacts/audit";
const reports = [];
const failures = [];
const browsers = [
  ["edge", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"],
  ["chrome", "C:/Program Files/Google/Chrome/Application/chrome.exe"],
].filter(([, path]) => existsSync(path));
await mkdir(output, { recursive: true });
assert(browsers.length, "No supported local browser found");

for (const [name, executablePath] of browsers) {
  const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true, timeout: 20000, args: ["--no-sandbox", "--disable-gpu"] });
  try {
    for (const width of [320, 390, 640, 768, 1024, 1440, 1920]) {
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewport({ width, height: 900 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await page.waitForSelector("#faq button");
      // Load every lazy image before checking its actual dimensions.
      await page.evaluate(async () => {
        for (const section of document.querySelectorAll("main > section")) {
          section.scrollIntoView({ behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
        scrollTo({ top: 0, behavior: "instant" });
      });
      await new Promise((resolve) => setTimeout(resolve, 600));
      const layout = await page.evaluate(() => {
        const content = [...document.querySelectorAll("main h1, main h2, main h3, main p, main dd, main dt")];
        const hidden = content.filter((element) => {
          if (element.closest("[hidden]")) return false;
          for (let node = element; node && node !== document.body; node = node.parentElement) {
            if (getComputedStyle(node).opacity === "0") return true;
          }
          return false;
        });
        const brokenAnchors = [...document.querySelectorAll('a[href^="#"]')].filter((a) => !document.getElementById(a.hash.slice(1)));
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          crowded: content.filter((e) => !e.closest("[hidden], .sr-only") && e.scrollWidth > e.clientWidth + 2).map((e) => e.textContent.slice(0, 70)),
          brokenImages: [...document.images].filter((i) => !i.complete || !i.naturalWidth).length,
          missingAlt: document.querySelectorAll("img:not([alt])").length,
          brokenAnchors: brokenAnchors.length,
          hiddenContent: hidden.length,
          h1Count: document.querySelectorAll("h1").length,
          placeholderCtas: [...document.querySelectorAll('a[href="#event-information"]')].filter((a) => /register/i.test(a.textContent)).length,
        };
      });
      const checks = { browser: name, width, ...layout, errors };
      reports.push(checks);
      if (layout.overflow || layout.crowded.length || layout.brokenImages || layout.missingAlt || layout.brokenAnchors || layout.hiddenContent || layout.h1Count !== 1 || layout.placeholderCtas || errors.length) failures.push(checks);
      if ([390, 768, 1440].includes(width)) {
        await page.screenshot({ path: `${output}/${name}-${width}-full.png`, fullPage: true });
        await page.evaluate(() => document.querySelector("#challenge").scrollIntoView({ behavior: "instant" }));
        await page.screenshot({ path: `${output}/${name}-${width}-challenge.png` });
      }
      // Mouse and keyboard operation, with real state/region checks.
      await page.click("#faq button");
      await page.waitForFunction(() => document.querySelector("#faq button").getAttribute("aria-expanded") === "false");
      assert.equal(await page.$eval("#faq button", (e) => e.getAttribute("aria-expanded")), "false");
      await page.focus("#faq button");
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.querySelector("#faq button").getAttribute("aria-expanded") === "true");
      assert.equal(await page.$eval("#faq button", (e) => e.getAttribute("aria-expanded")), "true");
      assert.equal(await page.$eval("#faq button", (e) => document.getElementById(e.getAttribute("aria-controls")).hidden), false);
      // Verify player activation without depending on external streaming access.
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (new URL(request.url()).hostname.endsWith("youtube-nocookie.com")) request.abort();
        else request.continue();
      });
      await page.click('button[aria-label^="Play video"]');
      await page.waitForSelector("iframe");
      assert.equal(await page.$eval("iframe", (e) => new URL(e.src).hostname), "www.youtube-nocookie.com");
      await page.close();
      console.log(`${name} ${width}px: ${JSON.stringify(layout)}`);
    }
    for (const mode of ["reduced-motion", "no-javascript", "zoom-200"] ) {
      const page = await browser.newPage();
      await page.setViewport({ width: mode === "zoom-200" ? 640 : 390, height: 900 });
      if (mode === "reduced-motion") await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      if (mode === "no-javascript") await page.setJavaScriptEnabled(false);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      if (mode === "zoom-200") await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await page.evaluate(() => ({
        visible: [...document.querySelectorAll(".reveal-content")].every((e) => getComputedStyle(e).opacity === "1"),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      }));
      reports.push({ browser: name, mode, ...result });
      if (!result.visible || result.overflow) failures.push({ browser: name, mode, ...result });
      await page.screenshot({ path: `${output}/${name}-${mode}.png` });
      await page.close();
    }
  } finally { await browser.close(); }
}
await writeFile(`${output}/results.json`, JSON.stringify({ url, reports, failures }, null, 2));
console.log(`${reports.length} layout/accessibility scenarios; ${failures.length} failures.`);
assert.equal(failures.length, 0, JSON.stringify(failures, null, 2));
