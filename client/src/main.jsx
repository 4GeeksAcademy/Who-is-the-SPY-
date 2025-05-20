import React from 'react';  // Importa React correctamente
import ReactDOM from 'react-dom/client';  // Importa ReactDOM desde 'react-dom/client' para React 18
import './index.css';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Usa createRoot para React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);