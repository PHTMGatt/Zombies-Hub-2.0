import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './app/App';
import '../../../shared/ui/tokens.css';
import './styles/global.css';
const reviewBuild = import.meta.env.VITE_REVIEW_HASH_ROUTER === 'true';
const Router = reviewBuild ? HashRouter : BrowserRouter;

// Offline support (public/sw.js): a guide opened once keeps working on a bad connection. Production only,
// after load so it never competes with the first paint.
if (import.meta.env.PROD && !reviewBuild && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
