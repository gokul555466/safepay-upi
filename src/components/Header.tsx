import React from 'react';
import { ShieldCheck, Moon, Sun, Heart, Volume2, Type } from 'lucide-react';
import { User, TrustedContact } from '../types';

interface HeaderProps {
  user: User;
  trustedContact: TrustedContact;
  simulatedTimeHour: number;
  onToggleTimeSimulation: () => void;
  isLargeText: boolean;
  onToggleTextSize: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  trustedContact,
  simulatedTimeHour,
  onToggleTimeSimulation,
  isLargeText,
  onToggleTextSize,
}) => {
  const isLateNight = simulatedTimeHour >= 23 || simulatedTimeHour < 6;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & User Profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
                SafePay Mode
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-0.5 font-medium">
              {user.name} (Age 68) • Guarded by Priya
            </p>
          </div>
        </div>

        {/* Action controls: Time simulation toggle & Text size toggle */}
        <div className="flex items-center gap-1.5">
          {/* Time simulation button */}
          <button
            id="btn-toggle-time-simulation"
            type="button"
            onClick={onToggleTimeSimulation}
            title={
              isLateNight
                ? 'Currently Late-Night (02:00 AM). Click to switch to Daytime.'
                : 'Currently Daytime (02:30 PM). Click to switch to Late-Night.'
            }
            className={`min-h-[44px] px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
              isLateNight
                ? 'bg-purple-950 text-purple-200 border-purple-800 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            {isLateNight ? (
              <>
                <Moon className="w-4 h-4 text-purple-300" />
                <span>02:00 AM (Night)</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-600" />
                <span>02:30 PM (Day)</span>
              </>
            )}
          </button>

          {/* Text size accessibility toggle */}
          <button
            id="btn-toggle-accessibility-text"
            type="button"
            onClick={onToggleTextSize}
            title="Toggle Large Text for Accessibility"
            className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xs font-black transition-colors cursor-pointer ${
              isLargeText
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
