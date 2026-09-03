import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { evaluateTransaction } from '../utils/riskEngine';

type Step = 'input' | 'confirm_name' | 'amount';

const PayToNumber: React.FC = () => {
  const navigate = useNavigate();
  const { payees, transactions, addTransaction } = useAppContext();

  const [step, setStep] = useState<Step>('input');
  const [inputValue, setInputValue] = useState('');
  const [matchedPayee, setMatchedPayee] = useState<any>(null);
  const [amount, setAmount] = useState('');

  const handleNextFromInput = () => {
    if (!inputValue) return;

    // Mock lookup: find payee by phone/UPI or just pick the first one if not found
    // For simplicity, we just look if it matches 'kirana@upi' or something, else random
    const found = payees.find(p => p.upi_id === inputValue || p.id === inputValue) || payees[0];
    setMatchedPayee(found);
    setStep('confirm_name');
  };

  const handleConfirmName = () => {
    setStep('amount');
  };

  const handlePay = () => {
    if (!amount || isNaN(Number(amount))) return;

    const userHistory = transactions.filter(t => t.user_id === 'u1');
    const transactionToEval = {
      id: `t_${Date.now()}`,
      user_id: 'u1',
      payee_id: matchedPayee.id,
      amount: Number(amount),
      timestamp: new Date().toISOString(),
      status: 'completed' as const
    };

    // Simulate user typing a name differently from the registered payee name
    // If they typed something that isn't a UPI id (no '@'), pass it as typedName
    const typedName = !inputValue.includes('@') && isNaN(Number(inputValue)) ? inputValue : undefined;

    const riskResult = evaluateTransaction({
      transaction: transactionToEval,
      userHistory,
      payee: matchedPayee,
      typedName
    });

    console.log('--- RISK ENGINE OUTPUT (PAY TO NUMBER) ---');
    console.log('Transaction:', transactionToEval);
    console.log('Score:', riskResult.totalScore);
    console.log('Tier:', riskResult.tier);
    console.log('Flags:', riskResult.flags);
    console.log('Rules Triggered:', riskResult.rulesTriggered);
    console.log('------------------------------------------');

    addTransaction({
      ...transactionToEval,
      tier: riskResult.tier as any,
      flags: riskResult.flags
    });

    navigate('/');
  };

  return (
    <div>
      <h2>Pay to Phone or UPI ID</h2>

      {step === 'input' && (
        <div className="card">
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>
            Enter Mobile Number or UPI ID
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 9876543210 or name@upi"
            autoFocus
          />
          <button
            onClick={handleNextFromInput}
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.2rem' }}
            disabled={!inputValue}
          >
            Continue <ArrowRight size={20} />
          </button>
        </div>
      )}

      {step === 'confirm_name' && matchedPayee && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '40px',
              backgroundColor: 'var(--primary-color)', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1rem auto'
            }}>
              {matchedPayee.name.charAt(0)}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{matchedPayee.name}</h3>
            <p style={{ color: '#aaa' }}>{matchedPayee.upi_id}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success-color)', marginTop: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>Banking Name Verified</span>
            </div>
          </div>

          <button onClick={handleConfirmName} style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}>
            Yes, this is correct
          </button>
          <button onClick={() => setStep('input')} className="secondary" style={{ width: '100%', marginTop: '1rem' }}>
            No, go back
          </button>
        </div>
      )}

      {step === 'amount' && matchedPayee && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>Paying <strong>{matchedPayee.name}</strong></p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '2rem' }}>
            <span>₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              style={{ fontSize: '3rem', width: '200px', backgroundColor: 'transparent', border: 'none', color: 'var(--primary-color)', textAlign: 'left', padding: '0', paddingLeft: '0.5rem' }}
              autoFocus
            />
          </div>

          <button onClick={handlePay} style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}>
            Pay Securely
          </button>
        </div>
      )}
    </div>
  );
};

export default PayToNumber;
