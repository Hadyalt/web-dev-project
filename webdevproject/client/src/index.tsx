import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './Components/Home/App.tsx';
import { DashboardForm } from './Components/Dashboard/Dashboard.tsx';
import { LoginForm } from './Components/Login/Login.tsx';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
