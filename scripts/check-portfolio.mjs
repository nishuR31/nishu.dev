import puppeteer from "puppeteer";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = process.env.PORTFOLIO_TEST_URL || "http://localhost:3001";
await mkdir("artifacts", { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/opt/google/chrome/chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error" && /hydration|did not match/i.test(message.text()))
    errors.push(message.text());
});
const go = (path = "") =>
  page.goto(`${base}${path}`, { waitUntil: "networkidle0", timeout: 90000 });
const isTheme = (theme) =>
  page.waitForFunction((value) => document.documentElement.classList.contains(value), {}, theme);
const loadPortrait = async () => {
  await page.$eval(".about-photo", (el) => el.scrollIntoView({ behavior: "instant" }));
  await page.waitForFunction(() => {
    const img = document.querySelector(".about-photo img");
    return img?.complete && img.naturalWidth > 0;
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
};
const chooseTheme = async (theme) => {
  await page.click(`[aria-label="${theme[0].toUpperCase() + theme.slice(1)} theme"]`);
};
try {
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await go();
  await isTheme("dark");
  assert.match(await page.$eval("h1", (el) => el.textContent), /The logic behind/);
  assert.equal(await page.$$eval(".project-tile", (els) => els.length), 3);
  await loadPortrait();
  await page.screenshot({ path: "artifacts/portfolio-v2-dark.png", fullPage: true });
  await page.screenshot({ path: "artifacts/portfolio-v2-hero-dark.png" });
  await page.click(".demo-tabs button:nth-child(2)");
  await page.waitForFunction(() =>
    document.querySelector(".demo-response").textContent.includes("SESSION VERIFIED"),
  );
  await page.click(".demo-tabs button:nth-child(3)");
  await page.waitForFunction(() =>
    document.querySelector(".demo-response").textContent.includes("QUERY COMPLETE"),
  );
  await page.click(".demo-tabs button:first-child");
  await page.waitForFunction(() =>
    document.querySelector(".demo-response").textContent.includes("200 OK"),
  );
  await chooseTheme("light");
  await isTheme("light");
  await page.reload({ waitUntil: "networkidle0" });
  await isTheme("light");
  assert.equal(await page.evaluate(() => localStorage.getItem("theme")), "light");
  await loadPortrait();
  await page.screenshot({ path: "artifacts/portfolio-v2-light.png", fullPage: true });
  await page.screenshot({ path: "artifacts/portfolio-v2-hero-light.png" });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await chooseTheme("system");
  await isTheme("dark");
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  await isTheme("light");
  await chooseTheme("dark");
  await isTheme("dark");
  await page.$$eval(".project-filters button", (els) =>
    els.find((el) => el.textContent === "Backend").click(),
  );
  assert.ok((await page.$$eval(".project-tile", (els) => els.length)) > 0);
  await page.$$eval(".project-filters button", (els) =>
    els.find((el) => el.textContent.startsWith("All projects")).click(),
  );
  const detail = await page.$eval(".project-tile h3 a", (el) => el.getAttribute("href"));
  for (const path of [detail, "/projects", "/experience", "/certificates", "/contact"]) {
    const response = await go(path);
    assert.equal(response.status(), 200, path);
    await isTheme("dark");
    assert.ok(await page.$("h1"), `${path} has a heading`);
  }
  await browser
    .defaultBrowserContext()
    .overridePermissions(base, ["clipboard-read", "clipboard-sanitized-write"]);
  await page.bringToFront();
  await page.click(".contact-buttons button");
  await page.waitForFunction(
    () => document.querySelector('[role="status"]').textContent === "Email copied!",
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: () => Promise.reject(new Error("Permission denied")),
    }),
  );
  await page.click(".contact-buttons button");
  await page.waitForFunction(() =>
    document.querySelector('[role="status"]').textContent.includes("Please select"),
  );
  for (const theme of ["dark", "light"]) {
    for (const width of [390, 320, 768]) {
      await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
      await go();
      await chooseTheme(theme);
      await isTheme(theme);
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `No overflow at ${width} in ${theme}`,
      );
      if (width === 390) {
        await loadPortrait();
        await page.screenshot({
          path: `artifacts/portfolio-v2-mobile-${theme}.png`,
          fullPage: true,
        });
        await page.screenshot({ path: `artifacts/portfolio-v2-mobile-hero-${theme}.png` });
        await page.click("#nav-toggle");
        assert.equal(
          await page.$eval("#nav-toggle", (el) => el.getAttribute("aria-expanded")),
          "true",
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await page.$eval("#nav-toggle", (el) => el.getAttribute("aria-expanded")),
          "false",
        );
        assert.equal(await page.evaluate(() => document.activeElement.id), "nav-toggle");
        await page.click("#nav-toggle");
        await page.click("#main-navigation a");
        assert.equal(
          await page.$eval("#nav-toggle", (el) => el.getAttribute("aria-expanded")),
          "false",
        );
      }
    }
  }
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await go();
  assert.equal(await page.$eval(".hero-copy", (el) => getComputedStyle(el).animationName), "none");
  const noStorage = await browser.newPage();
  await noStorage.evaluateOnNewDocument(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    }),
  );
  const storageErrors = [];
  noStorage.on("pageerror", (e) => storageErrors.push(e.message));
  await noStorage.goto(base, { waitUntil: "networkidle0" });
  await noStorage.click('[aria-label="Light theme"]');
  await noStorage.waitForFunction(() => document.documentElement.classList.contains("light"));
  assert.deepEqual(storageErrors, []);
  await noStorage.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: dark default; saved light theme; system changes; storage denied; architecture controls; project filters; case study/archive/experience/certificates/contact; clipboard success and failure; both themes at 320/390/768px; mobile menu and Escape focus; reduced motion; no overflow or runtime/hydration errors.",
  );
} finally {
  await browser.close();
}
