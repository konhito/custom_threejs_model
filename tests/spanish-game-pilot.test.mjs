import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { localizeSpanishSpain } from "../lib/spanishGamePilot.js";

const es = JSON.parse(readFileSync(new URL("../messages/es.json", import.meta.url), "utf8"));
const en = JSON.parse(readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"));
const spanishSpain = es.gamePilot.spain;

test("Spanish pilot has a complete flower profile and playable quiz", () => {
  const keys = ["morphology", "habitat", "historicalOrigin", "nationalStatus", "conservationStatus", "relevantPollinator", "culturalSignificance", "traditionalUses"];
  assert.deepEqual(spanishSpain.parameters.map(item => item.key), keys);
  assert.equal(spanishSpain.quiz.length, 5);
  for (const question of spanishSpain.quiz) {
    assert.ok(question.q && question.explanation);
    assert.equal(question.options.length, 4);
    assert.ok(question.options[question.answer]);
  }
  const base = { parameters: keys.map(key => ({ key, icon: "🌿" })) };
  const localized = localizeSpanishSpain(base, spanishSpain);
  assert.equal(localized.flowerName, "Clavel");
  assert.ok(localized.parameters.every(item => item.icon && item.label && item.value));
  assert.deepEqual(Object.keys(es.gamePilot.ui), Object.keys(en.gamePilot.ui));
  for (const locale of ["fr", "de", "it", "zh"]) {
    const data = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    assert.deepEqual(Object.keys(data.gamePilot.ui), Object.keys(en.gamePilot.ui));
  }
  assert.ok(Object.values(es.gamePilot.cardNames).every(Boolean));
  assert.deepEqual(Object.keys(es.gamePilot.badges), ["firstFlip", "explorer", "botanist", "speedReader"]);
});
