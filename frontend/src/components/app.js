import React, { useState } from 'react';
import AppRoutes from './AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = () => {
  const [token, setToken] = useState('');

  const handleLogin = (token) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken('');
  }

  return (
    <div>
      <AppRoutes token={token} onLogin={handleLogin} onLogout={handleLogout} />
    </div>
  );
};

export default app;
