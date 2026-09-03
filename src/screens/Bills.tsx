import React from 'react';
import { Lightbulb, Droplets, Wifi, Tv, Flame } from 'lucide-react';

const mockBills = [
  { id: 'b1', name: 'Electricity', provider: 'State Electricity Board', amount: 1250, dueDate: '2024-09-10', icon: Lightbulb, color: '#fbbf24' },
  { id: 'b2', name: 'Water', provider: 'Municipal Corporation', amount: 320, dueDate: '2024-09-15', icon: Droplets, color: '#60a5fa' },
  { id: 'b3', name: 'Broadband', provider: 'FiberNet', amount: 999, dueDate: '2024-09-05', icon: Wifi, color: '#34d399' },
  { id: 'b4', name: 'DTH Cable', provider: 'Sky Vision', amount: 450, dueDate: '2024-09-20', icon: Tv, color: '#a78bfa' },
  { id: 'b5', name: 'Piped Gas', provider: 'City Gas Ltd', amount: 800, dueDate: '2024-09-25', icon: Flame, color: '#f87171' },
];

const Bills: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Pay Bills</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mockBills.map(bill => (
          <div key={bill.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '12px', 
              backgroundColor: `${bill.color}22`, color: bill.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <bill.icon size={28} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{bill.name}</h3>
              <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>{bill.provider}</p>
              <p style={{ margin: 0, color: 'var(--danger-color)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Due: {new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                ₹{bill.amount}
              </div>
              <button style={{ padding: '0.5rem 1rem', minHeight: 'auto' }}>Pay</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bills;
