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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
//<DashboardForm />
