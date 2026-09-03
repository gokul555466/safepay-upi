import React from 'react';
import {
  ShieldCheck,
  QrCode,
  Phone,
  ReceiptText,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react';
import { Transaction, TrustedContact, ScreenType } from '../types';
import { formatRupees } from '../utils/riskEngine';

interface BalanceScreenProps {
  balance: number;
  recentTransactions: Transaction[];
  trustedContact: TrustedContact;
  onNavigate: (screen: ScreenType) => void;
  onTriggerDemo1: () => void;
  onTriggerDemo2: () => void;
}

export const BalanceScreen: React.FC<BalanceScreenProps> = ({
  balance,
  recentTransactions,
  trustedContact,
  onNavigate,
  onTriggerDemo1,
  onTriggerDemo2,
}) => {
  // Take last 3 transactions for large, uncluttered display
  const last3 = recentTransactions.slice(0, 3);

  return (
    <div id="screen-balance" className="space-y-6 pb-6">
      {/* 1. Large Balance Card */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative shield glow */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Bank Account Balance
          </span>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 font-medium">
            State Bank of India (••4092)
          </span>
        </div>

        {/* Big, Clear Balance Typography */}
        <div className="mt-4 mb-2">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Available to Spend
          </p>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
            {formatRupees(balance)}
          </div>
        </div>

        {/* Guarded by Priya pill */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <span>
              SafePay Shield active with <strong className="text-white">{trustedContact.name}</strong>
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            Protected
          </span>
        </div>
      </div>

      {/* 2. Quick Primary Action Buttons (Accessible, min 48px height) */}
      <div className="grid grid-cols-3 gap-3">
        <button
          id="btn-quick-scan-qr"
          type="button"
          onClick={() => onNavigate('scan')}
          className="min-h-[76px] p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-all group cursor-pointer active:scale-98"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Scan QR</span>
        </button>

        <button
          id="btn-quick-pay-number"
          type="button"
          onClick={() => onNavigate('pay')}
          className="min-h-[76px] p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-all group cursor-pointer active:scale-98"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Pay Phone</span>
        </button>

        <button
          id="btn-quick-pay-bills"
          type="button"
          onClick={() => onNavigate('bills')}
          className="min-h-[76px] p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-all group cursor-pointer active:scale-98"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <ReceiptText className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Utility Bills</span>
        </button>
      </div>

      {/* 3. Last 3 Transactions with Plain-Language Labels */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Last 3 Payments (Plain Language)
          </h2>
          <span className="text-xs text-slate-600 font-semibold">No cryptic codes</span>
        </div>

        <div className="space-y-2.5">
          {last3.map((tx) => (
            <div
              key={tx.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.status === 'blocked_contact'
                      ? 'bg-rose-100 text-rose-600'
                      : tx.status === 'cancelled_user'
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tx.status === 'blocked_contact' ? (
                    <ShieldCheck className="w-6 h-6 text-rose-600" />
                  ) : tx.status === 'cancelled_user' ? (
                    <Clock className="w-6 h-6 text-slate-500" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-slate-700" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {tx.displayLabel}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    • {tx.status === 'completed' ? 'Paid via SafePay' : tx.status === 'blocked_contact' ? 'Blocked by Priya' : 'Cancelled'}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-base font-extrabold ${
                    tx.status === 'blocked_contact' || tx.status === 'cancelled_user'
                      ? 'text-slate-600 line-through'
                      : 'text-slate-900'
                  }`}
                >
                  -{formatRupees(tx.amount)}
                </p>
                {tx.status === 'blocked_contact' && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    Money Safe
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Demo Shortcuts for Judge Evaluation */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Judge Quick Test Triggers:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onTriggerDemo1}
            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors"
          >
            <span>▶ Demo 1: Safe Transfer (LOW)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onTriggerDemo2}
            className="px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors"
          >
            <span>▶ Demo 2: Scam Test (CRITICAL)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
