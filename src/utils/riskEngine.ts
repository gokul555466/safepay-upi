import { Transaction, RiskEvaluation, RiskFlag, RiskTier } from '../types';

export interface EvaluationContext {
  history: Transaction[];
  simulatedTimeHour: number; // 0 - 23
  enteredName?: string;
  registeredBankName?: string;
  hasNameMismatch?: boolean;
  isDefaultContact?: boolean;
}

/**
 * Helper to display human readable time string from simulated hour (e.g. "10:30 PM", "02:30 PM")
 */
export function formatSimulatedTime(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:30 ${period}`;
}

/**
 * Evaluates UPI transaction safety using SafePay's human-protective risk rules.
 * Enforces user requirements:
 * 1. Over ₹5,000 OR after 10:00 PM -> Shield Guardian authorization is required.
 * 2. Unregistered / Non-default contact -> Popup warning + 10-15s wait.
 */
export function evaluateTransaction(
  payeeName: string,
  payeeUpi: string,
  amount: number,
  timestamp: string,
  context: EvaluationContext
): RiskEvaluation {
  const flags: RiskFlag[] = [];
  let score = 0;
  const shieldReasons: string[] = [];

  // A. Check user requirement: More than 5,000 OR above 10:00 PM
  const isOver5000 = amount > 5000;
  const isAfter10PM = context.simulatedTimeHour >= 22 || context.simulatedTimeHour < 6;

  if (isOver5000) {
    shieldReasons.push(`Transfer amount (₹${amount.toLocaleString('en-IN')}) exceeds ₹5,000 threshold`);
    flags.push({
      rule: 'EXCEEDS_5000_LIMIT',
      points: 3,
      explanation: `Amount (₹${amount.toLocaleString('en-IN')}) exceeds safe transfer limit of ₹5,000`,
    });
    score += 3;
  }

  if (isAfter10PM) {
    const timeStr = formatSimulatedTime(context.simulatedTimeHour);
    shieldReasons.push(`Transfer attempted after 10:00 PM (${timeStr})`);
    flags.push({
      rule: 'NIGHT_AFTER_10PM',
      points: 3,
      explanation: `Late night transaction initiated after 10:00 PM (${timeStr})`,
    });
    score += 3;
  }

  const requiresShield = isOver5000 || isAfter10PM;

  // 1. Check NEW_PAYEE rule
  // Is this payee present in default contacts OR completed transaction history?
  const isDefault = context.isDefaultContact;
  const isPayeeInHistory = context.history.some(
    (tx) =>
      tx.status === 'completed' &&
      (tx.payeeName.trim().toLowerCase() === payeeName.trim().toLowerCase() ||
        tx.payeeUpi.trim().toLowerCase() === payeeUpi.trim().toLowerCase())
  );

  const isNewPayee = !isDefault && !isPayeeInHistory;

  if (isNewPayee) {
    flags.push({
      rule: 'NEW_PAYEE',
      points: 2,
      explanation: 'First time transferring money to this person (not in your default contacts)',
    });
    score += 2;
  }

  // 2. Check UNUSUAL_AMOUNT rule
  const validHistory = context.history.filter((tx) => tx.status === 'completed' && tx.amount > 0);
  const rollingAverage =
    validHistory.length > 0
      ? validHistory.reduce((sum, tx) => sum + tx.amount, 0) / validHistory.length
      : 300; // fallback baseline ₹300

  if (amount > 3 * rollingAverage && !isOver5000) {
    flags.push({
      rule: 'UNUSUAL_AMOUNT',
      points: 2,
      explanation: 'Amount is significantly higher than your typical transfer',
    });
    score += 2;
  }

  // 3. Check ROUND_AMOUNT_NEW_PAYEE rule
  const isRoundAmount =
    amount >= 1000 &&
    (amount % 1000 === 0 || amount % 500 === 0 || [5000, 10000, 20000, 25000, 50000].includes(amount));

  if (isNewPayee && isRoundAmount) {
    flags.push({
      rule: 'ROUND_AMOUNT_NEW_PAYEE',
      points: 2,
      explanation: 'Large, round payment to an unfamiliar payee (common scam pattern)',
    });
    score += 2;
  }

  // 4. Check UNUSUAL_TIME rule (general late night if not already flagged)
  if (!isAfter10PM && (context.simulatedTimeHour >= 21 || context.simulatedTimeHour < 6)) {
    flags.push({
      rule: 'UNUSUAL_TIME',
      points: 1,
      explanation: 'Late-night transaction outside your normal daytime hours',
    });
    score += 1;
  }

  // 5. Check HIGH_VELOCITY rule
  const nowMs = new Date(timestamp).getTime();
  const tenMinutesMs = 10 * 60 * 1000;
  const recentTxCount = context.history.filter((tx) => {
    const txTime = new Date(tx.timestamp).getTime();
    return Math.abs(nowMs - txTime) <= tenMinutesMs;
  }).length;

  if (recentTxCount >= 3) {
    flags.push({
      rule: 'HIGH_VELOCITY',
      points: 3,
      explanation: 'Multiple rapid transactions detected in a short time frame',
    });
    score += 3;
  }

  // 6. Check NAME_MISMATCH_WARNING rule
  const nameMismatch =
    context.hasNameMismatch ||
    (Boolean(context.registeredBankName) &&
      Boolean(context.enteredName) &&
      context.registeredBankName?.trim().toLowerCase() !==
        context.enteredName?.trim().toLowerCase() &&
      !context.registeredBankName?.toLowerCase().includes(context.enteredName?.toLowerCase() || ''));

  if (nameMismatch) {
    flags.push({
      rule: 'NAME_MISMATCH_WARNING',
      points: 3,
      explanation: 'Bank account owner name does not match the payee name provided',
    });
    score += 3;
  }

  // Tier Mapping Logic:
  // If requiresShield is true -> immediately CRITICAL or HIGH tier!
  let tier: RiskTier = 'LOW';
  if (requiresShield || score >= 6) {
    tier = 'CRITICAL';
  } else if (score >= 4) {
    tier = 'HIGH';
  } else if (score >= 2 || isNewPayee) {
    tier = 'MEDIUM';
  } else {
    tier = 'LOW';
  }

  // Generate voice synthesis script
  const payeeSpoken = payeeName || 'the recipient';
  const newPayeeText = isNewPayee ? 'for the first time.' : 'from your default contacts.';
  const shieldNotice = requiresShield ? ' Shield guardian approval is required.' : '';
  const voiceScript = `Attention SafePay user. You are paying ${payeeSpoken}, ${amount} rupees, ${newPayeeText}${shieldNotice}`;

  return {
    score,
    tier,
    flags,
    voiceScript,
    requiresShield,
    shieldReasons,
  };
}


export function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
