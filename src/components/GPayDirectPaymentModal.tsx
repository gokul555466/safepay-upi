import React, { useState } from 'react';
import { X, Landmark, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import { Payee } from '../types';
import { formatRupees } from '../utils/riskEngine';

interface GPayDirectPaymentModalProps {
  isOpen: boolean;
  contact: Payee | null;
  onClose: () => void;
  onSubmitPayment: (
    payeeName: string,
    payeeUpi: string,
    amount: number,
    registeredBankName: string,
    isDefault: boolean
  ) => void;
}

export const GPayDirectPaymentModal: React.FC<GPayDirectPaymentModalProps> = ({
  isOpen,
  contact,
  onClose,
  onSubmitPayment,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const quickAmounts = [150, 500, 2000, 5500];

  if (!isOpen || !contact) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr, 10);
    if (!amount || amount <= 0) return;

    onSubmitPayment(
      contact.name,
      contact.phoneOrUpi,
      amount,
      contact.registeredBankName || contact.name,
      contact.isDefaultContact
    );
  };

  const parsedAmount = parseInt(amountStr, 10) || 0;

  return (
    <div
      id="modal-gpay-payment-sheet"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in slide-in-from-bottom-6 duration-200">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Google Pay Transfer
            </span>
            {contact.isDefaultContact && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Default Contact
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-6">
          {/* Recipient Profile Info */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-18 h-18 rounded-full ${
                contact.avatarBg || 'bg-blue-600'
              } ${
                contact.avatarColor || 'text-white'
              } font-bold text-2xl flex items-center justify-center shadow-md ring-4 ring-slate-100 mb-2`}
            >
              {contact.avatarInitials || contact.name.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="text-lg font-black text-slate-900">{contact.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{contact.phoneOrUpi}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Banking Name: {contact.registeredBankName || contact.name}
            </p>
          </div>

          {/* Amount Box */}
          <div className="space-y-3">
            <div className="relative flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black text-slate-400 mr-1">
                ₹
              </span>
              <input
                id="input-gpay-amount"
                type="text"
                inputMode="numeric"
                autoFocus
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                className="w-48 text-center text-4xl sm:text-5xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex justify-center gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmountStr(String(q))}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    parsedAmount === q
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  +{formatRupees(q)}
                </button>
              ))}
            </div>

            {/* Rule Callouts if > 5000 */}
            {parsedAmount > 5000 && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-center text-xs font-semibold text-rose-800 flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Over ₹5,000: Shield authorization from Priya will be required!</span>
              </div>
            )}
          </div>

          {/* Paying Bank Account Indicator */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">
                  State Bank of India •••• 4092
                </span>
                <span className="text-[11px] text-slate-500">Savings Account</span>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600">Change</span>
          </div>

          {/* Pay Button */}
          <button
            id="btn-confirm-gpay-payment"
            type="submit"
            disabled={!parsedAmount || parsedAmount <= 0}
            className="w-full min-h-[54px] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-base rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-98"
          >
            <span>Pay {parsedAmount > 0 ? formatRupees(parsedAmount) : ''}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
