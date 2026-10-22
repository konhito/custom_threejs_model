import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("homepage hero copy exists in every supported locale", () => {
  for (const locale of ["en", "es", "fr", "de", "it", "zh"]) {
    const { home } = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    for (const key of ["brandName", "heroSubtitle", "heroTitle", "heroTitleLine2", "cardGameCta", "experienceAriaLabel"]) {
      assert.ok(home[key]?.trim(), `${locale}: missing home.${key}`);
    }
  }
});
