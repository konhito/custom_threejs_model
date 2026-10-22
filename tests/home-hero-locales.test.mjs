import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("homepage hero copy exists in every supported locale", () => {
  for (const locale of ["en", "es", "fr", "de", "it", "zh"]) {
    const { home, footer, language, globeUi, sharedUi, araihanChat, chatPage, shopPage, cartPage, checkoutPage, flowersCatalog, pollinatorsCatalog, flowers, pollinators } = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    for (const key of ["brandName", "loaderBrandName", "heroSubtitle", "heroTitle", "heroTitleLine2", "cardGameCta", "experienceAriaLabel", "bookVolume", "bookVolumeAlt", "mysteryVolume", "comingSoon", "closeBookModal"]) {
      assert.ok(home[key]?.trim(), `${locale}: missing home.${key}`);
    }
    for (const [section, values] of Object.entries({ footer, language, globeUi, sharedUi, araihanChat, chatPage, shopPage, cartPage, checkoutPage, flowersCatalog, pollinatorsCatalog })) {
      assert.ok(values && Object.values(values).every((value) => Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim()), `${locale}: incomplete ${section} copy`);
    }
    assert.ok(flowers.searchPlaceholder && pollinators.searchPlaceholder, `${locale}: missing catalogue search text`);
  }
});

test("static translation keys resolve in every locale", () => {
  const sourceRoot = fileURLToPath(new URL("..", import.meta.url));
  const files = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : /\.(js|jsx)$/.test(entry.name) ? [path] : [];
  });
  const keys = new Set([...files(join(sourceRoot, "app")), ...files(join(sourceRoot, "components"))]
    .flatMap((path) => [...readFileSync(path, "utf8").matchAll(/\bt\(\s*["']([\w.-]+)["']/g)].map((match) => match[1])));
  for (const locale of ["en", "es", "fr", "de", "it", "zh"]) {
    const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    for (const key of keys) {
      assert.notEqual(key.split(".").reduce((value, part) => value?.[part], messages), undefined, `${locale}: missing ${key}`);
    }
  }
});
