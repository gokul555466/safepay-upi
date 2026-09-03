import React from 'react';
import { ShieldAlert, Send, Clock, Phone, AlertTriangle, ArrowRight, XCircle } from 'lucide-react';
import { TrustedContact } from '../types';
import { formatRupees, formatSimulatedTime } from '../utils/riskEngine';

interface ShieldRequirementModalProps {
  isOpen: boolean;
  payeeName: string;
  payeeUpi: string;
  amount: number;
  simulatedTimeHour: number;
  trustedContact: TrustedContact;
  onOpenCompanionPhone: () => void;
  onCancel: (reason: string) => void;
}

export const ShieldRequirementModal: React.FC<ShieldRequirementModalProps> = ({
  isOpen,
  payeeName,
  payeeUpi,
  amount,
  simulatedTimeHour,
  trustedContact,
  onOpenCompanionPhone,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isOver5000 = amount > 5000;
  const isNight = simulatedTimeHour >= 22 || simulatedTimeHour < 6;
  const timeString = formatSimulatedTime(simulatedTimeHour);

  return (
    <div
      id="modal-shield-required"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
              Safety Shield Rule Triggered
            </span>
            <h3 className="text-lg font-black leading-tight">
              Request from the Shield is Required
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Main User Requirement Statement */}
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center space-y-1.5">
            <p className="text-lg font-black text-rose-950 leading-snug">
              Request from the Shield is Required
            </p>
            <p className="text-xs text-rose-800 font-semibold">
              An authorization message has been sent to your Shield guardian ({trustedContact.name}).
            </p>
          </div>

          {/* Trigger reasons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Why Shield Authorization is Required:
            </span>
            <div className="space-y-1.5 text-xs font-medium">
              {isOver5000 && (
                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Amount (<strong>{formatRupees(amount)}</strong>) is greater than the <strong>₹5,000</strong> safe threshold.
                  </span>
                </div>
              )}

              {isNight && (
                <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-r-xl text-purple-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    Transaction initiated after <strong>10:00 PM</strong> (Current time: <strong>{timeString}</strong>).
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Pending Transfer
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{formatRupees(amount)}</p>
            <p className="text-xs text-slate-700 mt-1 font-semibold">
              To: {payeeName} ({payeeUpi})
            </p>
          </div>

          {/* SMS / Notification Status */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <p className="font-bold text-white">Emergency Alert Sent</p>
                <p className="text-slate-300 text-[11px]">To: {trustedContact.phone}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCompanionPhone}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              View Alert
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              id="btn-open-shield-companion"
              type="button"
              onClick={onOpenCompanionPhone}
              className="w-full min-h-[50px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <span>Open Guardian Phone Simulator (Priya)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-cancel-shield-transfer"
              type="button"
              onClick={() => onCancel('Cancelled while awaiting Shield approval')}
              className="w-full min-h-[46px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel Transfer (Keep Money Safe)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
