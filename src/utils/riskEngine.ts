import { Transaction, Payee } from '../data/models';

export const RISK_CONFIG = {
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
    NAME_MISMATCH_POINTS: 3,
};

export interface RiskRuleResult {
    rule: string;
    points: number;
    explanation: string;
}

export interface RiskEvaluationRequest {
    transaction: Omit<Transaction, 'tier' | 'flags'>;
    userHistory: Transaction[];
    payee: Payee;
    typedName?: string;
}

export interface RiskEvaluationResult {
    tier: 'low' | 'medium' | 'high' | 'critical';
    flags: string[];
    totalScore: number;
    rulesTriggered: RiskRuleResult[];
}

export const evaluateNewPayee = (req: RiskEvaluationRequest): RiskRuleResult | null => {
    const hasHistory = req.userHistory.some(t => t.payee_id === req.payee.id);
    if (!hasHistory) {
        return {
            rule: 'NEW_PAYEE',
            points: RISK_CONFIG.NEW_PAYEE_POINTS,
            explanation: 'This is the first time you are paying this person or business.'
        };
    }
    return null;
};

export const evaluateUnusualAmount = (req: RiskEvaluationRequest): RiskRuleResult | null => {
    if (req.userHistory.length === 0) return null;
    const totalAmount = req.userHistory.reduce((sum, t) => sum + t.amount, 0);
    const avgAmount = totalAmount / req.userHistory.length;

    if (req.transaction.amount > avgAmount * RISK_CONFIG.UNUSUAL_AMOUNT_MULTIPLIER) {
        return {
            rule: 'UNUSUAL_AMOUNT',
            points: RISK_CONFIG.UNUSUAL_AMOUNT_POINTS,
            explanation: 'The amount is unusually large compared to your typical transactions.'
        };
    }
    return null;
};

export const evaluateRoundAmountNewPayee = (req: RiskEvaluationRequest, newPayeeResult: RiskRuleResult | null): RiskRuleResult | null => {
    if (newPayeeResult && req.transaction.amount >= 1000 && req.transaction.amount % 1000 === 0) {
        return {
            rule: 'ROUND_AMOUNT_NEW_PAYEE',
            points: RISK_CONFIG.ROUND_AMOUNT_NEW_PAYEE_POINTS,
            explanation: 'Round amount sent to a new payee is sometimes indicative of a scam.'
        };
    }
    return null;
};

export const evaluateUnusualTime = (req: RiskEvaluationRequest): RiskRuleResult | null => {
    const txDate = new Date(req.transaction.timestamp);
    const hour = txDate.getHours();
    if (hour >= RISK_CONFIG.UNUSUAL_TIME_START_HOUR || hour < RISK_CONFIG.UNUSUAL_TIME_END_HOUR) {
        return {
            rule: 'UNUSUAL_TIME',
            points: RISK_CONFIG.UNUSUAL_TIME_POINTS,
            explanation: 'Transaction occurred late at night, outside usual active hours.'
        };
    }
    return null;
};

export const evaluateHighVelocity = (req: RiskEvaluationRequest): RiskRuleResult | null => {
    const txTime = new Date(req.transaction.timestamp).getTime();
    const windowMs = RISK_CONFIG.HIGH_VELOCITY_WINDOW_MINUTES * 60 * 1000;

    let countWithinWindow = 0;
    for (const t of req.userHistory) {
        const timeDiff = Math.abs(txTime - new Date(t.timestamp).getTime());
        if (timeDiff <= windowMs) {
            countWithinWindow++;
        }
    }

    if (countWithinWindow >= (RISK_CONFIG.HIGH_VELOCITY_COUNT - 1)) {
        return {
            rule: 'HIGH_VELOCITY',
            points: RISK_CONFIG.HIGH_VELOCITY_POINTS,
            explanation: 'Unusual rapid sequence of transactions within a short time.'
        };
    }
    return null;
};

export const evaluateNameMismatch = (req: RiskEvaluationRequest): RiskRuleResult | null => {
    if (!req.typedName) return null;
    const normalTyped = req.typedName.toLowerCase().replace(/\s+/g, '');
    const normalRegistered = req.payee.name.toLowerCase().replace(/\s+/g, '');

    if (normalTyped && normalRegistered && normalTyped !== normalRegistered) {
        return {
            rule: 'NAME_MISMATCH_WARNING',
            points: RISK_CONFIG.NAME_MISMATCH_POINTS,
            explanation: 'The name you entered does not match the securely registered banking name.'
        };
    }
    return null;
};

export const evaluateTransaction = (req: RiskEvaluationRequest): RiskEvaluationResult => {
    const rulesTriggered: RiskRuleResult[] = [];

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

    let tier: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (totalScore >= 6) {
        tier = 'critical';
    } else if (totalScore >= 4) {
        tier = 'high';
    } else if (totalScore >= 2) {
        tier = 'medium';
    }

    const flags = rulesTriggered.map(r => r.rule);

    return {
        tier,
        flags,
        totalScore,
        rulesTriggered
    };
};
