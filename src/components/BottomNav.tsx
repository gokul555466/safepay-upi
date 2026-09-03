import React from 'react';
import { Wallet, QrCode, Phone, ReceiptText } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onSelectScreen }) => {
  const tabs = [
    { id: 'balance' as ScreenType, label: 'Balance', icon: Wallet },
    { id: 'scan' as ScreenType, label: 'Scan QR', icon: QrCode },
    { id: 'pay' as ScreenType, label: 'Pay to Number', icon: Phone },
    { id: 'bills' as ScreenType, label: 'Bills', icon: ReceiptText },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="bg-white border-t border-slate-200 fixed bottom-14 sm:bottom-12 inset-x-0 z-30 shadow-lg"
      aria-label="Main application navigation"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-4 px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onSelectScreen(tab.id)}
              className={`min-h-[52px] flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-extrabold bg-emerald-50/80'
                  : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] leading-none whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
