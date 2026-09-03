import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, Fingerprint, Lock, PhoneCall, RefreshCw } from 'lucide-react';

interface CircuitBreakerModalProps {
  isOpen: boolean;
  onResolve: () => void;
  onEmergencyAbort: () => void;
  trustedContactName: string;
  trustedContactPhone: string;
}

export const CircuitBreakerModal: React.FC<CircuitBreakerModalProps> = ({
  isOpen,
  onResolve,
  onEmergencyAbort,
  trustedContactName,
  trustedContactPhone,
}) => {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isBiometricVerifying, setIsBiometricVerifying] = useState(false);

  if (!isOpen) return null;

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // Any 4 digits will verify for demo purposes, e.g. 1234
        setTimeout(() => {
          setPin('');
          setPinError(false);
          onResolve();
        }, 400);
      }
    }
  };

  const handleBiometric = () => {
    setIsBiometricVerifying(true);
    setTimeout(() => {
      setIsBiometricVerifying(false);
      onResolve();
    }, 900);
  };

  return (
    <div
      id="circuit-breaker-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="circuit-breaker-title"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-rose-500 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Header alert */}
        <div className="bg-rose-600 text-white p-5 flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider uppercase bg-white/25 px-2 py-0.5 rounded text-white inline-block mb-1">
              SafePay Behavioral Circuit Breaker
            </span>
            <h2 id="circuit-breaker-title" className="text-xl font-black leading-tight">
              Rapid Erratic Typing Detected
            </h2>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-950 space-y-1">
            <p className="font-semibold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              Protection Triggered
            </p>
            <p className="text-slate-700">
              4+ frantic keypresses were detected within 1.5 seconds. In real UPI scams, callers
              often rush or coerce victims into typing rapidly.
            </p>
            <p className="text-slate-900 font-bold pt-1">
              Take a slow, deep breath. Your money is completely safe.
            </p>
          </div>

          {/* Quick Biometric Option */}
          <button
            id="btn-biometric-verify"
            type="button"
            onClick={handleBiometric}
            disabled={isBiometricVerifying}
            className="w-full min-h-[52px] px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer disabled:opacity-75"
          >
            {isBiometricVerifying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                <span>Verifying Biometrics...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-6 h-6 text-emerald-400" />
                <span>Calm Down & Tap Fingerprint to Resume</span>
              </>
            )}
          </button>

          {/* Or PIN entry */}
          <div className="pt-2 border-t border-slate-200 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Or Enter 4-digit SafePay PIN
            </p>
            <div className="flex justify-center gap-3 mb-3">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-black ${
                    pin.length > idx
                      ? 'border-slate-800 bg-slate-100 text-slate-900'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  {pin.length > idx ? '•' : ''}
                </div>
              ))}
            </div>

            {/* Simple numeric keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === 'C') setPin('');
                    else if (item === '⌫') setPin((p) => p.slice(0, -1));
                    else handlePinDigit(item);
                  }}
                  className="min-h-[48px] py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold rounded-lg text-slate-800 text-base transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency cancel & call contact */}
          <button
            id="btn-emergency-contact"
            type="button"
            onClick={onEmergencyAbort}
            className="w-full min-h-[48px] px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-rose-700" />
            <span>I Feel Pressured — Cancel & Call {trustedContactName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
