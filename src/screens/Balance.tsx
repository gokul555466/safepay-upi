import React from 'react';
import { useAppContext } from '../store/AppContext';

const Balance: React.FC = () => {
  const { balance, transactions, payees } = useAppContext();

  // Get the last 3 transactions
  const recentTransactions = transactions.slice(0, 3);

  const getPayeeName = (payeeId: string) => {
    const payee = payees.find(p => p.id === payeeId);
    return payee ? payee.name : 'Unknown';
  };

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2 style={{ color: '#888', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Balance</h2>
        <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', color: 'var(--primary-color)' }}>
          ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h1>
      </div>

      <div className="card">
        <h3>Recent Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentTransactions.map(tx => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>Paid {getPayeeName(tx.payee_id)}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>
                  {new Date(tx.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                -₹{tx.amount}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button className="secondary" style={{ width: '100%' }}>View All History</button>
        </div>
      </div>
    </div>
  );
};

export default Balance;
