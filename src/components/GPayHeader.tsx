import React from 'react';
import { Search, QrCode } from 'lucide-react';
import { User, TrustedContact } from '../types';

interface GPayHeaderProps {
  user: User;
  trustedContact: TrustedContact;
  isSafeMode: boolean;
  onToggleSafeMode: () => void;
  simulatedTimeHour: number;
  onToggleTimeSimulation: () => void;
  isLargeText: boolean;
  onToggleTextSize: () => void;
  onOpenScan: () => void;
  onOpenSearch: () => void;
}

export const GPayHeader: React.FC<GPayHeaderProps> = ({
  user,
  trustedContact,
  isSafeMode,
  onToggleSafeMode,
  simulatedTimeHour,
  onToggleTimeSimulation,
  isLargeText,
  onToggleTextSize,
  onOpenScan,
  onOpenSearch,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-4 py-2.5 shadow-xs">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
        {/* Google Pay style search bar */}
        <div
          onClick={onOpenSearch}
          className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-600 rounded-full cursor-pointer transition-colors border border-slate-200/60"
          role="search"
          aria-label="Pay friends and merchants"
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
            Pay friends and merchants
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenScan();
            }}
            title="Scan any UPI QR"
            className="ml-auto p-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar (Classic Google Pay circular user avatar) */}
        <div
          title={`${user.name} • UPI: ${user.upiId}`}
          className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-blue-100 shrink-0 cursor-pointer"
        >
          AK
        </div>
      </div>
    </header>
  );
};
