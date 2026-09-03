"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/utils/riskEngine.test.ts
var import_assert = __toESM(require("assert"), 1);

// src/utils/riskEngine.ts
var RISK_CONFIG = {
  NEW_PAYEE_POINTS: 2,
  UNUSUAL_AMOUNT_MULTIPLIER: 3,
  UNUSUAL_AMOUNT_POINTS: 2,
  UNUSUAL_TIME_START_HOUR: 23,
  UNUSUAL_TIME_END_HOUR: 6,
  UNUSUAL_TIME_POINTS: 1,
  HIGH_VELOCITY_WINDOW_MINUTES: 10,
  HIGH_VELOCITY_COUNT: 3,
  HIGH_VELOCITY_POINTS: 3,
  ROUND_AMOUNT_NEW_PAYEE_POINTS: 2,
  NAME_MISMATCH_POINTS: 3
};
var evaluateNewPayee = (req) => {
  const hasHistory = req.userHistory.some((t) => t.payee_id === req.payee.id);
  if (!hasHistory) {
    return {
      rule: "NEW_PAYEE",
      points: RISK_CONFIG.NEW_PAYEE_POINTS,
      explanation: "This is the first time you are paying this person or business."
    };
  }
  return null;
};
var evaluateUnusualAmount = (req) => {
  if (req.userHistory.length === 0) return null;
  const totalAmount = req.userHistory.reduce((sum, t) => sum + t.amount, 0);
  const avgAmount = totalAmount / req.userHistory.length;
  if (req.transaction.amount > avgAmount * RISK_CONFIG.UNUSUAL_AMOUNT_MULTIPLIER) {
    return {
      rule: "UNUSUAL_AMOUNT",
      points: RISK_CONFIG.UNUSUAL_AMOUNT_POINTS,
      explanation: "The amount is unusually large compared to your typical transactions."
    };
  }
  return null;
};
var evaluateRoundAmountNewPayee = (req, newPayeeResult) => {
  if (newPayeeResult && req.transaction.amount >= 1e3 && req.transaction.amount % 1e3 === 0) {
    return {
      rule: "ROUND_AMOUNT_NEW_PAYEE",
      points: RISK_CONFIG.ROUND_AMOUNT_NEW_PAYEE_POINTS,
      explanation: "Round amount sent to a new payee is sometimes indicative of a scam."
    };
  }
  return null;
};
var evaluateUnusualTime = (req) => {
  const txDate = new Date(req.transaction.timestamp);
  const hour = txDate.getHours();
  if (hour >= RISK_CONFIG.UNUSUAL_TIME_START_HOUR || hour < RISK_CONFIG.UNUSUAL_TIME_END_HOUR) {
    return {
      rule: "UNUSUAL_TIME",
      points: RISK_CONFIG.UNUSUAL_TIME_POINTS,
      explanation: "Transaction occurred late at night, outside usual active hours."
    };
  }
  return null;
};
var evaluateHighVelocity = (req) => {
  const txTime = new Date(req.transaction.timestamp).getTime();
  const windowMs = RISK_CONFIG.HIGH_VELOCITY_WINDOW_MINUTES * 60 * 1e3;
  let countWithinWindow = 0;
  for (const t of req.userHistory) {
    const timeDiff = Math.abs(txTime - new Date(t.timestamp).getTime());
    if (timeDiff <= windowMs) {
      countWithinWindow++;
    }
  }
  if (countWithinWindow >= RISK_CONFIG.HIGH_VELOCITY_COUNT - 1) {
    return {
      rule: "HIGH_VELOCITY",
      points: RISK_CONFIG.HIGH_VELOCITY_POINTS,
      explanation: "Unusual rapid sequence of transactions within a short time."
    };
  }
  return null;
};
var evaluateNameMismatch = (req) => {
  if (!req.typedName) return null;
  const normalTyped = req.typedName.toLowerCase().replace(/\s+/g, "");
  const normalRegistered = req.payee.name.toLowerCase().replace(/\s+/g, "");
  if (normalTyped && normalRegistered && normalTyped !== normalRegistered) {
    return {
      rule: "NAME_MISMATCH_WARNING",
      points: RISK_CONFIG.NAME_MISMATCH_POINTS,
      explanation: "The name you entered does not match the securely registered banking name."
    };
  }
  return null;
};
var evaluateTransaction = (req) => {
  const rulesTriggered = [];
  const newPayee = evaluateNewPayee(req);
  if (newPayee) rulesTriggered.push(newPayee);
  const unusualAmount = evaluateUnusualAmount(req);
  if (unusualAmount) rulesTriggered.push(unusualAmount);
  const roundNew = evaluateRoundAmountNewPayee(req, newPayee);
  if (roundNew) rulesTriggered.push(roundNew);
  const unusualTime = evaluateUnusualTime(req);
  if (unusualTime) rulesTriggered.push(unusualTime);
  const highVelocity = evaluateHighVelocity(req);
  if (highVelocity) rulesTriggered.push(highVelocity);
  const nameMismatch = evaluateNameMismatch(req);
  if (nameMismatch) rulesTriggered.push(nameMismatch);
  const totalScore = rulesTriggered.reduce((sum, r) => sum + r.points, 0);
  let tier = "low";
  if (totalScore >= 6) {
    tier = "critical";
  } else if (totalScore >= 4) {
    tier = "high";
  } else if (totalScore >= 2) {
    tier = "medium";
  }
  const flags = rulesTriggered.map((r) => r.rule);
  return {
    tier,
    flags,
    totalScore,
    rulesTriggered
  };
};

