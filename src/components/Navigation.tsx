import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, QrCode, Phone, FileText } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <Home size={24} />
        <span>Balance</span>
      </NavLink>
      <NavLink to="/scan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <QrCode size={24} />
        <span>Scan QR</span>
      </NavLink>
      <NavLink to="/pay" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Phone size={24} />
        <span>Pay</span>
      </NavLink>
      <NavLink to="/bills" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileText size={24} />
        <span>Bills</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
