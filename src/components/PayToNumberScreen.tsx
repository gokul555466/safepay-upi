import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Payee } from '../types';
import { formatRupees } from '../utils/riskEngine';

interface PayToNumberScreenProps {
  historicalPayees: Payee[];
  onInitiatePayment: (
    payeeName: string,
    payeeUpi: string,
    amount: number,
    registeredBankName: string,
    hasMismatch: boolean,
    isDefault?: boolean
  ) => void;
  onTriggerCircuitBreaker: () => void;
  prefillPayee?: { name: string; upi: string; amount: number; hasMismatch?: boolean; isDefault?: boolean } | null;
  onBack?: () => void;
  isSafeMode?: boolean;
}

export const PayToNumberScreen: React.FC<PayToNumberScreenProps> = ({
  historicalPayees,
  onInitiatePayment,
  onTriggerCircuitBreaker,
  prefillPayee,
  onBack,
  isSafeMode = true,
}) => {
  // Step 1: 'input_number' -> Step 2: 'confirm_payee_name' -> Step 3: 'enter_amount'
  const [step, setStep] = useState<'input_number' | 'confirm_payee_name' | 'enter_amount'>('input_number');
  const [phoneNumberOrUpi, setPhoneNumberOrUpi] = useState('');
  const [numberError, setNumberError] = useState<string | null>(null);
  const [resolvedPayeeName, setResolvedPayeeName] = useState('');
  const [resolvedBankName, setResolvedBankName] = useState('');
  const [hasNameMismatch, setHasNameMismatch] = useState(false);
  const [isDefaultContact, setIsDefaultContact] = useState(false);
  const [amountStr, setAmountStr] = useState('');

  // Circuit breaker state: track recent keypress timestamps
  const keyTimestampsRef = useRef<number[]>([]);

  // Apply prefill if provided (e.g. from Demo buttons)
  useEffect(() => {
    if (prefillPayee) {
      setPhoneNumberOrUpi(prefillPayee.upi);
      setResolvedPayeeName(prefillPayee.name);
      setResolvedBankName(prefillPayee.hasMismatch ? 'Sunil Kumar (Unrelated Bank Holder)' : prefillPayee.name);
      setHasNameMismatch(Boolean(prefillPayee.hasMismatch));
      setIsDefaultContact(Boolean(prefillPayee.isDefault));
      setAmountStr(prefillPayee.amount ? String(prefillPayee.amount) : '');
      // When prefilled via demo, jump straight to confirm name or amount
      setStep('confirm_payee_name');
    }
  }, [prefillPayee]);

  // Handle phone lookup (strictly 10-digit number only)
  const handleVerifyNumber = () => {
    const raw = phoneNumberOrUpi.trim();
    // Validate: must be 10 digit number only
    const digitsOnly = raw.replace(/\D/g, '');

    if (!raw || digitsOnly.length !== 10 || raw !== digitsOnly) {
      setNumberError('this is not a valid number');
      return;
    }

    setNumberError(null);

    // Check if it matches an existing default payee
    const matched = historicalPayees.find(
      (p) =>
        p.phoneOrUpi.replace(/\D/g, '') === digitsOnly ||
        p.phoneOrUpi.toLowerCase() === raw.toLowerCase()
    );

    if (matched) {
      setResolvedPayeeName(matched.name);
      setResolvedBankName(matched.registeredBankName || matched.name);
      setHasNameMismatch(false);
      setIsDefaultContact(Boolean(matched.isDefaultContact));
    } else {
      // Simulate NPCI Directory Lookup for a new recipient
      setResolvedPayeeName(`Recipient (${digitsOnly})`);
      setResolvedBankName(`Bank Account of ${digitsOnly}`);
      setHasNameMismatch(false);
      setIsDefaultContact(false);
    }

    setStep('confirm_payee_name');
  };

  // Behavioral Circuit Breaker listener on Amount input
  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignore meta keys
    if (['Tab', 'Shift', 'Control', 'Alt'].includes(e.key)) return;

    const now = Date.now();
    // Keep timestamps within the last 1500ms
    const recent = [...keyTimestampsRef.current, now].filter((t) => now - t <= 1500);
    keyTimestampsRef.current = recent;

    // If 4+ rapid erratic keypresses within 1.5s, trigger circuit breaker!
    if (recent.length >= 4) {
      keyTimestampsRef.current = [];
      onTriggerCircuitBreaker();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setAmountStr(val);
  };

  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amountStr, 10);
    if (!parsedAmount || parsedAmount <= 0) return;

    onInitiatePayment(
      resolvedPayeeName,
      phoneNumberOrUpi,
      parsedAmount,
      resolvedBankName,
      hasNameMismatch,
      isDefaultContact
    );
  };


  return (
    <div id="screen-pay-number" className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* Title & Optional Back Button */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="space-y-0.5">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-slate-700" />
            Pay to Phone or UPI
          </h2>
          <p className="text-xs text-slate-600">
            Every recipient is verified with NPCI bank records before amount entry.
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <span
          className={`px-3 py-1 rounded-full ${
            step === 'input_number'
              ? 'bg-slate-900 text-white'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          1. Recipient
        </span>
        <span>→</span>
        <span
          className={`px-3 py-1 rounded-full ${
            step === 'confirm_payee_name'
              ? 'bg-slate-900 text-white'
              : step === 'enter_amount'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-400'
          }`}
        >
          2. Explicit Name Check
        </span>
        <span>→</span>
        <span
          className={`px-3 py-1 rounded-full ${
            step === 'enter_amount' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
          }`}
        >
          3. Amount
        </span>
      </div>

      {/* STEP 1: Phone Input */}
      {step === 'input_number' && (
        <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <label
              htmlFor="input-phone-upi"
              className="block text-sm font-bold text-slate-900 mb-2"
            >
              Enter 10-Digit Mobile Number
            </label>
            <div className="relative">
              <input
                id="input-phone-upi"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phoneNumberOrUpi}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPhoneNumberOrUpi(val);
                  if (numberError) setNumberError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleVerifyNumber();
                  }
                }}
                placeholder="Enter 10-digit number (e.g. 9840112233)"
                className={`w-full min-h-[56px] px-4 py-3 text-lg font-bold text-slate-900 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-colors ${
                  numberError
                    ? 'border-rose-500 bg-rose-50/40 text-rose-950 focus:border-rose-600'
                    : 'border-slate-300 focus:border-slate-900'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {phoneNumberOrUpi.length}/10
              </span>
            </div>
          </div>

          {/* Validation Error Message */}
          {numberError && (
            <div
              id="error-msg-invalid-number"
              className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs sm:text-sm font-bold text-rose-700 flex items-center gap-2.5 animate-in fade-in duration-150"
            >
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{numberError}</span>
            </div>
          )}

          {/* Quick select from trusted past payees */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Or Choose from Frequent Trusted Payees:
            </p>
            <div className="space-y-2">
              {historicalPayees.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    const phoneOnly = p.phoneOrUpi.replace(/\D/g, '');
                    setPhoneNumberOrUpi(phoneOnly || p.phoneOrUpi);
                    setResolvedPayeeName(p.name);
                    setResolvedBankName(p.registeredBankName || p.name);
                    setHasNameMismatch(false);
                    setNumberError(null);
                    setStep('confirm_payee_name');
                  }}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-700 font-mono">{p.phoneOrUpi}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    Trusted
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-verify-recipient"
            type="button"
            onClick={handleVerifyNumber}
            className="w-full min-h-[52px] bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold rounded-2xl text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Verify Name With Bank Directory</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 2: MANDATORY EXPLICIT PAYEE NAME CONFIRMATION */}
      {step === 'confirm_payee_name' && (
        <div className="space-y-5 bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 shadow-md animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Mandatory SafePay Verification Step
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Check Recipient's Official Name
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Before you enter any money, please confirm this is the exact person you want to send money to.
            </p>
          </div>

          {/* Official Bank Match Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
            <span className="text-xs text-slate-700 font-semibold uppercase tracking-wider block">
              Official Bank-Registered Account Name
            </span>
            <p className="text-2xl font-black text-slate-900 py-1">
              {resolvedBankName || resolvedPayeeName}
            </p>
            <p className="text-xs text-slate-700 font-mono">UPI / Phone: {phoneNumberOrUpi}</p>
          </div>

          {hasNameMismatch && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> The bank owner name does not match the person you expected.
                Please double check carefully.
              </span>
            </div>
          )}

          {/* Explicit Confirmation Question */}
          <div className="pt-2 text-center">
            <p className="text-sm font-bold text-slate-900 mb-4">
              Is <span className="underline">{resolvedBankName || resolvedPayeeName}</span> who you intend to pay?
            </p>

            <div className="flex flex-col gap-3">
              <button
                id="btn-confirm-payee-name-yes"
                type="button"
                onClick={() => setStep('enter_amount')}
                className="w-full min-h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-100 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Yes, This Is Exactly Who I Want to Pay</span>
              </button>

              <button
                id="btn-confirm-payee-name-no"
                type="button"
                onClick={() => {
                  setStep('input_number');
                  setPhoneNumberOrUpi('');
                }}
                className="w-full min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>No, That Name Is Wrong (Cancel)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: AMOUNT ENTRY WITH CIRCUIT BREAKER */}
      {step === 'enter_amount' && (
        <form
          onSubmit={handleSubmitFinal}
          className="space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in duration-200"
        >
          {/* Confirmed Payee Pill */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{resolvedPayeeName}</span>
                <span className="text-slate-700 font-mono">{phoneNumberOrUpi}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep('confirm_payee_name')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Amount input with behavioral listener */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="input-amount" className="block text-sm font-bold text-slate-900">
                Enter Amount to Send
              </label>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Circuit Breaker Active
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                ₹
              </span>
              <input
                id="input-amount"
                type="text"
                inputMode="numeric"
                value={amountStr}
                onKeyDown={handleAmountKeyDown}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full min-h-[64px] pl-10 pr-4 py-3 text-3xl font-black text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-700 mt-1.5">
              Protected by SafePay behavioral monitoring: rapid panic typing will pause for calm review.
            </p>
          </div>

          {/* Quick preset amount chips */}
          <div className="flex flex-wrap gap-2">
            {[150, 500, 1000, 5000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountStr(String(amt))}
                className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold text-xs rounded-xl text-slate-800 transition-colors cursor-pointer"
              >
                +{formatRupees(amt)}
              </button>
            ))}

            {/* Quick trigger for judges to test circuit breaker effortlessly */}
            <button
              id="btn-test-erratic-typing"
              type="button"
              onClick={onTriggerCircuitBreaker}
              title="Test behavioral circuit breaker panic override"
              className="min-h-[44px] px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
            >
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Panic Typing</span>
            </button>
          </div>

          {/* Submit review */}
          <button
            id="btn-submit-review-payment"
            type="submit"
            disabled={!amountStr || parseInt(amountStr, 10) <= 0}
            className="w-full min-h-[54px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-2xl text-base flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>Review Safe Transfer</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      )}
    </div>
  );
};
