import React from 'react';
import {
  Send,
  Smartphone,
  QrCode,
  Users,
  Building2,
  ReceiptText,
  Repeat,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface GPayActionsGridProps {
  isSafeMode: boolean;
  onSelectPayAnyone: () => void;
  onSelectRecharge: () => void;
  onSelectScanQR: () => void;
  onSelectBills: () => void;
}

export const GPayActionsGrid: React.FC<GPayActionsGridProps> = ({
  isSafeMode,
  onSelectPayAnyone,
  onSelectRecharge,
  onSelectScanQR,
  onSelectBills,
}) => {
  // If Safe Mode is ON: Only "Pay anyone" and "Recharge only" as requested!
  if (isSafeMode) {
    return (
      <div id="safe-mode-actions-section" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Safe Mode Options (Pay anyone & Recharge only)
          </h3>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            2 Options Only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Pay Anyone */}
          <button
            id="btn-action-pay-anyone"
            type="button"
            onClick={onSelectPayAnyone}
            className="p-4 bg-white hover:bg-emerald-50/50 active:bg-emerald-100/50 border-2 border-emerald-500/40 hover:border-emerald-600 rounded-2xl flex items-center justify-between shadow-xs transition-all cursor-pointer group text-left min-h-[76px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 block group-hover:text-emerald-800 transition-colors">
                  Pay anyone
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Mobile number, UPI ID, or default contacts
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* 2. Recharge Only */}
          <button
            id="btn-action-recharge-only"
            type="button"
            onClick={onSelectRecharge}
            className="p-4 bg-white hover:bg-blue-50/50 active:bg-blue-100/50 border-2 border-blue-500/40 hover:border-blue-600 rounded-2xl flex items-center justify-between shadow-xs transition-all cursor-pointer group text-left min-h-[76px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 block group-hover:text-blue-800 transition-colors">
                  Recharge only
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Prepaid mobile & DTH recharge plans
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // If Safe Mode is OFF: Standard Google Pay 4x2 grid of action circles
  const standardActions = [
    {
      id: 'scan-qr',
      label: 'Scan any QR code',
      icon: QrCode,
      onClick: onSelectScanQR,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'pay-contacts',
      label: 'Pay contacts',
      icon: Users,
      onClick: onSelectPayAnyone,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'pay-phone',
      label: 'Pay phone number',
      icon: Send,
      onClick: onSelectPayAnyone,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'bank-transfer',
      label: 'Bank transfer',
      icon: Building2,
      onClick: onSelectPayAnyone,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'pay-upi-id',
      label: 'Pay UPI ID',
      icon: Send,
      onClick: onSelectPayAnyone,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'self-transfer',
      label: 'Self transfer',
      icon: Repeat,
      onClick: onSelectPayAnyone,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      id: 'pay-bills',
      label: 'Pay bills',
      icon: ReceiptText,
      onClick: onSelectBills,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'mobile-recharge',
      label: 'Mobile recharge',
      icon: Smartphone,
      onClick: onSelectRecharge,
      color: 'bg-sky-50 text-sky-600',
    },
  ];

  return (
    <div id="standard-mode-actions-section" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Payment Services (Standard Mode)
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">8 Services Available</span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {standardActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={`btn-standard-${action.id}`}
              type="button"
              onClick={action.onClick}
              className="flex flex-col items-center justify-start text-center p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div
                className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-xs`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-800 leading-tight line-clamp-2">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
