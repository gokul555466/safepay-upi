export interface User {
  id: string;
  name: string;
  phone: string;
  preferred_language: string;
  accessibility_prefs: {
    high_contrast: boolean;
    large_text: boolean;
  };
}

export interface TrustedContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface Payee {
  id: string;
  name: string;
  upi_id: string;
  first_seen_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  payee_id: string;
  amount: number;
  timestamp: string;
  tier: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  status: 'pending' | 'completed' | 'failed';
}

export interface RiskFlag {
  id: string;
  transaction_id: string;
  rule_name: string;
  explanation_text: string;
}
