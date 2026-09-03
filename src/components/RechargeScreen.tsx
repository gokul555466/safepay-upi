import React, { useState } from 'react';
import { Smartphone, Zap, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RechargePlan } from '../types';
import { initialRechargePlans } from '../data/initialData';
import { formatRupees } from '../utils/riskEngine';

interface RechargeScreenProps {
  onBack: () => void;
  onExecuteRecharge: (phone: string, operator: string, amount: number, planDesc: string) => void;
}

export const RechargeScreen: React.FC<RechargeScreenProps> = ({
  onBack,
  onExecuteRecharge,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [selectedOperator, setSelectedOperator] = useState('Jio Prepaid');
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan>(initialRechargePlans[0]);

  const operators = ['Jio Prepaid', 'Airtel Prepaid', 'Vi Prepaid', 'BSNL'];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    onExecuteRecharge(
      phoneNumber,
      selectedOperator,
      selectedPlan.amount,
      `${selectedOperator} (${selectedPlan.data}, ${selectedPlan.validity})`
    );
  };

  return (
    <div id="screen-recharge-only" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Mobile Recharge
          </h2>
          <p className="text-xs text-slate-500">Fast, secure prepaid & data recharges</p>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        {/* Mobile Number Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <label htmlFor="input-recharge-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
              +91
            </span>
            <input
              id="input-recharge-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 10-digit number"
              maxLength={10}
              className="w-full min-h-[50px] pl-13 pr-4 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Operator Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Select Operator:
            </span>
            <div className="flex flex-wrap gap-2">
              {operators.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setSelectedOperator(op)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    selectedOperator === op
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Recommended Plans
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Instant Activation
            </span>
          </div>

          <div className="space-y-2.5">
            {initialRechargePlans.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">
                          {formatRupees(plan.amount)}
                        </span>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {plan.validity}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {plan.data}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pay Button */}
        <div className="pt-2 sticky bottom-20 z-20">
          <button
            id="btn-confirm-recharge-submit"
            type="submit"
            disabled={!phoneNumber || phoneNumber.length < 10}
            className="w-full min-h-[54px] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-base rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Recharge {formatRupees(selectedPlan.amount)}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
