import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { evaluateTransaction } from '../utils/riskEngine';

const ScanQR: React.FC = () => {
  const navigate = useNavigate();
  const { payees, transactions, addTransaction } = useAppContext();

  const [scannedPayee, setScannedPayee] = useState<any>(null);
  const [amount, setAmount] = useState('');

  const handleSimulateScan = () => {
    // Pick a mock payee to simulate scan success
    setScannedPayee(payees[1] || payees[0]);
  };

  const handlePay = () => {
    if (!amount || isNaN(Number(amount))) return;

    const userHistory = transactions.filter(t => t.user_id === 'u1');
    const transactionToEval = {
      id: `t_${Date.now()}`,
      user_id: 'u1',
      payee_id: scannedPayee.id,
      amount: Number(amount),
      timestamp: new Date().toISOString(),
      status: 'completed' as const
    };

    const riskResult = evaluateTransaction({
      transaction: transactionToEval,
      userHistory,
      payee: scannedPayee,
    });

    console.log('--- RISK ENGINE OUTPUT (SCANNED QR) ---');
    console.log('Transaction:', transactionToEval);
    console.log('Score:', riskResult.totalScore);
    console.log('Tier:', riskResult.tier);
    console.log('Flags:', riskResult.flags);
    console.log('Rules Triggered:', riskResult.rulesTriggered);
    console.log('---------------------------------------');

    addTransaction({
      ...transactionToEval,
      tier: riskResult.tier as any,
      flags: riskResult.flags
    });

    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Scan QR Code</h2>
        <button onClick={() => navigate('/')} className="secondary" style={{ width: 'auto', padding: '0.5rem' }}>
          <X size={24} />
        </button>
      </div>

      {!scannedPayee ? (
        <>
          <div style={{
            flex: 1,
            backgroundColor: '#222',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '250px',
              height: '250px',
              border: '4px dashed var(--primary-color)',
              borderRadius: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(250, 204, 21, 0.1)',
              cursor: 'pointer'
            }} onClick={handleSimulateScan}>
              <Camera size={64} color="var(--primary-color)" opacity={0.5} />
            </div>

            <p style={{ marginTop: '2rem', color: '#aaa', textAlign: 'center', padding: '0 2rem' }}>
              Align the QR code within the frame to scan. <br />(Click camera to simulate scan)
            </p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
              Upload from Gallery
            </button>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>Paying <strong>{scannedPayee.name}</strong></p>

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

export default ScanQR;
