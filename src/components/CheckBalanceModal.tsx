import React, { useState } from 'react';
import { Landmark, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatRupees } from '../utils/riskEngine';

interface CheckBalanceModalProps {
  isOpen: boolean;
  balance: number;
  failedAttempts: number;
  onIncorrectPin: (newCount: number) => void;
  onPinLockout: () => void;
  onClose: () => void;
}

export const CheckBalanceModal: React.FC<CheckBalanceModalProps> = ({
  isOpen,
  balance,
  failedAttempts,
  onIncorrectPin,
  onPinLockout,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [isPinEntered, setIsPinEntered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;

    if (pin === '1122') {
      setIsPinEntered(true);
      setErrorMessage(null);
    } else {
      const nextCount = failedAttempts + 1;
      setPin('');
      if (nextCount >= 3) {
        onIncorrectPin(nextCount);
        onPinLockout();
        onClose();
      } else {
        const remaining = 3 - nextCount;
        setErrorMessage(
          `Incorrect PIN! ${remaining} attempt${
            remaining === 1 ? '' : 's'
          } remaining before 5-min lock.`
        );
        onIncorrectPin(nextCount);
      }
    }
  };

  return (
    <div
      id="modal-check-balance"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">State Bank of India</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Savings Account •••• 4092
            </p>
            <h3 className="text-xl font-black text-slate-900">Bank Balance</h3>
          </div>

          {!isPinEntered ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-xs text-slate-600 text-center">
                Enter your 4-digit UPI PIN to view account balance securely:
              </p>

              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center font-black text-xl ${
                      pin.length > idx
                        ? 'border-slate-900 bg-slate-100 text-slate-900'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {pin.length > idx ? '•' : ''}
                  </div>
                ))}
              </div>

              <input
                id="input-upi-pin-balance"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/[^0-9]/g, ''));
                  setErrorMessage(null);
                }}
                placeholder="PIN (1122)"
                autoFocus
                className="w-full min-h-[46px] px-3 py-2 text-center text-lg font-mono font-bold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-900 focus:outline-none"
              />

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPin('1122');
                    setIsPinEntered(true);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                >
                  Quick Fill (1122)
                </button>
                <button
                  type="submit"
                  disabled={pin.length !== 4}
                  className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Confirm PIN
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Available Balance
                </span>
                <p className="text-4xl font-black text-slate-900 mt-1">
                  {formatRupees(balance)}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-2">
                  <CheckCircle2 className="w-3 h-3" /> Verified by NPCI
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[46px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
