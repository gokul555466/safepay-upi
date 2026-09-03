import React from 'react';
import {
  QrCode,
  Smartphone,
  Send,
  Landmark,
  ShieldCheck,
  PowerOff,
  Clock,
  AlertTriangle,
  Lock,
  History,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { TrustedContact, Transaction } from '../types';
import { formatRupees } from '../utils/riskEngine';

interface SafeModeScreenProps {
  trustedContact: TrustedContact;
  transactions: Transaction[];
  onSelectScanQR: () => void;
  onSelectRecharge: () => void;
  onSelectPayAnyone: () => void;
  onSelectCheckBalance: () => void;
  onViewAllHistory: () => void;
  onExitSafeMode: () => void;
  lockoutRemainingSeconds: number;
}

export const SafeModeScreen: React.FC<SafeModeScreenProps> = ({
  trustedContact,
  transactions,
  onSelectScanQR,
  onSelectRecharge,
  onSelectPayAnyone,
  onSelectCheckBalance,
  onViewAllHistory,
  onExitSafeMode,
  lockoutRemainingSeconds,
}) => {
  const isLocked = lockoutRemainingSeconds > 0;
  const lockMinutes = Math.floor(lockoutRemainingSeconds / 60);
  const lockSeconds = lockoutRemainingSeconds % 60;
  const lockTimeFormatted = `${String(lockMinutes).padStart(2, '0')}:${String(
    lockSeconds
  ).padStart(2, '0')}`;

  return (
    <div id="safe-mode-dedicated-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Safe Mode Top Status Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 shadow-lg border border-emerald-500 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  SAFE MODE
                </h1>
                <span className="bg-white text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Shield Guardian:{' '}
                <span className="font-bold underline underline-offset-2">
                  {trustedContact.name}
                </span>{' '}
                ({trustedContact.relationship})
              </p>
            </div>
          </div>

          <button
            id="btn-exit-safe-mode"
            type="button"
            onClick={onExitSafeMode}
            title="Exit Safe Mode and return to standard Google Pay"
            className="px-3 py-1.5 bg-black/25 hover:bg-black/40 text-white text-xs font-bold rounded-xl border border-white/25 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <PowerOff className="w-3.5 h-3.5 text-emerald-300" />
            <span>Turn Off</span>
          </button>
        </div>

        <p className="text-xs text-emerald-100/90 mt-3 pt-3 border-t border-emerald-500/50">
          Simplified &amp; scam-protected layout. Limited strictly to essential verified tasks.
        </p>
      </div>

      {/* Security Lockout Banner (if PIN locked) */}
      {isLocked && (
        <div
          id="safe-mode-lockout-banner"
          className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-center gap-3 text-rose-900 shadow-sm animate-pulse"
        >
          <Lock className="w-6 h-6 text-rose-600 shrink-0" />
          <div className="flex-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-800">
              Payments Temporarily Locked
            </h4>
            <p className="text-xs text-rose-700 mt-0.5">
              3 wrong PIN attempts entered. Cooldown remaining:{' '}
              <span className="font-mono font-bold text-rose-900 bg-rose-200 px-1.5 py-0.5 rounded">
                {lockTimeFormatted}
              </span>
              . {trustedContact.name} was alerted.
            </p>
          </div>
        </div>
      )}

      {/* The 4 Strict Safe Mode Options */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Select an Action (Safe Mode Only)
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
            4 Options
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Option 1: Scan anything */}
          <button
            id="btn-safemode-qr-scanner"
            type="button"
            onClick={onSelectScanQR}
            className="p-4 bg-white hover:bg-blue-50/50 active:bg-blue-100/50 border-2 border-slate-200 hover:border-blue-500 rounded-2xl text-left shadow-xs transition-all flex items-start gap-4 cursor-pointer group"
          >
            <div className="w-13 h-13 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <QrCode className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                  Scan anything
                </h3>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  Scan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scan QR codes by placing photo from File Explorer or using camera
              </p>
            </div>
          </button>

          {/* Option 2: Mobile Recharge */}
          <button
            id="btn-safemode-mobile-recharge"
            type="button"
            onClick={onSelectRecharge}
            className="p-4 bg-white hover:bg-emerald-50/50 active:bg-emerald-100/50 border-2 border-slate-200 hover:border-emerald-500 rounded-2xl text-left shadow-xs transition-all flex items-start gap-4 cursor-pointer group"
          >
            <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Smartphone className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                  Mobile Recharge
                </h3>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Recharge
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Recharge prepaid phone plans for Airtel, Jio, Vi, and BSNL
              </p>
            </div>
          </button>

          {/* Option 3: Pay anyone */}
          <button
            id="btn-safemode-pay-anyone"
            type="button"
            onClick={onSelectPayAnyone}
            className="p-4 bg-white hover:bg-indigo-50/50 active:bg-indigo-100/50 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl text-left shadow-xs transition-all flex items-start gap-4 cursor-pointer group"
          >
            <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Send className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700">
                  Pay anyone
                </h3>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                  Send
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Send money to 10-digit mobile number or verified contact
              </p>
            </div>
          </button>

          {/* Option 4: Check Balance */}
          <button
            id="btn-safemode-check-balance"
            type="button"
            onClick={onSelectCheckBalance}
            className="p-4 bg-white hover:bg-amber-50/50 active:bg-amber-100/50 border-2 border-slate-200 hover:border-amber-500 rounded-2xl text-left shadow-xs transition-all flex items-start gap-4 cursor-pointer group"
          >
            <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Landmark className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800">
                  Check Balance
                </h3>
                <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  SBI Balance
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check your State Bank of India account balance securely
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Transaction History (Rendered directly below Check Balance) */}
      <div id="safemode-transaction-history-section" className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Transaction History
            </h3>
          </div>
          <button
            type="button"
            onClick={onViewAllHistory}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {transactions.slice(0, 4).map((tx) => {
            const isBlocked = tx.status === 'blocked_contact';
            const isCancelled = tx.status === 'cancelled_user';
            const isCompleted = tx.status === 'completed';

            return (
              <div
                key={tx.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isBlocked
                        ? 'bg-rose-100 text-rose-600'
                        : isCancelled
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {isBlocked ? (
                      <ShieldCheck className="w-5 h-5 text-rose-600" />
                    ) : isCancelled ? (
                      <Clock className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {tx.displayLabel}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {isBlocked
                        ? 'Blocked by Priya Sharma (Shield)'
                        : isCancelled
                        ? 'Cancelled safely by you'
                        : `${tx.date} • Bank account`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-black font-mono block ${
                      isBlocked
                        ? 'text-rose-600 line-through'
                        : isCancelled
                        ? 'text-slate-400'
                        : 'text-slate-900'
                    }`}
                  >
                    {formatRupees(tx.amount)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                      isBlocked
                        ? 'bg-rose-50 text-rose-700'
                        : isCancelled
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isBlocked ? 'Blocked' : isCancelled ? 'Cancelled' : 'Completed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
