import React from 'react';
import {
  ReceiptText,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Smartphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { UtilityBill } from '../types';
import { formatRupees } from '../utils/riskEngine';

interface BillsScreenProps {
  bills: UtilityBill[];
  onPayBill: (bill: UtilityBill) => void;
}

export const BillsScreen: React.FC<BillsScreenProps> = ({ bills, onPayBill }) => {
  const getIcon = (type: UtilityBill['billType']) => {
    switch (type) {
      case 'Electricity':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Water':
        return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'LPG Cylinder':
        return <Flame className="w-6 h-6 text-orange-500" />;
      case 'Broadband':
        return <Wifi className="w-6 h-6 text-purple-500" />;
      case 'Mobile Recharge':
        return <Smartphone className="w-6 h-6 text-emerald-500" />;
      default:
        return <ReceiptText className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <div id="screen-bills" className="space-y-6 pb-6">
      {/* Title & Plain language description */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ReceiptText className="w-6 h-6 text-slate-700" />
          Utility Bills & Recharge
        </h2>
        <p className="text-sm text-slate-600">
          Flat, zero-confusion list. All government utility billers are verified and authentic.
        </p>
      </div>

      {/* Flat List of Bills (No nested menus) */}
      <div className="space-y-3.5">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className={`p-5 bg-white rounded-3xl border-2 shadow-sm transition-all ${
              bill.status === 'due'
                ? 'border-slate-200 hover:border-slate-300'
                : 'border-emerald-100 bg-emerald-50/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(bill.billType)}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {bill.billType}
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight pt-1">
                    {bill.billerName}
                  </h3>
                  <p className="text-xs text-slate-700 font-mono">
                    Consumer ID: {bill.consumerId}
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div className="text-right shrink-0">
                <p className="text-xl font-black text-slate-900">{formatRupees(bill.amount)}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {bill.status === 'due' ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {bill.dueDate}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Paid
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Single Primary Action per card */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Direct Biller</span>
              </div>

              {bill.status === 'due' ? (
                <button
                  id={`btn-pay-bill-${bill.id}`}
                  type="button"
                  onClick={() => onPayBill(bill)}
                  className="min-h-[48px] px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Pay {formatRupees(bill.amount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="min-h-[44px] px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl cursor-default"
                >
                  Receipt Confirmed ✓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
