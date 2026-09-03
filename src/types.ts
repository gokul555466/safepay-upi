export type ScreenType =
  | 'home'
  | 'safe_mode_page'
  | 'scan'
  | 'pay_anyone'
  | 'recharge'
  | 'bills'
  | 'history'
  | 'balance_view';

export interface User {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  preferredLanguage: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface Payee {
  id: string;
  name: string;
  phoneOrUpi: string;
  registeredBankName?: string;
  category: 'groceries' | 'utilities' | 'medical' | 'personal' | 'unknown' | 'bills' | 'family';
  isDefaultContact: boolean;
  avatarBg?: string;
  avatarColor?: string;
  avatarInitials?: string;
}

export interface Transaction {
  id: string;
  payeeName: string;
  payeeUpi: string;
  amount: number;
  timestamp: string; // ISO string
  displayLabel: string; // e.g. "Sent to Ramesh Groceries"
  category: string;
  status: 'completed' | 'cancelled_user' | 'blocked_contact' | 'pending';
  riskTier?: RiskTier;
  riskReasons?: string[];
  shieldApproved?: boolean;
}

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskRuleCode =
  | 'NEW_PAYEE'
  | 'UNUSUAL_AMOUNT'
  | 'ROUND_AMOUNT_NEW_PAYEE'
  | 'UNUSUAL_TIME'
  | 'HIGH_VELOCITY'
  | 'NAME_MISMATCH_WARNING'
  | 'EXCEEDS_5000_LIMIT'
  | 'NIGHT_AFTER_10PM';

export interface RiskFlag {
  rule: RiskRuleCode;
  points: number;
  explanation: string;
}

export interface RiskEvaluation {
  score: number;
  tier: RiskTier;
  flags: RiskFlag[];
  voiceScript: string;
  requiresShield: boolean;
  shieldReasons: string[];
}

export interface UtilityBill {
  id: string;
  billerName: string;
  consumerId: string;
  billType: 'Electricity' | 'Water' | 'LPG Cylinder' | 'Broadband' | 'Mobile Recharge';
  amount: number;
  dueDate: string;
  status: 'due' | 'paid';
  icon: string;
}

export interface RechargePlan {
  id: string;
  amount: number;
  validity: string;
  data: string;
  description: string;
  category: 'Popular' | 'Data' | 'Unlimited';
}

