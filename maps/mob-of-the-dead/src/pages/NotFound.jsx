// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => (
  <main className="notfound-page">
    <h2>404 — Page Not Found</h2>
    <p>Looks like you’ve taken a wrong turn in the afterlife.</p>
    <Link to="/">Return to Overview</Link>
  </main>
);

export default NotFound;
