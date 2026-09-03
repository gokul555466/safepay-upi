import React from 'react';
import { ShieldAlert, BellRing, Phone, XCircle, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { formatRupees } from '../utils/riskEngine';
import { TrustedContact } from '../types';

interface TrustedContactDrawerProps {
  isOpen: boolean;
  trustedContact: TrustedContact;
  payeeName: string;
  amount: number;
  remainingSeconds: number;
  onBlockTransaction: () => void;
  onApproveTransaction: () => void;
  onDismissPreview: () => void;
  shieldReasons?: string[];
  onClose?: () => void;
  alertMode?: 'shield_approval' | 'pin_lockout';
}

export const TrustedContactDrawer: React.FC<TrustedContactDrawerProps> = ({
  isOpen,
  trustedContact,
  payeeName,
  amount,
  remainingSeconds,
  onBlockTransaction,
  onApproveTransaction,
  onDismissPreview,
  shieldReasons,
  onClose,
  alertMode = 'shield_approval',
}) => {
  if (!isOpen) return null;

  const isPinLockout = alertMode === 'pin_lockout';

  return (
    <div
      id="trusted-contact-simulation-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-slate-900/90 backdrop-blur-md p-4 flex flex-col justify-center animate-in slide-in-from-right duration-300 shadow-2xl border-l border-slate-700"
      role="complementary"
      aria-label="Trusted Contact Phone Simulation"
    >
      {/* Smartphone frame representing Priya's Phone */}
      <div className="bg-slate-950 text-slate-100 rounded-[32px] border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Phone Top Notch & Status */}
        <div className="bg-slate-900 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
          <span className="font-semibold text-white">10:35 PM</span>
          <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono">5G</span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Smartphone Screen Header */}
        <div className="px-5 py-3 bg-slate-900/90 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm border border-rose-500/30">
              P
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                {trustedContact.name}
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-medium">
                  Shield Phone
                </span>
              </p>
              <p className="text-xs text-slate-400">Emergency Authorization Request</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
            <BellRing className="w-3.5 h-3.5" />
            <span>Urgent SMS</span>
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Urgent Notification Banner */}
          <div className="bg-gradient-to-br from-rose-950/80 to-slate-900 border-2 border-rose-500/60 rounded-2xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  {isPinLockout ? 'CRITICAL PIN SECURITY LOCKOUT' : 'SHIELD AUTHORIZATION REQUIRED'}
                </span>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  {isPinLockout ? (
                    <>
                      Alert SMS: "Emergency Notice: Anand entered an incorrect UPI PIN 3 times. All payments have been frozen for 5 minutes. If someone is with him or on a call, please check immediately."
                    </>
                  ) : (
                    <>
                      Message: "Anand is attempting to transfer {formatRupees(amount)} to{' '}
                      <span className="text-rose-300 font-bold underline underline-offset-2">
                        {payeeName || 'recipient'}
                      </span>
                      . Shield authorization is required."
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Countdown sync */}
            {remainingSeconds > 0 && (
              <div className="mt-4 pt-3 border-t border-rose-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {isPinLockout ? 'Lockout Remaining:' : 'Hold Window:'}
                </span>
                <span className="font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
                  {remainingSeconds}s
                </span>
              </div>
            )}
          </div>

          {/* Reason list */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {isPinLockout ? 'Security Protocol Details:' : 'Why Shield Request was Triggered:'}
            </div>
            <ul className="space-y-1.5 text-slate-400 pl-1">
              {isPinLockout ? (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>3 consecutive wrong UPI PINs entered on Anand's phone</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Outbound transfers frozen for 5 minutes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Automated SMS sent to registered guardian Priya Sharma</span>
                  </li>
                </>
              ) : shieldReasons && shieldReasons.length > 0 ? (
                shieldReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Amount exceeds ₹5,000 threshold ({formatRupees(amount)})</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Transfer attempted outside safe daytime hours (&gt;10:00 PM)</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Prompt to Daughter */}
          <p className="text-xs text-slate-400 text-center px-2">
            {isPinLockout
              ? 'Priya, please call Dad to make sure he is safe and not being coerced or tricked by a caller.'
              : 'Priya, if your Dad did not call you to confirm this transfer, or someone on the phone is instructing him, block it immediately.'}
          </p>

          {!isPinLockout ? (
            <>
              {/* Primary Action: This Looks Wrong */}
              <button
                id="btn-contact-this-looks-wrong"
                type="button"
                onClick={onBlockTransaction}
                className="w-full min-h-[54px] px-4 py-3.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-rose-950 flex items-center justify-center gap-3 transition-all cursor-pointer transform active:scale-98"
              >
                <XCircle className="w-6 h-6 text-white" />
                <span>Block Transaction (Looks Wrong)</span>
              </button>

              {/* Secondary Action: Looks OK */}
              <button
                id="btn-contact-looks-ok"
                type="button"
                onClick={onApproveTransaction}
                className="w-full min-h-[46px] px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Approve Transfer (I Verified With Dad)</span>
              </button>
            </>
          ) : (
            <button
              id="btn-contact-acknowledged-lock"
              type="button"
              onClick={onClose}
              className="w-full min-h-[50px] px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Acknowledged (Alert Received by Priya)</span>
            </button>
          )}

          {/* Quick Call Dad */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Verify with Dad:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Call Anand (+91 98765 43210)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

