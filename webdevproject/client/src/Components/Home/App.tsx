import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from '../Login/Login';
import { Homepage } from './Homepage';
import { DashboardForm } from '../Dashboard/Dashboard';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/homepage" element={<Homepage backToHome={() => console.log("Back to login")} />} />
        <Route path="/login" element={<LoginForm navigate={undefined} />} />
        <Route path="/dashboard" element={<DashboardForm/>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
  );
};

export default App;

