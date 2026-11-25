import assert from "node:assert/strict";
import { QUESTION_BANK, stripAnswerKey } from "../dist/tsc/questions.js";
import { evaluateSession } from "../dist/tsc/evaluation.js";
import { signToken, verifyToken, timingSafeEqual, shuffleDeterministic, generateExamToken } from "../dist/tsc/security.js";

// 1. Verify question bank integrity
assert.equal(QUESTION_BANK.length, 24, "Expected 24 questions");
const lit = QUESTION_BANK.filter((q) => q.subject === "literasi");
const num = QUESTION_BANK.filter((q) => q.subject === "numerasi");
assert.equal(lit.length, 12, "Expected 12 Literasi questions");
assert.equal(num.length, 12, "Expected 12 Numerasi questions");

// 2. Verify zero answer-key leakage
for (const q of QUESTION_BANK) {
  const pub = stripAnswerKey(q);
  assert.equal("correctAnswer" in pub, false, `Answer key leaked in ${q.id}`);
  assert.equal("explanation" in pub, false, `Explanation leaked in ${q.id}`);
  if (pub.statements) {
    for (const s of pub.statements) {
      assert.equal("answer" in s, false, `Statement answer leaked in ${q.id}`);
    }
  }
}

// 3. Verify perfect score auto-evaluation
const allCorrect = {};
for (const q of QUESTION_BANK) allCorrect[q.id] = q.correctAnswer;
const perfect = evaluateSession(QUESTION_BANK.map((q) => q.id), allCorrect);
assert.equal(perfect.scoreTotal, 100, "Perfect score should be 100");
assert.equal(perfect.scoreLiterasi, 100);
assert.equal(perfect.scoreNumerasi, 100);
assert.equal(perfect.predicate, "Mahir");

// 4. Verify partial credit & normalized isian singkat
const partialAnswers = {
  "LIT-01": "B", // correct (10)
  "LIT-02": ["A", "B"], // 2 of 3 right, 0 wrong -> partial
  "LIT-03": { S1: "B", S2: "B", S3: "S" }, // 2 of 3 -> partial
  "LIT-07": " 37% ", // normalized -> correct
  "NUM-02": "Rp 12.000", // normalized -> correct
};
const partial = evaluateSession(["LIT-01", "LIT-02", "LIT-03", "LIT-07", "NUM-02"], partialAnswers);
assert.equal(partial.items.find((i) => i.questionId === "LIT-02").status, "partial");
assert.equal(partial.items.find((i) => i.questionId === "LIT-03").status, "partial");
assert.equal(partial.items.find((i) => i.questionId === "LIT-07").status, "correct");
assert.equal(partial.items.find((i) => i.questionId === "NUM-02").status, "correct");
assert.ok(partial.recommendations.length > 0);

// 5. Verify Web Crypto HMAC token & timing-safe comparison
const secret = "test-secret-key-2026";
const tok = await signToken({ role: "student", sid: "s-1", iat: Date.now(), exp: Date.now() + 60000 }, secret);
const decoded = await verifyToken(tok, secret);
assert.equal(decoded?.sid, "s-1");
assert.equal(await verifyToken(tok + "tamper", secret), null);
assert.equal(await timingSafeEqual("TKA26A", "TKA26A"), true);
assert.equal(await timingSafeEqual("TKA26A", "TKA26B"), false);

// 6. Verify deterministic shuffle & random exam token
const s1 = shuffleDeterministic([1, 2, 3, 4, 5], "session-abc");
const s2 = shuffleDeterministic([1, 2, 3, 4, 5], "session-abc");
assert.deepEqual(s1, s2);
assert.equal(generateExamToken().length, 6);

console.log("ALL CORE TESTS PASSED! (Questions, Security, Auto-Evaluator)");