// src/utils/riskEngine.test.ts
var mockPayee = {
  id: "p1",
  name: "Original Name",
  upi_id: "orig@upi",
  first_seen_at: "2024-01-01T00:00:00Z"
};
var baseRequest = {
  transaction: {
    id: "t_now",
    user_id: "u1",
    payee_id: "p1",
    amount: 100,
    timestamp: "2024-09-03T15:00:00Z",
    status: "pending"
  },
  payee: mockPayee,
  userHistory: []
};
function runTests() {
  console.log("Running Risk Engine Tests...");
  const res1 = evaluateTransaction({ ...baseRequest });
  console.log("Test 1 (New Payee):", { score: res1.totalScore, tier: res1.tier, flags: res1.flags });
  import_assert.default.strictEqual(res1.flags.includes("NEW_PAYEE"), true);
  import_assert.default.strictEqual(res1.totalScore, 2);
  import_assert.default.strictEqual(res1.tier, "medium");
  const historyForUnusual = [
    { id: "t1", user_id: "u1", payee_id: "p1", amount: 50, timestamp: "2024-09-01T10:00:00Z", tier: "low", flags: [], status: "completed" },
    { id: "t2", user_id: "u1", payee_id: "p1", amount: 60, timestamp: "2024-09-02T10:00:00Z", tier: "low", flags: [], status: "completed" }
  ];
  const res2 = evaluateTransaction({
    ...baseRequest,
    transaction: { ...baseRequest.transaction, amount: 200 },
    // Average = 55, amount = 200 (> 3x)
    userHistory: historyForUnusual
  });
  console.log("Test 2 (Unusual Amount):", { score: res2.totalScore, tier: res2.tier, flags: res2.flags });
  import_assert.default.strictEqual(res2.flags.includes("UNUSUAL_AMOUNT"), true);
  import_assert.default.strictEqual(res2.flags.includes("NEW_PAYEE"), false);
  import_assert.default.strictEqual(res2.totalScore, 2);
  import_assert.default.strictEqual(res2.tier, "medium");
  const res3 = evaluateTransaction({
    ...baseRequest,
    transaction: { ...baseRequest.transaction, amount: 5e3, timestamp: "2024-09-03T02:00:00Z" },
    typedName: "Fake Name"
  });
  console.log("Test 3 (Critical Scenario):", { score: res3.totalScore, tier: res3.tier, flags: res3.flags });
  import_assert.default.strictEqual(res3.flags.includes("NEW_PAYEE"), true, "Should flag NEW_PAYEE");
  import_assert.default.strictEqual(res3.flags.includes("ROUND_AMOUNT_NEW_PAYEE"), true, "Should flag ROUND_AMOUNT_NEW_PAYEE");
  import_assert.default.strictEqual(res3.flags.includes("UNUSUAL_TIME"), true, "Should flag UNUSUAL_TIME");
  import_assert.default.strictEqual(res3.flags.includes("NAME_MISMATCH_WARNING"), true, "Should flag NAME_MISMATCH_WARNING");
  import_assert.default.strictEqual(res3.totalScore, 2 + 2 + 1 + 3);
  import_assert.default.strictEqual(res3.tier, "critical");
  console.log("\nAll riskEngine tests passed successfully! \u2705");
}
runTests();
