import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import './styles/Global.css';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;