import React from 'react';
import { CheckCircle2, ShieldAlert, ShieldCheck, ArrowRight, UserX, PhoneCall } from 'lucide-react';
import { formatRupees } from '../utils/riskEngine';

interface SuccessBlockedModalProps {
  type: 'success' | 'blocked_contact' | 'cancelled_user' | null;
  payeeName: string;
  amount: number;
  remainingBalance: number;
  contactName: string;
  onClose: () => void;
}

export const SuccessBlockedModal: React.FC<SuccessBlockedModalProps> = ({
  type,
  payeeName,
  amount,
  remainingBalance,
  contactName,
  onClose,
}) => {
  if (!type) return null;

  return (
    <div
      id="modal-result-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-8 text-center space-y-6 border border-slate-200">
        {type === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Safe Payment Completed
              </span>
              <h2 className="text-2xl font-black text-slate-900 pt-2">Money Sent Successfully</h2>
              <p className="text-3xl font-black text-slate-900 py-1">{formatRupees(amount)}</p>
              <p className="text-slate-600 text-sm">
                Sent safely to <span className="font-bold text-slate-900">{payeeName}</span>
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-sm text-slate-600 flex justify-between items-center">
              <span>Updated Bank Balance:</span>
              <span className="font-bold text-slate-900 text-base">
                {formatRupees(remainingBalance)}
              </span>
            </div>

            <button
              id="btn-result-success-done"
              type="button"
              onClick={onClose}
              className="w-full min-h-[52px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-base transition-colors cursor-pointer"
            >
              Done & Return to Balance
            </button>
          </>
        )}

        {type === 'blocked_contact' && (
          <>
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-rose-200 animate-pulse">
              <ShieldAlert className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Guarded Intervention
              </span>
              <h2 className="text-2xl font-black text-slate-900">Transaction Blocked by {contactName}</h2>
              <p className="text-slate-700 text-sm leading-relaxed">
                Priya reviewed the alert on her companion phone and tapped{' '}
                <strong className="text-rose-600">"This Looks Wrong"</strong>. The transfer was halted
                instantly.
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-sm text-emerald-950 text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                100% of Funds Retained
              </p>
              <p className="text-xs text-emerald-900">
                No money left your account. Your bank balance remains at{' '}
                <strong>{formatRupees(remainingBalance)}</strong>.
              </p>
            </div>

            <button
              id="btn-result-blocked-done"
              type="button"
              onClick={onClose}
              className="w-full min-h-[52px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-base transition-colors cursor-pointer"
            >
              Back to Safe Balance
            </button>
          </>
        )}

        {type === 'cancelled_user' && (
          <>
            <div className="w-20 h-20 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-12 h-12 text-slate-700" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                Transfer Cancelled
              </span>
              <h2 className="text-2xl font-black text-slate-900 pt-2">Payment Was Not Sent</h2>
              <p className="text-slate-600 text-sm">
                You cancelled the transfer. Zero money was deducted from your account.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-sm text-slate-600 flex justify-between items-center">
              <span>Your Safe Balance:</span>
              <span className="font-bold text-slate-900 text-base">
                {formatRupees(remainingBalance)}
              </span>
            </div>

            <button
              id="btn-result-cancelled-done"
              type="button"
              onClick={onClose}
              className="w-full min-h-[52px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-base transition-colors cursor-pointer"
            >
              Done & Return to Balance
            </button>
          </>
        )}
      </div>
    </div>
  );
};
