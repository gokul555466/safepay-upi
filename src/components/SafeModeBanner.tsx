import React from 'react';
import { ShieldCheck, ShieldAlert, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import { TrustedContact } from '../types';

interface SafeModeBannerProps {
  isSafeMode: boolean;
  onToggleSafeMode: () => void;
  trustedContact: TrustedContact;
}

export const SafeModeBanner: React.FC<SafeModeBannerProps> = ({
  isSafeMode,
  onToggleSafeMode,
  trustedContact,
}) => {
  return (
    <div
      id="safe-mode-toggle-card"
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
        isSafeMode
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50/70 to-blue-50/60 border-emerald-300'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-xs ${
                isSafeMode
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isSafeMode ? (
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-slate-900">
                  SAFE MODE
                </h2>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSafeMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSafeMode ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isSafeMode
                  ? 'Active: Only Pay anyone & Recharge allowed'
                  : 'Standard UPI mode (all features enabled)'}
              </p>
            </div>
          </div>

          {/* Google Material 3 Toggle Switch */}
          <button
            id="toggle-safe-mode-switch"
            type="button"
            role="switch"
            aria-checked={isSafeMode}
            onClick={onToggleSafeMode}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shrink-0 ${
              isSafeMode ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                isSafeMode
                  ? 'translate-x-6 text-emerald-700'
                  : 'translate-x-0 text-slate-400'
              }`}
            >
              {isSafeMode ? '✓' : ''}
            </div>
          </button>
        </div>

        {/* Protection Explanatory Rule Callout */}
        <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Guarded by <strong className="text-slate-800">{trustedContact.name}</strong> • 10-15s wait on new contacts • Shield required for &gt;₹5,000 or after 10 PM
            </span>
          </div>

          {isSafeMode && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Restricted Mode Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
