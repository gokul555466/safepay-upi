import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, TrustedContact, Payee, Transaction, RiskFlag } from './models';
import { mockUser, mockTrustedContacts, mockPayees, mockTransactions } from "../data/mockData";
interface AppState {
  user: User;
  trustedContacts: TrustedContact[];
  payees: Payee[];
  transactions: Transaction[];
  riskFlags: RiskFlag[];
  balance: number;
}

interface AppContextType extends AppState {
  addTransaction: (transaction: Transaction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: mockUser,
    trustedContacts: mockTrustedContacts,
    payees: mockPayees,
    transactions: mockTransactions,
    riskFlags: [],
    balance: 45000.50, // Starting mock balance
  });

  const addTransaction = (transaction: Transaction) => {
    setState((prev) => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
      balance: prev.balance - transaction.amount,
    }));
  };

  return (
    <AppContext.Provider value={{ ...state, addTransaction }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
