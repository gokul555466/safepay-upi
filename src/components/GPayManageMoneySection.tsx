import React from 'react';
import { Landmark, History, ChevronRight } from 'lucide-react';

interface GPayManageMoneySectionProps {
  onCheckBalance: () => void;
  onViewHistory: () => void;
}

export const GPayManageMoneySection: React.FC<GPayManageMoneySectionProps> = ({
  onCheckBalance,
  onViewHistory,
}) => {
  return (
    <div id="section-manage-money" className="space-y-3">
      <h3 className="text-base font-bold text-slate-900 tracking-tight px-1">
        Manage your money
      </h3>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* Check bank balance */}
        <button
          id="btn-gpay-check-balance"
          type="button"
          onClick={onCheckBalance}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                Check bank balance
              </span>
              <span className="text-xs text-slate-500">
                State Bank of India •••• 4092
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* See transaction history */}
        <button
          id="btn-gpay-view-history"
          type="button"
          onClick={onViewHistory}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                See transaction history
              </span>
              <span className="text-xs text-slate-500">
                All completed, blocked, and safe transactions
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Google Pay Footer Branding */}
      <div className="pt-4 pb-2 text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <span>UPI payments powered by</span>
          <strong className="text-slate-700 font-bold">Google Pay &amp; NPCI</strong>
        </p>
      </div>
    </div>
  );
};
