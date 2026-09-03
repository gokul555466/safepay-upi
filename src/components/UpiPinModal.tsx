import React, { useState } from 'react';
import {
  Lock,
  X,
  Delete,
  Check,
  Landmark,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { formatRupees } from '../utils/riskEngine';

interface UpiPinModalProps {
  isOpen: boolean;
  purpose: 'payment' | 'balance';
  amount?: number;
  payeeName?: string;
  failedAttempts: number;
  onSuccess: () => void;
  onIncorrectPin: (newFailedCount: number) => void;
  onLockout: () => void;
  onCancel: () => void;
}

export const UpiPinModal: React.FC<UpiPinModalProps> = ({
  isOpen,
  purpose,
  amount = 0,
  payeeName = '',
  failedAttempts,
  onSuccess,
  onIncorrectPin,
  onLockout,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setErrorMessage(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleSubmit = (pinToVerify?: string) => {
    const currentPin = pinToVerify || pin;
    if (currentPin.length !== 4) return;

    if (currentPin === '1122') {
      // Correct PIN!
      setErrorMessage(null);
      setPin('');
      onSuccess();
    } else {
      // Incorrect PIN
      const nextCount = failedAttempts + 1;
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin('');

      if (nextCount >= 3) {
        onIncorrectPin(nextCount);
        onLockout();
      } else {
        const remaining = 3 - nextCount;
        setErrorMessage(
          `Incorrect UPI PIN! ${remaining} attempt${
            remaining === 1 ? '' : 's'
          } left before 5-minute security lock.`
        );
        onIncorrectPin(nextCount);
      }
    }
  };

  return (
    <div
      id="modal-upi-pin-entry"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 flex flex-col">
        {/* UPI Bank Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-wide">
              STATE BANK OF INDIA • UPI
            </span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transaction Summary */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
              {purpose === 'payment' ? 'Paying To' : 'Service'}
            </span>
            <span className="font-bold text-slate-900 truncate max-w-[180px] block">
              {purpose === 'payment' ? payeeName : 'Check Bank Balance'}
            </span>
          </div>
          {purpose === 'payment' && (
            <div className="text-right">
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                Amount
              </span>
              <span className="font-black text-slate-900 text-sm">
                {formatRupees(amount)}
              </span>
            </div>
          )}
        </div>

        {/* PIN Entry Body */}
        <div className="p-5 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-slate-900">
              ENTER 4-DIGIT UPI PIN
            </h3>
            <p className="text-[11px] text-slate-500">
              Authorized PIN is <span className="font-mono font-bold text-slate-900">1122</span>
            </p>
          </div>

          {/* Dot Display */}
          <div
            className={`flex justify-center items-center gap-3.5 py-1 ${
              shake ? 'animate-bounce' : ''
            }`}
          >
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                  pin.length > idx
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-300 bg-slate-50 text-transparent'
                }`}
              >
                {pin.length > idx ? '●' : '○'}
              </div>
            ))}
          </div>

          {/* Error & Warning Display */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {failedAttempts > 0 && !errorMessage && (
            <div className="text-center text-xs font-semibold text-amber-700 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200">
              Warning: {failedAttempts} of 3 attempts used
            </div>
          )}

          {/* On-Screen Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold text-lg rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              title="Delete last digit"
              className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold text-lg rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={pin.length !== 4}
              title="Confirm UPI PIN"
              className="h-12 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer font-bold shadow-xs"
            >
              <Check className="w-6 h-6" />
            </button>
          </div>

          {/* Quick 1122 Demo Fill Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => {
                setPin('1122');
                handleSubmit('1122');
              }}
              className="text-blue-600 hover:text-blue-800 font-bold py-1 px-2 rounded-lg bg-blue-50 cursor-pointer"
            >
              Auto-Fill Correct PIN (1122)
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700 font-semibold py-1 px-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
