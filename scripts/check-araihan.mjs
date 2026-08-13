import assert from "node:assert/strict";
import { buildAraihanSystemPrompt } from "../lib/araihanPrompt.js";

for (const [locale, language] of [["es", "Spanish"], ["de", "German"], ["en", "English"]]) {
  const prompt = buildAraihanSystemPrompt(locale, "ES", locale, { path: "/flowers", heading: "National flowers" });
  assert.match(prompt, new RegExp(`Respond in ${language}`));
  assert.match(prompt, /never speak as Nahiara/i);
  assert.match(prompt, /never claims? to be an AI|not an AI/i);
  assert.match(prompt, /planting a seed/i);
  assert.match(prompt, /currently viewing \/flowers — National flowers/i);
}

console.log("Araihan canonical prompt checks passed");
