import assert from "node:assert/strict";
import { chapterList, chapterNumber, isPurchased } from "../lib/chapterLibraryDemo.mjs";

assert.deepEqual(chapterList({ data: [{ chapter_number: 1 }] }), [{ chapter_number: 1 }]);
assert.equal(chapterNumber({ chapter_number: 2 }), 2);
assert.equal(isPurchased({ owned: true }), true);
assert.equal(isPurchased({ owned: false }), false);
console.log("chapter library checks passed");
