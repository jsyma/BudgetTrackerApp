import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AddExpense from './AddExpense';
import ViewMonthlyExpenses from './ViewMonthlyExpenses';
import ViewAllExpenses from './ViewAllExpenses';

const AppRoutes = ({ token, onLogin, onLogout }) => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage onLogin={onLogin} />} />
        {token ? (
          <>
            <Route path='/add-expenses' element={<AddExpense token={token} onLogout={onLogout}/>} />
            <Route path='/view-expenses' element={<ViewMonthlyExpenses token={token} onLogout={onLogout} />} />
            <Route path='/view-all-expenses' element={<ViewAllExpenses token={token}/>} onLogout={onLogout} />
          </>
        ) : (
          <Route path='*' element={<Navigate to='/' replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
