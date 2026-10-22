import assert from "node:assert/strict";
import test from "node:test";
import { spanishSpain, localizeSpanishSpain } from "../lib/spanishGamePilot.js";

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
  const localized = localizeSpanishSpain(base);
  assert.equal(localized.flowerName, "Clavel");
  assert.ok(localized.parameters.every(item => item.icon && item.label && item.value));
});
