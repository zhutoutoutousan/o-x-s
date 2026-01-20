import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GamificationProvider } from './context/GamificationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GamificationProvider>
      <App />
    </GamificationProvider>
  </React.StrictMode>
);
