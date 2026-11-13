import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';

// No <StrictMode>: the scenes own long-lived GSAP timelines and pointer trails that are set up
// once per mount, and StrictMode's dev-only double mount would duplicate them.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
