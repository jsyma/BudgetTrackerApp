import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import Navbar from './Navbar';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true);

  const handleRegisterClick = () => {
    setShowLogin(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <div className="d-flex flex-column vh-100 vw-100" style={{ backgroundColor: 'var(--primary-beige)' }}>
      <Navbar />
      <div className="form-container">
        <div className="button-container">
          <button
            className="options"
            onClick={handleLoginClick}
            style={{
              backgroundColor: showLogin ? 'var(--primary-green)' : 'var(--secondary-blue)',
              color: showLogin ? 'white' : 'black',
            }}
          >
            Login
          </button>
          <button
            className="options"
            onClick={handleRegisterClick}
            style={{
              backgroundColor: showLogin ? 'var(--secondary-blue)' : 'var(--primary-green)',
              color: showLogin ? 'black' : 'white',
            }}
          >
            Register
          </button>
        </div>
        <div style={{ marginBottom: '200px' }}>
          {showLogin ? <Login onLogin={onLogin} /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
