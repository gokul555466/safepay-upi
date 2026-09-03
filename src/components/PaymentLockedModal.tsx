import React from 'react';
import { Lock, ShieldAlert, Phone, Clock, AlertTriangle, Eye } from 'lucide-react';
import { TrustedContact } from '../types';

interface PaymentLockedModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  trustedContact: TrustedContact;
  onViewShieldPhone: () => void;
  onClose: () => void;
}

export const PaymentLockedModal: React.FC<PaymentLockedModalProps> = ({
  isOpen,
  remainingSeconds,
  trustedContact,
  onViewShieldPhone,
  onClose,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      id="modal-payment-locked-5min"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-rose-500 text-slate-900 flex flex-col">
        {/* Header with Warning */}
        <div className="bg-rose-600 text-white p-5 text-center relative">
          <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Lock className="w-8 h-8 text-white animate-pulse" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-900/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
            SECURITY PROTOCOL TRIGGERED
          </span>
          <h2 className="text-xl font-black tracking-tight text-white">
            Payments Locked for 5 Minutes
          </h2>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Live Countdown Card */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
              Lockout Cooldown Remaining
            </span>
            <div className="text-4xl font-mono font-black text-rose-950 mt-1 flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-rose-600 animate-spin" />
              <span>{formattedTime}</span>
            </div>
            <p className="text-[11px] text-rose-600 mt-1">
              3 consecutive wrong UPI PIN entries were detected
            </p>
          </div>

          {/* Shield Notification Sent Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Emergency Message Sent to Shield Guardian:</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 italic text-[11px]">
              "SECURITY ALERT: Anand has entered an incorrect UPI PIN 3 times. All payment features on his phone have been locked for 5 minutes."
            </div>
            <p className="text-[11px] text-slate-500">
              Recipient: <span className="font-bold text-slate-900">{trustedContact.name}</span> ({trustedContact.phone})
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              id="btn-view-shield-companion-alert"
              type="button"
              onClick={onViewShieldPhone}
              className="w-full min-h-[46px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>View Alert on Priya's Phone</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Notice (Keep Locked)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
