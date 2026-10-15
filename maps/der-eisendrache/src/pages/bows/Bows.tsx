import React from 'react';
import { Outlet } from 'react-router-dom';
import BowNav from '../../components/BowNav';
import '../../styles/pages/Bows.css';

const Bows: React.FC = () => (
  <div className="bows-page">
    <BowNav />
    <Outlet />
  </div>
);

export default Bows;
