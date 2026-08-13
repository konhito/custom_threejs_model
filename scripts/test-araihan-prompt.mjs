import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { ARAIHAN_CANONICAL_PROMPT, buildAraihanSystemPrompt } from "../lib/araihanPrompt.js";

const prompt = buildAraihanSystemPrompt("es", "ES", "es-ES");
assert.equal(createHash("sha256").update(ARAIHAN_CANONICAL_PROMPT, "utf8").digest("hex"), "584f9a39e01dfa383dd71470465ab2cc3d9275ea2ef0bd42bac05cc24713cfe9");
assert.match(prompt, /You never speak as Nahiara/);
assert.match(prompt, /You do not spoil/);
assert.match(prompt, /CIF: G72737570/);
assert.match(prompt, /no real-time database/);
assert.match(prompt, /visitor is from ES/);
assert.match(prompt, /Respond in Spanish/);
const route = readFileSync(new URL("../app/api/araihan/route.js", import.meta.url), "utf8");
assert.match(route, /OPENROUTER_API_KEY/);
assert.match(route, /openrouter\.ai\/api\/v1\/chat\/completions/);
assert.doesNotMatch(route, /ANTHROPIC_API_KEY|api\.anthropic\.com/);
console.log("Araihan canonical prompt boundaries pass");
