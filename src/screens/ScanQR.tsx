import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';

const ScanQR: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Scan QR Code</h2>
        <button onClick={() => navigate('/')} className="secondary" style={{ width: 'auto', padding: '0.5rem' }}>
          <X size={24} />
        </button>
      </div>

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
        {/* Placeholder for camera viewfinder */}
        <div style={{
          width: '250px',
          height: '250px',
          border: '4px dashed var(--primary-color)',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(250, 204, 21, 0.1)'
        }}>
          <Camera size={64} color="var(--primary-color)" opacity={0.5} />
        </div>
        
        <p style={{ marginTop: '2rem', color: '#aaa', textAlign: 'center', padding: '0 2rem' }}>
          Align the QR code within the frame to scan.
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
          Upload from Gallery
        </button>
      </div>
    </div>
  );
};

export default ScanQR;
