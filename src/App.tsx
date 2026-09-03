import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Navigation from './components/Navigation';

// Screens
import Balance from './screens/Balance';
import ScanQR from './screens/ScanQR';
import PayToNumber from './screens/PayToNumber';
import Bills from './screens/Bills';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="content">
          <Routes>
            <Route path="/" element={<Balance />} />
            <Route path="/scan" element={<ScanQR />} />
            <Route path="/pay" element={<PayToNumber />} />
            <Route path="/bills" element={<Bills />} />
          </Routes>
        </div>
        <Navigation />
      </Router>
    </AppProvider>
  );
};

export default App;
