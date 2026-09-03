import React from 'react';
import { ArrowLeft, ArrowUpRight, ShieldCheck, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types';
import { formatRupees } from '../utils/riskEngine';

interface TransactionHistoryScreenProps {
  transactions: Transaction[];
  onBack: () => void;
}

export const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  transactions,
  onBack,
}) => {
  return (
    <div id="screen-transaction-history" className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900">Transaction History</h2>
          <p className="text-xs text-slate-500">
            {transactions.length} recorded payments &amp; safety interventions
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {transactions.map((tx) => {
          const isBlocked = tx.status === 'blocked_contact';
          const isCancelled = tx.status === 'cancelled_user';
          const isCompleted = tx.status === 'completed';

          return (
            <div
              key={tx.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isBlocked
                      ? 'bg-rose-100 text-rose-600'
                      : isCancelled
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {isBlocked ? (
                    <ShieldCheck className="w-6 h-6 text-rose-600" />
                  ) : isCancelled ? (
                    <Clock className="w-6 h-6 text-slate-500" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {tx.displayLabel}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>
                      {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <span
                      className={`font-semibold ${
                        isBlocked
                          ? 'text-rose-600'
                          : isCancelled
                          ? 'text-slate-500'
                          : 'text-emerald-700'
                      }`}
                    >
                      {isBlocked
                        ? 'Blocked by Priya (Money Safe)'
                        : isCancelled
                        ? 'Cancelled by User'
                        : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-base font-black ${
                    isBlocked || isCancelled
                      ? 'text-slate-400 line-through'
                      : 'text-slate-900'
                  }`}
                >
                  -{formatRupees(tx.amount)}
                </p>
                {isBlocked && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    Shield Protected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
