import assert from 'assert';
import { evaluateTransaction } from './riskEngine';
import { Transaction, Payee } from '../data/models';

const mockPayee: Payee = {
    id: 'p1',
    name: 'Original Name',
    upi_id: 'orig@upi',
    first_seen_at: '2024-01-01T00:00:00Z'
};

const baseRequest = {
    transaction: {
        id: 't_now',
        user_id: 'u1',
        payee_id: 'p1',
        amount: 100,
        timestamp: '2024-09-03T15:00:00Z',
        status: 'pending' as const
    },
    payee: mockPayee,
    userHistory: []
};

function runTests() {
    console.log("Running Risk Engine Tests...");

    // Test 1: New Payee Only
    const res1 = evaluateTransaction({ ...baseRequest });
    console.log('Test 1 (New Payee):', { score: res1.totalScore, tier: res1.tier, flags: res1.flags });
    assert.strictEqual(res1.flags.includes('NEW_PAYEE'), true);
    assert.strictEqual(res1.totalScore, 2);
    assert.strictEqual(res1.tier, 'medium');

    // Test 2: Unusual amount + Historical payee
    const historyForUnusual: Transaction[] = [
        { id: 't1', user_id: 'u1', payee_id: 'p1', amount: 50, timestamp: '2024-09-01T10:00:00Z', tier: 'low', flags: [], status: 'completed' },
        { id: 't2', user_id: 'u1', payee_id: 'p1', amount: 60, timestamp: '2024-09-02T10:00:00Z', tier: 'low', flags: [], status: 'completed' },
    ];
    const res2 = evaluateTransaction({
        ...baseRequest,
        transaction: { ...baseRequest.transaction, amount: 200 }, // Average = 55, amount = 200 (> 3x)
        userHistory: historyForUnusual
    });
    console.log('Test 2 (Unusual Amount):', { score: res2.totalScore, tier: res2.tier, flags: res2.flags });
    assert.strictEqual(res2.flags.includes('UNUSUAL_AMOUNT'), true);
    // Payee is in history, so no NEW_PAYEE
    assert.strictEqual(res2.flags.includes('NEW_PAYEE'), false);
    assert.strictEqual(res2.totalScore, 2);
    assert.strictEqual(res2.tier, 'medium');

    // Test 3: Multiple rules triggering Critical
    const res3 = evaluateTransaction({
        ...baseRequest,
        transaction: { ...baseRequest.transaction, amount: 5000, timestamp: '2024-09-03T02:00:00Z' },
        typedName: 'Fake Name'
    });
    console.log('Test 3 (Critical Scenario):', { score: res3.totalScore, tier: res3.tier, flags: res3.flags });
    assert.strictEqual(res3.flags.includes('NEW_PAYEE'), true, 'Should flag NEW_PAYEE');
    assert.strictEqual(res3.flags.includes('ROUND_AMOUNT_NEW_PAYEE'), true, 'Should flag ROUND_AMOUNT_NEW_PAYEE');
    assert.strictEqual(res3.flags.includes('UNUSUAL_TIME'), true, 'Should flag UNUSUAL_TIME');
    assert.strictEqual(res3.flags.includes('NAME_MISMATCH_WARNING'), true, 'Should flag NAME_MISMATCH_WARNING');
    assert.strictEqual(res3.totalScore, 2 + 2 + 1 + 3); // 8 points
    assert.strictEqual(res3.tier, 'critical');

    console.log("\nAll riskEngine tests passed successfully! ✅");
}

runTests();
