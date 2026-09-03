import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Clock,
  XCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatRupees } from '../utils/riskEngine';

interface NewContactWarningModalProps {
  isOpen: boolean;
  payeeName: string;
  payeeUpi: string;
  amount: number;
  onProceedAfterWait: () => void;
  onCancel: (reason: string) => void;
}

export const NewContactWarningModal: React.FC<NewContactWarningModalProps> = ({
  isOpen,
  payeeName,
  payeeUpi,
  amount,
  onProceedAfterWait,
  onCancel,
}) => {
  // Phase 1: 'prompt' -> shows "The contact is new, are you sure you want to pay for them?"
  // Phase 2: 'waiting_15s' -> 10-15s wait countdown before proceeding
  const [phase, setPhase] = useState<'prompt' | 'waiting_15s'>('prompt');
  const [countdown, setCountdown] = useState<number>(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPhase('prompt');
      setCountdown(15);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleConfirmPrompt = () => {
    setPhase('waiting_15s');
    setCountdown(15);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          onProceedAfterWait();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-new-contact-warning"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden text-slate-900">
        {/* PHASE 1: Prompt message */}
        {phase === 'prompt' && (
          <div>
            {/* Header */}
            <div className="bg-amber-500 text-white p-5 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                  Non-Default Recipient
                </span>
                <h3 className="text-lg font-black leading-tight">
                  New Contact Notice
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* The exact question requested by user */}
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center">
                <p className="text-base font-extrabold text-amber-950 leading-snug">
                  "The contact is new, are you sure you want to pay for them?"
                </p>
                <p className="text-xs text-amber-800 mt-1 font-medium">
                  This person is not in your 8 default account contacts.
                </p>
              </div>

              {/* Recipient Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Transfer Amount
                </span>
                <p className="text-3xl font-black text-slate-900">{formatRupees(amount)}</p>
                <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Recipient Name: </span>
                  <strong className="text-slate-800 text-sm">{payeeName}</strong>
                  <span className="block text-slate-700 font-mono mt-0.5">{payeeUpi}</span>
                </div>
              </div>

              {/* Informative Notice */}
              <p className="text-xs text-slate-600 text-center">
                Per SafePay security rules, proceeding will trigger a mandatory <strong>10–15 second safety hold</strong> before funds leave your account.
              </p>

              {/* Actions */}
              <div className="space-y-2.5">
                <button
                  id="btn-confirm-new-contact-proceed"
                  type="button"
                  onClick={handleConfirmPrompt}
                  className="w-full min-h-[50px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>Yes, Proceed to Safety Hold</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  id="btn-cancel-new-contact"
                  type="button"
                  onClick={() => onCancel('Cancelled by user at new contact warning')}
                  className="w-full min-h-[46px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  No, Cancel Transfer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: 10-15 Seconds Wait Screen */}
        {phase === 'waiting_15s' && (
          <div>
            <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-0.5">
                    SafePay Protection
                  </span>
                  <h3 className="text-base font-black">15-Second Safety Hold</h3>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-950/70 px-2.5 py-1 rounded-full border border-rose-400">
                00:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
                  Holding payment for new contact
                </p>
                <div className="text-5xl font-black text-rose-600 font-mono my-2">
                  00:{countdown < 10 ? `0${countdown}` : countdown}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-rose-200 h-3 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-rose-600 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(countdown / 15) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 mt-3">
                  Waiting 15 seconds for your protection before sending {formatRupees(amount)} to <strong>{payeeName}</strong>. If anyone on a phone call is rushing you, cancel now!
                </p>
              </div>

              {/* Immediate Cancel Button */}
              <button
                id="btn-cancel-15s-hold"
                type="button"
                onClick={() => onCancel('Cancelled by user during 15s hold')}
                className="w-full min-h-[54px] bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all cursor-pointer transform active:scale-98"
              >
                <XCircle className="w-6 h-6" />
                <span>Cancel Payment Now (Keep Funds Safe)</span>
              </button>

              <p className="text-[11px] text-center text-slate-700">
                If not cancelled, the transaction will automatically proceed when the timer expires.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
